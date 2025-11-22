document.addEventListener('DOMContentLoaded', () => {
  // Start Quiz button
  const startButton = document.getElementById('startQuizBtn'); // matches HTML id
  if (startButton) {
    startButton.addEventListener('click', startQuiz); // call your startQuiz function
  }

  // Submit Quiz button
  const submitButton = document.querySelector('.submit-btn'); // matches HTML class
  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault(); // prevent page reload
      submitAnswers();     // call your submitAnswers function
    });
  }
});