const User = require("../../models/User.model");
const Event = require("../../models/Event.model");

// @desc    Get full profile with joined events
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
      .populate("joinedEvents")
      .populate("organizedEvents");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update basic profile and social links
// @route   PATCH /api/users/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Profile updated", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Join an event with capacity & deadline checks
// @route   POST /api/users/join-event/:eventId
exports.joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    const user = await User.findOne({ uid: req.user.uid });

    // 1. Check if event exists
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Check if already joined
    if (user.joinedEvents.includes(eventId)) {
      return res.status(400).json({ message: "Already joined this event" });
    }

    // 3. Check Capacity
    if (event.soldSeats >= event.totalCapacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // 4. Check Deadline
    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }

    // 5. Atomic Update: Join Event
    event.participants.push({ user: user._id, joinedAt: Date.now() });
    event.soldSeats += 1;
    await event.save();

    user.joinedEvents.push(eventId);
    await user.save();

    res.status(200).json({ message: "Successfully joined event", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Ensure this path is 100% correct and NO curly braces { }
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "published" })
      .populate("organiser", "organisationName logo")
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get only events user has joined
// @route   GET /api/users/my-events
exports.getMyEvents = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).populate("joinedEvents");
    res.status(200).json({ count: user.joinedEvents.length, events: user.joinedEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload/Update Resume URL
// @route   PATCH /api/users/update-resume
exports.updateResume = async (req, res) => {
  try {
    const { url, public_id } = req.body;
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { resume: { url, public_id, updatedAt: Date.now() } },
      { new: true }
    );
    res.status(200).json({ message: "Resume updated", resume: user.resume });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
