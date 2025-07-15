import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useNativeLanguage() {
  const [nativeLanguage, setNativeLanguage] = useState<string>("turkish");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNativeLanguage = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Always fetch from database to ensure consistency
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          const userNativeLanguage = data.user.onboarding?.nativeLanguage;

          if (userNativeLanguage) {
            setNativeLanguage(userNativeLanguage);
          } else {
            // Fallback to session if database doesn't have it
            const sessionLanguage = session?.user?.nativeLanguage;
            if (sessionLanguage) {
              setNativeLanguage(sessionLanguage);
            }
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch user profile for native language:",
          error
        );
        // Fallback to session
        const sessionLanguage = session?.user?.nativeLanguage;
        if (sessionLanguage) {
          setNativeLanguage(sessionLanguage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNativeLanguage();
  }, [session?.user?.id, session?.user?.nativeLanguage]);

  const updateNativeLanguage = async (language: string) => {
    try {
      // Update in database
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onboarding: {
            nativeLanguage: language,
          },
        }),
      });

      if (response.ok) {
        setNativeLanguage(language);
      }
    } catch (error) {
      console.error("Failed to update native language:", error);
    }
  };

  return {
    nativeLanguage,
    updateNativeLanguage,
    isLoading,
  };
}
