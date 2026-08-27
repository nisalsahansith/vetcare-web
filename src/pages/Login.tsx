import { useState } from "react";
import { login } from "../api/AuthApi";
import { saveAuth } from "../auth/AuthStorage";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
    ) => {
    event.preventDefault();

    try {
        const response = await login({
        email,
        password,
        });

        saveAuth(response);
        navigate("/dashboard");

        console.log("Login successful:", response);
    } catch (error) {
        console.error("Login failed:", error);
    }
    };

  return (
    <main className="min-h-screen bg-[#F5F8F4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(31,78,70,0.12)] lg:grid-cols-[1.05fr_0.95fr]">

          {/* Left Brand Section */}
          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#174C46] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#5ED6B3]/20" />
            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#F08A72]/15" />

            {/* Small decorative shapes */}
            <div className="absolute right-16 top-28 h-4 w-4 rounded-full bg-[#F6C85F]" />
            <div className="absolute bottom-36 right-24 h-3 w-3 rounded-full bg-[#5ED6B3]" />

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

            <div className="relative z-10 max-w-lg">
              <span className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#C9F1E5] backdrop-blur">
                Trusted pet care management
              </span>

              <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Caring for every
                <span className="block text-[#5ED6B3]">
                  paw & heartbeat.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-[#C2DCD6]">
                Manage pets, appointments, medical records and
                veterinary care from one beautifully simple place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#E5F6F1] backdrop-blur">
                  🩺 Medical records
                </div>

                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#E5F6F1] backdrop-blur">
                  📅 Appointments
                </div>

                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#E5F6F1] backdrop-blur">
                  🐶 Pet profiles
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
              <p className="text-sm text-[#A9CCC4]">
                Made for veterinary teams
              </p>

              <span className="text-xl">🐕 🐈</span>
            </div>
          </section>

          {/* Login Section */}
          <section className="flex min-h-[680px] items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">

              {/* Mobile Brand */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
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
                  Welcome back
                </span>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#173B37] sm:text-4xl">
                  Good to see you
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#718783]">
                  Sign in to continue managing your veterinary
                  care workspace.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#35524D]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#82A29A]">
                      @
                    </span>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] py-3.5 pl-11 pr-4 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-[#35524D]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-[#2F8C7D] transition hover:text-[#174C46]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#82A29A]">
                      •••
                    </span>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-[#D9E5E1] bg-[#FAFCFB] py-3.5 pl-11 pr-4 text-sm text-[#173B37] outline-none transition placeholder:text-[#A5B8B3] focus:border-[#4CBFA2] focus:bg-white focus:ring-4 focus:ring-[#4CBFA2]/10"
                    />
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-3">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#C9DAD5] accent-[#2F8C7D]"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-[#718783]"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-xl bg-[#174C46] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#174C46]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#123E39] hover:shadow-xl hover:shadow-[#174C46]/20 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Sign in to VetCare
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#E5ECE9]" />

                <span className="text-xs text-[#A0B2AE]">
                  New to VetCare?
                </span>

                <div className="h-px flex-1 bg-[#E5ECE9]" />
              </div>

              {/* Register */}
              <a
                href="/register"
                className="flex w-full items-center justify-center rounded-xl border border-[#CFE0DB] bg-white px-4 py-3.5 text-sm font-semibold text-[#27786C] transition hover:border-[#8FCBBC] hover:bg-[#F4FAF8]"
              >
                Create your account
              </a>

              <p className="mt-8 text-center text-xs leading-5 text-[#9AAEA9]">
                By continuing, you agree to VetCare's
                <br />
                Terms of Service and Privacy Policy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Login;