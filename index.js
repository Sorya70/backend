const express = require("express");
const cors = require("cors");
const dataService = require("./services/dataServices");
const server = express();
const jwt = require("jsonwebtoken");
const { Product } = require("./services/db");

server.use(
  cors({
    origin: ["https://surian1.web.app", "http://localhost:4200"],
  })
);
server.use(express.json());
server.listen(3000, () => {
  console.log("cart server listening at port number 3000");
});

// application specific middleware
const appMiddleware = (req, res, next) => {
  console.log("inside application middleware");
  next();
};

server.use(appMiddleware);

// food-app front end request resolving

//token verify middleware
const jwtMiddleware = (req, res, next) => {
  console.log("inside router specific middleware");
  //get token from req headers
  const token = req.headers["access-token"];
  console.log(token);
  try {
    //verify token
    const data = jwt.verify(token, "B68DC6BECCF4A68C3D8D78FE742E2");
    req.email = data.email;
    console.log("valid token");
    next();
  } catch {
    console.log("invalid token");
    res.status(401).json({
      message: "Please Login!",
    });
  }
};

//register api call
server.post("/register", (req, res) => {
  console.log("inside register api");
  console.log(req.body);
  //async
  dataService
    .register(req.body.username, req.body.email, req.body.password)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//login api call
server.post("/login", (req, res) => {
  console.log("inside login api");
  console.log(req.body);
  //async
  dataService.login(req.body.email, req.body.password).then((result) => {
    res.status(result.statusCode).json(result);
  });
});


// post all products api
server.post("/all-products", (req, res) => {
  console.log(req.body);
  dataService.allProducts(req.body.id, req.body.title, req.body.price, req.body.description, req.body.category, req.body.image, req.body.rating).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// get all product api
server.get("/all-products", async (req, res) => {
    try {
        // Retrieve all posts from the database
        const posts = await Product.find();
    
        res.status(200).json({ data: posts });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error retrieving posts", error: error.message });
      }
  // dataService.allProducts(req.params.productId).then((result) => {
  //   res.status(result.statusCode).json(result);
  // });
});

//view product api
server.get('/view-product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// add to wishlist a  product jwtmiddleare used to verify token during login
server.post("/addToWishlist", jwtMiddleware, (req, res) => {
  console.log("inside addtowishlist api");
  //async
  dataService
    .addToWishlist(req.body.email, req.body.productId)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// // add to wishlist a  product jwtmiddleare used to verify token during login
// server.get("/Wishlist", jwtMiddleware, (req, res) => {
//   console.log("inside addtowishlist api");
//   //async
//   dataService
//     .addToWishlist(req.body.email, req.body.productId)
//     .then((result) => {
//       res.status(result.statusCode).json(result);
//     });
// });

// wishlist a  product jwtmiddleare used to verify token during login
server.put("/removeFromWishlist", jwtMiddleware, (req, res) => {
  console.log("inside removeFromWishlist api");
  //async
  dataService
    .removeFromWishlist(req.body.email, req.body.productId)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//  addToCart
server.post("/addToCart", jwtMiddleware, (req, res) => {
  console.log("inside addToCart api");
  //async
  dataService
    .addToCart(req.body.email, req.body.productId, req.body.count)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// removeFromCart
server.put("/removeFromCart", jwtMiddleware, (req, res) => {
  console.log("inside removeFromWishlist api");
  //async
  dataService
    .removeFromCart(req.body.email, req.body.productId)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// removeFromCart
server.put("/updateCartItemCount", jwtMiddleware, (req, res) => {
  console.log("inside updateCartItemCount api");
  //async
  dataService
    .updateCartItemCount(req.body.email, req.body.productId, req.body.count)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});
// emptyCart
server.put("/emptyCart", jwtMiddleware, (req, res) => {
  console.log("inside emptyCart api");
  //async
  dataService.emptyCart(req.body.email).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// get myitems cart after login  from user profile api
server.get("/getWishlist/:email", jwtMiddleware, (req, res) => {
  dataService.getWishlist(req.params.email).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// get my order cart after login  from user profile api
server.get("/getMyOrders/:email", jwtMiddleware, (req, res) => {
  dataService.getMyOrders(req.params.email).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// // add to Checkout a  transcation jwtmiddleare used to verify token during login
// server.post("/addToCheckout", jwtMiddleware, (req, res) => {
//   console.log("inside addToCheckout api");
//   //async
//   dataService
//     .addToCheckout(
//       req.body.email,
//       req.body.orderID,
//       req.body.transactionID,
//       req.body.dateAndTime,
//       req.body.amount,
//       req.body.status,
//       req.body.products,
//       req.body.detailes
//     )
//     .then((result) => {
//       res.status(result.statusCode).json(result);
//     });
// });

// Add to Checkout - Requires token verification using jwtMiddleware
server.post("/addToCheckout", jwtMiddleware, (req, res) => {
  console.log("Inside addToCheckout API");
  // Async
  dataService
    .addToCheckout(
      req.body.email,
      req.body.orderID,
      req.body.transactionID,
      req.body.dateAndTime,
      req.body.amount,
      req.body.status,
      req.body.productId, // Corrected from req.body.products
      req.body.detailes
    )
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// updateProfile
server.put("/updateProfile", jwtMiddleware, (req, res) => {
  console.log("Inside updateProfile API");
  
  // Ensure that all required fields are provided in the request body
  if (!req.body.email || !req.body.newUsername || !req.body.newEmail || !req.body.newPassword || !req.body.newImage) {
    return res.status(400).json({ message: "Missing required fields in the request body" });
  }

  // Async
  dataService
    .updateProfile(
      req.body.email,
      req.body.newUsername,
      req.body.newEmail,
      req.body.newPassword,
      req.body.newImage
    )
    .then((result) => {
      res.status(result.statusCode).json(result);
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});



