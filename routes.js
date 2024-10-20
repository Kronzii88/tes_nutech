const express = require("express");
const auth = require("./controllers/authController");
const user = require("./controllers/userController");
const home = require("./controllers/homeController");
const transaction = require("./controllers/transactionController");

const authorize = require("./middlewares/authorize");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer file filter to allow only image types
const fileFilter = (req, file, cb) => {
  // Accept only png, jpeg images
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false); // Reject file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = (app) => {
  /** auth controller */
  app.route("/register").post(auth.register);
  app.route("/login").post(auth.login);

  /** user controller */
  app.route("/profile").get(authorize.authUser, user.getUserProfile);
  app.route("/profile/update").put(authorize.authUser, user.editUserProfile);
  app.route("/profile/image").put(
    authorize.authUser,
    (req, res, next) => {
      upload.single("file")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // Handle Multer-specific errors
          return res.status(400).json({
            status: 102,
            message: "Format Image tidak sesuai",
            data: null,
          });
        } else if (err) {
          // Handle other errors, including invalid file type
          return res.status(400).json({
            status: 102,
            message: "Format Image tidak sesuai",
            data: null,
          });
        }
        // If no error, proceed to the next middleware/controller
        next();
      });
    },
    user.editUserImage // The next middleware after the file is successfully uploaded
  );

  /** home controller */
  app.route("/banner").get(home.banners);
  app.route("/services").get(authorize.authUser, home.services);

  /** transaction controller */
  app.route("/balance").get(authorize.authUser, transaction.getBalance);
  app
    .route("/transaction/history")
    .get(authorize.authUser, transaction.historyTransaction);
  app
    .route("/transaction")
    .post(authorize.authUser, transaction.createTransaction);
  app.route("/topup").post(authorize.authUser, transaction.topUpBalance);
  /** main routes always on the below of other routes */
  app.route("/").get((req, res) => {
    res.status(200).json({
      metadata: {
        status: 200,
        message: "Api TES NUTECH ready to use!",
      },
      response: {
        data: {
          name: "Backend STEMBA Mobile",
        },
      },
    });
  });

  app.use((req, res) => {
    console.log("url", req.url);
    res.status(404).json({
      metadata: {
        status: 404,
        message: "FAIL",
      },
      response: {
        data: {
          name: "ROUTE NOT FOUND",
          message: "Are you lost?",
        },
      },
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      metadata: {
        status: 500,
        message: "ERROR",
      },
      response: {
        data: {
          name: "InternalServerError",
          message: err.message,
          stack: err.stack,
        },
      },
    });
  });
};
