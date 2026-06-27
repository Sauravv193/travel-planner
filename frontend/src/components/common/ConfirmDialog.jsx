import { X, AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog Component
 * 
 * Reusable confirmation dialog for destructive actions.
 * Provides consistent UI for delete/confirm actions across the app.
 */
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger' }) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn"
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDanger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-red-600' : 'text-yellow-600'}`} />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <h3 id="confirm-title" className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title || 'Confirm Action'}
        </h3>
        <p id="confirm-message" className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {message || 'Are you sure you want to proceed?'}
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
