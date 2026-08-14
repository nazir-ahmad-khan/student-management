// config mein application ki configuration-related files hoti hain.
// db.js MongoDB connection handle karega.

// const mongoose = require("mongoose");

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI)

//         console.log("MongoDB connected successfully");
//     }
//     catch (error) {
//         console.error("MongoDB connection failed:", error.message);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;





// const dns = require("node:dns");
// const mongoose = require("mongoose");

// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);

//         console.log("MongoDB connected successfully");
//     }
//     catch (error) {
//         console.error("MongoDB connection failed:", error.message);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;



const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;