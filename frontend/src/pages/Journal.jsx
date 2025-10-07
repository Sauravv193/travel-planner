import { useState, useEffect } from 'react'; // Import useEffect
import { useParams } from 'react-router-dom';
import PhotoUpload from '../components/journal/PhotoUpload';
import JournalView from '../components/journal/JournalView';
import PhotoGallery from '../components/journal/PhotoGallery';
import { useJournal } from '../hooks/useJournal';
import { getTripById } from '../services/api'; // Import the API function
import LoadingSpinner from '../components/common/LoadingSpinner'; // Import spinner

const Journal = () => {
  const { tripId } = useParams();
  const [activeTab, setActiveTab] = useState('upload');
  const [trip, setTrip] = useState(null); // --- NEW: State to hold trip data

  // --- UPDATED: Pass the entire 'trip' object to the useJournal hook
  const { photos, addPhotos, removePhoto, generateJournal, journal, loading, deleteJournal } = useJournal(trip);

  // --- NEW: useEffect to fetch trip data when the component mounts ---
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

  const handlePhotoUpload = (uploadedPhotos) => {
    addPhotos(uploadedPhotos);
  };

  const handleGenerateJournal = async () => {
    // Ensure trip data is loaded before generating
    if (!trip) {
        alert("Trip data is still loading, please wait a moment.");
        return;
    }
    await generateJournal();
    setActiveTab('journal');
  };

  const handleModifyJournal = async () => {
    // Regenerate with current photos
    await generateJournal();
  };

  const handleDeleteJournal = async () => {
    await deleteJournal();
  };
  
  // --- NEW: Loading state while fetching initial trip data ---
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Journal for {trip.destination}</h1>
          <p className="text-lg text-gray-600">
            Transform your travel memories into a beautiful story
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload Photos
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'gallery'
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Photo Gallery
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'journal'
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
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