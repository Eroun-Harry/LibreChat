const express = require('express');
const requireJwtAuth = require('../middleware/requireJwtAuth');
const { getAllUsers } = require('~/models/GetAllUses');

const router = express.Router();
router.use(requireJwtAuth);

router.get('/getAllUsers', async (req, res) => {
  res.status(200).send(await getAllUsers());
});

module.exports = router;
