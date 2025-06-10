"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  Clock,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Add type declarations for audio context
declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

// Guided practice scenarios with structured steps
const GUIDED_SCENARIOS = [
  // A1 Level Scenarios (Beginner)
  {
    id: "intro_self",
    title: "Self Introduction",
    description: "Learn to introduce yourself confidently in English",
    level: "a1",
    estimatedTime: "10-15 min",
    steps: [
      {
        id: 1,
        title: "Basic Information",
        instruction:
          "Introduce yourself with your name, where you're from, and what you do.",
        example:
          "Hi, my name is Alex. I'm from Tokyo, Japan. I'm a software engineer.",
        prompt:
          "Now introduce yourself. Include your name, where you're from, and what you do.",
        tips: [
          "Speak clearly and slowly",
          "Use simple present tense",
          "Don't worry about perfection",
        ],
      },
      {
        id: 2,
        title: "Hobbies and Interests",
        instruction: "Share what you like to do in your free time.",
        example:
          "In my free time, I enjoy reading books and playing tennis. I also like watching movies.",
        prompt:
          "Tell me about your hobbies and interests. What do you like to do when you're not working?",
        tips: [
          "Use 'I like/enjoy/love + -ing'",
          "Mention 2-3 activities",
          "Be specific if possible",
        ],
      },
      {
        id: 3,
        title: "Goals and Plans",
        instruction: "Talk about your future plans or goals.",
        example:
          "I want to improve my English because I plan to work internationally. I hope to travel more next year.",
        prompt:
          "What are your goals for the future? Why are you learning English?",
        tips: [
          "Use 'I want to/plan to/hope to'",
          "Explain your motivation",
          "Think about short and long-term goals",
        ],
      },
    ],
  },
  {
    id: "daily_routine",
    title: "Daily Routine",
    description: "Describe your typical day and daily activities",
    level: "a1",
    estimatedTime: "12-18 min",
    steps: [
      {
        id: 1,
        title: "Morning Routine",
        instruction: "Describe what you do in the morning.",
        example:
          "I wake up at 7 AM. I brush my teeth, take a shower, and have breakfast. Then I go to work.",
        prompt:
          "Tell me about your morning routine. What do you do when you wake up?",
        tips: [
          "Use simple present tense",
          "Mention specific times",
          "Use time words like 'first', 'then', 'after'",
        ],
      },
      {
        id: 2,
        title: "Work or Study",
        instruction: "Talk about your work or studies during the day.",
        example:
          "I work in an office from 9 to 5. I use a computer and attend meetings. I have lunch at 12 o'clock.",
        prompt:
          "What do you do during the day? Tell me about your work or studies.",
        tips: [
          "Describe your main activities",
          "Mention break times",
          "Keep sentences simple",
        ],
      },
      {
        id: 3,
        title: "Evening Activities",
        instruction: "Describe your evening and what you do before bed.",
        example:
          "In the evening, I cook dinner and watch TV. Sometimes I read a book. I go to bed at 10 PM.",
        prompt: "What do you do in the evening? How do you relax after work?",
        tips: [
          "Use 'in the evening' or 'at night'",
          "Mention relaxing activities",
          "Say when you go to bed",
        ],
      },
    ],
  },
  {
    id: "shopping_basics",
    title: "Shopping for Clothes",
    description: "Practice basic shopping conversations and asking for help",
    level: "a1",
    estimatedTime: "10-15 min",
    steps: [
      {
        id: 1,
        title: "Asking for Help",
        instruction: "Ask a shop assistant for help finding something.",
        example:
          "Excuse me, where can I find t-shirts? Do you have this in blue? Can you help me, please?",
        prompt:
          "You're in a clothing store. Ask for help finding something you want to buy.",
        tips: [
          "Start with 'Excuse me'",
          "Use 'Where can I find...'",
          "Be polite and say 'please'",
        ],
      },
      {
        id: 2,
        title: "Trying Things On",
        instruction: "Ask about sizes and trying on clothes.",
        example:
          "Can I try this on? Where is the fitting room? Do you have this in size medium?",
        prompt:
          "You want to try on some clothes. Ask about sizes and the fitting room.",
        tips: [
          "Ask 'Can I try this on?'",
          "Know basic sizes: small, medium, large",
          "Ask 'Where is...' for locations",
        ],
      },
      {
        id: 3,
        title: "Paying",
        instruction: "Ask about prices and pay for your items.",
        example:
          "How much is this? Can I pay by card? Here's my credit card, please.",
        prompt: "You want to buy the clothes. Ask about the price and pay.",
        tips: [
          "Ask 'How much is...' for prices",
          "Say how you want to pay",
          "Say 'thank you' when finished",
        ],
      },
    ],
  },

  // Additional A1 Level Scenarios (Beginner)
  {
    id: "family_friends",
    title: "Family and Friends",
    description: "Talk about your family members and close friends",
    level: "a1",
    estimatedTime: "10-15 min",
    steps: [
      {
        id: 1,
        title: "Family Members",
        instruction: "Describe your family members and their ages.",
        example:
          "I have a small family. My father is 50 years old and he is a teacher. My mother is 45 and she works in a hospital. I have one sister who is 20.",
        prompt: "Tell me about your family. Who is in your family?",
        tips: [
          "Use 'I have...' to talk about family",
          "Mention ages and jobs",
          "Use simple present tense",
        ],
      },
      {
        id: 2,
        title: "Best Friend",
        instruction: "Describe your best friend and what you do together.",
        example:
          "My best friend is Maria. She is very funny and kind. We like to go shopping together and watch movies. She lives near my house.",
        prompt: "Tell me about your best friend. What is he or she like?",
        tips: [
          "Use adjectives to describe personality",
          "Say what you do together",
          "Use 'He/She is...' and 'He/She likes...'",
        ],
      },
      {
        id: 3,
        title: "Family Activities",
        instruction: "Talk about things your family does together.",
        example:
          "On weekends, my family likes to have dinner together. We sometimes go to the park or visit my grandparents. During holidays, we travel to the beach.",
        prompt:
          "What does your family do together? What are your family traditions?",
        tips: [
          "Use 'We like to...' or 'We usually...'",
          "Talk about weekends and holidays",
          "Mention specific activities",
        ],
      },
    ],
  },
  {
    id: "supermarket_shopping",
    title: "At the Supermarket",
    description: "Practice shopping for groceries and daily necessities",
    level: "a1",
    estimatedTime: "12-15 min",
    steps: [
      {
        id: 1,
        title: "Finding Items",
        instruction: "Ask for help finding things in the supermarket.",
        example:
          "Excuse me, where is the bread? Do you have fresh milk? Where can I find apples?",
        prompt:
          "You're in a supermarket looking for bread, milk, and apples. Ask for help.",
        tips: [
          "Start with 'Excuse me'",
          "Use 'Where is...' or 'Where can I find...'",
          "Be polite and say 'thank you'",
        ],
      },
      {
        id: 2,
        title: "Comparing Products",
        instruction: "Ask about prices and compare different products.",
        example:
          "How much is this cheese? Which apples are sweeter? Is this bread fresh? What's the difference between these two?",
        prompt:
          "You want to compare products and ask about quality. Ask questions about the items.",
        tips: [
          "Ask 'How much...' for prices",
          "Use 'Which is better/cheaper/fresher?'",
          "Ask about quality and freshness",
        ],
      },
      {
        id: 3,
        title: "At the Checkout",
        instruction: "Ask about prices and pay for your items.",
        example:
          "I'd like to pay by card, please. Do you need my ID? Can I have a bag? Thank you very much.",
        prompt:
          "You're ready to pay for your groceries. Complete the checkout process.",
        tips: [
          "Say how you want to pay",
          "Ask for a bag if needed",
          "Be polite to the cashier",
        ],
      },
    ],
  },
  {
    id: "asking_directions",
    title: "Asking for Directions",
    description: "Learn to ask for and understand simple directions",
    level: "a1",
    estimatedTime: "10-15 min",
    steps: [
      {
        id: 1,
        title: "Basic Direction Requests",
        instruction: "Ask for directions to common places.",
        example:
          "Excuse me, where is the bank? How do I get to the train station? Is there a pharmacy near here?",
        prompt:
          "You're lost and need to find the bank. Ask someone for directions.",
        tips: [
          "Start with 'Excuse me'",
          "Use 'Where is...' or 'How do I get to...'",
          "Ask 'Is there a... near here?'",
        ],
      },
      {
        id: 2,
        title: "Understanding Directions",
        instruction: "Show you understand and ask for clarification.",
        example:
          "Go straight? Turn left at the traffic light? Is it far? How long does it take to walk there?",
        prompt:
          "Someone is giving you directions. Ask questions to make sure you understand.",
        tips: [
          "Repeat key words to check understanding",
          "Ask 'Is it far?' or 'How long?'",
          "Ask them to repeat if necessary",
        ],
      },
      {
        id: 3,
        title: "Thanking and Confirming",
        instruction: "Thank the person and confirm the directions.",
        example:
          "So I go straight, then turn left at the bank? Thank you so much for your help. Have a nice day!",
        prompt: "Summarize the directions you received and thank the person.",
        tips: [
          "Repeat the directions back",
          "Say 'Thank you' or 'Thank you so much'",
          "Be friendly and polite",
        ],
      },
    ],
  },
  {
    id: "making_appointments",
    title: "Making Appointments",
    description: "Practice scheduling appointments by phone or in person",
    level: "a1",
    estimatedTime: "12-15 min",
    steps: [
      {
        id: 1,
        title: "Requesting an Appointment",
        instruction: "Call to make an appointment.",
        example:
          "Hello, I'd like to make an appointment. When are you available? Do you have any time this week?",
        prompt:
          "You need to make an appointment with a dentist. Call and ask for an appointment.",
        tips: [
          "Start with 'Hello' or 'Good morning'",
          "Say 'I'd like to make an appointment'",
          "Ask about available times",
        ],
      },
      {
        id: 2,
        title: "Choosing a Time",
        instruction: "Discuss available times and choose one that works.",
        example:
          "Tuesday at 3 PM is good for me. Is Wednesday morning possible? I can't come on Friday. What about next week?",
        prompt:
          "The receptionist is suggesting different times. Choose a time that works for you.",
        tips: [
          "Say 'is good for me' or 'works for me'",
          "Use 'I can't...' to say when you're not free",
          "Ask about different days",
        ],
      },
      {
        id: 3,
        title: "Confirming Details",
        instruction: "Confirm the appointment time and ask for details.",
        example:
          "So that's Tuesday at 3 PM? What's your address? Do I need to bring anything? See you Tuesday!",
        prompt: "Confirm your appointment and ask any important questions.",
        tips: [
          "Repeat the day and time",
          "Ask for the address",
          "Ask what to bring",
        ],
      },
    ],
  },
  {
    id: "weather_seasons",
    title: "Weather and Seasons",
    description: "Describe weather, seasons, and preferences",
    level: "a1",
    estimatedTime: "10-15 min",
    steps: [
      {
        id: 1,
        title: "Today's Weather",
        instruction: "Describe the weather today.",
        example:
          "Today is sunny and warm. It's about 25 degrees. There are no clouds in the sky. It's a beautiful day!",
        prompt: "Look outside and describe the weather today.",
        tips: [
          "Use 'It's...' to describe weather",
          "Learn weather words: sunny, cloudy, rainy, cold, hot",
          "Mention temperature if you know it",
        ],
      },
      {
        id: 2,
        title: "Favorite Season",
        instruction: "Talk about your favorite season and why you like it.",
        example:
          "My favorite season is spring. I like spring because the weather is nice and the flowers are beautiful. It's not too hot and not too cold.",
        prompt: "What's your favorite season? Why do you like it?",
        tips: [
          "Say 'My favorite season is...'",
          "Use 'because' to give reasons",
          "Describe what happens in that season",
        ],
      },
      {
        id: 3,
        title: "Weekend Weather Plans",
        instruction: "Talk about your plans based on the weather forecast.",
        example:
          "The weather forecast says it will rain this weekend. If it rains, I will stay home and watch TV. If it's sunny, I will go to the park.",
        prompt:
          "What will you do this weekend? How does the weather affect your plans?",
        tips: [
          "Use 'If it rains/snows/is sunny...'",
          "Use 'I will...' for future plans",
          "Talk about indoor and outdoor activities",
        ],
      },
    ],
  },
  {
    id: "hobbies_free_time",
    title: "Hobbies and Free Time",
    description: "Discuss leisure activities and personal interests",
    level: "a1",
    estimatedTime: "12-15 min",
    steps: [
      {
        id: 1,
        title: "Your Hobbies",
        instruction: "Talk about your hobbies and interests.",
        example:
          "I like reading books and listening to music. My hobby is cooking. I enjoy playing football with my friends on weekends.",
        prompt:
          "What are your hobbies? What do you like to do in your free time?",
        tips: [
          "Use 'I like...', 'I enjoy...', 'My hobby is...'",
          "Mention when you do these activities",
          "Use -ing form after 'like' and 'enjoy'",
        ],
      },
      {
        id: 2,
        title: "Learning New Skills",
        instruction: "Talk about something new you want to learn.",
        example:
          "I want to learn how to play guitar. I think it's very interesting. I also want to learn how to swim because it's good exercise.",
        prompt: "Is there a new hobby or skill you want to learn? Why?",
        tips: [
          "Use 'I want to learn...'",
          "Say why you want to learn it",
          "Use 'because' to give reasons",
        ],
      },
      {
        id: 3,
        title: "Weekend Activities",
        instruction: "Describe what you usually do on weekends.",
        example:
          "On Saturday mornings, I usually go shopping. In the afternoon, I watch movies or visit friends. On Sunday, I like to relax at home.",
        prompt:
          "What do you usually do on weekends? Describe a typical weekend for you.",
        tips: [
          "Use 'usually', 'often', 'sometimes'",
          "Talk about different parts of the weekend",
          "Use present simple tense",
        ],
      },
    ],
  },
  {
    id: "post_office",
    title: "At the Post Office",
    description: "Learn to send letters and packages",
    level: "a1",
    estimatedTime: "10-15 min",
    steps: [
      {
        id: 1,
        title: "Sending a Letter",
        instruction: "Ask about sending a letter or postcard.",
        example:
          "I want to send this letter to Japan. How much does it cost? How long will it take? Do you have stamps?",
        prompt:
          "You want to send a postcard to a friend in another country. Ask about the service.",
        tips: [
          "Say 'I want to send...'",
          "Ask 'How much?' for prices",
          "Ask 'How long?' for time",
        ],
      },
      {
        id: 2,
        title: "Sending a Package",
        instruction: "Ask about shipping a package.",
        example:
          "I need to send this package. Is it too heavy? Can you weigh it? What's the fastest way to send it?",
        prompt:
          "You have a package to send. Ask about weight, cost, and delivery options.",
        tips: [
          "Use 'I need to send...'",
          "Ask about weight and size limits",
          "Ask about different shipping options",
        ],
      },
      {
        id: 3,
        title: "Completing the Transaction",
        instruction: "Pay for the service and get your receipt.",
        example:
          "How much is that in total? Can I pay with cash? Here's the money. Can I have a receipt, please?",
        prompt: "Pay for your postal service and get the receipt.",
        tips: [
          "Ask for the total cost",
          "Say how you want to pay",
          "Ask for a receipt",
        ],
      },
    ],
  },

  // A2 Level Scenarios (Elementary)
  {
    id: "restaurant_order",
    title: "Ordering at a Restaurant",
    description: "Practice ordering food and drinks confidently",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Getting a Table",
        instruction:
          "Practice asking for a table and basic restaurant etiquette.",
        example:
          "Good evening. Table for two, please. Do you have any tables available?",
        prompt:
          "You've just entered a restaurant. Ask for a table for yourself (or your group).",
        tips: [
          "Be polite and use 'please'",
          "Specify how many people",
          "Wait to be seated",
        ],
      },
      {
        id: 2,
        title: "Reading the Menu",
        instruction: "Ask questions about the menu and ingredients.",
        example:
          "What's in the chicken salad? Is the soup vegetarian? What do you recommend?",
        prompt:
          "The waiter has given you the menu. Ask questions about dishes you're interested in.",
        tips: [
          "Ask 'What's in...' for ingredients",
          "Use 'Do you have...'",
          "Ask for recommendations",
        ],
      },
      {
        id: 3,
        title: "Placing Your Order",
        instruction: "Order your meal and drinks clearly.",
        example:
          "I'll have the grilled salmon with rice, please. And a glass of water to drink.",
        prompt:
          "You're ready to order. Tell the waiter what you'd like to eat and drink.",
        tips: [
          "Use 'I'll have...' or 'I'd like...'",
          "Be specific about cooking preferences",
          "Don't forget drinks",
        ],
      },
    ],
  },
  {
    id: "travel_airport",
    title: "Airport and Travel",
    description: "Navigate airport situations and travel conversations",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Check-in Counter",
        instruction: "Check in for your flight and handle luggage.",
        example:
          "I'd like to check in for flight AA123 to New York. I have one suitcase to check and I'd prefer a window seat if possible.",
        prompt:
          "You're at the check-in counter. Check in for your flight and handle your luggage.",
        tips: [
          "Have your ticket/passport ready",
          "Mention seat preferences",
          "Ask about boarding time",
        ],
      },
      {
        id: 2,
        title: "Security and Gates",
        instruction: "Navigate security checkpoints and find your gate.",
        example:
          "Excuse me, where is gate B12? How long does security usually take? When does boarding start?",
        prompt:
          "You need to find your gate and want to know about timing. Ask for help.",
        tips: [
          "Be polite when asking for directions",
          "Ask about timing",
          "Say 'thank you'",
        ],
      },
      {
        id: 3,
        title: "On the Plane",
        instruction: "Interact with flight attendants and fellow passengers.",
        example:
          "Could I have a blanket, please? Excuse me, I think you're in my seat. What time do we land?",
        prompt:
          "You're on the plane. Make requests and handle common situations.",
        tips: [
          "Use 'Could I have...' for requests",
          "Be polite about seat issues",
          "Ask about arrival time",
        ],
      },
    ],
  },
  {
    id: "doctor_visit",
    title: "Visiting the Doctor",
    description: "Practice describing health problems and symptoms",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Making an Appointment",
        instruction: "Call to make a doctor's appointment.",
        example:
          "Hello, I'd like to make an appointment with Dr. Smith. I'm not feeling well. When is the earliest available time?",
        prompt: "You need to see a doctor. Call to make an appointment.",
        tips: [
          "Explain why you need to see the doctor",
          "Ask about available times",
          "Be clear about urgency",
        ],
      },
      {
        id: 2,
        title: "Describing Symptoms",
        instruction: "Tell the doctor about your health problems.",
        example:
          "I have a headache and I feel tired. My throat hurts and I've been coughing for two days.",
        prompt:
          "You're at the doctor's office. Describe how you're feeling and your symptoms.",
        tips: [
          "Use 'I have...' for symptoms",
          "Mention how long you've felt this way",
          "Be specific about pain or discomfort",
        ],
      },
      {
        id: 3,
        title: "Understanding Treatment",
        instruction: "Ask about treatment and follow doctor's instructions.",
        example:
          "How often should I take this medicine? Should I come back next week? Can I go to work tomorrow?",
        prompt:
          "The doctor has examined you. Ask questions about treatment and what you should do.",
        tips: [
          "Ask about medication frequency",
          "Clarify restrictions or recommendations",
          "Ask when to return if needed",
        ],
      },
    ],
  },

  // Additional A2 Level Scenarios (Elementary)
  {
    id: "hotel_checkin",
    title: "Hotel Check-in",
    description: "Practice checking into a hotel and handling room requests",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Arriving at the Hotel",
        instruction: "Check in at the front desk and confirm your reservation.",
        example:
          "Good evening. I have a reservation under the name Johnson. I booked a double room for two nights. Here's my confirmation email.",
        prompt:
          "You've arrived at your hotel. Check in and confirm your reservation.",
        tips: [
          "State your name clearly",
          "Mention your reservation details",
          "Have your confirmation ready",
        ],
      },
      {
        id: 2,
        title: "Room Preferences and Services",
        instruction: "Ask about room amenities and hotel services.",
        example:
          "Does the room have Wi-Fi? Is breakfast included? What time is checkout? Is there a gym in the hotel?",
        prompt: "Ask about the room facilities and hotel services available.",
        tips: [
          "Ask about Wi-Fi, breakfast, and facilities",
          "Use 'Does the room have...?' or 'Is there...?'",
          "Ask about checkout time",
        ],
      },
      {
        id: 3,
        title: "Handling Problems",
        instruction: "Report a problem with your room or request assistance.",
        example:
          "Excuse me, the air conditioning in my room isn't working. Could someone look at it? Also, I need extra towels, please.",
        prompt: "There's a problem with your room. Report it and ask for help.",
        tips: [
          "Explain the problem clearly",
          "Use 'isn't working' or 'doesn't work'",
          "Ask politely for help with 'Could you...?'",
        ],
      },
    ],
  },
  {
    id: "public_transportation",
    title: "Public Transportation",
    description: "Navigate buses, trains, and subway systems",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Buying Tickets",
        instruction: "Purchase tickets and ask about routes.",
        example:
          "I need a ticket to downtown, please. Which bus goes to Central Station? How much is a day pass? What time does the last train leave?",
        prompt:
          "You need to get to the city center. Buy tickets and ask about the best route.",
        tips: [
          "Say where you want to go",
          "Ask 'Which bus/train goes to...?'",
          "Ask about ticket prices and schedules",
        ],
      },
      {
        id: 2,
        title: "During the Journey",
        instruction: "Ask for help and information during your trip.",
        example:
          "Excuse me, is this the right train to Main Street? How many stops is it? Could you tell me when we reach downtown?",
        prompt:
          "You're on the bus/train. Make sure you're going the right way and know when to get off.",
        tips: [
          "Confirm you're on the right transport",
          "Ask how many stops",
          "Ask other passengers for help",
        ],
      },
      {
        id: 3,
        title: "Getting Off and Connections",
        instruction: "Ask about your stop and making connections.",
        example:
          "Is this my stop for the shopping center? Where do I transfer to Line 2? Do I need a new ticket for the connection?",
        prompt:
          "You need to get off and possibly transfer to another line. Ask for guidance.",
        tips: [
          "Confirm your stop",
          "Ask about transfers",
          "Check if you need a new ticket",
        ],
      },
    ],
  },
  {
    id: "at_the_bank",
    title: "At the Bank",
    description: "Handle basic banking transactions and inquiries",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Opening an Account",
        instruction: "Inquire about opening a new bank account.",
        example:
          "I'd like to open a savings account, please. What documents do I need? Is there a minimum deposit? What are the fees?",
        prompt:
          "You want to open a bank account. Ask about requirements and fees.",
        tips: [
          "Say what type of account you want",
          "Ask about required documents",
          "Ask about fees and minimum deposits",
        ],
      },
      {
        id: 2,
        title: "Making Transactions",
        instruction: "Deposit money and ask about your account.",
        example:
          "I'd like to deposit this check, please. Can you check my account balance? How long will the check take to clear?",
        prompt: "You need to deposit money and check your balance.",
        tips: [
          "Explain what you want to do",
          "Ask about processing times",
          "Request your account balance",
        ],
      },
      {
        id: 3,
        title: "ATM and Card Issues",
        instruction: "Report problems with your ATM card or account access.",
        example:
          "My ATM card isn't working. I think it's been blocked. Can you help me reset my PIN? How do I report a lost card?",
        prompt:
          "You're having trouble with your ATM card. Explain the problem and ask for help.",
        tips: [
          "Describe the problem clearly",
          "Ask about solutions",
          "Get information about emergency procedures",
        ],
      },
    ],
  },
  {
    id: "making_complaints",
    title: "Making Complaints",
    description: "Express dissatisfaction and seek solutions politely",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Describing the Problem",
        instruction: "Explain what went wrong in a polite but clear way.",
        example:
          "I'm sorry to bother you, but I have a problem with my order. The food was cold when it arrived, and we ordered pizza but received pasta instead.",
        prompt:
          "Your restaurant order was wrong and cold. Complain politely about the service.",
        tips: [
          "Start politely with 'I'm sorry to bother you, but...'",
          "Explain exactly what went wrong",
          "Stay calm and be specific",
        ],
      },
      {
        id: 2,
        title: "Asking for Solutions",
        instruction: "Request compensation or a solution to the problem.",
        example:
          "Could you please send the correct order? We'd also like a refund for the delivery fee since the food was cold. How long will it take to fix this?",
        prompt:
          "Ask for a solution to your problem. What do you want them to do?",
        tips: [
          "Be clear about what you want",
          "Ask for reasonable compensation",
          "Ask about timing for the solution",
        ],
      },
      {
        id: 3,
        title: "Following Up",
        instruction:
          "Confirm the solution and express satisfaction or continued concern.",
        example:
          "Thank you for sending the new order quickly. The food is much better now. I appreciate your help in solving this problem.",
        prompt:
          "The problem has been resolved. Thank them and confirm you're satisfied.",
        tips: [
          "Thank them for their help",
          "Confirm the solution worked",
          "Be positive when the problem is fixed",
        ],
      },
    ],
  },
  {
    id: "phone_conversations",
    title: "Phone Conversations",
    description: "Handle various types of phone calls confidently",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Making a Business Call",
        instruction: "Call a business to ask for information or services.",
        example:
          "Hello, this is Sarah Johnson. I'm calling to ask about your English courses. Do you have evening classes? How much do they cost?",
        prompt: "Call a language school to ask about their English courses.",
        tips: [
          "Introduce yourself clearly",
          "State the reason for your call",
          "Ask specific questions",
        ],
      },
      {
        id: 2,
        title: "Dealing with Connection Problems",
        instruction: "Handle poor connections and communication difficulties.",
        example:
          "I'm sorry, I can't hear you very well. The line is bad. Could you speak louder, please? Can you repeat that?",
        prompt:
          "You're having trouble hearing the other person. Ask them to help improve communication.",
        tips: [
          "Explain the problem politely",
          "Ask them to speak louder or slower",
          "Ask for repetition when needed",
        ],
      },
      {
        id: 3,
        title: "Taking and Leaving Messages",
        instruction: "Leave a message or take a message for someone else.",
        example:
          "Could you tell Mr. Smith that Sarah called? My number is 555-0123. I'll call back tomorrow afternoon. Thank you for taking the message.",
        prompt:
          "The person you want to speak to isn't available. Leave a clear message.",
        tips: [
          "Give your name and number clearly",
          "Say when you'll call back",
          "Thank them for taking the message",
        ],
      },
    ],
  },
  {
    id: "describing_problems",
    title: "Describing Problems",
    description: "Explain technical and everyday problems clearly",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Technology Problems",
        instruction: "Describe issues with your computer, phone, or internet.",
        example:
          "My laptop isn't turning on. I charged it all night but nothing happens when I press the power button. The screen stays black.",
        prompt:
          "Your computer isn't working. Describe the problem to a technician.",
        tips: [
          "Explain what's not working",
          "Describe what you tried to do",
          "Mention any error messages",
        ],
      },
      {
        id: 2,
        title: "Household Problems",
        instruction: "Report problems in your home or apartment.",
        example:
          "The hot water isn't working in my apartment. The shower only has cold water. This started yesterday morning and it's still not fixed.",
        prompt:
          "There's no hot water in your apartment. Call the landlord to report the problem.",
        tips: [
          "Say exactly what's wrong",
          "Mention when the problem started",
          "Explain how it affects you",
        ],
      },
      {
        id: 3,
        title: "Service Problems",
        instruction: "Complain about poor service you received.",
        example:
          "I waited 30 minutes for my coffee, and it was the wrong order. The staff seemed very busy, but they didn't apologize or offer to fix the mistake.",
        prompt: "You received poor service at a café. Describe what happened.",
        tips: [
          "Give specific details",
          "Mention timing",
          "Describe the staff's response",
        ],
      },
    ],
  },
  {
    id: "weekend_plans",
    title: "Weekend Plans",
    description: "Discuss future plans and social activities",
    level: "a2",
    estimatedTime: "15-20 min",
    steps: [
      {
        id: 1,
        title: "Making Plans with Friends",
        instruction: "Suggest activities and make plans for the weekend.",
        example:
          "What are you doing this Saturday? Would you like to go to the movies? There's a new comedy playing at 7 PM. We could have dinner afterwards.",
        prompt:
          "Invite a friend to do something fun this weekend. Suggest specific activities and times.",
        tips: [
          "Ask about their availability",
          "Suggest specific activities",
          "Mention times and places",
        ],
      },
      {
        id: 2,
        title: "Changing Plans",
        instruction: "Modify or cancel plans when something comes up.",
        example:
          "I'm sorry, but I can't make it to the movies on Saturday. Something came up at work. Could we go on Sunday instead? Or maybe next weekend?",
        prompt:
          "You need to change your weekend plans. Explain why and suggest alternatives.",
        tips: [
          "Apologize for changing plans",
          "Give a brief reason",
          "Suggest alternative times",
        ],
      },
      {
        id: 3,
        title: "Describing Past Weekend",
        instruction: "Talk about what you did last weekend.",
        example:
          "Last weekend was great! On Saturday, I went hiking with my brother. On Sunday, we had a barbecue in the garden. The weather was perfect for outdoor activities.",
        prompt:
          "Tell someone about your last weekend. What did you do? How was it?",
        tips: [
          "Use past tense correctly",
          "Mention specific days",
          "Give your opinion about the activities",
        ],
      },
    ],
  },

  // B1 Level Scenarios (Intermediate)
  {
    id: "job_interview",
    title: "Job Interview Practice",
    description: "Prepare for common job interview questions",
    level: "b1",
    estimatedTime: "20-25 min",
    steps: [
      {
        id: 1,
        title: "Tell Me About Yourself",
        instruction:
          "Give a professional summary of your background and experience.",
        example:
          "I have five years of experience in marketing. I graduated from university with a business degree and have worked at two companies where I developed digital marketing campaigns.",
        prompt: "Tell me about yourself and your professional background.",
        tips: [
          "Keep it professional",
          "Mention education and experience",
          "Connect to the job you want",
        ],
      },
      {
        id: 2,
        title: "Strengths and Weaknesses",
        instruction:
          "Discuss your professional strengths and areas for improvement.",
        example:
          "My strength is that I'm very organized and pay attention to detail. As for weaknesses, I sometimes spend too much time on perfecting my work, but I'm learning to balance quality with efficiency.",
        prompt:
          "What would you say are your main strengths? What about areas where you'd like to improve?",
        tips: [
          "Give specific examples",
          "For weaknesses, show how you're improving",
          "Be honest but positive",
        ],
      },
      {
        id: 3,
        title: "Questions for the Interviewer",
        instruction: "Ask thoughtful questions about the role and company.",
        example:
          "What would a typical day look like in this position? What opportunities are there for professional development? What do you enjoy most about working here?",
        prompt:
          "Do you have any questions for me about the job or our company?",
        tips: [
          "Prepare 2-3 questions",
          "Show interest in growth",
          "Ask about company culture",
        ],
      },
    ],
  },
  {
    id: "complaint_return",
    title: "Making a Complaint",
    description: "Learn to politely complain and request refunds or exchanges",
    level: "b1",
    estimatedTime: "18-22 min",
    steps: [
      {
        id: 1,
        title: "Explaining the Problem",
        instruction:
          "Clearly describe what went wrong with a product or service.",
        example:
          "I bought this phone last week, but it's not working properly. The screen keeps freezing and the battery doesn't last very long.",
        prompt:
          "You have a problem with something you bought. Explain what's wrong.",
        tips: [
          "Be specific about the problem",
          "Mention when you bought it",
          "Stay calm and polite",
        ],
      },
      {
        id: 2,
        title: "Requesting a Solution",
        instruction: "Ask for a refund, exchange, or repair.",
        example:
          "I'd like to return this and get my money back, please. If that's not possible, could you exchange it for a new one?",
        prompt: "Tell them what you want them to do about the problem.",
        tips: [
          "Be clear about what you want",
          "Offer alternative solutions",
          "Use polite language like 'I'd like' or 'Could you'",
        ],
      },
      {
        id: 3,
        title: "Negotiating and Following Up",
        instruction: "Discuss options and confirm the next steps.",
        example:
          "When will the refund be processed? Do I need to keep the receipt? Should I contact you if I don't receive it by next week?",
        prompt: "Work out the details of how they'll solve your problem.",
        tips: [
          "Ask about timing",
          "Clarify what you need to do",
          "Get contact information if needed",
        ],
      },
    ],
  },
  {
    id: "apartment_viewing",
    title: "Apartment Viewing",
    description:
      "Practice looking for an apartment and asking important questions",
    level: "b1",
    estimatedTime: "20-25 min",
    steps: [
      {
        id: 1,
        title: "Initial Inquiries",
        instruction: "Ask basic questions about the apartment and viewing.",
        example:
          "I'm interested in the two-bedroom apartment advertised online. Is it still available? When would be a good time to view it?",
        prompt:
          "You're calling about an apartment rental. Ask to arrange a viewing.",
        tips: [
          "Mention where you saw the ad",
          "Confirm availability",
          "Suggest viewing times",
        ],
      },
      {
        id: 2,
        title: "During the Viewing",
        instruction: "Ask detailed questions about the property and area.",
        example:
          "How much is the monthly rent? Are utilities included? What's the neighborhood like? Is there parking available?",
        prompt:
          "You're viewing the apartment. Ask important questions about rent, utilities, and the area.",
        tips: [
          "Ask about all costs",
          "Inquire about the neighborhood",
          "Check practical details like parking",
        ],
      },
      {
        id: 3,
        title: "Application Process",
        instruction: "Discuss lease terms and application requirements.",
        example:
          "What documents do I need to provide? How long is the lease? When would I be able to move in if my application is accepted?",
        prompt:
          "You're interested in renting. Ask about the application process and lease terms.",
        tips: [
          "Ask about required documents",
          "Clarify lease length and terms",
          "Confirm move-in dates",
        ],
      },
    ],
  },

  // Additional B1 Level Scenarios (Intermediate)
  {
    id: "university_interview",
    title: "University Interview",
    description:
      "Practice interviews for university admission or academic programs",
    level: "b1",
    estimatedTime: "20-25 min",
    steps: [
      {
        id: 1,
        title: "Academic Background",
        instruction: "Discuss your educational history and academic interests.",
        example:
          "I completed my high school education with a focus on science subjects. I'm particularly interested in environmental studies because I believe climate change is one of the most important challenges we face. My favorite subjects were biology and chemistry.",
        prompt:
          "Tell me about your educational background and why you want to study this subject.",
        tips: [
          "Mention your strongest subjects",
          "Explain your motivation clearly",
          "Connect your interests to the program",
        ],
      },
      {
        id: 2,
        title: "Future Goals",
        instruction: "Explain your career plans and how this program fits in.",
        example:
          "After graduating, I hope to work in environmental consulting. I want to help companies reduce their environmental impact. This program would give me the scientific knowledge and practical skills I need for this career path.",
        prompt:
          "What are your career goals and how will this program help you achieve them?",
        tips: [
          "Be specific about your career plans",
          "Show you've researched the program",
          "Explain the connection between study and career",
        ],
      },
      {
        id: 3,
        title: "Personal Qualities",
        instruction:
          "Describe what makes you a good candidate for the program.",
        example:
          "I think I'm a good candidate because I'm very motivated and hardworking. I also have good analytical skills, which I developed through my part-time job in a research lab. I enjoy working in teams and I'm always eager to learn new things.",
        prompt:
          "What personal qualities do you have that make you suitable for this program?",
        tips: [
          "Give specific examples",
          "Mention relevant experience",
          "Show enthusiasm for learning",
        ],
      },
    ],
  },
  {
    id: "workplace_communication",
    title: "Workplace Communication",
    description:
      "Handle professional communication with colleagues and supervisors",
    level: "b1",
    estimatedTime: "18-22 min",
    steps: [
      {
        id: 1,
        title: "Team Meetings",
        instruction: "Participate actively in team meetings and discussions.",
        example:
          "I think we should prioritize the marketing campaign first. Based on the data we collected last month, our target audience responds better to social media advertising. However, I'm concerned about the budget limitations.",
        prompt:
          "You're in a team meeting discussing project priorities. Share your opinion and concerns.",
        tips: [
          "State your opinion clearly",
          "Support your ideas with reasons",
          "Acknowledge potential challenges",
        ],
      },
      {
        id: 2,
        title: "Asking for Help",
        instruction: "Request assistance or clarification from colleagues.",
        example:
          "I'm having some trouble with the new software system. Could you show me how to generate the monthly reports? I've tried following the manual, but I'm getting confused at step 5.",
        prompt:
          "You need help with a work task. Ask a colleague for assistance.",
        tips: [
          "Be specific about what you need help with",
          "Mention what you've already tried",
          "Be polite and grateful",
        ],
      },
      {
        id: 3,
        title: "Giving Updates",
        instruction:
          "Provide progress reports on your work to your supervisor.",
        example:
          "I've completed the first phase of the project on schedule. The client feedback has been very positive so far. However, we might need an extra week for the final phase because we discovered some technical issues that need more time to resolve.",
        prompt:
          "Update your supervisor on the progress of your current project.",
        tips: [
          "Give both good and challenging news",
          "Be honest about timelines",
          "Propose solutions for problems",
        ],
      },
    ],
  },
  {
    id: "planning_events",
    title: "Planning Events",
    description: "Organize and coordinate social or professional events",
    level: "b1",
    estimatedTime: "20-25 min",
    steps: [
      {
        id: 1,
        title: "Initial Planning",
        instruction:
          "Discuss the basic details of an event you want to organize.",
        example:
          "I'm thinking of organizing a birthday party for my colleague next month. We could have it at a restaurant or maybe at someone's house. I estimate about 15-20 people will attend. What do you think would work better?",
        prompt:
          "You want to organize a special event. Discuss the initial plans and ask for opinions.",
        tips: [
          "Mention the purpose and scale",
          "Suggest different options",
          "Ask for input from others",
        ],
      },
      {
        id: 2,
        title: "Coordinating Details",
        instruction: "Work out the specific arrangements and logistics.",
        example:
          "Let's book the restaurant for Saturday evening. I'll call them tomorrow to check availability. Could you help me create a guest list? We should also think about decorations and whether we want to organize any activities.",
        prompt: "Work out the specific details and assign tasks for the event.",
        tips: [
          "Divide tasks among people",
          "Set deadlines for arrangements",
          "Consider all necessary details",
        ],
      },
      {
        id: 3,
        title: "Final Preparations",
        instruction: "Confirm arrangements and handle last-minute details.",
        example:
          "I've confirmed the restaurant reservation for 20 people at 7 PM. The decorations are ready, and I've prepared a small speech. Could you remind everyone about the dress code? Also, I need to pick up the cake on Saturday afternoon.",
        prompt:
          "Make final preparations and confirm all arrangements are in place.",
        tips: [
          "Confirm all bookings",
          "Make final reminders",
          "Prepare for contingencies",
        ],
      },
    ],
  },
  {
    id: "giving_opinions",
    title: "Giving Opinions",
    description: "Express and defend your viewpoints on various topics",
    level: "b1",
    estimatedTime: "18-22 min",
    steps: [
      {
        id: 1,
        title: "Expressing Personal Views",
        instruction: "Share your opinion on a current topic or issue.",
        example:
          "In my opinion, working from home has both advantages and disadvantages. I think it's great for work-life balance, but I miss the social interaction with colleagues. Personally, I prefer a hybrid approach where we work from home some days and go to the office on others.",
        prompt:
          "What's your opinion about working from home? Share your thoughts and personal experience.",
        tips: [
          "Use opinion phrases like 'I think', 'In my opinion'",
          "Give balanced viewpoints",
          "Include personal examples",
        ],
      },
      {
        id: 2,
        title: "Supporting Your Arguments",
        instruction: "Provide reasons and examples to support your opinion.",
        example:
          "I believe this approach works because it gives people flexibility while maintaining team collaboration. For example, in my previous job, we had this system and productivity actually increased. People were happier and more motivated when they had some control over their schedule.",
        prompt:
          "Someone disagrees with your opinion. Give more reasons and examples to support your viewpoint.",
        tips: [
          "Use phrases like 'because', 'for example'",
          "Give specific examples",
          "Explain cause and effect",
        ],
      },
      {
        id: 3,
        title: "Respecting Different Views",
        instruction:
          "Acknowledge other perspectives while maintaining your position.",
        example:
          "I understand that some people prefer working in the office all the time, and that's perfectly valid. Different things work for different people. However, I still think that having options is important. Maybe companies should let employees choose what works best for them.",
        prompt:
          "Acknowledge that others might disagree and suggest a compromise or solution.",
        tips: [
          "Show respect for other opinions",
          "Use phrases like 'I understand that...'",
          "Suggest flexible solutions",
        ],
      },
    ],
  },
  {
    id: "problem_solving",
    title: "Problem Solving",
    description: "Analyze problems and propose practical solutions",
    level: "b1",
    estimatedTime: "20-25 min",
    steps: [
      {
        id: 1,
        title: "Identifying the Problem",
        instruction: "Clearly describe a problem that needs to be solved.",
        example:
          "We have a serious problem with our project timeline. The software development is taking longer than expected, and we're now three weeks behind schedule. This delay is affecting the entire project, and our client is getting concerned.",
        prompt:
          "Describe a problem at work or in your studies that needs to be addressed.",
        tips: [
          "Be specific about the problem",
          "Explain the impact or consequences",
          "Use clear, factual language",
        ],
      },
      {
        id: 2,
        title: "Analyzing Causes",
        instruction: "Discuss what might be causing the problem.",
        example:
          "I think there are several reasons for this delay. First, the requirements changed halfway through the project. Second, we underestimated the complexity of the new features. Also, two of our key developers were sick for a week, which slowed down progress significantly.",
        prompt:
          "What do you think are the main causes of this problem? Analyze the situation.",
        tips: [
          "Consider multiple factors",
          "Use phrases like 'I think the reason is...'",
          "Be objective in your analysis",
        ],
      },
      {
        id: 3,
        title: "Proposing Solutions",
        instruction: "Suggest practical solutions to address the problem.",
        example:
          "I propose we do three things. First, we should hire a freelance developer temporarily to catch up. Second, we need to communicate with the client about realistic timelines. Finally, we should implement better project management tools to prevent this from happening again.",
        prompt: "What solutions do you suggest to solve this problem?",
        tips: [
          "Offer multiple solutions",
          "Be practical and realistic",
          "Think about preventing future problems",
        ],
      },
    ],
  },

  // B2 Level Scenarios (Upper-Intermediate)
  {
    id: "business_presentation",
    title: "Business Presentation",
    description:
      "Practice presenting ideas and handling questions in a professional setting",
    level: "b2",
    estimatedTime: "25-30 min",
    steps: [
      {
        id: 1,
        title: "Opening and Overview",
        instruction:
          "Start your presentation with a clear introduction and agenda.",
        example:
          "Good morning, everyone. Thank you for joining me today. I'm here to present our quarterly sales results and discuss strategies for the next quarter. I'll cover three main points: our achievements, challenges we faced, and our action plan moving forward.",
        prompt:
          "You're starting a business presentation. Introduce yourself, your topic, and give an overview of what you'll cover.",
        tips: [
          "Thank your audience",
          "State your purpose clearly",
          "Outline your main points",
          "Use signposting language",
        ],
      },
      {
        id: 2,
        title: "Presenting Data and Arguments",
        instruction:
          "Present your main points with supporting evidence and explanations.",
        example:
          "As you can see from this chart, our sales increased by 15% compared to last quarter. This growth was primarily driven by our new digital marketing strategy. However, we did face some challenges in the European market, where sales declined by 3% due to increased competition.",
        prompt:
          "Present your main findings or arguments with supporting data and examples.",
        tips: [
          "Reference visual aids clearly",
          "Explain cause and effect",
          "Use comparative language",
          "Acknowledge both positives and negatives",
        ],
      },
      {
        id: 3,
        title: "Handling Questions",
        instruction:
          "Respond to audience questions professionally and thoroughly.",
        example:
          "That's an excellent question about our marketing budget. Let me clarify that point. We allocated 20% more budget to digital channels this quarter, which contributed significantly to our online sales growth. Would you like me to break down those figures in more detail?",
        prompt:
          "Someone has asked you a challenging question about your presentation. Respond professionally and offer additional information.",
        tips: [
          "Acknowledge good questions",
          "Clarify if needed",
          "Provide detailed explanations",
          "Offer to follow up if necessary",
        ],
      },
    ],
  },
  {
    id: "negotiation_meeting",
    title: "Business Negotiation",
    description: "Practice negotiating terms, prices, and reaching compromises",
    level: "b2",
    estimatedTime: "25-30 min",
    steps: [
      {
        id: 1,
        title: "Opening Positions",
        instruction: "Present your initial position and requirements clearly.",
        example:
          "We appreciate your proposal, but I'm afraid the timeline you've suggested is too tight for our team. We'd need at least 6 weeks to deliver the quality you're expecting. However, we're confident we can meet your budget requirements if we adjust the scope slightly.",
        prompt:
          "You're in a business negotiation. Present your position on an important issue like timeline, budget, or scope.",
        tips: [
          "Be diplomatic but firm",
          "Explain your constraints",
          "Offer alternatives",
          "Show willingness to find solutions",
        ],
      },
      {
        id: 2,
        title: "Making Concessions",
        instruction: "Offer compromises and respond to counteroffers.",
        example:
          "I understand your concerns about the timeline. What if we could deliver a preliminary version in 4 weeks, and then provide the final version 2 weeks later? This would allow you to start testing while we refine the details.",
        prompt:
          "The other party has raised concerns. Offer a compromise or alternative solution.",
        tips: [
          "Acknowledge their concerns",
          "Propose creative solutions",
          "Use conditional language 'What if...'",
          "Focus on mutual benefits",
        ],
      },
      {
        id: 3,
        title: "Reaching Agreement",
        instruction: "Summarize agreed points and confirm next steps.",
        example:
          "So, to summarize what we've agreed: we'll deliver the preliminary version in 4 weeks for $50,000, with the final version following 2 weeks later for an additional $15,000. I'll send you a written proposal by Friday. Does this arrangement work for everyone?",
        prompt:
          "Wrap up the negotiation by confirming what's been agreed and the next steps.",
        tips: [
          "Summarize key agreements",
          "Confirm specific details",
          "Set clear deadlines",
          "Ensure everyone's on the same page",
        ],
      },
    ],
  },
  {
    id: "academic_discussion",
    title: "Academic Discussion",
    description:
      "Engage in intellectual discussions and defend your viewpoints",
    level: "b2",
    estimatedTime: "25-30 min",
    steps: [
      {
        id: 1,
        title: "Presenting Your Viewpoint",
        instruction: "Present a complex opinion with supporting arguments.",
        example:
          "I believe that remote work has fundamentally changed the nature of professional relationships. While it offers greater flexibility and work-life balance, it may be diminishing the informal interactions that often lead to innovation and team cohesion. The data suggests that while productivity has increased, employee engagement has decreased in some sectors.",
        prompt:
          "Present your opinion on a complex topic with supporting evidence and reasoning.",
        tips: [
          "State your position clearly",
          "Provide supporting evidence",
          "Acknowledge complexity",
          "Use academic language appropriately",
        ],
      },
      {
        id: 2,
        title: "Responding to Counterarguments",
        instruction: "Address opposing views and strengthen your position.",
        example:
          "While I acknowledge that some studies show improved productivity, I would argue that we need to distinguish between different types of productivity. Simple task completion may have improved, but collaborative innovation—which is harder to measure—may have suffered. Furthermore, the psychological effects of isolation are only beginning to be understood.",
        prompt:
          "Someone has challenged your viewpoint. Respond to their counterarguments while maintaining your position.",
        tips: [
          "Acknowledge valid points",
          "Make important distinctions",
          "Provide additional evidence",
          "Use qualifying language",
        ],
      },
      {
        id: 3,
        title: "Synthesizing Ideas",
        instruction: "Find common ground and propose nuanced conclusions.",
        example:
          "Perhaps the real issue isn't whether remote work is good or bad, but rather how we can design hybrid systems that capture the benefits of both approaches. We might need new frameworks for measuring success that go beyond traditional productivity metrics to include innovation, well-being, and long-term sustainability.",
        prompt:
          "Bring the discussion to a thoughtful conclusion that acknowledges different perspectives.",
        tips: [
          "Look for common ground",
          "Propose balanced solutions",
          "Acknowledge complexity",
          "Suggest future research or action",
        ],
      },
    ],
  },

  // C1 Level Scenarios (Advanced)
  {
    id: "conference_keynote",
    title: "Conference Keynote Speech",
    description: "Deliver a compelling keynote address on a complex topic",
    level: "c1",
    estimatedTime: "30-35 min",
    steps: [
      {
        id: 1,
        title: "Engaging Opening",
        instruction:
          "Open with a compelling hook and establish your credibility.",
        example:
          "Imagine a world where artificial intelligence doesn't replace human creativity, but amplifies it beyond our wildest dreams. This isn't science fiction—it's the reality we're building today. Over the past two decades, I've had the privilege of witnessing this transformation firsthand, from my early days as a researcher at MIT to my current role leading innovation at tech giants. Today, I want to share with you not just what we've achieved, but what lies ahead.",
        prompt:
          "Begin your keynote speech with a powerful opening that captures attention and establishes your expertise.",
        tips: [
          "Start with an intriguing scenario or question",
          "Establish your credibility early",
          "Connect with your audience",
          "Set up your main theme clearly",
        ],
      },
      {
        id: 2,
        title: "Complex Argument Development",
        instruction: "Present sophisticated arguments with nuanced analysis.",
        example:
          "The paradigm shift we're experiencing isn't merely technological—it's fundamentally altering the fabric of human collaboration. While critics raise valid concerns about job displacement, the historical precedent suggests a more nuanced reality. The Industrial Revolution didn't eliminate work; it transformed it. Similarly, AI is creating new categories of human-machine symbiosis that we're only beginning to understand. The key lies not in resisting this change, but in consciously shaping it to reflect our values and aspirations.",
        prompt:
          "Develop a sophisticated argument about your topic, addressing complexity and potential objections.",
        tips: [
          "Address multiple perspectives",
          "Use historical or theoretical frameworks",
          "Acknowledge counterarguments",
          "Build arguments progressively",
        ],
      },
      {
        id: 3,
        title: "Inspiring Conclusion",
        instruction:
          "End with a memorable call to action that motivates your audience.",
        example:
          "The future isn't something that happens to us—it's something we create. Every algorithm we design, every policy we craft, every conversation we have about these technologies is shaping the world our children will inherit. I challenge each of you to leave here today not just as observers of this transformation, but as its architects. The question isn't whether we can build a better future with AI—it's whether we will have the courage to do so. The time for passive observation has passed. The era of active creation begins now.",
        prompt:
          "Conclude your keynote with an inspiring call to action that motivates your audience to take action.",
        tips: [
          "Connect to larger purposes",
          "Make it personal and relevant",
          "Use powerful, memorable language",
          "End with a clear call to action",
        ],
      },
    ],
  },
  {
    id: "policy_debate",
    title: "Policy Debate",
    description:
      "Engage in sophisticated policy discussions with complex reasoning",
    level: "c1",
    estimatedTime: "30-35 min",
    steps: [
      {
        id: 1,
        title: "Policy Analysis",
        instruction:
          "Analyze a complex policy issue with multiple stakeholder perspectives.",
        example:
          "The proposed carbon pricing mechanism presents a fascinating case study in the tension between economic efficiency and social equity. While economists largely agree that carbon pricing is the most cost-effective approach to emissions reduction, the distributional effects are complex and potentially regressive. Rural communities, for instance, may face disproportionate impacts due to limited public transportation alternatives and higher heating costs. However, the revenue recycling mechanisms could potentially address these concerns while maintaining the policy's environmental effectiveness.",
        prompt:
          "Analyze a complex policy issue, considering multiple stakeholder perspectives and potential trade-offs.",
        tips: [
          "Consider multiple stakeholder perspectives",
          "Analyze both intended and unintended consequences",
          "Use policy analysis frameworks",
          "Balance competing objectives",
        ],
      },
      {
        id: 2,
        title: "Evidence-Based Argumentation",
        instruction:
          "Present evidence-based arguments using data and expert analysis.",
        example:
          "The empirical evidence from similar policies implemented in British Columbia and Sweden provides valuable insights. British Columbia's carbon tax, implemented in 2008, demonstrated that well-designed policies can achieve environmental goals without significant economic disruption. The province maintained economic growth while reducing emissions by 5-15% according to peer-reviewed studies. However, the Swedish experience reveals the importance of complementary policies—their carbon tax succeeded largely because it was coupled with significant investments in clean energy infrastructure and public transportation.",
        prompt:
          "Support your policy position with concrete evidence, data, and examples from real-world implementations.",
        tips: [
          "Reference specific studies and data",
          "Use comparative analysis",
          "Cite credible sources",
          "Acknowledge limitations in evidence",
        ],
      },
      {
        id: 3,
        title: "Policy Recommendation",
        instruction:
          "Propose nuanced policy recommendations that address identified challenges.",
        example:
          "Given this analysis, I propose a phased implementation approach that addresses equity concerns while maintaining environmental effectiveness. Phase one would introduce a modest carbon price with full revenue recycling through targeted rebates to low-income households and rural communities. Phase two would gradually increase the price while investing in clean infrastructure. Crucially, we need robust monitoring mechanisms to track both environmental and social outcomes, with built-in adjustment mechanisms. This isn't just about getting the policy right—it's about building public trust through transparent, adaptive governance.",
        prompt:
          "Propose specific policy recommendations that address the complexities and trade-offs you've identified.",
        tips: [
          "Propose specific, actionable recommendations",
          "Address identified challenges",
          "Include implementation details",
          "Consider political feasibility",
        ],
      },
    ],
  },
  {
    id: "expert_interview",
    title: "Expert Media Interview",
    description:
      "Handle challenging media interviews and communicate complex ideas clearly",
    level: "c1",
    estimatedTime: "25-30 min",
    steps: [
      {
        id: 1,
        title: "Handling Difficult Questions",
        instruction:
          "Respond to challenging or confrontational questions with composure.",
        example:
          "I understand the concerns raised by critics, and I think they reflect important questions about the pace of technological change. However, I'd caution against conflating legitimate regulatory concerns with wholesale rejection of beneficial technologies. The research I've published in peer-reviewed journals consistently shows that when properly implemented with appropriate safeguards, these innovations can deliver significant benefits while minimizing risks. The key is evidence-based policy-making, not fear-based decision-making.",
        prompt:
          "A journalist is asking you difficult questions about your expertise or work. Respond professionally while defending your position.",
        tips: [
          "Stay calm and professional",
          "Acknowledge valid concerns",
          "Redirect to your key messages",
          "Use evidence to support your points",
        ],
      },
      {
        id: 2,
        title: "Explaining Complex Concepts",
        instruction:
          "Make sophisticated ideas accessible to a general audience.",
        example:
          "Think of machine learning like teaching a child to recognize patterns. Just as a child learns to identify dogs by seeing thousands of examples, our algorithms learn by processing vast amounts of data. The difference is speed and scale—what might take a human years to learn, an algorithm can master in hours. But like human learning, the quality of the 'teaching'—the data we provide—determines the quality of the results. This is why issues of bias and data quality are so crucial to get right.",
        prompt:
          "Explain a complex concept from your field in terms that any educated person could understand.",
        tips: [
          "Use analogies and examples",
          "Avoid jargon",
          "Build from familiar concepts",
          "Check for understanding",
        ],
      },
      {
        id: 3,
        title: "Key Message Delivery",
        instruction:
          "Conclude with clear, memorable key messages for your audience.",
        example:
          "If your viewers take away just one thing from our conversation today, I hope it's this: technology isn't destiny. The choices we make today about how we develop, deploy, and govern these powerful tools will shape the world for generations. We have an unprecedented opportunity to harness these capabilities for human flourishing, but only if we approach them with wisdom, humility, and an unwavering commitment to the common good. The future isn't predetermined—it's up to all of us to build it thoughtfully.",
        prompt:
          "Wrap up the interview with your key message that you want the audience to remember.",
        tips: [
          "Distill to one clear message",
          "Make it memorable and actionable",
          "Connect to broader human values",
          "Leave audience with something to think about",
        ],
      },
    ],
  },

  // C2 Level Scenarios (Proficiency)
  {
    id: "diplomatic_negotiation",
    title: "Diplomatic Negotiation",
    description:
      "Navigate complex international negotiations with cultural sensitivity",
    level: "c2",
    estimatedTime: "35-40 min",
    steps: [
      {
        id: 1,
        title: "Cultural Bridge-Building",
        instruction:
          "Navigate cultural differences and establish common ground in sensitive discussions.",
        example:
          "I deeply appreciate the thoughtful perspective our colleagues have shared, which reflects a profound understanding of the historical context that shapes this issue. While our constitutional frameworks may differ, I believe we share a fundamental commitment to the dignity and prosperity of our peoples. Perhaps we might explore how our different approaches to governance—rather than being obstacles—could actually offer complementary pathways toward our shared objectives. The diversity of our perspectives may well be our greatest asset in crafting solutions that are both innovative and sustainable.",
        prompt:
          "You're in a sensitive international negotiation. Address cultural differences while building bridges toward cooperation.",
        tips: [
          "Show deep respect for other perspectives",
          "Acknowledge historical context",
          "Find shared values and objectives",
          "Frame differences as potential strengths",
        ],
      },
      {
        id: 2,
        title: "Complex Problem-Solving",
        instruction:
          "Propose sophisticated solutions to multifaceted international challenges.",
        example:
          "The challenge before us is indeed multidimensional, requiring us to balance competing imperatives of economic development, environmental stewardship, and social cohesion. I propose we consider a framework that phases implementation across different temporal horizons while incorporating adaptive mechanisms based on emerging evidence. This approach would allow us to begin with areas of strongest consensus while building the institutional capacity necessary for more ambitious cooperation. The monitoring and evaluation frameworks would need to be sufficiently sophisticated to capture both intended outcomes and unforeseen consequences, with built-in mechanisms for course correction.",
        prompt:
          "Propose a comprehensive solution to a complex international problem that addresses multiple competing interests.",
        tips: [
          "Address multiple dimensions of the problem",
          "Propose phased implementation",
          "Include monitoring and adaptation mechanisms",
          "Balance competing interests",
        ],
      },
      {
        id: 3,
        title: "Strategic Vision Communication",
        instruction:
          "Articulate a compelling long-term vision that inspires commitment.",
        example:
          "What we're endeavoring to create here transcends any single agreement or initiative—we're laying the foundation for a new paradigm of international cooperation. Future historians may well mark this moment as the beginning of humanity's conscious transition from competition-based to collaboration-based global governance. The institutional innovations we craft together will not merely solve today's challenges; they will establish precedents and build capabilities that will serve our children's children as they face challenges we cannot yet imagine. This is our generation's opportunity to demonstrate that human ingenuity, when channeled through principled cooperation, can indeed bend the arc of history toward justice and sustainability.",
        prompt:
          "Paint a compelling vision of the long-term impact and significance of the work you're doing together.",
        tips: [
          "Think in generational timescales",
          "Connect to larger historical narratives",
          "Inspire through possibility",
          "Emphasize collective legacy",
        ],
      },
    ],
  },
  {
    id: "academic_symposium",
    title: "Academic Symposium",
    description:
      "Lead sophisticated intellectual discourse and knowledge synthesis",
    level: "c2",
    estimatedTime: "35-40 min",
    steps: [
      {
        id: 1,
        title: "Theoretical Framework Presentation",
        instruction:
          "Present a sophisticated theoretical framework with original insights.",
        example:
          "The theoretical framework I'm proposing today synthesizes insights from complexity science, behavioral economics, and phenomenology to offer a novel understanding of decision-making under radical uncertainty. Traditional rational choice models, while mathematically elegant, fail to capture the embodied and contextual nature of human reasoning. By incorporating Merleau-Ponty's insights about perceptual decision-making with recent advances in network theory, we can develop more nuanced models that account for the role of intuition, social embeddedness, and temporal dynamics in complex choice environments. This framework has profound implications for how we understand policy effectiveness, organizational learning, and societal adaptation.",
        prompt:
          "Present an original theoretical framework that synthesizes insights from multiple disciplines.",
        tips: [
          "Synthesize from multiple disciplines",
          "Identify gaps in existing theory",
          "Propose novel conceptual frameworks",
          "Explain broader implications",
        ],
      },
      {
        id: 2,
        title: "Methodological Innovation",
        instruction:
          "Discuss innovative research methodologies and their philosophical foundations.",
        example:
          "The methodological approach I've developed draws from participatory action research while incorporating insights from quantum measurement theory—specifically, the recognition that the act of observation fundamentally alters the phenomenon being studied. This has led me to develop what I call 'reflexive ethnography,' where researchers explicitly theorize their own role in co-creating the social realities they study. The epistemic implications are profound: rather than seeking objective truth about social phenomena, we're engaged in collaborative truth-making. This approach requires new standards of rigor—not the elimination of subjectivity, but its conscious and systematic incorporation into our analytical frameworks.",
        prompt:
          "Explain your innovative research methodology and its philosophical foundations.",
        tips: [
          "Connect methodology to philosophy",
          "Explain innovative approaches",
          "Address epistemic implications",
          "Define new standards of rigor",
        ],
      },
      {
        id: 3,
        title: "Future Research Directions",
        instruction:
          "Articulate cutting-edge research directions and their transformative potential.",
        example:
          "The research trajectory I envision would fundamentally transform how we conceptualize the relationship between individual cognition and collective intelligence. By developing computational models that can simulate the emergence of cultural knowledge systems, we could gain unprecedented insight into how societies learn, adapt, and evolve. This work would necessarily be transdisciplinary, requiring collaboration between cognitive scientists, anthropologists, computer scientists, and philosophers. The ultimate goal is not merely academic understanding, but the development of new tools for enhancing collective wisdom in the face of global challenges that exceed any individual's cognitive capacity. We're essentially trying to understand and augment humanity's capacity for collective intelligence.",
        prompt:
          "Outline future research directions that could transform understanding in your field.",
        tips: [
          "Envision transformative possibilities",
          "Identify necessary collaborations",
          "Connect to global challenges",
          "Balance ambition with feasibility",
        ],
      },
    ],
  },
  {
    id: "crisis_leadership",
    title: "Crisis Leadership Communication",
    description:
      "Lead through complex crises with clarity, empathy, and strategic vision",
    level: "c2",
    estimatedTime: "30-35 min",
    steps: [
      {
        id: 1,
        title: "Acknowledging Complexity",
        instruction:
          "Address a complex crisis situation with honesty and nuanced understanding.",
        example:
          "The situation we face today defies simple categorization or easy solutions. We are confronting not merely a technical challenge, but a convergence of systemic vulnerabilities that have been building over decades. I want to be absolutely clear with you about both what we know and what we don't know. Our current understanding suggests multiple possible scenarios, each requiring different response strategies. Rather than pretending to certainty we don't possess, our approach must be adaptive, evidence-based, and transparent about the inherent uncertainties we're navigating together.",
        prompt:
          "Address your organization about a complex crisis, being honest about uncertainties while providing leadership.",
        tips: [
          "Acknowledge complexity honestly",
          "Distinguish between known and unknown",
          "Avoid false certainty",
          "Emphasize adaptive approaches",
        ],
      },
      {
        id: 2,
        title: "Values-Based Decision Making",
        instruction:
          "Explain how core values guide decision-making under pressure.",
        example:
          "In moments like these, when the path forward is unclear and the stakes are high, we must anchor ourselves in our fundamental values. Our commitment to transparency means you will receive regular updates, even when the news is difficult. Our dedication to equity means that our response strategies will prioritize the most vulnerable members of our community. Our belief in collective wisdom means that we will continue to seek input from diverse voices, even when rapid decisions are required. These values aren't just aspirational—they are operational principles that will guide every decision we make in the coming weeks and months.",
        prompt:
          "Explain how your organization's core values will guide decision-making during this crisis.",
        tips: [
          "Connect values to specific actions",
          "Make values operational, not just aspirational",
          "Address how values guide difficult decisions",
          "Demonstrate values through communication style",
        ],
      },
      {
        id: 3,
        title: "Inspiring Collective Action",
        instruction:
          "Mobilize people toward collective action while acknowledging their concerns and fears.",
        example:
          "What we're asking of each other in this moment is nothing less than to embody our highest aspirations as a community. Yes, the challenges are daunting, and yes, the path forward requires sacrifice and sustained effort from all of us. But history has shown repeatedly that human communities possess remarkable reserves of creativity, resilience, and solidarity when we choose to act from our better angels rather than our fears. This crisis is also an opportunity—to strengthen bonds that have been fraying, to innovate solutions that seemed impossible before, and to demonstrate that we are capable of rising to meet challenges that would have overwhelmed previous generations. The question isn't whether we have the capacity to overcome this—it's whether we will choose to harness that capacity together.",
        prompt:
          "Inspire your community to collective action while acknowledging the difficulty of what you're asking.",
        tips: [
          "Acknowledge the difficulty honestly",
          "Connect to historical examples",
          "Frame crisis as opportunity",
          "Appeal to shared identity and values",
        ],
      },
    ],
  },

  // Additional B2 Level Scenarios (Upper-Intermediate)
  {
    id: "project_management",
    title: "Project Management",
    description: "Lead projects and coordinate team efforts effectively",
    level: "b2",
    estimatedTime: "25-30 min",
    steps: [
      {
        id: 1,
        title: "Project Planning",
        instruction:
          "Outline project scope, timeline, and resource requirements.",
        example:
          "Our goal is to launch the new customer portal by Q3. The project involves three main phases: requirements gathering, development, and testing. We'll need input from the design team, two developers, and our QA specialist. I estimate 12 weeks total, with key milestones at weeks 4, 8, and 11.",
        prompt:
          "You're leading a new project. Present the initial plan, timeline, and resource needs to stakeholders.",
        tips: [
          "Break down the project into clear phases",
          "Specify required team members and skills",
          "Set realistic timelines with milestones",
        ],
      },
      {
        id: 2,
        title: "Managing Challenges",
        instruction: "Address project risks and unexpected obstacles.",
        example:
          "We've encountered a significant technical challenge that could delay our timeline by two weeks. The third-party API we planned to integrate has changed their authentication system. I propose we either adapt to their new system or find an alternative solution. I've already researched two backup options that could minimize the delay.",
        prompt:
          "A major challenge has emerged in your project. Explain the issue and present solutions to your team.",
        tips: [
          "Explain the impact clearly and honestly",
          "Present multiple solution options",
          "Show you've done preliminary research",
        ],
      },
      {
        id: 3,
        title: "Project Review and Next Steps",
        instruction: "Evaluate project outcomes and plan future improvements.",
        example:
          "The project was completed successfully, though we finished one week behind schedule due to the API integration issue. The team demonstrated excellent problem-solving skills, and client feedback has been overwhelmingly positive. For future projects, I recommend we conduct more thorough third-party vendor assessments and build in additional buffer time for integration challenges.",
        prompt:
          "Present a comprehensive project review, including successes, challenges, and lessons learned.",
        tips: [
          "Acknowledge both successes and areas for improvement",
          "Extract actionable lessons for future projects",
          "Recognize team contributions",
        ],
      },
    ],
  },
  {
    id: "customer_service_excellence",
    title: "Customer Service Excellence",
    description: "Handle complex customer situations with professionalism",
    level: "b2",
    estimatedTime: "25-30 min",
    steps: [
      {
        id: 1,
        title: "Handling Difficult Customers",
        instruction:
          "De-escalate tension and address customer frustrations effectively.",
        example:
          "I completely understand your frustration, and I sincerely apologize for the inconvenience this has caused you. You're absolutely right that this situation is unacceptable. Let me personally take ownership of resolving this issue for you today. I'm going to investigate exactly what went wrong and ensure it doesn't happen again.",
        prompt:
          "A customer is very upset about multiple service failures. Respond with empathy and take control of the situation.",
        tips: [
          "Validate their feelings without making excuses",
          "Take personal responsibility for the resolution",
          "Focus on what you can do to help",
        ],
      },
      {
        id: 2,
        title: "Finding Creative Solutions",
        instruction:
          "Go beyond standard procedures to solve customer problems.",
        example:
          "While our standard policy doesn't typically cover this situation, I understand the unique circumstances you're facing. Given your long history as a valued customer and the exceptional nature of this issue, I'm authorized to offer you several options: a full refund, a replacement with expedited shipping, or store credit with a 20% bonus. Which would work best for you?",
        prompt:
          "The standard solution won't work for this customer. Offer creative alternatives that address their specific needs.",
        tips: [
          "Acknowledge policy limitations honestly",
          "Present multiple customized options",
          "Emphasize the customer's value to the company",
        ],
      },
      {
        id: 3,
        title: "Following Up and Building Relationships",
        instruction: "Ensure customer satisfaction and prevent future issues.",
        example:
          "I wanted to follow up personally to confirm that your replacement product arrived on time and is working perfectly. I've also updated your account with premium support status, which means you'll have direct access to our senior support team for any future needs. Is there anything else I can help you with today, or any feedback you'd like to share about how we handled this situation?",
        prompt:
          "Follow up with the customer to ensure their issue is fully resolved and strengthen the relationship.",
        tips: [
          "Proactively check on resolution success",
          "Offer additional value or benefits",
          "Invite feedback for continuous improvement",
        ],
      },
    ],
  },
  {
    id: "training_development",
    title: "Training and Development",
    description: "Design and deliver effective professional training programs",
    level: "b2",
    estimatedTime: "25-30 min",
    steps: [
      {
        id: 1,
        title: "Assessing Training Needs",
        instruction:
          "Analyze skill gaps and design targeted training objectives.",
        example:
          "Based on my analysis of recent performance reviews and team feedback, I've identified three key areas where our sales team needs development: consultative selling techniques, objection handling, and CRM system utilization. Our current close rate is 15% below industry standards, and 60% of the team feels underprepared for complex client negotiations.",
        prompt:
          "You've been asked to design a training program. Present your analysis of current skill gaps and training priorities.",
        tips: [
          "Use specific data to support your assessment",
          "Connect skill gaps to business impact",
          "Prioritize the most critical development areas",
        ],
      },
      {
        id: 2,
        title: "Designing Training Content",
        instruction: "Create engaging and practical learning experiences.",
        example:
          "I've designed a blended learning approach combining online modules, interactive workshops, and real-world practice. Week one focuses on consultative selling theory through e-learning, week two involves role-playing workshops with common scenarios, and week three includes supervised practice with actual client interactions. Each participant will have a learning buddy for ongoing support and accountability.",
        prompt:
          "Outline your training program design, including methods, timeline, and support structures.",
        tips: [
          "Mix different learning modalities for engagement",
          "Include practical application opportunities",
          "Build in peer support and reinforcement",
        ],
      },
      {
        id: 3,
        title: "Measuring Training Effectiveness",
        instruction:
          "Evaluate training impact and plan continuous improvement.",
        example:
          "We'll measure success through multiple metrics: immediate reaction surveys, knowledge assessments, behavior observations at 30 and 60 days, and business results tracking over six months. I'm particularly monitoring our close rate improvement, client satisfaction scores, and CRM system usage. Early indicators are promising—we've already seen a 12% increase in consultative approach adoption.",
        prompt:
          "Explain how you'll measure the success of your training program and what results you're seeing.",
        tips: [
          "Use multiple levels of evaluation",
          "Connect training to business outcomes",
          "Plan for long-term behavior change measurement",
        ],
      },
    ],
  },

  // Additional C1 Level Scenarios (Advanced)
  {
    id: "board_meeting_leadership",
    title: "Board Meeting Leadership",
    description:
      "Lead strategic discussions and decision-making at the executive level",
    level: "c1",
    estimatedTime: "30-35 min",
    steps: [
      {
        id: 1,
        title: "Strategic Vision Presentation",
        instruction:
          "Present complex strategic initiatives with compelling rationale.",
        example:
          "The digital transformation strategy I'm proposing represents a fundamental shift in how we deliver value to our customers. While the initial investment of $15 million is substantial, our analysis projects a 300% ROI within three years through efficiency gains, new revenue streams, and market expansion. This isn't just about technology—it's about positioning ourselves as the industry leader in customer experience innovation.",
        prompt:
          "Present a major strategic initiative to the board, including vision, investment requirements, and projected returns.",
        tips: [
          "Connect strategy to long-term competitive advantage",
          "Present comprehensive financial analysis",
          "Address both opportunities and risks",
        ],
      },
      {
        id: 2,
        title: "Stakeholder Alignment",
        instruction:
          "Navigate complex stakeholder interests and build consensus.",
        example:
          "I recognize that this proposal touches on several sensitive areas. Marketing is concerned about brand consistency, Finance questions the capital allocation timing, and Operations worries about implementation complexity. These are all valid concerns that demonstrate the thoughtful oversight this board provides. Let me address each systematically while showing how our integrated approach actually strengthens each department's objectives.",
        prompt:
          "Address stakeholder concerns and resistance while building consensus around your proposal.",
        tips: [
          "Acknowledge all stakeholder perspectives respectfully",
          "Demonstrate how concerns have been considered",
          "Show how the proposal benefits all constituencies",
        ],
      },
      {
        id: 3,
        title: "Risk Management and Governance",
        instruction:
          "Address risk factors and establish governance frameworks.",
        example:
          "The governance structure I'm recommending includes a steering committee with rotating leadership, quarterly progress reviews with external audit oversight, and clear escalation protocols for major decisions. We've identified five primary risk categories and developed mitigation strategies for each. Most importantly, we're building in decision checkpoints that allow us to adjust course based on market feedback and performance data.",
        prompt:
          "Outline the governance framework and risk management approach for your strategic initiative.",
        tips: [
          "Demonstrate sophisticated risk assessment",
          "Propose robust governance structures",
          "Build in flexibility and adaptation mechanisms",
        ],
      },
    ],
  },
  {
    id: "research_presentation_academic",
    title: "Research Presentation",
    description:
      "Present original research findings to academic and professional audiences",
    level: "c1",
    estimatedTime: "30-35 min",
    steps: [
      {
        id: 1,
        title: "Research Methodology and Innovation",
        instruction:
          "Explain your research approach and methodological contributions.",
        example:
          "Our study employs a novel mixed-methods approach that combines longitudinal quantitative analysis with ethnographic observation to examine the relationship between workplace autonomy and innovation outcomes. We've addressed the limitations of previous research by incorporating real-time behavioral data through unobtrusive sensing technology, while maintaining rigorous ethical standards through our IRB-approved consent protocols.",
        prompt:
          "Present your research methodology, highlighting innovative approaches and how you've addressed previous limitations.",
        tips: [
          "Explain methodological innovations clearly",
          "Address limitations of previous research",
          "Demonstrate rigor and ethical considerations",
        ],
      },
      {
        id: 2,
        title: "Findings and Theoretical Implications",
        instruction:
          "Present key findings and their contribution to theoretical knowledge.",
        example:
          "Our findings challenge the prevailing assumption that autonomy universally enhances innovation. Instead, we've identified a curvilinear relationship where moderate autonomy optimization peaks at different levels depending on task complexity and individual expertise. This suggests that management theory needs more nuanced frameworks that account for contextual moderators rather than one-size-fits-all approaches.",
        prompt:
          "Present your key findings and explain their implications for existing theory in your field.",
        tips: [
          "Clearly articulate novel contributions to knowledge",
          "Explain how findings challenge or extend existing theory",
          "Use precise academic language appropriately",
        ],
      },
      {
        id: 3,
        title: "Practical Applications and Future Research",
        instruction:
          "Translate research insights into practical recommendations and research directions.",
        example:
          "These findings have immediate implications for organizational design and management practice. We recommend that organizations develop autonomy assessment tools that consider both individual and task characteristics. Furthermore, our research opens three promising avenues for future investigation: cross-cultural validation of these patterns, longitudinal studies of autonomy adaptation, and the development of AI-assisted autonomy optimization systems.",
        prompt:
          "Discuss practical applications of your research and outline future research directions.",
        tips: [
          "Bridge academic insights with practical applications",
          "Identify specific implementation recommendations",
          "Outline compelling future research opportunities",
        ],
      },
    ],
  },
  {
    id: "stakeholder_communication",
    title: "Stakeholder Communication",
    description:
      "Manage complex multi-stakeholder relationships and communications",
    level: "c1",
    estimatedTime: "30-35 min",
    steps: [
      {
        id: 1,
        title: "Stakeholder Analysis and Strategy",
        instruction:
          "Analyze stakeholder interests and develop communication strategies.",
        example:
          "Our stakeholder landscape is particularly complex for this initiative. We have primary stakeholders including employees, customers, and shareholders, each with distinct concerns and communication preferences. Secondary stakeholders encompass regulatory bodies, community organizations, and industry partners. I've mapped their influence levels, potential impact on our success, and optimal engagement strategies for each group.",
        prompt:
          "Present your analysis of key stakeholders and your strategic approach to engaging each group.",
        tips: [
          "Demonstrate sophisticated stakeholder mapping",
          "Show understanding of different stakeholder motivations",
          "Present tailored engagement strategies",
        ],
      },
      {
        id: 2,
        title: "Managing Conflicting Interests",
        instruction:
          "Navigate situations where stakeholder interests conflict.",
        example:
          "The tension between our sustainability commitments and short-term profitability expectations requires careful navigation. Environmental groups are pushing for accelerated carbon neutrality, while investors are concerned about the impact on quarterly earnings. Rather than viewing this as a zero-sum situation, I've identified opportunities for competitive advantage through sustainable innovation that can satisfy both constituencies over a strategic timeframe.",
        prompt:
          "Address a situation where stakeholder interests conflict and explain your approach to resolution.",
        tips: [
          "Acknowledge conflicts honestly and respectfully",
          "Look for creative win-win solutions",
          "Consider long-term relationship implications",
        ],
      },
      {
        id: 3,
        title: "Building Coalition and Consensus",
        instruction:
          "Create alignment and support across diverse stakeholder groups.",
        example:
          "Building consensus requires more than just good communication—it requires genuine collaboration in solution development. I'm proposing a stakeholder advisory committee with rotating leadership that gives each group meaningful input into implementation planning. By involving stakeholders in solution creation rather than just solution approval, we transform potential opposition into active partnership and shared ownership of outcomes.",
        prompt:
          "Explain how you'll build lasting consensus and cooperation among your stakeholders.",
        tips: [
          "Move beyond communication to collaboration",
          "Give stakeholders meaningful roles in solution development",
          "Create structures for ongoing engagement",
        ],
      },
    ],
  },

  // Additional C2 Level Scenarios (Proficiency)
  {
    id: "executive_leadership_transformation",
    title: "Executive Leadership",
    description: "Lead organizational transformation with visionary leadership",
    level: "c2",
    estimatedTime: "35-40 min",
    steps: [
      {
        id: 1,
        title: "Visionary Leadership Communication",
        instruction:
          "Articulate transformational vision that inspires and unifies stakeholders.",
        example:
          "We stand at an inflection point that will define not only our company's trajectory but our industry's future landscape. The convergence of artificial intelligence, sustainable technology, and shifting societal values presents us with an unprecedented opportunity to pioneer a new paradigm of business leadership. This isn't merely about operational efficiency or market share—it's about redefining what it means to be a responsible corporate citizen in the 21st century while delivering exceptional value to all stakeholders.",
        prompt:
          "Present your transformational vision for the organization, connecting immediate actions to long-term societal impact.",
        tips: [
          "Connect business objectives to larger societal purposes",
          "Paint a compelling picture of future possibilities",
          "Show how transformation aligns with evolving values",
        ],
      },
      {
        id: 2,
        title: "Cultural Transformation Strategy",
        instruction:
          "Design and communicate comprehensive organizational culture change.",
        example:
          "Cultural transformation cannot be mandated—it must be cultivated through authentic leadership modeling, structural reinforcement, and psychological safety. We're implementing a three-horizon approach: immediate behavioral interventions that demonstrate new values in action, medium-term system redesigns that embed these values in our processes, and long-term capability building that ensures sustainable culture evolution. This requires every leader to become a culture architect, not just a performance manager.",
        prompt:
          "Explain your comprehensive approach to transforming organizational culture at scale.",
        tips: [
          "Address both behavioral and structural dimensions",
          "Show understanding of culture change complexity",
          "Emphasize leadership role modeling",
        ],
      },
      {
        id: 3,
        title: "Legacy and Succession Leadership",
        instruction:
          "Establish lasting institutional capabilities and leadership development.",
        example:
          "True leadership success is measured not by what you accomplish during your tenure, but by the capabilities and values that persist after your departure. I'm establishing what I call 'institutional wisdom architecture'—systematic knowledge capture, leadership development pipelines, and decision-making frameworks that embody our principles while remaining adaptive to future challenges. Our goal is to create an organization that continuously evolves while remaining anchored to its foundational purpose.",
        prompt:
          "Discuss how you're building lasting institutional capabilities that will sustain leadership excellence beyond your tenure.",
        tips: [
          "Focus on systemic rather than personal legacy",
          "Emphasize knowledge transfer and capability building",
          "Balance continuity with adaptive capacity",
        ],
      },
    ],
  },
  {
    id: "international_summit",
    title: "International Summit",
    description:
      "Lead complex multinational negotiations and consensus building",
    level: "c2",
    estimatedTime: "35-40 min",
    steps: [
      {
        id: 1,
        title: "Global Perspective Integration",
        instruction:
          "Synthesize diverse international perspectives into coherent frameworks.",
        example:
          "The challenge before us transcends national boundaries and requires us to think beyond traditional sovereignty paradigms. Each nation brings unique strengths: the Nordic countries' expertise in sustainable development, Asia-Pacific's innovation in technology integration, Africa's insights into resilient community structures, and the Americas' experience in large-scale implementation. Our framework must honor these diverse strengths while creating synergistic combinations that amplify collective capability.",
        prompt:
          "Address an international assembly, weaving together diverse global perspectives into a unified approach.",
        tips: [
          "Acknowledge and value different cultural approaches",
          "Find synergies between diverse methodologies",
          "Think in terms of global systems and interconnections",
        ],
      },
      {
        id: 2,
        title: "Complex Systems Negotiation",
        instruction:
          "Navigate multi-layered negotiations involving numerous stakeholders and issues.",
        example:
          "The interconnected nature of our challenges requires us to move beyond traditional bilateral negotiations toward multilateral systems thinking. Climate change, economic inequality, and technological governance cannot be addressed in isolation—they form an ecosystem of interdependent challenges requiring coordinated responses. I propose we establish working groups that reflect these interconnections, with rotating leadership that ensures no single perspective dominates the discourse while maintaining forward momentum.",
        prompt:
          "Address the complexity of multi-issue, multi-stakeholder international negotiations.",
        tips: [
          "Recognize systemic interconnections between issues",
          "Propose innovative governance structures",
          "Balance multiple stakeholder interests simultaneously",
        ],
      },
      {
        id: 3,
        title: "Transformational Consensus Building",
        instruction:
          "Create lasting agreements that transform international cooperation.",
        example:
          "What we're endeavoring to create extends far beyond a traditional treaty or agreement—we're establishing new paradigms for international cooperation that future generations will build upon. This requires us to think in generational timescales while taking concrete actions today. The frameworks we establish must be sufficiently robust to withstand political transitions while remaining adaptive enough to evolve with emerging challenges. We are, quite literally, architecting the future of global governance.",
        prompt:
          "Present a framework for transformational international agreements that will reshape global cooperation.",
        tips: [
          "Think in generational rather than political cycles",
          "Balance durability with adaptability",
          "Connect immediate actions to long-term transformation",
        ],
      },
    ],
  },
  {
    id: "strategic_planning_mastery",
    title: "Strategic Planning Mastery",
    description: "Develop and communicate sophisticated strategic frameworks",
    level: "c2",
    estimatedTime: "35-40 min",
    steps: [
      {
        id: 1,
        title: "Systems Thinking and Scenario Planning",
        instruction:
          "Integrate complex systems analysis with strategic foresight.",
        example:
          "Our strategic framework must account for the convergence of demographic shifts, technological acceleration, environmental constraints, and geopolitical realignments that will reshape the global landscape over the next decade. Rather than predicting a single future, we've developed four plausible scenarios that stress-test our strategic assumptions and reveal the adaptive capabilities we need to build. Each scenario requires different competencies while sharing common foundations in agility, stakeholder value creation, and systemic resilience.",
        prompt:
          "Present a sophisticated strategic analysis that integrates multiple future scenarios and systemic considerations.",
        tips: [
          "Integrate multiple macro trends and uncertainties",
          "Use scenario planning to test strategic robustness",
          "Identify capabilities needed across multiple futures",
        ],
      },
      {
        id: 2,
        title: "Innovation Ecosystem Design",
        instruction:
          "Architect innovation capabilities that drive sustainable competitive advantage.",
        example:
          "Innovation cannot be relegated to a single department or process—it must become an organizational capability that permeates every aspect of our value creation system. We're designing what I call an 'innovation ecosystem' that includes external partnerships with universities and startups, internal innovation labs with dedicated resources, and cultural practices that encourage experimentation and intelligent failure. The goal is to create a self-reinforcing system where innovation capabilities continuously evolve and strengthen.",
        prompt:
          "Explain how you're designing comprehensive innovation capabilities that evolve with changing conditions.",
        tips: [
          "Think of innovation as an ecosystem, not a process",
          "Include external partnerships and internal capabilities",
          "Design for continuous evolution and learning",
        ],
      },
      {
        id: 3,
        title: "Transformational Impact Measurement",
        instruction:
          "Develop sophisticated frameworks for measuring strategic success beyond traditional metrics.",
        example:
          "Traditional performance metrics capture operational efficiency but miss the transformational impact we're striving to achieve. I'm proposing a multidimensional measurement framework that includes financial performance, stakeholder value creation, ecosystem health, and adaptive capacity indicators. These metrics are designed to capture both current performance and future readiness, ensuring we're optimizing for long-term sustainable value rather than short-term gains at the expense of future viability.",
        prompt:
          "Present your framework for measuring transformational strategic success across multiple dimensions and timeframes.",
        tips: [
          "Move beyond traditional financial metrics",
          "Include forward-looking capability indicators",
          "Balance multiple stakeholder value creation",
        ],
      },
    ],
  },
];

