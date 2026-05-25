const express = require('express');
const { createUser, listUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { authenticate, permit } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(authenticate);
router.post('/', permit('admin'), createUser);
router.get('/', permit('admin', 'librarian'), listUsers);
router.get('/:id', permit('admin', 'librarian'), getUser);
router.put('/:id', permit('admin', 'librarian'), updateUser);
router.delete('/:id', permit('admin'), deleteUser);

module.exports = router;
