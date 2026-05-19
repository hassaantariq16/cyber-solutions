# Cyber Solutions — DevOps Final Submission Guide

Quick steps to run locally and reproduce required artifacts for the assignment.

Run with Docker Compose (builds frontend, backend, mongo):

```powershell
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/blogs
- MongoDB: mongodb://localhost:27017 (data persisted in volume)

Run Selenium tests (requires Chrome installed):

```powershell
cd tests/selenium
npm ci
npm test
```

CI/CD:
- Workflow file: .github/workflows/ci-cd.yml
- Triggered on push and pull_request for the main branches
- Configure GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `KUBECONFIG`

AKS:
- Resource group: `cyber-solutions-rg-poland`
- Cluster: `cyber-solutions-cluster`
- Public frontend URL: `http://134.112.161.154`
- Manifests under `k8s/` deploy MongoDB, backend, and frontend from Docker Hub.
- The frontend deployment includes `BACKEND_URL=http://cyber-backend-service:5000`

Packaging:
- Use `zip_submission.ps1` to create the final zip (pass your RegNo as first argument).
