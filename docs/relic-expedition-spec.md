# Đặc tả trải nghiệm Relic Expedition

| Tình huống | Điều kiện nghiệm thu |
| --- | --- |
| Tạo truyện bằng AI | Với phiên hợp lệ, hai lần kích hoạt Start liên tiếp chỉ khởi tạo một yêu cầu tạo truyện. Khóa thao tác bắt đầu trong khi chờ. Nếu yêu cầu lỗi, người chơi có thể thử lại. |
| Chơi thử | Khi chưa nhập API key, người chơi vẫn có thể mở truyện mẫu gồm hai vòng, mỗi vòng có hai lựa chọn và đúng một đáp án đúng. Dùng ngôn ngữ nội dung đã chọn. Chơi thử dùng cùng màn chơi và luật thắng thua với truyện AI. |
| Tải lại trang | Sau khi truyện đã sẵn sàng, tải lại trong cùng tab khôi phục đúng truyện, vòng, lịch sử và trạng thái đang chơi, thắng hay thua. Số vòng hiển thị và điều kiện thắng lấy từ truyện đang chơi. |
| Dữ liệu lưu | Bản lưu trong sessionStorage có phiên bản, chỉ chứa dữ liệu ván chơi. Bản lưu hỏng hoặc khác phiên bản đưa người chơi về thiết lập. Khi trình duyệt chặn lưu trữ, ván hiện tại vẫn chơi được. |
| Chơi lại | Sau khi thua, người chơi có thể chơi lại cùng truyện từ vòng một với lịch sử trống hoặc chọn ván mới để quay về thiết lập. Chơi thử, khôi phục và chơi lại đều dùng dữ liệu cục bộ. Chọn ván mới xóa tiến trình đã lưu. |
| Thắng | Màn kết dùng consequence và finalItems của lựa chọn cuối, kể cả khi danh sách vật phẩm rỗng. Mục tiêu là Jade Compass. Tổng vòng phản ánh độ dài truyện đã hoàn thành. |
| Bàn phím | Phím số hàng trên và bàn phím số chọn đáp án đang hiển thị. Sự kiện lặp do giữ phím, tổ hợp Ctrl/Alt/Meta/Shift và thao tác nhập văn bản không được chọn đáp án. Giữ Enter hoặc Space trên thẻ lựa chọn cũng chỉ quyết định một lần. |
