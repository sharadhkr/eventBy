const router = require('express').Router();
const teamCtrl = require('../../controllers/user/Teamcontroller');
const verifyAuth  = require('../../middlewares/firebase.middleware');

router.get('/search', verifyAuth, teamCtrl.searchUsers);
router.post('/create', verifyAuth, teamCtrl.createTeam);
router.get('/invites', verifyAuth, teamCtrl.getInvites);
router.post('/respond', verifyAuth, teamCtrl.respondToInvite);

module.exports = router;
