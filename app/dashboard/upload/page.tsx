"use client";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function UploadPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const user = auth.currentUser;
    if (!user) return;

    const storageRef = ref(storage, `pdfs/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(pct);
      },
      (error) => {
        console.error(error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadURL);
        const docRef = doc(db, "uploads", `${user.uid}_${file.name}`);
        await setDoc(docRef, {
          name: file.name,
          url: downloadURL,
          uploadedBy: user.uid,
          timestamp: serverTimestamp(),
        });
        setUploading(false);
      }
    );
  };

  const handleClickOnLabel = () => {
    document.getElementById("pdfInput")?.click();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Upload PDF</h2>
      <div
        onClick={handleClickOnLabel}
        className="mb-4 border border-dashed border-gray-400 rounded p-4 cursor-pointer hover:bg-gray-100"
      >
        <p className="text-gray-600">Click here or drop a file to upload PDF</p>
      </div>
      <input
        id="pdfInput"
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {uploading ? `Uploading... ${Math.round(progress)}%` : "Upload"}
      </button>

      {url && (
        <p className="mt-4 text-green-600">
          Uploaded successfully:{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View PDF
          </a>
        </p>
      )}
    </div>
  );
}
