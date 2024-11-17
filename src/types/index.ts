export interface Story {
    id: string;
    age: number;
    gender: string;
    story: string;
    region: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED';
    items: {
      id: string;
      name: string;
      category: string;
      quantity: number;
      status: string;
    }[];
  }