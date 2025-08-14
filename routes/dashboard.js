const express = require('express');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    let stats = {};
    
    // Basic counts
    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments({ isActive: true });
    
    stats.totalEmployees = totalEmployees;
    stats.totalUsers = totalUsers;
    
    // Role-based statistics
    if (req.user.role === 'admin' || req.user.role === 'manager') {
      const departmentStats = await Employee.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
            avgSalary: { $avg: '$salary' }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      const statusStats = await Employee.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const recentHires = await Employee.find({ status: 'active' })
        .populate('user', 'firstName lastName')
        .sort({ hireDate: -1 })
        .limit(5);
      
      stats.departmentStats = departmentStats;
      stats.statusStats = statusStats;
      stats.recentHires = recentHires;
    }
    
    // Employee-specific stats
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ user: req.user._id });
      if (employee) {
        stats.employeeInfo = {
          department: employee.department,
          position: employee.position,
          hireDate: employee.hireDate,
          salary: employee.salary
        };
      }
    }
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/employees/chart
// @desc    Get employee data for charts
// @access  Private (admin, manager)
router.get('/employees/chart', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const monthlyHires = await Employee.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$hireDate' },
            month: { $month: '$hireDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const departmentDistribution = await Employee.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const salaryRanges = await Employee.aggregate([
      { $match: { status: 'active' } },
      {
        $bucket: {
          groupBy: '$salary',
          boundaries: [0, 30000, 50000, 75000, 100000, 150000, 200000],
          default: 'Above 200k',
          output: {
            count: { $sum: 1 },
            employees: { $push: { name: '$user.firstName', salary: '$salary' } }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        monthlyHires,
        departmentDistribution,
        salaryRanges
      }
    });
  } catch (error) {
    console.error('Get employee chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/search
// @desc    Search employees and users
// @access  Private (admin, manager)
router.get('/search', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { query, type } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    let results = {};
    
    if (type === 'employees' || !type) {
      const employees = await Employee.find({
        $or: [
          { employeeId: { $regex: query, $options: 'i' } },
          { position: { $regex: query, $options: 'i' } },
          { department: { $regex: query, $options: 'i' } }
        ]
      })
      .populate('user', 'firstName lastName email')
      .limit(10);
      
      results.employees = employees;
    }
    
    if (type === 'users' || !type) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } }
        ]
      })
      .select('-password')
      .limit(10);
      
      results.users = users;
    }
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

module.exports = router;
