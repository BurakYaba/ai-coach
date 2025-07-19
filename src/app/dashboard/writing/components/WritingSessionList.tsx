import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const WritingSessionList = () => {
  const router = useRouter();

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
