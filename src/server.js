const fs = require('fs');
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  if (fs.existsSync('/.dockerenv')) {
    // Inside a container: the browser must use the port published with -p
    console.log(`TechyCamp demo app is listening on port ${port} inside the container.`);
    console.log(`Open the port you published, e.g. "docker run -p 8080:${port}" -> http://localhost:8080`);
  } else {
    console.log(`TechyCamp demo app is running on http://localhost:${port}`);
  }
});
