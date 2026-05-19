// ─────────────────────────────────────────────────────────────
//  Seed Script — run once: node seed.js
//  Creates demo users, services, staff and sample bookings
// ─────────────────────────────────────────────────────────────
require("dotenv").config();
const mongoose = require("mongoose");
const { User, Service, Staff, Booking } = require("./models");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Wipe existing data
  await Promise.all([User.deleteMany(), Service.deleteMany(), Staff.deleteMany(), Booking.deleteMany()]);
  console.log("🗑  Cleared existing data");

  // ── Users ──
  const admin = await User.create({ name: "Admin User",  email: "admin@demo.com", password: "admin123", role: "admin",    phone: "050-0000002" });
  const user1 = await User.create({ name: "יוסף אחמד",  email: "user@demo.com",  password: "123456",   role: "customer", phone: "050-1234567" });
  const user2 = await User.create({ name: "ليلى محمود", email: "layla@demo.com", password: "123456",   role: "customer", phone: "052-9876543" });
  console.log("👤 Users created");

  // ── Services ──
  const [s1,s2,s3,s4,s5,s6] = await Service.insertMany([
    { icon:"✂️",  nameAr:"حلاقة شعر",   nameHe:"תספורת",       duration:45, price:120 },
    { icon:"🪒",  nameAr:"تصفيف لحية",  nameHe:"עיצוב זקן",    duration:30, price:80  },
    { icon:"💈",  nameAr:"حلاقة كاملة", nameHe:"תספורת + זקן", duration:60, price:180 },
    { icon:"💅",  nameAr:"مانيكير",      nameHe:"מניקור",       duration:50, price:150 },
    { icon:"🧖",  nameAr:"علاج الوجه",  nameHe:"טיפול פנים",   duration:75, price:220 },
    { icon:"💇",  nameAr:"صبغة شعر",    nameHe:"צביעת שיער",   duration:90, price:280 },
  ]);
  console.log("✂️  Services created");

  // ── Staff ──
  const [st1,st2,st3] = await Staff.insertMany([
    { nameAr:"أحمد محمود",  nameHe:"אחמד מחמוד",  avatar:"👨‍🦱", rating:4.9 },
    { nameAr:"سارة علي",    nameHe:"שרה עלי",      avatar:"👩‍🦰", rating:4.8 },
    { nameAr:"محمد خالد",   nameHe:"מוחמד חאלד",  avatar:"👨‍🦳", rating:4.7 },
  ]);
  console.log("👥 Staff created");

  // ── Sample Bookings ──
  const today = new Date().toISOString().slice(0,10);
  const tomorrow = new Date(Date.now()+86400000).toISOString().slice(0,10);
  const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);

  await Booking.insertMany([
    { user:user1._id, service:s1._id, staff:st1._id, date:today,     time:"10:30", status:"confirmed", bookingId:"BK-10001" },
    { user:user1._id, service:s4._id, staff:st2._id, date:tomorrow,  time:"14:00", status:"pending",   bookingId:"BK-10002" },
    { user:user1._id, service:s3._id, staff:st3._id, date:tomorrow,  time:"11:30", status:"confirmed", bookingId:"BK-10003" },
    { user:user1._id, service:s2._id, staff:st1._id, date:yesterday, time:"09:00", status:"cancelled", bookingId:"BK-10004" },
    { user:user2._id, service:s5._id, staff:st2._id, date:today,     time:"16:00", status:"confirmed", bookingId:"BK-10005" },
    { user:user2._id, service:s6._id, staff:st3._id, date:tomorrow,  time:"13:00", status:"pending",   bookingId:"BK-10006" },
  ]);
  console.log("📅 Sample bookings created");

  console.log("\n✅ Seed complete!");
  console.log("   Admin:    admin@demo.com  / admin123");
  console.log("   Customer: user@demo.com   / 123456");
  console.log("   Customer: layla@demo.com  / 123456\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
