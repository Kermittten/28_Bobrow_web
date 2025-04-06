import { useState, useCallback } from 'react'

const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  /**
   * @param {string} url 
   * @param {object} options 
   * @param {function} transformResponse 
   * @returns {Promise} 
   */
  const fetchData = useCallback(async (url, options = {}, transformResponse = null) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let result = await response.json()
      
      if (transformResponse && typeof transformResponse === 'function') {
        result = transformResponse(result)
      }

      setData(result)
      return result
    } catch (err) {
      setError(err)
      console.error('API request failed:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * @param {string} url 
   * @param {object} headers 
   * @param {function} transform 
   */
  const get = useCallback(async (url, headers = {}, transform = null) => {
    return fetchData(url, { method: 'GET', headers }, transform)
  }, [fetchData])

  /**
   * @param {string} url 
   * @param {object} body 
   * @param {object} headers 
   */
  const post = useCallback(async (url, body, headers = {}) => {
    return fetchData(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
  }, [fetchData])

  /**
   * @param {string} url
   * @param {object} body 
   * @param {object} headers 
   */
  const put = useCallback(async (url, body, headers = {}) => {
    return fetchData(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    })
  }, [fetchData])

  /**
   * @param {string} url 
   * @param {object} body 
   * @param {object} headers 
   */
  const patch = useCallback(async (url, body, headers = {}) => {
    return fetchData(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    })
  }, [fetchData])

  /**
   * @param {string} url 
   * @param {object} headers
   */
  const del = useCallback(async (url, headers = {}) => {
    return fetchData(url, { method: 'DELETE', headers })
  }, [fetchData])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
    fetchData
  }
}

export default useApi