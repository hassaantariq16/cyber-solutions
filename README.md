# CyberSolutions (Ironvelo)

A full-stack cybersecurity company website with blog management system.

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB (Mongoose ODM)
- **Editor**: SunEditor (WYSIWYG Rich Text)
- **Validation**: Zod

## Features
- Responsive landing page with hero, services, testimonials
- Full blog CRUD (Create, Read, Update, Delete)
- Admin dashboard with search, filter, pagination
- Rich text blog editor with preview mode
- Dynamic service pages

## Docker
```bash
docker compose up --build
```

## Kubernetes
```bash
kubectl apply -f k8s/mongo-statefulset.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

## Docker Hub
Frontend image: `hassaan8345/cyber-frontend:latest`
Backend image: `hassaan8345/cyber-backend:latest`

## AKS Public URL
Live AKS frontend: `http://134.112.161.154`

## Author
Hassaan Tariq - FA23-BCS-118
