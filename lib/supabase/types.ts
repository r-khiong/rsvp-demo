export type RegistrationStatus = "pending" | "approved" | "rejected";

export type Database = {
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
        Relationships: [];
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
          status_updated_at: string | null;
          remark: string | null;
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
          status_updated_at?: string | null;
          remark?: string | null;
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
          status_updated_at?: string | null;
          remark?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_registration_by_token: {
        Args: { p_token: string };
        Returns: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string;
          company: string | null;
          token: string;
          status: RegistrationStatus;
          created_at: string;
          event_name: string | null;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
