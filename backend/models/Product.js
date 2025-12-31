const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    stock: { type: Number, default: 0 },
    imageUrl: String,
  },
  { timestamps: true }
);

// Adding an index for quick search by name
productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);
