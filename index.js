const express = require("express");
const fs = require("node:fs");
const cors = require("cors");
const filePath = __dirname + "/data.json";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("API is working");
});

// Get all the quotes
app.get("/quote", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
});

// Get one quote
app.get("/quote/:id", (req, res) => {
  const id = req.params.id;

  if (!id) res.send("No id was provided");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const d = JSON.parse(data);
    const obtainedData = d.filter((value) => value.id == id);
    res.status(200).json(obtainedData);
  });
});

//Add new quote
app.post("/quote", (req, res) => {
  console.log("req.body", req.body);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const d = JSON.parse(data);
    const newData = [...d, req.body];

    return fs.writeFile("./data.json", JSON.stringify(newData), (err) => {
      if (err) {
        console.error(err);
      } else {
        return res.status(200).json({ message: "New quote added" });
      }
    });
  });
});

app.put("/quote", (req, res) => {
  //logic update..

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const db = JSON.parse(data);

    let found = false;
    for (let i = 0; i < db.length; i++) {
      if (db[i].id.toString() === req.body.id.toString()) found = true;
    }

    if (!found) return res.json({ message: "Updating ID not found" });

    let newData = [];
    for (let i = 0; i < db.length; i++) {
      if (db[i].id.toString() === req.body.id.toString()) {
        newData.push({
          id: req.body.id,
          author: req.body.author,
          quote: req.body.quote,
        });
      } else newData.push(db[i]);
    }

    console.log("newData", newData);
    return fs.writeFile(filePath, JSON.stringify(newData), (err) => {
      if (err) {
        console.error(err);
      } else {
        return res.status(200).json({ message: "Quote updated " });
      }
    });
  });
});

//Delete Quote
app.delete("/quote/:id", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const db = JSON.parse(data);

    const newData = db.filter((d) => {
      if (d.id.toString() !== req.params.id.toString()) return true;
    });

    return fs.writeFile(filePath, JSON.stringify(newData), (err) => {
      if (err) {
        console.error(err);
      } else {
        return res.status(200).json({ message: "Quote Deleted successfully " });
      }
    });
  });
});

app.listen(4000, () => {
  console.log("Server is running");
});