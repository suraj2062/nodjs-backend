const fs = require("node:fs");

const filePath = __dirname + "/data.json";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});