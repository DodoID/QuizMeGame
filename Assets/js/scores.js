// Get elements
const clear = document.getElementById('clear');
const highscoresList = document.getElementById('highscores');

// Add event listener for clearing scores
clear.addEventListener('click', clearScores);

// Get scores from local storage
let highscores = localStorage.getItem('scores');

// Parse scores from JSON
highscores = JSON.parse(highscores);

// Sort scores in descending order based on time
highscores.sort((a, b) => b.time - a.time);

// Display sorted scores
highscores.forEach((highscore) => {
  let score = document.createElement('li');
  let denomination = (highscore.time == 1) ? 'second' : 'seconds';
  score.innerHTML = `${highscore.initials} - ${highscore.time} ${denomination}`;
  highscoresList.appendChild(score);
});

// Function to clear scores
function clearScores() {
  // Remove scores from local storage
  localStorage.removeItem('scores');
  
  // Clear the displayed scores
  highscoresList.innerHTML = '';
}
