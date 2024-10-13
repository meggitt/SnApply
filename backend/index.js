const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('');

app.post('/register', (req, res) => {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Already registered");
            } else {
                FormDataModel.create(req.body)
                    .then(log_reg_form => res.json("success"))
                    .catch(err => res.json(err));
            }
        });
});

app.post('/login', (req, res) => {
    // To find record from the database
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // If user found then these 2 cases
                if (user.password === password) {
                    res.json(user);
                } else {
                    res.json("Wrong password");
                }
            } else {
                // If user not found then 
                res.json("No records found!");
            }
        });
});

// New endpoint to update user responses 
app.post('/updateUserResponses', (req, res) => {
    const { user, responses } = req.body; // Extract user and responses from request body
    console.log("resp", responses);
    console.log("uid id", user._id);

    // Build the update object based on the responses
    const updateObject = {};

    // Check if the user is an applicant or recruiter and prepare the update object accordingly
    if (user.roleType === 'Applicant') {
        for (const [key, value] of Object.entries(responses)) {
            if (key.startsWith('Q')) {
                updateObject[`questions.${key}.answer`] = value;
                updateObject[`questions.${key}.completed`] = true; // Mark as completed if answered
            }
        }
        updateObject.profileStatus = true;
    } 

    // Update the user responses in the database
    FormDataModel.findByIdAndUpdate(user._id, { $set: updateObject }, { new: true })
        .then(updatedUser => {
            if (updatedUser) {
                res.json("Submitted successfully"); // Send success message back to client
            } else {
                res.json("User not found");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json("Error updating responses");
        });
});


app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
