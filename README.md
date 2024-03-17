# 231MI5701_03
# Nhóm có đính kèm thư mục collection dữ liệu đầu vào cho products, types, subtype, colors, provinces, districts, wards
# Mọi người có thể import nó vào mongodb sau khi đã chạy trang chủ. Tên collection đúng như tên file.
# B1: cd client => ng serve
# B2: cd server => npm start
# B3: sau khi đã chạy được client, server, mongodb sẽ tạo những collection rỗng, mọi người có thể thêm vào dữ liệu đầu vào.
# Đồ án của nhóm đạt được như sau:
# 7.1. Kết quả đạt được
# 7.1.1 Về phần khách hàng tại website
# Qua quá trình làm việc, nhóm đã thực hiện được cơ bản một số chức năng của một website thương mại điện tử.
# Về phía người dùng, khách hàng có thể xem sản phẩm, điều chỉnh màu sắc, lựa chọn kích thước và thêm sản phẩm vào giỏ hàng, mua hàng tiến hành thanh toán.  
# Tại giao diện trang chính, sản phẩm đã được “render” từ dữ liệu bên dưới database, màu sắc, kích thước được xử lý phù hợp với từng sản phẩm, với từng thao tác của người dùng.
# Phần sub-menu đã được render dữ liệu chính từ database. Phần search nhóm cũng đã hoàn thiện live search, lưu dữ liệu search và thực hiện “Binding trực tiếp” ra giao diện màn hình.
# Phần sort nhóm cũng đã hoàn chỉnh tương đối ổn định, đáp ứng nhu cầu lọc thông tin sản phẩm như màu, size, giá. Phần phân loại sản phẩm khi click vào sub-menu cũng đã được hoàn thiện.
# Phần quản lý tài khoản, người dùng đăng ký tài khoản và sẽ có gmail xác thực gửi về, người dùng đã có thể thực hiện tương đối nhiều chức năng quản lý như cập nhật thông tin tài khoản, cập nhật mật khẩu. 
# Về phần quản lý địa chỉ, đơn hàng, theo dõi đơn hàng, các tính năng, giao diện xem, thêm sửa xóa đã hoàn thiện.
# 7.1.2. Về phần quản trị
# Nhóm đã thực hiện tương đối chức năng phân quyền cho nhà quản trị. Về phần chỉ có tài khoản là quản trị viên mới được tiếp cận đến giao diện quản trị, nhóm đang tiếp tục xây dựng hoàn thiện.
# Nhà quản trị đã có thể thực hiện thêm sản phẩm, thêm chiến dịch cho chính website của mình.
# Về phần sản phẩm, nhà quản trị có thể xóa sản phẩm. Sản phẩm đã được xóa sẽ không hiển thị lên trên giao diện homepage. Xóa ở đây là nhóm cập nhật trạng thái cho sản phẩm “is_delete:false”.
# Đối với quản lý đơn hàng, nhà quản trị có thể xem các đơn hàng đã được đặt.
# Chỉ có Super Admin với “role:2” mới được xem thống kê( Chức năng đang hoàn thiện). Thống kê hiện tại nhóm đã làm được 2 biểu đồ tương đối ổn định, lấy dữ liệu trực tiếp từ database.

   

    
