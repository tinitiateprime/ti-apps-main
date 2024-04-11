
const fs = require('fs');

// Read the Markdown file
const mdContent = fs.readFileSync('./ti-apps-mcq-quiz1/quiz.md', 'utf8');

const lines = mdContent.split('\n');

const quizData = { quiz: { questions: [] } };
let currentQuestion = {};


    
lines.forEach(line => {
    if (line.startsWith('###')) {
        // New question detected
        if (currentQuestion.question) {
            // Push previous question to quizData
            quizData.quiz.questions.push(currentQuestion);
        }
        // Start a new question
        currentQuestion = { question: '', options: [], answer: '' };
        currentQuestion.question = line.slice(4).trim();
    } else if (line.startsWith('a)') || line.startsWith('b)') || line.startsWith('c)') || line.startsWith('d)')) {
        // Option detected
        const option = line.trim();
        currentQuestion.options.push(option.slice(3)); // Remove the option prefix (a), b), etc.)
        if (option.endsWith('*')) {
            // Mark the correct answer and remove the '*' marker
            currentQuestion.answer = option.split(')')[1].slice(1,-1);
            currentQuestion.options[currentQuestion.options.length - 1] = currentQuestion.options[currentQuestion.options.length - 1].slice(0, -1);
        }
    }
});



// Push the last 
quizData.quiz.questions.push(currentQuestion); 

// Convert JSON object to string
const jsonData = JSON.stringify(quizData, null, 2);

// Write JSON 
fs.writeFileSync('ti-apps-mcq-quiz1/JSONs/quiz.json', jsonData);

// console.log('Conversion complete.');
 //console.log(jsonData)


