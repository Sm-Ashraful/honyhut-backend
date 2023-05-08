const express = require("express");
const env = require("dotenv");
const { response } = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");
port = 3080;

// routes
const authRoutes = require("./routes/auth");

//mongo db connection
const url =
  "mongodb+srv://dev1mitaliint:8k9xEQweFVA565sm@cluster0.osjggo2.mongodb.net/?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(url);
    console.log("MongoDb connected");
  } catch (error) {
    console.log("Error: ", error);
  }
}
connect();
// environment variable
env.config();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", authRoutes);
app.get("/", (req, res) => {
  res.send("App Works !!!!");
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
