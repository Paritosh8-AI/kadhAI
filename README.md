# 🍲 kadhAI (कढ़ाई AI)

> **The Multi-Modal Agentic Chef for Indian Kitchens & Quick-Commerce Arbitrage.**  
> *Transforming noisy Indian fridge photos into authentic regional recipes, zero-waste leftover transformations, and 10-minute grocery unlock links.*

[![CI/CD Android APK Build](https://github.com/Paritosh8-AI/kadhAI/actions/workflows/build-apk.yml/badge.svg)](https://github.com/Paritosh8-AI/kadhAI/actions/workflows/build-apk.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)](https://react.dev)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android_Native-119EFF.svg?logo=capacitor)](https://capacitorjs.com)
[![Groq LPUs](https://img.shields.io/badge/Groq-LPU_Inference-F55036.svg)](https://groq.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini_3.5_Flash-8E75B2.svg?logo=google)](https://ai.google.dev)

---

## 🌟 Why kadhAI?

Generic AI cooking apps fail miserably in Indian households:
1. **Noisy Fridge Chaos**: Cluttered shelves, steel *katoris*, plastic bags, and vegetable *tokris*.
2. **Missing Culinary Nuance**: Inability to differentiate *jeera* (cumin) from *saunf* (fennel), neglecting wilting *dhaniya*, or missing Indian leftover *Jugaad* (repurposing cold dal into *Dal Paratha* or dry rotis into *Vaghareli Roti*).
3. **The Sacred Tadka**: Disregarding traditional base fats (Mustard Oil vs. Desi Ghee) and strict tempering sequence (*Hing ➔ Jeera ➔ Rai ➔ Curry Leaves*).
4. **Pantry Gaps**: Recipes demanding items you don't have, without direct quick-commerce links to restock them in 10 minutes.

**kadhAI** solves all of this with an end-to-end, multi-modal hybrid agentic pipeline.

---

## 🏗️ Technical Architecture

```mermaid
flowchart TD
    User([User snaps Kitchen / Fridge Photo]) --> Vision[Gemini 3.5 Flash Multi-Modal Vision]
    
    subgraph Computer Vision & Grounding
        Vision --> Schema[Pydantic v2 Structured Taxonomy Parser]
        Schema --> Inventory[PantryScanResult: Dual Hindi/English Items + Cooked Leftovers]
    end
    
    subgraph Agentic Hybrid Reasoning
        Inventory --> Filter[Dietary Guardrails: Pure Veg / Jain / Vrat / High-Protein]
        Filter --> GroqLPU[Groq LPUs: openai/gpt-oss-120b Ultra-Fast Reasoning]
        GroqLPU --> RecipeEngine[Recipe & Sacred Tadka Formulator]
    end
    
    subgraph Quick-Commerce & Sharing
        RecipeEngine --> QC[Quick Commerce Helper: Blinkit / Zepto / Swiggy Instamart]
        QC --> UI[Full-Stack App: React 19 + Tailwind v4 + Capacitor Android]
        UI --> WhatsApp[1-Tap WhatsApp Ingredient & Recipe Share]
    end
```

---

## ⚡ Tech Stack & Highlights

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Vision Inference** | **Google Gemini 3.5 Flash** | Sub-second visual parsing of cluttered, occluded fridge images into strictly typed schemas. |
| **Agentic Reasoning** | **Groq Cloud (`openai/gpt-oss-120b`)** | Sub-2s recipe generation, dietary guardrails, and Sacred Tadka synthesis. |
| **Mobile App** | **Capacitor + React 19 + Tailwind v4** | Native Android application (`com.kadhai.app`) with camera integration & smooth animations. |
| **Authentication** | **SQLite + Phone OTP** | Indian mobile number verification (`+91`) with 4-digit OTP challenge. |
| **Backend API** | **FastAPI + Uvicorn** | High-performance asynchronous API serving both JSON endpoints and web assets. |
| **CI/CD** | **GitHub Actions** | Automated compilation of installable `app-debug.apk` and production `app-release-unsigned.apk`. |
| **Commerce Links** | **Deep Linking** | Real-time query generators for **Blinkit**, **Zepto**, and **Swiggy Instamart**. |

---

## 📲 Download & Installation

### Android APK (Automated via GitHub Actions)
Every commit to `master` builds fresh Android APKs automatically:
1. Navigate to [kadhAI GitHub Actions](https://github.com/Paritosh8-AI/kadhAI/actions).
2. Click on the latest **Build Production Android APK** run.
3. Download the **`kadhAI-installable-apk`** artifact.
4. Install `app-debug.apk` directly on any Android smartphone.

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Paritosh8-AI/kadhAI.git
cd kadhAI

# 2. Set up Python virtual environment
python -m venv .venv
.\.venv\Scripts\activate   # Windows
# source .venv/bin/activate # Linux/macOS

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Configure environment keys
copy .env.example .env
# Edit .env with your free GEMINI_API_KEY and GROQ_API_KEY

# 5. Build frontend
cd frontend
npm install
npm run build
cd ..

# 6. Start full-stack server
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

---

## 📜 License
Apache-2.0 License. Built with ❤️ for Indian home chefs and AI engineers.
