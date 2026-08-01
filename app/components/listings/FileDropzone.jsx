'use client';

import { useRef } from 'react';
import { toast } from 'react-toastify';

// Non-image sibling of MultiImageDropzone — reused for financial documents
// (multiple) and the NDA (single). Extension-based validation since document
// MIME types are unreliable across browsers/OSes; the backend re-validates
// by mimes: anyway.
const TEAL = '#2EC4B6';

export default function FileDropzone({ files, onChange, multiple = false, accept, extensions, maxSizeMB, label, existingLabel }) {
  const inputRef = useRef(null);
  const maxBytes = maxSizeMB * 1024 * 1024;

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    const accepted = [];
    for (const file of incoming) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (extensions && !extensions.includes(ext)) {
        toast.error(`${file.name}: allowed types are ${extensions.join(', ')}.`, { position: 'top-right' });
        continue;
      }
      if (file.size > maxBytes) {
        toast.error(`${file.name}: must be under ${maxSizeMB}MB.`, { position: 'top-right' });
        continue;
      }
      accepted.push(file);
    }
    if (!accepted.length) return;
    onChange(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
  };

  const removeFile = (index) => onChange(files.filter((_, i) => i !== index));

  return (
    <div>
      {existingLabel && (
        <p className="text-xs text-gray-500 mb-2">{existingLabel}</p>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-4 text-center cursor-pointer transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }}
        />
        <p className="text-sm text-gray-600">
          <span className="font-semibold" style={{ color: TEAL }}>Click to upload</span> or drag and drop
        </p>
        {label && <p className="text-xs text-gray-400 mt-1">{label}</p>}
      </div>

      {files.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs text-gray-700 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                aria-label="Remove file"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
