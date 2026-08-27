import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  PawPrint,
  FileText,
  ArrowRight,
  Clock3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getAuth } from "../auth/AuthStorage";

import { getAllPets } from "../api/PetApi";
import { getAllAppointments } from "../api/Appoiment";
import { getAllMedicalRecords } from "../api/MedicalRecordsApi";

import type { Pet } from "../types/Pet";
import type { Appointment } from "../types/Appointment";
import type { MedicalRecord } from "../types/MedicalRecord";

const Dashboard = () => {
  const navigate = useNavigate();

  const auth = getAuth();

  const firstName =
    auth?.email?.split("@")[0] || "Pet Parent";

  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);
  const [medicalRecords, setMedicalRecords] = useState<
    MedicalRecord[]
  >([]);

  const [loading, setLoading] = useState(true);

  /*
   * Load dashboard data
   */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          petsData,
          appointmentsData,
          medicalRecordsData,
        ] = await Promise.all([
          getAllPets(),
          getAllAppointments(),
          getAllMedicalRecords(),
        ]);

        setPets(petsData);
        setAppointments(appointmentsData);
        setMedicalRecords(medicalRecordsData);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        toast.error(
          "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /*
   * Upcoming appointments
   *
   * Ignore cancelled/completed appointments.
   */
  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(
          appointment.appointmentDate
        );

        return (
          appointmentDate >= now &&
          appointment.status !== "CANCELLED" &&
          appointment.status !== "COMPLETED"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );
  }, [appointments]);

  const nextAppointment =
    upcomingAppointments[0] || null;

  /*
   * Format appointment date
   */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  /*
   * Format appointment time
   */
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  /*
   * Get pet name
   *
   * Your current dashboard can still work if
   * Pet API returns only IDs/names differently.
   */
  const getPetName = (petId: number) => {
    const pet = pets.find(
      (item) => item.id === petId
    );

    if (!pet) {
      return `Pet #${petId}`;
    }

    return (
      pet.name ||
      `Pet #${petId}`
    );
  };

  /*
   * Navigation helpers
   */
  const goToPets = () => {
    navigate("/pets");
  };

  const goToAppointments = () => {
    navigate("/appointments");
  };

  const goToMedicalRecords = () => {
    navigate("/medical-records");
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f4]">

        <header className="flex h-20 items-center justify-between border-b border-[#e4ebe5] bg-white px-5 sm:px-8">

          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-6 w-28 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

        </header>

        <div className="mx-auto max-w-7xl p-5 sm:p-8">

          <div className="flex min-h-[60vh] items-center justify-center">

            <div className="text-center">

              <Loader2
                className="mx-auto animate-spin text-[#4f8f68]"
                size={32}
              />

              <p className="mt-3 text-sm text-[#78907f]">
                Loading your dashboard...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f4]">

      {/* Header */}
      <header className="flex h-20 items-center justify-between border-b border-[#e4ebe5] bg-white px-5 sm:px-8">

        <div>
          <p className="text-sm text-[#78907f]">
            {new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
              }
            )}
          </p>

          <h1 className="text-xl font-bold text-[#20352a]">
            Dashboard
          </h1>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcefe2] font-semibold text-[#28533d]">
          {firstName
            .charAt(0)
            .toUpperCase()}
        </div>

      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-5 sm:p-8">

        {/* Welcome */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#dcefe2] to-[#eef7ef] p-6 sm:p-8">

          <div className="max-w-xl">

            <p className="mb-2 font-medium text-[#5f816b]">
              Welcome back 👋
            </p>

            <h2 className="text-3xl font-bold text-[#20352a] sm:text-4xl">

              Take care of the ones

              <span className="text-[#4f8f68]">
                {" "}you love.
              </span>

            </h2>

            <p className="mt-3 max-w-lg text-[#63796b]">
              Keep track of your pets, appointments
              and medical records all in one place.
            </p>

          </div>

          <div className="absolute bottom-0 right-10 hidden text-8xl opacity-20 sm:block">
            🐾
          </div>

        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            icon={<PawPrint />}
            title="My Pets"
            value={pets.length.toString()}
            description={
              pets.length === 1
                ? "Registered pet"
                : "Registered pets"
            }
            onClick={goToPets}
          />

          <StatCard
            icon={<CalendarDays />}
            title="Appointments"
            value={upcomingAppointments.length.toString()}
            description="Upcoming appointments"
            onClick={goToAppointments}
          />

          <StatCard
            icon={<FileText />}
            title="Medical Records"
            value={medicalRecords.length.toString()}
            description="Health records"
            onClick={goToMedicalRecords}
          />

        </section>

        {/* Bottom Grid */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Upcoming Appointment */}
          <div className="rounded-3xl border border-[#e4ebe5] bg-white p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-[#20352a]">
                  Upcoming Appointment
                </h3>

                <p className="mt-1 text-sm text-[#82938a]">
                  Your next visit
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f3eb]">
                <CalendarDays className="h-5 w-5 text-[#4f8f68]" />
              </div>

            </div>

            {nextAppointment ? (
              <div className="rounded-2xl border border-[#d7e2da] bg-[#f8fbf8] p-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f3eb]">
                      <PawPrint className="h-5 w-5 text-[#4f8f68]" />
                    </div>

                    <div>

                      <p className="text-xs text-[#82938a]">
                        Pet
                      </p>

                      <p className="font-semibold text-[#20352a]">
                        {getPetName(
                          nextAppointment.petId
                        )}
                      </p>

                    </div>

                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {nextAppointment.status}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <div className="rounded-xl bg-white p-3">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={17}
                        className="text-[#4f8f68]"
                      />

                      <div>

                        <p className="text-xs text-[#82938a]">
                          Date
                        </p>

                        <p className="text-sm font-medium text-[#52655a]">
                          {formatDate(
                            nextAppointment.appointmentDate
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-xl bg-white p-3">

                    <div className="flex items-center gap-2">

                      <Clock3
                        size={17}
                        className="text-[#4f8f68]"
                      />

                      <div>

                        <p className="text-xs text-[#82938a]">
                          Time
                        </p>

                        <p className="text-sm font-medium text-[#52655a]">
                          {formatTime(
                            nextAppointment.appointmentDate
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {nextAppointment.reason && (
                  <div className="mt-3">

                    <p className="text-xs text-[#82938a]">
                      Reason
                    </p>

                    <p className="mt-1 text-sm text-[#52655a]">
                      {nextAppointment.reason}
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  onClick={goToAppointments}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4f8f68] transition hover:text-[#356a4a]"
                >
                  View appointments

                  <ArrowRight
                    className="h-4 w-4"
                  />

                </button>

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d7e2da] p-6 text-center">

                <Clock3 className="mx-auto mb-3 h-8 w-8 text-[#9aac9f]" />

                <p className="font-medium text-[#52655a]">
                  No upcoming appointments
                </p>

                <button
                  type="button"
                  onClick={goToAppointments}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4f8f68] hover:text-[#356a4a]"
                >
                  Book an appointment

                  <ArrowRight className="h-4 w-4" />

                </button>

              </div>
            )}

          </div>

          {/* My Pets */}
          <div className="rounded-3xl border border-[#e4ebe5] bg-white p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-[#20352a]">
                  My Pets
                </h3>

                <p className="mt-1 text-sm text-[#82938a]">
                  Your furry companions
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f3eb]">
                <PawPrint className="h-5 w-5 text-[#4f8f68]" />
              </div>

            </div>

            {pets.length > 0 ? (
              <div className="space-y-3">

                {pets.slice(0, 3).map((pet) => (
                  <div
                    key={pet.id}
                    className="flex items-center justify-between rounded-2xl border border-[#e4ebe5] bg-[#f8fbf8] p-4"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f3eb]">
                        <PawPrint
                          size={19}
                          className="text-[#4f8f68]"
                        />
                      </div>

                      <div>

                        <p className="font-semibold text-[#20352a]">
                          {pet.name ||
                            `Pet #${pet.id}`}
                        </p>

                        <p className="text-xs text-[#82938a]">
                          {pet.species ||
                            "Pet"}
                        </p>

                      </div>

                    </div>

                    <ArrowRight
                      size={17}
                      className="text-[#9aac9f]"
                    />

                  </div>
                ))}

                {pets.length > 3 && (
                  <button
                    type="button"
                    onClick={goToPets}
                    className="w-full pt-2 text-sm font-semibold text-[#4f8f68] hover:text-[#356a4a]"
                  >
                    View all {pets.length} pets
                  </button>
                )}

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d7e2da] p-6 text-center">

                <div className="mb-3 text-3xl">
                  🐶 🐱
                </div>

                <p className="font-medium text-[#52655a]">
                  No pets added yet
                </p>

                <button
                  type="button"
                  onClick={goToPets}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4f8f68] hover:text-[#356a4a]"
                >
                  Add your first pet

                  <ArrowRight className="h-4 w-4" />

                </button>

              </div>
            )}

          </div>

        </section>

        {/* API Error / Empty Information */}
        {!loading &&
          pets.length === 0 &&
          appointments.length === 0 &&
          medicalRecords.length === 0 && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e4ebe5] bg-white p-4">

              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-[#78907f]"
              />

              <div>

                <p className="text-sm font-semibold text-[#20352a]">
                  Your dashboard is empty
                </p>

                <p className="mt-1 text-xs text-[#82938a]">
                  Add a pet or book an appointment to
                  start using VetCare.
                </p>

              </div>

            </div>
          )}

      </div>

    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  onClick: () => void;
}

const StatCard = ({
  icon,
  title,
  value,
  description,
  onClick,
}: StatCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-3xl border border-[#e4ebe5] bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-[#82938a]">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#20352a]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#9aa9a0]">
            {description}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f3eb] text-[#4f8f68] transition group-hover:bg-[#dcefe2]">
          {icon}
        </div>

      </div>

    </button>
  );
};

export default Dashboard;