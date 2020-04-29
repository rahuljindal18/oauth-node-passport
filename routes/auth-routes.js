import express from "express";
import passport from "passport";

const router = express.Router();

//auth login
router.get("/login", (req, res) => {
  res.render("login", {
    user: req.user,
  });
});

//logout
router.get("/logout", (req, res) => {
  //handle with passport
  req.logout();
  res.redirect("/");
});

//login with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

//google callback redirect url
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

export default router;
