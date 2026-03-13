const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/users',authMiddleware, getAllUsers);
router.get('/user/:id',authMiddleware, getUserById)
router.put('/user/:id',authMiddleware, updateUser);
router.delete('/user/:id',authMiddleware, deleteUser);

module.exports = router;
