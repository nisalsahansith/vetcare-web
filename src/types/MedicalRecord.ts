export interface MedicalRecord {
  id: string;
  petId: number;
  vetId: number;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  notes: string | null;
  imageName: string | null;
  imagePath: string | null;
  createdAt: string;
}

export interface CreateMedicalRecordRequest {
  petId: number;
  vetId: number;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  image: File;
}