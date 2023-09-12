var express = require('express');
var router = express.Router();

// Require controller modules.
var person_controller = require('../controllers/personController');

/// PERSON ROUTES ///

// GET request for list of all Person items.
router.get('/', person_controller.person_list);

// GET request for one Person.
router.get('/:id', person_controller.person_detail);

// POST request for creating Person.
router.post('/', person_controller.person_create_post);

// PUT request to update Person.
router.put('/:id', person_controller.person_update_put);

// POST request to delete Person.
router.delete('/:id', person_controller.person_delete_post);

module.exports = router;
