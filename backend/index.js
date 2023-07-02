const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    // Validate file type or other conditions if needed
    // For example, allow only images
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPG, JPEG, and PNG files are allowed."
        )
      );
    }
  },
});

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "secret",
  database: "vue_node_api",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json());

app.post("/api/submit", upload.single("file"), (req, res) => {
  const { name, email } = req.body;
  const file = req.file;

  if (!name || !email || !file) {
    res.status(400).json({ message: "Missing required form data or file" });
    return;
  }

  pool.query(
    "INSERT INTO form (name, email, file) VALUES (?, ?, ?)",
    [name, email, file.filename],
    (error, results) => {
      if (error) {
        console.error("Error storing form data:", error);
        res
          .status(500)
          .json({ message: "An error occurred while storing form data" });
      } else {
        res.json({ message: "Form submitted successfully" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
