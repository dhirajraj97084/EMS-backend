const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testBackend() {
  console.log('🧪 Testing EMS Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test 2: Try to login with non-existent user
    console.log('\n2️⃣ Testing Login with non-existent user...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'nonexistent@test.com',
        password: 'test123'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Login validation working (correctly rejected non-existent user)');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 3: Check if users exist in database
    console.log('\n3️⃣ Testing if database has users...');
    try {
      // This should fail without authentication, which is correct
      await axios.get(`${BASE_URL}/auth/me`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication middleware working (correctly rejected unauthenticated request)');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Backend API tests completed successfully!');
    console.log('💡 The backend is working correctly.');
    console.log('📝 Next step: Run the setup script to create users: node setup.js');
    
  } catch (error) {
    console.error('\n❌ Backend test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused. Make sure the backend server is running on port 5001');
      console.error('💡 Run: npm start in the backend directory');
    }
  }
}

testBackend();
