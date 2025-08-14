import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-white flex flex-col">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 md:px-20 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Your Health, <span className="text-green-600">Your Journey</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-3xl">
          Take control of your wellness with our comprehensive health tracking
          platform. Calculate BMI, plan your diet, and track your fitness progress all in one place.
        </p>
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 shadow-lg transition transform hover:scale-105">
            Get Started
          </button>
          <button className="border border-green-600 text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 shadow transition transform hover:scale-105">
            Explore Plans
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mx-auto my-20 px-6">
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2">
          <div className="bg-green-100 rounded-full p-5 mb-4">
            <span className="text-green-600 text-4xl">&#10084;&#65039;</span>
          </div>
          <span className="font-bold text-2xl mb-1">3+</span>
          <span className="text-gray-600">Health Metrics</span>
        </div>

        <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2">
          <div className="bg-green-100 rounded-full p-5 mb-4">
            <span className="text-green-600 text-4xl">&#127919;</span>
          </div>
          <span className="font-bold text-2xl mb-1">Smart</span>
          <span className="text-gray-600">Goal Tracking</span>
        </div>

        <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2">
          <div className="bg-green-100 rounded-full p-5 mb-4">
            <span className="text-green-600 text-4xl">&#128200;</span>
          </div>
          <span className="font-bold text-2xl mb-1">Real-time</span>
          <span className="text-gray-600">Progress</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-green-50 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 rounded-full p-6 mb-4">
              <span className="text-green-600 text-4xl">&#128100;</span>
            </div>
            <h3 className="font-bold text-2xl mb-2">Create Profile</h3>
            <p className="text-gray-600">Set up your health profile and personal goals easily.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 rounded-full p-6 mb-4">
              <span className="text-green-600 text-4xl">&#128202;</span>
            </div>
            <h3 className="font-bold text-2xl mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your BMI, diet, and fitness metrics in real-time.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 rounded-full p-6 mb-4">
              <span className="text-green-600 text-4xl">&#127828;</span>
            </div>
            <h3 className="font-bold text-2xl mb-2">Follow Plans</h3>
            <p className="text-gray-600">Get personalized diet and workout plans to reach your goals.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2">
            <p className="text-gray-600 mb-4">"This platform completely changed how I track my fitness. Highly recommended!"</p>
            <h3 className="font-bold text-green-600">- Alice</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2">
            <p className="text-gray-600 mb-4">"Easy to use, visually appealing, and very effective for diet planning."</p>
            <h3 className="font-bold text-green-600">- Bob</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2">
            <p className="text-gray-600 mb-4">"The real-time progress tracking keeps me motivated every day!"</p>
            <h3 className="font-bold text-green-600">- Clara</h3>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-green-600 text-white text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-6">Start Your Health Journey Today</h2>
        <p className="mb-8 max-w-2xl mx-auto">Join thousands of users improving their wellness with our platform.</p>
        <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 shadow transition transform hover:scale-105">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-20 py-10 text-center text-gray-500 text-sm">
        &copy; 2025 HealthMate. All rights reserved.
      </footer>
    </div>
  );
}
