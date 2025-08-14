const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function debugLogin() {
  console.log('🔍 Debugging Login Functionality...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing Backend Connection...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend is running:', healthResponse.data);
    
    // Test 2: Check if users exist in database
    console.log('\n2️⃣ Testing User Creation...');
    try {
      // Try to create a test user first
      const testUser = {
        username: 'testadmin',
        email: 'testadmin@ems.com',
        password: 'test123',
        firstName: 'Test',
        lastName: 'Admin',
        role: 'admin'
      };
      
      const createResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Test user created:', createResponse.data);
      
      // Test 3: Try to login with the test user
      console.log('\n3️⃣ Testing Login with Test User...');
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'testadmin@ems.com',
        password: 'test123'
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Login successful!');
        console.log('User data:', loginResponse.data.data.user);
        console.log('Token received:', loginResponse.data.data.token ? 'YES' : 'NO');
        
        // Test 4: Test protected route with token
        console.log('\n4️⃣ Testing Protected Route Access...');
        const token = loginResponse.data.data.token;
        const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Protected route access successful:', profileResponse.data);
        
      } else {
        console.log('❌ Login failed:', loginResponse.data);
      }
      
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('ℹ️ Test user already exists, trying to login...');
        
        // Try to login with existing user
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: 'testadmin@ems.com',
          password: 'test123'
        });
        
        if (loginResponse.data.success) {
          console.log('✅ Login successful with existing user!');
        } else {
          console.log('❌ Login failed:', loginResponse.data);
        }
      } else {
        console.error('❌ Error during user creation/login:', error.response?.data || error.message);
      }
    }
    
    // Test 5: Try to login with the original admin credentials
    console.log('\n5️⃣ Testing Original Admin Login...');
    try {
      const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@ems.com',
        password: 'admin123'
      });
      
      if (adminLoginResponse.data.success) {
        console.log('✅ Original admin login successful!');
        console.log('Admin user data:', adminLoginResponse.data.data.user);
      } else {
        console.log('❌ Original admin login failed:', adminLoginResponse.data);
      }
      
    } catch (error) {
      console.error('❌ Original admin login error:', error.response?.data || error.message);
    }
    
    console.log('\n🎯 Debug Summary:');
    console.log('- Backend connection: ✅ Working');
    console.log('- Check the results above for specific issues');
    
  } catch (error) {
    console.error('\n❌ Debug failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused. Make sure the backend server is running on port 5001');
      console.error('💡 Run: npm start in the backend directory');
    }
  }
}

debugLogin();
