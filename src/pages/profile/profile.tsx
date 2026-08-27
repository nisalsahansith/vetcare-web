import { useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Hash,
  Pencil,
  LockKeyhole,
  LogOut,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { clearAuth, getAuth } from "../../auth/AuthStorage";

interface ProfileForm {
  name: string;
  email: string;
}

const Profile = () => {
  const navigate = useNavigate();

  const auth = getAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    name: "Pet Owner",
    email: auth?.email ?? "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleProfileSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    toast.success("Profile updated successfully.");
    setEditOpen(false);
  };

  const handlePasswordSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.success("Password changed successfully.");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordOpen(false);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5f8f4] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account information and security
            </p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Cover */}
            <div className="h-28 bg-[#18352b] sm:h-36" />

            {/* Profile Header */}
            <div className="px-5 pb-5 sm:px-8 sm:pb-7">

              <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                  {/* Avatar */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#8fc9a5] text-[#18352b] shadow-md sm:h-28 sm:w-28">
                    <UserRound size={48} />
                  </div>

                  <div className="pb-1">
                    <h2 className="text-xl font-bold text-slate-800">
                      {form.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Pet Owner
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>

              </div>

            </div>
          </div>

          {/* Information */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Personal Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <h2 className="font-bold text-slate-800">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your basic account information
                </p>
              </div>

              <div className="space-y-4">

                {/* Name */}
                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <UserRound size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      Full Name
                    </p>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {form.name}
                    </p>
                  </div>

                </div>

                {/* Email */}
                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Mail size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      Email Address
                    </p>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {auth?.email || "Not available"}
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* Account Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <h2 className="font-bold text-slate-800">
                  Account Information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Information about your VetCare account
                </p>
              </div>

              <div className="space-y-4">

                {/* ID */}
                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Hash size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Account ID
                    </p>

                    <p className="text-sm font-semibold text-slate-700">
                      #{auth?.userId ?? "N/A"}
                    </p>
                  </div>

                </div>

                {/* Role */}
                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Account Role
                    </p>

                    <p className="text-sm font-semibold text-slate-700">
                      {auth?.role || "PET_OWNER"}
                    </p>
                  </div>

                </div>

              </div>
            </section>

          </div>

          {/* Security */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5">
              <h2 className="font-bold text-slate-800">
                Security
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Manage your account security
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Password
                  </p>

                  <p className="text-xs text-slate-400">
                    Keep your account secure
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setPasswordOpen(true)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Change Password
              </button>

            </div>

          </section>

          {/* Logout */}
          <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-bold text-slate-800">
                  Sign out
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Sign out of your VetCare account on this device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>

          </section>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>
                <h2 className="font-bold text-slate-800">
                  Edit Profile
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Update your profile information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="space-y-4 p-5"
            >

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Email changes will be handled through account settings.
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">

                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>
                <h2 className="font-bold text-slate-800">
                  Change Password
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Update your account password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPasswordOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4 p-5"
            >

              {/* Current */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Current Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword:
                          event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>
              </div>

              {/* New */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword:
                          event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showNewPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Confirm New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword:
                          event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setPasswordOpen(false)
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Change Password
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default Profile;