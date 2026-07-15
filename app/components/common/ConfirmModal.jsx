'use client';

// A small, generic confirmation dialog (e.g. "Are you sure you want to log out?").
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'danger',
}) {
  if (!open) return null;

  const variants = {
    danger:   { confirm: 'bg-red-600 hover:bg-red-700',       iconBg: 'bg-red-50',       iconStroke: '#dc2626' },
    charcoal: { confirm: 'bg-[#40433F] hover:bg-[#363936]',   iconBg: 'bg-[#40433F]/8',  iconStroke: '#40433F' },
  };
  const { confirm: confirmClasses, iconBg, iconStroke } = variants[confirmVariant] || variants.danger;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-[fadeIn_0.15s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-[#1E1E1E] mb-1.5">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
