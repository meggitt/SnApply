const mongoose = require('mongoose');

// Define a schema for questions with answer and completion status
const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // The text of the question
    answer: { type: String, default: '' },      // The answer provided by the user (default is empty)
    completed: { type: Boolean, default: false } // Indicates if the question has been answered (default is false)
});

const FormDataSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileStatus: { type: Boolean, default: false },

    // Each question is stored with a default empty answer and a completion status
    Q1: { type: QuestionSchema, default: { question: 'What is your age?', answer: '', completed: false } },
    Q2: { type: QuestionSchema, default: { question: 'Where do you live?', answer: '', completed: false } }
});

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;
