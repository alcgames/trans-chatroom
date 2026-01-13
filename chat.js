import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// UI elements
const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const messagesDiv = document.getElementById("messages");

// AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    authDiv.classList.add("hidden");
    chatDiv.classList.remove("hidden");
    loadMessages();
  } else {
    authDiv.classList.remove("hidden");
    chatDiv.classList.add("hidden");
  }
});

// SIGN UP
window.signUp = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
};

// LOG IN
window.logIn = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
};

// LOG OUT
window.logOut = async () => {
  await signOut(auth);
};

// CHAT
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("time"));

  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      messagesDiv.innerHTML += `<p><strong>${data.user}:</strong> ${data.text}</p>`;
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

window.sendMessage = async () => {
  const user = document.getElementById("username").value || auth.currentUser.email;
  const text = document.getElementById("message").value;

  if (!text) return;

  await addDoc(collection(db, "messages"), {
    user,
    text,
    time: Date.now(),
    uid: auth.currentUser.uid
  });

  document.getElementById("message").value = "";
};
