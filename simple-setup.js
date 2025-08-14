const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Simple admin user
const adminUser = {
  username: 'admin',
  email: 'admin@ems.com',
  password: 'admin123',
  firstName: 'System',
  lastName: 'Administrator',
  role: 'admin'
};

async function createAdminUser() {
  try {
    console.log('🔧 Creating Admin User...\n');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');
    
    // Create admin user
    const user = new User(adminUser);
    await user.save();
    console.log('✅ Admin user created successfully!');
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('👑 Admin: admin@ems.com / admin123');
    console.log('\n💡 You can now login to your EMS system!');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('Stack trace:', error.stack);
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
createAdminUser();
