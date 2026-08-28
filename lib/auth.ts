export type AppRole =
  | 'citizen'
  | 'government'
  | 'university'
  | 'industry';

export type StoredUser = {
  identifier: string;
  password: string;
  role: AppRole;

  fullName?: string;
  phone?: string;
  organization?: string;
  district?: string;
  city?: string;
};

export type Session = {
  identifier: string;
  role: AppRole;
  fullName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  district?: string;
  city?: string;
};

const USERS_KEY = 'sahaay_users';
const SESSION_KEY = 'sahaay_session';

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(USERS_KEY);

    const users: StoredUser[] = stored ? JSON.parse(stored) : [];

    // Default Government Admin account
    const governmentAdmin: StoredUser = {
      identifier: 'maha@sahaay.gov.in',
      password: 'maha@123',
      role: 'government',
      fullName: 'Government Administrator',
    };

    // Add admin account if it doesn't already exist
    const adminExists = users.some(
      (user) =>
        user.identifier.toLowerCase() ===
        governmentAdmin.identifier.toLowerCase()
    );

    if (!adminExists) {
      users.push(governmentAdmin);
      saveUsers(users);
    }

    return users;
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(user: StoredUser): {
  success: boolean;
  message: string;
} {
  if (typeof window === 'undefined') {
    return {
      success: false,
      message: 'Registration is only available in the browser.',
    };
  }

  const users = getUsers();

  const identifier = user.identifier.trim().toLowerCase();

  const alreadyExists = users.some(
    (existingUser) =>
      existingUser.identifier.trim().toLowerCase() === identifier
  );

  if (alreadyExists) {
    return {
      success: false,
      message: 'An account with this email or mobile number already exists.',
    };
  }

  const newUser: StoredUser = {
    ...user,
    identifier,
  };

  users.push(newUser);

  saveUsers(users);

  return {
    success: true,
    message: 'Account created successfully.',
  };
}

export function signIn(
  identifier: string,
  password: string,
  role: AppRole
): {
  success: boolean;
  message: string;
} {
  if (typeof window === 'undefined') {
    return {
      success: false,
      message: 'Login is only available in the browser.',
    };
  }

  const users = getUsers();

  const normalizedIdentifier = identifier.trim().toLowerCase();

  const user = users.find(
    (existingUser) =>
      existingUser.identifier.trim().toLowerCase() ===
        normalizedIdentifier &&
      existingUser.role === role
  );

  if (!user) {
    return {
      success: false,
      message:
        'No account found for these credentials. Please create an account first.',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: 'Incorrect password. Please try again.',
    };
  }

  const session: Session = {
  identifier: user.identifier,
  role: user.role,
  fullName: user.fullName,
  email: user.identifier.includes('@') ? user.identifier : undefined,
  phone: user.phone,
  organization: user.organization,
  district: user.district,
  city: user.city,
};

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return {
    success: true,
    message: 'Login successful.',
  };
}

export function signOut() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(SESSION_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function getCurrentRole(): AppRole | null {
  const session = getSession();

  return session?.role ?? null;
}