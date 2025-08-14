import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    healthGoals: [],
    subscribeNewsletter: true
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [dietHistory, setDietHistory] = useState([]);
  const [stats, setStats] = useState({
    totalBMICalculations: 0,
    totalDietPlans: 0,
    lastBMI: null,
    lastDietPlan: null
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      console.log('Loading user data for user ID:', user.id);
      
      // Load profile from Supabase
      const { data: profileData, error: profileError } = await profileService.getProfile(user.id);
      
      if (profileData) {
        setProfile({
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          email: profileData.email || user.email || "",
          healthGoals: profileData.health_goals || [],
          subscribeNewsletter: profileData.subscribe_newsletter || true
        });
      } else {
        // Use metadata if no profile in database yet
        setProfile({
          firstName: user.user_metadata?.first_name || "",
          lastName: user.user_metadata?.last_name || "",
          email: user.email || "",
          healthGoals: user.user_metadata?.health_goals || [],
          subscribeNewsletter: user.user_metadata?.subscribe_newsletter || true
        });
      }

      // Load BMI history
      const { data: bmiData, error: bmiError } = await profileService.getBMIHistory(user.id);
      if (bmiData) {
        setBmiHistory(bmiData);
      }

      // Load diet plan history
      const { data: dietData, error: dietError } = await profileService.getDietPlanHistory(user.id);
      console.log('Diet plan data:', dietData, 'Error:', dietError);
      if (dietData) {
        setDietHistory(dietData);
        console.log('Diet history set:', dietData);
      } else {
        console.log('No diet data found');
      }

      // Calculate stats
      setStats({
        totalBMICalculations: bmiData?.length || 0,
        totalDietPlans: dietData?.length || 0,
        lastBMI: bmiData?.[0] || null,
        lastDietPlan: dietData?.[0] || null
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to Supabase profiles table
      const { data, error } = await profileService.upsertProfile(user.id, profile);

      if (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile. Please try again.");
      } else {
        setEditing(false);
        alert("Profile updated successfully!");
        // Reload data to reflect changes
        loadUserData();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const healthGoalOptions = [
    "Weight Management",
    "Improved Energy",
    "Better Sleep",
    "Stress Reduction",
    "Digestive Health",
    "Mental Clarity",
    "Physical Fitness",
    "Emotional Balance"
  ];

  const handleHealthGoalChange = (goal) => {
    setProfile(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">
                {profile.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Welcome, {profile.firstName || "User"}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your profile and track your wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed from this page</p>
                </div>

                {/* Health Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Health Goals
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {healthGoalOptions.map((goal) => (
                      <label key={goal} className={`flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer transition-colors ${!editing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                        <input
                          type="checkbox"
                          checked={profile.healthGoals.includes(goal)}
                          onChange={() => handleHealthGoalChange(goal)}
                          disabled={!editing}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-xs text-gray-700">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.subscribeNewsletter}
                    onChange={(e) => setProfile({...profile, subscribeNewsletter: e.target.checked})}
                    disabled={!editing}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Subscribe to newsletter for wellness tips and updates
                  </label>
                </div>
              </div>

              {editing && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Stats & Actions */}
          <div className="space-y-6">
            {/* Dashboard Statistics */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Health Journey</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.totalBMICalculations}</div>
                  <div className="text-sm text-gray-600">BMI Checks</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalDietPlans}</div>
                  <div className="text-sm text-gray-600">Diet Plans</div>
                </div>
              </div>
              
              {/* Latest BMI */}
              {stats.lastBMI && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Latest BMI</span>
                    <span className="text-lg font-bold text-green-600">{stats.lastBMI.bmi_value}</span>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{stats.lastBMI.bmi_category}</div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/bmi"
                  className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-colors"
                >
                  <span className="text-2xl mr-3">📊</span>
                  <div>
                    <p className="font-medium text-gray-800">BMI Calculator</p>
                    <p className="text-sm text-gray-600">Check your BMI status</p>
                  </div>
                </Link>
                <Link
                  to="/diet"
                  className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-colors"
                >
                  <span className="text-2xl mr-3">🥗</span>
                  <div>
                    <p className="font-medium text-gray-800">Diet Plans</p>
                    <p className="text-sm text-gray-600">Get personalized meal plans</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Account</h3>
              <div className="space-y-3">
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <span className="text-xl mr-3">🚪</span>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BMI History Section */}
        {bmiHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">BMI History</h2>
            <div className="space-y-4">
              {bmiHistory.slice(0, 5).map((bmi, index) => (
                <div key={bmi.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold text-green-600">{bmi.bmi_value}</div>
                      <div className="text-sm text-gray-600 capitalize">{bmi.bmi_category}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(bmi.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Weight: {bmi.weight}kg | Height: {bmi.height}cm | Age: {bmi.age}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {index === 0 && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Latest</span>}
                  </div>
                </div>
              ))}
            </div>
            {bmiHistory.length > 5 && (
              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">Showing 5 most recent calculations</span>
              </div>
            )}
          </div>
        )}

        {/* Diet Plan History Section */}
        {dietHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Diet Plan History</h2>
            <div className="space-y-4">
              {dietHistory.slice(0, 3).map((diet, index) => (
                <div key={diet.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800 capitalize">{diet.diet_type} Diet</div>
                    <div className="text-xs text-gray-500">
                      {new Date(diet.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {diet.calories_per_day ? `${diet.calories_per_day} calories/day` : 'Calories not specified'}
                  </div>
                  {diet.health_goals && diet.health_goals.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {diet.health_goals.map((goal, goalIndex) => (
                        <span key={goalIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {goal}
                        </span>
                      ))}
                    </div>
                  )}
                  {index === 0 && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Current Plan</span>
                      <Link 
                        to="/diet" 
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        View Full Plan
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
