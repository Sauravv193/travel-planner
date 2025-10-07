import { useState } from 'react'
import { generateItinerary as generateItineraryAPI } from '../services/api'

export const useItinerary = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateItinerary = async (prompt) => {
    setLoading(true)
    setError(null)
    
    try {
      const itinerary = await generateItineraryAPI(prompt)
      return itinerary
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    generateItinerary,
    loading,
    error
  }
}