"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:text-gray-100 dark:group-[.toaster]:border-gray-700",
          description:
            "group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-blue-500 group-[.toast]:text-white font-medium hover:group-[.toast]:bg-blue-600",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-900 dark:group-[.toast]:bg-gray-700 dark:group-[.toast]:text-gray-100 font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
