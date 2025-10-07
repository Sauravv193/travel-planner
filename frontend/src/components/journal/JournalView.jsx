import LoadingSpinner from '../common/LoadingSpinner'

// --- UPDATED: Component now accepts 'onDelete' and 'onModify' functions ---
const JournalView = ({ journal, loading, onDelete, onModify }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="large" text="Weaving your travel story..." />
      </div>
    )
  }

  if (!journal) {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No journal generated yet</h3>
        <p className="mt-1 text-sm text-gray-500">Upload some photos and generate your travel story.</p>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to permanently delete this journal?")) {
      if (onDelete) {
        onDelete();
      }
    }
  };

  const handleModify = () => {
    if (onModify) {
      onModify();
    }
  };

  return (
    <div>
        {/* --- NEW: Action buttons for the journal --- */}
        {(onModify || onDelete) && (
          <div className="flex justify-end space-x-4 mb-8">
              {onModify && (
                <button onClick={handleModify} className="btn-secondary py-2 px-5">
                    Re-generate with New Photos
                </button>
              )}
              {onDelete && (
                <button onClick={handleDelete} className="btn-secondary py-2 px-5" style={{ backgroundColor: '#ef4444', color: 'white' }}>
                    Delete Journal
                </button>
              )}
          </div>
        )}

        <div className="prose prose-indigo max-w-none prose-lg">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight">{journal.title}</h1>
                <p className="mt-4 text-xl text-gray-600 leading-8">{journal.summary}</p>
            </div>
            
            <div className="space-y-12">
                {journal.entries.map((entry, index) => (
                <div key={index} className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-3 mb-4">{entry.date}</h2>
                    {entry.photos && entry.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 my-6">
                        {entry.photos.map((photo, photoIndex) => (
                        <img
                            key={photoIndex}
                            src={photo.url}
                            alt={photo.caption || `Travel photo ${photoIndex + 1}`}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                        />
                        ))}
                    </div>
                    )}
                    <p className="text-gray-700 leading-relaxed">{entry.content}</p>
                </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default JournalView