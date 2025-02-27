import { db, auth } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";

export const savePlan = async (planData) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated!");
    throw new Error("User must be logged in to save a plan.");
  }

  try {
    console.log("Saving to Firestore...");

    const docRef = await addDoc(collection(db, "plans"), {
      ...planData,
      userId: user.uid,
      drivers: planData.drivers.map(driver => ({
        ...driver,
        startAddress: driver.startAddress,
        startCoords: driver.startCoords
      })),
    });

    console.log("Plan saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving plan:", error);
    throw error;
  }
};

