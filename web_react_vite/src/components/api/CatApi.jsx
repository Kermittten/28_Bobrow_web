import { useEffect } from 'react'
import useApiStore from '../../store/apiStore'
import Loading from '../common/Loading'

const CatApi = () => {
  const { catData, loading, error, fetchCat } = useApiStore()

  useEffect(() => {
    fetchCat()
  }, [fetchCat])

  if (loading) return <Loading />
  if (error) return <div className="error">Error: {error.message}</div>

  return (
    <section id="cat-api-section" className="content-section">
      <div className="api-container">
        <h2>Random Cat</h2>
        <button onClick={fetchCat}>Get Random Cat</button>
        <div id="cat-result" className="api-result">
          {catData && (
            <div className="cat-container">
              <img src={catData.url} alt="Random Cat" className="cat-image" />
              <p>Image ID: {catData.id}</p>
              <p>Width: {catData.width}px, Height: {catData.height}px</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CatApi