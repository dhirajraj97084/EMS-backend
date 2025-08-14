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

// Sample employee data
const newEmployee = {
  employeeId: 'EMP004',
  department: 'Marketing',
  position: 'Marketing Specialist',
  salary: 55000,
  phoneNumber: '+1234567893',
  address: {
    street: '321 Marketing Street',
    city: 'Marketing City',
    state: 'MC',
    zipCode: '12348',
    country: 'USA'
  },
  skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
  status: 'active',
  hireDate: new Date('2024-01-15')
};

async function addEmployee() {
  try {
    console.log('🔧 Adding New Employee...\n');
    
    // First, find a user to link the employee to (non-admin user)
    const user = await User.findOne({ role: { $ne: 'admin' } });
    
    if (!user) {
      console.log('❌ No non-admin users found. Please create users first.');
      console.log('💡 Run: node setup.js to create sample users');
      return;
    }
    
    console.log(`📋 Linking employee to user: ${user.firstName} ${user.lastName} (${user.role})`);
    
    // Find manager user
    const manager = await User.findOne({ role: 'manager' });
    
    // Create employee with user and manager references
    const employeeData = {
      ...newEmployee,
      user: user._id,
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
    console.log(`- Status: ${employee.status}`);
    console.log(`- Linked to user: ${user.email}`);
    
  } catch (error) {
    console.error('\n❌ Failed to add employee:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 Employee ID already exists. Try a different ID.');
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
addEmployee();
