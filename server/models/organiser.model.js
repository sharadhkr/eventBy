const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const organiserSchema = new mongoose.Schema(
  {
    organisationName: { 
      type: String, 
      required: [true, "Organisation name is required"],
      trim: true,
      unique: true 
    },
    ownerName: { 
      type: String, 
      required: [true, "Owner name is required"],
      trim: true 
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false // Prevents password from leaking in API calls by default
    },
    phone: { 
      type: String, 
      required: [true, "Phone number is required"],
      unique: true 
    },
    // Branding & Verification
    logo: { 
      type: String, 
      default: "api.dicebear.com" 
    },
    website: { type: String },
    bio: { type: String, maxlength: 500 },
    
    // Status Logic
    isVerified: { 
      type: Boolean, 
      default: false // Set to true after manual document check
    },
    isActive: { type: Boolean, default: true },
    
    // Analytics & Social
    totalEventsCreated: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    lastLogin: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// 1. Password Hashing Middleware
organiserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 2. Instance Method to check password
organiserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 3. Virtual for follower count
organiserSchema.virtual('followerCount').get(function() {
  // Use ?. and fallback to 0
  return this.followers?.length || 0; 
});

module.exports = mongoose.model("Organiser", organiserSchema);
