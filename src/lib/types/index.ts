export type UserRole = 'student' | 'coach' | 'admin';

export interface UserProfile {
  id: string; // Corresponds to Supabase auth.users.id
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
}

export interface Booking {
  id: string;
  created_at: string;
  student_id: string;
  coach_id: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export interface Availability {
  id: string;
  coach_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
} 