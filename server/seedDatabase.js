require('dotenv').config();
const db = require('./models');

const sampleUsers = [
  { googleId: 'demo_user_1', email: 'demo1@inspira.com', firstName: 'Alex', lastName: 'Johnson' },
  { googleId: 'demo_user_2', email: 'demo2@inspira.com', firstName: 'Sarah', lastName: 'Williams' },
  { googleId: 'demo_user_3', email: 'demo3@inspira.com', firstName: 'Michael', lastName: 'Brown' },
  { googleId: 'demo_user_4', email: 'demo4@inspira.com', firstName: 'Emma', lastName: 'Davis' },
  { googleId: 'demo_user_5', email: 'demo5@inspira.com', firstName: 'James', lastName: 'Martinez' }
];

const samplePins = [
  // Nature & Landscapes
  { imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', title: 'Mountain Sunrise', description: 'Beautiful mountain landscape at sunrise', link: 'https://unsplash.com', userId: '1' },
  { imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', title: 'Forest Path', description: 'Misty forest trail in autumn', link: 'https://unsplash.com', userId: '2' },
  { imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', title: 'Desert Dunes', description: 'Golden sand dunes at sunset', link: 'https://unsplash.com', userId: '3' },
  { imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716', title: 'Ocean Waves', description: 'Crashing waves on rocky shore', link: 'https://unsplash.com', userId: '1' },
  { imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', title: 'Alpine Lake', description: 'Crystal clear mountain lake', link: 'https://unsplash.com', userId: '4' },

  // Architecture
  { imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b', title: 'Modern Architecture', description: 'Contemporary building design', link: 'https://unsplash.com', userId: '2' },
  { imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2', title: 'City Skyline', description: 'Urban skyline at dusk', link: 'https://unsplash.com', userId: '5' },
  { imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99', title: 'Historic Building', description: 'Classic European architecture', link: 'https://unsplash.com', userId: '3' },
  { imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', title: 'Glass Tower', description: 'Modern glass skyscraper', link: 'https://unsplash.com', userId: '1' },

  // Food & Drink
  { imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', title: 'Gourmet Dish', description: 'Beautifully plated restaurant meal', link: 'https://unsplash.com', userId: '4' },
  { imageUrl: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24', title: 'Fresh Breakfast', description: 'Healthy breakfast spread', link: 'https://unsplash.com', userId: '5' },
  { imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae', title: 'Coffee Art', description: 'Latte with beautiful foam art', link: 'https://unsplash.com', userId: '2' },
  { imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', title: 'Burger Delight', description: 'Juicy gourmet burger', link: 'https://unsplash.com', userId: '1' },

  // Art & Design
  { imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912', title: 'Abstract Art', description: 'Colorful abstract painting', link: 'https://unsplash.com', userId: '3' },
  { imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968', title: 'Minimalist Design', description: 'Clean minimalist interior', link: 'https://unsplash.com', userId: '4' },
  { imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f', title: 'Watercolor Splash', description: 'Vibrant watercolor artwork', link: 'https://unsplash.com', userId: '5' },

  // Fashion
  { imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', title: 'Street Fashion', description: 'Urban street style outfit', link: 'https://unsplash.com', userId: '2' },
  { imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', title: 'Casual Style', description: 'Comfortable casual wear', link: 'https://unsplash.com', userId: '1' },
  { imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b', title: 'Accessories', description: 'Fashionable accessories collection', link: 'https://unsplash.com', userId: '3' },

  // Technology
  { imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475', title: 'Tech Setup', description: 'Modern workspace tech setup', link: 'https://unsplash.com', userId: '5' },
  { imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', title: 'Programming', description: 'Code on multiple screens', link: 'https://unsplash.com', userId: '4' },
  { imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1', title: 'Gadgets', description: 'Latest tech gadgets', link: 'https://unsplash.com', userId: '2' },

  // Travel
  { imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', title: 'Paris Streets', description: 'Charming Parisian neighborhood', link: 'https://unsplash.com', userId: '1' },
  { imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', title: 'Tropical Beach', description: 'Paradise beach destination', link: 'https://unsplash.com', userId: '3' },
  { imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', title: 'Asian Temple', description: 'Ancient temple in Asia', link: 'https://unsplash.com', userId: '5' },

  // Fitness & Wellness
  { imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', title: 'Yoga Practice', description: 'Morning yoga session', link: 'https://unsplash.com', userId: '4' },
  { imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', title: 'Gym Workout', description: 'Strength training routine', link: 'https://unsplash.com', userId: '2' },

  // Pets & Animals
  { imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8', title: 'Cute Dog', description: 'Adorable golden retriever', link: 'https://unsplash.com', userId: '1' },
  { imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', title: 'Cat Nap', description: 'Peaceful sleeping cat', link: 'https://unsplash.com', userId: '3' },
  { imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5', title: 'Wild Life', description: 'Majestic wild animal', link: 'https://unsplash.com', userId: '5' },

  // Home Decor
  { imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', title: 'Cozy Living Room', description: 'Warm and inviting interior', link: 'https://unsplash.com', userId: '4' },
  { imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af', title: 'Modern Kitchen', description: 'Sleek kitchen design', link: 'https://unsplash.com', userId: '2' },
  { imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511', title: 'Bedroom Oasis', description: 'Peaceful bedroom retreat', link: 'https://unsplash.com', userId: '1' }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await db.sequelize.sync();
    console.log('✅ Database synced');

    // Create demo users
    console.log('👥 Creating demo users...');
    const users = await Promise.all(
      sampleUsers.map(user => db.User.findOrCreate({
        where: { googleId: user.googleId },
        defaults: user
      }))
    );
    console.log(`✅ Created ${users.length} demo users`);

    // Create pins
    console.log('📌 Creating sample pins...');
    const pins = await Promise.all(
      samplePins.map(pin => db.Pin.findOrCreate({
        where: { imageUrl: pin.imageUrl },
        defaults: pin
      }))
    );
    console.log(`✅ Created ${pins.length} sample pins`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
    Summary:
    - ${users.length} demo users created
    - ${pins.length} sample pins created
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
