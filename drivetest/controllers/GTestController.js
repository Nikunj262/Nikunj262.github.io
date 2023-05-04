const User = require("../models/user");
const Appointment = require("../models/appointment");

// GET G Page
module.exports.getGTEST = (req, res) => {
  // aquire from session on index.js
  const user = req.user;

  if (user.firstName == "default" || user.lastName == "default" || user.age == 0 || user.licenseNo == "default") {
    
    return res.redirect("/G2_TEST");
  }

  Appointment.find({})
    .populate("userId") // models/appointment.js
    .then((result) => {
      // all appointments from admin
      const appointments = JSON.stringify(result);

      // selected time slots by current user
      const filteredData = result.filter((item) => item?.userId?._id.valueOf() == user._id);

      res.render("driveTest/G", {
        user,
        filteredData,
        appointments,
      });
    })
    .catch((err) => console.log("err", err));
};

// POST G Update
module.exports.postGTestEditData = (req, res, next) => {
  // time here is in ObjectId format
  const { userId, time } = req.body;

  User.findById(userId)
    .then((user) => {
      return req.user.storeData(req.body, req, res);
    })
    .then((result) => {
      if (req.body?.time) {
        Appointment.findById({ _id: time })
          .then((item) => {
            item.isTimeSlotAvailable = false;
            item.userId = userId;
            return item.save();
          })
          .then((result) => {
            if (result) {
              res.redirect("/G_TEST");
            }
          })
          .catch((err) => console.log("err"));
      } else {
        res.redirect("/G_TEST");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
