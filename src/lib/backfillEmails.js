import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

// 🔹 Your Firebase config (same as in your firebase.js)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function backfillEmails() {
  const portfoliosRef = collection(db, "portfolios");
  const snapshot = await getDocs(portfoliosRef);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    // If email is missing, try to backfill
    if (!data.email && data.ownerEmail) {
      console.log(`Updating ${docSnap.id} with email ${data.ownerEmail}`);

      await updateDoc(doc(db, "portfolios", docSnap.id), {
        email: data.ownerEmail, // 👈 copy from ownerEmail
      });
    }
  }

  console.log("✅ Backfill complete!");
}

backfillEmails().catch(console.error);
