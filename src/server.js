const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`TechyCamp demo app is running on http://localhost:${port}`);
});
