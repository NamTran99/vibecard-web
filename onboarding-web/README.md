# onboarding-web — VibeCard Conversational Onboarding Flow (Mobbin Duolingo 24-Screen Architecture)

Bộ giao diện Mobile Web Onboarding 16 bước (24 trạng thái tương tác) cho ứng dụng **MindCard / VibeCard**, được thiết kế dựa trên cấu trúc tâm lý học hành vi của [Duolingo iOS Onboarding Flow trên Mobbin](https://mobbin.com/flows/7d7aacbe-213b-471e-8b1f-b5b7087bcb65) và tích hợp sâu toàn bộ hệ sinh thái tính năng của VibeCard (8 ngôn ngữ mục tiêu, Bản đồ cốt truyện 4 chương & Tô màu nhân vật, Tạo thẻ AI từ OCR/Audio/Story, Phòng thu phát âm IPA Dual-Engine & SRS Leitner).

## Cách chạy thử nghiệm

```bash
# Mở trực tiếp trên trình duyệt
open onboarding-web/index.html

# Hoặc chạy qua HTTP Server tại thư mục gốc của workspace (để load chung kho assets/)
python3 -m http.server 8080
# Truy cập: http://localhost:8080/onboarding-web/
```
