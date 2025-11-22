console.log("main.js loaded successfully!");
document.addEventListener("DOMContentLoaded", function() {
  const startQuizBtn = document.getElementById("startQuizBtn");
  if (startQuizBtn) {
    startQuizBtn.addEventListener("click", function() {
      window.location.href = "quiz.html";
    });
  }
<<<<<<< HEAD
});
=======
});
>>>>>>> d6035354a224329eeebd4ab5101ee3d4278ec952
