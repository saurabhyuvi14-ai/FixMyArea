import type { User, LoginCredentials, ProfileData } from "@/types/auth";

const USERS_KEY = "fixmyarea_users";
const CURRENT_USER_KEY = "fixmyarea_current_user";
const PENDING_VERIFICATION_KEY = "fixmyarea_pending_verification";

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash password (simple hash for demo - use bcrypt in production)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// Get all users from localStorage
function getUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Check if email exists
export function isEmailExists(email: string): boolean {
  const users = getUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Check if username exists
export function isUsernameExists(username: string): boolean {
  const users = getUsers();
  return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

// Store pending verification (email + OTP)
export function storePendingVerification(email: string, otp: string): void {
  const data = { email, otp, timestamp: Date.now() };
  localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(data));
}

// Get pending verification
export function getPendingVerification(): { email: string; otp: string; timestamp: number } | null {
  const data = localStorage.getItem(PENDING_VERIFICATION_KEY);
  return data ? JSON.parse(data) : null;
}

// Clear pending verification
export function clearPendingVerification(): void {
  localStorage.removeItem(PENDING_VERIFICATION_KEY);
}

// Verify OTP
export function verifyOTP(email: string, otp: string): boolean {
  // Allow test OTP for demo purposes so user doesn't need to open console
  if (otp === "123456") return true;

  const pending = getPendingVerification();
  if (!pending) return false;

  // Check if OTP is expired (10 minutes)
  const isExpired = Date.now() - pending.timestamp > 10 * 60 * 1000;
  if (isExpired) {
    clearPendingVerification();
    return false;
  }

  return pending.email.toLowerCase() === email.toLowerCase() && pending.otp === otp;
}

// Create new user
export function createUser(profileData: ProfileData): User {
  const users = getUsers();

  const newUser: User = {
    id: generateId(),
    email: profileData.email.toLowerCase(),
    username: profileData.username.toLowerCase(),
    password: hashPassword(profileData.password),
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Set as current user
  setCurrentUser(newUser);

  return newUser;
}

// Login user
export function loginUser(credentials: LoginCredentials): User | null {
  const users = getUsers();
  const input = credentials.emailOrUsername.toLowerCase();

  const user = users.find(u =>
    (u.email === input || u.username === input) &&
    u.password === hashPassword(credentials.password)
  );

  if (user) {
    setCurrentUser(user);
    return user;
  }

  return null;
}

// Set current user
export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Get current user
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Demo: Send OTP to email (simulated)
export async function sendOTPToEmail(email: string): Promise<string> {
  // In production, this would call your backend API
  // For demo, we generate OTP and store it locally
  const otp = generateOTP();
  storePendingVerification(email, otp);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Log OTP for demo purposes (in production, this would be sent via email)
  console.log(`OTP for ${email}: ${otp}`);

  return otp;
}
