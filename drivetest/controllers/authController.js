const User = require("../models/user");
const bcrypt = require("bcrypt");

// POST Sign up
module.exports.postSignup = (req, res, next) => {
  const { userName, password, confirmPw, userType } = req.body;
  User.findOne({ userName })
    .then((isUser) => {
      // already signed up
      if (isUser) {
        
        return res.redirect("/auth/login");
      }
      if (password !== confirmPw) {
      
        return res.redirect("/auth/login");
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = new User({
            userName,
            password: hashedPassword,
            userType,
          });
          return user.save();
        })
        .then((result) => {
          if (result) {
          
            res.redirect("/auth/login");
          }
        })
        .catch((err) => {
          console.log("signup Problam", err);
        });
    })
    .catch((err) => {
      return res.redirect("/auth/login");
    });
};


module.exports.getLoginPage = (req, res, next) => {
  res.render("auth/login");
};

// POST Login
exports.postSignInHandler = (req, res, next) => {
  const { userName, password } = req.body;

  User.findOne({ userName }).then((isUser) => {
    if (!isUser) {
      
      return res.redirect("/auth/login");
    }

    bcrypt
      .compare(password, isUser.password)
      .then((isPassword) => {
        if (isPassword) {
          req.session.isLoggedIn = true;
          req.session.user = isUser;
          return req.session.save((err) => {
            res.redirect("/G2_TEST");
          });
        }
        
        return res.redirect("/auth/login");
      })
      .catch((err) => {
        console.log(err);
        return res.redirect("/auth/login");
      });
  });
};

// log out
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
   
    res.redirect("/auth/login");
  });
};
