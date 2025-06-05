export interface Photo {
  id: number;
  userId: number;
  title: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  votos?: number; 
  isWinner?: boolean; 
}
