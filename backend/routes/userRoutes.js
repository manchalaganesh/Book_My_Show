const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  getUsers,
  deleteUser,
  updateUser
} = require('../controllers/userController');

router.post('/signup', createUser);
router.post('/login', loginUser);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id', updateUser);

module.exports = router;