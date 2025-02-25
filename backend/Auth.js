import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { signOut } from "firebase/auth";

//authentication slide 8 lect 12
export async function isEmailInUse(email) {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  }

export async function register(email, password, setUser) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log(`User ${userCredential.user.email} signed up successfully`);
    } catch (error) {
      console.error("Signup Error:", error.message);
      throw error;
    }
  }

export async function login(email, password, setUser) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Save user in global state
      console.log(`User ${userCredential.user.email} logged in successfully`);
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  }
  
  export async function logout(setUser) {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error.message);
      throw error;
    }
  }
  