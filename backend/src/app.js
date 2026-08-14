// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());

// const studentRoutes = require('./routes/studentRoutes');

// const notFoundMiddleware = require('./middleware/notFoundMiddleware');
// const errorMiddleware = require('./middleware/errorMiddleware');

// app.use('/api/students', studentRoutes);

// app.use(notFoundMiddleware);

// app.use(errorMiddleware);

// module.exports = app;




const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Management API is running",
  });
});

const studentRoutes = require('./routes/studentRoutes');

const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

app.use('/api/students', studentRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

module.exports = app;