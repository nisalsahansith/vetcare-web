export interface Appointment {
  id: number;
  petId: number;
  vetId: number;
  appointmentDate: string;
  status: string;
  reason: string | null;
}

export interface CreateAppointmentRequest {
  petId: number;
  vetId: number;
  appointmentDate: string;
  status: string;
  reason?: string;
}