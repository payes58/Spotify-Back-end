require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const express = require('express');
const connection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const app = express();

connection();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("./api/songs", songRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`))
