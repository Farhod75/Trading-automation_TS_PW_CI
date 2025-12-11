# Trading Automation E2E Tests (FastAPI + Playwright)

End-to-end automation framework for a mock **Order Management System (OMS)** with browser-based order ticket and blotter.

[![CI](https://github.com/Farhod75/Trading-automation_TS_PW_CI/actions/workflows/ci.yml/badge.svg)](https://github.com/Farhod75/Trading-automation_TS_PW_CI/actions)

## 🎯 What it demonstrates

**Realistic OMS workflow** (NEW → ROUTED → FILLED/CANCELLED):
- **Trader UI**: Order ticket + blotter (HTML/JS)
- **Trading API**: FastAPI backend (Python/SQLite)
- **Full E2E tests**: Playwright TypeScript (Chromium/Firefox/WebKit)
- **Data-driven**: YAML scenarios (bonds/swaps/options)
- **CI/CD**: GitHub Actions (servers + cross-browser tests)

## 🏗️ Architecture
[ Trader Browser ]
↓ REST API
[ FastAPI OMS ] ←→ [ SQLite Orders ]
validate → persist → status transitions


## 🚀 Local Run

```bash
# Backend
cd trading-api-python
. venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload

# Frontend (new terminal)
npm run serve:ui

# Tests
npm test
🧪 Test Coverage
Suite	Scenarios	Browsers
UI Order Ticket	15+ (positive/negative)	3
E2E Order Flow	12 (place→route→fill)	3
API	10+ (CRUD validation)	N/A
All 27+ tests green ✅ CI

📋 Key Features Automated
✅ Bond/Swap/Option order entry (BUY/SELL)
✅ Form validation (negative scenarios)
✅ Order lifecycle (NEW→ROUTED→FILLED)
✅ Blotter monitoring + status updates
✅ Cross-browser (Chrome/Firefox/Safari)
✅ API contract testing
✅ CI/CD pipeline
🛠️ Tech Stack
Frontend: HTML/JS + http-server
Backend: FastAPI + SQLAlchemy + SQLite
Tests: Playwright (TypeScript) + YAML data
CI: GitHub Actions
🎯 Interview Talking Points
"Built a mini-OMS with trader UI calling FastAPI REST endpoints. Orders persist to SQLite with status transitions mimicking real trading workflows (Sophis/Murex style). Automated 100% E2E with Playwright across 3 browsers, data-driven via YAML. CI spins up both servers and runs full regression suite."

📁 Folder Structure
├── ui-mock/           # Static HTML (order-ticket.html, blotter.html)
├── trading-api-python/ # FastAPI backend + SQLite
├── tests/             # Playwright specs (UI + E2E + API)
├── src/pages/         # Page Objects (TypeScript)
├── tests/data/        # YAML test scenarios
└── .github/workflows/ # CI pipeline
Author: Farhod Elbekov
QA Automation | Playwright | FastAPI | Trading Systems


### 2. Commit and push README

```powershell
cd D:\QA\trading_automation_fix\Trading-automation_TS_PW_CI
git add README.md
git commit -m "Add comprehensive README with architecture, run instructions, interview points"
git push
3. GitHub Repository Description
Go to: https://github.com/Farhod75/Trading-automation_TS_PW_CI
Click ⚙️ Settings (top right of repo)
Scroll to Repository name section
Description field → paste:
End-to-end Playwright automation for mock OMS (FastAPI backend + trader UI + cross-browser tests + GitHub CI)