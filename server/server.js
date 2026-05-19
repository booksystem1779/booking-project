// ============================================================
//  Booking System — Express + MongoDB Server
//  Setup:
//    1. npm install
//    2. Set MONGO_URI in .env
//    3. node seed.js   (first time only — loads demo data)
//    4. node server.js
// ============================================================
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const jwt      = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User, Service, Staff, Booking } = require("./models");

const app    = express();
const PORT   = process.env.PORT   || 4000;
const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

app.use(cors());
app.use(express.json());

// ── CONNECT TO MONGODB ────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected:", process.env.MONGO_URI))
  .catch(e  => { console.error("❌ MongoDB connection failed:", e.message); process.exit(1); });

// ── JWT HELPERS ───────────────────────────────────────────────
function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "7d" });
}

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(header.replace("Bearer ", ""), SECRET);
    const user    = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}

// ── POPULATE BOOKING helper ───────────────────────────────────
const POPULATE = [
  { path:"user",    select:"name email phone" },
  { path:"service", select:"nameAr nameHe icon duration price" },
  { path:"staff",   select:"nameAr nameHe avatar rating" },
];

// ════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ token: signToken(user), user: user.toSafe() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing required fields" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const user = await User.create({ name, email, password, phone: phone || "" });
    res.status(201).json({ token: signToken(user), user: user.toSafe() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json(req.user.toSafe ? req.user.toSafe() : req.user);
});

// ════════════════════════════════════════════════════════════
//  SERVICES
// ════════════════════════════════════════════════════════════
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ createdAt: 1 });
    res.json(services);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/services", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { nameAr, nameHe, icon, duration, price } = req.body;
    if (!nameAr || !nameHe || !duration || !price) return res.status(400).json({ error: "Missing fields" });
    const service = await Service.create({ nameAr, nameHe, icon: icon || "✂️", duration: +duration, price: +price });
    res.status(201).json(service);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/services/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/services/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
//  STAFF
// ════════════════════════════════════════════════════════════
app.get("/api/staff", async (req, res) => {
  try {
    const staff = await Staff.find({ active: true }).sort({ createdAt: 1 });
    res.json(staff);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/staff", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { nameAr, nameHe, avatar } = req.body;
    if (!nameAr || !nameHe) return res.status(400).json({ error: "Missing fields" });
    const member = await Staff.create({ nameAr, nameHe, avatar: avatar || "👤" });
    res.status(201).json(member);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/staff/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const member = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: "Staff member not found" });
    res.json(member);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/staff/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Staff.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
//  BOOKINGS
// ════════════════════════════════════════════════════════════

// Admin — get all bookings with filters
app.get("/api/admin/bookings", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, date, staffId } = req.query;
    const filter = {};
    if (status)  filter.status  = status;
    if (date)    filter.date    = date;
    if (staffId) filter.staff   = staffId;
    const bookings = await Booking.find(filter).populate(POPULATE).sort({ date: -1, time: -1 });
    res.json(bookings);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Customer — get my bookings
app.get("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(POPULATE).sort({ date: -1, time: -1 });
    res.json(bookings);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create booking
app.post("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const { serviceId, staffId, date, time, notes } = req.body;
    if (!serviceId || !date || !time) return res.status(400).json({ error: "Missing fields" });

    // Check slot conflict
    if (staffId) {
      const conflict = await Booking.findOne({ staff: staffId, date, time, status: { $ne: "cancelled" } });
      if (conflict) return res.status(409).json({ error: "Time slot already booked" });
    }

    const booking = await Booking.create({
      user: req.user._id, service: serviceId,
      staff: staffId || null, date, time,
      status: "pending", notes: notes || "",
    });

    const populated = await booking.populate(POPULATE);
    res.status(201).json(populated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin — update booking (status, notes, etc.)
app.put("/api/admin/bookings/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(POPULATE);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Customer — cancel own booking
app.put("/api/bookings/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "cancelled" },
      { new: true }
    ).populate(POPULATE);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin — delete booking permanently
app.delete("/api/admin/bookings/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
//  USERS (admin)
// ════════════════════════════════════════════════════════════
app.get("/api/admin/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users.map(u => u.toSafe()));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ error: "Cannot delete yourself" });
    await User.findByIdAndDelete(req.params.id);
    await Booking.deleteMany({ user: req.params.id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
//  DASHBOARD STATS
// ════════════════════════════════════════════════════════════
app.get("/api/admin/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [total, todayCount, confirmed, pending, cancelled, clientCount, staffCount, confirmedBookings] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ date: today }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "cancelled" }),
      User.countDocuments({ role: "customer" }),
      Staff.countDocuments({ active: true }),
      Booking.find({ status: "confirmed" }).populate("service", "price"),
    ]);

    const revenue = confirmedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);

    res.json({
      totalBookings: total,
      todayBookings: todayCount,
      confirmedBookings: confirmed,
      pendingBookings: pending,
      cancelledBookings: cancelled,
      revenue,
      totalClients: clientCount,
      totalStaff: staffCount,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
//  AVAILABLE SLOTS
// ════════════════════════════════════════════════════════════
app.get("/api/slots", async (req, res) => {
  try {
    const { date, staffId } = req.query;
    if (!date) return res.status(400).json({ error: "date required" });

    const ALL = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
    const filter = { date, status: { $ne: "cancelled" } };
    if (staffId) filter.staff = staffId;

    const booked = await Booking.find(filter).select("time");
    const takenTimes = booked.map(b => b.time);

    res.json(ALL.map(t => ({ time: t, available: !takenTimes.includes(t) })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── HEALTH ────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  const dbState = ["disconnected","connected","connecting","disconnecting"];
  res.json({ status: "ok", db: dbState[mongoose.connection.readyState], time: new Date().toISOString() });
});

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  const os = require("os");
  const nets = os.networkInterfaces();
  let localIP = "localhost";
  for (const n of Object.values(nets)) {
    for (const i of n) {
      if (i.family === "IPv4" && !i.internal) { localIP = i.address; break; }
    }
  }
  console.log(`\n🚀  Server   → http://localhost:${PORT}`);
  console.log(`📱  Network  → http://${localIP}:${PORT}`);
  console.log(`\n📋  Endpoints:`);
  console.log(`    POST /api/auth/login`);
  console.log(`    POST /api/auth/register`);
  console.log(`    GET  /api/services`);
  console.log(`    GET  /api/staff`);
  console.log(`    GET  /api/bookings          (customer)`);
  console.log(`    POST /api/bookings          (customer)`);
  console.log(`    GET  /api/admin/bookings    (admin)`);
  console.log(`    GET  /api/admin/stats       (admin)`);
  console.log(`    GET  /api/health\n`);
});
