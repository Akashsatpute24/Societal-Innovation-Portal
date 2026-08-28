'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  GraduationCap,
  Landmark,
  LockKeyhole,
  Users,
} from 'lucide-react';

import type { Role } from '@/lib/types';
import { registerUser, signIn, type AppRole } from '@/lib/auth';

type LoginConfig = {
  role: Role;
  name: string;
  eyebrow: string;
  identifier: string;
  createAccount?: boolean;
  icon: typeof Users;
  tint: string;
};

const settings: Record<Role, LoginConfig> = {
  citizen: {
    role: 'citizen',
    name: 'Citizen',
    eyebrow: 'Citizen access',
    identifier: 'Email or mobile number',
    createAccount: true,
    icon: Users,
    tint: 'bg-[#e9f8e7] text-[#176144]',
  },

  govt_admin: {
    role: 'govt_admin',
    name: 'Government Admin',
    eyebrow: 'Official workspace',
    identifier: 'Official email or administrator ID',
    icon: Landmark,
    tint: 'bg-[#e8f2fb] text-[#275f93]',
  },

  university: {
    role: 'university',
    name: 'University',
    eyebrow: 'Institution workspace',
    identifier: 'University email or institution ID',
    createAccount: true,
    icon: GraduationCap,
    tint: 'bg-[#f3edff] text-[#6946a7]',
  },

  industry_csr: {
    role: 'industry_csr',
    name: 'Industry / CSR',
    eyebrow: 'Partner workspace',
    identifier: 'Corporate email',
    createAccount: true,
    icon: Building2,
    tint: 'bg-[#fff4e5] text-[#a76217]',
  },
};

type FormMode = 'login' | 'register';

