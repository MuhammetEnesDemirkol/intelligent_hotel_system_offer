const express = require("express");
const {
  getAllHousekeeping,
  updateHousekeeping,
} = require("../controllers/housekeepingController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getAllHousekeeping);
router.put("/:id", authenticateToken, updateHousekeeping);

module.exports = router;
