const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: String,
    images: [String],
    description: String,
    totalCourts: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
    openingHours: {
      start: {
        type: String,
        default: "06:00",
      },
      end: {
        type: String,
        default: "22:00",
      },
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    hourlyPricing: [
      {
        hour: String,
        price: Number,
      },
    ],
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Court", courtSchema);
