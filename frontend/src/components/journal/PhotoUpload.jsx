import { useState, useRef } from 'react';

const PhotoUpload = ({ onUpload, onGenerate, photoCount = 0 }) => {
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

    // Validate file sizes (max 10MB each)
    const oversizedFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`The following files are too large (max 10MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      setUploading(false);
      return;
    }

    try {
      const uploadedPhotos = imageFiles.map(file => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}`, // Make ID more unique
        name: file.name,
        url: URL.createObjectURL(file),
        timestamp: new Date().toISOString(),
        size: file.size,
        type: file.type,
        fileObject: file
      }));

      onUpload(uploadedPhotos);
    } catch (error) {
      alert('Error processing photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-6">
      {photoCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">
              {photoCount} photo{photoCount > 1 ? 's' : ''} uploaded
            </span>
          </div>
        </div>
      )}
      
      <div
        onClick={!uploading ? triggerFileInput : undefined}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          uploading 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : isDragging 
              ? 'border-teal-500 bg-teal-50 cursor-pointer'
              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <div className="mt-4 flex text-sm text-gray-600 justify-center">
          <span className={`font-medium ${
            uploading ? 'text-gray-400' : 'text-teal-600 hover:text-teal-500'
          }`}>
            {uploading ? 'Processing photos...' : 'Upload photos'}
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
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={photoCount === 0 || uploading}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
            photoCount === 0 || uploading
              ? 'text-gray-400 bg-gray-300 cursor-not-allowed'
              : 'text-white bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {photoCount === 0 ? 'Upload Photos First' : 'Generate Travel Journal'}
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;