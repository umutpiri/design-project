async function detect() {
	// Imports the Google Cloud client library
	const vision = require('@google-cloud/vision');
  
	// Creates a client
	const client = new vision.ImageAnnotatorClient();

	const [result] = await client.landmarkDetection(
		`kocatepe5.jpeg`
	  );
  
	const landmarks = result.landmarkAnnotations;
	console.log('Landmarks:');
	landmarks.forEach(landmark => console.log(landmark));
	return landmarks[0];
}