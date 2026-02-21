export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface SignupData {
  email: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

export interface ProfileData {
  email: string;
  username: string;
  password: string;
}

export type AuthPage = "landing" | "login" | "signup" | "verify-otp" | "create-profile" | "report" | "local-address" | "about-us" | "complaints";
