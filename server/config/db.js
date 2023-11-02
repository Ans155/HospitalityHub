const mongoose = require("mongoose");
const db = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://anshchoudhary155:anvi2701@cluster0.o4ryywg.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB is connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
