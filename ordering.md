你是一位頂尖的全端架構師，專精於 FastAPI 後端開發與「手機行動端」原生 Web 前端（純 HTML5, CSS3, Vanilla JavaScript）的視覺與互動設計。
現在請為一個「手機專用·無印風咖啡點餐系統」建立完整、可直接執行、不包含任何省略（嚴禁使用 # TODO、// TODO、pass 或 ...）的全端服務。

請依據以下設計規格與目錄結構，一次性完整輸出所有核心檔案的內容：

---

### 1. 專案技術棧與無印風行動端設計規範
- 【後端】：Python 3.10+, FastAPI, SQLAlchemy 2.0+, SQLite (啟用外鍵), Pydantic v2
- 【前端】：純 HTML5（善用 <template> 標籤）、CSS3（手機端單欄流式佈局）、原生 JavaScript（Fetch API, LocalStorage）
- 【無印良品（MUJI）風格色彩計畫】：
  - 畫布背景色：暖米白 (`#F7F5F0`)，營造溫和柔軟的再生紙質感。
  - 主體文字色：深炭灰 (`#333333`)，比純黑更自然溫柔。
  - 次要輔助色：清透灰 (`#7F7F7F`)，用於規格或時間。
  - 線條與邊框：細線淺褐灰 (`#E5E0D8`)，取代粗重邊框。
  - 無印經典紅：胭脂紅 (`#8A1C14`)，極度克制使用，僅用於選中狀態與結帳按鈕。
- 【行動端 UX 規範】：
  - 頂部導覽分類支援手指左右橫向滑動（Overflow-X Scroll），並隱藏滾動條。
  - 商品卡片採用完全平鋪設計（Flat Design），無強烈陰影，圓角僅 2px。
  - 畫面底部常駐滿版矩形「懸浮購物車條」，點擊時自底部滑出購物車抽屜。
  - 甜度冰塊客製化彈窗改為手機常見的「底部分頁選單（Bottom Sheet）」。
  - 所有點擊熱區（按鈕、選項）高度與寬度必須大於 48px，方便大拇指單手操作。

---

### 2. 完整專案目錄結構
你必須輸出以下結構中的每一個檔案，並在程式碼區塊前明確標註檔案路徑：

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

---

### 3. 後端完整實作規格 (FastAPI + SQLAlchemy + SQLite)

#### 📄 檔案 1：`backend/requirements.txt`
列出：fastapi, uvicorn, sqlalchemy, pydantic。固定安全版本。

#### 📄 檔案 2：`backend/app/config.py`
設定 `DATABASE_URL = "sqlite:///./coffee_shop.db"` 與 CORS `allow_origins=["*"]`。

#### 📄 檔案 3：`backend/app/database.py`
建立 SQLAlchemy Engine（針對 SQLite 設定 check_same_thread: False）。利用事件監聽自動執行 `PRAGMA foreign_keys=ON;`。實作 `get_db()` 依賴項，使用 `yield` 並確保在最後執行 `db.close()`。

#### 📄 檔案 4：`backend/app/models.py`
定義三個 ORM 模型及其關聯性（relationships）：
1. `Product`：id (PK), name, price, category, is_available (Default=True)
2. `Order`：id (PK), total_price, status (Default="pending"), created_at (預設伺服器時間)。與 OrderItem 建立 relationship 並設定 cascade="all, delete-orphan"。
3. `OrderItem`：id (PK), order_id (FK), product_id (FK), quantity, custom_notes (Nullable)。與 Order, Product 建立關聯。

#### 📄 檔案 5：`backend/app/schemas.py`
定義 Pydantic v2 模型（啟用 `from_attributes = True`）：
`ProductResponse`, `OrderItemCreate`, `OrderItemResponse`, `OrderCreate`, `OrderResponse`, `OrderStatusUpdate`。

#### 📄 檔案 6：`backend/app/crud.py`
實作完整資料庫函式（包含完整的錯誤處理與交易提交/回滾）：
- `get_active_products(db)`
- `seed_initial_products(db)`：若表為空，自動寫入：美式咖啡(80)、經典拿鐵(100)、黑糖鮮奶茶(90)、四季春青茶(60)、法式可麗露(75)。
- `create_order(db, order_in)`：驗證商品存在、計算總價、寫入主表、寫入明細。
- `get_order_by_id(db, order_id)`
- `get_all_orders_desc(db)`：依時間由新到舊排序並加載明細。
- `update_order_status(db, order_id, status)`

#### 📄 檔案 7 到 9：`backend/app/routers/`
- `products.py`：`GET /api/products`
- `orders.py`：`POST /api/orders` (回傳 201), `GET /api/orders/{order_id}`
- `admin.py`：`GET /api/admin/orders`, `PATCH /api/admin/orders/{order_id}/status`

#### 📄 檔案 10：`backend/main.py`
初始化 FastAPI，自動觸發建表與商品 init_db 注入，配置 CORS 跨域放行，Include 所有路由模組並加上 `/api` 前綴。

