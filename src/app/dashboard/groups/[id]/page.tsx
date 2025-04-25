"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GroupDetailComponent } from "@/components/gamification/group-detail";
import Link from "next/link";

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const groupId = params?.id || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/gamification?tab=groups">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Learning Group</h1>
      </div>

      <Suspense fallback={<div>Loading group details...</div>}>
        <GroupDetailComponent groupId={groupId} />
      </Suspense>
    </div>
  );
}
