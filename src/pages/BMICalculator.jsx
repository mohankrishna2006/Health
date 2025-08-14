import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { profileService } from "../services/profileService";

export default function BMICalculator() {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "",
    activityLevel: ""
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    const { weight, height } = formData;
    if (!weight || !height) return null;
    
    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height) / 100; // Convert cm to meters
    const bmi = weightKg / (heightM * heightM);
    
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal";
    if (bmi < 30) return "overweight";
    return "obese";
  };

  const getBMIInfo = (category) => {
    const info = {
      underweight: {
        label: "Underweight",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Your BMI indicates you may be underweight. Focus on healthy weight gain.",
        icon: "📉"
      },
      normal: {
        label: "Normal Weight",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Excellent! Your BMI is in the healthy range. Maintain your current lifestyle.",
        icon: "✅"
      },
      overweight: {
        label: "Overweight",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description: "Your BMI indicates you may be overweight. Consider a balanced approach to weight management.",
        icon: "⚠️"
      },
      obese: {
        label: "Obese",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Your BMI indicates obesity. Consult with healthcare professionals for a comprehensive plan.",
        icon: "🚨"
      }
    };
    return info[category];
  };

  const getDietRecommendations = (category, bodyType) => {
    const recommendations = {
      underweight: {
        title: "Weight Gain Diet Plan",
        goals: ["Healthy weight gain", "Muscle building", "Increased energy"],
        foods: {
          include: [
            "Nuts and nut butters (almonds, walnuts, cashews)",
            "Healthy oils (ghee, coconut oil, olive oil)",
            "Whole grains (quinoa, brown rice, oats)",
            "Protein-rich foods (paneer, dal, eggs, fish)",
            "Dried fruits and dates",
            "Avocados and bananas",
            "Milk and yogurt",
            "Sweet potatoes and potatoes"
          ],
          avoid: [
            "Processed junk foods",
            "Excessive caffeine",
            "Empty calorie drinks",
            "Refined sugars"
          ]
        },
        vedic: {
          vata: "Focus on warm, cooked foods with healthy fats. Include ghee, nuts, and grounding foods.",
          pitta: "Moderate portions with cooling foods. Include coconut, sweet fruits, and dairy.",
          kapha: "Light but nutritious foods. Include spices, lean proteins, and warming foods.",
          mixed: "Balanced approach with seasonal foods and mindful eating."
        }
      },
      normal: {
        title: "Maintenance Diet Plan",
        goals: ["Maintain current weight", "Optimal nutrition", "Energy balance"],
        foods: {
          include: [
            "Variety of colorful vegetables",
            "Fresh seasonal fruits",
            "Whole grains and millets",
            "Lean proteins (dal, fish, chicken)",
            "Healthy fats in moderation",
            "Nuts and seeds",
            "Herbal teas and water",
            "Fermented foods (yogurt, pickles)"
          ],
          avoid: [
            "Excessive processed foods",
            "Too much sugar",
            "Overeating",
            "Irregular meal times"
          ]
        },
        vedic: {
          vata: "Regular meals with warm, nourishing foods. Include healthy fats and sweet tastes.",
          pitta: "Cooling foods, moderate spices. Include sweet and bitter tastes, avoid excessive heat.",
          kapha: "Light, warm foods with spices. Include bitter and pungent tastes, limit sweet and salty.",
          mixed: "Balanced diet following seasonal guidelines and body constitution needs."
        }
      },
      overweight: {
        title: "Weight Loss Diet Plan",
        goals: ["Gradual weight loss", "Improved metabolism", "Better health markers"],
        foods: {
          include: [
            "Leafy green vegetables",
            "Low-glycemic fruits (berries, apples)",
            "Lean proteins (dal, fish, chicken breast)",
            "Whole grains in moderation",
            "Green tea and herbal teas",
            "Fiber-rich foods",
            "Healthy fats in small amounts",
            "Plenty of water"
          ],
          avoid: [
            "Refined carbohydrates",
            "Sugary drinks and snacks",
            "Fried and processed foods",
            "Large portion sizes",
            "Late night eating"
          ]
        },
        vedic: {
          vata: "Warm, light foods with minimal oil. Include bitter and astringent tastes.",
          pitta: "Cooling, light foods. Include bitter and sweet tastes, avoid spicy foods.",
          kapha: "Light, warm, spicy foods. Include bitter, pungent, and astringent tastes.",
          mixed: "Focus on light, easily digestible foods with appropriate spices for your constitution."
        }
      },
      obese: {
        title: "Therapeutic Diet Plan",
        goals: ["Significant weight reduction", "Metabolic improvement", "Health restoration"],
        foods: {
          include: [
            "Non-starchy vegetables",
            "Low-sugar fruits (limited)",
            "High-quality proteins",
            "Minimal whole grains",
            "Herbal teas and water",
            "Fiber supplements if needed",
            "Anti-inflammatory foods",
            "Portion-controlled meals"
          ],
          avoid: [
            "All processed foods",
            "Sugar and sweeteners",
            "Refined grains",
            "High-fat foods",
            "Alcohol",
            "Large meals"
          ]
        },
        vedic: {
          vata: "Consult Ayurvedic practitioner. Focus on warm, light, easily digestible foods.",
          pitta: "Cooling, bitter foods. Avoid heating spices and focus on detoxification.",
          kapha: "Very light, warm, spicy foods. Include fasting periods and bitter tastes.",
          mixed: "Professional guidance recommended. Focus on constitutional balancing with therapeutic foods."
        }
      }
    };
    return recommendations[category];
  };

  const handleCalculate = async () => {
    if (!formData.weight || !formData.height) {
      alert("Please enter both weight and height");
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(async () => {
      const bmi = calculateBMI();
      const category = getBMICategory(bmi);
      const bmiInfo = getBMIInfo(category);
      const dietPlan = getDietRecommendations(category, formData.bodyType);

      const resultsData = {
        bmi,
        category,
        info: bmiInfo,
        dietPlan
      };

      setResults(resultsData);

      // Save to Supabase if user is authenticated
      if (isAuthenticated && user) {
        try {
          const bmiData = {
            weight: parseFloat(formData.weight),
            height: parseFloat(formData.height),
            age: parseInt(formData.age),
            gender: formData.gender,
            activityLevel: formData.activityLevel,
            bmi: bmi,
            category: category,
            healthGoals: [] // Can be expanded later
          };

          await profileService.saveBMICalculation(user.id, bmiData);
          console.log('BMI calculation saved successfully');
        } catch (error) {
          console.error('Error saving BMI calculation:', error);
          // Don't show error to user as the calculation still worked
        }
      }

      setIsCalculating(false);
    }, 1000);
  };

  const resetCalculator = () => {
    setFormData({
      weight: "",
      height: "",
      age: "",
      gender: "",
      activityLevel: "",
      bodyType: ""
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Smart BMI Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your Body Mass Index and get personalized diet recommendations based on Vedic principles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                📊
              </span>
              Enter Your Details
            </h2>

            <div className="space-y-6">
              {/* Weight and Height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter weight in kg"
                    min="1"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter height in cm"
                    min="50"
                    max="250"
                  />
                </div>
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="light">Light (light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="very-active">Very Active (very hard exercise, physical job)</option>
                </select>
              </div>

              {/* Body Type (Ayurvedic) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ayurvedic Body Type (Optional)
                </label>
                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select your constitution</option>
                  <option value="vata">Vata (Thin, energetic, creative)</option>
                  <option value="pitta">Pitta (Medium build, focused, ambitious)</option>
                  <option value="kapha">Kapha (Sturdy build, calm, steady)</option>
                  <option value="mixed">Mixed Constitution</option>
                </select>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={isCalculating || !formData.weight || !formData.height}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  "Calculate BMI & Get Diet Plan"
                )}
              </button>

              {results && (
                <button
                  onClick={resetCalculator}
                  className="w-full border-2 border-gray-300 text-gray-600 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Calculate Again
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {!results ? (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Calculate</h3>
                <p className="text-gray-600">
                  Enter your details on the left to calculate your BMI and receive personalized diet recommendations based on Vedic principles.
                </p>
              </div>
            ) : (
              <>
                {/* BMI Results */}
                <div className={`bg-white rounded-3xl shadow-2xl p-8 border-2 ${results.info.borderColor}`}>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{results.info.icon}</div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Your BMI: {results.bmi}</h3>
                    <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${results.info.bgColor} ${results.info.color}`}>
                      {results.info.label}
                    </div>
                    <p className="text-gray-600 mt-4 text-lg">{results.info.description}</p>
                  </div>
                </div>

                {/* Diet Recommendations */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                      🥗
                    </span>
                    {results.dietPlan.title}
                  </h3>

                  {/* Goals */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Health Goals:</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.dietPlan.goals.map((goal, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Include */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 text-green-600">✅ Foods to Include:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {results.dietPlan.foods.include.map((food, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {food}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Avoid */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 text-red-600">❌ Foods to Limit/Avoid:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {results.dietPlan.foods.avoid.map((food, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {food}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vedic Recommendations */}
                  {formData.bodyType && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">🕉️</span>
                        Vedic Recommendation for {formData.bodyType.charAt(0).toUpperCase() + formData.bodyType.slice(1)} Constitution:
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {results.dietPlan.vedic[formData.bodyType]}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link
                      to="/diet"
                      state={{
                        bmiData: {
                          bmi: results.bmi,
                          category: results.category,
                          weight: formData.weight,
                          height: formData.height,
                          age: formData.age,
                          gender: formData.gender,
                          activityLevel: formData.activityLevel,
                          healthGoals: formData.healthGoals
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      🍽️ Get Personalized 7-Day Diet Plan
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="flex-1 border-2 border-green-600 text-green-600 py-3 px-6 rounded-xl font-medium hover:bg-green-50 transition-all duration-200"
                    >
                      📄 Print Results
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Understanding BMI Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="text-3xl mb-2">📉</div>
              <h4 className="font-semibold text-blue-600 mb-2">Underweight</h4>
              <p className="text-sm text-gray-600">BMI &lt; 18.5</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-semibold text-green-600 mb-2">Normal</h4>
              <p className="text-sm text-gray-600">BMI 18.5 - 24.9</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
              <div className="text-3xl mb-2">⚠️</div>
              <h4 className="font-semibold text-yellow-600 mb-2">Overweight</h4>
              <p className="text-sm text-gray-600">BMI 25 - 29.9</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-2xl border border-red-200">
              <div className="text-3xl mb-2">🚨</div>
              <h4 className="font-semibold text-red-600 mb-2">Obese</h4>
              <p className="text-sm text-gray-600">BMI ≥ 30</p>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-6 text-sm">
            *BMI is a screening tool and should not be used as a diagnostic tool. Consult with healthcare professionals for comprehensive health assessment.
          </p>
        </div>
      </div>
    </div>
  );
}
