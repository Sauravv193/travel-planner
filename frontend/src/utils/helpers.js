// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Format time to readable string
export const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleTimeString(undefined, options)
}

// Truncate text to specified length
export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce function for limiting API calls
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}