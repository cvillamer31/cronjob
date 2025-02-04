
const express = require("express");
const app = express();
const router = express.Router();
// const {sing_up, staff, profile, master_shop} = require("../models/all_models");
const bcrypt = require('bcryptjs');
// const auth = require("../middleware/auth");

router.get("/view_status", async(req, res) => {
    try {
        res.render("index", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            // master_shop : master
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;