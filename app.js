const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const vision = require('@google-cloud/vision')
const fs = require('fs');


// Creates a client
const client = new vision.ImageAnnotatorClient()


// serve files from the public directory
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/test', (req,res) => {
  base64string = req.body.data
  console.log(base64string)
  
  fs.writeFile('image.jpg', base64string, {encoding: 'base64'}, function(err) {
  console.log('File created');

  client
  .labelDetection('./image.jpg')
  .then(results => {
    const labels = results[0].labelAnnotations;
    // Print out the best one
    finalLabel = labels[0].description

    res.send(finalLabel)
    console.log(finalLabel)
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
  
}); 
})


app.listen(5000, '127.0.0.1', () => console.log('Server running on port 5000'));