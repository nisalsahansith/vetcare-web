import api from "./axios";
import type { CreatePetRequest, Pet } from "../types/Pet";

export const getAllPets = async (): Promise<Pet[]> => {
  const response = await api.get<Pet[]>("/pets");
  return response.data;
};

export const getPetById = async (id: number): Promise<Pet> => {
  const response = await api.get<Pet>(`/pets/${id}`);
  return response.data;
};

export const getPetsByOwner = async (ownerId: number): Promise<Pet[]> => {
  const response = await api.get<Pet[]>(
    `/pets/owner/${ownerId}`
  );

  return response.data;
};

export const createPet = async (
  pet: CreatePetRequest
): Promise<Pet> => {
  const response = await api.post<Pet>("/pets", pet);

  return response.data;
};

export const deletePet = async (id: number): Promise<void> => {
  await api.delete(`/pets/${id}`);
};

export const updatePet = async (
  id: number,
  pet: CreatePetRequest
): Promise<Pet> => {
  const response = await api.put<Pet>(`/pets/${id}`, pet);

  return response.data;
};