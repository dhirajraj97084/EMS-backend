const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@ems.com',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin'
  },
  {
    username: 'manager',
    email: 'manager@ems.com',
    password: 'manager123',
    firstName: 'John',
    lastName: 'Manager',
    role: 'manager'
  },
  {
    username: 'employee',
    email: 'employee@ems.com',
    password: 'employee123',
    firstName: 'Jane',
    lastName: 'Employee',
    role: 'employee'
  }
];

const sampleEmployees = [
  {
    employeeId: 'EMP001',
    department: 'IT',
    position: 'Software Developer',
    salary: 75000,
    phoneNumber: '+1234567890',
    address: {
      street: '123 Tech Street',
      city: 'Tech City',
      state: 'TC',
      zipCode: '12345',
      country: 'USA'
    },
    skills: ['JavaScript', 'React', 'Node.js'],
    status: 'active'
  },
  {
    employeeId: 'EMP002',
    department: 'HR',
    position: 'HR Specialist',
    salary: 60000,
    phoneNumber: '+1234567891',
    address: {
      street: '456 HR Avenue',
      city: 'HR City',
      state: 'HR',
      zipCode: '12346',
      country: 'USA'
    },
    skills: ['Recruitment', 'Employee Relations', 'HRIS'],
    status: 'active'
  },
  {
    employeeId: 'EMP003',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 65000,
    phoneNumber: '+1234567892',
    address: {
      street: '789 Finance Blvd',
      city: 'Finance City',
      state: 'FC',
      zipCode: '12347',
      country: 'USA'
    },
    skills: ['Financial Analysis', 'Excel', 'Accounting'],
    status: 'active'
  }
];

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing data');
    
    // Create users first
    const createdUsers = [];
    for (const userData of sampleUsers) {
      try {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.username} (${user.email})`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.username}:`, error.message);
        throw error;
      }
    }
    
    console.log(`\n📊 Created ${createdUsers.length} users successfully`);
    
    // Create employees and link to users (skip admin user for employees)
    const employeeUsers = createdUsers.filter(user => user.role !== 'admin');
    const managerUser = createdUsers.find(user => user.role === 'manager');
    
    // Only create employees for the available non-admin users
    const maxEmployees = Math.min(sampleEmployees.length, employeeUsers.length);
    
    for (let i = 0; i < maxEmployees; i++) {
      try {
        const employeeData = {
          ...sampleEmployees[i],
          user: employeeUsers[i]._id, // Link to non-admin user
          manager: managerUser._id // Set manager as manager user
        };
        
        const employee = new Employee(employeeData);
        await employee.save();
        console.log(`✅ Created employee: ${employee.employeeId} (${employee.position})`);
      } catch (error) {
        console.error(`❌ Failed to create employee ${sampleEmployees[i].employeeId}:`, error.message);
        throw error;
      }
    }
    
    console.log(`\n📊 Created ${maxEmployees} employees successfully`);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('👑 Admin: admin@ems.com / admin123');
    console.log('👔 Manager: manager@ems.com / manager123');
    console.log('👤 Employee: employee@ems.com / employee123');
    console.log('\n💡 You can now login to your EMS system!');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    try {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing connection:', closeError.message);
    }
  }
}

// Run setup
setupDatabase();
