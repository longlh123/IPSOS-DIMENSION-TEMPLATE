# IPSOS DIMENSION TEMPLATE 1

Tổng hợp các template HTML dùng trong hệ thống khảo sát Ipsos Dimensions (Confirmit/Forsta).  
Mỗi template là một `mrSubTemplate` được nhúng vào file layout chính (`index.html`).

---

## Cấu trúc thư mục

```
├── css/
│   └── styles.css              # Style chung cho toàn bộ survey
├── htmls/
│   ├── index.html              # Layout chính (container, header, footer, progressbar)
│   ├── index_for_manulife.html # Layout chính cho dự án Manulife
│   ├── error.html              # Trang lỗi
│   └── ...                     # Các sub-template (xem bên dưới)
├── js/                         # Script cho từng template
├── js_class/                   # Các class JS dùng chung (Conjoint, DropDownList, RangeSlider)
└── VisualAssets.zip            # Tài nguyên hình ảnh
```

---

## Danh sách Templates

### Information

| Template | File HTML | File JS | Mô tả |
|----------|-----------|---------|-------|
| Information Basic | [InformationBasic.html](htmls/InformationBasic.html) | _(không có)_ | Hiển thị nội dung thông tin / câu hỏi dạng text thuần, không có control nhập liệu |
| Information Basic (MGID) | [InformationBasicForMGID.html](htmls/InformationBasicForMGID.html) | `MGID.js` | Biến thể dành cho tích hợp MGID ad tracking |

---

### Categorical (Câu hỏi lựa chọn)

| Template | File HTML | File JS | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Categorical Default Icons | [Categorical_DefaultIcons.html](htmls/Categorical_DefaultIcons.html) | [Categorical.js](js/Categorical.js) | `categorical_defaulticons` | Câu hỏi chọn với icon mặc định (radio/checkbox dạng card) |
| Categorical Imagine Icons | [Categorical_ImagineIcons.html](htmls/Categorical_ImagineIcons.html) | [Categorical.js](js/Categorical.js) | `categorical_imagineicons` | Câu hỏi chọn với icon hình ảnh (dạng Imagine) |
| Categorical Horizontal | [Categorical_Horizontal.html](htmls/Categorical_Horizontal.html) | [Categorical.js](js/Categorical.js) | `categorical_horizontal` | Câu hỏi chọn bố cục nằm ngang |
| Categorical NPS | [Categorical_NPS.html](htmls/Categorical_NPS.html) | [Categorical_NPS.js](js/Categorical_NPS.js) | `categorical_nps` | Câu hỏi NPS (Net Promoter Score) dạng slider 0–10 |

---

### Grid (Câu hỏi dạng bảng)

| Template | File HTML | File JS | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Grid Categorical Default Icons | [Grid_Categorical_DefaultIcons.html](htmls/Grid_Categorical_DefaultIcons.html) | [Grid_Categorical_DefaultIcons.js](js/Grid_Categorical_DefaultIcons.js) | `grid_categorical_defaulticons` | Bảng câu hỏi lựa chọn với icon mặc định |
| Grid Categorical Scales | [Grid_Categorical_Scales.html](htmls/Grid_Categorical_Scales.html) | [Grid_Categorical_Scales.js](js/Grid_Categorical_Scales.js) | `grid_categorical_scales` | Bảng câu hỏi dạng scale/rating |
| Grid Open End Basic | [Grid_OpenEndBasic.html](htmls/Grid_OpenEndBasic.html) | [Grid_OpenEndBasic.js](js/Grid_OpenEndBasic.js) | `grid_openend_basic` | Bảng câu hỏi nhập text tự do theo từng dòng |

---

### Open End (Câu hỏi mở)

| Template | File HTML | File JS | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Open End Basic | [OpenEndBasic.html](htmls/OpenEndBasic.html) | [OpenEndBasic.js](js/OpenEndBasic.js) | `openend_basic` | Câu hỏi nhập text tự do (textarea) |

---

### Date / Time (Ngày & Giờ)

| Template | File HTML | File JS | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Date Basic | [DateBasic.html](htmls/DateBasic.html) | [DateBasic.js](js/DateBasic.js) | `datebasic` | Câu hỏi nhập ngày tháng với date picker |
| Time Basic | [TimeBasic.html](htmls/TimeBasic.html) | [TimeBasic.js](js/TimeBasic.js) | `timebasic` | Câu hỏi nhập giờ với time picker |

---

### Dropdown

| Template | File HTML | File JS (class) | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Dropdown List | [DropdownList.html](htmls/DropdownList.html) | [js_class/DropDownList.js](js_class/DropDownList.js) | `dropdown-list` | Câu hỏi chọn dạng dropdown searchable |

---

### Capture (Chụp ảnh)

| Template | File HTML | File JS | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Capture Basic | [CaptureBasic.html](htmls/CaptureBasic.html) | [CaptureBasic.js](js/CaptureBasic.js) | `capturebasic` | Upload ảnh qua Cloudinary (dùng `jquery.fileupload` + `jquery.cloudinary`) |

---

### Video

| Template | File HTML | File JS | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Video Basic | [VideoBasic.html](htmls/VideoBasic.html) | _(inline script)_ | `videobasic` | Phát video YouTube qua YouTube IFrame API, tự động block nút Next cho đến khi video kết thúc |

---

### Shelf (Kệ hàng ảo)

| Template | File HTML | File JS | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Shelf | [Shelf.html](htmls/Shelf.html) | [Shelf.js](js/Shelf.js) | `shelf-container` | Kệ hàng ảo vẽ trên Canvas, có zoom in/out và giỏ hàng (VND) |
| Refrigerator Shelf | [RefrigeShelf.html](htmls/RefrigeShelf.html) | [RefrigeShelf.js](js/RefrigeShelf.js) | `shelf-container` | Biến thể kệ tủ lạnh — có loading screen và modal xem chi tiết sản phẩm trước khi chọn |

---

### Conjoint

| Template | File HTML | File JS (class) | Class CSS | Mô tả |
|----------|-----------|---------|-----------|-------|
| Conjoint | [Conjoint.html](htmls/Conjoint.html) | [js_class/Conjoints.js](js_class/Conjoints.js) | `conjoint-container` | Câu hỏi Conjoint (choice-based) |

---

## Layout & Script dùng chung

| File | Mô tả |
|------|-------|
| [js/default.js](js/default.js) | Khởi tạo mặc định, xử lý navigation |
| [js/functions.js](js/functions.js) | Các hàm utility dùng chung |
| [js/jquery_functions.js](js/jquery_functions.js) | Helper jQuery |
| [js/ImageModal.js](js/ImageModal.js) | Modal xem ảnh phóng to |
| [js/Slider.js](js/Slider.js) | Slider component dùng chung |
| [js/Duel.js](js/Duel.js) | Duel/comparison question |
| [js_class/RangeSlider.js](js_class/RangeSlider.js) | Range slider class |
| [css/styles.css](css/styles.css) | Style sheet toàn cục |

---

## Ghi chú

- Tất cả assets (CSS, JS, images) được host tại:  
  `https://images3.ipsosinteractive.com/ABC_VIETNAM_10072020/source_ipsos/`
- File layout chính là `index.html` — các sub-template được Dimension tự inject vào `<mrData/>`.
- File `index_for_manulife.html` là bản layout tùy chỉnh riêng cho client Manulife.
