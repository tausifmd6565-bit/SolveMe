# SIH Innovation Hub (SolveGrid) — Working Prototype

> **Smart India Hackathon 2026 — Screening Round Submission**  
> **Problem Statement ID:** SIH26043  
> **Theme:** Smart Education / Civic Tech  
> **Team Name:** SolveGrid  
> **Title:** A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.

---

## 🌟 Overview

The **SIH Innovation Hub** platform connects **citizens**, **government authorities**, and **universities/startups** in an integrated ecosystem:

1. **Citizen Portal** (Bilingual English / हिन्दी, Accessible, UMANG-style):
   - Citizens easily post local civic / societal problems (waterlogging, broken bridges, rural healthcare shortages, schooling issues).
   - **Interactive Leaflet / OpenStreetMap Location Picker** to drop a pin on a live map.
   - Evidence upload support (photos/videos).
   - Instant language switch (**English <-> हिंदी**).
   - Community validation: **"I also face this issue" / "मुझे भी यह समस्या है"** with instant deduplication.

2. **AI Organization & Categorization Engine (Member 4 Bounded Module)**:
   - Automated categorization (Water, Healthcare, Education, Infrastructure, Agriculture, etc.).
   - Concise summary generation.
   - Tag extraction and domain mapping (e.g. Civil Engineering, Environmental Science, Public Health).
   - Transparent rule-based Priority Score computation:
     $$\text{Priority} = \text{Community Signal (0-5)} + \text{Evidence (0-3)} + \text{Severity (0-5)} + \text{Urgency (0-3)} + \text{Validation (0-4)}$$

3. **Government / Validator Dashboard**:
   - Modern administrative dashboard with statistics (total problems, users, adoptions).
   - Interactive charts (Category breakdown, Status breakdown).
   - Queue management to review, change status, and triage high-priority challenges.

4. **University / Solver Portal**:
   - Academic institutes (e.g., BIT Mesra, IIT ISM Dhanbad) and startups discover challenges matching their technical departments.
   - Single-click **"Express Interest / Adopt"** mechanism.
   - Project lifecycle tracking with milestone and progress updates.

---

## 👥 Team Work Division Alignment

| Member | Documented Responsibility | Implemented Module in Prototype |
|---|---|---|
| **Member 1 (Leader)** | Architecture & API contracts | FastAPI routers, DB schema, priority engine, end-to-end integration |
| **Member 2 (Frontend Lead)** | React + Tailwind + Routing + Auth | Vite + React + Tailwind frontend, Citizen portal, Auth context, API services |
| **Member 3 (Backend & DB)** | DB models + CRUD endpoints | SQLAlchemy models, SQLite persistence, Pydantic schemas, validation |
| **Member 4 (AI / Vibe Coder)** | Bounded AI Module | `backend/app/ai_module.py` (`analyze_problem()` returning JSON) |
| **Member 5 (Domain & Mapping)** | Stakeholder mapping dataset | `backend/app/seed_data.py` (12 categories mapped to Depts, Universities & Startups) |
| **Member 6 (UI/UX)** | Workflows & Presentation assets | Responsive Tailwind UI layouts, bilingual interface, Leaflet map picker |

---

## 🚀 Quick Start (One-Click)

### Option 1: One-Click Launcher (Windows)
Double-click `start_all.bat` in the root folder. It launches:
- **FastAPI Backend:** [http://127.0.0.1:8000](http://127.0.0.1:8000) (Docs at `/docs`)
- **Professional Institutional Portal (`fronten_2`):** [http://127.0.0.1:3000](http://127.0.0.1:3000) (or via backend at [http://127.0.0.1:8000/portal/](http://127.0.0.1:8000/portal/))
- **React Vite Portal (`frontend`):** [http://127.0.0.1:5173](http://127.0.0.1:5173)

### Option 2: Manual Start

#### 1. Backend (FastAPI)
```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive API Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Professional Portal (Embedded): [http://127.0.0.1:8000/portal/](http://127.0.0.1:8000/portal/)

#### 2. Professional Portal (`fronten_2` - Non-AI Clean Aesthetic)
```bash
cd fronten_2
python -m http.server 3000 --bind 127.0.0.1
```
- URL: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Uses authentic government portal styling: National Tricolor accent strip, restrained neutral status indicators (no generic neon pills), Inter typography, and direct integration with the FastAPI backend.

#### 3. React Vite App (`frontend`)
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
- URL: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 🔑 Demo Login Accounts (Any 6-digit OTP, e.g. `246810`)

| Role | Mobile Number | Features |
|---|---|---|
| **Citizen** | `9876543210` | Report problems, endorse with "I also face this issue", live priority breakdown |
| **University (Solver)** | `9876543230` | BIT Mesra R&D lab, adopt challenges matching departments, milestone tracking |
| **Government (Admin)** | `9876543220` | Review queue, verification actions, district analytics |

