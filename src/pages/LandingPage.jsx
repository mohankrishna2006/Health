import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ users: 0, metrics: 0, success: 0 });
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    // Animated counters
    const animateCounters = () => {
      const targets = { users: 5000, metrics: 15, success: 98 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      
      let current = { users: 0, metrics: 0, success: 0 };
      
      const timer = setInterval(() => {
        current.users = Math.min(current.users + targets.users / steps, targets.users);
        current.metrics = Math.min(current.metrics + targets.metrics / steps, targets.metrics);
        current.success = Math.min(current.success + targets.success / steps, targets.success);
        
        setCounters({
          users: Math.floor(current.users),
          metrics: Math.floor(current.metrics),
          success: Math.floor(current.success)
        });
        
        if (current.users >= targets.users && current.metrics >= targets.metrics && current.success >= targets.success) {
          clearInterval(timer);
        }
      }, increment);
    };
    
    setTimeout(animateCounters, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex flex-col overflow-x-hidden">

      {/* Hero Section */}
      <section className={`flex flex-col items-center justify-center text-center px-6 md:px-20 py-32 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-medium text-green-800 border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          🎉 Now with AI-Powered Health Insights
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
          Transform Your Health with
          <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
            Ancient Wisdom
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-4xl leading-relaxed">
          Discover the power of Vedic health principles combined with modern technology. 
          Track your wellness journey with personalized insights, BMI calculations, and holistic diet planning.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="group bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-block">
                <span className="flex items-center justify-center">
                  Welcome back, {user?.user_metadata?.first_name || 'User'}!
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </Link>
              <Link to="/bmi" className="border-2 border-green-600 text-green-600 px-10 py-4 rounded-xl font-semibold hover:bg-green-50 shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-block text-center">
                Check Your BMI
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="group bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-block">
                <span className="flex items-center justify-center">
                  Start Your Journey
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link to="/bmi" className="border-2 border-green-600 text-green-600 px-10 py-4 rounded-xl font-semibold hover:bg-green-50 shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-block text-center">
                Try BMI Calculator
              </Link>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {counters.users.toLocaleString()}+
            </div>
            <div className="text-gray-600 font-medium">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {counters.metrics}+
            </div>
            <div className="text-gray-600 font-medium">Health Metrics</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {counters.success}%
            </div>
            <div className="text-gray-600 font-medium">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Powerful Features for Your Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of ancient Vedic wisdom and cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* BMI Calculator */}
            <div className="group bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-green-200">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-6 w-fit">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-800">Smart BMI Calculator</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Get instant, accurate BMI calculations with personalized health recommendations based on Vedic principles.
              </p>
              <Link to="/bmi" className="flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                Try Calculator
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Diet Planning */}
            <div className="group bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-blue-200">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-6 w-fit">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-800">Vedic Diet Plans</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Personalized meal plans rooted in Ayurvedic principles, tailored to your body type and health goals.
              </p>
              <Link to="/diet" className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                Explore Plans
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Progress Tracking */}
            <div className="group bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-purple-200">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-6 w-fit">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-800">Real-time Analytics</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Track your wellness journey with detailed analytics, progress charts, and milestone celebrations.
              </p>
              <Link to="/exercise" className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
                View Analytics
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* AI Insights */}
            <div className="group bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-green-200">
              <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-4 mb-6 w-fit">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-800">AI Health Insights</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Get personalized recommendations powered by AI, combining modern data science with ancient wisdom.
              </p>
              <div className="flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                Try AI Coach
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Community */}
            <div className="group bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-orange-200">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 mb-6 w-fit">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-800">Wellness Community</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Connect with like-minded individuals on their wellness journey. Share experiences and stay motivated.
              </p>
              <div className="flex items-center text-orange-600 font-medium group-hover:translate-x-2 transition-transform">
                Join Community
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Mobile App */}
            <div className="group bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-indigo-200">
              <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl p-4 mb-6 w-fit">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-800">Mobile Experience</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Take your wellness journey anywhere with our responsive design and offline capabilities.
              </p>
              <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                Download App
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Your Wellness Journey in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start your transformation today with our scientifically-backed, Vedic-inspired approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-green-500">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-800">Create Your Profile</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm">
                Answer questions about your health goals, lifestyle, and body type. Our AI analyzes your unique constitution using Vedic principles.
              </p>
              <div className="mt-6 flex items-center text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Takes 2 minutes
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-blue-500">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-800">Track Your Progress</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm">
                Monitor your BMI, diet, and wellness metrics in real-time. Get insights and recommendations tailored to your progress.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Real-time updates
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-purple-500">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-800">Achieve Your Goals</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm">
                Follow personalized diet and wellness plans. Celebrate milestones and maintain long-term health with our community support.
              </p>
              <div className="mt-6 flex items-center text-purple-600 font-medium">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Lasting results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community of wellness enthusiasts who have transformed their health journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-green-100">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 text-xl">
                  ★★★★★
                </div>
                <span className="ml-2 text-gray-600 font-medium">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                "VedicVision transformed my approach to health completely. The BMI calculator with Vedic insights helped me understand my body type better than any other platform."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Arjun Patel</h4>
                  <p className="text-gray-600 text-sm">Yoga Instructor, Mumbai</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 text-xl">
                  ★★★★★
                </div>
                <span className="ml-2 text-gray-600 font-medium">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                "The personalized diet plans based on Ayurvedic principles are incredible. I've never felt more balanced and energetic in my life!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Priya Sharma</h4>
                  <p className="text-gray-600 text-sm">Nutritionist, Delhi</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 text-xl">
                  ★★★★★
                </div>
                <span className="ml-2 text-gray-600 font-medium">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                "The AI-powered insights combined with ancient wisdom is genius. Real-time tracking keeps me motivated every single day!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Raj Kumar</h4>
                  <p className="text-gray-600 text-sm">Software Engineer, Bangalore</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-gray-600 mb-8">Trusted by leading wellness professionals</p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="text-2xl font-bold text-gray-400">AYUSH Ministry</div>
              <div className="text-2xl font-bold text-gray-400">Yoga Alliance</div>
              <div className="text-2xl font-bold text-gray-400">WHO Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about VedicVision
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-xl mb-3 text-gray-800">How accurate is the BMI calculator?</h3>
              <p className="text-gray-600 leading-relaxed">
                Our BMI calculator uses WHO-approved formulas combined with Vedic body type analysis for enhanced accuracy. It considers factors like bone density, muscle mass, and constitutional type for personalized results.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-xl mb-3 text-gray-800">What makes VedicVision different from other health apps?</h3>
              <p className="text-gray-600 leading-relaxed">
                We uniquely combine ancient Vedic wisdom with modern AI technology. Our approach considers your individual constitution (Prakriti), seasonal variations, and holistic wellness principles for truly personalized recommendations.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-xl mb-3 text-gray-800">Is the platform suitable for beginners?</h3>
              <p className="text-gray-600 leading-relaxed">
                Absolutely! Our intuitive interface guides you through every step. Whether you're new to wellness tracking or an experienced practitioner, VedicVision adapts to your knowledge level and provides appropriate guidance.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-xl mb-3 text-gray-800">How does the AI-powered coaching work?</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes your health data, progress patterns, and Vedic constitution to provide personalized recommendations. It learns from your preferences and adjusts suggestions for optimal results while respecting traditional wellness principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white text-center py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
            🚀 Limited Time: Get 30% Off Premium Plans
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to Transform Your
            <span className="block text-yellow-300">Wellness Journey?</span>
          </h2>
          
          <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            Join over 5,000+ users who have already discovered the perfect balance of ancient wisdom and modern technology. 
            Start your personalized health transformation today.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
            <Link to="/register" className="group bg-white text-gray-800 px-10 py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-block">
              <span className="flex items-center justify-center">
                Start Free Trial
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link to="/bmi" className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-block text-center">
              Try BMI Calculator
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-300">✓</div>
              <p className="text-sm opacity-80 mt-2">No Credit Card Required</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-300">✓</div>
              <p className="text-sm opacity-80 mt-2">14-Day Free Trial</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-300">✓</div>
              <p className="text-sm opacity-80 mt-2">Cancel Anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  VedicVision
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Transforming wellness through the perfect blend of ancient Vedic wisdom and cutting-edge AI technology. 
                Your journey to optimal health starts here.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-sm">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <span className="text-sm">i</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-green-400 transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-green-400 transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2025 VedicVision. All rights reserved. Made with ❤️ for your wellness journey.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>🌟 Rated 4.9/5 by 5000+ users</span>
              <span>🔒 SSL Secured</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
