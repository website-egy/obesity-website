document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("quizForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // --- Get weight & height ---
    const weight = parseFloat(document.getElementById("weight").value);
    const weightUnit = document.getElementById("weightUnit").value;

    const height = parseFloat(document.getElementById("height").value);
    const heightUnit = document.getElementById("heightUnit").value;

    if (!weight || !height) {
      alert("Please enter your weight and height.");
      return;
    }

    // Convert to metric
    let weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
    let heightM =
      heightUnit === "ft" ? height * 0.3048 : height / 100;

    // --- Calculate BMI ---
    const bmi = weightKg / (heightM * heightM);
    let bmiCategory = "";

    if (bmi < 18.5) bmiCategory = "underweight";
    else if (bmi < 25) bmiCategory = "normal";
    else if (bmi < 30) bmiCategory = "overweight";
    else bmiCategory = "obese";

    // Save BMI
    localStorage.setItem("bmi", bmi.toFixed(1));
    localStorage.setItem("bmiCategory", bmiCategory);

    // --- Collect answers ---
    const answers = {
      q1: document.querySelector('input[name="q1"]:checked'),
      q2: document.querySelector('input[name="q2"]:checked'),
      q3: document.querySelector('input[name="q3"]:checked'),
      q4: document.querySelector('input[name="q4"]:checked'),
      q5: document.querySelector('input[name="q5"]:checked')
    };

    // Check for unanswered
    for (let key in answers) {
      if (!answers[key]) {
        alert("Please answer all questions!");
        return;
      }
    }

    // Save answers
    for (let key in answers) {
      localStorage.setItem(key, answers[key].value);
    }

    // Redirect
    window.location.href = "results.html";
  });
});
