const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const passport = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const connectDB = require("./config/db");
const routes = require("./routes/create");
const editRoute = require('./routes/edit');
const deleteRoute = require("./routes/delete");
const viewRoute = require("./routes/view");
const viewRoomRoute = require("./routes/viewRoom");
const filterRoute = require("./routes/filter");
const userRoute = require("./routes/user");
const statRoute = require("./routes/stats");

const app = express();

require("dotenv").config();

connectDB();

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/create', routes);
app.use('/edit', editRoute);
app.use('/delete', deleteRoute);
app.use('/view', viewRoute);
app.use('/viewRoom', viewRoomRoute);
app.use('/user', userRoute);
app.use('/filter', filterRoute);
app.use('/stats', statRoute);

app.get('/keep-alive', (req, res) => {
  res.status(200).send('Server is alive');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


