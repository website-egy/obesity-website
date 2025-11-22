document.addEventListener("DOMContentLoaded", function () {
  const resultText = document.getElementById("resultText");
  const planContainer = document.getElementById("planContainer");

  const bmi = localStorage.getItem("bmi");
  const bmiCategory = localStorage.getItem("bmiCategory");

  const q1 = localStorage.getItem("q1");
  const q2 = localStorage.getItem("q2");
  const q3 = localStorage.getItem("q3");
  const q4 = localStorage.getItem("q4");
  const q5 = localStorage.getItem("q5");

  if (!bmi || !q1 || !q2 || !q3 || !q4 || !q5) {
    resultText.textContent = "Please complete the quiz first!";
    return;
  }

  resultText.innerHTML =
    `Your BMI is <strong>${bmi}</strong> (${bmiCategory.toUpperCase()})`;

  let mealPlan = "";
  let workoutPlan = "";

  // --- BMI based recommendations ---
  const bmiAdvice = {
    underweight: "Increase calorie intake with nutrient-dense foods.",
    normal: "Maintain your current balanced diet.",
    overweight: "Reduce calorie intake and increase physical activity.",
    obese: "Seek a structured nutrition plan and consistent exercise."
  };

  mealPlan += `
    <h3>BMI-Based Recommendation</h3>
    <p>${bmiAdvice[bmiCategory]}</p>
  `;

  // --- Q1: Weight description ---
  if (q1 === "gain") {
    mealPlan += `
      <h3>Weight-Based Meal Advice</h3>
      <ul>
        <li>High-protein meals (chicken, eggs, beans)</li>
        <li>Healthy oils & fats (olive oil, nuts, avocado)</li>
        <li>Carb-rich meals (rice, pasta, oats)</li>
      </ul>`;
    workoutPlan += `
      <h3>Weight-Based Workout Plan</h3>
      <ul>
        <li>Strength training 4–5x/week</li>
        <li>Minimal cardio</li>
      </ul>`;
  }

  if (q1 === "lose") {
    mealPlan += `
      <h3>Weight-Based Meal Advice</h3>
      <ul>
        <li>Low-calorie meals</li>
        <li>High vegetables & lean proteins</li>
        <li>Avoid sugary drinks</li>
      </ul>`;
    workoutPlan += `
      <h3>Weight-Based Workout Plan</h3>
      <ul>
        <li>Cardio 5–6x/week</li>
        <li>Strength training 2–3x/week</li>
      </ul>`;
  }

  if (q1 === "maintain") {
    mealPlan += `
      <h3>Weight-Based Meal Advice</h3>
      <ul>
        <li>Balanced meals including carbs, protein, and fats</li>
        <li>Hydration and consistent meal times</li>
      </ul>`;
    workoutPlan += `
      <h3>Weight-Based Workout Plan</h3>
      <ul>
        <li>Moderate workouts 3–4x/week</li>
        <li>Mix of cardio & strength</li>
      </ul>`;
  }

  // --- Q2: Activity level ---
if (q2 === "gain") { 
  // Not active
  mealPlan += `
    <h3>Activity Level Advice</h3>
    <p>You are not very active — reduce calories and increase daily movement.</p>`;
} 
else if (q2 === "maintain") { 
  // Moderately active
  mealPlan += `
    <h3>Activity Level Advice</h3>
    <p>You are moderately active — maintain a balanced diet.</p>`;
} 
else if (q2 === "lose") { 
  // Very active
  mealPlan += `
    <h3>Activity Level Advice</h3>
    <p>You are very active — increase protein and complex carbs to support energy levels.</p>`;
}

  // --- Q3: Goal ---
  if (q3 === "gain") {
    mealPlan += `<h3>Goal-Based Foods</h3><p>Increase protein and carbs.</p>`;
  }
  if (q3 === "lose") {
    mealPlan += `<h3>Goal-Based Foods</h3><p>Increase fiber & reduce fats.</p>`;
  }
  if (q3 === "maintain") {
    mealPlan += `<h3>Goal-Based Foods</h3><p>Keep a balanced meal plan.</p>`;
  }

  // --- Q4: Meals per day ---
  if (q4 === "gain") {
    mealPlan += `<p>You need more frequent meals.</p>`;
  } else if (q4 === "lose") {
    mealPlan += `<p>Smaller, more frequent meals recommended.</p>`;
  }

  // --- Q5: Sleep quality ---
  if (q5 === "lose") {
    workoutPlan += `<h3>Sleep Advice</h3><p>Improve sleep to help metabolism.</p>`;
  }

  document.getElementById("mealPlan").innerHTML = mealPlan;
  document.getElementById("workoutPlan").innerHTML = workoutPlan;
  planContainer.style.display = "block";  
});