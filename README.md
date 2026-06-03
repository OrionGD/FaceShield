# FaceShield EdgeAI

**Zero Network. Zero Fraud. Instant Identity.**  
*A decentralized biometric workforce platform built for the NHAI Innovation Hackathon 7.0.*

FaceShield EdgeAI bridges tactical offline-first operations, 3-Signal Passive Liveness, PPE compliance, and real-time geofencing into a zero-trust workforce OS. It is engineered to address remote infrastructure challenges by combining local neural network biometric validation with resilient browser caching for 100% operational uptime, even without internet connectivity.

---

## 🚀 Key Features

- **Machine Intelligence Hub**: Runs local UltraFace and ArcFace ONNX models in-browser/kiosk to extract 512D face embeddings under 20ms latency.
- **3-Signal Passive Liveness**: Actively blocks spoofing attempts (photos, videos, masks).
- **Offline-First Synchronization**: Uses IndexedDB and Service Workers to cache attendance logs during network outages. Resyncs with the core server seamlessly with zero drift.
- **Tactical Geofencing**: Validates GPS containment boundaries dynamically using the Haversine formula against authorized site radiuses.
- **Enterprise Modules**:
  - **Control Room**: Master operational command and global metrics.
  - **Security Desk**: Mobile-friendly interface for guards to enforce check-ins.
  - **Biometric Hub**: Fast and encrypted onboarding for new contractor biometrics.

---

## 🏗 System Architecture

FaceShield EdgeAI is a distributed micro-services architecture composed of three core engines:

1. **Frontend UI** (`/frontend`)
   - **Tech Stack**: React 19, Vite, Tailwind CSS v4, Zustand.
   - **Role**: Delivers the interactive dashboards, mobile guard portals, and local biometric inference interfaces.

2. **Backend API Gateway** (`/backend`)
   - **Tech Stack**: NestJS, Prisma, PostgreSQL.
   - **Role**: Handles centralized relational persistence, Role-Based Access Control (RBAC), vendor management, and synchronization tunnels.

3. **Biometrics OpenCV Engine** (`/biometrics_service`)
   - **Tech Stack**: Python, FastAPI, ONNX Runtime, OpenCV.
   - **Role**: A standalone edge microservice for handling complex neural face validation, embedding extraction, and liveness calculations.

---

## 🚦 Getting Started (Local Development)

The entire enterprise OS can be launched locally via the included command-line initializer.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (Running locally or hosted)

### Booting the System

Simply execute the included launcher script from the root directory:

```bash
.\start.bat
```

The script will automatically:
1. Validate and install any missing NPM dependencies for the Frontend and Backend.
2. Setup and activate a Python virtual environment for the Biometrics engine.
3. Validate your `.env` connection secrets and synchronize the Prisma database schema.
4. Launch all three micro-services concurrently.

**Local Routing Endpoints:**
- **Client UI**: `http://localhost:2345`
- **API Gateway**: `http://localhost:3456/api/v1`
- **Swagger System Docs**: `http://localhost:3456/api/docs`
- **Biometrics API**: `http://localhost:8000/api/biometrics/health`

*Note: To safely terminate the system, run `.\start.bat` again and select Option 2 (System Override).*

---

## ☁️ Deployment

For detailed instructions on deploying the full stack (Vercel + Render), please refer to the [Deployment Guide](./guide.md).

---

## 👥 The Team

- **Arjun S N** - System Architect & Team Leader
- **Godfrey T R** - System Developer & Team Member

*Built with ❤️ for NHAI Innovation Hackathon 7.0*
 