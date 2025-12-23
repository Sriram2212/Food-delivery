const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

router.use(protect);

router.post('/favorites', userController.toggleFavorite);
router.get('/favorites', userController.getFavorites);
router.get('/notifications', userController.getNotifications);
router.put('/notifications/read', userController.markRead);

module.exports = router;
