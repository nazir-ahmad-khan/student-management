const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    rollNo: {
    type: String,
    required: true,
    trim: true
  },

  className: {
    type: String,
    required: true,
    trim: true
  },

  subject: {
    type: String,
    required: true,
    trim: true
  },

  mobileNo: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  }

});

module.exports = mongoose.model("Student", studentSchema);
