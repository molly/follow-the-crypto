import { doc, getDoc } from "firebase/firestore";
import { cache } from "react";
import { db } from "../db";

export const getConstant = cache(async (key: string) => {
  const docRef = doc(db, "constants", key);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    return null;
  }
});
