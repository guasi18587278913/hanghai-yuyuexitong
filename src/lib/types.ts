export type Status = 'idle' | 'loading' | 'success' | 'error' | 'confirmed';

export interface Slot {
  time: string; // e.g., "09:00"
  available: boolean;
  // You might want to add the original availability ID here later
  // availabilityId?: string; 
} 