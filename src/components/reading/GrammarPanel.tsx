"use client";

import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GrammarPoint {
  pattern: string;
  explanation: string;
  examples: string[];
}

interface GrammarPanelProps {
  grammarFocus: GrammarPoint[];
}

export function GrammarPanel({ grammarFocus }: GrammarPanelProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Grammar Focus</h2>
        <p className="text-gray-600">
          Learn and practice the key grammar patterns from this text.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {grammarFocus.map((point, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="text-left">
                <span className="font-semibold">{point.pattern}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">
                    Explanation
                  </h4>
                  <p className="mt-1">{point.explanation}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">
                    Examples
                  </h4>
                  <ul className="list-disc list-inside space-y-2 mt-1">
                    {point.examples.map((example, i) => (
                      <li key={i} className="text-gray-700">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {grammarFocus.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No grammar points to focus on in this text.
        </div>
      )}
    </Card>
  );
}
