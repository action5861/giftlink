// src/types/auth.ts
import { User as FirebaseUser } from 'firebase/auth';

export interface User extends Omit<FirebaseUser, 'providerData'> {
  name: string | null;
  role: 'DONOR' | 'ADMIN';
  createdAt: Date;
}