'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FreeConversation } from '@/components/speaking/FreeConversation';

export default function SpeakingPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Speaking Practice</h1>

      <Tabs defaultValue="free-conversation" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="free-conversation">Free Conversation</TabsTrigger>
          <TabsTrigger value="guided-practice">Guided Practice</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
        </TabsList>

        <TabsContent value="free-conversation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Free Conversation</CardTitle>
              <CardDescription>
                Practice your speaking skills in a free-flowing conversation
                with an AI language coach.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FreeConversation />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guided-practice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guided Practice</CardTitle>
              <CardDescription>
                Practice specific speaking scenarios with guided exercises.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pronunciation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pronunciation Practice</CardTitle>
              <CardDescription>
                Focus on improving your pronunciation with targeted exercises.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
