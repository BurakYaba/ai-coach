export const onboardingTranslations = {
  en: {
    languageSelection: {
      title: "Welcome to Fluenta",
      subtitle: "Choose your preferred language for onboarding",
      description:
        "Please select your preferred language for the setup process",
      note: "Assessment will be conducted in English to accurately evaluate your language skills",
      languages: {
        en: { name: "English", description: "Continue in English" },
        tr: { name: "Türkçe", description: "Continue in Turkish" },
      },
    },
    welcome: {
      title: "Welcome to AI Coach",
      subtitle: "Your personalized English learning journey starts here",
      description:
        "We'll guide you through a quick setup to create the perfect learning experience tailored just for you.",
      startButton: "Get Started",
      skipButton: "Skip Setup",
    },
    assessment: {
      title: "Skill Assessment",
      subtitle: "Let's evaluate your current English level",
      description:
        "This assessment will help us understand your strengths and create a personalized learning path.",
      note: "⚠️ Assessment is conducted in English to accurately evaluate your language skills",
      startButton: "Start Assessment",
      skipButton: "Skip Assessment",
      backButton: "Back",
      progressText: "Question {current} of {total}",
      submitButton: "Submit Assessment",
      loading: "Processing your results...",
      expectation: {
        title: "What to expect:",
        duration: {
          title: "10-15 Minutes",
          subtitle: "Quick and efficient",
        },
        questions: {
          title: "20 Questions",
          subtitle: "Grammar, Vocabulary & Reading",
        },
        results: {
          title: "Personalized Results",
          subtitle: "Tailored to your level",
        },
      },
      structure: {
        title: "Assessment Structure:",
        grammar: "First 15 questions: Grammar and Vocabulary",
        reading: "Reading passage with 5 comprehension questions",
        immediate: "Immediate personalized results and recommendations",
      },
      important: {
        title: "Important:",
        note: "Answer questions honestly to get accurate level assessment",
      },
      buttons: {
        back: "Back",
        skip: "Skip Assessment",
        start: "Start Assessment",
      },
    },
    preferences: {
      title: "Learning Preferences",
      subtitle: "Tell us about your learning goals and preferences",
      goals: {
        title: "What are your learning goals? (Select all that apply)",
        options: [
          { id: "conversation", label: "Improve Conversation Skills" },
          { id: "business", label: "Business English" },
          { id: "academic", label: "Academic English" },
          { id: "travel", label: "Travel & Tourism" },
          { id: "exam", label: "Exam Preparation" },
          { id: "general", label: "General Improvement" },
        ],
      },
      time: {
        title: "How much time can you dedicate daily?",
        options: [
          {
            id: "15min",
            label: "15 minutes/day",
            description: "Quick daily sessions",
          },
          {
            id: "30min",
            label: "30 minutes/day",
            description: "Balanced learning",
          },
          {
            id: "60min",
            label: "1 hour/day",
            description: "Intensive learning",
          },
          { id: "flexible", label: "Flexible", description: "Varies by day" },
        ],
      },
      difficulty: {
        title: "What difficulty level do you prefer?",
        options: [
          {
            id: "easy",
            label: "Easy",
            description: "Gentle progression with lots of support",
          },
          {
            id: "moderate",
            label: "Moderate",
            description: "Balanced challenge and support",
          },
          {
            id: "challenging",
            label: "Challenging",
            description: "Push yourself with advanced content",
          },
        ],
      },
      focusAreas: {
        title:
          "Which areas would you like to focus on? (Select all that apply)",
        options: [
          { id: "speaking", label: "Speaking & Pronunciation" },
          { id: "listening", label: "Listening Comprehension" },
          { id: "reading", label: "Reading Skills" },
          { id: "writing", label: "Writing Skills" },
          { id: "grammar", label: "Grammar" },
          { id: "vocabulary", label: "Vocabulary Building" },
        ],
      },
      learningStyle: {
        title: "What's your preferred learning style?",
        options: [
          {
            id: "visual",
            label: "Visual",
            description: "Learn through images, charts, and visual aids",
          },
          {
            id: "auditory",
            label: "Auditory",
            description: "Learn through listening and speaking",
          },
          {
            id: "kinesthetic",
            label: "Kinesthetic",
            description: "Learn through hands-on activities",
          },
          {
            id: "mixed",
            label: "Mixed",
            description: "Combination of all learning styles",
          },
        ],
      },
      buttons: {
        back: "Back",
        skip: "Skip",
        continue: "Continue",
      },
    },
    learningPath: {
      title: "Your Learning Path",
      subtitle: "We've created a personalized plan just for you",
      generating: "Generating your personalized learning path...",
      error: "Failed to generate learning path. Please try again.",
      retry: "Try Again",
      modules: {
        title: "Recommended Modules",
        subtitle: "Select the modules you'd like to focus on",
      },
      schedule: {
        title: "Weekly Schedule",
        subtitle: "Here's your suggested learning schedule",
      },
      goals: {
        title: "Learning Goals",
        subtitle: "What you'll achieve with this path",
      },
      buttons: {
        back: "Back",
        skip: "Skip",
        continue: "Continue to Dashboard",
      },
    },
    completion: {
      title: "Setup Complete!",
      subtitle: "Everything is ready for your learning journey to begin",
      description:
        "Your personalized learning path has been created. Let's start improving your English skills!",
      startButton: "Go to Dashboard",
      achievements: {
        assessment: "Skill Assessment Completed",
        goals: "Learning Goals Set",
        path: "Learning Path Created",
      },
      nextSteps: {
        title: "What's Next?",
        items: [
          {
            title: "Start Your First Session",
            description:
              "Begin with personalized lessons tailored to your level",
          },
          {
            title: "Track Your Progress",
            description: "Monitor your improvement with detailed analytics",
          },
          {
            title: "Unlock Achievements",
            description: "Earn badges and rewards as you learn",
          },
        ],
      },
      buttons: {
        dashboard: "Go to Dashboard",
      },
    },
  },
  tr: {
    languageSelection: {
      title: "Fluenta'ya Hoş Geldiniz",
      subtitle: "Kurulum için tercih ettiğiniz dili seçin",
      description: "Lütfen kurulum süreci için tercih ettiğiniz dili seçin",
      note: "Dil becerilerinizi doğru değerlendirmek için değerlendirme İngilizce yapılacaktır",
      languages: {
        en: { name: "English", description: "İngilizce devam et" },
        tr: { name: "Türkçe", description: "Türkçe devam et" },
      },
    },
    welcome: {
      title: "AI Coach'a Hoş Geldiniz",
      subtitle:
        "Kişiselleştirilmiş İngilizce öğrenme yolculuğunuz burada başlıyor",
      description:
        "Size özel mükemmel öğrenme deneyimi oluşturmak için hızlı bir kurulum sürecinde size rehberlik edeceğiz.",
      startButton: "Başlayın",
      skipButton: "Kurulumu Atla",
    },
    assessment: {
      title: "Beceri Değerlendirmesi",
      subtitle: "Mevcut İngilizce seviyenizi değerlendirelim",
      description:
        "Bu değerlendirme güçlü yönlerinizi anlamamıza ve kişiselleştirilmiş bir öğrenme yolu oluşturmamıza yardımcı olacak.",
      note: "⚠️ Dil becerilerinizi doğru değerlendirmek için değerlendirme İngilizce yapılır",
      startButton: "Değerlendirmeyi Başlat",
      skipButton: "Değerlendirmeyi Atla",
      backButton: "Geri",
      progressText: "Soru {current} / {total}",
      submitButton: "Değerlendirmeyi Gönder",
      loading: "Sonuçlarınız işleniyor...",
      expectation: {
        title: "Neler bekleyebilirsiniz:",
        duration: {
          title: "10-15 Dakika",
          subtitle: "Hızlı ve etkili",
        },
        questions: {
          title: "20 Soru",
          subtitle: "Gramer, Kelime Bilgisi ve Okuma",
        },
        results: {
          title: "Kişiselleştirilmiş Sonuçlar",
          subtitle: "Seviyenize uygun",
        },
      },
      structure: {
        title: "Değerlendirme Yapısı:",
        grammar: "İlk 15 soru: Gramer ve Kelime Bilgisi",
        reading: "5 anlama sorusu ile okuma parçası",
        immediate: "Anında kişiselleştirilmiş sonuçlar ve öneriler",
      },
      important: {
        title: "Önemli:",
        note: "Doğru seviye değerlendirmesi için soruları dürüstçe cevaplayın",
      },
      buttons: {
        back: "Geri",
        skip: "Değerlendirmeyi Geç",
        start: "Değerlendirmeyi Başlat",
      },
    },
    preferences: {
      title: "Öğrenme Tercihleri",
      subtitle:
        "Öğrenme hedefleriniz ve tercihleriniz hakkında bize bilgi verin",
      goals: {
        title: "Öğrenme hedefleriniz neler? (Hepsini seçebilirsiniz)",
        options: [
          { id: "conversation", label: "Konuşma Becerilerini Geliştirmek" },
          { id: "business", label: "İş İngilizcesi" },
          { id: "academic", label: "Akademik İngilizce" },
          { id: "travel", label: "Seyahat ve Turizm" },
          { id: "exam", label: "Sınav Hazırlığı" },
          { id: "general", label: "Genel Gelişim" },
        ],
      },
      time: {
        title: "Günlük ne kadar zaman ayırabilirsiniz?",
        options: [
          {
            id: "15min",
            label: "15 dakika/gün",
            description: "Hızlı günlük seanslar",
          },
          {
            id: "30min",
            label: "30 dakika/gün",
            description: "Dengeli öğrenme",
          },
          {
            id: "60min",
            label: "1 saat/gün",
            description: "Yoğun öğrenme",
          },
          { id: "flexible", label: "Esnek", description: "Güne göre değişir" },
        ],
      },
      difficulty: {
        title: "Hangi zorluk seviyesini tercih edersiniz?",
        options: [
          {
            id: "easy",
            label: "Kolay",
            description: "Çok destekle nazik ilerleme",
          },
          {
            id: "moderate",
            label: "Orta",
            description: "Dengeli zorluk ve destek",
          },
          {
            id: "challenging",
            label: "Zorlu",
            description: "İleri içerikle kendinizi zorlayın",
          },
        ],
      },
      focusAreas: {
        title:
          "Hangi alanlara odaklanmak istiyorsunuz? (Hepsini seçebilirsiniz)",
        options: [
          { id: "speaking", label: "Konuşma ve Telaffuz" },
          { id: "listening", label: "Dinleme Anlama" },
          { id: "reading", label: "Okuma Becerileri" },
          { id: "writing", label: "Yazma Becerileri" },
          { id: "grammar", label: "Gramer" },
          { id: "vocabulary", label: "Kelime Bilgisi Geliştirme" },
        ],
      },
      learningStyle: {
        title: "Tercih ettiğiniz öğrenme tarzı nedir?",
        options: [
          {
            id: "visual",
            label: "Görsel",
            description: "Resimler, çizelgeler ve görsel yardımlarla öğrenme",
          },
          {
            id: "auditory",
            label: "İşitsel",
            description: "Dinleme ve konuşma yoluyla öğrenme",
          },
          {
            id: "kinesthetic",
            label: "Kinestetik",
            description: "Uygulamalı aktivitelerle öğrenme",
          },
          {
            id: "mixed",
            label: "Karma",
            description: "Tüm öğrenme tarzlarının kombinasyonu",
          },
        ],
      },
      buttons: {
        back: "Geri",
        skip: "Atla",
        continue: "Devam Et",
      },
    },
    learningPath: {
      title: "Öğrenme Yolunuz",
      subtitle: "Size özel kişiselleştirilmiş bir plan oluşturduk",
      generating: "Kişiselleştirilmiş öğrenme yolunuz oluşturuluyor...",
      error: "Öğrenme yolu oluşturulamadı. Lütfen tekrar deneyin.",
      retry: "Tekrar Dene",
      modules: {
        title: "Önerilen Modüller",
        subtitle: "Odaklanmak istediğiniz modülleri seçin",
      },
      schedule: {
        title: "Haftalık Program",
        subtitle: "İşte önerilen öğrenme programınız",
      },
      goals: {
        title: "Öğrenme Hedefleri",
        subtitle: "Bu yol ile neler başaracaksınız",
      },
      buttons: {
        back: "Geri",
        skip: "Atla",
        continue: "Panoya Devam Et",
      },
    },
    completion: {
      title: "Kurulum Tamamlandı!",
      subtitle: "Öğrenme yolculuğunuza başlamak için her şey hazır",
      description:
        "Kişiselleştirilmiş öğrenme yolunuz oluşturuldu. Hadi İngilizce becerilerinizi geliştirmeye başlayalım!",
      startButton: "Panoya Git",
      achievements: {
        assessment: "Beceri Değerlendirmesi Tamamlandı",
        goals: "Öğrenme Hedefleri Belirlendi",
        path: "Öğrenme Yolu Oluşturuldu",
      },
      nextSteps: {
        title: "Sırada Ne Var?",
        items: [
          {
            title: "İlk Oturumunuzu Başlatın",
            description:
              "Seviyenize göre kişiselleştirilmiş derslerle başlayın",
          },
          {
            title: "İlerlemenizi Takip Edin",
            description: "Detaylı analizlerle gelişiminizi izleyin",
          },
          {
            title: "Başarıları Açın",
            description: "Öğrenirken rozet ve ödüller kazanın",
          },
        ],
      },
      buttons: {
        dashboard: "Panoya Git",
      },
    },
  },
};

