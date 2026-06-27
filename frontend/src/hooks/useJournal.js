import { useState, useRef, useEffect, useCallback } from 'react';
import { getJournal, saveJournal, deleteJournal as deleteJournalAPI, getPhotosForTrip, uploadPhotos, deletePhoto, getPhotoUrl, generateJournal as generateJournalAPI } from '../services/api';

// Removed fileToGenerativePart as journal generation now happens on backend

export const useJournal = (trip) => {
  const [photos, setPhotos] = useState([]);
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const photosRef = useRef(photos);
  useEffect(() => { photosRef.current = photos; }, [photos]);

  useEffect(() => {
    if (trip?.id) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          // Load existing journal
          const journalResponse = await getJournal(trip.id);
          if (journalResponse.data?.content) {
            const parsedJournal = JSON.parse(journalResponse.data.content);
            setJournal(parsedJournal);
          }
          
          // Load existing photos
          const photosResponse = await getPhotosForTrip(trip.id);
          if (photosResponse.data) {
            const serverPhotos = await Promise.all(
              photosResponse.data.map(async (photo) => {
                try {
                  // For now, use direct URL - auth headers will be handled by axios interceptor
                  const photoUrl = getPhotoUrl(photo.id);
                  return {
                    id: photo.id,
                    name: photo.originalName,
                    url: photoUrl,
                    timestamp: photo.uploadTime,
                    size: photo.fileSize,
                    type: photo.mimeType,
                    fileObject: null // Server photos don't have file objects
                  };
                } catch (error) {
                  console.error('Failed to load photo:', photo.originalName, error);
                  return null;
                }
              })
            );
            setPhotos(serverPhotos.filter(photo => photo !== null));
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            setError("Could not load your existing data.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [trip]);

  const addPhotos = async (newPhotos) => {
    if (!trip?.id || newPhotos.length === 0) return;
    
    try {
      setLoading(true);
      
      // Extract file objects from newPhotos for upload
      const filesToUpload = newPhotos.map(photo => photo.fileObject).filter(Boolean);
      
      if (filesToUpload.length > 0) {
        // Upload to backend
        const response = await uploadPhotos(trip.id, filesToUpload);
        
        if (response.data) {
          // Convert server response to photo format
          const serverPhotos = response.data.map(photo => ({
            id: photo.id,
            name: photo.originalName,
            url: getPhotoUrl(photo.id),
            timestamp: photo.uploadTime,
            size: photo.fileSize,
            type: photo.mimeType,
            fileObject: null // Clear file object after upload
          }));
          
          // Update state with uploaded photos
          setPhotos(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewPhotos = serverPhotos.filter(p => !existingIds.has(p.id));
            return [...prev, ...uniqueNewPhotos];
          });
        }
      }
    } catch (err) {
      setError('Failed to upload photos. Please try again.');
      console.error('Photo upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = async (photoId) => {
    try {
      // If it's a server photo (numeric ID), delete from backend
      if (typeof photoId === 'number') {
        await deletePhoto(photoId);
      }
      
      // Remove from local state
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      
      // Also revoke the object URL to prevent memory leaks for blob URLs
      const photoToRemove = photos.find(p => p.id === photoId);
      if (photoToRemove && photoToRemove.url && photoToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(photoToRemove.url);
      }
    } catch (err) {
      setError('Failed to delete photo. Please try again.');
      console.error('Photo deletion error:', err);
    }
  };

  const generateJournal = async () => {
    if (!trip) { 
      setError("Trip information is not available."); 
      return; 
    }
    
    setLoading(true);
    setError('');
    
    const currentPhotos = photosRef.current;
    if (currentPhotos.length === 0) {
      setError("Please upload at least one photo to generate a journal.");
      setLoading(false);
      return;
    }

    try {
      console.log('Starting journal generation with', currentPhotos.length, 'photos');
      
      // Call backend API to generate journal
      const response = await generateJournalAPI(trip.id);
      
      if (response.data?.content) {
        const parsedJournal = JSON.parse(response.data.content);
        setJournal(parsedJournal);
        console.log('Journal generated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Journal generation error:', err);
      setError(err.response?.data?.message || err.message || "An unexpected error occurred during journal generation.");
    } finally {
      setLoading(false);
    }
  };

  const deleteJournal = useCallback(async () => {
    if (!trip?.id) return;
    setLoading(true);
    try {
        await deleteJournalAPI(trip.id);
        setJournal(null);
    } catch (err) {
        setError("Could not delete the journal. Please try again.");
    } finally {
        setLoading(false);
    }
  }, [trip]);


  return { photos, journal, loading, error, addPhotos, removePhoto, generateJournal, deleteJournal };
};