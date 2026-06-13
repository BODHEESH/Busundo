import Link from "next/link";
import { GraduationCap, MapPin, Check } from "lucide-react";

const colleges = [
  "Rajagiri School of Engineering & Technology",
  "Cochin University of Science and Technology (CUSAT)",
  "College of Engineering Trivandrum (CET)",
  "Mar Athanasius College of Engineering (MACE)",
  "Federal Institute of Science and Technology (FISAT)",
  "TKM College of Engineering",
  "Government Engineering College Thrissur",
  "Other",
];

const cities = [
  "Thiruvananthapuram",
  "Kochi",
  "Kozhikode",
  "Thrissur",
  "Kollam",
  "Palakkad",
  "Alappuzha",
  "Kannur",
  "Kottayam",
  "Malappuram",
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-paper px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-transit">
              <span className="h-3 w-3 rounded-full bg-signal" />
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Welcome to Busundo!
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Let's personalize your experience
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-transit/10">
                <GraduationCap className="h-4 w-4 text-transit" />
              </span>
              <h2 className="font-display text-lg font-bold">Select your college</h2>
            </div>
            <p className="mb-4 text-sm text-ink/60">
              This helps us connect you with fellow students
            </p>
            <div className="space-y-2">
              {colleges.map((college) => (
                <label
                  key={college}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 transition hover:border-transit hover:bg-transit/5"
                >
                  <input
                    type="radio"
                    name="college"
                    value={college}
                    className="h-4 w-4 accent-transit"
                  />
                  <span className="text-sm font-medium">{college}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-transit/10">
                <MapPin className="h-4 w-4 text-transit" />
              </span>
              <h2 className="font-display text-lg font-bold">Your primary city</h2>
            </div>
            <p className="mb-4 text-sm text-ink/60">
              Where do you usually travel from?
            </p>
            <select className="w-full rounded-lg border border-line bg-paper py-3 px-4 text-sm outline-none focus:border-transit">
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="mb-3 font-display text-sm font-bold">
              Notification preferences
            </h3>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 h-4 w-4 accent-transit"
                />
                <div>
                  <p className="text-sm font-medium">Group updates</p>
                  <p className="text-xs text-ink/50">
                    When someone joins or updates status
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 h-4 w-4 accent-transit"
                />
                <div>
                  <p className="text-sm font-medium">New groups on your routes</p>
                  <p className="text-xs text-ink/50">
                    Get notified about new travel groups
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 h-4 w-4 accent-transit"
                />
                <div>
                  <p className="text-sm font-medium">Departure reminders</p>
                  <p className="text-xs text-ink/50">
                    Remind me 30 minutes before departure
                  </p>
                </div>
              </label>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-transit py-4 text-sm font-semibold text-paper transition hover:bg-transit-dark"
          >
            <Check className="h-4 w-4" />
            Complete setup
          </Link>

          <p className="text-center text-xs text-ink/40">
            You can change these settings anytime in your profile
          </p>
        </div>
      </div>
    </main>
  );
}
