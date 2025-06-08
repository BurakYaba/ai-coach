"use client";

import { motion } from "framer-motion";
import { BookOpen, Target, Award, Clock } from "lucide-react";

interface WelcomeStepProps {
  onNext: (data?: any) => void;
  onSkip?: () => void;
  onBack?: () => void;
  data?: any;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Personalized Learning",
      description: "Tailored content based on your skill level and goals",
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Goal-Oriented",
      description: "Set and track your English learning objectives",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Achievement System",
      description: "Earn badges and rewards as you progress",
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Flexible Schedule",
      description: "Learn at your own pace, anytime and anywhere",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to AI Coach
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal English learning journey starts here. Let's create a
          customized learning experience that fits your needs and goals.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
        <ul className="space-y-3 mb-6">
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Quick skill assessment (5-10 minutes)</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Learning preferences and goals setup</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Personalized learning path creation</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Introduction to key features</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <button
          onClick={() => onNext()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Let's Get Started
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          This will take about 5-10 minutes
        </p>
      </motion.div>
    </div>
  );
}
