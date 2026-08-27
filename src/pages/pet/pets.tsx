import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  PawPrint,
  Trash2,
  Dog,
  Cat,
  X,
  Pencil,
} from "lucide-react";

import type { Pet, CreatePetRequest } from "../../types/Pet";
import {
  createPet,
  deletePet,
  getAllPets,
  updatePet,
} from "../../api/PetApi";
import { getAuth } from "../../auth/AuthStorage";

const emptyForm: CreatePetRequest = {
  name: "",
  species: "",
  breed: "",
  age: null,
  ownerId:0
};

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const [form, setForm] = useState<CreatePetRequest>(emptyForm);
  const [saving, setSaving] = useState(false);

  const auth = getAuth();

  if (!auth) {
    alert("Your session has expired. Please login again.");
    return;
  }

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);

      const data = await getAllPets();

      setPets(data);
    } catch (error) {
      console.error("Failed to load pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPet(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openUpdateModal = (pet: Pet) => {
    setEditingPet(pet);

    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      age: pet.age,
      ownerId: pet.ownerId,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingPet(null);
    setForm(emptyForm);
  };

  const handleChange = (
    field: keyof CreatePetRequest,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAgeChange = (value: string) => {
    setForm((current) => ({
      ...current,
      age: value === "" ? null : Number(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter your pet's name.");
      return;
    }

    if (!form.species.trim()) {
      alert("Please enter the species.");
      return;
    }

    try {
      setSaving(true);

      const payload: CreatePetRequest = {
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed?.trim() || "",
        age: form.age,
        ownerId: auth.userId,
      };

      if (editingPet) {
        await updatePet(editingPet.id, payload);
      } else {
        await createPet(payload);
      }

      await loadPets();

      setModalOpen(false);
      setEditingPet(null);
      setForm(emptyForm);
    } catch (error) {
      console.error("Failed to save pet:", error);
      alert(
        editingPet
          ? "Failed to update pet."
          : "Failed to create pet."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pet?"
    );

    if (!confirmed) return;

    try {
      await deletePet(id);

      setPets((currentPets) =>
        currentPets.filter((pet) => pet.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete pet:", error);
      alert("Failed to delete pet.");
    }
  };

  const filteredPets = pets.filter((pet) => {
    const searchTerm = search.toLowerCase();

    return (
      pet.name.toLowerCase().includes(searchTerm) ||
      pet.species.toLowerCase().includes(searchTerm) ||
      pet.breed?.toLowerCase().includes(searchTerm)
    );
  });

  const getPetIcon = (species: string) => {
    const value = species.toLowerCase();

    if (value.includes("cat")) {
      return <Cat size={24} />;
    }

    return <Dog size={24} />;
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5f8f4] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                <PawPrint size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  My Pets
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your beloved companions
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700 sm:w-auto"
            >
              <Plus size={19} />
              Add Pet
            </button>
          </div>

          {/* Search */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative max-w-xl">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search pets by name, species or breed..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                Loading pets...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredPets.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                <PawPrint size={30} />
              </div>

              <h2 className="text-lg font-semibold text-slate-800">
                {search ? "No pets found" : "No pets yet"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Add your first pet to get started."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <Plus size={18} />
                  Add Your First Pet
                </button>
              )}
            </div>
          )}

          {/* Pet Cards */}
          {!loading && filteredPets.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPets.map((pet) => (
                <div
                  key={pet.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                        {getPetIcon(pet.species)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-slate-800">
                          {pet.name}
                        </h2>

                        <p className="text-sm text-slate-500">
                          {pet.species}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openUpdateModal(pet)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-teal-50 hover:text-teal-600"
                        title="Edit pet"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(pet.id)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Delete pet"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Pet Information */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Breed
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {pet.breed || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Age
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {pet.age !== null
                          ? `${pet.age} years`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Owner ID
                    </p>

                    <p className="text-sm font-medium text-slate-600">
                      #{pet.ownerId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create / Update Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingPet ? "Update Pet" : "Add New Pet"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingPet
                    ? "Update your pet's information."
                    : "Enter your pet's information below."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pet Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    handleChange("name", event.target.value)
                  }
                  placeholder="e.g. Max"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  required
                />
              </div>

              {/* Species */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Species
                </label>

                <select
                  value={form.species}
                  onChange={(event) =>
                    handleChange("species", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  required
                >
                  <option value="">Select species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Breed + Age */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Breed
                  </label>

                  <input
                    type="text"
                    value={form.breed || ""}
                    onChange={(event) =>
                      handleChange("breed", event.target.value)
                    }
                    placeholder="e.g. Labrador"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Age
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.age ?? ""}
                    onChange={(event) =>
                      handleAgeChange(event.target.value)
                    }
                    placeholder="Years"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingPet
                    ? "Update Pet"
                    : "Create Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Pets;