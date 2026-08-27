import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <AlertTriangle size={20} />
            </div>

            <h2 className="text-base font-bold text-slate-800">
              {title}
            </h2>

          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">

          <p className="text-sm leading-6 text-slate-600">
            {message}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            This action cannot be undone.
          </p>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;