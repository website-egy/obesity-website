document.addEventListener("DOMContentLoaded", () => {

  const toggleEl = document.getElementById("toggleDetails");
  const extra = document.getElementById("extraDetails");

  // Safe toggle (guarded, uses computed style)
  if (toggleEl && extra) {
    toggleEl.addEventListener("click", function () {
      const isHidden = window.getComputedStyle(extra).display === "none";
      extra.style.display = isHidden ? "block" : "none";
      this.textContent = isHidden ? "More details ▲" : "More details ▼";
    });
  }

  // Start Quiz button (home page)
  const startBtn = document.getElementById("startQuizBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
        window.location.href = "quiz.html";
    });
  }

  // Submit Quiz button (quiz page) — only attach if form exists
  const form = document.getElementById("quizForm");
  if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // prevent default page refresh
        // call submitAnswers if available, otherwise fallback
        if (typeof submitAnswers === "function") submitAnswers();
        else if (typeof submitter === "function") submitter();
    });
  }

});