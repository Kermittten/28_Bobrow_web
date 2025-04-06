import { useEffect } from 'react'
import useApiStore from '../../store/apiStore'
import Loading from '../common/Loading'
import './ApiStyles.css' 

const JokeApi = () => {
  const { 
    jokeData, 
    jokeLoading, 
    jokeError, 
    fetchJoke 
  } = useApiStore()

  useEffect(() => {
    fetchJoke()
  }, [fetchJoke])

  if (jokeLoading) return <Loading />
  if (jokeError) return <div className="error-message">Error: {jokeError.message}</div>

  return (
    <div className="api-container">
      <h2>Random Joke</h2>
      <button onClick={fetchJoke} disabled={jokeLoading}>
        {jokeLoading ? 'Loading...' : 'Get Joke'}
      </button>
      
      <div className="api-result">
        {jokeData && (
          <div className="joke-container">
            <div className="joke-setup">{jokeData.setup}</div>
            <div className="joke-punchline">{jokeData.punchline}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JokeApi