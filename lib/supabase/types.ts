export type RegistrationStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      registrations: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string;
          company: string | null;
          token: string;
          status: RegistrationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          phone: string;
          company?: string | null;
          token: string;
          status?: RegistrationStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string | null;
          token?: string;
          status?: RegistrationStatus;
          created_at?: string;
        };
      };
    };
  };
}
