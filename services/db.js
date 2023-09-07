const mongoose = require("mongoose");
require('dotenv').config(); // Load environment variables from .env file

const dbUrl = process.env.MONGO_URL; // Use the MONGO_URL environment variable

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Atlas connection successful!!");
  })
  .catch((error) => {
    console.error("MongoDB Atlas connection error:", error);
  });

// models
// to store product detailes
const Product = mongoose.model("Product", {
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number,
  },
});

// to store user detailes
const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
  image: String,
  checkout: [],
  cart: [],
  wishlist: [],
});

module.exports = {
  Product,
  User,
};
