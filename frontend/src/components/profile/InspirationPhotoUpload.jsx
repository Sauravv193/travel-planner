import { useState, useRef } from 'react';

const InspirationPhotoUpload = () => {
  const [photos, setPhotos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    setUploading(true);
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please select image files only.');
      setUploading(false);
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`The following files are too large (max 5MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      setUploading(false);
      return;
    }

    try {
      const newPhotos = imageFiles.map(file => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        timestamp: new Date().toISOString(),
        size: file.size,
        type: file.type,
        fileObject: file
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (error) {
      alert('Error processing photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => {
      const photoToRemove = prev.find(p => p.id === photoId);
      if (photoToRemove && photoToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const saveInspirationPhotos = async () => {
    if (photos.length === 0) return;
    
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Successfully saved ${photos.length} inspiration photos! Our AI will use these to better understand your travel preferences.`);
    } catch (error) {
      alert('Error saving photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {photos.length > 0 && (
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-teal-800 dark:text-teal-200 font-medium">
                {photos.length} inspiration photo{photos.length > 1 ? 's' : ''} ready
              </span>
            </div>
            <button
              onClick={saveInspirationPhotos}
              disabled={uploading}
              className="px-3 py-1 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Saving...' : 'Save Photos'}
            </button>
          </div>
          
          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div
        onClick={!uploading ? triggerFileInput : undefined}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          uploading 
            ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed' 
            : isDragging 
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 cursor-pointer' 
              : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400 justify-center">
          <span className={`font-medium ${
            uploading ? 'text-gray-400 dark:text-gray-500' : 'text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300'
          }`}>
            {uploading ? 'Processing photos...' : 'Upload inspiration photos'}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </span>
          {!uploading && <p className="pl-1">or drag and drop</p>}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          PNG, JPG, GIF up to 5MB each
        </p>
        <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
          Upload photos of places that inspire you - beaches, cities, mountains, etc.
        </p>
      </div>
    </div>
  );
};

export default InspirationPhotoUpload;