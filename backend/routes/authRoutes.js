const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const db = require("../database/db");

router.post("/register", async (req, res) => {

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: "All fields are required"
    });
  }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users(name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      query,
      [name, email, hashedPassword, role],
      function(err) {

        if (err) {
          return res.status(400).json({
            error: err.message
          });
        }

        res.json({
          message: "User Registered Successfully"
        });

      }
    );

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;