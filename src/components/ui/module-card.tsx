"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MobileOptimizedImage } from "./mobile-optimized-image";

interface ModuleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  features: string[];
  backgroundImage: string;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
}

export function ModuleCard({
  className,
  title,
  description,
  features,
  backgroundImage,
  gradientFrom,
  gradientTo,
  iconColor,
  ...props
}: ModuleCardProps) {
  return (
    <div className="relative z-1 group" {...props}>
      <div
        className={cn(
          "p-0.5 rounded-2xl bg-gradient-to-r transition-all duration-300 hover:shadow-xl",
          `from-${gradientFrom} to-${gradientTo}`
        )}
      >
        <div
          className={cn(
            "relative bg-background rounded-[1rem] overflow-hidden h-full",
            className
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <MobileOptimizedImage
              src={backgroundImage}
              alt={title}
              width={400}
              height={300}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="relative p-6 md:p-8 h-full flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {title}
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {description}
              </p>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <div
                      className={`w-2 h-2 rounded-full bg-${iconColor}-500 mr-3 flex-shrink-0`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({
  className,
  title,
  description,
  icon,
  ...props
}: FeatureCardProps) {
  return (
    <div className="relative z-1 group" {...props}>
      <div className="p-0.5 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary bg-opacity-50">
        <div
          className={cn(
            "relative bg-background rounded-[1rem] p-6 md:p-8 h-full",
            className
          )}
        >
          <div className="text-4xl mb-4">{icon}</div>
          <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
