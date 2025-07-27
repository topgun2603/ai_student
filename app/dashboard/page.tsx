// File: app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const role = userSnap.data().role;

          // Redirect based on role
          if (role === "school") router.push("/school");
          else if (role === "admin") router.push("/admin");
          else if (role === "teacher") router.push("/teacher");
          else if (role === "student") router.push("/student");
          else if (role === "parent") router.push("/parent");
          else router.push("/unauthorized");
        } else {
          router.push("/auth");
        }
      } else {
        router.push("/auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl">
      {loading ? "Redirecting..." : "Loading..."}
    </div>
  );
}
