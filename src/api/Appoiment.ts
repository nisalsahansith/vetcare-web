import api from "./axios";
import type {
  Appointment,
  CreateAppointmentRequest,
} from "../types/Appointment";

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>(
    "/appointments"
  );

  return response.data;
};

export const getAppointmentById = async (
  id: number
): Promise<Appointment> => {
  const response = await api.get<Appointment>(
    `/appointments/${id}`
  );

  return response.data;
};

export const getAppointmentsByPet = async (
  petId: number
): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>(
    `/appointments/pet/${petId}`
  );

  return response.data;
};

export const getAppointmentsByVet = async (
  vetId: number
): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>(
    `/appointments/vet/${vetId}`
  );

  return response.data;
};

export const createAppointment = async (
  appointment: CreateAppointmentRequest
): Promise<Appointment> => {
  const response = await api.post<Appointment>(
    "/appointments",
    appointment
  );

  return response.data;
};

export const updateAppointment = async (
  id: number,
  appointment: CreateAppointmentRequest
): Promise<Appointment> => {
  const response = await api.put<Appointment>(
    `/appointments/${id}`,
    appointment
  );

  return response.data;
};

export const deleteAppointment = async (
  id: number
): Promise<void> => {
  await api.delete(`/appointments/${id}`);
};