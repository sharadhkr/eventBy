const router = require("express").Router();
const verifyOrganiserJWT = require("../middleware/verifyOrganiserJWT");
const {
  createEvent,
  myEvents,
  updateEvent,
} = require("../controllers/organiser.event.controller");

router.use(verifyOrganiserJWT);

router.post("/events", createEvent);
router.get("/events", myEvents);
router.put("/events/:id", updateEvent);

module.exports = router;
