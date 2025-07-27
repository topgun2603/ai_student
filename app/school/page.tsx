/* eslint-disable @typescript-eslint/no-explicit-any */
// SchoolDashboardPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import SubscriptionSection from "@/components/school/SubscriptionSection";
import ProfileSection from "@/components/school/ProfileSection";
import AdminsSection from "@/components/school/AdminSection";
import InvoicesSection from "@/components/school/InvoiceSection";
import { SidePanel } from "@/components/school/SidePanel";
import { nanoid } from "nanoid";

export default function SchoolDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [subscriptionAt, setSubscriptionAt] = useState<Date | null>(null);
  const [subscriptionDuration, setSubscriptionDuration] = useState<
    "monthly" | "yearly" | null
  >(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [selectedNav, setSelectedNav] = useState("subscription");

  const [schoolName, setSchoolName] = useState("");
  const [shortName, setShortName] = useState("");
  const [address, setAddress] = useState({ city: "", district: "", state: "" });
  const [mobile, setMobile] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const router = useRouter();

  const handleLogoUpload = (file: File | null) => {
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return router.push("/auth");
      setUser(u);
      const docRef = doc(db, "users", u.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSubscriptionActive(data.subscriptionActive || false);
        setSubscriptionPlan(data.subscriptionPlan || "");
        if (data.subscriptionAt instanceof Timestamp)
          setSubscriptionAt(data.subscriptionAt.toDate());
        setSubscriptionDuration(data.subscriptionDuration || null);
        setProfileComplete(!!data.schoolProfile);

        if (data.schoolProfile) {
          setSchoolName(data.schoolProfile.name || "");
          setShortName(data.schoolProfile.shortName || "");
          setAddress(
            data.schoolProfile.address || { city: "", district: "", state: "" }
          );
          setMobile(data.schoolProfile.mobile || "");
          setAlternateMobile(data.schoolProfile.alternateMobile || "");
          if (data.schoolProfile.logo) setLogoPreview(data.schoolProfile.logo);
        }
      }
    });
    return () => unsub();
  }, [router]);

  const handleSaveProfile = async () => {
    if (!schoolName || !shortName || !user) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      let logoURL = logoPreview;

      if (logoFile) {
        const fileRef = ref(storage, `logos/${user.uid}/${logoFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, logoFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            toast.error("Logo upload failed.");
          },
          async () => {
            logoURL = await getDownloadURL(uploadTask.snapshot.ref);
            await saveProfileToFirestore(logoURL);
          }
        );
      } else {
        await saveProfileToFirestore(logoURL);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveProfileToFirestore = async (logoURL: string) => {
    const schoolProfile = {
      name: schoolName,
      shortName,
      logo: logoURL,
      address,
      mobile,
      alternateMobile,
    };

    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      { schoolProfile, updatedAt: serverTimestamp() },
      { merge: true }
    );
    setProfileComplete(true);
    toast.success("School profile saved successfully.", { duration: 1500 });
    setUploadProgress(0);
  };

  const handleSubscription = async (
    plan: string,
    amount: number,
    duration: "monthly" | "yearly"
  ) => {
    if (!user) return;
    await setDoc(
      doc(db, "users", user.uid),
      {
        subscriptionActive: true,
        subscriptionPlan: plan,
        subscriptionAmount: amount,
        subscriptionAt: serverTimestamp(),
        subscriptionDuration: duration,
      },
      { merge: true }
    );
    setSubscriptionActive(true);
    setSubscriptionPlan(plan);
    setSubscriptionDuration(duration);

    const invoiceData = {
      id: nanoid(8),
      plan,
      amount,
      duration,
      date: new Date().toISOString(),
    };
    await addDoc(collection(db, "users", user.uid, "invoices"), invoiceData);
    toast.success("Subscription activated successfully.", { duration: 1500 });
  };

  const renderContent = () => {
    switch (selectedNav) {
      case "subscription":
        return (
          <SubscriptionSection
            subscriptionPlan={subscriptionPlan}
            yearly={yearly}
            setYearly={setYearly}
            handleSubscription={handleSubscription}
            subscriptionAt={subscriptionAt}
            subscriptionDuration={subscriptionDuration}
          />
        );
      case "profile":
        return (
          <ProfileSection
            schoolName={schoolName}
            shortName={shortName}
            address={address}
            mobile={mobile}
            alternateMobile={alternateMobile}
            setSchoolName={setSchoolName}
            setShortName={setShortName}
            setAddress={setAddress}
            setMobile={setMobile}
            setAlternateMobile={setAlternateMobile}
            logoPreview={logoPreview}
            handleLogoUpload={handleLogoUpload}
            handleSaveProfile={handleSaveProfile}
            loading={loading}
            uploadProgress={uploadProgress}
          />
        );
      case "admins":
        return (
          <AdminsSection
            profileComplete={profileComplete}
            subscriptionPlan={
              subscriptionPlan as "Basic" | "Pro" | "Institution"
            }
          />
        );
      case "invoices":
        return <InvoicesSection />;
      case "logout":
        auth.signOut();
        router.push("/auth");
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel
        subscriptionActive={subscriptionActive}
        selectedNav={selectedNav}
        setSelectedNav={setSelectedNav}
        schoolName={schoolName}
        logoUrl={logoPreview}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="">{renderContent()}</div>
      </main>
    </div>
  );
}
