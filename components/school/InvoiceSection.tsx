/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Download, Receipt } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Extend jsPDF with autoTable

export default function InvoicesSection() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setUserId(user.uid);
      // const docRef = doc(db, "users", user.uid);
      const invoicesSnap = await getDocs(
        collection(db, "users", user.uid, "invoices")
      );
      const invoicesList = invoicesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(invoicesList);
    });
    return () => unsub();
  }, []);

  const handleDownload = (invoice: any) => {
    console.log("download", invoice);
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = "/logo.png";
    logo.onload = () => {
      doc.addImage(logo, "PNG", 10, 10, 30, 15);

      doc.setFontSize(16);
      doc.text("Invoice", 105, 30, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Invoice ID: ${invoice.id}`, 14, 50);
      doc.text(
        `Date: ${
          invoice.date?.seconds
            ? new Date(invoice.date.seconds * 1000).toLocaleDateString()
            : "-"
        }`,
        14,
        58
      );

      doc.text("Seller:", 14, 70);
      doc.text("AI School Pvt Ltd", 30, 70);
      doc.text("GSTIN: 29ABCDE1234F2Z5", 30, 78);
      doc.text("Email: support@aischool.com", 30, 86);

      doc.text("Buyer:", 14, 100);
      doc.text(invoice.invoiceDetails?.schoolName || "School Name", 30, 100);
      doc.text(`Mobile: ${invoice.invoiceDetails?.mobile || "-"}`, 30, 108);

      doc.setFontSize(14);
      doc.text("Plan Details", 14, 125);
      doc.setFontSize(12);
      autoTable(doc, {
        startY: 130,
        head: [["Plan", "Duration", "Amount", "Status"]],
        body: [
          [
            invoice.plan || "-",
            invoice.duration || "-",
            `₹${invoice.amount}`,
            invoice.status || "-",
          ],
        ],
        theme: "grid",
        styles: { halign: "left" },
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1,
        margin: { top: 130 },
      });

      // watermark
      doc.setTextColor(240);
      doc.setFontSize(60);
      doc.text("PAID", 60, 200, { angle: 45 });

      doc.save(`invoice_${invoice.id}.pdf`);
    };
  };
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-gray-800 text-lg font-semibold flex items-center gap-2">
        <Receipt className="text-indigo-600" /> Invoices
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-600">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border text-left text-sm">
            <thead>
              <tr className="bg-indigo-100 text-gray-700">
                <th className="px-4 py-2">Invoice ID</th>
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, idx) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-gray-800">{invoice.id}</td>
                  <td className="px-4 py-2 text-gray-800">{invoice.plan}</td>
                  <td className="px-4 py-2 text-gray-800">₹{invoice.amount}</td>
                  <td className="px-4 py-2 text-gray-800">
                    {invoice.duration}
                  </td>
                  <td className="px-4 py-2 text-gray-800">{invoice.status}</td>
                  <td className="px-4 py-2 text-gray-800">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDownload(invoice)}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <Download size={14} /> PDF
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
