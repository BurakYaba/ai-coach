import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const WritingSessionList = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);

  // Debug function for fetching sessions - not used in regular operation
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/writing/sessions/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "listAll",
        }),
      });

      if (!response.ok) {
        console.error("Error response status:", response.status);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Failed to fetch sessions: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        console.error("Invalid data format received:", data);
        setSessions([]);
      }
    } catch (error: unknown) {
      console.error("Error fetching writing sessions:", error);
      toast({
        title: "Error",
        description: `Failed to fetch writing sessions: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Writing Sessions</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/dashboard/writing/new")}
            variant="default"
          >
            <Plus className="mr-1 h-4 w-4" /> New Session
          </Button>

          <Button
            onClick={() => router.push("/dashboard/writing/debug")}
            variant="outline"
            size="sm"
          >
            Debug Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WritingSessionList;
