const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Employee = require('./models/Employee');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// YOUR EMPLOYEE DATA - Using unique ID
const myEmployee = {
  employeeId: 'EMP008', // Changed from EMP006 to EMP008 (unique)
  department: 'IT', // Must be from allowed values
  position: 'Software Developer', // Fixed capitalization
  salary: 45000,
  phoneNumber: '+917633061405', // Fixed format (removed space)
  address: {
    street: 'Your Street',
    city: 'Your City',
    state: 'YC',
    zipCode: '12353',
    country: 'India' // Changed to India since phone is Indian
  },
  skills: ['JavaScript', 'React', 'Node.js', 'Software Development'],
  status: 'active',
  hireDate: new Date('2024-03-01')
};

async function addMyEmployee() {
  try {
    console.log('🔧 Adding Your Employee...\n');
    
    // First, check if users exist
    const users = await User.find({ role: { $ne: 'admin' } });
    
    if (users.length === 0) {
      console.log('❌ No non-admin users found. Please create users first.');
      console.log('💡 Run: node setup.js to create sample users');
      return;
    }
    
    console.log(`📋 Found ${users.length} non-admin users to link employee to`);
    
    // Find manager user
    const manager = await User.findOne({ role: 'manager' });
    
    // Create employee with user and manager references
    const employeeData = {
      ...myEmployee,
      user: users[0]._id, // Link to first non-admin user
      manager: manager ? manager._id : undefined
    };
    
    const employee = new Employee(employeeData);
    await employee.save();
    
    console.log('✅ Employee added successfully!');
    console.log('\n📊 Employee Details:');
    console.log(`- Employee ID: ${employee.employeeId}`);
    console.log(`- Position: ${employee.position}`);
    console.log(`- Department: ${employee.department}`);
    console.log(`- Salary: $${employee.salary.toLocaleString()}`);
    console.log(`- Phone: ${employee.phoneNumber}`);
    console.log(`- Status: ${employee.status}`);
    console.log(`- Linked to user: ${users[0].email}`);
    
    console.log('\n🎉 Your employee is now in the database!');
    console.log('💡 You can view them in your EMS dashboard');
    
  } catch (error) {
    console.error('\n❌ Failed to add employee:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 Employee ID already exists. Try a different ID.');
      console.error('💡 Available IDs: EMP009, EMP010, EMP011, etc.');
    }
    
    if (error.name === 'ValidationError') {
      console.error('💡 Validation error. Check your data format.');
      console.error('💡 Department must be: IT, HR, Finance, Marketing, Sales, Operations, Engineering');
      console.error('💡 Phone number must be in format: +1234567890');
    }
  } finally {
    try {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing connection:', closeError.message);
    }
  }
}

// Run the function
addMyEmployee();
