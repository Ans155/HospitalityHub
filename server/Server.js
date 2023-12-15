require("dotenv").config(); //added
const bodyParser = require('body-parser');
const passport = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
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
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/create',passport.authenticate('jwt', { session: false }), routes);
app.use('/edit',passport.authenticate('jwt', { session: false }), editRoute);
app.use('/delete',passport.authenticate('jwt', { session: false }), deleteRoute);
app.use('/view',passport.authenticate('jwt', { session: false }),viewRoute);
app.use('/viewRoom',passport.authenticate('jwt', { session: false }), viewRoomRoute);
app.use('/filter',passport.authenticate('jwt', { session: false }), filterRoute);
// setting up port
const BASE_URL = process.env.BASE_URL;
const PORT =process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on ${BASE_URL}`);
});