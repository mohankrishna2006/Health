import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { profileService } from "../services/profileService";

export default function DietPlans() {
  const location = useLocation();
  const bmiData = location.state?.bmiData;
  const { user, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(bmiData ? 1 : 0); // Start at step 0 if no BMI data
  const [form, setForm] = useState({
    // Pre-fill with BMI data if available
    height: bmiData?.height || "",
    weight: bmiData?.weight || "",
    age: bmiData?.age || "",
    gender: bmiData?.gender || "male",
    activity: bmiData?.activityLevel || "moderate",
    healthGoals: bmiData?.healthGoals || [],
    dietaryRestrictions: [],
  });
  const [health, setHealth] = useState({ 
    bmi: bmiData?.bmi || 0, 
    status: bmiData?.category || "", 
    advice: "", 
    recommendedDiet: "" 
  });
  const [selectedDiet, setSelectedDiet] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({}); // Track selected meals for each day
  const [dailyCalories, setDailyCalories] = useState(0); // Store calculated calories

  // Auto-calculate recommended diet if BMI data is available
  useEffect(() => {
    if (bmiData) {
      const bmi = bmiData.bmi;
      let advice = "", recommendedDiet = "";
      
      if(bmi < 18.5){ 
        advice = "Increase calorie intake with nourishing foods."; 
        recommendedDiet = 'High Protein';
      }
      else if(bmi < 25){ 
        advice = "Maintain balanced diet with variety."; 
        recommendedDiet = 'Mediterranean';
      }
      else if(bmi < 30){ 
        advice = "Focus on lighter foods and regular exercise."; 
        recommendedDiet = 'Low Carb';
      }
      else{ 
        advice = "Consult healthcare provider & follow structured diet."; 
        recommendedDiet = 'Low Carb';
      }
      
      setHealth(prev => ({ ...prev, advice, recommendedDiet }));
      setStep(2); // Skip to diet selection step
    }
  }, [bmiData]);

  const healthGoalOptions = [
    "Weight Loss", "Weight Gain", "Muscle Building", "Better Digestion", 
    "Increased Energy", "Better Sleep", "Stress Management", "Heart Health"
  ];

  const dietaryRestrictions = [
    "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", 
    "Nut-Free", "Low-Sodium", "Diabetic-Friendly", "None"
  ];

  const dietTypes = [
    { name: "Mediterranean", description: "Fruits, vegetables, fish, healthy fats", icon: "🥗" },
    { name: "High Protein", description: "Lean meats, eggs, dairy", icon: "🍗" },
    { name: "Low Carb", description: "Reduce carbs, increase proteins", icon: "🥩" },
    { name: "Vegan", description: "Plant-based meals only", icon: "🌱" },
    { name: "Keto", description: "High fat, moderate protein, very low carbs", icon: "🥓" },
    { name: "Balanced", description: "Well-rounded nutrition for all", icon: "⚖️" },
  ];

  // questions definition moved below where it can conditionally depend on bmiData

  const comprehensive7DayMeals = {
    "Balanced": {
      breakfast: [
        "Oatmeal with fresh berries & nuts",
        "Whole grain toast with avocado & eggs",
        "Greek yogurt with granola & fruit",
        "Smoothie bowl with mixed fruits",
        "Whole grain cereal with milk & banana",
        "Scrambled eggs with vegetables",
        "Pancakes with fresh fruit"
      ],
      lunch: [
        "Grilled chicken with quinoa & vegetables",
        "Turkey sandwich with whole grain bread",
        "Mixed salad with grilled salmon",
        "Lentil soup with whole grain roll",
        "Chicken & vegetable stir-fry",
        "Tuna salad with mixed greens",
        "Vegetable wrap with hummus"
      ],
      dinner: [
        "Baked fish with roasted vegetables",
        "Chicken breast with sweet potato",
        "Vegetable pasta with lean protein",
        "Grilled turkey with steamed broccoli",
        "Salmon with brown rice & asparagus",
        "Lean beef with mixed vegetables",
        "Tofu stir-fry with brown rice"
      ],
      snacks: [
        "Mixed nuts & fruits", "Greek yogurt", "Whole grain crackers",
        "Apple with peanut butter", "Vegetable sticks with hummus", "Berries & nuts"
      ]
    },
    Mediterranean: { 
      breakfast: [
        "Greek yogurt with honey & walnuts",
        "Oatmeal with fresh berries & olive oil drizzle",
        "Whole grain toast with avocado & tomato",
        "Smoothie with spinach, banana & olive oil",
        "Eggs with vegetables & herbs",
        "Quinoa bowl with fruits & nuts",
        "Whole grain cereal with almond milk"
      ],
      lunch: [
        "Grilled fish with quinoa & vegetables",
        "Mediterranean chickpea salad",
        "Lentil soup with whole grain bread",
        "Grilled vegetables with hummus",
        "Tuna salad with olive oil dressing",
        "Vegetable paella with brown rice",
        "Greek salad with whole grain pita"
      ],
      dinner: [
        "Baked salmon with roasted vegetables",
        "Vegetable ratatouille with quinoa",
        "Grilled chicken with Mediterranean herbs",
        "Stuffed bell peppers with brown rice",
        "Fish stew with vegetables",
        "Vegetable lasagna with whole grains",
        "Grilled vegetables with tahini"
      ],
      snacks: [
        "Mixed nuts & olives", "Fresh fruits", "Hummus with vegetables",
        "Greek yogurt", "Whole grain crackers", "Fresh berries"
      ]
    },
    "High Protein": { 
      breakfast: [
        "Scrambled eggs with spinach & cheese",
        "Protein smoothie with berries",
        "Greek yogurt with protein powder",
        "Egg white omelet with vegetables",
        "Cottage cheese with nuts",
        "Protein pancakes with berries",
        "Turkey sausage with eggs"
      ],
      lunch: [
        "Grilled chicken breast with quinoa",
        "Tuna salad with mixed greens",
        "Lean beef with sweet potato",
        "Salmon with brown rice",
        "Turkey wrap with vegetables",
        "Protein bowl with legumes",
        "Grilled tofu with vegetables"
      ],
      dinner: [
        "Baked cod with steamed broccoli",
        "Lean pork with roasted vegetables",
        "Grilled chicken with asparagus",
        "Turkey meatballs with zucchini noodles",
        "Baked salmon with quinoa",
        "Lean beef stir-fry",
        "Protein-rich vegetable curry"
      ],
      snacks: [
        "Protein bars", "Hard-boiled eggs", "Greek yogurt",
        "Nuts & seeds", "Protein smoothie", "Cottage cheese"
      ]
    },
    "Low Carb": { 
      breakfast: [
        "Avocado & egg bowl",
        "Greek yogurt with nuts (no granola)",
        "Vegetable omelet with cheese",
        "Chia seed pudding with berries",
        "Smoked salmon with cream cheese",
        "Coconut flour pancakes",
        "Egg muffins with vegetables"
      ],
      lunch: [
        "Zucchini noodles with chicken",
        "Cauliflower rice with vegetables",
        "Large salad with protein",
        "Lettuce wraps with turkey",
        "Vegetable soup (no potatoes)",
        "Grilled fish with green vegetables",
        "Stuffed bell peppers (no rice)"
      ],
      dinner: [
        "Grilled steak with asparagus",
        "Baked chicken with broccoli",
        "Fish with cauliflower mash",
        "Vegetable stir-fry with tofu",
        "Zucchini lasagna",
        "Grilled salmon with green beans",
        "Stuffed mushrooms with cheese"
      ],
      snacks: [
        "Nuts & seeds", "Cheese cubes", "Avocado slices",
        "Hard-boiled eggs", "Olives", "Cucumber with hummus"
      ]
    },
    Vegan: { 
      breakfast: [
        "Smoothie bowl with fruits & nuts",
        "Oatmeal with plant milk & berries",
        "Chia pudding with coconut milk",
        "Avocado toast with nutritional yeast",
        "Quinoa breakfast bowl",
        "Vegan protein smoothie",
        "Fruit & nut granola bowl"
      ],
      lunch: [
        "Buddha bowl with quinoa & vegetables",
        "Lentil curry with brown rice",
        "Chickpea salad sandwich",
        "Vegetable stir-fry with tofu",
        "Black bean burrito bowl",
        "Hummus & vegetable wrap",
        "Quinoa tabbouleh salad"
      ],
      dinner: [
        "Vegetable curry with coconut milk",
        "Stuffed bell peppers with quinoa",
        "Lentil bolognese with zucchini noodles",
        "Roasted vegetable & grain bowl",
        "Chickpea & vegetable stew",
        "Vegan chili with cornbread",
        "Stuffed sweet potatoes"
      ],
      snacks: [
        "Fresh fruits", "Nuts & seeds", "Hummus with vegetables",
        "Smoothies", "Energy balls", "Coconut yogurt"
      ]
    },
    Keto: { 
      breakfast: [
        "Eggs with avocado & bacon",
        "Keto coffee with MCT oil",
        "Cheese & spinach omelet",
        "Coconut yogurt with nuts",
        "Smoked salmon with cream cheese",
        "Keto pancakes with butter",
        "Egg & cheese muffins"
      ],
      lunch: [
        "Caesar salad with grilled chicken",
        "Bunless burger with cheese",
        "Salmon salad with avocado",
        "Zucchini noodles with pesto",
        "Keto chicken salad",
        "Cauliflower mac & cheese",
        "Lettuce wraps with meat"
      ],
      dinner: [
        "Ribeye steak with butter",
        "Baked chicken thighs with skin",
        "Pork chops with cauliflower",
        "Salmon with hollandaise sauce",
        "Keto casserole with cheese",
        "Lamb chops with asparagus",
        "Bacon-wrapped vegetables"
      ],
      snacks: [
        "Macadamia nuts", "Cheese crisps", "Pork rinds",
        "Avocado with salt", "Olives", "Fat bombs"
      ]
    }
  };

  // Questions array - exclude height/weight if BMI data is available
  const questions = bmiData ? [
    // Skip basic info if we have BMI data, only ask for preferences
    { label: "Any Dietary Restrictions?", name: "dietaryRestrictions", type: "multiselect", options: dietaryRestrictions },
  ] : [
    // Full questionnaire if no BMI data
    { label: "Your height (cm)?", name: "height", type: "number" },
    { label: "Your weight (kg)?", name: "weight", type: "number" },
    { label: "Your age?", name: "age", type: "number" },
    { label: "Gender?", name: "gender", type: "select", options: ["male", "female"] },
    { label: "Activity level?", name: "activity", type: "select", options: ["low", "moderate", "high"] },
    { label: "Health Goals?", name: "healthGoals", type: "multiselect", options: healthGoalOptions },
    { label: "Dietary Restrictions?", name: "dietaryRestrictions", type: "multiselect", options: dietaryRestrictions },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, [name]: value});
  };

  const handleMultiSelect = (name, value) => {
    const currentValues = form[name] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setForm({...form, [name]: newValues});
  };

  const handleMealChange = (dayIndex, mealType, mealOption) => {
    const dayKey = `day${dayIndex}`;
    setSelectedMeals(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [mealType]: mealOption
      }
    }));
    
    // Update the weekly plan with the new meal selection
    setWeeklyPlan(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [mealType]: mealOption } : day
    ));
  };

  const nextStep = () => setStep(step+1);
  const prevStep = () => { if(step>1) setStep(step-1); }

  const submitForm = () => {
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const age = parseInt(form.age);
    const gender = form.gender;
    const bodyType = form.bodyType;

    const bmi = weight / ((height / 100) ** 2);
    let status="", advice="", recommendedDiet="";
    
    // Determine diet based on BMI and Ayurvedic body type
    if(bmi<18.5){ 
      status="Underweight"; 
      advice="Increase calorie intake with nourishing foods."; 
      recommendedDiet = bodyType === 'vata' ? 'Ayurvedic Vata' : 'High Protein';
    }
    else if(bmi<25){ 
      status="Normal"; 
      advice="Maintain balanced diet according to your constitution."; 
      recommendedDiet = bodyType === 'vata' ? 'Ayurvedic Vata' : 
                       bodyType === 'pitta' ? 'Ayurvedic Pitta' : 
                       bodyType === 'kapha' ? 'Ayurvedic Kapha' : 'Mediterranean';
    }
    else if(bmi<30){ 
      status="Overweight"; 
      advice="Focus on lighter foods and regular exercise."; 
      recommendedDiet = bodyType === 'kapha' ? 'Ayurvedic Kapha' : 'Low Carb';
    }
    else{ 
      status="Obese"; 
      advice="Consult healthcare provider & follow structured diet."; 
      recommendedDiet = bodyType === 'kapha' ? 'Ayurvedic Kapha' : 'Low Carb';
    }

    setHealth({ bmi: bmi.toFixed(1), status, advice, recommendedDiet });
    setStep(step+1);
  };

  const generate7DayPlan = async (dietType) => {
    const meals = comprehensive7DayMeals[dietType];
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const age = parseInt(form.age);
    const gender = form.gender;
    const activity = form.activity;
    
    // Calculate BMR and daily calories
    const bmr = 10*weight + 6.25*height - 5*age + (gender==="male"?5:-161);
    const activityMultiplier = { low:1.2, moderate:1.55, high:1.725 };
    let calories = Math.round(bmr*activityMultiplier[activity]);
    
    // Adjust calories based on health goals
    if(form.healthGoals && form.healthGoals.includes('Weight Loss')) calories -= 300;
    if(form.healthGoals && form.healthGoals.includes('Weight Gain')) calories += 400;
    if(form.healthGoals && form.healthGoals.includes('Muscle Building')) calories += 200;
    
    const weekPlan = Array.from({length:7},(_,i)=>{
      const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i];
      return {
        day: i+1,
        dayName,
        breakfast: meals.breakfast[i],
        lunch: meals.lunch[i],
        dinner: meals.dinner[i],
        snacks: meals.snacks[i % meals.snacks.length],
        calories: Math.round(calories),
        waterIntake: '8-10 glasses',
        tips: getHealthTips(dietType, i+1),
        // Add meal options for selection
        breakfastOptions: meals.breakfast,
        lunchOptions: meals.lunch,
        dinnerOptions: meals.dinner,
        snackOptions: meals.snacks
      };
    });
    
    setWeeklyPlan(weekPlan);
    setDailyCalories(calories); // Store calculated calories
    setShowPlan(true);

    // Save to Supabase if user is authenticated
    if (isAuthenticated && user) {
      try {
        const dietPlanData = {
          dietType: dietType,
          weeklyPlan: weekPlan,
          caloriesPerDay: calories,
          healthGoals: form.healthGoals || []
        };

        const saveResult = await profileService.saveDietPlan(user.id, dietPlanData);
        console.log('Diet plan saved successfully:', saveResult);
        console.log('Saved diet plan data:', dietPlanData);
      } catch (error) {
        console.error('Error saving diet plan:', error);
        // Don't show error to user as the plan generation still worked
      }
    }
  };
  
  const getHealthTips = (dietType, day) => {
    const tips = {
      'Mediterranean': [
        'Use olive oil as your primary cooking fat', 'Include fish 2-3 times per week', 'Eat plenty of colorful vegetables',
        'Choose whole grains over refined ones', 'Enjoy nuts and seeds daily', 'Stay active with regular exercise',
        'Practice mindful eating and enjoy meals socially'
      ],
      'High Protein': [
        'Include protein at every meal', 'Stay hydrated to support kidney function', 'Balance with vegetables and fruits',
        'Choose lean protein sources', 'Time protein intake around workouts', 'Don\'t skip meals',
        'Monitor portion sizes to avoid excess calories'
      ],
      'Low Carb': [
        'Focus on healthy fats and proteins', 'Include low-carb vegetables', 'Stay hydrated and maintain electrolytes',
        'Monitor ketone levels if following keto', 'Don\'t fear healthy fats', 'Plan meals in advance',
        'Listen to your body\'s hunger cues'
      ],
      'Vegan': [
        'Ensure adequate B12 supplementation', 'Combine proteins for complete amino acids', 'Include iron-rich foods with vitamin C',
        'Get enough omega-3 from plant sources', 'Plan balanced meals with variety', 'Monitor protein intake',
        'Include fortified foods for nutrients'
      ],
      'Keto': [
        'Maintain proper electrolyte balance', 'Track your macros carefully', 'Stay well hydrated',
        'Include MCT oil for quick energy', 'Don\'t fear natural fats', 'Plan meals to avoid carb creep',
        'Monitor how you feel and adjust accordingly'
      ],
      'Balanced': [
        'Eat a variety of foods from all groups', 'Practice portion control', 'Stay hydrated throughout the day',
        'Include regular physical activity', 'Eat mindfully without distractions', 'Plan balanced meals ahead',
        'Listen to your body\'s hunger and fullness cues'
      ]
    };
    return tips[dietType] ? tips[dietType][(day-1) % tips[dietType].length] : 'Follow a balanced approach to nutrition';
  };

  // Safeguards for step/question rendering
  const totalSteps = questions?.length || 0;
  const clampedStep = Math.min(Math.max(step, 1), totalSteps || 1);
  const currentQuestion = totalSteps ? questions[clampedStep - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex justify-center items-start p-6">
      <div className="w-full max-w-6xl space-y-6">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🍽️ Personalized Diet Planner
          </h1>
          {bmiData ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-green-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back! 👋</h2>
              <p className="text-gray-600 mb-4">
                Based on your BMI calculation (BMI: {bmiData.bmi}, {bmiData.category}), 
                we'll create a personalized 7-day meal plan for you.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {bmiData.activityLevel?.charAt(0).toUpperCase() + bmiData.activityLevel?.slice(1)} Activity
                </span>
                {bmiData.healthGoals?.length > 0 && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    {bmiData.healthGoals.length} Health Goals
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Create your personalized 7-day meal plan based on your health profile</p>
          )}
        </div>

        {/* No BMI Data - Show link to BMI Calculator */}
        {step === 0 && !bmiData && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-orange-200 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Started with BMI Assessment</h2>
            <p className="text-gray-600 mb-6">
              For the most accurate and personalized diet plan, we recommend starting with a BMI calculation. 
              This helps us understand your body composition and create better meal recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bmi"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                📊 Calculate BMI First (Recommended)
              </Link>
              <button
                onClick={() => setStep(1)}
                className="border-2 border-gray-400 text-gray-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                ⚡ Skip to Diet Planning
              </button>
            </div>
          </div>
        )}

        {/* Step inputs */}
        {currentQuestion && (
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-green-200 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-800">Step {clampedStep} of {totalSteps}</h2>
              <div className="text-sm text-green-600">{totalSteps ? Math.round((clampedStep/totalSteps)*100) : 0}% Complete</div>
            </div>
            
            <p className="text-xl font-semibold text-green-700">{currentQuestion?.label}</p>
            

            
            {/* Multi-select for health goals and dietary restrictions */}
            {currentQuestion?.type === "multiselect" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentQuestion.options?.map(option => (
                  <div key={option}
                       onClick={() => handleMultiSelect(currentQuestion.name, option)}
                       className={`p-3 rounded-lg border-2 cursor-pointer text-center transition ${
                         (form[currentQuestion.name] || []).includes(option) 
                           ? 'border-green-500 bg-green-50 text-green-800' 
                           : 'border-gray-300 hover:border-green-300 text-gray-700'
                       }`}>
                    {option}
                  </div>
                ))}
              </div>
            )}
            
            {/* Regular select and input fields */}
            {currentQuestion?.type === "select" && currentQuestion?.name !== "bodyType" && (
              <select className="w-full p-3 rounded-lg border border-green-300" name={currentQuestion.name} value={form[currentQuestion.name] || ""} onChange={handleChange}>
                {currentQuestion.options?.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
             
            {currentQuestion?.type === "number" && (
              <input 
                className="w-full p-3 rounded-lg border border-green-300" 
                type="number" 
                name={currentQuestion.name} 
                value={form[currentQuestion.name] || ""} 
                onChange={handleChange} 
                placeholder={`Enter your ${String(currentQuestion.label || '').toLowerCase().replace('?', '')}`}
              />
            )}
             
            <div className="flex justify-between">
              {step>1 && <button onClick={prevStep} className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-medium">← Back</button>}
              {clampedStep<totalSteps && <button onClick={nextStep} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-auto font-medium">Next →</button>}
              {clampedStep===totalSteps && <button onClick={submitForm} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-auto font-medium">Generate Plan 🎯</button>}
            </div>
          </div>
        )}

        {/* Show all diets for selection */}
        {(((totalSteps && step === totalSteps + 1) && !bmiData) || (bmiData && step >= 2)) && !showPlan && (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Choose Your Diet Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dietTypes.map(diet=>{
                const isRecommended = diet.name === health.recommendedDiet;
                return (
                  <div key={diet.name} onClick={()=>{setSelectedDiet(diet.name); generate7DayPlan(diet.name);}} 
                       className={`cursor-pointer relative p-6 rounded-3xl bg-white/40 backdrop-blur-md shadow-lg border border-green-200 hover:scale-105 transform transition ${isRecommended ? "ring-4 ring-green-400" : ""}`}>
                    {isRecommended && <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 text-xs rounded-full">Recommended ✅</div>}
                    <p className="text-4xl text-center">{diet.icon}</p>
                    <h2 className="text-xl font-bold text-green-800 text-center mt-2">{diet.name}</h2>
                    <p className="text-sm text-green-700 text-center">{diet.description}</p>
                    {isRecommended && <p className="mt-2 text-center font-bold text-green-900">Perfect for you! 🎯</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Show comprehensive 7-day meal plan */}
        {showPlan && selectedDiet && weeklyPlan.length > 0 && (
          <div className="space-y-8">
            {/* Plan Header */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-green-200">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 Your Personalized 7-Day Meal Plan</h2>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <span className="bg-green-600 text-white px-4 py-2 rounded-full font-medium">{selectedDiet}</span>
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full">BMI: {health.bmi} ({health.status})</span>
                  <span className="bg-purple-600 text-white px-4 py-2 rounded-full">~{dailyCalories} cal/day</span>
                </div>
                <p className="text-gray-700 text-lg">{health.advice}</p>
              </div>
            </div>

            {/* Weekly Plan Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {weeklyPlan.map((day, index) => (
                <div key={day.day} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Day {day.day} - {day.dayName}</h3>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{day.calories} cal</span>
                    </div>
                  </div>

                  {/* Meals with Selection */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🌅</span>
                        <h4 className="font-semibold text-gray-800">Breakfast</h4>
                      </div>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        value={day.breakfast}
                        onChange={(e) => handleMealChange(index, 'breakfast', e.target.value)}
                      >
                        {day.breakfastOptions?.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">☀️</span>
                        <h4 className="font-semibold text-gray-800">Lunch</h4>
                      </div>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        value={day.lunch}
                        onChange={(e) => handleMealChange(index, 'lunch', e.target.value)}
                      >
                        {day.lunchOptions?.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🌙</span>
                        <h4 className="font-semibold text-gray-800">Dinner</h4>
                      </div>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        value={day.dinner}
                        onChange={(e) => handleMealChange(index, 'dinner', e.target.value)}
                      >
                        {day.dinnerOptions?.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🍎</span>
                        <h4 className="font-semibold text-gray-800">Snacks</h4>
                      </div>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        value={day.snacks}
                        onChange={(e) => handleMealChange(index, 'snacks', e.target.value)}
                      >
                        {day.snackOptions?.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    {/* Daily Tip */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">💡</span>
                        <div>
                          <h5 className="font-medium text-gray-800">Daily Tip</h5>
                          <p className="text-gray-600 text-sm">{day.tips}</p>
                        </div>
                      </div>
                    </div>

                    {/* Water Intake */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <span className="text-blue-500 mr-1">💧</span>
                        Water: {day.waterIntake}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                📄 Print Meal Plan
              </button>
              <Link
                to="/bmi"
                className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl font-medium hover:bg-green-50 transition-all duration-200 text-center"
              >
                📊 Calculate New BMI
              </Link>
              <button 
                onClick={() => {
                  setSelectedDiet("");
                  setShowPlan(false);
                  setWeeklyPlan([]);
                  setStep(bmiData ? 2 : questions.length + 1);
                }} 
                className="border-2 border-gray-400 text-gray-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                🔄 Choose Different Plan
              </button>
            </div>

            {/* Additional Information */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📋 Important Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p>• Adjust portion sizes based on your hunger and activity level</p>
                  <p>• Stay hydrated with 8-10 glasses of water daily</p>
                  <p>• Include physical activity as recommended</p>
                </div>
                <div className="space-y-2">
                  <p>• Consult healthcare providers for medical conditions</p>
                  <p>• Listen to your body and make adjustments as needed</p>
                  <p>• Enjoy your meals mindfully and without distractions</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
