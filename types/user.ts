export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
  favorites?: any[];
  orders?: any[];
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}