const CEFR_LEVELS = [
  { id: "a1", name: "A1 (Beginner)", color: "bg-green-100 text-green-800" },
  { id: "a2", name: "A2 (Elementary)", color: "bg-green-200 text-green-900" },
  { id: "b1", name: "B1 (Intermediate)", color: "bg-blue-100 text-blue-800" },
  {
    id: "b2",
    name: "B2 (Upper-Intermediate)",
    color: "bg-blue-200 text-blue-900",
  },
  { id: "c1", name: "C1 (Advanced)", color: "bg-purple-100 text-purple-800" },
  {
    id: "c2",
    name: "C2 (Proficiency)",
    color: "bg-purple-200 text-purple-900",
  },
];

interface GuidedPracticeStep {
  id: number;
  title: string;
  instruction: string;
  example: string;
  prompt: string;
  tips: string[];
}

interface GuidedScenario {
  id: string;
  title: string;
  description: string;
  level: string;
  estimatedTime: string;
  steps: GuidedPracticeStep[];
}

export function GuidedPractice() {
  const { data: session } = useSession();
  const [selectedLevel, setSelectedLevel] = useState("a2");
  const [selectedScenario, setSelectedScenario] =
    useState<GuidedScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [recordings, setRecordings] = useState<{ [key: number]: Blob }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});
  const [speakingSessionId, setSpeakingSessionId] = useState<string | null>(
    null
  );
  const [isScenarioComplete, setIsScenarioComplete] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Filter scenarios by selected level
  const filteredScenarios = GUIDED_SCENARIOS.filter(
    scenario => scenario.level === selectedLevel
  );

  const getLevelInfo = (levelId: string) => {
    return CEFR_LEVELS.find(level => level.id === levelId);
  };

  // Start a new guided practice session
  const startGuidedPracticeSession = async (scenario: GuidedScenario) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please login to use this feature",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/speaking/guided-practice/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          level: scenario.level,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start guided practice session");
      }

      const data = await response.json();
      setSpeakingSessionId(data.speakingSessionId);
      console.log("Guided practice session started:", data.speakingSessionId);
    } catch (error) {
      console.error("Error starting guided practice session:", error);
      toast({
        title: "Session Error",
        description: "Failed to start practice session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // End the guided practice session
  const endGuidedPracticeSession = async () => {
    if (!speakingSessionId) return;

    try {
      const response = await fetch("/api/speaking/guided-practice/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speakingSessionId: speakingSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to end guided practice session");
      }

      const data = await response.json();
      console.log("Guided practice session ended:", data.sessionId);

      // Show completion message
      toast({
        title: "Session Completed!",
        description: `Your guided practice session has been saved. Duration: ${Math.round(data.duration / 60)} minutes.`,
      });
    } catch (error) {
      console.error("Error ending guided practice session:", error);
      // Don't show error toast as this is called during cleanup
    } finally {
      setSpeakingSessionId(null);
    }
  };

  // Start recording
  const startRecording = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please login to use this feature",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Try to use WAV format if supported, otherwise fall back to WebM
      let mimeType = "audio/wav";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm;codecs=opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/webm";
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Create blob with the actual recorded MIME type
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        // Convert to WAV if necessary
        let finalBlob = audioBlob;
        if (mimeType !== "audio/wav") {
          try {
            finalBlob = await convertToWav(audioBlob);
          } catch (conversionError) {
            console.warn(
              "Audio conversion failed, using original format:",
              conversionError
            );
            // Keep the original blob but ensure it has proper extension
            finalBlob = audioBlob;
          }
        }

        setRecordings(prev => ({ ...prev, [currentStep]: finalBlob }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Convert audio blob to WAV format using Web Audio API
  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Convert to WAV format
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  // Helper function to convert AudioBuffer to WAV format
  const audioBufferToWav = (audioBuffer: AudioBuffer): ArrayBuffer => {
    const length = audioBuffer.length;
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bytesPerSample = 2; // 16-bit
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // PCM format size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // 16 bits per sample
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    // Convert audio data
    let offset = 44;
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Helper function to get English voice
  const getEnglishVoice = (): Promise<SpeechSynthesisVoice | null> => {
    return new Promise(resolve => {
      const getVoice = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          // Voices not loaded yet, try again
          setTimeout(getVoice, 100);
          return;
        }

        // Prefer native English voices over Google voices
        const englishVoice =
          voices.find(
            voice =>
              voice.lang.startsWith("en") && !voice.name.includes("Google")
          ) || voices.find(voice => voice.lang.startsWith("en"));

        resolve(englishVoice || null);
      };

      getVoice();
    });
  };

  // Play example audio using text-to-speech
  const playExample = async (text: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);

      try {
        const utterance = new SpeechSynthesisUtterance(text);

        // Set language to English
        utterance.lang = "en-US";

        // Get an English voice
        const englishVoice = await getEnglishVoice();
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Text-to-speech error:", error);
        setIsPlaying(false);
      }
    }
  };

  // Play recorded audio
  const playRecording = (stepId: number) => {
    const recording = recordings[stepId];
    if (recording && audioElementRef.current) {
      const url = URL.createObjectURL(recording);
      audioElementRef.current.src = url;
      audioElementRef.current.play();
    }
  };

  // Mark step as completed
  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    // Move to next step if available
    if (selectedScenario && currentStep < selectedScenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (selectedScenario) {
      // User has completed the final step - show completion celebration
      toast({
        title: "🎉 Scenario Complete!",
        description: `Congratulations! You've finished "${selectedScenario.title}". Great job practicing your English!`,
      });

      // Set a completion state to show completion UI
      setIsScenarioComplete(true);
    }
  };

  // Get AI feedback for the recording using the new guided practice analysis API
  const getFeedback = async (stepId: number) => {
    const recording = recordings[stepId];
    if (!recording || !selectedScenario) return;

    setIsProcessing(true);
    try {
      const step = selectedScenario.steps[stepId];

      // Create form data for the API request
      const formData = new FormData();
      formData.append("audio", recording, "guided-practice.wav");
      formData.append("referenceText", step.prompt);
      formData.append(
        "context",
        `Guided Practice - ${selectedScenario.title}: ${step.title}`
      );
      formData.append("expectedResponse", step.example);
      formData.append("level", selectedScenario.level);

      // Add session and step IDs for saving to database
      if (speakingSessionId) {
        formData.append("speakingSessionId", speakingSessionId);
        formData.append("stepId", stepId.toString());
      }

      // Call the guided practice analysis API
      const response = await fetch("/api/speaking/guided-practice/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze recording");
      }

      const data = await response.json();

      if (data.success && data.analysis) {
        // Store the full analysis data for structured display
        setFeedback(prev => ({
          ...prev,
          [stepId]: JSON.stringify(data.analysis), // Store as JSON to parse later
        }));

        // Show success toast for good performance
        if (data.analysis.overallScore >= 7) {
          toast({
            title: "Great job!",
            description: `You scored ${Math.round(data.analysis.overallScore)}/10 for "${step.title}"`,
          });
        }
      } else {
        // Fallback to encouraging message if analysis fails
        setFeedback(prev => ({
          ...prev,
          [stepId]: JSON.stringify({
            transcript: "Unable to transcribe",
            overallScore: 7,
            message: `Good job practicing "${step.title}"! Your speaking skills are improving. Keep practicing the key phrases and try to speak clearly.`,
          }),
        }));
      }
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze your recording. Please try again.",
        variant: "destructive",
      });

      // Provide fallback feedback
      const step = selectedScenario.steps[stepId];
      setFeedback(prev => ({
        ...prev,
        [stepId]: `Thank you for practicing "${step.title}". Keep working on speaking clearly and confidently. Try recording again for detailed feedback.`,
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset scenario progress
  const resetScenario = async () => {
    // End current session if active
    if (speakingSessionId) {
      await endGuidedPracticeSession();
    }

    setCurrentStep(0);
    setCompletedSteps([]);
    setRecordings({});
    setFeedback({});
    setIsScenarioComplete(false);
  };

  // Select scenario and reset progress
  const selectScenario = async (scenario: GuidedScenario) => {
    // End current session if active
    if (speakingSessionId) {
      await endGuidedPracticeSession();
    }

    setSelectedScenario(scenario);
    setCurrentStep(0);
    setCompletedSteps([]);
    setRecordings({});
    setFeedback({});
    setIsScenarioComplete(false);

    // Start new session for this scenario
    await startGuidedPracticeSession(scenario);
  };

  // Cleanup session when component unmounts or user leaves
  useEffect(() => {
    return () => {
      if (speakingSessionId) {
        endGuidedPracticeSession();
      }
    };
  }, [speakingSessionId]);

  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        {/* Level Selection */}
        <div className="flex items-center gap-4">
          <span className="font-medium">Select your level:</span>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CEFR_LEVELS.map(level => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Available Scenarios */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Available Scenarios for {getLevelInfo(selectedLevel)?.name}
          </h3>

          {filteredScenarios.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No scenarios available for this level yet. Try a different
                  level or check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredScenarios.map(scenario => (
                <Card
                  key={scenario.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {scenario.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {scenario.description}
                        </CardDescription>
                      </div>
                      <Badge className={getLevelInfo(scenario.level)?.color}>
                        {scenario.level.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {scenario.estimatedTime}
                        <Target className="h-4 w-4 ml-2" />
                        {scenario.steps.length} steps
                      </div>
                      <Button onClick={() => selectScenario(scenario)}>
                        Start Practice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentStepData = selectedScenario.steps[currentStep];
  const progress = ((currentStep + 1) / selectedScenario.steps.length) * 100;

  // Show completion screen if scenario is complete
  if (isScenarioComplete) {
    return (
      <div className="space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-700 dark:text-green-300">
              🎉 Scenario Complete!
            </CardTitle>
            <CardDescription className="text-lg">
              Congratulations! You've successfully completed "
              {selectedScenario.title}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                What you accomplished:
              </h3>
              <div className="grid gap-3">
                {selectedScenario.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 text-green-700 dark:text-green-300"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>
                      Step {index + 1}: {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-muted-foreground">
              <p>
                Your speaking skills are improving! Regular practice helps build
                confidence and fluency.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setSelectedScenario(null)}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Try Another Scenario
              </Button>
              <Button
                variant="outline"
                onClick={() => resetScenario()}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Practice This Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{selectedScenario.title}</h2>
          <p className="text-muted-foreground">
            {selectedScenario.description}
          </p>
          {speakingSessionId && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400">
                Session Active
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => resetScenario()}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={() => setSelectedScenario(null)}>
            Choose Different Scenario
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>
            {currentStep + 1} of {selectedScenario.steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Step {currentStep + 1}: {currentStepData.title}
                {completedSteps.includes(currentStep) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </CardTitle>
              <CardDescription>{currentStepData.instruction}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Example:
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => playExample(currentStepData.example)}
                disabled={isPlaying}
                className="text-blue-700 dark:text-blue-300"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                {isPlaying ? "Playing..." : "Listen"}
              </Button>
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              {currentStepData.example}
            </p>
          </div>

          {/* Your turn */}
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Your turn:
            </h4>
            <p className="text-green-800 dark:text-green-200 mb-3">
              {currentStepData.prompt}
            </p>

            {/* Recording controls */}
            <div className="flex items-center gap-3">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>

              {recordings[currentStep] && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => playRecording(currentStep)}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Play Recording
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => getFeedback(currentStep)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Getting Feedback..." : "Get Feedback"}
                  </Button>
                </>
              )}
            </div>

            {/* Feedback */}
            {feedback[currentStep] && (
              <FeedbackDisplay
                analysisData={JSON.parse(feedback[currentStep])}
              />
            )}
          </div>

          {/* Tips */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Tips:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {currentStepData.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>

            <div className="flex gap-2">
              {recordings[currentStep] &&
                !completedSteps.includes(currentStep) && (
                  <Button
                    onClick={completeStep}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}

              {currentStep < selectedScenario.steps.length - 1 && (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center gap-2"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element for playback */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioElementRef} className="hidden" aria-hidden="true" />
    </div>
  );
}

// Component to display structured feedback
const FeedbackDisplay = ({ analysisData }: { analysisData: any }) => {
  if (!analysisData) return null;

  // Handle fallback case
  if (analysisData.message) {
    return (
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>AI Feedback:</strong> {analysisData.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Transcript */}
      {analysisData.transcript && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
              📝 What you said:
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-400">
              Exact transcription
            </div>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200 italic bg-white dark:bg-blue-900 p-3 rounded border">
            "{analysisData.transcript}"
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            This shows exactly what you said, including any pronunciation
            variations
          </div>
        </div>
      )}

      {/* First Row: Pronunciation Analysis + Language Analysis */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Pronunciation Analysis */}
        {analysisData.pronunciation && (
          <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-3 flex items-center">
              🗣️ Pronunciation Analysis
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700 dark:text-purple-300">
                  Pronunciation:
                </span>
                <span className="font-medium">
                  {Math.round(analysisData.pronunciation.pronunciationScore)}
                  /100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700 dark:text-purple-300">
                  Fluency:
                </span>
                <span className="font-medium">
                  {Math.round(analysisData.pronunciation.fluencyScore)}/100
                </span>
              </div>
              {analysisData.pronunciation.prosodyScore && (
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300">
                    Rhythm:
                  </span>
                  <span className="font-medium">
                    {Math.round(analysisData.pronunciation.prosodyScore)}/100
                  </span>
                </div>
              )}
              {analysisData.pronunciation.speakingRate && (
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300">
                    Speaking Rate:
                  </span>
                  <span className="font-medium">
                    {analysisData.pronunciation.speakingRate} WPM
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Language Analysis */}
        {analysisData.content && (
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h5 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center">
              📚 Language Analysis
            </h5>
            <div className="space-y-2 text-sm mb-3">
              {analysisData.content.grammarScore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">
                    Grammar:
                  </span>
                  <span className="font-medium">
                    {analysisData.content.grammarScore}/10
                  </span>
                </div>
              )}
              {analysisData.content.accuracyScore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">
                    Accuracy:
                  </span>
                  <span className="font-medium">
                    {analysisData.content.accuracyScore}/10
                  </span>
                </div>
              )}
              {analysisData.content.contextRelevance !== undefined && (
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">
                    Context Relevance:
                  </span>
                  <span className="font-medium">
                    {analysisData.content.contextRelevance}/10
                  </span>
                </div>
              )}
            </div>

            {/* Grammar Errors */}
            {analysisData.content.grammarErrors &&
              analysisData.content.grammarErrors.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 dark:border-yellow-800">
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Grammar Notes:
                  </div>
                  {analysisData.content.grammarErrors.map(
                    (error: any, index: number) => (
                      <div
                        key={index}
                        className="text-xs text-yellow-700 dark:text-yellow-300 mb-1"
                      >
                        • <span className="line-through">{error.error}</span> →{" "}
                        <span className="font-medium">{error.correction}</span>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        )}
      </div>

      {/* Second Row: Strengths + Personalized Suggestions */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        {analysisData.strengths && analysisData.strengths.length > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h5 className="font-medium text-emerald-900 dark:text-emerald-100 mb-3 flex items-center">
              ✅ Strengths
            </h5>
            <ul className="space-y-1">
              {analysisData.strengths.map((strength: string, index: number) => (
                <li
                  key={index}
                  className="text-sm text-emerald-700 dark:text-emerald-300 flex items-start"
                >
                  <span className="mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personalized Suggestions */}
        {analysisData.suggestions && analysisData.suggestions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              💡 Personalized Suggestions
            </h5>
            <ul className="space-y-2">
              {analysisData.suggestions.map(
                (suggestion: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-blue-700 dark:text-blue-300 flex items-start"
                  >
                    <span className="mr-2 mt-1">💡</span>
                    <span>{suggestion}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Final Row: Scenario Feedback */}
      {analysisData.scenarioSpecificFeedback && (
        <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <h5 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2 flex items-center">
            🎭 Scenario Feedback
          </h5>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {analysisData.scenarioSpecificFeedback}
          </p>
        </div>
      )}

      {/* Areas for Improvement (if no suggestions available) */}
      {analysisData.areasForImprovement &&
        analysisData.areasForImprovement.length > 0 &&
        (!analysisData.suggestions ||
          analysisData.suggestions.length === 0) && (
          <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-3 flex items-center">
              🎯 Areas to Improve
            </h5>
            <ul className="space-y-1">
              {analysisData.areasForImprovement.map(
                (area: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-orange-700 dark:text-orange-300 flex items-start"
                  >
                    <span className="mr-2">•</span>
                    <span>{area}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
    </div>
  );
};
