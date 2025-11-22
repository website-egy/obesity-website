console.log("main.js loaded successfully!");
document.addEventListener("DOMContentLoaded", function() {
  const startQuizBtn = document.getElementById("startQuizBtn");
  if (startQuizBtn) {
    startQuizBtn.addEventListener("click", function() {
      window.location.href = "quiz.html";
    });
  }
});
