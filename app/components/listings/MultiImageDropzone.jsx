'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

// Multi-file image dropzone — no precedent for multi-file upload existed
// anywhere in this frontend (the only prior art is DashboardSettings.jsx's
// single-avatar handleImage), so this is built from scratch. Mirrors the
// backend's own limits (BusinessInformationRequest/RealestateInformationRequest:
// jpeg/jpg/png, max 5MB each) for fast client-side feedback.
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const TEAL = '#2EC4B6';
const DARK = '#40433F';

export default function MultiImageDropzone({ files, onChange, existingImages = [], storageUrl, isEdit = false }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const previewUrls = useRef(new Map());

  // Revoke object URLs for files no longer in the list, and for all of them
  // on unmount — object URLs otherwise leak for the life of the tab.
  useEffect(() => {
    const current = new Set(files);
    for (const [file, url] of previewUrls.current) {
      if (!current.has(file)) {
        URL.revokeObjectURL(url);
        previewUrls.current.delete(file);
      }
    }
    return () => {
      if (files.length === 0) {
        for (const url of previewUrls.current.values()) URL.revokeObjectURL(url);
        previewUrls.current.clear();
      }
    };
  }, [files]);

  const getPreviewUrl = (file) => {
    if (!previewUrls.current.has(file)) {
      previewUrls.current.set(file, URL.createObjectURL(file));
    }
    return previewUrls.current.get(file);
  };

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList);
    const accepted = [];
    for (const file of incoming) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPEG and PNG images are allowed.`, { position: 'top-right' });
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`${file.name}: images must be under 5MB.`, { position: 'top-right' });
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length) onChange([...files, ...accepted]);
  }, [files, onChange]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      {isEdit && existingImages.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">Current photos</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {existingImages.map(img => (
              <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={`${storageUrl}/${img.image_path}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600">
            Uploading new photos below will replace all current photos — there&apos;s no way to add or remove individual images.
          </p>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-[#2EC4B6] bg-[#2EC4B6]/5' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }}
        />
        <svg className="mx-auto mb-2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
        <p className="text-sm text-gray-600">
          <span className="font-semibold" style={{ color: TEAL }}>Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1">JPEG or PNG, up to 5MB each</p>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((file, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
              <img src={getPreviewUrl(file)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                aria-label="Remove image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
