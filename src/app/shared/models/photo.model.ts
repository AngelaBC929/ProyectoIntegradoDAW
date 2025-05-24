export interface Photo {
  id: number;
  userId: number;
  title: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  votos?: number;  // Añadido para contar los votos
  isWinner?: boolean;  // Añadido para marcar si la foto es ganadora
}
