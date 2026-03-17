const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["single", "recurring"],
      default: "single",
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: String,
    endTime: String,
    durationHours: {
      type: Number,
      required: true,
    },
    courtPrice: {
      type: Number,
      required: true,
    },
    drinkItems: [
      {
        drinkId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalDrinkPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING_APPROVAL",
        "CONFIRMED",
        "PLAYING",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING_APPROVAL",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentProof: String,
    recurringRule: {
      frequency: String,
      interval: Number,
      endDate: Date,
      recurringBookingIds: [mongoose.Schema.Types.ObjectId],
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true },
);

bookingSchema.pre("save", async function () {
  if (this.isNew && !this.bookingNumber) {
    const count = await mongoose.model("Booking").countDocuments();
    this.bookingNumber = `BK${Date.now()}${count}`;
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
