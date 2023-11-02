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
const filterRoute = require("./routes/filter");


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
app.use('/filter', filterRoute);
// setting up port
const BASE_URL = process.env.BASE_URL;
const PORT =process.env.PORT

app.listen(PORT, () => {
    console.log(`server is running on ${BASE_URL}`);
});