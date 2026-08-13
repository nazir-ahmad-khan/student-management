const Student = require("../models/Student");

// CREATE
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// GET ONE
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE student
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });

  } catch (error) {
    next(error);
  }
};

// DELETE student
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};