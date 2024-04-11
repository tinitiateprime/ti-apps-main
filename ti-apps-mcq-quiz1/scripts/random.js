const { json } = require('stream/consumers');

const fs = require('fs');

// Read the Markdown file
const mdContent = fs.readFileSync('./ti-apps-mcq-quiz1/quiz.md', 'utf8');
//console.log('line 10')
// Split Markdown content into individual lines
const lines = mdContent.split('\n');

// Initialize an array to store questions
let questions = [];

// Initialize an array to track selected questions to avoid duplicates
let selectedQuestions = [];

// Function to generate a random integer within a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to parse questions from Markdown content
function parseQuestions() {
  let currentQuestion = null;
  let options = [];

  lines.forEach(line => {
    if (line.startsWith('###')) {
      // New question detected
      currentQuestion = { question: line.slice(4).trim(), options: [], answer: [] };
      options = [];
    } else if (line.startsWith('a)') || line.startsWith('b)') || line.startsWith('c)') || line.startsWith('d)')) {
      // Option detected
      const option = line.trim();
      options.push(option.slice(3)); // Remove the option prefix (a), b), etc.)
      if (option.endsWith('*')) {
        // Mark the correct answer and remove the '*' marker
        currentQuestion.answer.push(option.split(')')[1].slice(1,-1));
        currentQuestion.options.push(option.slice(0, -1).slice(3)); // Remove the '*' marker
      } else {
        currentQuestion.options.push(option.slice(3));
      }
    } else if (line.trim() === '' && currentQuestion) {
      // End of question detected
      if (currentQuestion.answer !== '') {
        questions.push(currentQuestion);
        currentQuestion = null;
      }
    }
  });
}

// Function to select random questions
function selectRandomQuestions() {
  const totalQuestions = questions.length;
  const maxQuestions = Math.min(5, totalQuestions); // Limiting to 3 questions or total questions if less than 3

  // Reset selected questions
  selectedQuestions = [];

  // Select random questions
  for (let i = 0; i < maxQuestions; i++) {
    let randomIndex;
    do {
      randomIndex = getRandomInt(0, totalQuestions - 1);
    } while (selectedQuestions.includes(randomIndex)); // Ensure no duplicates
    selectedQuestions.push(randomIndex);
  }
}

// Function to generate JSON data for selected questions
function generateRandomJSON() {
  const randomQuestions = selectedQuestions.map(index => questions[index]);

  const jsonData = {
    quiz: {
      questions: randomQuestions
    }
  };

  // Write JSON data to file
  fs.writeFileSync('ti-apps-mcq-quiz1/JSONs/random.json', JSON.stringify(jsonData, null, 2));

  // console.log('Random JSON generated successfully.');
   //console.log(jsonData)
   console.log('Finished executing random.js file.')
}

// Parse questions from Markdown content
parseQuestions();

// Select random questions
selectRandomQuestions();

// Generate and write random JSON data
generateRandomJSON();

// TO GENERATE THE CONTENT FOR ALL THE MARKDOWNS



