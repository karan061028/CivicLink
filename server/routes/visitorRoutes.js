const router = require("express").Router();

const {
  addVisitor,
  getVisitors,
  updateVisitor,
  exitVisitor,
  deleteVisitor,
} = require("../controllers/visitorController");


const { protect } = require("../middleware/authMiddleware");


router.get("/", protect, getVisitors);

//ADD VISITOR
router.post("/", protect, addVisitor);

//UPDATE STATUS
router.put("/:id", protect, updateVisitor);

//EXIT VISITOR
router.put("/exit/:id", protect, exitVisitor);

//DELETE
router.delete("/:id", protect, deleteVisitor);

module.exports = router;