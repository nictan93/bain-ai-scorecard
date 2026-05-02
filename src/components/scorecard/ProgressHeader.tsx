import { Progress } from "@/components/ui/Progress";
import type { Track } from "@/content/questions";

interface ProgressHeaderProps {
  current: number;
  total: number;
  track: Track | null;
}

const TRACK_LABELS: Record<Track, string> = {
  esop: "ESOP",
  brand_ip: "Brand & IP",
};

export function ProgressHeader({ current, total, track }: ProgressHeaderProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-sans text-text-secondary">
          {track ? `[${TRACK_LABELS[track]}]` : "Bain Squared"}
        </span>
        <span className="text-xs font-sans text-text-secondary">
          {current} / {total}
        </span>
      </div>
      <Progress
        value={pct}
        label={`Question ${current} of ${total}`}
      />
    </div>
  );
}
