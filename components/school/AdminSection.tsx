/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  PlusCircle,
  Save,
  Trash,
  Users,
  Eye,
  EyeOff,
  Pencil,
  Check,
} from "lucide-react";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PLAN_LIMITS = {
  Basic: 2,
  Pro: 5,
  Institution: 10,
};

export default function AdminsSection({
  profileComplete,
  subscriptionPlan,
}: {
  profileComplete: boolean;
  subscriptionPlan: "Basic" | "Pro" | "Institution" | undefined;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUserId(u.uid);
      const docRef = doc(db, "users", u.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.admins)) {
          setAdmins(data.admins);
          setShowPassword(data.admins.map(() => false));
        }
      }
    });
    return () => unsub();
  }, []);

  const handleAddAdmin = () => {
    if (!userId || admins.length >= PLAN_LIMITS[subscriptionPlan || "Basic"])
      return;
    const newAdmin = {
      id: nanoid(),
      name: `admin${admins.length + 1}`,
      password: nanoid(6),
    };
    setAdmins([...admins, newAdmin]);
    setEditingIndex(admins.length);
    setShowPassword([...showPassword, false]);
  };

  const handleSaveAdmins = async () => {
    if (!userId) return;
    const uniqueNames = new Set();
    for (const admin of admins) {
      if (uniqueNames.has(admin.name)) {
        setErrorMsg("Duplicate admin names are not allowed.");
        return;
      }
      uniqueNames.add(admin.name);
    }
    await updateDoc(doc(db, "users", userId), {
      admins,
    });
    toast.success("Admins saved successfully");
    setEditingIndex(null);
    setErrorMsg("");
  };

  const handleDelete = async () => {
    if (!deleteId || !userId) return;
    const updatedAdmins = admins.filter((a) => a.id !== deleteId);
    await updateDoc(doc(db, "users", userId), {
      admins: updatedAdmins,
    });
    setAdmins(updatedAdmins);
    toast.success("Admin deleted successfully");
    setDeleteId(null);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...admins];
    updated[index][field] = value;
    setAdmins(updated);
    setErrorMsg("");
  };

  const togglePasswordVisibility = (index: number) => {
    const updated = [...showPassword];
    updated[index] = !updated[index];
    setShowPassword(updated);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-gray-800 text-lg font-semibold flex items-center gap-2">
        <Users className="text-indigo-600" />
        Admins for {subscriptionPlan} plan: {admins.length}/
        {PLAN_LIMITS[subscriptionPlan || "Basic"]}
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
      )}

      <div className="space-y-4 flex flex-row">
        {admins.map((admin, index) => (
          <div
            key={admin.id}
            className="flex flex-row items-center gap-3 border p-3 rounded shadow-sm bg-white"
          >
            <input
              disabled={editingIndex !== index}
              value={admin.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              className="border px-3 py-1 rounded flex-1 text-gray-800"
            />
            <div className="relative w-full ">
              <input
                disabled={editingIndex !== index}
                type={showPassword[index] ? "text" : "password"}
                value={admin.password}
                onChange={(e) =>
                  handleChange(index, "password", e.target.value)
                }
                className="border px-3 py-1 rounded w-full text-gray-800 pr-8"
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-gray-600"
                onClick={() => togglePasswordVisibility(index)}
              >
                {showPassword[index] ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {editingIndex === index ? (
              <button
                onClick={handleSaveAdmins}
                className="text-green-600 hover:text-green-800 cursor-pointer"
              >
                <Check size={16} />
              </button>
            ) : (
              <button
                onClick={() => setEditingIndex(index)}
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <Pencil size={16} />
              </button>
            )}
            <button
              onClick={() => setDeleteId(admin.id)}
              className="text-red-600 hover:text-red-800 cursor-pointer"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleAddAdmin}
          disabled={(admins.length >= PLAN_LIMITS[subscriptionPlan || "Basic"]) || !profileComplete}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          <PlusCircle size={18} /> Add Admin
        </button>
        {/* <button
          onClick={handleSaveAdmins}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Save size={18} /> Save
        </button> */}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
