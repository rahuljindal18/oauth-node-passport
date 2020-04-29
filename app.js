import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import passport from "passport";
import cookieSession from "cookie-session";
import authRoutes from "./routes/auth-routes";
import profileRoutes from "./routes/profile-routes";
import passportSetup from "./config/passport-setup";
import keys from "./config/keys";

const app = express();

//set view engine
app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.mongoURI, () => {
  console.log("Mongo db connected");
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//create home route
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

//route not found error handler
app.use((req, res, next) => {
  const error = new Error("Requested resource not found!");
  error.status = 404;
  next(error);
});

//common error handler for not found routes and unexpected errors inside route handler functions
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

app.listen(5000, console.log("Server is listening for requests on port 5000"));
