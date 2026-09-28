const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runVerificationTests = async () => {
  console.log('========================================================');
  console.log('🧪 Starting End-to-End Automated Validation for House Rent');
  console.log('========================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.data.status === 'OK', 'Server Health Check');

    // 2. Public Property Search & Filters
    const publicProps = await request('/properties');
    assert(publicProps.status === 200 && publicProps.data.properties.length > 0, 'Public Properties retrieval');

    const searchBangalore = await request('/properties?location=Bangalore');
    assert(
      searchBangalore.status === 200 &&
      searchBangalore.data.properties.every((p) => p.location.includes('Bangalore')),
      'Filter Properties by Location (Bangalore)'
    );

    // 3. Login Admin
    const adminLogin = await request('/auth/login', 'POST', {
      email: 'admin@houserent.com',
      password: 'admin123',
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'Admin', 'Admin Login');
    const adminToken = adminLogin.data.token;

    // 4. Login Owner
    const ownerLogin = await request('/auth/login', 'POST', {
      email: 'owner1@houserent.com',
      password: 'owner123',
    });
    assert(ownerLogin.status === 200 && ownerLogin.data.user.role === 'Property Owner', 'Owner Login');
    const ownerToken = ownerLogin.data.token;

    // 5. Login Tenant
    const tenantLogin = await request('/auth/login', 'POST', {
      email: 'tenant1@houserent.com',
      password: 'tenant123',
    });
    assert(tenantLogin.status === 200 && tenantLogin.data.user.role === 'Tenant', 'Tenant Login');
    const tenantToken = tenantLogin.data.token;

    // 6. Test Invalid Password
    const invalidLogin = await request('/auth/login', 'POST', {
      email: 'admin@houserent.com',
      password: 'wrongpassword',
    });
    assert(invalidLogin.status === 401, 'Rejection of invalid password credentials');

    // 7. Test Role Protection (Tenant trying to access Admin route)
    const unauthorizedAdminCall = await request('/admin/dashboard-stats', 'GET', null, tenantToken);
    assert(unauthorizedAdminCall.status === 403, 'Forbidden 403 for Tenant attempting Admin route');

    // 8. Owner lists a new property
    const newProperty = await request(
      '/properties',
      'POST',
      {
        title: 'Automated Test Luxury Villa',
        description: 'Testing end to end property listing workflow.',
        location: 'Pune',
        address: 'MG Road, Camp, Pune - 411001',
        rent: 55000,
        propertyType: 'Villa',
        bedrooms: 3,
        bathrooms: 3,
        amenities: ['WiFi', 'Power Backup', 'Gym'],
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
      },
      ownerToken
    );
    assert(
      newProperty.status === 201 &&
      newProperty.data.property.approvalStatus === 'Pending',
      'Owner posts property (status set to Pending for admin review)'
    );
    const testPropId = newProperty.data.property._id;

    // 9. Admin reviews and approves the property
    const adminApproval = await request(
      `/admin/properties/${testPropId}/review`,
      'PATCH',
      { approvalStatus: 'Approved' },
      adminToken
    );
    assert(
      adminApproval.status === 200 &&
      adminApproval.data.property.approvalStatus === 'Approved',
      'Admin approves pending property listing'
    );

    // 10. Tenant creates booking for the approved property
    const bookingRes = await request(
      '/bookings',
      'POST',
      {
        propertyId: testPropId,
        moveInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Hello, looking forward to leasing this home.',
      },
      tenantToken
    );
    assert(
      bookingRes.status === 201 &&
      bookingRes.data.booking.status === 'Pending',
      'Tenant submits booking request for approved property'
    );
    const bookingId = bookingRes.data.booking._id;

    // 11. Owner approves tenant's booking request
    const ownerBookingApproval = await request(
      `/bookings/${bookingId}/status`,
      'PATCH',
      { status: 'Approved' },
      ownerToken
    );
    assert(
      ownerBookingApproval.status === 200 &&
      ownerBookingApproval.data.booking.status === 'Approved',
      'Owner approves tenant booking request'
    );

    // 12. Admin dashboard statistics check
    const adminStats = await request('/admin/dashboard-stats', 'GET', null, adminToken);
    assert(
      adminStats.status === 200 &&
      adminStats.data.stats.users.total >= 5 &&
      adminStats.data.stats.properties.total >= 8,
      'Admin Dashboard analytics aggregation'
    );

    // 13. Owner deletes test property
    const deleteRes = await request(`/properties/${testPropId}`, 'DELETE', null, ownerToken);
    assert(deleteRes.status === 200, 'Owner deletes property listing');

    console.log('========================================================');
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('========================================================');

    if (failed === 0) {
      console.log('🎉 ALL SYSTEM MODULES & ROLES FUNCTIONING 100% PERFECTLY!');
    }
  } catch (err) {
    console.error('Test execution error:', err);
  }
};

runVerificationTests();
