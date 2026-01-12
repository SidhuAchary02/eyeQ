import { useState } from 'react'
import './App.css'

function App() {
  const [rtspUrl, setRtspUrl] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamUrl, setStreamUrl] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/start-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rtsp_url: rtspUrl }),
      })
      const data = await response.json()
      setMessage(data.message || 'Detection started')
      setStreamUrl(`http://localhost:8001/stream?rtsp_url=${encodeURIComponent(rtspUrl)}`)
      setIsStreaming(true)
    } catch (error) {
      setMessage('Error: ' + error.message)
    }
  }

  return (
    <>
      <h1>EyeQ Object Detection</h1>
      <form onSubmit={handleSubmit}>
        <label>
          RTSP URL:
          <input
            type="text"
            value={rtspUrl}
            onChange={(e) => setRtspUrl(e.target.value)}
            placeholder="rtsp://localhost:8554/webcam"
            required
          />
        </label>
        <button type="submit">Start Detection</button>
      </form>
      {message && <p>{message}</p>}
      {isStreaming && (
        <div>
          <h2>Live Detection Feed</h2>
          <img src={streamUrl} alt="Detection Feed" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </>
  )
}

export default App
