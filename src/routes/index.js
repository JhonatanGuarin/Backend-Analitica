const express = require('express');
const { handleQuery } = require('../controllers/aiController');
const { testMongoQuery } = require('../controllers/mongoTestController');

const router = express.Router();

router.post('/query', handleQuery);
router.post('/test-mongo', testMongoQuery);

module.exports = router;