---

### 4. 前端「手機行動版·無印風」純 HTML5 / CSS3 / Vanilla JS 實作規格

#### 📄 檔案 11：`frontend/js/config.js`
宣告全域變數 `const API_BASE_URL = "http://127.0.0.1:8000/api";`。

#### 📄 檔案 12：`frontend/css/style.css`
編寫符合「無印良品極簡風格」的手機端樣式表（嚴禁任何省略）：
- 全域設定：最大寬度鎖定 600px 居中。背景色為暖米白 (#F7F5F0)，文字為深炭灰 (#333333)，使用簡約無襯線字體，並保留優雅的空氣感留白。
- 分類導覽列：客製化橫向滾動且不顯示滾動條。選中項目時，文字顏色變為深炭灰，且底部帶有一條 2px 的無印經典紅 (#8A1C14) 短實線。
- 商品卡片：單欄垂直排列。底色純白 (#FFF)，四周帶有 1px 的細線淺褐灰 (#E5E0D8) 邊框，無任何突兀陰影。右側的「＋」點餐按鈕放大至 48px，為極簡的細線方框設計。
- 底部懸浮條與抽屜：底色為穩重的深炭灰 (#333)，文字與結帳按鈕為純白。當購物車不為空時，結帳按鈕轉為無印經典紅 (#8A1C14) 背景。
- Bottom Sheet（客製化彈窗）：預設隱藏於螢幕下方，開啟時平滑滑起。內部排版如實體無印說明書般簡潔俐落，選項方格邊框細緻。

#### 📄 檔案 13：`frontend/index.html`
手機點餐首頁。包含：
1. 頂部橫向滑動分類列（全部、咖啡、茶飲、點心）。
2. 單欄垂直滾動的商品列表區（id="product-list"）。
3. 底部固定懸浮購物車條（顯示累計杯數、總金額、與「看明細」按鈕）。
4. 隱藏的底部分頁抽屜（id="cart-drawer"），開啟時顯示購物車細項與「確認結帳」按鈕。
5. 手機專用客製化 Bottom Sheet（id="custom-modal"），供選擇冰塊、甜度與備註。
6. 包含 `<template id="product-template">` 用於動態插入商品。

#### 📄 檔案 14：`frontend/js/app.js`
控制 `index.html` 的手機端核心 JavaScript 邏輯：
1. 載入時 `fetch()` 商品資料並動態複製 template 渲染。
2. 實作手指點選分類時的過濾切換。
3. 點擊商品「＋」按鈕時，由螢幕底部滑出客製化選單（Bottom Sheet），點擊確認後存入 `localStorage` 的 `coffee_cart`。
4. 實作購物車重新渲染邏輯：同步更新「底部懸浮條」的杯數與金額。點擊懸浮條時切換 `cart-drawer` 的顯示狀態。
5. 結帳邏輯：點擊結帳按鈕，將購物車發送 `POST /api/orders`。成功後清空 `localStorage` 並使用 `window.location.href` 帶 `order_id` 跳轉。

#### 📄 檔案 15：`frontend/order-status.html`
手機版訂單進度追蹤頁。
1. 頂部大字顯示訂單編號，中間設計適合手機直式螢幕觀看的**無印風垂直進度條（Vertical Steps）**，線條極細俐落。
2. 呼叫 `GET /api/orders/{order_id}` 渲染訂單細項。
3. 使用 `setInterval` 實作每 5 秒自動輪詢。當狀態變為 `ready`（請取餐）時，進度點亮為經典紅，並執行 `clearInterval`。

#### 📄 檔案 16：`frontend/admin.html`
手機響應式店家管理看板。
1. 採用頂部 Tab（未處理、製作中、已完成）。
2. 訂單清單採單欄米色卡片式排版。每張卡片包含大字訂單號、客製化粗體紅字標註（如：**去冰無糖**）。
3. 卡片底部提供滿版、高度 50px 的極簡單色狀態變更按鈕（如「開始製作」、「通知取餐」）。

#### 📄 檔案 17：`frontend/js/admin.js`
控制 `admin.html` 的邏輯：
1. 定期（每 10 秒）`fetch()` 最新訂單數據並刷新手機卡片看板。
2. 點擊狀態按鈕時，發送 `PATCH /api/admin/orders/{order_id}/status` 變更狀態。
3. 新訂單提示：當輪詢發現有新 `pending` 訂單，觸發 `new Audio()` 播放提示音。

---

### ⚠️ 重要輸出原則
1. 拒絕程式碼偷懶：不論是後端的資料庫處理，還是前端手機版的 CSS 樣式、底部分頁滑動 JS 邏輯，**所有程式碼必須 100% 完整撰寫**。
2. 嚴格禁止省略：不允許出現任何中斷、省略或提示使用者「自行補充」的縮寫形式（如 // ... ）。
3. 交付物標準：產出的代碼必須是純淨、無語法錯誤、開箱即用（Copy-and-Paste Ready）的完整程式碼區塊。
