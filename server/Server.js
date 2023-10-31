require("dotenv").config(); //added
const express = require("express");
const connectDB = require("./config/db"); //added
//const bookRoute = require('./routes/create'); // Import the route file
const routes =require("./routes/create")
const editRoute = require('./routes/edit');
const app = express();
// connect database
connectDB();//added
// initialize middleware
app.use(express.json({ extended: false }));
//app.get("/", (req, res) => res.send("Server up and running"));
app.use('/create', routes);
app.use('/edit', editRoute);
// setting up port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});