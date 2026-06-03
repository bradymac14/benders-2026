import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  collection,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

// ===========================================================================
// PASTE YOUR FIREBASE WEB CONFIG HERE.
// Firebase console -> Project settings -> "Your apps" -> Web app -> Config.
// Until real values are pasted, the app runs in local-only mode (no sync),
// so it keeps working exactly as before while you finish setup.
// ===========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDssFao71N82evwJV_xvKv--j3DFBzoP0g",
  authDomain: "benders-2026.firebaseapp.com",
  projectId: "benders-2026",
  storageBucket: "benders-2026.firebasestorage.app",
  messagingSenderId: "383597762109",
  appId: "1:383597762109:web:504342021332db7a713c54",
};

export const firebaseReady =
  !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "PASTE_HERE";

let db = null;
if (firebaseReady) {
  const app = initializeApp(firebaseConfig);
  // persistentLocalCache = IndexedDB-backed offline store. Writes made with no
  // signal queue locally and flush automatically when the phone reconnects,
  // and onSnapshot serves cached data while offline. Multi-tab manager keeps
  // several open tabs/PWAs on one device consistent.
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
}

const STATE_COL = "benders2026";
const STATE_ID = "state";
const SCORES_COL = "scores";

// Lineups + tees live in one small doc. cb gets { matchesByRound?, tees? } or null.
export function subscribeState(cb) {
  if (!db) return function () {};
  return onSnapshot(doc(db, STATE_COL, STATE_ID), function (snap) {
    cb(snap.exists() ? snap.data() : null);
  });
}

// One doc per match keeps simultaneous groups from clobbering each other.
// cb gets a scores object keyed by matchId (same shape the app uses in state).
export function subscribeScores(cb) {
  if (!db) return function () {};
  return onSnapshot(collection(db, SCORES_COL), function (snap) {
    var scores = {};
    snap.forEach(function (d) {
      scores[d.id] = d.data().holes || {};
    });
    cb(scores);
  });
}

export function writeState(partial) {
  if (!db) return;
  setDoc(doc(db, STATE_COL, STATE_ID), partial, { merge: true });
}

export function writeMatchScores(matchId, holes) {
  if (!db) return;
  setDoc(doc(db, SCORES_COL, matchId), { holes: holes });
}
