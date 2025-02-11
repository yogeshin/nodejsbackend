import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a subscription name"],
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Please provide a subscription price"],
      min: [0, "Price must be a greater than 0"],
    },
    currency: {
      type: String,
      required: [true, "Please provide a currency"],
      enum: ["USD", "EUR", "GBP", "INR"],
      default: "INR",
    },
    frequency: {
      type: String,
      required: [true, "Please provide a frequency"],
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: [
        "entertainment",
        "food",
        "health",
        "shopping",
        "transport",
        "technology",
        "sports",
        "news",
        "other",
      ],
    },
    paymentMethod: {
      type: String,
      required: [true, "Please provide a payment method"],
      enum: ["credit card", "debit card", "net banking", "cash"],
    },
    status: {
      type: String,
      required: [true, "Please provide a status"],
      enum: ["active", "cancelled", "trial", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
      validate: {
        validator: (startDate) => {
          return startDate <= new Date();
        },
        message: "Start date must be a in past or today",
      },
    },
    renewalDate: {
      type: Date,
      required: [true, "Please provide a renewal date"],
      validate: {
        validator: (renewalDate) => {
          return renewalDate >= this.startDate;
        },
        message: "Renewal date must be greater than start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto calculate renewal date
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  // Auto update the status if renewal date is in past
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
