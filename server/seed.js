const db = require('./models');

// Curated list of high-quality, diverse images from Unsplash
const PIN_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Beach
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', // Nature
  'https://images.unsplash.com/photo-1519681393798-38e43269d877?w=800&q=80', // Mountains
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80', // Mountains/Lake
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80', // Cat
  'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=800&q=80', // Banana
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80', // Nature
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', // Forest
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', // Woods
  'https://images.unsplash.com/photo-1501854140884-074bf6b243e7?w=800&q=80', // Beach/Sand
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', // Food
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', // Nature
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80', // Nature
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', // Food/Pancakes
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80', // Food/Sandwich
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80', // Food/French Toast
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', // Food/Pizza
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', // Travel/Nature
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', // Landscape
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', // Travel/Water
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80', // Landscape
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', // Nature/Bridge
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80', // Nature/Dark
  'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&q=80', // Nature/Trees
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Shoes
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', // Watch
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', // Headphones
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80', // Camera
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80', // Plants
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80', // Succulents
  'https://images.unsplash.com/photo-1463936575229-469941e2fe63?w=800&q=80', // Cat
  'https://images.unsplash.com/photo-1529778873920-4da4926a7071?w=800&q=80', // Dog
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80', // Cat
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80', // Cat
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80', // Dog
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80', // Dog
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80', // Dog
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1513721032312-6a18a42cf900?w=800&q=80'  // Portrait
];

const seed = async () => {
  try {
    // Sync database (force: true drops tables first)
    await db.sequelize.sync({ force: true });
    console.log('Database synced!');

    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        firstName: `User${i}`,
        lastName: `Test`,
        email: `user${i}@example.com`,
        googleId: `google_id_${i}`,
      });
    }

    const createdUsers = await db.User.bulkCreate(users);
    console.log('Users created!');

    const pins = [];
    createdUsers.forEach((user, index) => {
      // Create 4-8 pins per user for more density
      const numPins = Math.floor(Math.random() * 5) + 4;
      for (let j = 0; j < numPins; j++) {
        // Pick a random image from the list to avoid sequential repetition
        const randomImageIndex = Math.floor(Math.random() * PIN_IMAGES.length);
        pins.push({
          title: `Pin by ${user.firstName}`,
          description: `A curated pin by ${user.firstName}`,
          imageUrl: PIN_IMAGES[randomImageIndex],
          userId: user.id.toString(),
        });
      }
    });

    await db.Pin.bulkCreate(pins);
    console.log('Pins created!');

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
