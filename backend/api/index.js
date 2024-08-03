const express=require('express');
const mysql=require('mysql2');
const cors=require('cors');
const bodyParser=require('body-parser');
const {spawn}=require('child_process');
const fs = require('fs');
const path = require('path');

const app=express();

app.use(cors());

app.use((req, res, next) => {
  res.header({"Access-Control-Allow-Origin": "*"});
  next();
}) 

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// const db=mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'test',
// })



app.get('/api', (req, res)=>{
    return res.json('Hello Frontend this is Backend');
})

app.get('/api/users', (req, res)=>{
    const sql='SELECT * FROM users';
    db.query(sql, (err, result)=>{
        if (err) return res.json(err);
        res.json(result);
    })
})

const executePython = async (script, args) => {
    const py = spawn('python', [script, args]);
    const result = await new Promise((resolve, reject) => {
        let output = '';
        py.stdout.on('data', data => {
            output += data.toString();
        });
        py.stderr.on('data', data => {
            console.error('Error:', data.toString());
            reject(`Error occurred in ${script}`);
        });
        py.on('exit', code => {
            console.log(`Child process exited with code ${code}`);
            resolve(output);
        });
    });
    return result;
};

// Handler for POST /api/query chatbot
app.post('/api/query', async (req, res) => {
    const query = req.body.query;
    console.log('Query received:', query);
    
    try {
        // Execute Python script
        const result = await executePython('../python/ragllm.py', query);
        // Send the result as response
        res.json({ result });
    } catch (error) {
        console.error('Error executing Python script:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/voice', async (req, res) => {
    const filename = req.body.filename;
    console.log('Query received:', filename);
    
    try {
        const result = await executePython('C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/voice.py',filename);
        res.json({ result });
    } catch (error) {
        console.error('Error executing Python script:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/audiofiles', (req, res) => {
    const directoryPath = 'C:/Users/Sairam/OneDrive/Desktop/GENAI HACKATHON 2024/backend/python/audio_files'; // Specify the path to your fixed directory
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        res.status(500).send('Error reading directory');
      } else {
        const audioFiles = files.filter(file => file.endsWith('.wav')).map(file => path.join(directoryPath, file));;
        res.json(audioFiles);
      }
    });
  });

app.listen(8081, ()=>{
    console.log('Server is running on port 8081');
})
