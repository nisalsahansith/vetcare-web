import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  CalendarDays,
  UserRound,
  PawPrint,
  Trash2,
  X,
  Stethoscope,
  Image as ImageIcon,
  Upload,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import type {
  MedicalRecord,
  CreateMedicalRecordRequest,
} from "../../types/MedicalRecord";

import {
  createMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecords,
} from "../../api/MedicalRecordsApi";

import ConfirmModal from "../../components/common/ConfirmModel";

interface MedicalRecordForm {
  petId: number;
  vetId: number;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  image: File | null;
}

const emptyForm: MedicalRecordForm = {
  petId: 0,
  vetId: 0,
  diagnosis: "",
  treatment: "",
  prescription: "",
  notes: "",
  image: null,
};

const MedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [petFilter, setPetFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] =
    useState<MedicalRecordForm>(emptyForm);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  const [recordToDelete, setRecordToDelete] =
    useState<string | null>(null);

  /*
   * Load medical records
   */
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);

      const data = await getAllMedicalRecords();

      setRecords(data);
    } catch (error) {
      console.error(
        "Failed to load medical records:",
        error
      );

      toast.error(
        "Failed to load medical records."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Open create modal
   */
  const openCreateModal = () => {
    setForm({
      ...emptyForm,
    });

    setImagePreview(null);
    setModalOpen(true);
  };

  /*
   * Close modal
   */
  const closeModal = () => {
    if (submitting) {
      return;
    }

    setModalOpen(false);

    setForm({
      ...emptyForm,
    });

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);
  };

  /*
   * Form change
   */
  const handleChange = (
    field: keyof MedicalRecordForm,
    value: string | File | null
  ) => {
    setForm((current) => ({
      ...current,
      [field]:
        field === "petId" ||
        field === "vetId"
          ? Number(value)
          : value,
    }));
  };

  /*
   * Image selection
   */
  const handleImageChange = (
    file: File | null
  ) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setImagePreview(null);

      handleChange("image", null);

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, PNG and WEBP images are allowed."
      );

      handleChange("image", null);

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 10MB."
      );

      handleChange("image", null);

      return;
    }

    handleChange("image", file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  /*
   * Submit
   */
  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.petId) {
      toast.error("Please select a pet.");
      return;
    }

    if (!form.vetId) {
      toast.error(
        "Please select a veterinarian."
      );
      return;
    }

    if (!form.diagnosis.trim()) {
      toast.error(
        "Please enter a diagnosis."
      );
      return;
    }

    if (!form.treatment.trim()) {
      toast.error(
        "Please enter the treatment."
      );
      return;
    }

    if (!form.image) {
      toast.error(
        "Please select a medical record image."
      );
      return;
    }

    try {
      setSubmitting(true);

      const request: CreateMedicalRecordRequest = {
        petId: form.petId,
        vetId: form.vetId,
        diagnosis: form.diagnosis.trim(),
        treatment: form.treatment.trim(),
        prescription:
          form.prescription.trim() ||
          undefined,
        notes:
          form.notes.trim() ||
          undefined,
        image: form.image,
      };

      const createdRecord =
        await createMedicalRecord(request);

      setRecords((current) => [
        createdRecord,
        ...current,
      ]);

      toast.success(
        "Medical record created successfully."
      );

      closeModal();
    } catch (error) {
      console.error(
        "Failed to create medical record:",
        error
      );

      toast.error(
        "Failed to create medical record."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Delete
   */
  const handleDelete = async () => {
    if (!recordToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await deleteMedicalRecord(
        recordToDelete
      );

      setRecords((current) =>
        current.filter(
          (record) =>
            record.id !== recordToDelete
        )
      );

      toast.success(
        "Medical record deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete medical record:",
        error
      );

      toast.error(
        "Failed to delete medical record."
      );
    } finally {
      setDeleting(false);
      setRecordToDelete(null);
      setConfirmOpen(false);
    }
  };

  /*
   * Filter records
   */
  const filteredRecords = useMemo(() => {
    const searchTerm =
      search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !searchTerm ||
        record.diagnosis
          ?.toLowerCase()
          .includes(searchTerm) ||
        record.treatment
          ?.toLowerCase()
          .includes(searchTerm) ||
        record.prescription
          ?.toLowerCase()
          .includes(searchTerm) ||
        record.notes
          ?.toLowerCase()
          .includes(searchTerm) ||
        record.petId
          .toString()
          .includes(searchTerm) ||
        record.vetId
          .toString()
          .includes(searchTerm);

      const matchesPet =
        petFilter === "ALL" ||
        record.petId.toString() ===
          petFilter;

      return (
        matchesSearch &&
        matchesPet
      );
    });
  }, [
    records,
    search,
    petFilter,
  ]);

  /*
   * Date formatting
   */
  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  /*
   * Backend image URL
   *
   * The backend returns the stored file path.
   * The request should go through the API Gateway.
   */
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return "";
    }

    // Backend already returns a complete URL
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    // Backend returns only the GCS object/file name
    const bucketName = "vetcare-files-project-e9fb8820-8459-4622-9e9";

    return `https://storage.googleapis.com/${bucketName}/${imagePath}`;
  };


  /*
   * Open image
   */
  const openImage = (
    imagePath?: string
  ) => {
    
    if (!imagePath) {
      toast.error("Medical image is not available.");
      return;
    }

    const url = getImageUrl(imagePath);


    if (!url) {
      toast.error(
        "Medical image is not available."
      );

      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5f8f4] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                <FileText size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  Medical Records
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your pets&apos;
                  medical history
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700 sm:w-auto"
            >
              <Plus size={19} />
              Add Medical Record
            </button>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search medical records..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <select
              value={petFilter}
              onChange={(event) =>
                setPetFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            >
              <option value="ALL">
                All Pets
              </option>

              <option value="1">
                Max
              </option>

              <option value="2">
                Bella
              </option>

              <option value="3">
                Charlie
              </option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Loader2
                size={30}
                className="mx-auto animate-spin text-teal-600"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading medical records...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            filteredRecords.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                  <FileText size={30} />
                </div>

                <h2 className="text-lg font-semibold text-slate-800">
                  No medical records found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {search ||
                  petFilter !== "ALL"
                    ? "Try changing your search or filter."
                    : "Add a medical record to get started."}
                </p>
              </div>
            )}

          {/* Records */}
          {!loading &&
            filteredRecords.length > 0 && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {filteredRecords.map(
                  (record) => {
                    const imageUrl =
                      record.imagePath ? getImageUrl(record.imagePath) : ""

                    return (
                      <div
                        key={record.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* Image */}
                        {imageUrl && (
                          <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                            <img
                              src={imageUrl}
                              alt={
                                record.imageName ||
                                "Medical record"
                              }
                              className="h-full w-full object-cover"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />

                            <div className="absolute right-3 top-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openImage(record.imagePath ?? undefined)
                                }
                                className="rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
                                title="View image"
                              >
                                <Eye
                                  size={17}
                                />
                              </button>

                              <div className="rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm">
                                <ImageIcon
                                  size={17}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-5">

                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                <Stethoscope
                                  size={22}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs text-slate-400">
                                  Diagnosis
                                </p>

                                <h2 className="truncate font-bold text-slate-800">
                                  {record.diagnosis ||
                                    "No diagnosis"}
                                </h2>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setRecordToDelete(
                                  record.id
                                );

                                setConfirmOpen(
                                  true
                                );
                              }}
                              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              title="Delete record"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>
                          </div>

                          {/* Pet + Vet */}
                          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                              <PawPrint
                                size={19}
                                className="text-teal-600"
                              />

                              <div>
                                <p className="text-xs text-slate-400">
                                  Pet
                                </p>

                                <p className="text-sm font-medium text-slate-700">
                                  Pet #
                                  {
                                    record.petId
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                              <UserRound
                                size={19}
                                className="text-teal-600"
                              />

                              <div>
                                <p className="text-xs text-slate-400">
                                  Veterinarian
                                </p>

                                <p className="text-sm font-medium text-slate-700">
                                  Vet #
                                  {
                                    record.vetId
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Created date */}
                          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                            <CalendarDays
                              size={19}
                              className="text-teal-600"
                            />

                            <div>
                              <p className="text-xs text-slate-400">
                                Created
                              </p>

                              <p className="text-sm font-medium text-slate-700">
                                {formatDate(
                                  record.createdAt
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Treatment */}
                          {record.treatment && (
                            <div className="mt-4">
                              <p className="text-xs text-slate-400">
                                Treatment
                              </p>

                              <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
                                {
                                  record.treatment
                                }
                              </p>
                            </div>
                          )}

                          {/* Prescription */}
                          {record.prescription && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-400">
                                Prescription
                              </p>

                              <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
                                {
                                  record.prescription
                                }
                              </p>
                            </div>
                          )}

                          {/* Notes */}
                          {record.notes && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-400">
                                Notes
                              </p>

                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {
                                  record.notes
                                }
                              </p>
                            </div>
                          )}

                          {/* Image name */}
                          {record.imageName && (
                            <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 p-3">
                              <ImageIcon
                                size={17}
                                className="shrink-0 text-teal-600"
                              />

                              <p className="truncate text-xs font-medium text-teal-700">
                                {
                                  record.imageName
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
          <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
              <div>
                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                  Add Medical Record
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Add medical information and an image.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable form */}
            <div className="overflow-y-auto">
              <form
                onSubmit={handleSubmit}
                className="space-y-3.5 p-4 sm:p-5"
              >

                {/* Pet */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Pet
                  </label>

                  <select
                    value={form.petId}
                    onChange={(event) =>
                      handleChange(
                        "petId",
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value={0}>
                      Select pet
                    </option>

                    <option value={1}>
                      Max
                    </option>

                    <option value={2}>
                      Bella
                    </option>

                    <option value={3}>
                      Charlie
                    </option>
                  </select>
                </div>

                {/* Vet */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Veterinarian
                  </label>

                  <select
                    value={form.vetId}
                    onChange={(event) =>
                      handleChange(
                        "vetId",
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value={0}>
                      Select veterinarian
                    </option>

                    <option value={101}>
                      Dr. John
                    </option>

                    <option value={102}>
                      Dr. Sarah
                    </option>

                    <option value={103}>
                      Dr. Michael
                    </option>
                  </select>
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Diagnosis
                  </label>

                  <input
                    type="text"
                    value={form.diagnosis}
                    onChange={(event) =>
                      handleChange(
                        "diagnosis",
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    placeholder="e.g. Skin allergy"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Treatment */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Treatment
                  </label>

                  <textarea
                    value={form.treatment}
                    onChange={(event) =>
                      handleChange(
                        "treatment",
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    rows={3}
                    placeholder="Treatment provided..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Prescription */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Prescription
                  </label>

                  <textarea
                    value={form.prescription}
                    onChange={(event) =>
                      handleChange(
                        "prescription",
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    rows={2}
                    placeholder="Prescription details..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Notes
                  </label>

                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      handleChange(
                        "notes",
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    rows={2}
                    placeholder="Additional notes..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Medical Image
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center transition hover:border-teal-400 hover:bg-teal-50">
                    {imagePreview ? (
                      <div className="w-full">
                        <img
                          src={imagePreview}
                          alt="Selected medical record"
                          className="mx-auto h-36 w-full rounded-lg object-cover"
                        />

                        <p className="mt-3 truncate text-sm font-medium text-slate-700">
                          {form.image?.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload
                          size={22}
                          className="text-teal-600"
                        />

                        <p className="mt-2 text-sm font-medium text-slate-700">
                          Choose medical image
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          JPG, PNG or WEBP • Max 10MB
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={submitting}
                      className="hidden"
                      onChange={(event) => {
                        const file =
                          event.target.files?.[0] ??
                          null;

                        handleImageChange(file);

                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {submitting
                      ? "Saving..."
                      : "Save Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Medical Record"
        message="Are you sure you want to delete this medical record?"
        confirmText={
          deleting
            ? "Deleting..."
            : "Yes, Delete"
        }
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          if (deleting) {
            return;
          }

          setConfirmOpen(false);
          setRecordToDelete(null);
        }}
      />
    </>
  );
};

export default MedicalRecords;