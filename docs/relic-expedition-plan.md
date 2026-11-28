# Kế hoạch cải thiện Relic Expedition

1. Dùng chung một luồng bắt đầu ván cho truyện mẫu và truyện do AI sinh. Chặn yêu cầu tạo truyện trùng ngay khi người chơi bấm Start.
2. Gắn số vòng và lịch sử lựa chọn với truyện đang chơi. Lưu tiến trình theo tab, khôi phục khi tải lại và cho phép chơi lại truyện vừa thua.
3. Thêm truyện mẫu hai vòng bằng tiếng Anh và tiếng Việt theo ngôn ngữ nội dung người chơi đã chọn. Nối truyện mẫu vào màn hình thiết lập hiện tại.
4. Hiển thị hệ quả và hành trang thực tế ở màn thắng. Sửa phím chọn đáp án để mỗi lần nhấn tương ứng với một quyết định.
5. Chạy lint, type-check và build. Kiểm tra các tình huống trong [đặc tả](./relic-expedition-spec.md) bằng truyện mẫu và phản hồi API giả lập.
