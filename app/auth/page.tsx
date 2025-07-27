/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (pw: string) =>
    pw.length >= 6 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          return setError("Passwords do not match.");
        }
        if (!validatePassword(password)) {
          return setError(
            "Password must be at least 6 characters long and include a number and an uppercase letter."
          );
        }
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", userCred.user.uid), {
          email,
          role: "school",
          newUser: true,
          createdAt: new Date(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCred = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, "users", userCred.user.uid),
        {
          email: userCred.user.email,
          role: "school",
          newUser: true,
          createdAt: new Date(),
        },
        { merge: true }
      );
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Password reset email sent");
      setShowReset(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-50 px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isRegister ? "Register Your School" : "Login to Your Account"}
        </h2>

        {showReset ? (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border px-4 py-2 rounded text-black"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Send Reset Link
            </button>
            <button
              onClick={() => setShowReset(false)}
              className="w-full text-indigo-600 text-sm mt-2"
            >
              Back to login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border pl-10 pr-4 py-2 rounded text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border pl-10 pr-10 py-2 rounded text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {isRegister && (
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full border pl-10 pr-10 py-2 rounded text-black"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                {isRegister ? "Register School" : "Login"}
              </button>
            </form>

            {isRegister && (
              <button
                onClick={handleGoogleLogin}
                className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Register with Google (School Only)
              </button>
            )}

            {!isRegister && (
              <button
                onClick={handleGoogleLogin}
                className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Login with Google (School Only)
              </button>
            )}

            {!isRegister && (
              <button
                onClick={() => setShowReset(true)}
                className="w-full mt-2 text-sm text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>
            )}

            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
            )}

            <p className="text-center mt-4 text-sm text-gray-600">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-indigo-600 font-medium hover:underline"
              >
                {isRegister ? "Login" : "Register School"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
