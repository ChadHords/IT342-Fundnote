import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAkDbNj6jbxYpfU5sknTpscdZj9xgXF79w",
  authDomain: "it-342-fundnote.firebaseapp.com",
  projectId: "it-342-fundnote",
  appId: "1:327600413016:web:2177c55febf5d55c76ed2d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
