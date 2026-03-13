const express = require('express');
const { createUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/user', createUser);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
