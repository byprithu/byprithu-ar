import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function savePoster(poster) {
  const id = "poster_" + Date.now();
  const data = { ...poster, id, createdAt: Date.now(), scanCount: 0 };
  await setDoc(doc(db, "posters", id), data);
  return id;
}

export async function getPoster(id) {
  const snap = await getDoc(doc(db, "posters", id));
  return snap.exists() ? snap.data() : null;
}

export async function getAllPosters() {
  const snap = await getDocs(collection(db, "posters"));
  return snap.docs.map(d => d.data());
}

export async function recordScan(id) {
  await updateDoc(doc(db, "posters", id), { scanCount: increment(1) });
}

export async function updatePoster(id, data) {
  await updateDoc(doc(db, "posters", id), data);
}
