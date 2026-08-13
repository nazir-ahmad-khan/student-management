import { useEffect, useState } from 'react'
import { Edit3, Trash2 } from 'lucide-react'

import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from './services/studentApi'


// =========================================================
// INITIAL FORM STATE
// =========================================================

const initialState = {
  name: '',
  fatherName: '',
  rollNo: '',
  studentClass: '',
  subject: '',
  mobile: '',
  dob: '',
  gender: '',
  address: '',
}


function App() {

  const [formData, setFormData] = useState(initialState)

  const [errors, setErrors] = useState({})

  const [students, setStudents] = useState([])

  const [activeTab, setActiveTab] = useState('form')

  const [selectedStudentId, setSelectedStudentId] = useState(null)

  const [selectedIds, setSelectedIds] = useState([])


  // =========================================================
  // GET STUDENTS
  // MongoDB se students load honge
  // =========================================================

  useEffect(() => {

    const loadStudents = async () => {

      try {

        const response = await getStudents()

        console.log('Students fetched:', response)

        const formattedStudents = response.data.map((student) => ({

          id: student._id,

          name: student.name,

          fatherName: student.fatherName,

          rollNo: student.rollNo,

          studentClass: student.className,

          subject: student.subject,

          mobile: student.mobileNo,

          dob: student.dateOfBirth
            ? student.dateOfBirth.split('T')[0]
            : '',

          gender: student.gender,

          address: student.address,

          // IMPORTANT:
          // Database se load hone wale students pending rahenge.
          // Add button click karne par added honge.
          status: 'pending',

        }))


        setStudents(formattedStudents)

      } catch (error) {

        console.error(
          'Failed to load students:',
          error.message
        )

      }

    }


    loadStudents()

  }, [])


  // =========================================================
  // FORM INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {

    const { name, value } = event.target

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }))

  }


  // =========================================================
  // FORM VALIDATION
  // =========================================================

  const validateForm = () => {

    const nextErrors = {}


    if (!formData.name.trim()) {

      nextErrors.name = 'Name is required.'

    }


    if (!formData.fatherName.trim()) {

      nextErrors.fatherName =
        'Father Name is required.'

    }


    if (!formData.rollNo.trim()) {

      nextErrors.rollNo =
        'Roll No is required.'

    }


    if (!formData.studentClass) {

      nextErrors.studentClass =
        'Please select a class.'

    }


    if (!formData.subject) {

      nextErrors.subject =
        'Please select a subject.'

    }


    if (!formData.mobile.trim()) {

      nextErrors.mobile =
        'Mobile No is required.'

    }


    if (!formData.dob) {

      nextErrors.dob =
        'Date of Birth is required.'

    }


    if (!formData.gender) {

      nextErrors.gender =
        'Please select a gender.'

    }


    if (!formData.address.trim()) {

      nextErrors.address =
        'Address is required.'

    }


    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0

  }


  // =========================================================
  // FORM SUBMIT
  //
  // selectedStudentId === null
  //      ↓
  // POST
  //
  // selectedStudentId !== null
  //      ↓
  // PUT
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault()


    if (!validateForm()) {

      return

    }


    try {

      // =====================================================
      // Frontend field names
      //        ↓
      // Backend field names
      // =====================================================

      const studentData = {

        name: formData.name,

        fatherName: formData.fatherName,

        rollNo: formData.rollNo,

        className: formData.studentClass,

        subject: formData.subject,

        mobileNo: formData.mobile,

        dateOfBirth: formData.dob,

        gender: formData.gender,

        address: formData.address,

      }


      // =====================================================
      // EDIT MODE
      // PUT API
      // =====================================================

      if (selectedStudentId !== null) {

        const result = await updateStudent(
          selectedStudentId,
          studentData
        )


        console.log(
          'Student updated:',
          result
        )


        // Frontend list mein updated student
        setStudents((prev) =>

          prev.map((student) =>

            student.id === selectedStudentId

              ? {

                  ...student,

                  name: result.data.name,

                  fatherName:
                    result.data.fatherName,

                  rollNo:
                    result.data.rollNo,

                  studentClass:
                    result.data.className,

                  subject:
                    result.data.subject,

                  mobile:
                    result.data.mobileNo,

                  dob:
                    result.data.dateOfBirth
                      ? result.data.dateOfBirth.split('T')[0]
                      : '',

                  gender:
                    result.data.gender,

                  address:
                    result.data.address,

                  // Edit ke baad pending
                  status: 'pending',

                }

              : student

          )

        )


        // Form empty
        setFormData(initialState)

        setErrors({})

        setSelectedStudentId(null)

        return

      }


      // =====================================================
      // NEW STUDENT
      // POST API
      // =====================================================

      const result =
        await createStudent(studentData)


      console.log(
        'Student created:',
        result
      )


      // =====================================================
      // MongoDB response ko frontend format mein convert
      // =====================================================

      const newStudent = {

        id: result.data._id,

        name: result.data.name,

        fatherName:
          result.data.fatherName,

        rollNo:
          result.data.rollNo,

        studentClass:
          result.data.className,

        subject:
          result.data.subject,

        mobile:
          result.data.mobileNo,

        dob:
          result.data.dateOfBirth
            ? result.data.dateOfBirth.split('T')[0]
            : '',

        gender:
          result.data.gender,

        address:
          result.data.address,

        // IMPORTANT:
        // New student automatically Added nahi hoga.
        status: 'pending',

      }


      // =====================================================
      // STUDENT LIST UPDATE
      // =====================================================

      setStudents((prev) => [

        ...prev,

        newStudent,

      ])


      // =====================================================
      // FORM EMPTY
      //
      // activeTab ko change NAHI kar rahe.
      // Isliye Form hi open rahega.
      // =====================================================

      setFormData(initialState)

      setErrors({})

      setSelectedStudentId(null)


    } catch (error) {

      console.error(
        'Student save failed:',
        error.message
      )

    }

  }


  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {

    setFormData(initialState)

    setErrors({})

    setSelectedStudentId(null)

  }


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (student) => {

    // Added student edit nahi ho sakta
    if (student.status === 'added') {

      return

    }


    setFormData({

      name: student.name,

      fatherName: student.fatherName,

      rollNo: student.rollNo,

      studentClass: student.studentClass,

      subject: student.subject,

      mobile: student.mobile,

      dob: student.dob,

      gender: student.gender,

      address: student.address,

    })


    setSelectedStudentId(student.id)

    setErrors({})


    // Form open hoga
    setActiveTab('form')

  }


  // =========================================================
  // DELETE
  //
  // IMPORTANT:
  // Pehle MongoDB se delete hoga.
  // Successful DELETE ke baad hi UI se remove hoga.
  // =========================================================

  const handleDelete = async (studentId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    )


    if (!confirmed) {

      return

    }


    try {

      // =====================================================
      // DELETE API
      // =====================================================

      const result =
        await deleteStudent(studentId)


      console.log(
        'Student deleted:',
        result
      )


      // =====================================================
      // Successful DELETE ke baad frontend se remove
      // =====================================================

      setStudents((prev) =>

        prev.filter(
          (student) =>
            student.id !== studentId
        )

      )


      // Selected student cleanup
      if (
        selectedStudentId === studentId
      ) {

        setSelectedStudentId(null)

        setFormData(initialState)

        setErrors({})

      }


      // Checkbox cleanup
      setSelectedIds((prev) =>

        prev.filter(
          (id) => id !== studentId
        )

      )


    } catch (error) {

      console.error(
        'Delete student failed:',
        error.message
      )

      alert(
        `Failed to delete student: ${error.message}`
      )

    }

  }


  // =========================================================
  // ADD NEW
  // =========================================================

  const handleAddNew = () => {

    setSelectedStudentId(null)

    setFormData(initialState)

    setErrors({})

    setActiveTab('form')

  }


  // =========================================================
  // SELECT / UNSELECT
  // =========================================================

  const toggleSelect = (id) => {

    setSelectedIds((prev) =>

      prev.includes(id)

        ? prev.filter(
            (x) => x !== id
          )

        : [...prev, id]

    )

  }


  // =========================================================
  // PENDING STUDENTS
  // =========================================================

  const pendingIds = students

    .filter(
      (student) =>
        student.status === 'pending'
    )

    .map(
      (student) => student.id
    )


  const allPendingSelected =

    pendingIds.length > 0 &&

    pendingIds.every(
      (id) =>
        selectedIds.includes(id)
    )


  // =========================================================
  // SELECT ALL
  // =========================================================

  const handleSelectAll = () => {

    if (allPendingSelected) {

      setSelectedIds((prev) =>

        prev.filter(
          (id) =>
            !pendingIds.includes(id)
        )

      )

    } else {

      setSelectedIds((prev) =>

        Array.from(

          new Set([
            ...prev,
            ...pendingIds,
          ])

        )

      )

    }

  }


  // =========================================================
  // ADD BUTTON
  // =========================================================

  const handleConfirm = (id) => {

    setStudents((prev) =>

      prev.map((student) =>

        student.id === id

          ? {
              ...student,
              status: 'added',
            }

          : student

      )

    )


    setSelectedIds((prev) =>

      prev.filter(
        (x) => x !== id
      )

    )

  }


  // =========================================================
  // BULK ADD
  // =========================================================

  const handleBulkConfirm = () => {

    if (selectedIds.length === 0) {

      return

    }


    const toConfirm =
      new Set(selectedIds)


    setStudents((prev) =>

      prev.map((student) =>

        toConfirm.has(student.id)

          ? {
              ...student,
              status: 'added',
            }

          : student

      )

    )


    setSelectedIds((prev) =>

      prev.filter(
        (id) =>
          !toConfirm.has(id)
      )

    )

  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen bg-slate-50 py-10 px-4 text-slate-900 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/50 sm:p-10">


        {/* =====================================================
            TOP TABS
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setActiveTab('form')
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'form'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              Form
            </button>


            <button
              type="button"
              onClick={() =>
                setActiveTab('list')
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              Student List
            </button>

          </div>


          <div className="text-sm text-slate-500">

            {activeTab === 'list'

              ? `${students.length} student${
                  students.length === 1
                    ? ''
                    : 's'
                } found`

              : selectedStudentId === null

              ? 'Fill the form to add a student'

              : 'Editing selected student'}

          </div>

        </div>


        {/* =====================================================
            FORM
        ===================================================== */}

        {activeTab === 'form' ? (

          <>

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
                Student Management
              </p>


              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Student Management System
              </h1>


              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                Add or update student information using the form below.
                All fields are required for a complete record.
              </p>

            </div>


            <form
              className="mt-10 space-y-8"
              onSubmit={handleSubmit}
              noValidate
            >

              <div className="grid gap-6 sm:grid-cols-2">


                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Name{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter student name"
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name
                        ? 'name-error'
                        : undefined
                    }
                  />


                  {errors.name && (

                    <p
                      id="name-error"
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.name}
                    </p>

                  )}

                </div>


                {/* FATHER NAME */}

                <div>

                  <label
                    htmlFor="fatherName"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Father Name{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter father name"
                    aria-invalid={!!errors.fatherName}
                    aria-describedby={
                      errors.fatherName
                        ? 'fatherName-error'
                        : undefined
                    }
                  />


                  {errors.fatherName && (

                    <p
                      id="fatherName-error"
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.fatherName}
                    </p>

                  )}

                </div>


                {/* ROLL NO */}

                <div>

                  <label
                    htmlFor="rollNo"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Roll No{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <input
                    id="rollNo"
                    name="rollNo"
                    type="text"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter roll number"
                    aria-invalid={!!errors.rollNo}
                    aria-describedby={
                      errors.rollNo
                        ? 'rollNo-error'
                        : undefined
                    }
                  />


                  {errors.rollNo && (

                    <p
                      id="rollNo-error"
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.rollNo}
                    </p>

                  )}

                </div>


                {/* CLASS */}

                <div>

                  <label
                    htmlFor="studentClass"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Class{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <select
                    id="studentClass"
                    name="studentClass"
                    value={formData.studentClass}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="">
                      Select class
                    </option>

                    <option value="6th">
                      6th
                    </option>

                    <option value="7th">
                      7th
                    </option>

                    <option value="8th">
                      8th
                    </option>

                    <option value="9th">
                      9th
                    </option>

                    <option value="10th">
                      10th
                    </option>

                    <option value="11th">
                      11th
                    </option>

                    <option value="12th">
                      12th
                    </option>

                  </select>


                  {errors.studentClass && (

                    <p className="mt-2 text-sm text-red-600">
                      {errors.studentClass}
                    </p>

                  )}

                </div>


                {/* SUBJECT */}

                <div>

                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Subject{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="">
                      Select subject
                    </option>

                    <option value="English">
                      English
                    </option>

                    <option value="Mathematics">
                      Mathematics
                    </option>

                    <option value="Science">
                      Science
                    </option>

                    <option value="Computer Science">
                      Computer Science
                    </option>

                    <option value="Physics">
                      Physics
                    </option>

                    <option value="Chemistry">
                      Chemistry
                    </option>

                    <option value="Biology">
                      Biology
                    </option>

                  </select>


                  {errors.subject && (

                    <p className="mt-2 text-sm text-red-600">
                      {errors.subject}
                    </p>

                  )}

                </div>


                {/* MOBILE */}

                <div>

                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mobile No{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter mobile number"
                  />


                  {errors.mobile && (

                    <p className="mt-2 text-sm text-red-600">
                      {errors.mobile}
                    </p>

                  )}

                </div>


                {/* DOB */}

                <div>

                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Date of Birth{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />


                  {errors.dob && (

                    <p className="mt-2 text-sm text-red-600">
                      {errors.dob}
                    </p>

                  )}

                </div>


                {/* GENDER */}

                <div>

                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Gender{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>


                  {errors.gender && (

                    <p className="mt-2 text-sm text-red-600">
                      {errors.gender}
                    </p>

                  )}

                </div>


                {/* ADDRESS */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Address{' '}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>


                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter full address"
                  />


                  {errors.address && (

                    <p className="mt-2 text-sm text-red-600">
                      {errors.address}
                    </p>

                  )}

                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Reset
                </button>


                <button
                  type="submit"
                  className="inline-flex justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                  {selectedStudentId !== null
                    ? 'Update'
                    : 'Submit'}
                </button>

              </div>

            </form>

          </>

        ) : (

          /* ===================================================
             STUDENT LIST
          =================================================== */

          <div className="mt-4 space-y-4">


            {/* LIST TOP */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">

                  <input
                    type="checkbox"
                    checked={allPendingSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-slate-200 text-indigo-600"
                  />

                  <span>
                    Select All
                  </span>

                </label>

              </div>


              <button
                type="button"
                onClick={handleBulkConfirm}
                disabled={
                  selectedIds.length === 0
                }
                className={`rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition ${
                  selectedIds.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-slate-200'
                }`}
              >
                Bulk Add
              </button>

            </div>


            {/* STUDENTS */}

            {students.map(
              (student, index) => (

                <div
                  key={student.id}
                  className="flex items-center gap-3"
                >


                  {/* CHECKBOX */}

                  <div className="flex h-10 items-center">

                    {student.status ===
                    'pending' ? (

                      <input
                        type="checkbox"
                        checked={selectedIds.includes(
                          student.id
                        )}
                        onChange={() =>
                          toggleSelect(
                            student.id
                          )
                        }
                        className="h-4 w-4 rounded border-slate-200 text-indigo-600"
                      />

                    ) : (

                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="h-4 w-4 rounded border-green-300 bg-green-50 text-green-600"
                        aria-label="Student added"
                      />

                    )}

                  </div>


                  {/* STUDENT CARD */}

                  <div className="flex flex-1 flex-col justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center">


                    {/* NAME */}

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-slate-900">

                        <span className="mr-3 text-slate-500">
                          {index + 1}.
                        </span>

                        {student.name}

                      </p>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-slate-700 sm:mt-0">


                      {/* ADD */}

                      <button
                        type="button"
                        onClick={() =>
                          handleConfirm(
                            student.id
                          )
                        }
                        disabled={
                          student.status ===
                            'added' ||
                          !selectedIds.includes(
                            student.id
                          )
                        }
                        className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                          student.status ===
                          'added'

                            ? 'border-green-200 bg-green-50 text-green-700 cursor-default'

                            : selectedIds.includes(
                                student.id
                              )

                            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'

                            : 'border-slate-200 bg-slate-100 text-slate-700 opacity-50 cursor-not-allowed'
                        }`}
                      >

                        {student.status ===
                        'added'

                          ? '✓ Added'

                          : 'Add'}

                      </button>


                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            student
                          )
                        }
                        disabled={
                          student.status ===
                          'added'
                        }
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border px-0 text-slate-700 transition ${
                          student.status ===
                          'added'

                            ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'

                            : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                        aria-label="Edit student"
                      >

                        <Edit3 className="h-4 w-4" />

                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            student.id
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        aria-label="Delete student"
                      >

                        <Trash2 className="h-4 w-4" />

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}


            {/* EMPTY */}

            {students.length === 0 && (

              <p className="text-sm text-slate-500">
                No students found. Use the Form tab to add new students.
              </p>

            )}

          </div>

        )}

      </div>

    </div>

  )

}


export default App