const express = require("express");
const env = require("dotenv");
const { response } = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");
var bodyParser = require("body-parser");

const port = process.env.PORT || 3080;

// routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/Admin/auth");
const categoryRoute = require("./routes/category");
const ProductRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const initialData = require("./routes/Admin/initialData");

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

// async function connect() {
//   try {
//     const client = await MongoClient.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     const db = client.db(process.env.); // Replace with your database name
//     app.locals.db = db; // Store the database client in app locals

//     console.log("MongoDb connected");
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// }

connect();
// environment variable
env.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoute);
app.use("/api", ProductRoute);
app.use("/api", cartRoute);
app.use("/api", initialData);
app.get("/", (req, res) => {
  res.send("App Works !!!!");
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

module.exports = app;
