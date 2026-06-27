import { useState, useCallback } from 'react';
import { X, Link, Twitter, Facebook, Mail, Check, Printer, Download, Calendar, Share2 } from 'lucide-react';
import { useToast } from './Toast';
import { copyItineraryToClipboard, printItinerary, downloadItineraryHTML, generateCalendarUrl } from '../../utils/export';

const ShareTripDialog = ({ isOpen, onClose, trip, itinerary }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const shareUrl = window.location.href;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  }, [shareUrl, toast]);

  const handleShareTwitter = () => {
    const text = `🗺️ Check out my trip to ${trip?.destination || 'Unknown'} planned with WanderGen!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `My trip to ${trip?.destination || 'Unknown'}`;
    const body = `Check out my travel itinerary for ${trip?.destination || 'Unknown'}!\n\n${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handlePrint = () => {
    printItinerary(itinerary, trip);
    toast.success('Opening print dialog...');
    onClose();
  };

  const handleDownload = () => {
    downloadItineraryHTML(itinerary, trip);
    toast.success('Itinerary downloaded!');
    onClose();
  };

  const handleCopyItinerary = async () => {
    const success = await copyItineraryToClipboard(itinerary, trip);
    if (success) {
      toast.success('Itinerary copied!');
    } else {
      toast.error('Failed to copy');
    }
    onClose();
  };

  const handleCalendarExport = () => {
    const url = generateCalendarUrl(trip);
    if (url) {
      window.open(url, '_blank');
      toast.success('Opening Google Calendar...');
    } else {
      toast.warning('Trip dates needed for calendar export');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Share trip options"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Share Trip</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{trip?.destination || 'Itinerary'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link className="w-5 h-5 text-blue-600" />}
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-900 dark:text-white">Copy Link</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Share the trip URL</p>
          </div>
          {copied && <Check className="w-5 h-5 text-green-500" />}
        </button>

        {/* Social Share */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <button
            onClick={handleShareTwitter}
            className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Share on Twitter"
          >
            <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-2">
              <Twitter className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Twitter</span>
          </button>
          <button
            onClick={handleShareFacebook}
            className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Share on Facebook"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-2">
              <Facebook className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Facebook</span>
          </button>
          <button
            onClick={handleShareEmail}
            className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Share via Email"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Email</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

        {/* Export Options */}
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Export</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Download</span>
          </button>
          <button
            onClick={handleCopyItinerary}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Link className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Copy Text</span>
          </button>
          <button
            onClick={handleCalendarExport}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareTripDialog;
