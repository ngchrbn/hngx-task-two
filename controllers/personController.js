const mongoose = require("mongoose");
const Person = require("../models/person");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Persons.
exports.person_list = asyncHandler(async (req, res, next) => {
    const persons = await Person.find({});
    res.json({ persons });
});

// Display detail page for a specific Person.
exports.person_detail = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const person = await Person.findById(id);
    if (!person) {
        return res.status(404).json({ message: "Person not found" });
    }
    res.json({ person });
});


// Handle Person create on POST.
exports.person_create_post = [
    // Validate and sanitize fields.
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Person object with escaped and trimmed data.
        const person = new Person({ name: req.body.name });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.json({ errors: errors.array() });
            return;
        } else {
            // Data from form is valid.
            try {
                await person.save();
                res.json({ person });
            } catch (err) {
                res.status(500).json({ message: "Error saving the person"})
            }
        }
    }),
];

// Handle Person delete on POST.
exports.person_delete_post = asyncHandler(async (req, res, next) => {
    const person = await Person.findByIdAndRemove(req.params.id);
    if (!person) {
        return res.status(404).json({ message: "Person not found" });
    }
    res.json({ message: "Person deleted" });
});

// Update details of a specific Person.
exports.person_update_put = [
    // Validate and sanitize fields.
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.json({ errors: errors.array() });
            return;
        } else {
            // Data is valid.
            const person = await Person.findById(req.params.id);
            if (!person) {
                return res.status(404).json({ message: "Person not found" });
            }
            person.name = req.body.name;
            await person.save();
            res.json({ person });
        }
    }),
];

