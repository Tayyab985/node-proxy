const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const dotenv = require("dotenv");
const proxyHandler = require("./proxyHandler");




const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());

// Route all requests through proxy
app.post("/proxy", proxyHandler);

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
