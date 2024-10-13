import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styles from './App.css'; // Ensure your styles are applied correctly
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const App = () => {
  const [symptoms, setSymptoms] = useState('');
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [medications, setMedications] = useState('');
  const [age, setAge] = useState('');
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSymptomChange = (e) => setSymptoms(e.target.value);
  const handleMedicationChange = (e) => setMedications(e.target.value);
  const handleAgeChange = (e) => setAge(e.target.value);

  const handleVoiceInput = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition.');
    } else {
      SpeechRecognition.startListening();
    }
  };

  const handleSubmit = async () => {
    const inputData = {
      symptoms: symptoms || transcript || "No symptoms provided",  // Add a default value
      medications: medications || "No medications provided",       // Default value
      age: age || "No age provided",                               // Default value
    };
  
    console.log('User input data:', inputData);
  
    const apiUrl = "http://127.0.0.1:5000/analyze";  // Ensure Flask is running on this URL
  
    try {
      // Fetch API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),  // Convert the input data to JSON string format
      });
  
      // Check if the response is ok (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`Failed to fetch data from the API: ${response.status}`);
      }
  
      const resultData = await response.json();  // Parse the JSON response
      setResults({ summary: resultData.text });  // Access the 'summary' field from the response
      setShowResults(true);
    } catch (error) {
      console.error('Error occurred:', error);
      setResults({ summary: `Error occurred: ${error.message}` });
      setShowResults(true);
    }
  };  


  /*const handleSubmit = async () => {
    const inputData = {
      symptoms: symptoms || transcript || "No symptoms provided",  // Add a default value
      medications: medications || "No medications provided",       // Default value
      age: age || "No age provided",                               // Default value
    };

    console.log('User input data:', inputData);

    const apiUrl = "http://127.0.0.1:5000/analyze";  // Ensure Flask is running on this URL

    try {
      const response = await axios.post(apiUrl, inputData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 100000,  // Set timeout to 10 seconds (10000 ms)
      });

      console.log('User input response:', response);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch data from the API: ${response.status}`);
      }
      console.log(response)
      console.log(response.data)
      const resultData = response.data;
      setResults({ summary: resultData.summary });  // Access the 'summary' field from the response
      setShowResults(true);
    } catch (error) {
      console.error('Error:', error);
      setResults({ summary: `Error occurred: ${error.message}` }); // Fixed string interpolation
      setShowResults(true);
    }
  };*/

  return (
    <div className="App">
      <header>
        <section className="header">OpenMed</section>
        <p>Analyzing medical symptoms in minutes!</p>
      </header>

      <main>
        <section className="Disclaimer">
          <label>
            <strong> Disclaimer! OpenMed is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a physician or other qualified healthcare providers regarding your medical conditions. </strong>
          </label>
        </section>

        <section className="input-section">
          <label>Can you please state your symptoms?</label>
          <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '70ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Describe your symptoms here..."
              variant="outlined"
              value={symptoms || transcript}
              onChange={handleSymptomChange}
            />
          </Box>
          <button onClick={handleVoiceInput}>
            {listening ? 'Listening...' : '🎤 Start Voice Input'}
          </button>
        </section>

        <section className="additional-questions">
          <label>What medications are you currently taking?</label>
          <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '70ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Enter medications here..."
              variant="outlined"
              value={medications}
              onChange={handleMedicationChange}
            />
          </Box>

          <label>What is your age?</label>
          <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '70ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Enter your age here..."
              variant="outlined"
              value={age}
              onChange={handleAgeChange}
            />
          </Box>
        </section>

        <button className="submit-button" onClick={handleSubmit}>
          Analyze Symptoms
        </button>

        {showResults && results && (
          <section className="results-section">
            <h2>Analysis Results</h2>
            <p>{results.summary}</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
