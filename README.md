# ☕Coffee-shop-self-service-ordering
Coffee shop self-service ordering system development.
# ☕ 手機專用·無印風咖啡點餐系統 (MUJI Style Coffee Ordering System)

這是一款專為行動裝置（手機端）原生 Web 設計的極簡無印良品（MUJI）風格咖啡點餐系統。後端採用高效率的 FastAPI 搭配 SQLAlchemy 2.0 與 SQLite，前端則堅持使用純粹的 HTML5、CSS3 與 Vanilla JavaScript (原生 JS)，完美實作流暢的行動端 UX 互動體驗。

---

## 🎨 無印風行動端設計規範

### 1. 色彩計畫 (Color Palette)
* **畫布背景色**：暖米白 (`#F7F5F0`) —— 營造溫和柔軟的再生紙質感。
* **主體文字色**：深炭灰 (`#333333`) —— 比純黑更自然溫柔的視覺體驗。
* **次要輔助色**：清透灰 (`#7F7F7F`) —— 用於商品規格、細項或時間標記。
* **線條與邊框**：細線淺褐灰 (`#E5E0D8`) —— 取代粗重邊框，保持畫面空氣感。
* **無印經典紅**：胭脂紅 (`#8A1C14`) —— 極度克制使用，僅用於選中狀態、進度關鍵點亮與結帳按鈕。

### 2. 行動端 UX 規格
* **橫向滑動導覽**：頂部導覽分類支援手指左右橫向滑動（Overflow-X Scroll），並隱藏滾動條。
* **極簡卡片**：商品卡片採用完全平鋪設計（Flat Design），無強烈陰影，圓角僅 2px。
* **常駐購物車**：畫面底部常駐滿版矩形「懸浮購物車條」，點擊時自底部平滑滑出購物車抽屜。
* **Bottom Sheet**：甜度冰塊客製化彈窗改為手機常見的「底部分頁選單」，符合單手大拇指操作習慣。
* **無障礙熱區**：所有點擊熱區（按鈕、選項）高度與寬度均 $\ge 48\text{px}$，方便單手大拇指操作。

---

## 📂 專案目錄結構

```text
coffee-order-system/
├── backend/
│   ├── requirements.txt
│   ├── main.py
│   └── app/
│       ├── config.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── crud.py
│       └── routers/
│           ├── products.py
│           ├── orders.py
│           └── admin.py
└── frontend/
    ├── index.html
    ├── order-status.html
    ├── admin.html
    ├── css/
    │   └── style.css
    └── js/
        ├── config.js
        ├── app.js
        └── admin.js
```
---
# 🛠️ 技術棧與快速啟動指南 (Tech Stack & Quick Start Guide)

本文件專門提供「手機專用·無印風咖啡點餐系統」的技術細節架構與快速部署啟動說明。

---

## 🛠️ 技術棧全景 (Tech Stack Lifecycle)

本專案採用前後端分離架構，前端專注於輕量、流暢的行動端原生互動，後端則提供高效、穩定的非同步 API 服務。

### 1. 後端架構 (Backend)
* **核心框架**：`FastAPI (v0.110.0)` —— 基於 Starlette 與 Pydantic，具備極高運行效能與自動產生 OpenAPI 文件特性。
* **資料驗證**：`Pydantic (v2.6.3)` —— 嚴格執行前端傳入的訂單與商品資料型態檢查。
* **資料庫 ORM**：`SQLAlchemy (v2.0.28)` —— 採用現代化 2.0 語法，實作 `Product`、`Order` 與 `OrderItem` 的關聯式對應。
* **資料庫引擎**：`SQLite` —— 輕量級內嵌式資料庫，並透過 SQLAlchemy 事件監聽強制啟用原生 `PRAGMA foreign_keys=ON;` 外鍵約束，確保訂單明細級聯刪除（Cascade Delete）的安全。
* **伺服器網關**：`Uvicorn (v0.28.0)` —— 高性能的 ASGI Web 伺服器。

### 2. 前端架構 (Frontend)
* **渲染核心**：`HTML5` —— 拒絕肥大的前端框架，完全利用瀏覽器原生 `<template>` 標籤實作動態商品的零延遲複製與注入（DOM Manipulation）。
* **視覺樣式**：`CSS3` —— 採用行動端單欄流式佈局（Flexbox & Grid）。嚴格遵守無印良品極簡視覺規範，點擊熱區均 $\ge 48\text{px}$。
* **資料交互**：`Vanilla JavaScript` —— 純原生 JS 實作，利用 `Fetch API` 進行非同步 HTTP 請求，並透過 `LocalStorage` 管理本機購物車快取。

---

## 🚀 快速啟動四步驟 (Quick Start Steps)

請確保您的電腦已安裝 `Python 3.10` 或更高版本，並建議使用 `VS Code` 編輯器。

### 📌 步驟 1：克隆與配置專案原始碼
1. 開啟 **VS Code**，點擊左上角 `File` -> `Open Folder`。
2. 選擇您桌面上的 `coffee-order-system` 專案資料夾。
3. 確保左側檔案總管已將前述產出的後端與前端程式碼複製至對應檔案中。

### 📌 步驟 2：後端虛擬環境配置與套件安裝
在 VS Code 中打開終端機（快捷鍵：`Ctrl + ~`），並依序執行以下指令：

```bash
# 1. 切換至後端目錄
cd backend

# 2. 建立 Python 獨立虛擬環境
python -m venv venv

# 3. 啟用虛擬環境
# (Windows 系統)
.\venv\Scripts\activate
# (Mac / Linux 系統)
source venv/bin/activate

# 4. 升級 pip 並安裝系統依賴套件
pip install --upgrade pip
pip install -r requirements.txt
