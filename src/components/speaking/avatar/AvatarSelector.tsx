"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { AvatarSelectorProps, AvatarCharacter } from "./types";

// Avatar preview images using the uploaded .webp files
const AVATAR_PREVIEW_IMAGES: Record<string, string> = {
  "marcus-business": "/images/avatars/Marcus.webp",
  "sarah-coach": "/images/avatars/Sarah.webp",
  "alex-friendly": "/images/avatars/Alex.webp",
  "emma-supportive": "/images/avatars/Emma.webp",
  "oliver-academic": "/images/avatars/Oliver.webp",
  "zoe-creative": "/images/avatars/Zoe.webp",
};

// Fallback avatar image if preview not available
const DEFAULT_AVATAR_IMAGE = "/images/avatars/default-avatar.jpg";

interface AvatarCardProps {
  character: AvatarCharacter;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

function AvatarCard({
  character,
  isSelected,
  onSelect,
  disabled,
}: AvatarCardProps) {
  const [imageError, setImageError] = useState(false);

  const previewImage =
    AVATAR_PREVIEW_IMAGES[character.id] || DEFAULT_AVATAR_IMAGE;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => !disabled && onSelect()}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Avatar Preview Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {!imageError && !previewImage.includes("default-avatar") ? (
              <Image
                src={previewImage}
                alt={`${character.name} avatar`}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              // Use emoji fallback when images aren't available
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="text-4xl">
                  {character.avatar.gender === "male" ? "👨" : "👩"}
                </div>
              </div>
            )}

            {/* Gender and personality badge */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {character.avatar.gender === "male" ? "Male" : "Female"}
              </Badge>
            </div>
          </div>

          {/* Character Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">{character.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {character.description}
            </p>
          </div>

          {/* Personality Badge */}
          <Badge variant="outline" className="text-xs w-full justify-center">
            {character.personality.split(" ").slice(-2).join(" ")}{" "}
            {/* Last 2 words */}
          </Badge>

          {/* Voice Info */}
          <div className="text-xs text-muted-foreground text-center">
            Voice: {character.voiceId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AvatarSelector({
  characters,
  selectedCharacter,
  onCharacterChange,
  disabled = false,
}: AvatarSelectorProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Determine if we're on mobile for responsive layout
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const visibleCards = isMobile ? 2 : 6; // Show 2 on mobile, 6 on desktop

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < characters.length - visibleCards;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setScrollPosition(prev => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setScrollPosition(prev =>
        Math.min(characters.length - visibleCards, prev + 1)
      );
    }
  };

  const visibleCharacters = characters.slice(
    scrollPosition,
    scrollPosition + visibleCards
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">
          Choose Your Conversation Partner
        </h2>
        <p className="text-sm text-muted-foreground">
          Select an AI character to practice speaking with
        </p>
      </div>

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex items-center gap-2">
          {/* Left arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft || disabled}
            className="shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Avatar cards */}
          <div className="grid grid-cols-6 gap-3 flex-1">
            {visibleCharacters.map(character => (
              <AvatarCard
                key={character.id}
                character={character}
                isSelected={selectedCharacter.id === character.id}
                onSelect={() => onCharacterChange(character)}
                disabled={disabled}
              />
            ))}
          </div>

          {/* Right arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight || disabled}
            className="shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              disabled={!canScrollLeft || disabled}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {scrollPosition + 1}-
              {Math.min(scrollPosition + visibleCards, characters.length)} of{" "}
              {characters.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              disabled={!canScrollRight || disabled}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {visibleCharacters.map(character => (
              <AvatarCard
                key={character.id}
                character={character}
                isSelected={selectedCharacter.id === character.id}
                onSelect={() => onCharacterChange(character)}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
