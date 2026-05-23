const express = require("express");
const router = express.Router();

const db = require("../database/db");

// ADD CROP
router.post("/add-crop", (req, res) => {

    const { farmer_id, crop_name, season, quantity } = req.body;

    if (!farmer_id || !crop_name || !season || !quantity) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const checkSql = `
        SELECT * FROM crops
        WHERE farmer_id = ? AND crop_name = ? AND season = ?
    `;

    db.get(checkSql, [farmer_id, crop_name, season], (err, existingCrop) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (existingCrop) {
            return res.status(400).json({
                error: "Crop already exists"
            });
        }

        const insertSql = `
            INSERT INTO crops (farmer_id, crop_name, season, quantity)
            VALUES (?, ?, ?, ?)
        `;

        db.run(insertSql,
            [farmer_id, crop_name, season, quantity],

            function (err) {

                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                res.json({
                    message: "Crop Added Successfully",
                    cropId: this.lastID
                });

            }
        );

    });

});


// GET ALL CROPS
router.get("/all", (req, res) => {

    const sql = "SELECT * FROM crops";

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);

    });

});
// DELETE CROP
router.delete("/delete/:id", (req, res) => {

    const cropId = req.params.id;

    const sql = "DELETE FROM crops WHERE id = ?";

    db.run(sql, [cropId], function (err) {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: "Crop not found"
            });
        }

        res.json({
            message: "Crop Deleted Successfully"
        });

    });

});
// UPDATE CROP
router.put("/update/:id", (req, res) => {

    const cropId = req.params.id;

    const { crop_name, season, quantity } = req.body;

    if (!crop_name || !season || !quantity) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const sql = `
        UPDATE crops
        SET crop_name = ?, season = ?, quantity = ?
        WHERE id = ?
    `;

    db.run(sql,
        [crop_name, season, quantity, cropId],

        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Crop not found"
                });
            }

            res.json({
                message: "Crop Updated Successfully"
            });

        }
    );

});
module.exports = router;