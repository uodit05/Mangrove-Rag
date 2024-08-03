import React, { useState, useEffect } from 'react';

const AudioFileTable = () => {
  const [audioFiles, setAudioFiles] = useState([]);

  useEffect(() => {
    // Function to fetch the list of audio files from the server
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/audiofiles');
        if (!response.ok) {
          throw new Error('Failed to fetch audio files');
        }
        const data = await response.json();
        setAudioFiles(data);
      } catch (error) {
        console.error('Error fetching audio files:', error);
      }
    };

    fetchAudioFiles();
  }, []);

  const handleSelect = async (filename) => {
    try {
      const response = await fetch('http://localhost:8081/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      // Do something with the returned JSON data, e.g., update state in the parent component
      console.log('Received data from backend:', data);
    } catch (error) {
      console.error('Error submitting query:', error.message);
    }
  };
  

  return (
    <div>
      <h2>Audio Files</h2>
      <table>
        <thead>
          <tr>
            <th>Audio Name</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {audioFiles.map((fileName, index) => (
            <tr key={index}>
              <td>{fileName}</td>
              <td>
                <button onClick={() => handleSelect(fileName)}>Select</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AudioFileTable;
