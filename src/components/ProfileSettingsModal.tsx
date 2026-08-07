import React, { useRef, useState } from 'react';
import { Camera, KeyRound, LogOut, Save, User, X } from 'lucide-react';
import { resetStudentPassword, StudentProfile, updateStudentProfileSettings } from '../lib/firebase';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  currentUser: StudentProfile | null;
  onClose: () => void;
  onProfileUpdated: (updates: Partial<StudentProfile>) => void;
  onLogout: () => void;
}

async function createThumbnailDataUrl(file: File, size = 96): Promise<string> {
  const imageUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to initialize image canvas.');
    }

    const minSide = Math.min(img.width, img.height);
    const sx = (img.width - minSide) / 2;
    const sy = (img.height - minSide) / 2;

    ctx.fillStyle = '#f8f6ea';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

    return canvas.toDataURL('image/jpeg', 0.72);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts.map((p) => p[0].toUpperCase()).slice(0, 2).join('');
};

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onProfileUpdated,
  onLogout
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [classSection, setClassSection] = useState(currentUser?.classSection || '10-A');
  const [newPassword, setNewPassword] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState(currentUser?.profilePhotoDataUrl || '');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setName(currentUser?.name || '');
    setClassSection(currentUser?.classSection || '10-A');
    setPhotoDataUrl(currentUser?.profilePhotoDataUrl || '');
    setNewPassword('');
    setStatusMessage(null);
    setErrorMessage(null);
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    try {
      const thumb = await createThumbnailDataUrl(file, 96);
      setPhotoDataUrl(thumb);
      setErrorMessage(null);
      setStatusMessage('Profile photo ready. Click Save Profile to apply changes.');
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not process image. Try another photo.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await updateStudentProfileSettings(currentUser.studentId, {
        name: trimmedName,
        classSection,
        profilePhotoDataUrl: photoDataUrl || ''
      });

      if (newPassword) {
        await resetStudentPassword(currentUser.studentId, newPassword);
      }

      onProfileUpdated({
        name: trimmedName,
        classSection,
        profilePhotoDataUrl: photoDataUrl || ''
      });

      setNewPassword('');
      setStatusMessage('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      setErrorMessage('Profile updated locally, but cloud sync failed. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#FDFCF0] border-4 border-[#1A1A1A] rounded-3xl shadow-[10px_10px_0px_0px_#1A1A1A] p-5 sm:p-6 space-y-5"
        role="dialog"
        aria-modal="true"
        aria-label="Profile settings"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider text-[#6D071A]">Account Settings</p>
            <h3 className="text-xl font-black text-[#1A1A1A] font-serif">Profile Details</h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl border-2 border-[#1A1A1A] bg-white hover:bg-amber-50" aria-label="Close profile settings">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSave}>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl border-2 border-[#1A1A1A] bg-white overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A]">
              {photoDataUrl ? (
                <img src={photoDataUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-black text-[#6D071A]">{getInitials(name || currentUser.name)}</span>
              )}
            </div>
            <div className="space-y-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <button type="button" onClick={handleChoosePhoto} className="px-3 py-1.5 text-xs font-black rounded-xl border-2 border-[#1A1A1A] bg-[#FFCC33] text-[#1A1A1A] hover:bg-amber-300 inline-flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Upload Photo
              </button>
              <p className="text-[10px] font-semibold text-gray-600">Image is automatically saved as a small thumbnail.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-2 border-[#1A1A1A] p-2.5 rounded-xl text-xs font-bold disabled:bg-gray-150 disabled:opacity-80 disabled:cursor-not-allowed"
                required
                disabled={currentUser?.role === 'student'}
              />
              {currentUser?.role === 'student' && (
                <p className="text-[10px] text-amber-800 font-bold mt-1">
                  * Student names are locked after registration. Only a teacher can modify your name.
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">Class</label>
              <select
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                className="w-full bg-white border-2 border-[#1A1A1A] p-2.5 rounded-xl text-xs font-bold"
              >
                <option value="10-A">10-A</option>
                <option value="10-B">10-B</option>
                <option value="10-C">10-C</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Optional"
                className="w-full bg-white border-2 border-[#1A1A1A] p-2.5 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {statusMessage && <div className="text-xs font-bold bg-emerald-100 border-2 border-emerald-500 text-emerald-900 p-2.5 rounded-xl">{statusMessage}</div>}
          {errorMessage && <div className="text-xs font-bold bg-rose-100 border-2 border-rose-500 text-rose-900 p-2.5 rounded-xl">{errorMessage}</div>}

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#6D071A] text-amber-200 font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FFCC33] inline-flex items-center gap-1.5 disabled:opacity-60">
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-[#1A1A1A] font-black text-xs rounded-xl border-2 border-[#1A1A1A]">Close</button>
            <button type="button" onClick={onLogout} className="ml-auto px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs rounded-xl border-2 border-rose-400 inline-flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>

          <div className="text-[10px] font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl p-2.5 flex items-start gap-1.5">
            <User className="w-3.5 h-3.5 mt-0.5 text-[#6D071A]" />
            Updating your photo replaces the old one automatically.
          </div>
        </form>
      </div>
    </div>
  );
};
