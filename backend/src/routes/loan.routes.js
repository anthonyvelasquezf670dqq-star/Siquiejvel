const express = require('express');
const { createLoan, listLoans, getLoan, returnLoan } = require('../controllers/loan.controller');
const { authenticate, permit } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(authenticate);
router.post('/', permit('admin', 'librarian', 'member'), createLoan);
router.get('/', permit('admin', 'librarian', 'member'), listLoans);
router.get('/:id', permit('admin', 'librarian', 'member'), getLoan);
router.patch('/:id/return', permit('admin', 'librarian'), returnLoan);

module.exports = router;
