# Institutional FX & Derivatives RFQ Platform

A high-performance, web-based Request for Quote (RFQ) and Best-Execution system for OTC FX Options and Derivatives. Designed to replicate the functionality of top-tier institutional single-dealer platforms.

![Platform Mockup](https://placehold.co/800x400?text=FX+Derivatives+Platform+UI)

## 🚀 Overview

This platform connects buy-side traders with multi-dealer liquidity for complex derivative products. It features a real-time pricing engine, RFQ lifecycle management, and a high-density institutional execution UI.

### Key Features

*   **Product Coverage**: FX Spot, Forwards, Vanilla Options (Call/Put), and Barrier Options.
*   **Pricing Engine**: Built-in Black-Scholes and Garman-Kohlhagen models for real-time theoretical pricing and Greeks (Delta, Gamma, Vega, Theta).
*   **RFQ Workflow**: Complete lifecycle support from `CREATED` -> `QUOTING` -> `EXECUTED`.
*   **Best Execution**: Aggregates and ranks quotes from multiple simulated dealers (e.g., Dealer A, Dealer B, Dealer C).
*   **Real-time Updates**: WebSocket-driven price streaming and quoting interface.

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, Vite, TailwindCSS (Dark Theme).
*   **Backend**: Python 3.11+, FastAPI, SQLAlchemy, WebSocket.
*   **Quantitative Library**: NumPy, SciPy (for math/stat models).
*   **Database**: PostgreSQL / SQLite (for local dev).

## ⚡ Getting Started

### Prerequisites

*   Node.js (LTS)
*   Python 3.11+

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SAURABHMOHARIR/fx-derivatives-platform.git
    cd fx-derivatives-platform
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Mac/Linux
    # source venv/bin/activate
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend API** (Terminal 1)
    ```bash
    cd backend
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    *API will be available at http://localhost:8000/docs*

2.  **Start the Trading UI** (Terminal 2)
    ```bash
    cd frontend
    npm run dev
    ```
    *UI will be available at http://localhost:5173*

## 📈 Pricing Models

The generic pricing engine supports:
*   **Black-Scholes**: For European options on non-dividend paying stocks (or futures).
*   **Garman-Kohlhagen**: Extension of Black-Scholes for FX options, accounting for domestic and foreign risk-free rates.

## 🔒 Security & Architecture

*   **State Management**: RFQ states are strictly enforced via a finite state machine.
*   **Audit-Ready**: All trades and quotes are timestamped and recorded (DB Schema ready).
*   **Scalable**: Designed with async API endpoints to handle high-throughput quoting.

---
*Disclaimer: This is a reference implementation for educational and portfolio purposes. Financial models should be validated before real-world use.*
