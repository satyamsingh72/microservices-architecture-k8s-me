const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
  {
    name: 'Neon Horizon: 2099',
    description: 'Cyberpunk open-world RPG.',
    price: 59.99,
    category: 'Action RPG',
    imageUrl: 'https://picsum.photos/seed/neon-horizon/1200/800'
  },
  {
    name: 'Rift Guardians',
    description: 'Team-based shooter.',
    price: 39.99,
    category: 'FPS',
    imageUrl: 'https://picsum.photos/seed/rift-guardians/1200/800'
  },
  {
    name: 'Astral Odyssey',
    description: 'Space strategy game.',
    price: 49.99,
    category: 'Strategy',
    imageUrl: 'https://picsum.photos/seed/astral-odyssey/1200/800'
  },
  {
    name: 'Shadow Protocol',
    description: 'Stealth-action thriller.',
    price: 29.99,
    category: 'Stealth',
    imageUrl: 'https://picsum.photos/seed/shadow-protocol/1200/800'
  },
  {
    name: 'Mythos: Reborn',
    description: 'Mythology hack-and-slash.',
    price: 44.99,
    category: 'Action',
    imageUrl: 'https://picsum.photos/seed/mythos-reborn/1200/800'
  },
  {
    name: 'Chrono Rift: Arena',
    description: 'Arena battler.',
    price: 19.99,
    category: 'Indie MOBA',
    imageUrl: 'https://picsum.photos/seed/chrono-rift/1200/800'
  },
  {
    name: 'Velocity X',
    description: 'Futuristic racing.',
    price: 34.99,
    category: 'Racing',
    imageUrl: 'https://picsum.photos/seed/velocity-x/1200/800'
  },
  {
    name: 'Dungeon Realms',
    description: 'Dungeon crawler RPG.',
    price: 24.99,
    category: 'RPG',
    imageUrl: 'https://picsum.photos/seed/dungeon-realms/1200/800'
  },
  {
    name: 'BattleForge Legends',
    description: 'Fantasy MMO battles.',
    price: 59.99,
    category: 'MMO',
    imageUrl: 'https://picsum.photos/seed/battleforge/1200/800'
  },
  {
    name: 'Skyfront Siege',
    description: 'Air combat strategy.',
    price: 42.99,
    category: 'Strategy',
    imageUrl: 'https://picsum.photos/seed/skyfront/1200/800'
  },
  {
    name: 'Pixel Raiders',
    description: 'Retro platformer.',
    price: 14.99,
    category: 'Platformer',
    imageUrl: 'https://picsum.photos/seed/pixel-raiders/1200/800'
  },
  {
    name: 'Survival Instinct',
    description: 'Open-world survival.',
    price: 39.99,
    category: 'Survival',
    imageUrl: 'https://picsum.photos/seed/survival-instinct/1200/800'
  },
  {
    name: 'Zombie Outbreak X',
    description: 'Zombie survival horror.',
    price: 29.99,
    category: 'Horror',
    imageUrl: 'https://picsum.photos/seed/zombie-outbreak/1200/800'
  },
  {
    name: 'Galaxy Traders',
    description: 'Space trading sim.',
    price: 27.99,
    category: 'Simulation',
    imageUrl: 'https://picsum.photos/seed/galaxy-traders/1200/800'
  },
  {
    name: 'Cyber Drift',
    description: 'Neon racing.',
    price: 31.99,
    category: 'Racing',
    imageUrl: 'https://picsum.photos/seed/cyber-drift/1200/800'
  },
  {
    name: 'Warzone Elite',
    description: 'Modern warfare FPS.',
    price: 49.99,
    category: 'FPS',
    imageUrl: 'https://picsum.photos/seed/warzone-elite/1200/800'
  },
  {
    name: 'Magic Academy',
    description: 'Wizard training RPG.',
    price: 22.99,
    category: 'Fantasy RPG',
    imageUrl: 'https://picsum.photos/seed/magic-academy/1200/800'
  },
  {
    name: 'Island Tycoon',
    description: 'Island simulation.',
    price: 18.99,
    category: 'Simulation',
    imageUrl: 'https://picsum.photos/seed/island-tycoon/1200/800'
  },
  {
    name: 'Street Clash',
    description: 'Fighting game.',
    price: 25.99,
    category: 'Fighting',
    imageUrl: 'https://picsum.photos/seed/street-clash/1200/800'
  },
  {
    name: 'Mech Titans',
    description: 'Robot battles.',
    price: 44.99,
    category: 'Action',
    imageUrl: 'https://picsum.photos/seed/mech-titans/1200/800'
  },
  {
    name: 'Deep Sea Explorer',
    description: 'Ocean adventure.',
    price: 21.99,
    category: 'Adventure',
    imageUrl: 'https://picsum.photos/seed/deep-sea/1200/800'
  },
  {
    name: 'Wild West Saga',
    description: 'Cowboy adventure.',
    price: 36.99,
    category: 'Adventure',
    imageUrl: 'https://picsum.photos/seed/wild-west/1200/800'
  },
  {
    name: 'Space Marines: Uprising',
    description: 'Sci-fi shooter.',
    price: 54.99,
    category: 'Shooter',
    imageUrl: 'https://picsum.photos/seed/space-marines/1200/800'
  },
  {
    name: 'Parkour Legends',
    description: 'Urban freerunning.',
    price: 19.99,
    category: 'Sports',
    imageUrl: 'https://picsum.photos/seed/parkour/1200/800'
  },
  {
    name: 'AI Overlord',
    description: 'AI strategy domination.',
    price: 33.99,
    category: 'Strategy',
    imageUrl: 'https://picsum.photos/seed/ai-overlord/1200/800'
  },
  {
    name: 'Monster Arena',
    description: 'Creature battles.',
    price: 28.99,
    category: 'RPG',
    imageUrl: 'https://picsum.photos/seed/monster-arena/1200/800'
  },
  {
    name: 'Frozen Kingdom',
    description: 'Snow survival.',
    price: 26.99,
    category: 'Survival',
    imageUrl: 'https://picsum.photos/seed/frozen-kingdom/1200/800'
  },
  {
    name: 'City Builder Pro',
    description: 'City simulation.',
    price: 45.99,
    category: 'Simulation',
    imageUrl: 'https://picsum.photos/seed/city-builder/1200/800'
  },
  {
    name: 'Battle Royale X',
    description: 'Multiplayer survival.',
    price: 0,
    category: 'Battle Royale',
    imageUrl: 'https://picsum.photos/seed/battle-royale/1200/800'
  },
  {
    name: 'Samurai Legacy',
    description: 'Feudal Japan combat.',
    price: 41.99,
    category: 'Action',
    imageUrl: 'https://picsum.photos/seed/samurai/1200/800'
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/microserviceProducts')
  .then(async () => {
    console.log('Nexus Seeder: Connected to MongoDB');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Nexus Seeder: Games seeded successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('Seeder Error:', err);
    process.exit(1);
  });
