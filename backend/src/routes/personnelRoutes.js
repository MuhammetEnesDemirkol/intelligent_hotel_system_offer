const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getAllPersonnel,
  addPersonnel,
  deletePersonnel,
  updatePersonnel,
  getPersonnelById,
  getCleaningStaff,
} = require("../controllers/personnelController");

// Özel route'ları ID route'undan önce tanımla
router.get("/cleaning", auth, getCleaningStaff);

// Temel CRUD route'ları
router.get("/", auth, getAllPersonnel);
router.post("/", auth, addPersonnel);
router.get("/:id", auth, getPersonnelById);
router.put("/:id", auth, updatePersonnel);
router.delete("/:id", auth, deletePersonnel);

module.exports = router;
