const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees with pagination and filters
// @access  Private (admin, manager)
router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { department, status, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    const employees = await Employee.find(filter)
      .populate('user', 'firstName lastName email username role')
      .populate('manager', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Employee.countDocuments(filter);
    
    res.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('user', 'firstName lastName email username role')
      .populate('manager', 'firstName lastName');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Check if user can access this employee
    if (req.user.role === 'employee' && req.user._id.toString() !== employee.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message
    });
  }
});

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (admin, manager)
router.post('/', auth, authorize('admin', 'manager'), [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('department').isIn(['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Engineering']).withMessage('Invalid department'),
  body('position').notEmpty().withMessage('Position is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('userId').notEmpty().withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    const { employeeId, userId, department, position, salary, phoneNumber, address, emergencyContact, skills, education, experience, manager } = req.body;
    
    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Create employee
    const employee = new Employee({
      employeeId,
      user: userId,
      department,
      position,
      salary,
      phoneNumber,
      address,
      emergencyContact,
      skills,
      education,
      experience,
      manager
    });
    
    await employee.save();
    
    const populatedEmployee = await Employee.findById(employee._id)
      .populate('user', 'firstName lastName email username role')
      .populate('manager', 'firstName lastName');
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: populatedEmployee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (admin, manager, or self)
router.put('/:id', auth, [
  body('department').optional().isIn(['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Engineering']).withMessage('Invalid department'),
  body('salary').optional().isNumeric().withMessage('Salary must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'employee' && req.user._id.toString() !== employee.user.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email username role')
     .populate('manager', 'firstName lastName');
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    await Employee.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message
    });
  }
});

// @route   GET /api/employees/departments/stats
// @desc    Get department statistics
// @access  Private (admin, manager)
router.get('/departments/stats', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' },
          totalSalary: { $sum: '$salary' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department statistics',
      error: error.message
    });
  }
});

module.exports = router;
