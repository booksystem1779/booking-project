const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// ── USER ──────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  phone:     { type: String, default: "" },
  role:      { type: String, enum: ["customer","admin"], default: "customer" },
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

UserSchema.methods.toSafe = function() {
  return { id: this._id, name: this.name, email: this.email, phone: this.phone, role: this.role, createdAt: this.createdAt };
};

// ── SERVICE ───────────────────────────────────────────────────
const ServiceSchema = new mongoose.Schema({
  icon:     { type: String, default: "✂️" },
  nameAr:   { type: String, required: true },
  nameHe:   { type: String, required: true },
  duration: { type: Number, required: true },
  price:    { type: Number, required: true },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

// ── STAFF ─────────────────────────────────────────────────────
const StaffSchema = new mongoose.Schema({
  nameAr: { type: String, required: true },
  nameHe: { type: String, required: true },
  avatar: { type: String, default: "👤" },
  rating: { type: Number, default: 5.0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// ── BOOKING ───────────────────────────────────────────────────
const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  service:   { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  staff:     { type: mongoose.Schema.Types.ObjectId, ref: "Staff",   default: null },
  date:      { type: String, required: true },
  time:      { type: String, required: true },
  status:    { type: String, enum: ["pending","confirmed","cancelled"], default: "pending" },
  notes:     { type: String, default: "" },
}, { timestamps: true });

// Auto-generate bookingId like BK-12345
BookingSchema.pre("save", async function(next) {
  if (!this.bookingId) {
    this.bookingId = "BK-" + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

module.exports = {
  User:    mongoose.model("User",    UserSchema),
  Service: mongoose.model("Service", ServiceSchema),
  Staff:   mongoose.model("Staff",   StaffSchema),
  Booking: mongoose.model("Booking", BookingSchema),
};
