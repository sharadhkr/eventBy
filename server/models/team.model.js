const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  leader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Faster lookup for "My Teams"
  },
  size: { 
    type: Number, 
    enum: [2, 4], 
    required: true 
  },
  members: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted'], 
      default: 'pending' 
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// ✅ Prevent the same leader from creating two teams with the same name
TeamSchema.index({ name: 1, leader: 1 }, { unique: true });

// ✅ Faster lookup for notifications (Find teams where I am a pending member)
TeamSchema.index({ "members.user": 1, "members.status": 1 });

module.exports = mongoose.model('Team', TeamSchema);
