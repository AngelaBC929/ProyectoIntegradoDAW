export interface User {
  id: number;
  email: string;
  name: string;
  lastName: string; 
  username: string;
  role: 'admin' | 'user';
  
}
