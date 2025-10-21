"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"backend" | "frontend">("backend");

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced email processing with natural language understanding",
      icon: "🤖"
    },
    {
      title: "Multi-Language Support",
      description: "Process emails in various languages with automatic translation",
      icon: "🌐"
    },
    {
      title: "Smart Classification",
      description: "Automatically categorize emails by priority, sentiment, and category",
      icon: "🏷️"
    },
    {
      title: "Action Item Extraction",
      description: "Identify and extract actionable items from email content",
      icon: "✅"
    },
    {
      title: "Real-time Processing",
      description: "Instant email analysis with detailed insights",
      icon: "⚡"
    },
    {
      title: "Confidence Scoring",
      description: "AI confidence metrics for reliable decision making",
      icon: "📊"
    }
  ];

  const stats = [
    { value: "99%", label: "Accuracy Rate" },
    { value: "2.5s", label: "Avg Processing Time" },
    { value: "1+", label: "Languages Supported" },
    { value: "24/7", label: "Availability" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
     
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Email
            <span className="text-blue-600"> Workflow</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Automatically analyze, classify, and extract insights from your emails using advanced AI. 
            Save time and focus on what matters most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/backend_process"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200  flex items-center gap-3"
            >
              <span>🚀</span>
              View Processed Emails
            </Link>
            
            <Link 
              href="/emails"
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border border-gray-300 hover:border-blue-300  flex items-center gap-3"
            >
              <span>⚡</span>
              Process New Email
            </Link>
          </div>

          {/* Stats */}

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate and enhance your email processing workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8  duration-300 border border-gray-100 "
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}