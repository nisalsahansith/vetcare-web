# VetCare - Frontend Web Application

## Student Information

* **Student Name:** Nisal Sahansith
* **Student Number:** `241722015`
* **Slack Handle:** `U087MM98MB3`
* **GCP Project ID:** `project-e9fb8820-8459-4622-9e9`
* **Frontend deploy URL:** `https://vetcare-frontend-711123911666.asia-southeast1.run.app/login`

---

## Project Description

VetCare is a web-based veterinary management system developed using a cloud-native microservice architecture.

This repository contains the frontend web application developed using React and Vite.

The frontend communicates with the backend microservices through the API Gateway deployed on Google Cloud Platform (GCP).

The application provides a user-friendly interface for interacting with the VetCare system and demonstrates that the cloud-deployed backend services can be successfully consumed through the API Gateway.

---

## Live Application

**Deployed Application URL:**

`<YOUR_CLOUD_RUN_PUBLIC_URL>`

The public deployed application URL should also be added to the **GitHub repository About/Description** as required by the project guidelines.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Axios
* Tailwind CSS
* React Router

### API Communication

* Axios
* REST API
* API Gateway

### Deployment

* Google Cloud Run
* Google Cloud Platform (GCP)

---

## Application Architecture

```text
                    VetCare Frontend
                           │
                           ▼
                    React + Vite
                           │
                           ▼
                         Axios
                           │
                           ▼
                    API Gateway
                       (GCP)
                           │
                           ▼
                   Eureka Service
                      Discovery
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     User Service     Pet Service     Appointment
                                           Service
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                  Medical Record Service
```

---

## Main Features

The frontend provides interfaces for the VetCare system, including:

* User authentication
* User management
* Pet management
* Appointment management
* Medical record management
* Medical record file handling
* API-based data management
* Responsive web interface

---

## Project Structure

```text
vetcare-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── ...
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Prerequisites

Before running the project, make sure the following software is installed:

* Node.js
* npm
* Git

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
```

Navigate to the project:

```bash
cd <YOUR_FRONTEND_REPOSITORY_NAME>
```

---

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=<YOUR_API_GATEWAY_URL>
```

For local development, for example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For the deployed application, configure the URL of the deployed API Gateway.

> Do not add passwords, service-account keys, or other sensitive credentials to the repository.

---

## Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at the URL displayed by Vite, normally:

```text
http://localhost:5173
```

---

## Building for Production

Create a production build:

```bash
npm run build
```

The generated production files will be placed in the `dist` directory.

---

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

## API Integration

The frontend uses Axios to communicate with the backend.

The API requests are sent through the API Gateway instead of directly accessing individual microservices.

```text
React Application
       │
       ▼
     Axios
       │
       ▼
  API Gateway
       │
       ▼
Eureka Service Discovery
       │
       ├── User Service
       ├── Pet Service
       ├── Appointment Service
       └── Medical Record Service
```

The API base URL is configured using the Vite environment variable:

```env
VITE_API_BASE_URL=<YOUR_API_GATEWAY_URL>
```

---

## Authentication

The frontend implements authentication and uses Axios to communicate with protected backend APIs.

Authentication information is managed on the frontend and attached to API requests when required.

---

## Cloud Deployment

The VetCare frontend is deployed on **Google Cloud Run**.

Cloud Run provides the serverless/PaaS deployment model required for the frontend application.

```text
User Browser
     │
     ▼
Google Cloud Run
     │
     ▼
VetCare React Application
     │
     ▼
API Gateway
     │
     ▼
Backend Microservices
```

---

## Deployment URL

The deployed application can be accessed at:

`<YOUR_CLOUD_RUN_PUBLIC_URL>`

---

## Backend API

The frontend consumes the backend API through the API Gateway.

Example:

```text
https://<YOUR_API_GATEWAY_DOMAIN>/api/v1/users
https://<YOUR_API_GATEWAY_DOMAIN>/api/v1/pets
https://<YOUR_API_GATEWAY_DOMAIN>/api/v1/appointments
https://<YOUR_API_GATEWAY_DOMAIN>/api/v1/medical-records
```

---

## Responsive Design

The application is designed to provide a responsive user interface across different screen sizes, including:

* Desktop
* Tablet
* Mobile

---

## Environment Configuration

The application uses Vite environment variables for environment-specific configuration.

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For production, the value should point to the deployed API Gateway.

---

## Project Purpose

The purpose of this frontend application is to demonstrate the functionality of the VetCare cloud-native microservice system.

The frontend successfully consumes the backend APIs deployed on Google Cloud Platform through the API Gateway, as required by the Enterprise Cloud Architecture project guidelines.

---

## License

This project was developed as part of the **ITS 2130 - Enterprise Cloud Architecture** final project.