export default function LoginForm({ role }: { role: Role }) {
  const config = settings[role];
  const router = useRouter();
  const Icon = config.icon;

  const destination: Record<Role, AppRole> = {
    citizen: 'citizen',
    govt_admin: 'government',
    university: 'university',
    industry_csr: 'industry',
  };

  const appRole = destination[role];

  const [mode, setMode] = useState<FormMode>('login');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const goToDashboard = () => {
    router.replace(`/dashboard/${appRole}`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const result = signIn(identifier, password, appRole);

    if (!result.success) {
      setError(result.message);
      return;
    }

    goToDashboard();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!identifier.trim()) {
      setError(`Please enter your ${config.identifier.toLowerCase()}.`);
      return;
    }

    if (role === 'citizen') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }

      if (!phone.trim()) {
        setError('Please enter your mobile number.');
        return;
      }

      if (!district.trim()) {
        setError('Please enter your district.');
        return;
      }

      if (!city.trim()) {
        setError('Please enter your city or village.');
        return;
      }
    }

    if (role === 'university') {
      if (!organization.trim()) {
        setError('Please enter your university/institution name.');
        return;
      }

      if (!fullName.trim()) {
        setError('Please enter the contact person name.');
        return;
      }
    }

    if (role === 'industry_csr') {
      if (!organization.trim()) {
        setError('Please enter your company/organization name.');
        return;
      }

      if (!fullName.trim()) {
        setError('Please enter the contact person name.');
        return;
      }

      if (!phone.trim()) {
        setError('Please enter your phone number.');
        return;
      }
    }

    const result = registerUser({
      identifier,
      password,
      role: appRole,
      fullName,
      phone,
      organization,
      district,
      city,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess('Account created successfully! You can now sign in.');

    // Clear registration fields
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhone('');
    setOrganization('');
    setDistrict('');
    setCity('');

    // Switch back to login
    setMode('login');
  };

  return (
    <main className="grid min-h-screen bg-mist lg:grid-cols-[.85fr_1.15fr]">
      {/* LEFT SIDE */}
      <aside className="hidden bg-ink p-10 text-white lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-lime text-xl font-black text-ink">
            S
          </div>

          <div>
            <p className="text-xl font-black">SAHAAY</p>
            <p className="text-xs text-slate-300">
              Societal Innovation Portal
            </p>
          </div>
        </Link>

        <div className="my-auto">
          <p className="text-sm font-bold uppercase tracking-[.18em] text-lime">
            {config.eyebrow}
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight">
            {mode === 'login'
              ? 'Welcome back to the'
              : 'Join the SAHAAY'}
            <br />
            collaboration network.
          </h1>

          <p className="mt-5 max-w-sm leading-relaxed text-slate-300">
            {mode === 'login'
              ? 'Sign in to turn reported social challenges into visible, coordinated progress.'
              : 'Create your account and become part of the societal innovation network.'}
          </p>
        </div>

        <p className="text-sm text-slate-400">
          One challenge. Many collaborators.
        </p>
      </aside>

      {/* RIGHT SIDE */}
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">

          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-moss"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to role selection
          </Link>

          <div className="card p-6 sm:p-8">

            {/* ICON */}
            <div
              className={`mb-6 grid h-12 w-12 place-items-center rounded-xl ${config.tint}`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <p className="text-sm font-bold uppercase tracking-[.16em] text-moss">
              {config.eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {mode === 'login'
                ? `Sign in as ${config.name}`
                : `Create ${config.name} account`}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {mode === 'login'
                ? 'Enter your registered credentials to access your workspace.'
                : 'Enter your information to create your SAHAAY account.'}
            </p>

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form className="mt-7" onSubmit={handleLogin}>

                <label className="label">
                  {config.identifier}
                </label>

                <input
                  className="input mb-4"
                  required
                  type="text"
                  autoComplete="username"
                  placeholder={config.identifier}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />

                <label className="label">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

                  <input
                    className="input mb-3 pl-10"
                    required
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setError('Password reset will be added with Supabase authentication.')
                    }
                    className="text-sm font-semibold text-moss hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button className="btn-primary w-full">
                  Login
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form className="mt-7" onSubmit={handleRegister}>

                {/* CITIZEN */}
                {role === 'citizen' && (
                  <>
                    <label className="label">Full Name</label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />

                    <label className="label">
                      Email or Mobile Number
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Enter email or mobile number"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <label className="label">Mobile Number</label>
                    <input
                      className="input mb-4"
                      required
                      type="tel"
                      placeholder="Enter mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />

                    <label className="label">District</label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Enter district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />

                    <label className="label">City / Village</label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Enter city or village"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </>
                )}

                {/* UNIVERSITY */}
                {role === 'university' && (
                  <>
                    <label className="label">
                      University / Institution Name
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Enter university name"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />

                    <label className="label">
                      Contact Person
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Faculty / authorized person"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />

                    <label className="label">
                      Official University Email
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="email"
                      placeholder="example@university.edu"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </>
                )}

                {/* INDUSTRY */}
                {role === 'industry_csr' && (
                  <>
                    <label className="label">
                      Company / Organization Name
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Enter company name"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />

                    <label className="label">
                      Contact Person
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="text"
                      placeholder="Enter contact person's name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />

                    <label className="label">
                      Corporate Email
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="email"
                      placeholder="company@example.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <label className="label">
                      Phone Number
                    </label>
                    <input
                      className="input mb-4"
                      required
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </>
                )}

                <label className="label">Password</label>

                <input
                  className="input mb-4"
                  required
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <label className="label">
                  Confirm Password
                </label>

                <input
                  className="input mb-6"
                  required
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className="btn-primary w-full">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* SWITCH LOGIN / REGISTER */}
            {config.createAccount && (
              <p className="mt-6 text-center text-sm text-slate-500">
                {mode === 'login' ? (
                  <>
                    New to SAHAAY?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setError('');
                        setSuccess('');
                      }}
                      className="font-bold text-moss hover:underline"
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError('');
                        setSuccess('');
                      }}
                      className="font-bold text-moss hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}