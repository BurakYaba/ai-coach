import React from "react";

interface HeadingProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function Heading({ title, description, children }: HeadingProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
