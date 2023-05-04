const Appointment = require("../models/appointment");

// GET Appointment Page
module.exports.getAppointmentPage = (req, res) => {
  Appointment.find({})
    .then((appointment) => {
      const appointments = JSON.stringify(appointment);

      res.render("admin/appointment", {
      
        appointments,
      });
    })
    .catch((err) => console.log(err));
};

module.exports.postAppointmentHandler = (req, res) => {
  const { date } = req.body;
  if (!date) {
    return res.redirect("/appointment");
  }

  const makeAppointment = new Appointment({ ...req.body });
  makeAppointment
    .save()
    .then(() => {
      return res.redirect("/appointment");
    })
    .catch((err) => console.log("Appointmant Error", err));
};


module.exports.getExamResultList = (req, res, next) => {
  Appointment.find()
    .populate("userId")
    .then((appointment) => {
      const appointments = JSON.stringify(appointment);

      const filterData = appointment.filter((item) => item?.userId);

      res.render("admin/admin", {
        filterData,
        appointments,
      });
    })
    .catch((err) => console.log(err));
};
