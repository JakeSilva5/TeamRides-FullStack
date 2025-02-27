import { db, auth } from "./Firebase"; // ✅ Ensure `db` is imported
import { collection, addDoc } from "firebase/firestore";

export const savePlan = async (planData) => {
  const user = auth.currentUser; // ✅ Ensure user authentication
  console.log("Current User:", user);

  if (!user) {
    console.error("User not authenticated!");
    throw new Error("User must be logged in to save a plan.");
  }

  try {
    console.log("Saving to Firestore...");
    console.log("DB Object:", db); // 🔍 Debugging log to check if `db` is defined

    if (!db) {
      console.error("Firestore is not initialized!");
      return;
    }

    const docRef = await addDoc(collection(db, "plans"), {
      ...planData,
      userId: user.uid, // ✅ Save user ID with the plan
    });

    console.log("Plan saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving plan:", error);
    throw error;
  }
};
