import { useState } from 'react'

const PhotoGallery = ({ photos, onDeletePhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  
  const handleDeletePhoto = (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      onDeletePhoto(photoId);
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto(null);
      }
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No photos uploaded yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading some travel photos.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative"
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-32 object-cover rounded-lg cursor-pointer group-hover:opacity-75"
              onClick={() => setSelectedPhoto(photo)}
            />
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePhoto(photo.id);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900 truncate">{photo.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(photo.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-w-full max-h-full"
            />
            <div className="mt-4 text-white">
              <p className="text-lg font-medium">{selectedPhoto.name}</p>
              <p className="text-sm">
                Uploaded on {new Date(selectedPhoto.timestamp).toLocaleDateString()}
              </p>
            </div>
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoGallery