// server/models/Organiser.model.js
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
            select: false
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^[6-9]\d{9}$/, "Invalid phone number"]
        },
        website: {
            type: String,
            match: [/^https?:\/\/.+/, "Invalid website URL"]
        },

        logo: {
            type: String,
            default: "https://api.dicebear.com/7.x/initials/svg?seed=Org"
        },
        bio: { type: String, maxlength: 500 },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
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
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Fixed pre-save hook for Mongoose >= 6
organiserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to check password
organiserSchema.methods.correctPassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for follower count
organiserSchema.virtual('followerCount').get(function () {
    return this.followers?.length || 0;
});

module.exports = mongoose.model("Organiser", organiserSchema);
