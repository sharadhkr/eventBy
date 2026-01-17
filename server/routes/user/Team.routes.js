const router = require('express').Router();
const teamCtrl = require('../../controllers/user/Teamcontroller');
const { verifyFirebaseToken } = require('../../middlewares/firebase.middleware');

router.get('/search', verifyFirebaseToken, teamCtrl.searchUsers);
router.post('/create', verifyFirebaseToken, teamCtrl.createTeam);
router.get('/invites', verifyFirebaseToken, teamCtrl.getInvites);
router.post('/respond', verifyFirebaseToken, teamCtrl.respondToInvite);

module.exports = router;
