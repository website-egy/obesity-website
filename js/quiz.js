// quiz.js

document.addEventListener("DOMContentLoaded", () => {
  // Toggle extra details
  const toggle = document.getElementById("toggleDetails");
  const extra = document.getElementById("extraDetails");
  if (toggle && extra) {
    toggle.addEventListener("click", () => {
      if (extra.style.display === "block") {
        extra.style.display = "none";
        toggle.textContent = "More details ▼";
      } else {
        extra.style.display = "block";
        toggle.textContent = "Less details ▲";
      }
    });
  }

  // Show pregnancy (and lactation) question when gender = female
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  if (genderRadios.length) {
    genderRadios.forEach(r => {
      r.addEventListener("change", () => {
        const preg = document.getElementById("pregnancyQuestion");
        const lact = document.getElementById("lactationQuestion");
        const show = r.value === "female";
        if (preg) preg.style.display = show ? "block" : "none";
        if (lact) lact.style.display = show ? "block" : "none";
      });
    });
  }

  // Submit button -> call submitAnswers
  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      submitAnswers();
    });
  }
});

function submitAnswers() {
  // read / validate weight & height
  const weightEl = document.getElementById("weight");
  const heightEl = document.getElementById("height");
  const weightUnitEl = document.getElementById("weightUnit");
  const heightUnitEl = document.getElementById("heightUnit");

  const weight = weightEl ? parseFloat(weightEl.value) : NaN;
  const height = heightEl ? parseFloat(heightEl.value) : NaN;
  const weightUnit = weightUnitEl ? weightUnitEl.value : "kg";
  const heightUnit = heightUnitEl ? heightUnitEl.value : "cm";

  if (!weight || !height || isNaN(weight) || isNaN(height)) {
    alert("Please enter your weight and height.");
    return;
  }

  // convert to metric
  const weightKg = weightUnit === "lbs" ? weight * 0.45359237 : weight;
  const heightM = heightUnit === "ft" ? height * 0.3048 : height / 100;

  // bmi
  const bmi = weightKg / (heightM * heightM);
  let bmiCategory = "";
  if (bmi < 18.5) bmiCategory = "underweight";
  else if (bmi < 25) bmiCategory = "normal";
  else if (bmi < 30) bmiCategory = "overweight";
  else bmiCategory = "obese";

  localStorage.setItem("bmi", bmi.toFixed(1));
  localStorage.setItem("bmiCategory", bmiCategory);

  // helpers to collect answers
  const getRadioValue = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
  };
  const getCheckboxValues = (name) => {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
  };

  const data = {
    activity: getRadioValue("activity"),
    mealsPerDay: getRadioValue("q2"),
    sleepQuality: getRadioValue("q3"),
    workoutWhere: getRadioValue("q4"),
    symptoms: getCheckboxValues("symptoms"),
    goals: getCheckboxValues("goals"),
    diseases: getCheckboxValues("diseases"),
    diet: (() => {
      // diet in HTML uses checkboxes now; store array if multiple selected
      const d = Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(i => i.value);
      return d.length === 1 ? d[0] : d;
    })(),
    gender: getRadioValue("gender"),
    pregnant: getRadioValue("pregnant"), // may be null
    lactating: getRadioValue("lactating"), // may be null
    age: (document.getElementById("age") && document.getElementById("age").value) || null,
    surgeries: (document.getElementById("surgeries") && document.getElementById("surgeries").value) || null,
    waist: (document.getElementById("waist") && document.getElementById("waist").value) || null,
    hip: (document.getElementById("hip") && document.getElementById("hip").value) || null
  };

  // optional validations
  if (!data.activity) { alert("Please select your activity level."); return; }
  if (!data.gender) { alert("Please select your gender."); return; }

  // --- Calorie calculator (Mifflin-St Jeor + activity multiplier) ---
  // require age value to calculate BMR
  const ageVal = data.age ? parseInt(data.age, 10) : null;
  let maintenanceCalories = null;
  let recommendedCalories = null;
  if (ageVal && !isNaN(ageVal) && data.gender) {
    // height in cm
    const heightCm = heightUnit === "ft" ? height * 30.48 : height;
    const bmr = (data.gender === "male")
      ? (10 * weightKg) + (6.25 * heightCm) - (5 * ageVal) + 5
      : (10 * weightKg) + (6.25 * heightCm) - (5 * ageVal) - 161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const mult = activityMultipliers[data.activity] || 1.2;
    maintenanceCalories = Math.round(bmr * mult);

    // adjust for goals if present
    const goals = data.goals || [];
    if (Array.isArray(goals) && goals.includes("weight_loss")) {
      recommendedCalories = Math.max(1200, maintenanceCalories - 500);
    } else if (Array.isArray(goals) && goals.includes("muscle_gain")) {
      recommendedCalories = maintenanceCalories + 300;
    } else {
      recommendedCalories = maintenanceCalories;
    }

    localStorage.setItem("maintenanceCalories", String(maintenanceCalories));
    localStorage.setItem("recommendedCalories", String(recommendedCalories));
  } else {
    // remove any stale values
    localStorage.removeItem("maintenanceCalories");
    localStorage.removeItem("recommendedCalories");
  }

  // save to localStorage
  Object.keys(data).forEach(key => {
    const val = data[key];
    if (Array.isArray(val)) localStorage.setItem(key, JSON.stringify(val));
    else if (val !== null && val !== "") localStorage.setItem(key, val);
    else localStorage.removeItem(key);
  });

  // redirect to results
  window.location.href = "results.html";
}