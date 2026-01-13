const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupName: { type: String, trim: true },
  joinedAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema(
  {
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organiser",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Please provide a more detailed description"],
    },
    // Registration & Event Timing
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
      index: true,
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
      validate: {
        validator: function (value) {
          return value < this.eventDate;
        },
        message: "Registration deadline must be before the event date",
      },
    },
    // Capacity & Group Logic
    mode: {
      type: String,
      enum: ["individual", "group"],
      default: "individual",
    },
    minGroupSize: {
      type: Number,
      default: 1,
      min: [1, "Minimum group size cannot be less than 1"],
    },
    maxGroupSize: {
      type: Number,
      default: 1,
      validate: {
        validator: function (value) {
          return value >= this.minGroupSize;
        },
        message: "Max group size must be greater than or equal to min group size",
      },
    },
    totalCapacity: {
      type: Number,
      required: [true, "Total capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    // Pricing & Prizes
    ticketPrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
    },
    winningPrize: {
      pool: { type: Number, default: 0 },
      description: { type: String }, // e.g., "Trophy + $500"
    },
    // Media & Location
    banner: {
      type: String,
      default: "placehold.co",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      address: { type: String, required: true },
      coordinates: [Number], // [longitude, latitude]
    },
    // Participants Tracking
    participants: [participantSchema],
    soldSeats: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
      index: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Geo-spatial index for "Events near me"
eventSchema.index({ location: "2dsphere" });

// Virtual to check if event is full
eventSchema.virtual("isFull").get(function () {
  return this.soldSeats >= this.totalCapacity;
});

// Virtual to check if registration is expired
eventSchema.virtual("isExpired").get(function () {
  return new Date() > this.registrationDeadline;
});

module.exports = mongoose.model("Event", eventSchema);
