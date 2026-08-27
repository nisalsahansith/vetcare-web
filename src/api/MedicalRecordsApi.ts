import api from "./axios";

import type {
  MedicalRecord,
  CreateMedicalRecordRequest,
} from "../types/MedicalRecord";

/**
 * Create a medical record with an optional image.
 *
 * Sends the request as multipart/form-data.
 */
export const createMedicalRecord = async (
  record: CreateMedicalRecordRequest
): Promise<MedicalRecord> => {
  const formData = new FormData();

  formData.append("petId", String(record.petId));
  formData.append("vetId", String(record.vetId));

  if (record.diagnosis?.trim()) {
    formData.append(
      "diagnosis",
      record.diagnosis.trim()
    );
  }

  if (record.treatment?.trim()) {
    formData.append(
      "treatment",
      record.treatment.trim()
    );
  }

  if (record.prescription?.trim()) {
    formData.append(
      "prescription",
      record.prescription.trim()
    );
  }

  if (record.notes?.trim()) {
    formData.append(
      "notes",
      record.notes.trim()
    );
  }

  if (record.image) {
    formData.append(
      "image",
      record.image,
      record.image.name
    );
  }

  const response = await api.post<MedicalRecord>(
    "/medical-records",
    formData
  );

  return response.data;
};

/**
 * Get all medical records.
 */
export const getAllMedicalRecords = async (): Promise<
  MedicalRecord[]
> => {
  const response = await api.get<MedicalRecord[]>(
    "/medical-records"
  );

  return response.data;
};

/**
 * Get medical record by ID.
 */
export const getMedicalRecordById = async (
  id: string
): Promise<MedicalRecord> => {
  const response = await api.get<MedicalRecord>(
    `/medical-records/${id}`
  );

  return response.data;
};

/**
 * Get medical records for a specific pet.
 */
export const getMedicalRecordsByPet = async (
  petId: number
): Promise<MedicalRecord[]> => {
  const response = await api.get<MedicalRecord[]>(
    `/medical-records/pet/${petId}`
  );

  return response.data;
};

/**
 * Delete a medical record.
 */
export const deleteMedicalRecord = async (
  id: string
): Promise<void> => {
  await api.delete(
    `/medical-records/${id}`
  );
};