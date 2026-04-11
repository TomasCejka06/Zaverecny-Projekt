const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const routes = require("./routes");
app.use("/api", routes);

app.listen(3000, () => console.log("Server běží na http://localhost:3000"));