// Hook for accessing translations
export function useOnboardingTranslations(language: "en" | "tr") {
  return onboardingTranslations[language];
}

// Learning path translations for the dashboard
export const learningPathTranslations = {
  en: {
    title: "Your Learning Path",
    subtitle: "Personalized roadmap based on your assessment and preferences",
    cards: {
      currentLevel: "Current Level",
      dailyTime: "Daily Time",
      estimatedDuration: "Estimated Duration",
      focusAreas: "Focus Areas",
    },
    modules: {
      reading: "Reading Practice",
      writing: "Writing Skills",
      listening: "Listening Skills",
      speaking: "Speaking Practice",
      vocabulary: "Vocabulary Building",
      grammar: "Grammar Mastery",
      games: "Learning Games",
    },
    studyPlan: {
      title: "3-Phase Study Plan",
      phase1: "Foundation Building",
      phase2: "Skill Development",
      phase3: "Advanced Practice",
    },
    recommendations: {
      title: "Personalized Recommendations",
    },
    preferences: {
      title: "Your Preferences",
      learningStyle: "Learning Style:",
      timeAvailable: "Time Available:",
      goals: "Goals:",
    },
    loading: "Loading your learning path...",
    error: "Learning Path Not Available",
    completeOnboarding: "Complete Onboarding",
  },
  tr: {
    title: "Öğrenme Yolunuz",
    subtitle:
      "Değerlendirmeniz ve tercihlerinize göre kişiselleştirilmiş yol haritası",
    cards: {
      currentLevel: "Mevcut Seviye",
      dailyTime: "Günlük Süre",
      estimatedDuration: "Tahmini Süre",
      focusAreas: "Odak Alanları",
    },
    modules: {
      reading: "Okuma Pratiği",
      writing: "Yazma Becerileri",
      listening: "Dinleme Becerileri",
      speaking: "Konuşma Pratiği",
      vocabulary: "Kelime Bilgisi Geliştirme",
      grammar: "Gramer Ustalığı",
      games: "Öğrenme Oyunları",
    },
    studyPlan: {
      title: "3 Aşamalı Çalışma Planı",
      phase1: "Temel Oluşturma",
      phase2: "Beceri Geliştirme",
      phase3: "İleri Pratik",
    },
    recommendations: {
      title: "Kişiselleştirilmiş Öneriler",
    },
    preferences: {
      title: "Tercihleriniz",
      learningStyle: "Öğrenme Stili:",
      timeAvailable: "Uygun Zaman:",
      goals: "Hedefler:",
    },
    loading: "Öğrenme yolunuz yükleniyor...",
    error: "Öğrenme Yolu Mevcut Değil",
    completeOnboarding: "Kurulumu Tamamla",
  },
};

// User navigation translations
export const userNavTranslations = {
  en: {
    profile: "Profile",
    learningPath: "Learning Path",
    billing: "Billing & Subscription",
    settings: "Settings",
    feedback: "Give Feedback",
    feedbackHistory: "My Feedback History",
    logout: "Log out",
  },
  tr: {
    profile: "Profil",
    learningPath: "Öğrenme Yolu",
    billing: "Faturalama ve Abonelik",
    settings: "Ayarlar",
    feedback: "Geri Bildirim Ver",
    feedbackHistory: "Geri Bildirim Geçmişim",
    logout: "Çıkış Yap",
  },
};
