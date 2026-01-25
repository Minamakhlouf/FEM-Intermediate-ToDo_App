import type { Timestamp } from 'firebase/firestore';

export type TodoData = {
  uid: string;
  text: string;
  isActive: boolean;
  dayKey: string;
  createdAt?: Timestamp | null;
  order: number; 
};

export type Todo = TodoData & { id: string };

export type Calendar = {
    [year: string]: {
        [month: string]: Set<string>;
    };
};