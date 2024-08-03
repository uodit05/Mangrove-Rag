import React, { useState, useEffect } from 'react';
import Product from '../components/Product';
import productData from '../assets/raw_flipkart_data_with_images.json';
import "./recommended.css"
import AudioFileTable from '../components/AudioFiles';

// const Recommended = () => {
//   const [allProducts, setAllProducts] = useState([]);
  
//   const shuffleArray = array => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   };

//   useState(() => {
//     const shuffledProducts = shuffleArray(productData);
//     const selectedProducts = shuffledProducts.slice(0, 20);
//     setAllProducts(selectedProducts);
//   }, []);

//   return (
//     <div>
//       <h2 className="font-bold text-3xl">Recommended for you:</h2>
//       <div className="grid grid-cols-4 gap-4 p-4">
//         {allProducts.map(product => (
//           <Product
//             key={product.pid}
//             name={product.title}
//             price={product.price}
//             image={product.images.split('|')}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Recommended;

// import React, { useState, useEffect } from 'react';

const Recommended = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recorder, setRecorder] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

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
      setRecommendedProducts(data.result);
      console.log(recommendedProducts)
      console.log('Received data from backend:', data);
    } catch (error) {
      console.error('Error submitting query:', error.message);
    }
  };

  useEffect(() => {
    console.log(recommendedProducts);
  }, [recommendedProducts]);

  //use effect to record audio
  useEffect(() => {
    let mediaRecorder;
    if (recording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = e => {
            setAudioChunks(prevChunks => [...prevChunks, e.data]);
          };
          mediaRecorder.start();
          setRecorder(mediaRecorder);
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    } else {
      if (recorder) {
        recorder.stop();
        setRecorder(null);
      }
    }

    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [recording]);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const saveRecording = async () => {
    if (audioChunks.length === 0) {
      console.error('No audio recorded');
      return;
    }

    try {
      const handle = await window.showSaveFilePicker({
        types: [{
          accept: {
            'audio/*': ['.wav']
          }
        }]
      });

      const writableStream = await handle.createWritable();
      for (const chunk of audioChunks) {
        await writableStream.write(chunk);
      }
      await writableStream.close();
      setAudioChunks([]);
      console.log('Audio saved successfully');
    } catch (error) {
      console.error('Error saving audio:', error);
    }
  };

  return (
    <div>
      <div className="pt-7 pb-5">
        {recording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
        <button onClick={saveRecording}>Save Recording</button>
      </div>
      <div>
      <h2 className="font-bold text-3xl">Audio Files</h2>
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
      <h2 className="font-bold text-3xl">Recommended for you:</h2>
      <div className="grid grid-cols-4 gap-4 p-4">
        {recommendedProducts.length > 0 ? (
          (JSON.parse(recommendedProducts)).map((pid) => {
            const product = productData.find((item) => item.pid === pid);
          
            if (product) {
              return (
                <Product 
                  key={pid}
                  name={product.title}
                  price={product.price}
                  image={product.images.split('|')} 
                />
              );
            } else {
              return (
                <div key={pid}>Product not found</div>
              );
            }
          })
        ) : (
          <div>No recommended products</div>
        )}
      </div>
    </div>
  );
};

export default Recommended;
