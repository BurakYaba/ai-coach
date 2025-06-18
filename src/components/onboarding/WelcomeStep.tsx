"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  BarChart,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useOnboardingTranslations } from "@/lib/onboarding-translations";

interface WelcomeStepProps {
  onNext: () => void;
  language: "en" | "tr";
}

export default function WelcomeStep({ onNext, language }: WelcomeStepProps) {
  const t = useOnboardingTranslations(language);

  // Define features locally since they're not in translations anymore
  const features = [
    {
      title:
        language === "tr"
          ? "AI Destekli Değerlendirme"
          : "AI-Powered Assessment",
      description:
        language === "tr"
          ? "Akıllı beceri değerlendirmesi"
          : "Intelligent skill evaluation",
      icon: Brain,
    },
    {
      title:
        language === "tr"
          ? "Kişiselleştirilmiş Öğrenme"
          : "Personalized Learning",
      description:
        language === "tr"
          ? "Seviyenize göre özelleştirilmiş"
          : "Customized to your level",
      icon: BookOpen,
    },
    {
      title: language === "tr" ? "Etkileşimli Pratik" : "Interactive Practice",
      description:
        language === "tr" ? "Etkileşimli alıştırmalar" : "Engaging exercises",
      icon: Users,
    },
    {
      title: language === "tr" ? "İlerleme Takibi" : "Progress Tracking",
      description:
        language === "tr" ? "Gelişiminizi izleyin" : "Monitor your improvement",
      icon: BarChart,
    },
  ];

  const expectationItems = [
    language === "tr"
      ? "Hızlı beceri değerlendirmesi (5-10 dakika)"
      : "Quick skill assessment (5-10 minutes)",
    language === "tr"
      ? "Öğrenme tercihleri ve hedef belirleme"
      : "Learning preferences and goals setup",
    language === "tr"
      ? "Kişiselleştirilmiş öğrenme yolu oluşturma"
      : "Personalized learning path creation",
    language === "tr"
      ? "Temel özelliklerin tanıtımı"
      : "Introduction to key features",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Brain className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t.welcome.title}
        </h1>
        <h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
          {t.welcome.subtitle}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t.welcome.description}
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
              <feature.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* What to Expect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 mb-12"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {language === "tr" ? "Neler Bekleyebilirsiniz" : "What to Expect"}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {expectationItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
        >
          <span>{t.welcome.startButton}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>
            {language === "tr"
              ? "Bu işlem yaklaşık 5-10 dakika sürecek"
              : "This will take about 5-10 minutes"}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
