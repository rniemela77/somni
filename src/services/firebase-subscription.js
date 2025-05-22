// Subscription Service Module
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { initializeUserDocument } from "./firebase-user";
