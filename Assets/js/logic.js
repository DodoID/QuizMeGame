(function () {
  // Get button elements
  const startBtn = document.getElementById('start');
  const submitBtn = document.getElementById('submit');

  // Get screens
  const startScreen = document.getElementById('start-screen');
  const questionsScreen = document.getElementById('questions');
  const endScreen = document.getElementById('end-screen');

  // Get individual elements
  const questionTitle = document.getElementById('question-title');
  const choices = document.getElementById('choices');
  const feedback = document.getElementById('feedback');
  const feedbackTxt = document.getElementById('feedback-txt');
  const initials = document.getElementById('initials');
  const time = document.getElementById('time');
  const timer = document.getElementById('timer');
  const finalScore = document.getElementById('final-score');

  // Get audio elements
  const audioCorrect = new Audio('./Assets/sfx/correct.wav');
  const audioIncorrect = new Audio('./Assets/sfx/incorrect.wav');

  // Add event listeners inside DOMContentLoaded event
  document.addEventListener('DOMContentLoaded', function () {
      startBtn.addEventListener('click', startQuiz);
      submitBtn.addEventListener('click', submitScore);
  });

  // Declare local variables
  let endFlag = false;
  let questionIndex = 0;
  let resultTimeoutID;
  let penalty = 0;
  let timeAllowance = 90;
  let elapsedTime = 0;
  let startTime = 0;
  let remainingSeconds;
  let scoreObj = {
      time: '',
      initials: ''
  }

  // One time function used to start quiz and begin countdown timer
  function startQuiz() {
      startScreen.classList.add('hide');
      questionsScreen.classList.remove('hide');
      loadNextQuestion();
      countdown();
      timer.classList.remove('hide');
  }

  // Hide existing question and load next question
  function loadNextQuestion(result) {
      if (questionIndex !== 0) {
          clearTimeout(resultTimeoutID);
          feedback.classList.remove('hide');

          if (result) {
              feedbackTxt.textContent = 'Correct!';
          } else {
              feedbackTxt.textContent = 'Incorrect!';
          }

          resultTimeoutID = setTimeout(() => {
              feedback.classList.add('hide');
          }, 1500);
      }

      if (questionIndex >= questions.length) {
          endQuiz();
          return;
      }

      questionObj = questions[questionIndex];
      questionTitle.textContent = questionObj.title;

      choices.innerHTML = "";
      questionObj.answers.forEach((answer, index) => {
          let el = document.createElement('button');
          el.textContent = answer;
          el.dataset.index = index;
          el.onclick = checkAns;
          choices.appendChild(el);
      })
  }

  function checkAns(event) {
      let ans = event.target.dataset.index;

      if (ans == questions[questionIndex].answer) {
          audioCorrect.play();
          questionIndex++;
          loadNextQuestion(true);
      } else {
          deductTime();
          audioIncorrect.play();
          questionIndex++;
          loadNextQuestion(false);
      }
  }

  // One time function to end quiz
  function endQuiz() {
      endFlag = true;
      updateTimer();

      questionsScreen.classList.add('hide');
      endScreen.classList.remove('hide');
      finalScore.textContent = remainingSeconds;

      endScreen.append(feedback);
      scoreObj.time = remainingSeconds;
  }

  function submitScore() {
      let scores;
      let userInitials = initials.value;

      let regex = /^[a-zA-Z]{1,3}$/;
      if (!regex.test(userInitials)) {
          alert('Initials must be between 1 - 3 characters, and only use alphabet characters')
          return;
      }

      scoreObj.initials = userInitials;

      if (scores = localStorage.getItem('scores')) {
          scores = JSON.parse(scores);
          scores.push(scoreObj);
          scores = JSON.stringify(scores);
          localStorage.setItem('scores', scores);
      } else {
          scores = [scoreObj];
          scores = JSON.stringify(scores);
          localStorage.setItem('scores', scores);
      }

      window.location.href = "./highscores.html";
  }

  function countdown() {
      startTime = Date.now();
      updateTimer();
  }

  function updateTimer() {
      elapsedTime = Date.now() - startTime;
      remainingSeconds = Math.max(timeAllowance - Math.floor(elapsedTime / 1000) - penalty, 0);

      let formattedTime = Math.floor(remainingSeconds / 60).toString().padStart(2, "0") + ":" + (remainingSeconds % 60).toString().padStart(2, "0");

      time.textContent = formattedTime;

      if (questionIndex >= questions.length || endFlag) {
          return;
      }

      if (remainingSeconds > 0) {
          requestAnimationFrame(updateTimer);
      } else {
          endQuiz();
      }
  }

  function deductTime() {
      penalty += 10;

      let penaltyEl = document.createElement('div');
      penaltyEl.classList.add('penalty');
      penaltyEl.textContent = '-10';
      timer.appendChild(penaltyEl);

      setTimeout(() => {
          penaltyEl.remove();
      }, 1000);
  }
})();
