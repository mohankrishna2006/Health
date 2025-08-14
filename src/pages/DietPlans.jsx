import { useState } from "react";

export default function DietPlans() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
    activity: "moderate",
  });
  const [health, setHealth] = useState({ bmi: 0, status: "", advice: "", recommendedDiet: "" });
  const [selectedDiet, setSelectedDiet] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  

  const dietTypes = [
    { name: "Mediterranean", description: "Fruits, vegetables, fish, healthy fats", icon: "🥗" },
    { name: "High Protein", description: "Lean meats, eggs, dairy", icon: "🍗" },
    { name: "Low Carb", description: "Reduce carbs, increase proteins", icon: "🥩" },
    { name: "Vegan", description: "Plant-based meals only", icon: "🌱" },
    { name: "Keto", description: "High fat, moderate protein, very low carbs", icon: "🥓" },
  ];

  const dietMeals = {
    Mediterranean: { breakfast:["Oatmeal+fruit","Greek yogurt+berries"], lunch:["Grilled fish+veggies","Quinoa salad"], dinner:["Baked salmon+salad","Lentil stew"] },
    "High Protein": { breakfast:["Eggs+avocado","Protein shake"], lunch:["Chicken+brown rice","Tuna salad"], dinner:["Salmon+broccoli","Beef stir-fry"] },
    "Low Carb": { breakfast:["Greek yogurt+nuts","Egg muffins"], lunch:["Zucchini noodles+chicken","Cauliflower rice salad"], dinner:["Stir-fry tofu+veggies","Grilled fish+asparagus"] },
    Vegan: { breakfast:["Smoothie bowl","Vegan pancakes"], lunch:["Lentil salad","Chickpea bowl"], dinner:["Veggie stir-fry","Stuffed peppers"] },
    Keto: { breakfast:["Cheese+avocado","Egg muffins"], lunch:["Salmon salad","Chicken Caesar"], dinner:["Steak+asparagus","Zucchini noodles+meatballs"] },
  };

  const questions = [
    { label: "Your height (cm)?", name: "height", type: "number" },
    { label: "Your weight (kg)?", name: "weight", type: "number" },
    { label: "Your age?", name: "age", type: "number" },
    { label: "Gender?", name: "gender", type: "select", options: ["male", "female"] },
    { label: "Activity level?", name: "activity", type: "select", options: ["low", "moderate", "high"] },
  ];

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  const nextStep = () => setStep(step+1);
  const prevStep = () => { if(step>1) setStep(step-1); }

  const submitForm = () => {
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const age = parseInt(form.age);
    const gender = form.gender;

    const bmi = weight / ((height / 100) ** 2);
    let status="", advice="", recommendedDiet="";
    if(bmi<18.5){ status="Underweight"; advice="Increase calorie intake & protein."; recommendedDiet="High Protein"; }
    else if(bmi<25){ status="Normal"; advice="Maintain balanced diet."; recommendedDiet="Mediterranean"; }
    else if(bmi<30){ status="Overweight"; advice="Reduce carbs & exercise regularly."; recommendedDiet="Low Carb"; }
    else{ status="Obese"; advice="Consult doctor & follow strict diet."; recommendedDiet="Low Carb"; }

    setHealth({ bmi: bmi.toFixed(1), status, advice, recommendedDiet });
    setStep(step+1);
  };

  const generate7Day = (type) => {
    const meals = dietMeals[type];
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const age = parseInt(form.age);
    const gender = form.gender;
    const activity = form.activity;
    const bmr = 10*weight + 6.25*height - 5*age + (gender==="male"?5:-161);
    const activityMultiplier = { low:1.2, moderate:1.55, high:1.725 };
    const calories = Math.round(bmr*activityMultiplier[activity]);

    return Array.from({length:7},(_,i)=>({
      day: i+1,
      breakfast: meals.breakfast[i % meals.breakfast.length],
      lunch: meals.lunch[i % meals.lunch.length],
      dinner: meals.dinner[i % meals.dinner.length],
      calories
    }));
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-6">
      <div className="w-full max-w-6xl space-y-6">

        <h1 className="text-4xl font-bold text-center text-green-800">Futuristic Diet Planner</h1>

        {/* Step inputs */}
        {step <= questions.length && (
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-green-200 space-y-6">
            <p className="text-xl font-semibold text-green-700">{questions[step-1].label}</p>
            {questions[step-1].type==="select"?(
              <select className="w-full p-3 rounded-lg border border-green-300" name={questions[step-1].name} value={form[questions[step-1].name]} onChange={handleChange}>
                {questions[step-1].options.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ):(
              <input className="w-full p-3 rounded-lg border border-green-300" type={questions[step-1].type} name={questions[step-1].name} value={form[questions[step-1].name]} onChange={handleChange}/>
            )}
            <div className="flex justify-between">
              {step>1 && <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Back</button>}
              {step<questions.length && <button onClick={nextStep} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-auto">Next</button>}
              {step===questions.length && <button onClick={submitForm} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-auto">Choose Diet</button>}
            </div>
          </div>
        )}

        {/* Show all diets for selection */}
        {step === questions.length + 1 && !showPlan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dietTypes.map(diet=>{
              const isRecommended = diet.name === health.recommendedDiet;
              return (
                <div key={diet.name} onClick={()=>{setSelectedDiet(diet.name); setShowPlan(true)}} 
                     className={`cursor-pointer relative p-6 rounded-3xl bg-white/40 backdrop-blur-md shadow-lg border border-green-200 hover:scale-105 transform transition ${isRecommended ? "ring-4 ring-green-400" : ""}`}>
                  {isRecommended && <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 text-xs rounded-full">Recommended ✅</div>}
                  <p className="text-4xl text-center">{diet.icon}</p>
                  <h2 className="text-xl font-bold text-green-800 text-center mt-2">{diet.name}</h2>
                  <p className="text-sm text-green-700 text-center">{diet.description}</p>
                  {isRecommended && <p className="mt-2 text-center font-bold text-green-900">We recommend this diet for you!</p>}
                </div>
              )
            })}
          </div>
        )}

        {/* Show selected diet 7-day plan */}
        {showPlan && selectedDiet && (
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-green-200">
              <p className="text-xl text-green-700 font-semibold">Selected Diet: {selectedDiet}</p>
              <p className="text-green-800">Your BMI: {health.bmi} ({health.status})</p>
              <p className="text-green-800">{health.advice}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generate7Day(selectedDiet).map(day=>(
                <div key={day.day} className="p-6 rounded-3xl bg-white/40 backdrop-blur-md shadow-lg border border-green-200 hover:scale-105 transition transform relative">
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Day {day.day}</h2>
                  <p className="text-green-700">🥣 Breakfast: {day.breakfast}</p>
                  <p className="text-green-700">🥗 Lunch: {day.lunch}</p>
                  <p className="text-green-700">🍲 Dinner: {day.dinner}</p>
                  <p className="mt-2 text-sm text-green-800">Calories: {day.calories}</p>
                </div>
              ))}
            </div>

            <button onClick={()=>{
              setForm({ height:"", weight:"", age:"", gender:"male", activity:"moderate"});
              setStep(1);
              setHealth({ bmi:0, status:"", advice:"", recommendedDiet:"" });
              setSelectedDiet("");
              setShowPlan(false);
            }} className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Start Over</button>
          </div>
        )}

      </div>
    </div>
  )
}
