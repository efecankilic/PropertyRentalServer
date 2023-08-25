const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String, required: true },
  rating: { type: Number, required: true},
  city: { type: String, required: true },
  street: { type: String, required: true },
  country: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: { type: Array, required: true },
  dailyRate: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  host: { type: String, required: true },
  hostImage: { type: String, required: true },
  reviews : {type: Array, required: true},
});

module.exports = mongoose.model("Property", propertySchema);


