import type { User as FirebaseUser, Unsubscribe } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

export type Result<T> = { ok: true; data: T } | { ok: false; code?: string; message: string };

export interface PublicUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/email-already-in-use": "An account already exists with this email",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/popup-closed-by-user": "Google sign-in was cancelled",
  "auth/network-request-failed": "Network error. Please check your connection",
  "auth/too-many-requests": "Too many attempts. Please try again later",
  default: "An unexpected error occurred",
};

export function mapAuthError(error: unknown): { code?: string; message: string } {
  const err = error as { code?: string; message?: string } | undefined;
  const code = err?.code;
  const message = (code && AUTH_ERROR_MESSAGES[code]) || AUTH_ERROR_MESSAGES.default;
  return { code, message };
}

export function mapFirebaseUser(user: FirebaseUser): PublicUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    providerId: user.providerData?.[0]?.providerId || "password",
  };
}

export function subscribeToAuth(onChange: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, onChange);
}

export async function signInWithEmail(email: string, password: string): Promise<Result<FirebaseUser>> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { ok: true, data: cred.user };
  } catch (error) {
    const { code, message } = mapAuthError(error);
    return { ok: false, code, message };
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<Result<FirebaseUser>> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return { ok: true, data: cred.user };
  } catch (error) {
    const { code, message } = mapAuthError(error);
    return { ok: false, code, message };
  }
}

export async function signInWithGoogle(): Promise<Result<FirebaseUser>> {
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return { ok: true, data: cred.user };
  } catch (error) {
    const { code, message } = mapAuthError(error);
    return { ok: false, code, message };
  }
}

export async function signOutUser(): Promise<Result<void>> {
  try {
    await firebaseSignOut(auth);
    return { ok: true, data: undefined };
  } catch (error) {
    const { code, message } = mapAuthError(error);
    return { ok: false, code, message };
  }
}

export async function sendPasswordReset(email: string, redirectUrl: string): Promise<Result<void>> {
  try {
    await sendPasswordResetEmail(auth, email, { url: redirectUrl });
    return { ok: true, data: undefined };
  } catch (error) {
    const { code, message } = mapAuthError(error);
    return { ok: false, code, message };
  }
}


