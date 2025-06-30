"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentLanguage } from "@/hooks/use-language-detection";

interface LanguageOption {
  code: "tr" | "en";
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "minimal";
}

export function LanguageSwitcher({
  className = "",
  variant = "default",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = getCurrentLanguage();
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const switchLanguage = (languageCode: "tr" | "en") => {
    // Save language preference
    localStorage.setItem("fluenta-language", languageCode);

    // Get the current path without language prefix, default to "/" if pathname is null
    const currentPath = pathname || "/";
    let newPath = currentPath.replace(/^\/(tr|en)/, "");

    // Add language prefix
    if (languageCode === "tr") {
      // For Turkish, use root path (no prefix)
      newPath = newPath || "/";
    } else {
      // For English, add /en prefix
      newPath = `/en${newPath}`;
    }

    // Navigate to the new path
    router.push(newPath);
    setIsOpen(false);
  };

  if (variant === "minimal") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 h-auto ${className}`}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-sm">{currentLang?.flag}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {languages.map(language => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={`cursor-pointer ${
                currentLanguage === language.code
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              <span className="mr-2">{language.flag}</span>
              <span className="text-sm">{language.nativeName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <Globe className="h-4 w-4" />
          <span>{currentLang?.flag}</span>
          <span className="hidden sm:inline">{currentLang?.nativeName}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map(language => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={`cursor-pointer ${
              currentLanguage === language.code
                ? "bg-accent text-accent-foreground"
                : ""
            }`}
          >
            <span className="mr-3 text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">
                {language.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
