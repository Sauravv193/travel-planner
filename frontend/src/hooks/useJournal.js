import { useState, useRef, useEffect, useCallback } from 'react';
import { GEMINI_API_KEY } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { getJournal, saveJournal, deleteJournal as deleteJournalAPI } from '../services/api';

const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const useJournal = (trip) => {
  const [photos, setPhotos] = useState([]);
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const photosRef = useRef(photos);
  useEffect(() => { photosRef.current = photos; }, [photos]);

  useEffect(() => {
    if (trip?.id) {
      const fetchJournal = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await getJournal(trip.id);
          if (response.data?.content) {
            const parsedJournal = JSON.parse(response.data.content);
            setJournal(parsedJournal);
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            setError("Could not load your existing journal.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchJournal();
    }
  }, [trip]);

  const addPhotos = (newPhotos) => {
    // Prevent duplicates
    setPhotos(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNewPhotos = newPhotos.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNewPhotos];
    });
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    // Also revoke the object URL to prevent memory leaks
    const photoToRemove = photos.find(p => p.id === photoId);
    if (photoToRemove && photoToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
  };

  const generateJournal = async () => {
    if (!trip) { setError("Trip information is not available."); return; }
    setLoading(true);
    setError('');
    
    const currentPhotos = photosRef.current;
    if (currentPhotos.length === 0) {
      setError("Please upload at least one photo to generate a journal.");
      setLoading(false);
      return;
    }

    try {
      const prompt = `You are a travel blogger. A user went to ${trip.destination} from ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}. Analyze these photos to identify locations and activities. Write a creative journal for their trip within this date range. The response MUST be a valid JSON object with a 'title', a 'summary', and an 'entries' array. Each entry must have a 'date' and a 'content' field. Do not wrap the JSON in markdown backticks.`;
      
      const imageParts = await Promise.all(currentPhotos.map(p => fileToGenerativePart(p.fileObject)));
      const requestBody = { contents: [{ parts: [{ text: prompt }, ...imageParts] }] };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate journal from the AI service.');
      }

      const data = await response.json();
      const journalContentText = data.candidates[0].content.parts[0].text;
      
      let cleanJsonText = journalContentText.trim();
      const startIndex = cleanJsonText.indexOf('{');
      const endIndex = cleanJsonText.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          cleanJsonText = cleanJsonText.substring(startIndex, endIndex + 1);
      }

      const parsedJournal = JSON.parse(cleanJsonText);
      
      await saveJournal(trip.id, {
        title: parsedJournal.title,
        content: JSON.stringify(parsedJournal)
      });

      setJournal(parsedJournal);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during journal generation.");
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