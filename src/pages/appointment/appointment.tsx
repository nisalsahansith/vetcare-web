import { useEffect, useState } from "react";
import {
  CalendarDays,
  Search,
  Plus,
  Clock,
  UserRound,
  PawPrint,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import type { Appointment } from "../../types/Appointment";
import { toast } from "sonner";
import ConfirmModal from "../../components/common/ConfirmModel";
import { createAppointment, deleteAppointment, getAllAppointments } from "../../api/Appoiment";

// const mockAppointments: Appointment[] = [
//   {
//     id: 1,
//     petId: 1,
//     vetId: 101,
//     appointmentDate: "2026-08-25T10:30:00",
//     status: "PENDING",
//     reason: "Regular health checkup",
//   },
//   {
//     id: 2,
//     petId: 2,
//     vetId: 102,
//     appointmentDate: "2026-08-27T14:00:00",
//     status: "CONFIRMED",
//     reason: "Vaccination",
//   },
//   {
//     id: 3,
//     petId: 1,
//     vetId: 103,
//     appointmentDate: "2026-09-02T09:00:00",
//     status: "COMPLETED",
//     reason: "Follow-up examination",
//   },
// ];

interface AppointmentForm {
  petId: number;
  vetId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
}

const emptyForm: AppointmentForm = {
  petId: 0,
  vetId: 0,
  appointmentDate: "",
  appointmentTime: "",
  status: "PENDING",
  reason: "",
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [form, setForm] =
    useState<AppointmentForm>(emptyForm);

  const openCreateModal = () => {
    setEditingAppointment(null);

    setForm({
      ...emptyForm,
      appointmentDate: "",
      appointmentTime: "",
    });

    setModalOpen(true);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const data = await getAllAppointments();

      setAppointments(data);
    } catch (error) {
      console.error(
        "Failed to load appointments:",
        error
      );

      toast.error(
        "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (appointment: Appointment) => {
    const date = new Date(appointment.appointmentDate);

    const dateValue = date.toISOString().split("T")[0];

    const timeValue = date.toTimeString().slice(0, 5);

    setEditingAppointment(appointment);

    setForm({
      petId: appointment.petId,
      vetId: appointment.vetId,
      appointmentDate: dateValue,
      appointmentTime: timeValue,
      status: appointment.status,
      reason: appointment.reason || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAppointment(null);
    setForm(emptyForm);
  };

  const handleFormChange = (
    field: keyof AppointmentForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]:
        field === "petId" || field === "vetId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.petId) {
      toast.error("Please select a pet.");
      return;
    }

    if (!form.vetId) {
      toast.error("Please select a veterinarian.");
      return;
    }

    if (!form.appointmentDate) {
      toast.error("Please select an appointment date.");
      return;
    }

    if (!form.appointmentTime) {
      toast.error("Please select an appointment time.");
      return;
    }

    const appointmentDate =
      `${form.appointmentDate}T${form.appointmentTime}:00`;

    try {
      if (editingAppointment) {
        toast.info(
          "Appointment update API is not available yet."
        );

        return;
      }

      const createdAppointment =
        await createAppointment({
          petId: form.petId,
          vetId: form.vetId,
          appointmentDate,
          status: form.status,
          reason: form.reason || undefined,
        });

      setAppointments((current) => [
        createdAppointment,
        ...current,
      ]);

      toast.success(
        "Appointment booked successfully."
      );

      closeModal();
    } catch (error) {
      console.error(
        "Failed to create appointment:",
        error
      );

      toast.error(
        "Failed to book appointment."
      );
    }
  };
    
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] =
    useState<number | null>(null);

  const handleDelete = async () => {
    if (appointmentToDelete === null) {
      return;
    }

    try {
      await deleteAppointment(
        appointmentToDelete
      );

      setAppointments((current) =>
        current.filter(
          (appointment) =>
            appointment.id !== appointmentToDelete
        )
      );

      toast.success(
        "Appointment cancelled successfully."
      );
    } catch (error) {
      console.error(
        "Failed to cancel appointment:",
        error
      );

      toast.error(
        "Failed to cancel appointment."
      );
    } finally {
      setAppointmentToDelete(null);
      setConfirmOpen(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        appointment.reason
          ?.toLowerCase()
          .includes(searchTerm) ||
        appointment.petId
          .toString()
          .includes(searchTerm) ||
        appointment.vetId
          .toString()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Page */}
      <div className="min-h-screen bg-[#f5f8f4] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                <CalendarDays size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  Appointments
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your veterinary appointments
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700 sm:w-auto"
            >
              <Plus size={19} />
              Book Appointment
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
                placeholder="Search appointments..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

              <p className="text-sm text-slate-500">
                Loading appointments...
              </p>
            </div>
          )}
          {/* Empty */}
          {!loading && filteredAppointments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                <CalendarDays size={30} />
              </div>

              <h2 className="text-lg font-semibold text-slate-800">
                No appointments found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or create a new appointment.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && filteredAppointments.length > 0 && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {filteredAppointments.map(
                (appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                          <PawPrint size={22} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Pet
                          </p>

                          <h2 className="font-bold text-slate-800">
                            Pet #{appointment.petId}
                          </h2>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    {/* Appointment Info */}
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <CalendarDays
                          size={19}
                          className="text-teal-600"
                        />

                        <div>
                          <p className="text-xs text-slate-400">
                            Date
                          </p>

                          <p className="text-sm font-medium text-slate-700">
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <Clock
                          size={19}
                          className="text-teal-600"
                        />

                        <div>
                          <p className="text-xs text-slate-400">
                            Time
                          </p>

                          <p className="text-sm font-medium text-slate-700">
                            {formatTime(
                              appointment.appointmentDate
                            )}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Vet */}
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <UserRound
                        size={19}
                        className="text-teal-600"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Veterinarian
                        </p>

                        <p className="text-sm font-medium text-slate-700">
                          Vet #{appointment.vetId}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    {appointment.reason && (
                      <div className="mt-4">
                        <p className="text-xs text-slate-400">
                          Reason
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {appointment.reason}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          openUpdateModal(
                            appointment
                          )
                        }
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-600"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                            setAppointmentToDelete(appointment.id);
                            setConfirmOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                        Cancel
                      </button>

                    </div>
                  </div>
                )
              )}

            </div>
          )}
        </div>
      </div>

      {/* Create / Update Modal */}
        {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">

            <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">

                <div>
                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                    {editingAppointment
                    ? "Update Appointment"
                    : "Book Appointment"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                    {editingAppointment
                    ? "Update appointment details."
                    : "Schedule a new appointment."}
                </p>
                </div>

                <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                <X size={18} />
                </button>

            </div>

            {/* Scrollable Form Area */}
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
                        handleFormChange(
                        "petId",
                        event.target.value
                        )
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    >
                    <option value={0}>
                        Select your pet
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

                {/* Veterinarian */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Veterinarian
                    </label>

                    <select
                    value={form.vetId}
                    onChange={(event) =>
                        handleFormChange(
                        "vetId",
                        event.target.value
                        )
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
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

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">

                    <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Date
                    </label>

                    <input
                        type="date"
                        value={form.appointmentDate}
                        onChange={(event) =>
                        handleFormChange(
                            "appointmentDate",
                            event.target.value
                        )
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    />
                    </div>

                    <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Time
                    </label>

                    <input
                        type="time"
                        value={form.appointmentTime}
                        onChange={(event) =>
                        handleFormChange(
                            "appointmentTime",
                            event.target.value
                        )
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    />
                    </div>

                </div>

                {/* Status */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Status
                    </label>

                    <select
                    value={form.status}
                    onChange={(event) =>
                        handleFormChange(
                        "status",
                        event.target.value
                        )
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    >
                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="CONFIRMED">
                        Confirmed
                    </option>

                    <option value="COMPLETED">
                        Completed
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>
                    </select>
                </div>

                {/* Reason */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Reason
                    </label>

                    <textarea
                    value={form.reason}
                    onChange={(event) =>
                        handleFormChange(
                        "reason",
                        event.target.value
                        )
                    }
                    rows={2}
                    placeholder="Reason for appointment..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">

                    <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                    Cancel
                    </button>

                    <button
                    type="submit"
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                    >
                    {editingAppointment
                        ? "Update"
                        : "Book"}
                    </button>

                </div>

                </form>

            </div>
            </div>
        </div>
          )}
          
          <ConfirmModal
                open={confirmOpen}
                title="Cancel Appointment"
                message="Are you sure you want to cancel this appointment?"
                confirmText="Yes, Cancel"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setAppointmentToDelete(null);
                }}
            />
    </>
  );
};

export default Appointments;