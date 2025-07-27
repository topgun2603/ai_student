// Updated ProfileSection.tsx
"use client";

import { FC, JSX } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Landmark, Phone, UserCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ProfileSectionProps {
  schoolName: string;
  shortName: string;
  address: {
    city: string;
    district: string;
    state: string;
    [key: string]: string;
  };
  mobile: string;
  alternateMobile: string;
  setSchoolName: (name: string) => void;
  setShortName: (name: string) => void;
  setAddress: (addr: { city: string; district: string; state: string }) => void;
  setMobile: (num: string) => void;
  setAlternateMobile: (num: string) => void;
  logoPreview: string;
  handleLogoUpload: (file: File) => void;
  handleSaveProfile: () => void;
  loading: boolean;
  uploadProgress: number;
}

const ProfileSection: FC<ProfileSectionProps> = ({
  schoolName,
  shortName,
  address,
  mobile,
  alternateMobile,
  setSchoolName,
  setShortName,
  setAddress,
  setMobile,
  setAlternateMobile,
  logoPreview,
  handleLogoUpload,
  handleSaveProfile,
  loading,
  uploadProgress,
}) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const isValid =
    schoolName.trim() !== "" &&
    shortName.trim() !== "" &&
    address.city.trim() !== "" &&
    address.district.trim() !== "" &&
    address.state.trim() !== "" &&
    phoneRegex.test(mobile);

  const renderInput = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    icon: JSX.Element,
    required = false,
    type = "text"
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 border p-2 rounded w-full text-gray-800 focus:outline-indigo-500"
        />
      </div>
      {required && value.trim() === "" && (
        <p className="text-xs text-red-500 mt-1">{label} is required</p>
      )}
    </div>
  );

  return (
    <motion.div
      className="flex flex-col flex-center min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <label className="cursor-pointer relative group">
            <Image
              src={logoPreview || "/placeholder.png"}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
              alt="Logo Preview"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleLogoUpload(e.target.files[0])
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-gray-500 text-sm absolute -bottom-5 left-1/2 transform -translate-x-1/2">
              {/* Click to upload logo */}
            </span>
          </label>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {renderInput(
          "School Name",
          schoolName,
          setSchoolName,
          <UserCircle size={18} />,
          true
        )}
        {renderInput(
          "Short Name",
          shortName,
          setShortName,
          <Landmark size={18} />,
          true
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {(["City", "District", "State"] as const).map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="border p-2 rounded w-full text-gray-800"
                value={address[label.toLowerCase()]}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    [label.toLowerCase()]: e.target.value,
                  })
                }
              />
              {address[label.toLowerCase()].trim() === "" && (
                <p className="text-xs text-red-500 mt-1">{label} is required</p>
              )}
            </div>
          ))}
        </div>

        {renderInput(
          "Mobile",
          mobile,
          setMobile,
          <Phone size={18} />,
          true,
          "tel"
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alternate Mobile
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Phone size={18} />
            </span>
            <input
              type="tel"
              value={alternateMobile}
              onChange={(e) => setAlternateMobile(e.target.value)}
              className="pl-10 border p-2 rounded w-full text-gray-800 focus:outline-indigo-500"
            />
          </div>
          {alternateMobile && !/^[6-9]\d{9}$/.test(alternateMobile) && (
            <p className="text-xs text-red-500 mt-1">
              Enter a valid mobile number
            </p>
          )}
        </div>

        <button
          disabled={!isValid || loading}
          onClick={handleSaveProfile}
          className={`flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded w-full transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading && <Loader2 className="animate-spin" size={16} />} Save
          Profile
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileSection;
