export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  ownerId: number;
}

export interface CreatePetRequest {
  name: string;
  species: string;
  breed?: string;
  age: number | null;
  ownerId: number;
}