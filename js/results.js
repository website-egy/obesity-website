// js/results.js
document.addEventListener("DOMContentLoaded", async () => {
  // Elements
  const resultText = document.getElementById("resultText");
  const mealPlanEl = document.getElementById("mealPlan");
  const workoutPlanEl = document.getElementById("workoutPlan");
  const recommendationsEl = document.getElementById("recommendations");
  const openChatGPTBtn = document.getElementById("openChatGPT");

if (openChatGPTBtn) {
  openChatGPTBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      window.open("https://chat.openai.com/", "_blank");
      alert("Your personalized prompt was copied. Paste it into ChatGPT.");
    } catch (err) {
      window.open("https://chat.openai.com/", "_blank");
    }
  });
}
  const copyBtn = document.getElementById("copyPrompt");

  // toggles
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const el = document.getElementById(id);
      if (!el) return;
      const isCollapsed = el.classList.contains("collapsed");
      document.querySelectorAll(".card-body").forEach(c => c.classList.add("collapsed"));
      if (isCollapsed) el.classList.remove("collapsed");
      btn.textContent = isCollapsed ? "Hide" : "Show";
    });
  });

  // Read stored data (fallbacks for older key names)
  const bmi = localStorage.getItem("bmi");
  const bmiCategory = localStorage.getItem("bmiCategory");

  const activity = localStorage.getItem("activity") || localStorage.getItem("q2") || localStorage.getItem("activityLevel");
  const mealsPerDay = localStorage.getItem("mealsPerDay") || localStorage.getItem("q4") || localStorage.getItem("q2");
  const sleepQuality = localStorage.getItem("sleepQuality") || localStorage.getItem("q3") || localStorage.getItem("q5");
  const workoutWhere = localStorage.getItem("workoutWhere") || localStorage.getItem("q6") || localStorage.getItem("q6");
  let goals = null;
  try { goals = JSON.parse(localStorage.getItem("goals") || 'null') || (localStorage.getItem("q3") ? [localStorage.getItem("q3")] : null); } catch(e) { goals = [localStorage.getItem("q3")] || null; }
  const diet = localStorage.getItem("diet");
  const gender = localStorage.getItem("gender");
  const purpose =
  localStorage.getItem("purpose") ||
  localStorage.getItem("goalPurpose") ||
  "lifestyle";
  const pregnant = localStorage.getItem("pregnant");
  const lactating = localStorage.getItem("lactating");
  const age = localStorage.getItem("age");
  let diseases = null;
  let symptoms = null;
  try { diseases = JSON.parse(localStorage.getItem("diseases") || 'null'); } catch(e) { diseases = null; }
  try { symptoms = JSON.parse(localStorage.getItem("symptoms") || 'null'); } catch(e) { symptoms = null; }
  const waist = localStorage.getItem("waist");
  const hip = localStorage.getItem("hip");
  const surgeries = localStorage.getItem("surgeries");

  if (!bmi || !bmiCategory) {
    if (resultText) resultText.textContent = "Please complete the quiz first!";
    return;
  }

  // Thank you / basic BMI display
  if (resultText) resultText.innerHTML = `Thank you for completing the quiz. Your BMI is <strong>${bmi}</strong> (${bmiCategory.toUpperCase()}).`;

  // Build a ChatGPT prompt from available answers
  function buildChatPrompt() {
    const lines = [];
    lines.push("Create a personalized 5-day meal and workout plan. Use the user's data below to tailor portions, special considerations, and exercise intensity.");
    lines.push("");
    if (bmi) lines.push(`- BMI: ${bmi} (${bmiCategory || "N/A"})`);
    if (age) lines.push(`- Age: ${age}`);
    if (gender) lines.push(`- Gender: ${gender}`);
    if (pregnant) lines.push(`- Pregnant: ${pregnant}`);
    if (lactating) lines.push(`- Lactating: ${lactating}`);
    if (goals && goals.length) lines.push(`- Goals: ${goals.join(", ")}`);
    else if (localStorage.getItem("q3")) lines.push(`- Goal: ${localStorage.getItem("q3")}`);
    if (activity) lines.push(`- Activity level: ${activity}`);
    if (purpose) {
  lines.push(
    `- Purpose: ${
      purpose === "occasion"
        ? "Short-term goal for a specific occasion"
        : "Long-term lifestyle change"
    }`
  );
}
    if (mealsPerDay) lines.push(`- Meals per day: ${mealsPerDay}`);
    if (sleepQuality) lines.push(`- Sleep quality: ${sleepQuality}`);
    if (workoutWhere) lines.push(`- Workout preference: ${workoutWhere}`);
    if (diet) lines.push(`- Dietary preference: ${diet}`);
    if (diseases && diseases.length) lines.push(`- Health conditions: ${diseases.join(", ")}`);
    if (symptoms && symptoms.length) lines.push(`- Symptoms: ${symptoms.join(", ")}`);
    if (waist) lines.push(`- Waist (cm): ${waist}`);
    if (hip) lines.push(`- Hip (cm): ${hip}`);
    if (surgeries) lines.push(`- Surgeries / procedures: ${surgeries}`);
    lines.push("");
    lines.push("Please provide:");
    lines.push("1) A 5-day meal plan with portion suggestions and alternatives for dietary restrictions.");
    lines.push("2) A 5-day workout plan with exercises, sets, reps or duration, and modifications for pregnancy/lactation or medical conditions.");
    lines.push("3) Notes on hydration, supplements (if any), and recovery strategies.");
    lines.push("");
    lines.push("Keep responses concise and in a user-friendly format (day-by-day).");
    return lines.join("\n");
  }

  const prompt = buildChatPrompt();

  // show calorie info if available
  const calorieInfoEl = document.getElementById("calorieInfo");
  const maintenanceCalories = localStorage.getItem("maintenanceCalories");
  const recommendedCalories = localStorage.getItem("recommendedCalories");
  if (calorieInfoEl) {
    if (maintenanceCalories) {
      calorieInfoEl.innerHTML = `Estimated maintenance calories: <strong>${maintenanceCalories} kcal/day</strong>.` +
        (recommendedCalories ? ` Recommended for your goal: <strong>${recommendedCalories} kcal/day</strong>.` : "");
    } else {
      calorieInfoEl.textContent = ""; // nothing to show
    }
  }

  // Set ChatGPT link (note: ChatGPT URL schemes are not guaranteed to prefill for all users; this will attempt to pass a prompt)
  if (chatgptLink) {
    const chatUrl = "https://chat.openai.com/?model=gpt-4&prompt=" + encodeURIComponent(prompt);
    chatgptLink.setAttribute("href", chatUrl);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(prompt);
        alert("Prompt copied to clipboard. Paste it into ChatGPT to generate your plan.");
      } catch (err) {
        alert("Could not copy to clipboard. You can still open ChatGPT using the link.");
      }
    });
  }

  // Use existing generation/render code below but map to the variables we read above
  // Normalize goal/activity/workout inputs used by generators
  const goalKey = (goals && goals.length) ? goals[0] : (localStorage.getItem("q3") || "maintain");
  const activityKey = activity || "moderate";
  const workoutPlace = workoutWhere || "home";

  // Helper to build daily meal templates
  function generateMealDay(goal, activity, dayIndex) {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const day = days[dayIndex];

  const gainMeals = [
    [
      { time: "Breakfast", text: "Oatmeal with banana & peanut butter" },
      { time: "Lunch", text: "Chicken, rice & avocado" },
      { time: "Dinner", text: "Salmon, quinoa & veggies" }
    ],
    [
      { time: "Breakfast", text: "Eggs & whole-grain toast" },
      { time: "Lunch", text: "Beef stir-fry & rice" },
      { time: "Dinner", text: "Pasta with chicken" }
    ],
    [
      { time: "Breakfast", text: "Smoothie with oats & protein" },
      { time: "Lunch", text: "Turkey wrap & salad" },
      { time: "Dinner", text: "Fish & sweet potato" }
    ]
  ];

  const loseMeals = [
    [
      { time: "Breakfast", text: "Greek yogurt & berries" },
      { time: "Lunch", text: "Grilled chicken salad" },
      { time: "Dinner", text: "Steamed fish & veggies" }
    ],
    [
      { time: "Breakfast", text: "Boiled eggs & toast" },
      { time: "Lunch", text: "Tuna salad" },
      { time: "Dinner", text: "Vegetable soup & protein" }
    ]
  ];

  const plans =
    goal.toLowerCase().includes("gain") ? gainMeals :
    goal.toLowerCase().includes("lose") ? loseMeals :
    gainMeals;

  const meals = plans[dayIndex % plans.length];
  return { day, meals };
}

  // Helper to build daily workout templates (home/gym)
  function generateWorkoutDay(goal, place, dayIndex) {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const day = days[dayIndex];

  const homeGain = [
    ["Push-ups 4x10", "Squats 4x12", "Plank 3x30s"],
    ["Lunges 3x12", "Shoulder taps 3x20", "Glute bridges 4x15"],
    ["Burpees 3x10", "Core circuit 15 min"]
  ];

  const homeLose = [
    ["HIIT 20 min", "Jump squats", "Plank"],
    ["Brisk walk 40 min", "Stretching"],
    ["Cardio circuit 30 min"]
  ];

  let workouts =
    goal.toLowerCase().includes("gain") ? homeGain :
    goal.toLowerCase().includes("lose") ? homeLose :
    homeGain;

  const exercises = workouts[dayIndex % workouts.length];
  return { day, exercises };
}

  // Build and render 5-day plans
  const mealDays = [];
  const workoutDays = [];
  for (let i = 0; i < 5; i++) {
    mealDays.push(generateMealDay(goalKey, activityKey, i));
    workoutDays.push(generateWorkoutDay(goalKey, workoutPlace, i));
  }

  function renderMealPlan(days) {
    let html = "";
    days.forEach(d => {
      html += `<div class="meal-day"><h4>${d.day}</h4><ul>`;
      d.meals.forEach(m => html += `<li><strong>${m.time}:</strong> ${m.text}</li>`);
      html += `</ul></div>`;
    });
    if (mealPlanEl) mealPlanEl.innerHTML = html;
  }

  function renderWorkoutPlan(days) {
    let html = "";
    days.forEach(d => {
      html += `<div class="workout-day"><h4>${d.day}</h4><ul>`;
      d.exercises.forEach(ex => html += `<li>${ex}</li>`);
      html += `</ul></div>`;
    });
    if (workoutPlanEl) workoutPlanEl.innerHTML = html;
  }

  function buildRecommendations() {
    const recs = [];
    recs.push(`<p><strong>Hydration:</strong> Aim for 1.5–3L/day depending on activity.</p>`);
    recs.push(`<p><strong>Sleep:</strong> ${ sleepQuality === "poor" ? 'Improve sleep hygiene (consistent bedtime & avoid screens).' : sleepQuality === "average" ? 'Keep regular sleep times.' : 'Great — keep it up!' }</p>`);
    recs.push(`<p><strong>Movement:</strong> ${ activityKey === "sedentary" ? 'Add short walks or active breaks.' : activityKey === "light" ? 'Increase to moderate activity if possible.' : 'Maintain consistent activity levels.' }</p>`);
    if (recommendationsEl) recommendationsEl.innerHTML = recs.join("");
  }

  renderMealPlan(mealDays);
  renderWorkoutPlan(workoutDays);
  buildRecommendations();

  // PDF generation: uses jsPDF + html2canvas
  const { jsPDF } = window.jspdf;

  async function generateMealPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("5-Day Meal Plan", 40, 40);
    doc.setFontSize(11);
    let y = 70;
    for (let i = 0; i < mealDays.length; i++) {
      doc.setFontSize(14);
      doc.text(mealDays[i].day, 40, y); y += 18;
      doc.setFontSize(11);
      mealDays[i].meals.forEach(m => {
        const text = `${m.time}: ${m.text}`;
        const split = doc.splitTextToSize(text, 500);
        doc.text(split, 50, y);
        y += split.length * 14;
        if (y > 720) { doc.addPage(); y = 40; }
      });
      y += 10;
    }
    const filename = `mealplan_${goalKey}_${bmiCategory}.pdf`;
    doc.save(filename);
  }

  async function generateWorkoutPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("5-Day Workout Plan", 40, 40);
    doc.setFontSize(11);
    let y = 70;
    for (let i = 0; i < workoutDays.length; i++) {
      doc.setFontSize(14);
      doc.text(workoutDays[i].day, 40, y); y += 18;
      doc.setFontSize(11);
      workoutDays[i].exercises.forEach(ex => {
        const split = doc.splitTextToSize("- " + ex, 500);
        doc.text(split, 50, y);
        y += split.length * 14;
        if (y > 720) { doc.addPage(); y = 40; }
      });
      y += 10;
    }
    const filename = `workout_${workoutPlace}_${goalKey}.pdf`;
    doc.save(filename);
  }

  // Connect buttons
  const downloadMealPdfBtn = document.getElementById("downloadMealPdf");
  const downloadWorkoutPdfBtn = document.getElementById("downloadWorkoutPdf");
  if (downloadMealPdfBtn) downloadMealPdfBtn.addEventListener("click", generateMealPDF);
  if (downloadWorkoutPdfBtn) downloadWorkoutPdfBtn.addEventListener("click", generateWorkoutPDF);

  const shareBtn = document.getElementById("shareWhatsApp");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const siteUrl = window.location.href;
      const message = encodeURIComponent(
        `My BMI: ${bmi} (${bmiCategory}). Goal: ${goalKey}. I generated a 5-day plan at ${siteUrl}`
      );
      const wa = `https://wa.me/?text=${message}`;
      window.open(wa, "_blank");
    });
  }

  // show first card by default if present
  const firstToggle = document.querySelector(`#card-bmi .toggle-btn`);
  if (firstToggle) firstToggle.click();
});