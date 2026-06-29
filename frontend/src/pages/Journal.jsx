import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhotoUpload from '../components/journal/PhotoUpload';
import JournalView from '../components/journal/JournalView';
import PhotoGallery from '../components/journal/PhotoGallery';
import { useJournal } from '../hooks/useJournal';
import { getTripById } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Journal = () => {
  const { tripId } = useParams();
  const [activeTab, setActiveTab] = useState('upload');
  const [trip, setTrip] = useState(null);

  const { photos, addPhotos, removePhoto, generateJournal, journal, loading, deleteJournal } = useJournal(trip);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await getTripById(tripId);
        setTrip(response.data);
      } catch (error) {
        // Handle error silently
      }
    };
    fetchTrip();
  }, [tripId]);

  const handlePhotoUpload = async (uploadedPhotos) => {
    try {
      await addPhotos(uploadedPhotos);
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert('Failed to upload photos. Please try again.');
    }
  };

  const handleGenerateJournal = async () => {
    if (!trip) {
        alert("Trip data is still loading, please wait a moment.");
        return;
    }
    await generateJournal();
    setActiveTab('journal');
  };

  const handleModifyJournal = async () => {
    await generateJournal();
  };

  const handleDeleteJournal = async () => {
    await deleteJournal();
  };
  
  if (!trip) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" text="Loading trip details..." />
        </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-warm-dark dark:text-white mb-2">Travel Journal for {trip.destination}</h1>
          <p className="text-lg text-brown-600 dark:text-night-muted">
            Transform your travel memories into a beautiful story
          </p>
        </div>

        <div className="card overflow-hidden mb-8">
          <div className="border-b border-cream-100 dark:border-night-border">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-maroon-500 text-maroon-600'
                    : 'text-brown-600 hover:text-warm-dark hover:border-cream-200 dark:text-night-muted dark:hover:text-white'
                }`}
              >
                Upload Photos
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'gallery'
                    ? 'border-b-2 border-maroon-500 text-maroon-600'
                    : 'text-brown-600 hover:text-warm-dark hover:border-cream-200 dark:text-night-muted dark:hover:text-white'
                }`}
              >
                Photo Gallery
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'journal'
                    ? 'border-b-2 border-maroon-500 text-maroon-600'
                    : 'text-brown-600 hover:text-warm-dark hover:border-cream-200 dark:text-night-muted dark:hover:text-white'
                }`}
              >
                AI Journal
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upload' && (
              <PhotoUpload 
                onUpload={handlePhotoUpload} 
                onGenerate={handleGenerateJournal} 
                photoCount={photos.length}
              />
            )}
            {activeTab === 'gallery' && <PhotoGallery photos={photos} onDeletePhoto={removePhoto} />}
            {activeTab === 'journal' && <JournalView journal={journal} loading={loading} onDelete={handleDeleteJournal} onModify={handleModifyJournal} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
