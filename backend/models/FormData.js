const mongoose = require('mongoose');

// Define a schema for questions with answer and completion status
const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // The text of the question
    answer: { type: String, default: '' },      // The answer provided by the user (default is empty)
    completed: { type: Boolean, default: false } // Indicates if the question has been answered (default is false)
});

const SkillRatingSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
});

const FormDataSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileStatus: { type: Boolean, default: false },
    roleType: { type: String, enum: ['Applicant', 'Recruiter'], required: true }, // Added role type

    // Questions section only for Applicants
    questions: {
        Q1: { type: QuestionSchema, default: { question: 'What is your most recent degree?', answer: '', completed: false } },
        Q2: { type: QuestionSchema, default: { question: 'What is the name of the University?', answer: '', completed: false } },
        Q3: { type: QuestionSchema, default: { question: 'What was or is your major', answer: '', completed: false } },
        Q4: { type: QuestionSchema, default: { question: 'What was or is your GPA?', answer: '', completed: false } },
        Q5: { type: QuestionSchema, default: { question: 'When did you graduate or will be graduating?', answer: '', completed: false } },
        Q6: { type: QuestionSchema, default: { question: 'What is your most recent job experience?', answer: '', completed: false } },
        Q7: { type: QuestionSchema, default: { question: 'What is the name of the company?', answer: '', completed: false } },
        Q8: { type: QuestionSchema, default: { question: 'What was your role?', answer: '', completed: false } },
        Q9: { type: QuestionSchema, default: { question: 'What were your responsibilities?', answer: '', completed: false } },
        Q10: { type: QuestionSchema, default: { question: 'Get verification?', answer: '', completed: false } },
        Q11: { type: QuestionSchema, default: { question: 'What are your skills?', answer: '', completed: false } },
    },
    skills: [SkillRatingSchema],
});

// Middleware to remove questions for Recruiters before saving
FormDataSchema.pre('save', function (next) {
    if (this.roleType === 'Recruiter') {
        this.questions = undefined; // Remove questions for recruiters
        this.skills = undefined;
    }
    next();
});

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;
