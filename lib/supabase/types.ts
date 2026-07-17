import type { LayerProgress } from "@/lib/types";

/** Row shape for public.journeys */
export type JourneyRow = {
  id: string;
  user_id: string;
  topic: string;
  created_at: string;
  updated_at: string;
  current_index: number;
  used_placement: boolean;
  layers: LayerProgress[];
};
