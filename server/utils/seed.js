const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Seeding sample data into database...');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});

    // 1. Create Users
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@houserent.com',
      password: 'admin123',
      role: 'Admin',
      phone: '+91 9876543210',
    });

    const owner1 = await User.create({
      name: 'Rajesh Sharma',
      email: 'owner1@houserent.com',
      password: 'owner123',
      role: 'Property Owner',
      phone: '+91 9811223344',
    });

    const owner2 = await User.create({
      name: 'Priya Patel',
      email: 'owner2@houserent.com',
      password: 'owner123',
      role: 'Property Owner',
      phone: '+91 9822334455',
    });

    const tenant1 = await User.create({
      name: 'Rahul Verma',
      email: 'tenant1@houserent.com',
      password: 'tenant123',
      role: 'Tenant',
      phone: '+91 9833445566',
    });

    const tenant2 = await User.create({
      name: 'Sneha Rao',
      email: 'tenant2@houserent.com',
      password: 'tenant123',
      role: 'Tenant',
      phone: '+91 9844556677',
    });

    console.log('[Seed] Created default users (Admin, 2 Owners, 2 Tenants)');

    // 2. Create Properties
    const propertiesData = [
      {
        owner: owner1._id,
        title: 'Luxury 3BHK Apartment in Indiranagar',
        description: 'Impeccably designed 3BHK flat featuring Italian marble flooring, modular kitchen with chimney, large balconies with tree-top views, covered parking, and 24x7 security.',
        location: 'Bangalore',
        address: '12th Main Road, Indiranagar, Bangalore - 560038',
        rent: 45000,
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 3,
        amenities: ['WiFi', 'Air Conditioning', 'Power Backup', 'Car Parking', 'Gym', 'Swimming Pool', 'Furnished', '24x7 Security'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Approved',
      },
      {
        owner: owner1._id,
        title: 'Modern 2BHK High-Rise Flat with Sea Breeze',
        description: 'Well-ventilated 2-bedroom home in Bandra West with contemporary interior decor, dedicated workstation area, high-speed fiber connectivity, and premium clubhouse access.',
        location: 'Mumbai',
        address: 'Carter Road, Bandra West, Mumbai - 400050',
        rent: 75000,
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['Air Conditioning', 'Car Parking', 'Elevator', 'Gym', '24x7 Security', 'Water Supply'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Approved',
      },
      {
        owner: owner1._id,
        title: 'Spacious 4BHK Villa with Private Garden',
        description: 'Magnificent independent villa in gated township. Features landscaped lawn, private terrace, servant quarter, solar water heating, and covered double garage.',
        location: 'Bangalore',
        address: 'Palm Meadows, Whitefield, Bangalore - 560066',
        rent: 85000,
        propertyType: 'Villa',
        bedrooms: 4,
        bathrooms: 4,
        amenities: ['Private Garden', 'Power Backup', 'Car Parking', 'Pet Friendly', 'Security Guard', 'Swimming Pool', 'Solar Water'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Approved',
      },
      {
        owner: owner2._id,
        title: 'Cozy 1BHK Studio Apartment near IT Park',
        description: 'Compact, fully furnished studio apartment ideal for software professionals. Walking distance from Cyber Towers, metro station, supermarkets, and cafes.',
        location: 'Hyderabad',
        address: 'Phase 2, Hitec City, Hyderabad - 500081',
        rent: 18000,
        propertyType: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['WiFi', 'Air Conditioning', 'Power Backup', 'Elevator', 'Furnished', '24x7 Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Approved',
      },
      {
        owner: owner2._id,
        title: 'Chic 2BHK Independent Floor in Prime Area',
        description: 'Serene second-floor home with ample natural light, wooden flooring in master bedroom, separate dining space, and reserved stilt parking.',
        location: 'Bangalore',
        address: '4th Block, Koramangala, Bangalore - 560034',
        rent: 34000,
        propertyType: 'Independent House',
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['WiFi', 'Car Parking', 'Water Supply', 'Balcony', 'Geyser'],
        images: [
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Approved',
      },
      {
        owner: owner2._id,
        title: 'Modern 3BHK Penthouse with Terrace Garden',
        description: 'Top-floor penthouse overlooking Pune airport runway views. Open terrace for weekend get-togethers, modular bar counter, and Italian fittings.',
        location: 'Pune',
        address: 'Symbiosis Road, Viman Nagar, Pune - 411014',
        rent: 42000,
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 3,
        amenities: ['Terrace Garden', 'Air Conditioning', 'Gym', 'Car Parking', 'Club House', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Approved',
      },
      {
        owner: owner1._id,
        title: 'Spacious 2BHK Duplex in Green Enclave (Pending Approval)',
        description: 'Brand new construction awaiting occupancy certificate verification. Two-level living room with skylight, energy-efficient LED lighting, and modular wardrobes.',
        location: 'Delhi NCR',
        address: 'Sector 62, Noida, Uttar Pradesh - 201309',
        rent: 26000,
        propertyType: 'Independent House',
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['Power Backup', 'Car Parking', '24x7 Security', 'Water Supply'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Pending', // Specifically left pending for Admin approval demo!
      },
      {
        owner: owner2._id,
        title: 'Budget-Friendly Single Room PG with Food',
        description: 'Cozy private room in premium PG for students and working bachelors. Includes 3 times home-cooked meals, daily housekeeping, RO water, and high-speed WiFi.',
        location: 'Bangalore',
        address: 'Outer Ring Road, BTM Layout 2nd Stage, Bangalore - 560076',
        rent: 9500,
        propertyType: 'PG/Hostel',
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['WiFi', 'Meals Included', 'Housekeeping', 'RO Water', 'CCTV Security', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        ],
        availability: true,
        approvalStatus: 'Approved',
      },
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`[Seed] Created ${createdProperties.length} realistic property listings.`);

    // 3. Create Sample Bookings
    const bookingsData = [
      {
        tenant: tenant1._id,
        property: createdProperties[0]._id, // Indiranagar
        owner: owner1._id,
        moveInDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        message: 'Hello Mr. Sharma, I am working at an MNC in Indiranagar. Would love to move in by next month with my family.',
        status: 'Approved',
        ownerNotes: 'Welcome! Verified tenant profile and rental terms agreed.',
      },
      {
        tenant: tenant2._id,
        property: createdProperties[1]._id, // Bandra West
        owner: owner1._id,
        moveInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        message: 'Looking for a 1-year lease starting mid next month. Is parking space included?',
        status: 'Pending',
      },
      {
        tenant: tenant1._id,
        property: createdProperties[3]._id, // Hitec City Studio
        owner: owner2._id,
        moveInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        message: 'Hi Priya, I have a project transfer to Hyderabad. Can I visit this weekend to see the place?',
        status: 'Pending',
      },
    ];

    const createdBookings = await Booking.insertMany(bookingsData);
    console.log(`[Seed] Created ${createdBookings.length} sample booking requests.`);
    console.log('[Seed] Database seeding completed successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};

// If run directly via node utils/seed.js
if (require.main === module) {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
  const connectDB = require('../config/db');

  const runStandaloneSeed = async () => {
    await connectDB();
    await seedDatabase();
    console.log('[Seed] Standalone seed complete. Exiting process.');
    process.exit(0);
  };

  runStandaloneSeed();
}

module.exports = { seedDatabase };
