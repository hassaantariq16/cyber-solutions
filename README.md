# CyberSolutions (Ironvelo)

A full-stack cybersecurity company website with blog management system.

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes (REST API)
- **Database**: MongoDB Atlas (Mongoose ODM)
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
# Build
docker build -t hassaan8345/cyber-solutions:fa23-bcs-118 .

# Run
docker run -p 3000:3000 -e MONGODB_URI="your-mongodb-uri" hassaan8345/cyber-solutions:fa23-bcs-118
```

## Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Docker Hub
Image: `hassaan8345/cyber-solutions:fa23-bcs-118`

## Author
Hassaan Tariq - FA23-BCS-118
