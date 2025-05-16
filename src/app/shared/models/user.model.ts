export interface User {
  id: number;
  email: string;
  name: string;
  lastName: string; // <-- Nuevo campo
  role: 'admin' | 'user';
}
