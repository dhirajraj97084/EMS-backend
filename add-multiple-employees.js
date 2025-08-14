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

// Multiple employees to add
const newEmployees = [
  {
    employeeId: 'EMP005',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 45000,
    phoneNumber: '+1234567894',
    address: {
      street: '654 Sales Avenue',
      city: 'Sales City',
      state: 'SC',
      zipCode: '12349',
      country: 'USA'
    },
    skills: ['Sales', 'Customer Relations', 'CRM'],
    status: 'active',
    hireDate: new Date('2024-02-01')
  },
  {
    employeeId: 'EMP006',
    department: 'Engineering',
    position: 'DevOps Engineer',
    salary: 85000,
    phoneNumber: '+1234567895',
    address: {
      street: '987 Engineering Blvd',
      city: 'Engineering City',
      state: 'EC',
      zipCode: '12350',
      country: 'USA'
    },
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    status: 'active',
    hireDate: new Date('2024-01-20')
  },
  {
    employeeId: 'EMP007',
    department: 'Operations',
    position: 'Operations Manager',
    salary: 70000,
    phoneNumber: '+1234567896',
    address: {
      street: '147 Operations Street',
      city: 'Operations City',
      state: 'OC',
      zipCode: '12351',
      country: 'USA'
    },
    skills: ['Process Management', 'Team Leadership', 'Project Management'],
    status: 'active',
    hireDate: new Date('2024-02-15')
  }
];

async function addMultipleEmployees() {
  try {
    console.log('🔧 Adding Multiple Employees...\n');
    
    // Get all non-admin users
    const users = await User.find({ role: { $ne: 'admin' } });
    
    if (users.length === 0) {
      console.log('❌ No non-admin users found. Please create users first.');
      console.log('💡 Run: node setup.js to create sample users');
      return;
    }
    
    console.log(`📋 Found ${users.length} non-admin users to link employees to`);
    
    // Get manager user
    const manager = await User.findOne({ role: 'manager' });
    
    let successCount = 0;
    let failCount = 0;
    
    // Add employees
    for (let i = 0; i < newEmployees.length; i++) {
      try {
        const employeeData = {
          ...newEmployees[i],
          user: users[i % users.length]._id, // Cycle through available users
          manager: manager ? manager._id : undefined
        };
        
        const employee = new Employee(employeeData);
        await employee.save();
        
        console.log(`✅ Added: ${employee.employeeId} - ${employee.position} (${employee.department})`);
        successCount++;
        
      } catch (error) {
        console.log(`❌ Failed to add ${newEmployees[i].employeeId}: ${error.message}`);
        failCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added: ${successCount} employees`);
    console.log(`❌ Failed to add: ${failCount} employees`);
    
    if (successCount > 0) {
      console.log('\n🎉 Employees added successfully!');
      console.log('💡 You can now view them in your EMS dashboard');
    }
    
  } catch (error) {
    console.error('\n❌ Failed to add employees:', error.message);
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
addMultipleEmployees();
