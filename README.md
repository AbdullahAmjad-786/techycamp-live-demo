# TechyCamp Live Demo

The sample app from TechyCamp's free DevOps demo class: one small web app that goes from a laptop to Azure, with no manual steps.

**Code → Tests → Docker image → GitHub Actions → Azure Container Apps**

## Run it

```bash
npm install
npm test
npm start                                   # http://localhost:3000

docker build -t techycamp-demo .
docker run -p 8080:3000 techycamp-demo      # http://localhost:8080
```

## Change it live

Edit `src/message.js`, then commit and push to `main`. GitHub Actions tests it, builds the image, pushes it to `ghcr.io` and deploys it to Azure.
A headline over 60 characters fails the tests, and nothing gets deployed.

Want to build this yourself? See [DevOps for Beginners at TechyCamp](https://www.techycamp.com/courses/devops-fundamentals).
