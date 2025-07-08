import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  getUserNativeLanguage,
  saveUserNativeLanguage,
} from "@/lib/translations";

export function useNativeLanguage() {
  const [nativeLanguage, setNativeLanguage] = useState<string>("english");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNativeLanguage = async () => {
      // First check localStorage
      const savedLanguage = getUserNativeLanguage();

      // If we have a saved language that's not the default, use it
      if (savedLanguage !== "english") {
        setNativeLanguage(savedLanguage);
        setIsLoading(false);
        return;
      }

      // If no saved language or it's the default, check user profile
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            const userNativeLanguage = data.user.onboarding?.nativeLanguage;

            if (userNativeLanguage) {
              setNativeLanguage(userNativeLanguage);
              // Save to localStorage for future use
              saveUserNativeLanguage(userNativeLanguage);
            }
          }
        } catch (error) {
          console.error(
            "Failed to fetch user profile for native language:",
            error
          );
        }
      }

      setIsLoading(false);
    };

    fetchNativeLanguage();
  }, [session?.user?.id]);

  const updateNativeLanguage = (language: string) => {
    setNativeLanguage(language);
    saveUserNativeLanguage(language);
  };

  return {
    nativeLanguage,
    updateNativeLanguage,
    isLoading,
  };
}
