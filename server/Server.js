require("dotenv").config(); //added
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
//const bookRoute = require('./routes/create'); // Import the route file
const routes =require("./routes/create")
const editRoute = require('./routes/edit');
const deleteRoute = require("./routes/delete");
const viewRoute = require("./routes/view");
const viewRoomRoute = require("./routes/viewRoom");

const app = express();
app.use(cors());
// connect database
connectDB();//added
// initialize middleware
app.use(express.json({ extended: false }));
//app.get("/", (req, res) => res.send("Server up and running"));
app.use('/create', routes);
app.use('/edit', editRoute);
app.use('/delete', deleteRoute);
app.use('/view', viewRoute);
app.use('/viewRoom', viewRoomRoute);
// setting up port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});