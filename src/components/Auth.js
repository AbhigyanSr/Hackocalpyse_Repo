import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, firestore } from "../firebase"; // Import firestore for saving username
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { setDoc, doc } from "firebase/firestore"; // Firestore functions for saving user data
import "../styles/terminal-theme.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // State for username
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle user signup or login
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userCredential;
      if (isSignUp) {
        // Signup flow
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Save the username in Firestore
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
          email,
          username, // Save the username
          timestamp: new Date(),
        });
      } else {
        // Sign-in flow
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      // Redirect to Admin Dashboard after successful authentication
      navigate("/admin");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);

      // Redirect to Admin Dashboard after successful Google login
      navigate("/admin");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">VAULT-NET TERMINAL</div>
        <div className="terminal-subtitle">
          WELCOME TO THE WASTELAND NETWORK
        </div>
      </div>

      <div className="terminal-card">
        <h2>{isSignUp ? "CIVILIAN REGISTRATION" : "ACCESS TERMINAL"}</h2>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USERNAME"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="EMAIL"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            required
          />
          <button type="submit">
            {isSignUp ? "REGISTER" : "ACCESS TERMINAL"}
          </button>
        </form>

        <button onClick={handleGoogleSignIn}>AUTHENTICATE WITH GOOGLE</button>

        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "BACK TO TERMINAL" : "NEW REGISTRATION"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
