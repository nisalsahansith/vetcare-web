import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { register } from "../api/AuthApi";
import type { RegisterRequest } from "../types/Auth";

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [termsAccepted, setTermsAccepted] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!firstName.trim()) {
      toast.error("Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      toast.error("Please enter your last name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!/^07\d{8}$/.test(phone.trim())) {
      toast.error(
        "Please enter a valid Sri Lankan mobile number."
      );
      return;
    }

    if (!password) {
      toast.error("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      toast.error(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    const request: RegisterRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
    };

    try {
      setLoading(true);

      await register(request);

      toast.success(
        "Account created successfully. Please sign in."
      );

      navigate("/login");
    } catch (error: any) {
      console.error(
        "Registration failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create account. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F8F4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(31,78,70,0.12)] lg:grid-cols-[0.95fr_1.05fr]">

          {/* =====================================================
              BRAND SECTION
          ====================================================== */}

          <section className="relative hidden min-h-[700px] overflow-hidden bg-[#174C46] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#5ED6B3]/20" />

            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#F08A72]/15" />

            <div className="absolute right-16 top-28 h-4 w-4 rounded-full bg-[#F6C85F]" />

            {/* Logo */}

            <div className="relative z-10">
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5ED6B3] text-2xl text-[#174C46]">
                  🐾
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    VetCare
                  </h1>

                  <p className="text-xs text-[#B9DED3]">
                    Better care. Happier pets.
                  </p>
                </div>

              </div>
            </div>

            {/* Content */}

            <div className="relative z-10 max-w-lg">

              <span className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#C9F1E5] backdrop-blur">
                Your pet care journey starts here
              </span>

              <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                One place for

                <span className="block text-[#5ED6B3]">
                  every little paw.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-[#C2DCD6]">
                Create your VetCare account and keep your
                pets' information, appointments and medical
                history organized in one place.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    🐶
                  </div>

                  <span className="text-sm text-[#D8ECE7]">
                    Manage all your pets
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    📅
                  </div>

                  <span className="text-sm text-[#D8ECE7]">
                    Keep appointments organized
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    🩺
                  </div>

                  <span className="text-sm text-[#D8ECE7]">
                    Access medical records easily
                  </span>

                </div>

              </div>

            </div>

            <p className="relative z-10 text-sm text-[#A9CCC4]">
              Caring technology for modern pet owners
            </p>

          </section>

          {/* =====================================================
              REGISTER FORM
          ====================================================== */}

          <section className="flex min-h-[700px] items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16">

            <div className="w-full max-w-md">

              {/* Mobile Brand */}

              <div className="mb-8 flex items-center gap-3 lg:hidden">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174C46] text-xl">
                  🐾
                </div>

                <div>
                  <h1 className="font-bold text-[#174C46]">
                    VetCare
                  </h1>

                  <p className="text-xs text-[#78918B]">
                    Better care. Happier pets.
                  </p>
                </div>

              </div>

              {/* Heading */}

              <div>

                <span className="inline-flex rounded-full bg-[#E5F6F0] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#27786C]">
                  Get started
                </span>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#173B37] sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#718783]">
                  Join VetCare and make managing your pet's
                  care simpler.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >

                {/* First + Last Name */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-[#35524D]"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(
                          event.target.value
                        )
                      }
                      placeholder="First name"
                      autoComplete="given-name"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] px-4 py-3.5 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-[#35524D]"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(
                          event.target.value
                        )
                      }
                      placeholder="Last name"
                      autoComplete="family-name"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] px-4 py-3.5 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#35524D]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] px-4 py-3.5 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                {/* Phone */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-[#35524D]"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="0771234567"
                    maxLength={10}
                    autoComplete="tel"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] px-4 py-3.5 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-1.5 text-xs text-[#9AA9A0]">
                    Example: 0771234567
                  </p>

                </div>

                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#35524D]"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] px-4 py-3.5 pr-12 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#78918B] hover:bg-[#EAF5F1] hover:text-[#27786C]"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                  <p className="mt-1.5 text-xs text-[#9AA9A0]">
                    Minimum 8 characters
                  </p>

                </div>

                {/* Confirm Password */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-[#35524D]"
                  >
                    Confirm password
                  </label>

                  <div className="relative">

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] px-4 py-3.5 pr-12 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#78918B] hover:bg-[#EAF5F1] hover:text-[#27786C]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Terms */}

                <div className="flex items-start gap-3 pt-1">

                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) =>
                      setTermsAccepted(
                        event.target.checked
                      )
                    }
                    disabled={loading}
                    className="mt-1 h-4 w-4 rounded border-[#C9DAD5] accent-[#2F8C7D]"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-[#718783]"
                  >
                    I agree to the VetCare Terms of
                    Service and Privacy Policy.
                  </label>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full rounded-xl bg-[#174C46] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#174C46]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#123E39] hover:shadow-xl hover:shadow-[#174C46]/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >

                  <span className="flex items-center justify-center gap-2">

                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />

                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}

                  </span>

                </button>

              </form>

              {/* Login */}

              <div className="mt-7 text-center">

                <span className="text-sm text-[#718783]">
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="ml-2 text-sm font-bold text-[#27786C] transition hover:text-[#174C46]"
                >
                  Sign in
                </button>

              </div>

            </div>

          </section>

        </div>

      </div>
    </main>
  );
};

export default Register;