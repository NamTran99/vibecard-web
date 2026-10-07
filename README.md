# 🌿 MindCard Web — Material Design 3 (Dark Olive Green)

> **MindCard & VibeCard Web Application**  
> Giao diện học tiếng Anh qua Flashcard thông minh, tích hợp trợ lý AI Lumi, từ điển song ngữ ngữ cảnh, và hệ thống điều hướng 4 chủ đề chuẩn phong cách **Material You / M3-07 Dark Olive Green** kết hợp biểu tượng **Wabi-sabi Doodle**.

---

## 📱 Tính Năng Nổi Bật (Core Features)

1. **Thanh Điều Hướng 4 Chủ Đề (Solid M3 Capsule Navigation):**
   - **Khám phá (`Tab 0`):** La bàn M3 Primary (`#D4EE7F` / `#3C4D00`). Màn hình chính với trợ lý Lumi, câu chuyện khám phá nông trại đêm Ghibli, lộ trình bài học.
   - **Tạo (`Tab 1`):** Dấu cộng M3 Tertiary Mint (`#BDECE1` / `#214E46`). Tạo bộ thẻ bằng AI, thủ công, quét ảnh (OCR) hoặc giọng nói.
   - **Thư viện (`Tab 2`):** Giá sách M3 Secondary Sage (`#E0E6C3` / `#444930`). Bộ sưu tập flashcard cá nhân, bộ lọc danh mục và trạng thái trống (empty state).
   - **Profile (`Tab 3`):** Tài khoản M3 Amber Glow (`#FDE68A` / `#3D2E0B`). Thông tin học viên, chuỗi ngày học Streak (🔥), số từ đã thuộc và cài đặt.
   - **Nút Active Tròn Trượt Tự Động:** Đĩa tròn bo cong nổi `rounded-full` trượt mượt mà bằng CSS Transform vật lý, tự động đổi màu theo từng token M3.
   - **Tối Giản Tuyệt Đối:** Không có chữ thừa, tối ưu không gian hiển thị cho thiết bị di động.

2. **Hệ Thống Icon Doodle Wabi-sabi:**
   - Bộ icon vẽ tay không góc cạnh cơ học, ứng dụng đường cong Bézier `Q` và `C` tự nhiên.
   - Bo tròn hoàn hảo mọi điểm nối (`stroke-linecap="round"`, `stroke-linejoin="round"`).

3. **Từ Điển Đa Tầng Thông Minh (Omnibar Dictionary):**
   - Tra nghĩa từ vựng chuyên sâu (định nghĩa CEFR B1–C2, phiên âm IPA US/UK, ví dụ thực tế, từ đồng nghĩa/trái nghĩa, collocations).
   - Tích hợp phát âm audio chuẩn Web Audio API.

4. **Hệ Thống Gamification & Ghibli Warmth:**
   - Linh vật chú cáo Lumi hướng dẫn học tập theo ngữ cảnh.
   - Hiệu ứng pháo hoa ăn mừng khi hoàn thành mục tiêu học tập (Canvas Confetti).

---

## 🎨 Bảng Mã Màu Material Design 3 (M3-07 Dark Olive Green)

| M3 Token | Mã HEX | Vai trò ngữ nghĩa |
| :--- | :--- | :--- |
| `primary` | `#B8D166` | Màu nhấn chính, nút CTA, thanh tiến độ |
| `primaryContainer` | `#3C4D00` | Nền viên thuốc Active Tab Khám phá |
| `onPrimaryContainer` | `#D4EE7F` | Icon và nhãn tab Khám phá |
| `tertiaryContainer` | `#214E46` | Nền viên thuốc Active Tab Tạo |
| `onTertiaryContainer` | `#BDECE1` | Icon Tab Tạo |
| `secondaryContainer` | `#444930` | Nền viên thuốc Active Tab Thư viện |
| `onSecondaryContainer` | `#E0E6C3` | Icon Tab Thư viện |
| `amberContainer` | `#3D2E0B` | Nền viên thuốc Active Tab Profile & Điểm XP |
| `amberText` | `#FDE68A` | Icon Tab Profile & Huy hiệu Lumi |
| `surfaceContainerLow`| `#1B1C17` | Nền vỏ thanh Bottom Nav & Khay chức năng |
| `surfaceDim` | `#0D0E0B` | Nền sâu nhất toàn màn hình ứng dụng |
| `outlineVariant` | `#46483C` | Viền thanh nav và viền các card nổi |

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Chạy trực tiếp (Không cần cài đặt)
Mở trực tiếp file `index.html` trong bất kỳ trình duyệt hiện đại nào (Chrome, Safari, Edge, Firefox):
```bash
open index.html
```

### Cách 2: Chạy với Vite Dev Server
```bash
npm install
npm run dev
```

### Cách 3: Chạy với máy chủ tĩnh cục bộ (Serve / Python)
```bash
# Sử dụng npx serve:
npm run serve

# Hoặc dùng Python built-in server:
python3 -m http.server 3000
```
Sau đó truy cập: `http://localhost:3000`

---

## 📂 Cấu Trúc Thư Mục

```
mindcard-web/
├── index.html              # Trang chủ ứng dụng Web Prototype hoàn chỉnh
├── explore_prototype.html  # Bản sao độc lập tương thích URL cũ
├── package.json            # Cấu hình dự án npm & Vite
├── .gitignore              # Danh sách loại trừ Git
├── README.md               # Tài liệu hướng dẫn dự án
├── assets/
│   └── cards/              # Hình ảnh thẻ từ vựng, linh vật Lumi và cảnh đêm
├── data/
│   ├── topic_001.json      # Dữ liệu mẫu bộ bài từ vựng 1
│   └── topic_002.json      # Dữ liệu mẫu bộ bài từ vựng 2
├── icons/
│   ├── super_massive_icons_v3.html  # Kho 63 icon Doodle
│   ├── custom_3_icons.html          # Bộ icon tính năng tùy chỉnh
│   └── ic_nav_*.*                   # Các file Vector SVG/XML độc lập
└── web-onboarding-preview/ # Module giới thiệu onboarding web
```

---

## 👨‍💻 Tác giả & Bản quyền
- **Phát triển bởi:** Nam Tran
- **Giấy phép:** MIT License
