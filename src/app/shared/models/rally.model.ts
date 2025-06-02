export interface Rally {
  users: any;
  fecha: string | number | Date;
  photos: any[];
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  theme?: string;
  created_by?: number;
  created_at?: string;
  yaApuntado?: boolean;
}
