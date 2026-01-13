import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0n6h4Z9aNRn8n0TCLmYqA0I8vNcNawMg",
  authDomain: "trans-chatroom.firebaseapp.com",
  projectId: "trans-chatroom",
  storageBucket: "trans-chatroom.firebasestorage.app",
  messagingSenderId: "730363722376",
  appId: "1:730363722376:web:7437bcb1d304ec73d77d3d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Anonymous login
signInAnonymously(auth);

// DOM elements
const messagesDiv = document.getElementById("messages");

const q = query(collection(db, "messages"), orderBy("time"));

onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    messagesDiv.innerHTML += `<p><strong>${data.user}:</strong> ${data.text}</p>`;
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

window.sendMessage = async () => {
  const user = document.getElementById("username").value || "Anonymous";
  const text = document.getElementById("message").value;

  if (!text) return;

  await addDoc(collection(db, "messages"), {
    user,
    text,
    time: Date.now()
  });

  document.getElementById("message").value = "";
};
