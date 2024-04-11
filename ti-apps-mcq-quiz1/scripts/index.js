const mcq_type = localStorage.ques_model
const time_type = localStorage.time_mode
let currentQuestion = 0;
  let selectedAnswers = [];
  let timerInterval =0; 

document.addEventListener('DOMContentLoaded', function () {
   
    const timerDisplay = document.querySelector('#timer');
    if(time_type =='time'){
     quizDurationInSeconds = 500; // 5 minutes
    }
    else if(time_type =='perQuestion'){
         quizDurationInSeconds = 10; // 1 min
    }
    startTimer(quizDurationInSeconds, timerDisplay);
      +localStorage.token
               
});

  //const results = {result :results, time : time}

  
//   document.addEventListener('DOMContentLoaded', function () {
//     runalljson()
//      runrandomjson()
// });


fetch('/ti-apps-mcq-quiz1/random')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
      }
      return response.json();
    })
    .then(data => {
      // Process the JSON data
      debugger
      html = '' 
      html+=`<ul class="list-group">`
      data.quiz.questions.forEach((ques,index)=>{
        if(index+1==1){
          html+= `<li class="list-group-item active ques" id="Q${index+1}">Q${index+1}</li>`
        }else{
        html+= `<li class="list-group-item ques" id="Q${index+1}">Q${index+1}</li>`
        }
      });
      html+=`</ul>`
      $('#quiz-question-container').append(html) 
  const quizData = data.quiz.questions;
  window["quizData"]= data.quiz.questions;
  window["totalQuestions"] = quizData.length;

  // Show the first question initially
  showQuestion(currentQuestion);
  document.getElementById('prev-btn').hidden = true
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
  //console.log(totalQuestions)
  
  function showQuestion(questionNumber) {
      
    document.querySelectorAll('.question-container').forEach(container => {
      container.style.display = 'none';
    });
    document.getElementById('question-container').innerHTML = generateQuestionHTML(window["quizData"][questionNumber]);
    
  }
  let checkans= []
  function nextQuestion() {
      //debugger
       checkans[currentQuestion] = []
    if (currentQuestion < window["totalQuestions"] - 1 ) {
      const radiosel = isRadioSelected()
      if(radiosel==false){
        checkans[currentQuestion] = []
      }else{
        document.getElementById('prev-btn').hidden = false
        checkans[currentQuestion]= (storeAnswer(document.querySelectorAll('input[name="answer'+currentQuestion+'"]:checked')));
    }
      currentQuestion++;
      showQuestion(currentQuestion);
      changequesfun(currentQuestion+1)
      updateProgressBar();
      //updateQuestion();
    }
    else {
      // Last question reached, progress bar at full width
      document.getElementById('progressBar').style.width = '100%';
      //updateQuestion();
  }
  }
 
  function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentQuestion / window["totalQuestions"]) * 100;
    progressBar.style.width = `${progress}%`;
}


  function changequesfun(ques){
    //debugger
    $('.ques').removeClass()

    for(i=1;i<=window["totalQuestions"];i++)
    {
      if(ques == i){
        $('#Q'+i).addClass('list-group-item active ques')
        if(i==window["totalQuestions"]){
          document.getElementById('nxt-btn').hidden = true
        }
      } else{
        $('#Q'+i).addClass('list-group-item  ques')
      }
      
    }

  }
  function prevQuestion() {
    if (currentQuestion > 0) {
      changequesfun(currentQuestion)
      currentQuestion--;
      
      showQuestion(currentQuestion);
      
    }
  }
  
  function generateQuestionHTML(question) {
    if(localStorage.time_mode=="perQuestion"){
      document.getElementById('nxt-btn').hidden = true
      document.getElementById('prev-btn').hidden = true
    }
    else{
      document.getElementById('nxt-btn').hidden = false
      document.getElementById('prev-btn').hidden = false
    }
    if(currentQuestion==0){
      document.getElementById('prev-btn').hidden = true
    }
    let html = `<div class="question-container">`;
    html += `<h2>${question.question}</h2>`;
    question.options.forEach((option, index) => {
      if(localStorage.ques_model=="multipleCorrect"){
        html += `<input type="checkbox" name="answer${currentQuestion}" value="${option}"> ${option}<br>`;
      }else{
      html += `<input type="radio" name="answer${currentQuestion}" value="${option}"> ${option}<br>`;
      }
    });
    html += `</div>`;
    return html;
  }
  
  function storeAnswer(answer) {
    debugger
    let selected = []
    answer.forEach((answer)=>{
      debugger
      selected.push(answer.value)
    })
        return (selected);
      }
  //console.log(selectedAnswers)
  
       function calculateScore(currentQuestion){
        debugger
         checkans[currentQuestion] = []
        const radiosel = isRadioSelected()
        if(radiosel==false){
        checkans[currentQuestion] = []
      }else{
       checkans[currentQuestion] = (storeAnswer(document.querySelectorAll('input[name="answer'+currentQuestion+'"]:checked')));
    }
        window['totalScore'] = 0;
        for (let i = 0; i < window["totalQuestions"]; i++) {
          debugger
          window["quizData"][i].answer.forEach((cross)=>{
            if (checkans[i] == cross) {
              window['totalScore']++;
          }
          })
         
        }
        return window['totalScore'];
      } 
      //console.log(totalScore)
      function startTimer(duration, display) {
        
            let timer = duration, minutes, seconds;
            timerInterval = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = "Time Left: " + minutes + ":" + seconds;
                //display =  minutes + ":" + seconds
                if(time_type =='time'){
                if (--timer < 0) {
                    timer = duration;
                    submitQuiz();
                }
                }
              else if(time_type =='perQuestion'){
                if (--timer < 0) {
            
            timer = duration;
            if(currentQuestion == window["totalQuestions"]-1){
              clearInterval(timerInterval); // Stop the timer when the quiz is submitted
              submitQuiz();
            }else{
            nextQuestion();
            }
          }
            }
                
            }, 1000);
        }
      async function submitQuiz() {
       // debugger
       updateProgressBar();
            clearInterval(timerInterval); // Stop the timer when the quiz is submitted
            timerInterval = document.getElementById('timer').innerHTML.slice(11)
            calculateScore(currentQuestion);
           
            const data = {
              name : localStorage.token,
              result : totalScore,
              timetaken:timerInterval
            }

            $.ajax({
              url: '/ti-apps-mcq-quiz1/submit',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(data),
              success: function(response) {
                  console.log('Data saved:', response);
                  window.location.href = '/ti-apps-mcq-quiz1/index.html';
              },
              error: function(xhr, status, error) {
                  console.error('Error:', error);
                  
              }
          });
            console.log(response)
      }
       
// Here we are checking for the validations
function isRadioSelected() {
var radioGroup = document.getElementsByName('answer'+currentQuestion);

  for (var i = 0; i < radioGroup.length; i++) {
    if (radioGroup[i].checked) {
      return true; // At least one radio button is selected
    }
  }

  return false; // No radio button is selected
}