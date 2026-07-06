class DropDownList {
    constructor(question, selector, data = [], hiddenInitially = false, isMultiSelect = true) {
        this.html = {
            question: question,
            root: selector
        };

        if (hiddenInitially) {
            this.html.root.classList.add('hidden');
        }

        this.isMultiSelect = isMultiSelect;
        this.data = data; // danh sách option
        this.onSelectionChange = null; // callback khi selection thay đổi

        let preselected_array = [];
        let preselected = [];

        if(question.value.length > 0){
            preselected_array = question.value.split(',');

            preselected = this.data
                            .filter(item => preselected_array.includes(item.code))
                            .map(item => item.value);
        }

        // Nếu single-select, chỉ lấy item đầu tiên
        if (!this.isMultiSelect && preselected.length > 1) {
            preselected = [preselected[0]];
            preselected_array = [preselected_array[0]];
        }

        this.selected = new Set(preselected);
        this.catSelected = new Set(preselected_array);

        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.renderOptions(this.data);
        this.updateDisplay();
    }

    render() {
        const initialText = this.selected.size > 0 ? [...this.selected].join(', ') : "Select...";

        this.html.display = this.createElement(`
            <div class='dropdownlist-display'>${initialText}</div>
        `);

        this.html.options = this.createElement(`
            <div class='dropdownlist-options hidden'>
                <input type="text" class="dropdown-search" placeholder="Search..." />
                <div class="dropdown-items"></div>
            </div>
        `);

        this.html.root.appendChild(this.html.display);
        this.html.root.appendChild(this.html.options);

        this.html.search = this.html.options.querySelector('.dropdown-search');
        this.html.items = this.html.options.querySelector('.dropdown-items');
    }

    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }

    bindEvents() {
        // Toggle dropdown
        this.html.display.addEventListener('click', () => {
            this.html.options.classList.toggle('hidden');
        });

        // Search
        this.html.search.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = this.data.filter(item =>
                item.label.toLowerCase().includes(keyword)
            );
            this.renderOptions(filtered);
        });

        // Click outside
        document.addEventListener('click', (e) => {
            if (!this.html.root.contains(e.target)) {
                this.html.options.classList.add('hidden');
            }
        });
    }

    renderOptions(data) {
        this.html.items.innerHTML = "";

        data.forEach(item => {
            const inputType = this.isMultiSelect ? 'checkbox' : 'radio';
            const inputName = this.isMultiSelect ? '' : 'dropdown-radio';

            const option = this.createElement(`
                <div class="dropdown-item">
                    <input type="${inputType}" value="${item.value}" name="${inputName}" />
                    <span>${item.label}</span>
                </div>
            `);

            const input = option.querySelector('input');

            if(!input){
                console.error("Input not found", option);
                return;
            }

            // giữ trạng thái checked
            input.checked = this.selected.has(item.value);

            if(input.checked){
                option.classList.add('selected');
            }

            input.addEventListener('change', (e) => {
                e.stopPropagation();

                if (!this.isMultiSelect) {
                    // Single-select: clear all trước khi chọn mới
                    this.selected.clear();
                    this.catSelected.clear();
                    // Bỏ class selected từ tất cả options
                    this.html.items.querySelectorAll('.dropdown-item').forEach(opt => opt.classList.remove('selected'));
                }

                if (e.target.checked) {
                    this.selected.add(item.value);
                    this.catSelected.add(item.code);
                    option.classList.add('selected');
                } else {
                    this.selected.delete(item.value);
                    this.catSelected.delete(item.code);
                    option.classList.remove('selected');
                }

                console.log("Selected:", [...this.selected]);

                this.updateDisplay();
            });

            option.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    input.checked = !input.checked;

                    // trigger lại event
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            this.html.items.appendChild(option);
        });
    }

    updateDisplay() {
        const selectedLabels = this.data
            .filter(item => this.selected.has(item.value))
            .map(item => item.value);

        this.html.display.innerText = selectedLabels.length
            ? selectedLabels.join(', ')
            : "Select...";

        const selectedCategories = this.data
            .filter(item => this.selected.has(item.value))
            .map(item => item.code);

        this.html.question.innerText = selectedCategories.length ? selectedCategories.join(',') : "";

        // Gọi callback nếu có
        if (this.onSelectionChange) {
            this.onSelectionChange([...this.catSelected]);
        }
    }

    updateData(newData) {
        // Giữ lại selected items nếu chúng vẫn có trong newData
        let filteredSelected = [...this.selected].filter(value => newData.some(item => item.value === value));
        let filteredCatSelected = [...this.catSelected].filter(code => newData.some(item => item.code === code));

        // Nếu single-select, chỉ giữ lại item đầu tiên
        if (!this.isMultiSelect && filteredSelected.length > 1) {
            filteredSelected = [filteredSelected[0]];
            filteredCatSelected = [filteredCatSelected[0]];
        }

        this.selected = new Set(filteredSelected);
        this.catSelected = new Set(filteredCatSelected);
        this.data = newData;
        this.renderOptions(this.data);
        this.updateDisplay();
    }
}

document.addEventListener("DOMContentLoaded", async function(){

    const province_data = [
        { label: "Hồ Chí Minh", value: "Hồ Chí Minh", code: "_1"},
        { label: "Hà Nội", value: "Hà Nội", code: "_2"},
        { label: "Đà Nẵng", value: "Đà Nẵng", code: "_3"},
        { label: "Cần Thơ", value: "Cần Thơ", code: "_4"},
        { label: "Khánh Hòa", value: "Khánh Hòa", code: "_5"},
        { label: "Đồng Nai", value: "Đồng Nai", code: "_6"},
        { label: "Hải Phòng", value: "Hải Phòng", code: "_7"},
        { label: "Nghệ An", value: "Nghệ An", code: "_13"},
        { label: "Bắc Ninh", value: "Bắc Ninh", code: "_48"},
        { label: "Bình Dương", value: "Bình Dương", code: "_17"}
    ];

    const province_dropdown = new DropDownList(
        document.getElementById("_Q0"),
        document.getElementsByClassName("dropdown-list")[0],
        province_data,
        hiddenInitially = false,
        isMultiSelect = false
    );

    const district_data = [
        { label: "Quận 01", value: "Quận 01", code: "_101", province_code: "_1"},
        { label: "Quận 03", value: "Quận 03", code: "_103", province_code: "_1"},
        { label: "Quận 04", value: "Quận 04", code: "_104", province_code: "_1"},
        { label: "Quận 05", value: "Quận 05", code: "_105", province_code: "_1"},
        { label: "Quận 06", value: "Quận 06", code: "_106", province_code: "_1"},
        { label: "Quận 07", value: "Quận 07", code: "_107", province_code: "_1"},
        { label: "Quận 08", value: "Quận 08", code: "_108", province_code: "_1"},
        { label: "Quận 10", value: "Quận 10", code: "_110", province_code: "_1"},
        { label: "Quận 11", value: "Quận 11", code: "_111", province_code: "_1"},
        { label: "Quận 12", value: "Quận 12", code: "_112", province_code: "_1"},
        { label: "TP. Thủ Đức", value: "TP. Thủ Đức", code: "_113", province_code: "_1"},
        { label: "Tân Phú", value: "Tân Phú", code: "_114", province_code: "_1"},
        { label: "Tân Bình", value: "Tân Bình", code: "_115", province_code: "_1"},
        { label: "Phú Nhuận", value: "Phú Nhuận", code: "_116", province_code: "_1"},
        { label: "Gò Vấp", value: "Gò Vấp", code: "_117", province_code: "_1"},
        { label: "Bình Thạnh", value: "Bình Thạnh", code: "_118", province_code: "_1"},
        { label: "Bình Tân", value: "Bình Tân", code: "_119", province_code: "_1"},
        { label: "Bình Chánh", value: "Bình Chánh", code: "_120", province_code: "_1"},
        { label: "Củ Chi", value: "Củ Chi", code: "_122", province_code: "_1"},
        { label: "Hóc Môn", value: "Hóc Môn", code: "_123", province_code: "_1"},
        { label: "Nhà Bè", value: "Nhà Bè", code: "_124", province_code: "_1"},
        { label: "Ba Đình", value: "Ba Đình", code: "_201", province_code: "_2"},
        { label: "Hoàn Kiếm", value: "Hoàn Kiếm", code: "_202", province_code: "_2"},
        { label: "Tây Hồ", value: "Tây Hồ", code: "_203", province_code: "_2"},
        { label: "Long Biên", value: "Long Biên", code: "_204", province_code: "_2"},
        { label: "Cầu Giấy", value: "Cầu Giấy", code: "_205", province_code: "_2"},
        { label: "Đống Đa", value: "Đống Đa", code: "_206", province_code: "_2"},
        { label: "Hai Bà Trưng", value: "Hai Bà Trưng", code: "_207", province_code: "_2"},
        { label: "Hoàng Mai", value: "Hoàng Mai", code: "_208", province_code: "_2"},
        { label: "Thanh Xuân", value: "Thanh Xuân", code: "_209", province_code: "_2"},
        { label: "Hà Đông", value: "Hà Đông", code: "_210", province_code: "_2"},
        { label: "Bắc Từ Liêm", value: "Bắc Từ Liêm", code: "_211", province_code: "_2"},
        { label: "Nam Từ Liêm", value: "Nam Từ Liêm", code: "_212", province_code: "_2"},
        { label: "Sơn Tây", value: "Sơn Tây", code: "_213", province_code: "_2"},
        { label: "Chương Mỹ", value: "Chương Mỹ", code: "_215", province_code: "_2"},
        { label: "Đan Phượng", value: "Đan Phượng", code: "_216", province_code: "_2"},
        { label: "Đông Anh", value: "Đông Anh", code: "_217", province_code: "_2"},
        { label: "Gia Lâm", value: "Gia Lâm", code: "_218", province_code: "_2"},
        { label: "Hoài Đức", value: "Hoài Đức", code: "_219", province_code: "_2"},
        { label: "Mê Linh", value: "Mê Linh", code: "_220", province_code: "_2"},
        { label: "Quốc Oai", value: "Quốc Oai", code: "_224", province_code: "_2"},
        { label: "Sóc Sơn", value: "Sóc Sơn", code: "_225", province_code: "_2"},
        { label: "Thạch Thất", value: "Thạch Thất", code: "_226", province_code: "_2"},
        { label: "Thanh Trì", value: "Thanh Trì", code: "_228", province_code: "_2"},
        { label: "Hải Châu", value: "Hải Châu", code: "_301", province_code: "_3"},
        { label: "Thanh Khê", value: "Thanh Khê", code: "_302", province_code: "_3"},
        { label: "Sơn Trà", value: "Sơn Trà", code: "_303", province_code: "_3"},
        { label: "Ngũ Hành Sơn", value: "Ngũ Hành Sơn", code: "_304", province_code: "_3"},
        { label: "Liên Chiểu", value: "Liên Chiểu", code: "_305", province_code: "_3"},
        { label: "Cẩm Lệ", value: "Cẩm Lệ", code: "_306", province_code: "_3"},
        { label: "Hòa Vang", value: "Hòa Vang", code: "_307", province_code: "_3"},
        { label: "Ninh Kiều", value: "Ninh Kiều", code: "_401", province_code: "_4"},
        { label: "Cái Răng", value: "Cái Răng", code: "_403", province_code: "_4"},
        { label: "Ô Môn", value: "Ô Môn", code: "_404", province_code: "_4"},
        { label: "Thốt Nốt", value: "Thốt Nốt", code: "_405", province_code: "_4"},
        { label: "Quận 01", value: "Quận 01", code: "_101", province_code: "_5"},
        { label: "TP. Nha Trang", value: "TP. Nha Trang", code: "_501", province_code: "_5"},
        { label: "Cam Ranh", value: "Cam Ranh", code: "_502", province_code: "_5"},
        { label: "TP. Biên Hòa", value: "TP. Biên Hòa", code: "_601", province_code: "_6"},
        { label: "TP. Long Khánh", value: "TP. Long Khánh", code: "_602", province_code: "_6"},
        { label: "Long Thành", value: "Long Thành", code: "_603", province_code: "_6"},
        { label: "Nhơn Trạch", value: "Nhơn Trạch", code: "_604", province_code: "_6"},
        { label: "Trảng Bom", value: "Trảng Bom", code: "_605", province_code: "_6"},
        { label: "Hải An", value: "Hải An", code: "_703", province_code: "_7"},
        { label: "Kiến An", value: "Kiến An", code: "_704", province_code: "_7"},
        { label: "Hồng Bàng", value: "Hồng Bàng", code: "_705", province_code: "_7"},
        { label: "Ngô Quyền", value: "Ngô Quyền", code: "_706", province_code: "_7"},
        { label: "Lê Chân", value: "Lê Chân", code: "_707", province_code: "_7"},
        { label: "An Dương", value: "An Dương", code: "_708", province_code: "_7"},
        { label: "Cát Hải", value: "Cát Hải", code: "_711", province_code: "_7"},
        { label: "Thủy Nguyên", value: "Thủy Nguyên", code: "_715", province_code: "_7"},
        { label: "TP. Vinh", value: "TP. Vinh", code: "_1301", province_code: "_13"},
        { label: "TP. Bắc Ninh", value: "TP. Bắc Ninh", code: "_4801", province_code: "_48"},
        { label: "Từ Sơn", value: "Từ Sơn", code: "_4802", province_code: "_48"},
        { label: "Quế Võ", value: "Quế Võ", code: "_4805", province_code: "_48"},
        { label: "Yên Phong", value: "Yên Phong", code: "_4808", province_code: "_48"},
        { label: "TP. Thủ Dầu Một", value: "TP. Thủ Dầu Một", code: "_1701", province_code: "_17"},
        { label: "Thuận An", value: "Thuận An", code: "_1702", province_code: "_17"},
        { label: "Dĩ An", value: "Dĩ An", code: "_1703", province_code: "_17"},
        { label: "Tân Uyên", value: "Tân Uyên", code: "_1704", province_code: "_17"},
        { label: "Bến Cát", value: "Bến Cát", code: "_1705", province_code: "_17"}
    ];


    const district_dropdown = new DropDownList(
        document.getElementById("_Q1"),
        document.getElementsByClassName("dropdown-list")[1],
        district_data,
        hiddenInitially = false,
        isMultiSelect = false
    );

    const data = [
	{ label: "<b>66 Nguyen Hue D1</b> - Quận 01", value: "66 Nguyen Hue D1 - Quận 01", code: "_58", province_code: "_1", district_code: "_101"},
        { label: "<b>Saigon Post Office</b> - Quận 01", value: "Saigon Post Office - Quận 01", code: "_126", province_code: "_1", district_code: "_101"},
        { label: "<b>Nowzone D1</b> - Quận 01", value: "Nowzone D1 - Quận 01", code: "_148", province_code: "_1", district_code: "_101"},
        { label: "<b>Friendship Tower D1</b> - Quận 01", value: "Friendship Tower D1 - Quận 01", code: "_340", province_code: "_1", district_code: "_101"},
        { label: "<b>AB Tower D1</b> - Quận 01", value: "AB Tower D1 - Quận 01", code: "_388", province_code: "_1", district_code: "_101"},
        { label: "<b>71 Ly Tu Trong D1</b> - Quận 01", value: "71 Ly Tu Trong D1 - Quận 01", code: "_397", province_code: "_1", district_code: "_101"},
        { label: "<b>Nguyen Binh Khiem D1</b> - Quận 01", value: "Nguyen Binh Khiem D1 - Quận 01", code: "_429", province_code: "_1", district_code: "_101"},
        { label: "<b>46 Bui Thi Xuan D1</b> - Quận 01", value: "46 Bui Thi Xuan D1 - Quận 01", code: "_438", province_code: "_1", district_code: "_101"},
        { label: "<b>2B Le Duan</b> - Quận 01", value: "2B Le Duan - Quận 01", code: "_517", province_code: "_1", district_code: "_101"},
        { label: "<b>Vinhomes Ba Son</b> - Quận 01", value: "Vinhomes Ba Son - Quận 01", code: "_539", province_code: "_1", district_code: "_101"},
        { label: "<b>119 Ham Nghi</b> - Quận 01", value: "119 Ham Nghi - Quận 01", code: "_552", province_code: "_1", district_code: "_101"},
        { label: "<b>132A Nguyen Thai Hoc</b> - Quận 01", value: "132A Nguyen Thai Hoc - Quận 01", code: "_564", province_code: "_1", district_code: "_101"},
        { label: "<b>210 Nguyen Trai HCM</b> - Quận 01", value: "210 Nguyen Trai HCM - Quận 01", code: "_628", province_code: "_1", district_code: "_101"},
        { label: "<b>Calmette</b> - Quận 01", value: "Calmette - Quận 01", code: "_686", province_code: "_1", district_code: "_101"},
        { label: "<b>Saigon Centre 2</b> - Quận 01", value: "Saigon Centre 2 - Quận 01", code: "_737", province_code: "_1", district_code: "_101"},
        { label: "<b>Tran Quang Khai</b> - Quận 01", value: "Tran Quang Khai - Quận 01", code: "_767", province_code: "_1", district_code: "_101"},
        { label: "<b>Diamond</b> - Quận 01", value: "Diamond - Quận 01", code: "_788", province_code: "_1", district_code: "_101"},
        { label: "<b>FIDECO</b> - Quận 01", value: "FIDECO - Quận 01", code: "_792", province_code: "_1", district_code: "_101"},
        { label: "<b>IMG</b> - Quận 01", value: "IMG - Quận 01", code: "_795", province_code: "_1", district_code: "_101"},
        { label: "<b>Vincom B3</b> - Quận 01", value: "Vincom B3 - Quận 01", code: "_797", province_code: "_1", district_code: "_101"},
        { label: "<b>Liberty</b> - Quận 01", value: "Liberty - Quận 01", code: "_799", province_code: "_1", district_code: "_101"},
        { label: "<b>AQ</b> - Quận 01", value: "AQ - Quận 01", code: "_800", province_code: "_1", district_code: "_101"},
        { label: "<b>Saigon Trade</b> - Quận 01", value: "Saigon Trade - Quận 01", code: "_807", province_code: "_1", district_code: "_101"},
        { label: "<b>City Museum</b> - Quận 01", value: "City Museum - Quận 01", code: "_4723", province_code: "_1", district_code: "_101"},
        { label: "<b>Ton That Thiep D1</b> - Quận 01", value: "Ton That Thiep D1 - Quận 01", code: "_4738", province_code: "_1", district_code: "_101"},
        { label: "<b>Marina Central D1</b> - Quận 01", value: "Marina Central D1 - Quận 01", code: "_5953", province_code: "_1", district_code: "_101"},
        { label: "<b>Historical Museum HCMC</b> - Quận 01", value: "Historical Museum HCMC - Quận 01", code: "_5957", province_code: "_1", district_code: "_101"},
        { label: "<b>Thanh Sai Gon Centre</b> - Quận 01", value: "Thanh Sai Gon Centre - Quận 01", code: "_6078", province_code: "_1", district_code: "_101"},
        { label: "<b>Central Garden D1</b> - Quận 01", value: "Central Garden D1 - Quận 01", code: "_6091", province_code: "_1", district_code: "_101"},
        { label: "<b>Ben Bach Dang D1</b> - Quận 01", value: "Ben Bach Dang D1 - Quận 01", code: "_6093", province_code: "_1", district_code: "_101"},
        { label: "<b>169 Hoang Sa D1</b> - Quận 01", value: "169 Hoang Sa D1 - Quận 01", code: "_6182", province_code: "_1", district_code: "_101"},
        { label: "<b>HMC Tower D1</b> - Quận 01", value: "HMC Tower D1 - Quận 01", code: "_6184", province_code: "_1", district_code: "_101"},
        { label: "<b>Bitexco D1</b> - Quận 01", value: "Bitexco D1 - Quận 01", code: "_6454", province_code: "_1", district_code: "_101"},
        { label: "<b>Novotel D3</b> - Quận 03", value: "Novotel D3 - Quận 03", code: "_3", province_code: "_1", district_code: "_103"},
        { label: "<b>803 HOANG SA D3</b> - Quận 03", value: "803 HOANG SA D3 - Quận 03", code: "_83", province_code: "_1", district_code: "_103"},
        { label: "<b>2 Cao Thang D3</b> - Quận 03", value: "2 Cao Thang D3 - Quận 03", code: "_92", province_code: "_1", district_code: "_103"},
        { label: "<b>964 Truong Sa D3</b> - Quận 03", value: "964 Truong Sa D3 - Quận 03", code: "_141", province_code: "_1", district_code: "_103"},
        { label: "<b>46 Vo Van Tan D3</b> - Quận 03", value: "46 Vo Van Tan D3 - Quận 03", code: "_303", province_code: "_1", district_code: "_103"},
        { label: "<b>33 Le Quy Don D3</b> - Quận 03", value: "33 Le Quy Don D3 - Quận 03", code: "_446", province_code: "_1", district_code: "_103"},
        { label: "<b>SGGP Tower</b> - Quận 03", value: "SGGP Tower - Quận 03", code: "_509", province_code: "_1", district_code: "_103"},
        { label: "<b>CIENCO 4</b> - Quận 03", value: "CIENCO 4 - Quận 03", code: "_532", province_code: "_1", district_code: "_103"},
        { label: "<b>Saigon Pavillon D3</b> - Quận 03", value: "Saigon Pavillon D3 - Quận 03", code: "_574", province_code: "_1", district_code: "_103"},
        { label: "<b>225 Ng Dinh Chieu</b> - Quận 03", value: "225 Ng Dinh Chieu - Quận 03", code: "_629", province_code: "_1", district_code: "_103"},
        { label: "<b>45 Ly Chinh Thang</b> - Quận 03", value: "45 Ly Chinh Thang - Quận 03", code: "_631", province_code: "_1", district_code: "_103"},
        { label: "<b>Ho Con Rua</b> - Quận 03", value: "Ho Con Rua - Quận 03", code: "_708", province_code: "_1", district_code: "_103"},
        { label: "<b>90 CMT8</b> - Quận 03", value: "90 CMT8 - Quận 03", code: "_762", province_code: "_1", district_code: "_103"},
        { label: "<b>Bao Minh Tower HCM</b> - Quận 03", value: "Bao Minh Tower HCM - Quận 03", code: "_775", province_code: "_1", district_code: "_103"},
        { label: "<b>Hai Ba Trung</b> - Quận 03", value: "Hai Ba Trung - Quận 03", code: "_786", province_code: "_1", district_code: "_103"},
        { label: "<b>270 Vo Thi Sau D3</b> - Quận 03", value: "270 Vo Thi Sau D3 - Quận 03", code: "_5744", province_code: "_1", district_code: "_103"},
        { label: "<b>Ga Xe Lua Saigon</b> - Quận 03", value: "Ga Xe Lua Saigon - Quận 03", code: "_5955", province_code: "_1", district_code: "_103"},
        { label: "<b>9A Ky Dong D3</b> - Quận 03", value: "9A Ky Dong D3 - Quận 03", code: "_6012", province_code: "_1", district_code: "_103"},
        { label: "<b>Chung Cu Vinh Hoi D4</b> - Quận 04", value: "Chung Cu Vinh Hoi D4 - Quận 04", code: "_151", province_code: "_1", district_code: "_104"},
        { label: "<b>183 Ben Van Don D4</b> - Quận 04", value: "183 Ben Van Don D4 - Quận 04", code: "_248", province_code: "_1", district_code: "_104"},
        { label: "<b>194 Ng Tat Thanh D4</b> - Quận 04", value: "194 Ng Tat Thanh D4 - Quận 04", code: "_394", province_code: "_1", district_code: "_104"},
        { label: "<b>Saigon Royal</b> - Quận 04", value: "Saigon Royal - Quận 04", code: "_487", province_code: "_1", district_code: "_104"},
        { label: "<b>Post Office D4</b> - Quận 04", value: "Post Office D4 - Quận 04", code: "_5814", province_code: "_1", district_code: "_104"},
        { label: "<b>99 Ngo Quyen D5</b> - Quận 05", value: "99 Ngo Quyen D5 - Quận 05", code: "_34", province_code: "_1", district_code: "_105"},
        { label: "<b>261 Tran Phu D5</b> - Quận 05", value: "261 Tran Phu D5 - Quận 05", code: "_48", province_code: "_1", district_code: "_105"},
        { label: "<b>153 Hung Vuong D5</b> - Quận 05", value: "153 Hung Vuong D5 - Quận 05", code: "_480", province_code: "_1", district_code: "_105"},
        { label: "<b>402 Tran Hung Dao D5</b> - Quận 05", value: "402 Tran Hung Dao D5 - Quận 05", code: "_460", province_code: "_1", district_code: "_105"},
        { label: "<b>Tran Hung Dao</b> - Quận 05", value: "Tran Hung Dao - Quận 05", code: "_789", province_code: "_1", district_code: "_105"},
        { label: "<b>Cho Lon Post Office</b> - Quận 05", value: "Cho Lon Post Office - Quận 05", code: "_5892", province_code: "_1", district_code: "_105"},
        { label: "<b>Satra D6</b> - Quận 06", value: "Satra D6 - Quận 06", code: "_32", province_code: "_1", district_code: "_106"},
        { label: "<b>110 Hau Giang D6</b> - Quận 06", value: "110 Hau Giang D6 - Quận 06", code: "_40", province_code: "_1", district_code: "_106"},
        { label: "<b>Ba Hom D6</b> - Quận 06", value: "Ba Hom D6 - Quận 06", code: "_81", province_code: "_1", district_code: "_106"},
        { label: "<b>Kinh Duong Vuong D6</b> - Quận 06", value: "Kinh Duong Vuong D6 - Quận 06", code: "_101", province_code: "_1", district_code: "_106"},
        { label: "<b>240 Ng Van Luong D6</b> - Quận 06", value: "240 Ng Van Luong D6 - Quận 06", code: "_584", province_code: "_1", district_code: "_106"},
        { label: "<b>61 Binh Phu</b> - Quận 06", value: "61 Binh Phu - Quận 06", code: "_688", province_code: "_1", district_code: "_106"},
        { label: "<b>8G Lam Van Ben D7</b> - Quận 07", value: "8G Lam Van Ben D7 - Quận 07", code: "_46", province_code: "_1", district_code: "_107"},
        { label: "<b>Nguyen Thi Thap D7</b> - Quận 07", value: "Nguyen Thi Thap D7 - Quận 07", code: "_47", province_code: "_1", district_code: "_107"},
        { label: "<b>CMC Space D7</b> - Quận 07", value: "CMC Space D7 - Quận 07", code: "_61", province_code: "_1", district_code: "_107"},
        { label: "<b>Eco Green D7</b> - Quận 07", value: "Eco Green D7 - Quận 07", code: "_157", province_code: "_1", district_code: "_107"},
        { label: "<b>Nguyen Duc Canh D7</b> - Quận 07", value: "Nguyen Duc Canh D7 - Quận 07", code: "_166", province_code: "_1", district_code: "_107"},
        { label: "<b>Pham Van Nghi D7</b> - Quận 07", value: "Pham Van Nghi D7 - Quận 07", code: "_411", province_code: "_1", district_code: "_107"},
        { label: "<b>VNG Campus D7</b> - Quận 07", value: "VNG Campus D7 - Quận 07", code: "_467", province_code: "_1", district_code: "_107"},
        { label: "<b>Sunrise City View D7</b> - Quận 07", value: "Sunrise City View D7 - Quận 07", code: "_516", province_code: "_1", district_code: "_107"},
        { label: "<b>721 Huynh Tan Phat</b> - Quận 07", value: "721 Huynh Tan Phat - Quận 07", code: "_610", province_code: "_1", district_code: "_107"},
        { label: "<b>L16 Him Lam</b> - Quận 07", value: "L16 Him Lam - Quận 07", code: "_673", province_code: "_1", district_code: "_107"},
        { label: "<b>Lotte 2 D7</b> - Quận 07", value: "Lotte 2 D7 - Quận 07", code: "_682", province_code: "_1", district_code: "_107"},
        { label: "<b>RMIT</b> - Quận 07", value: "RMIT - Quận 07", code: "_698", province_code: "_1", district_code: "_107"},
        { label: "<b>Vincom Nam Long</b> - Quận 07", value: "Vincom Nam Long - Quận 07", code: "_703", province_code: "_1", district_code: "_107"},
        { label: "<b>ViVo HCM</b> - Quận 07", value: "ViVo HCM - Quận 07", code: "_774", province_code: "_1", district_code: "_107"},
        { label: "<b>Garden Plaza</b> - Quận 07", value: "Garden Plaza - Quận 07", code: "_798", province_code: "_1", district_code: "_107"},
        { label: "<b>Riverside Complex D7</b> - Quận 07", value: "Riverside Complex D7 - Quận 07", code: "_5316", province_code: "_1", district_code: "_107"},
        { label: "<b>DHA D7</b> - Quận 07", value: "DHA D7 - Quận 07", code: "_5462", province_code: "_1", district_code: "_107"},
        { label: "<b>Fulbright University</b> - Quận 07", value: "Fulbright University - Quận 07", code: "_5821", province_code: "_1", district_code: "_107"},
        { label: "<b>48 Le Thi Cho D7</b> - Quận 07", value: "48 Le Thi Cho D7 - Quận 07", code: "_5822", province_code: "_1", district_code: "_107"},
        { label: "<b>Pegasuite D8</b> - Quận 08", value: "Pegasuite D8 - Quận 08", code: "_15", province_code: "_1", district_code: "_108"},
        { label: "<b>Central Premium D8</b> - Quận 08", value: "Central Premium D8 - Quận 08", code: "_16", province_code: "_1", district_code: "_108"},
        { label: "<b>Parc Mall D8</b> - Quận 08", value: "Parc Mall D8 - Quận 08", code: "_59", province_code: "_1", district_code: "_108"},
        { label: "<b>Duong Ba Trac D8</b> - Quận 08", value: "Duong Ba Trac D8 - Quận 08", code: "_66", province_code: "_1", district_code: "_108"},
        { label: "<b>343 Ben Binh Dong D8</b> - Quận 08", value: "343 Ben Binh Dong D8 - Quận 08", code: "_228", province_code: "_1", district_code: "_108"},
        { label: "<b>GREEN RIVER D8</b> - Quận 08", value: "GREEN RIVER D8 - Quận 08", code: "_324", province_code: "_1", district_code: "_108"},
        { label: "<b>819 Ta Quang Buu D8</b> - Quận 08", value: "819 Ta Quang Buu D8 - Quận 08", code: "_374", province_code: "_1", district_code: "_108"},
        { label: "<b>206 Cao Lo D8</b> - Quận 08", value: "206 Cao Lo D8 - Quận 08", code: "_404", province_code: "_1", district_code: "_108"},
        { label: "<b>Tung Thien Vuong-HCM</b> - Quận 08", value: "Tung Thien Vuong-HCM - Quận 08", code: "_735", province_code: "_1", district_code: "_108"},
        { label: "<b>VINCOM 3-2 D10</b> - Quận 10", value: "VINCOM 3-2 D10 - Quận 10", code: "_78", province_code: "_1", district_code: "_110"},
        { label: "<b>Nguyen Tri Phuong D10</b> - Quận 10", value: "Nguyen Tri Phuong D10 - Quận 10", code: "_90", province_code: "_1", district_code: "_110"},
        { label: "<b>Ha Do Centrosa</b> - Quận 10", value: "Ha Do Centrosa - Quận 10", code: "_178", province_code: "_1", district_code: "_110"},
        { label: "<b>Coop Ly Thuong Kiet</b> - Quận 10", value: "Coop Ly Thuong Kiet - Quận 10", code: "_337", province_code: "_1", district_code: "_110"},
        { label: "<b>82 Ng Chi Thanh D10</b> - Quận 10", value: "82 Ng Chi Thanh D10 - Quận 10", code: "_468", province_code: "_1", district_code: "_110"},
        { label: "<b>G4-G8 Truong Son</b> - Quận 10", value: "G4-G8 Truong Son - Quận 10", code: "_568", province_code: "_1", district_code: "_110"},
        { label: "<b>601 CMT8</b> - Quận 10", value: "601 CMT8 - Quận 10", code: "_614", province_code: "_1", district_code: "_110"},
        { label: "<b>Trade Centre D10</b> - Quận 10", value: "Trade Centre D10 - Quận 10", code: "_661", province_code: "_1", district_code: "_110"},
        { label: "<b>Viettel CMT8</b> - Quận 10", value: "Viettel CMT8 - Quận 10", code: "_700", province_code: "_1", district_code: "_110"},
        { label: "<b>Satramart 3/2</b> - Quận 10", value: "Satramart 3/2 - Quận 10", code: "_716", province_code: "_1", district_code: "_110"},
        { label: "<b>175B Cao Thang D10</b> - Quận 10", value: "175B Cao Thang D10 - Quận 10", code: "_5459", province_code: "_1", district_code: "_110"},
        { label: "<b>The Emporium D11</b> - Quận 11", value: "The Emporium D11 - Quận 11", code: "_35", province_code: "_1", district_code: "_111"},
        { label: "<b>1215 Ba Thang Hai D11</b> - Quận 11", value: "1215 Ba Thang Hai D11 - Quận 11", code: "_65", province_code: "_1", district_code: "_111"},
        { label: "<b>Lac Long Quan D11</b> - Quận 11", value: "Lac Long Quan D11 - Quận 11", code: "_89", province_code: "_1", district_code: "_111"},
        { label: "<b>415 Le Dai Hanh D11</b> - Quận 11", value: "415 Le Dai Hanh D11 - Quận 11", code: "_114", province_code: "_1", district_code: "_111"},
        { label: "<b>Ly Thuong Kiet D11</b> - Quận 11", value: "Ly Thuong Kiet D11 - Quận 11", code: "_536", province_code: "_1", district_code: "_111"},
        { label: "<b>Lanh Binh Thang D11</b> - Quận 11", value: "Lanh Binh Thang D11 - Quận 11", code: "_544", province_code: "_1", district_code: "_111"},
        { label: "<b>278 Han Hai Nguyen</b> - Quận 11", value: "278 Han Hai Nguyen - Quận 11", code: "_577", province_code: "_1", district_code: "_111"},
        { label: "<b>134 Ta Uyen</b> - Quận 11", value: "134 Ta Uyen - Quận 11", code: "_636", province_code: "_1", district_code: "_111"},
        { label: "<b>Lotte Le Dai Hanh D11</b> - Quận 11", value: "Lotte Le Dai Hanh D11 - Quận 11", code: "_6195", province_code: "_1", district_code: "_111"},
        { label: "<b>43 Truong Chinh D12</b> - Quận 12", value: "43 Truong Chinh D12 - Quận 12", code: "_41", province_code: "_1", district_code: "_112"},
        { label: "<b>To Ky 2 D12</b> - Quận 12", value: "To Ky 2 D12 - Quận 12", code: "_191", province_code: "_1", district_code: "_112"},
        { label: "<b>CVPM Quang Trung 1</b> - Quận 12", value: "CVPM Quang Trung 1 - Quận 12", code: "_260", province_code: "_1", district_code: "_112"},
        { label: "<b>4 To Ky D12</b> - Quận 12", value: "4 To Ky D12 - Quận 12", code: "_377", province_code: "_1", district_code: "_112"},
        { label: "<b>33 Le Van Khuong D12</b> - Quận 12", value: "33 Le Van Khuong D12 - Quận 12", code: "_439", province_code: "_1", district_code: "_112"},
        { label: "<b>Nguyen Van Qua</b> - Quận 12", value: "Nguyen Van Qua - Quận 12", code: "_553", province_code: "_1", district_code: "_112"},
        { label: "<b>23A Nguyen Anh Thu</b> - Quận 12", value: "23A Nguyen Anh Thu - Quận 12", code: "_585", province_code: "_1", district_code: "_112"},
        { label: "<b>371 KP3 Trung My Tay</b> - Quận 12", value: "371 KP3 Trung My Tay - Quận 12", code: "_611", province_code: "_1", district_code: "_112"},
        { label: "<b>Le Thi Rieng D12</b> - Quận 12", value: "Le Thi Rieng D12 - Quận 12", code: "_6190", province_code: "_1", district_code: "_112"},
        { label: "<b>Nguyen Anh Thu D12</b> -  Quận 12", value: "Nguyen Anh Thu D12 -  Quận 12", code: "_197", province_code: "_1", district_code: "_112"},
        { label: "<b>6 Ta Hien D2 Thu Duc</b> - TP. Thủ Đức", value: "6 Ta Hien D2 Thu Duc - TP. Thủ Đức", code: "_2", province_code: "_1", district_code: "_113"},
        { label: "<b>Pvoil Binh Tho Thu Duc</b> - TP. Thủ Đức", value: "Pvoil Binh Tho Thu Duc - TP. Thủ Đức", code: "_10", province_code: "_1", district_code: "_113"},
        { label: "<b>The Vista An Phu </b> - TP. Thủ Đức", value: "The Vista An Phu  - TP. Thủ Đức", code: "_11", province_code: "_1", district_code: "_113"},
        { label: "<b>Pvoil No.4 Thu Duc</b> - TP. Thủ Đức", value: "Pvoil No.4 Thu Duc - TP. Thủ Đức", code: "_12", province_code: "_1", district_code: "_113"},
        { label: "<b>Pvoil No.5 Thu Duc</b> - TP. Thủ Đức", value: "Pvoil No.5 Thu Duc - TP. Thủ Đức", code: "_14", province_code: "_1", district_code: "_113"},
        { label: "<b>Pvoil No.7 Thu Duc</b> - TP. Thủ Đức", value: "Pvoil No.7 Thu Duc - TP. Thủ Đức", code: "_22", province_code: "_1", district_code: "_113"},
        { label: "<b>The Crest Thu Thiem</b> - TP. Thủ Đức", value: "The Crest Thu Thiem - TP. Thủ Đức", code: "_30", province_code: "_1", district_code: "_113"},
        { label: "<b>287 Lien Phuong D9</b> - TP. Thủ Đức", value: "287 Lien Phuong D9 - TP. Thủ Đức", code: "_33", province_code: "_1", district_code: "_113"},
        { label: "<b>Song Hanh An Phu D2</b> - TP. Thủ Đức", value: "Song Hanh An Phu D2 - TP. Thủ Đức", code: "_37", province_code: "_1", district_code: "_113"},
        { label: "<b>DHSP Ky Thuat TPHCM</b> - TP. Thủ Đức", value: "DHSP Ky Thuat TPHCM - TP. Thủ Đức", code: "_44", province_code: "_1", district_code: "_113"},
        { label: "<b>Lumiere Riverside D2</b> - TP. Thủ Đức", value: "Lumiere Riverside D2 - TP. Thủ Đức", code: "_52", province_code: "_1", district_code: "_113"},
        { label: "<b>Sadora Thu Thiem</b> - TP. Thủ Đức", value: "Sadora Thu Thiem - TP. Thủ Đức", code: "_55", province_code: "_1", district_code: "_113"},
        { label: "<b>Thu Thiem Park</b> - TP. Thủ Đức", value: "Thu Thiem Park - TP. Thủ Đức", code: "_71", province_code: "_1", district_code: "_113"},
        { label: "<b>Vincom Grandpark D9</b> - TP. Thủ Đức", value: "Vincom Grandpark D9 - TP. Thủ Đức", code: "_80", province_code: "_1", district_code: "_113"},
        { label: "<b>Gateway D2</b> - TP. Thủ Đức", value: "Gateway D2 - TP. Thủ Đức", code: "_82", province_code: "_1", district_code: "_113"},
        { label: "<b>49B Thao Dien ThuDuc</b> - TP. Thủ Đức", value: "49B Thao Dien ThuDuc - TP. Thủ Đức", code: "_93", province_code: "_1", district_code: "_113"},
        { label: "<b>Le Van Viet 2 ThuDuc</b> - TP. Thủ Đức", value: "Le Van Viet 2 ThuDuc - TP. Thủ Đức", code: "_115", province_code: "_1", district_code: "_113"},
        { label: "<b>Hiep Binh Thu Duc</b> - TP. Thủ Đức", value: "Hiep Binh Thu Duc - TP. Thủ Đức", code: "_124", province_code: "_1", district_code: "_113"},
        { label: "<b>Vincom Le Van Viet D9</b> - TP. Thủ Đức", value: "Vincom Le Van Viet D9 - TP. Thủ Đức", code: "_143", province_code: "_1", district_code: "_113"},
        { label: "<b>Golden King D7</b> - TP. Thủ Đức", value: "Golden King D7 - TP. Thủ Đức", code: "_146", province_code: "_1", district_code: "_113"},
        { label: "<b>Crescent Mall D7</b> - TP. Thủ Đức", value: "Crescent Mall D7 - TP. Thủ Đức", code: "_486", province_code: "_1", district_code: "_113"},
        { label: "<b>Sari Town Sala</b> - TP. Thủ Đức", value: "Sari Town Sala - TP. Thủ Đức", code: "_205", province_code: "_1", district_code: "_113"},
        { label: "<b>Van Phuc city ThuDuc</b> - TP. Thủ Đức", value: "Van Phuc city ThuDuc - TP. Thủ Đức", code: "_209", province_code: "_1", district_code: "_113"},
        { label: "<b>Ng Van Tang Thu Duc</b> - TP. Thủ Đức", value: "Ng Van Tang Thu Duc - TP. Thủ Đức", code: "_235", province_code: "_1", district_code: "_113"},
        { label: "<b>Chung Cu Bo Cong An</b> - TP. Thủ Đức", value: "Chung Cu Bo Cong An - TP. Thủ Đức", code: "_247", province_code: "_1", district_code: "_113"},
        { label: "<b>VH GRAND PARK 2</b> - TP. Thủ Đức", value: "VH GRAND PARK 2 - TP. Thủ Đức", code: "_266", province_code: "_1", district_code: "_113"},
        { label: "<b>135 Quoc Lo 13 ThuDuc</b> - TP. Thủ Đức", value: "135 Quoc Lo 13 ThuDuc - TP. Thủ Đức", code: "_274", province_code: "_1", district_code: "_113"},
        { label: "<b>CoopXtra Linh Trung</b> - TP. Thủ Đức", value: "CoopXtra Linh Trung - TP. Thủ Đức", code: "_292", province_code: "_1", district_code: "_113"},
        { label: "<b>Faifo Lane Thu Thiem</b> - TP. Thủ Đức", value: "Faifo Lane Thu Thiem - TP. Thủ Đức", code: "_304", province_code: "_1", district_code: "_113"},
        { label: "<b>UOA Tower D7</b> - TP. Thủ Đức", value: "UOA Tower D7 - TP. Thủ Đức", code: "_309", province_code: "_1", district_code: "_113"},
        { label: "<b>Thiso Mall Thu Thiem</b> - TP. Thủ Đức", value: "Thiso Mall Thu Thiem - TP. Thủ Đức", code: "_316", province_code: "_1", district_code: "_113"},
        { label: "<b>Galleria Thu Thiem</b> - TP. Thủ Đức", value: "Galleria Thu Thiem - TP. Thủ Đức", code: "_319", province_code: "_1", district_code: "_113"},
        { label: "<b>111 Huy Can Thu Duc</b> - TP. Thủ Đức", value: "111 Huy Can Thu Duc - TP. Thủ Đức", code: "_327", province_code: "_1", district_code: "_113"},
        { label: "<b>962 Pham Van Dong</b> - TP. Thủ Đức", value: "962 Pham Van Dong - TP. Thủ Đức", code: "_347", province_code: "_1", district_code: "_113"},
        { label: "<b>S2.02 VH Grand Park</b> - TP. Thủ Đức", value: "S2.02 VH Grand Park - TP. Thủ Đức", code: "_350", province_code: "_1", district_code: "_113"},
        { label: "<b>77 Hoang Van Thai D7</b> - TP. Thủ Đức", value: "77 Hoang Van Thai D7 - TP. Thủ Đức", code: "_356", province_code: "_1", district_code: "_113"},
        { label: "<b>205 Ng Thi Dinh D2</b> - TP. Thủ Đức", value: "205 Ng Thi Dinh D2 - TP. Thủ Đức", code: "_380", province_code: "_1", district_code: "_113"},
        { label: "<b>Crescent Residence 1</b> - TP. Thủ Đức", value: "Crescent Residence 1 - TP. Thủ Đức", code: "_381", province_code: "_1", district_code: "_113"},
        { label: "<b>230 Ng Duy Trinh D2</b> - TP. Thủ Đức", value: "230 Ng Duy Trinh D2 - TP. Thủ Đức", code: "_396", province_code: "_1", district_code: "_113"},
        { label: "<b>Sarica Sala</b> - TP. Thủ Đức", value: "Sarica Sala - TP. Thủ Đức", code: "_403", province_code: "_1", district_code: "_113"},
        { label: "<b>891 Kha Van Can HCMC</b> - TP. Thủ Đức", value: "891 Kha Van Can HCMC - TP. Thủ Đức", code: "_414", province_code: "_1", district_code: "_113"},
        { label: "<b>To Ngoc Van Thu Duc</b> - TP. Thủ Đức", value: "To Ngoc Van Thu Duc - TP. Thủ Đức", code: "_430", province_code: "_1", district_code: "_113"},
        { label: "<b>Flora Thu Duc</b> - TP. Thủ Đức", value: "Flora Thu Duc - TP. Thủ Đức", code: "_452", province_code: "_1", district_code: "_113"},
        { label: "<b>Dai Hoc Hutech D9</b> - TP. Thủ Đức", value: "Dai Hoc Hutech D9 - TP. Thủ Đức", code: "_470", province_code: "_1", district_code: "_113"},
        { label: "<b>The Sun Avenue</b> - TP. Thủ Đức", value: "The Sun Avenue - TP. Thủ Đức", code: "_501", province_code: "_1", district_code: "_113"},
        { label: "<b>323 Do Xuan Hop</b> - TP. Thủ Đức", value: "323 Do Xuan Hop - TP. Thủ Đức", code: "_525", province_code: "_1", district_code: "_113"},
        { label: "<b>Lexington D2</b> - TP. Thủ Đức", value: "Lexington D2 - TP. Thủ Đức", code: "_542", province_code: "_1", district_code: "_113"},
        { label: "<b>Riviera Point D7</b> - TP. Thủ Đức", value: "Riviera Point D7 - TP. Thủ Đức", code: "_546", province_code: "_1", district_code: "_113"},
        { label: "<b>173 Dang Van Bi</b> - TP. Thủ Đức", value: "173 Dang Van Bi - TP. Thủ Đức", code: "_567", province_code: "_1", district_code: "_113"},
        { label: "<b>41 Tran Nao D2</b> - TP. Thủ Đức", value: "41 Tran Nao D2 - TP. Thủ Đức", code: "_589", province_code: "_1", district_code: "_113"},
        { label: "<b>Sense City Thu Duc</b> - TP. Thủ Đức", value: "Sense City Thu Duc - TP. Thủ Đức", code: "_592", province_code: "_1", district_code: "_113"},
        { label: "<b>Sala 2</b> - TP. Thủ Đức", value: "Sala 2 - TP. Thủ Đức", code: "_623", province_code: "_1", district_code: "_113"},
        { label: "<b>331 Le Van Viet</b> - TP. Thủ Đức", value: "331 Le Van Viet - TP. Thủ Đức", code: "_652", province_code: "_1", district_code: "_113"},
        { label: "<b>Riverside D7</b> - TP. Thủ Đức", value: "Riverside D7 - TP. Thủ Đức", code: "_657", province_code: "_1", district_code: "_113"},
        { label: "<b>New City</b> - TP. Thủ Đức", value: "New City - TP. Thủ Đức", code: "_659", province_code: "_1", district_code: "_113"},
        { label: "<b>Hoang Dieu 2 Thu Duc</b> - TP. Thủ Đức", value: "Hoang Dieu 2 Thu Duc - TP. Thủ Đức", code: "_668", province_code: "_1", district_code: "_113"},
        { label: "<b>Xuan Thuy</b> - TP. Thủ Đức", value: "Xuan Thuy - TP. Thủ Đức", code: "_696", province_code: "_1", district_code: "_113"},
        { label: "<b>VC Nguyen Duy Trinh</b> - TP. Thủ Đức", value: "VC Nguyen Duy Trinh - TP. Thủ Đức", code: "_719", province_code: "_1", district_code: "_113"},
        { label: "<b>Joy Citypoint</b> - TP. Thủ Đức", value: "Joy Citypoint - TP. Thủ Đức", code: "_721", province_code: "_1", district_code: "_113"},
        { label: "<b>Big C Cityland Q7 HC</b> - TP. Thủ Đức", value: "Big C Cityland Q7 HC - TP. Thủ Đức", code: "_757", province_code: "_1", district_code: "_113"},
        { label: "<b>Vincom Thao Dien</b> - TP. Thủ Đức", value: "Vincom Thao Dien - TP. Thủ Đức", code: "_758", province_code: "_1", district_code: "_113"},
        { label: "<b>Vincom Thu Duc</b> - TP. Thủ Đức", value: "Vincom Thu Duc - TP. Thủ Đức", code: "_776", province_code: "_1", district_code: "_113"},
        { label: "<b>Cantavil D2</b> - TP. Thủ Đức", value: "Cantavil D2 - TP. Thủ Đức", code: "_785", province_code: "_1", district_code: "_113"},
        { label: "<b>Van Phuc city 2</b> - TP. Thủ Đức", value: "Van Phuc city 2 - TP. Thủ Đức", code: "_5315", province_code: "_1", district_code: "_113"},
        { label: "<b>Onehub D9</b> - TP. Thủ Đức", value: "Onehub D9 - TP. Thủ Đức", code: "_5464", province_code: "_1", district_code: "_113"},
        { label: "<b>Luong Khai Sieu Thu Duc</b> - TP. Thủ Đức", value: "Luong Khai Sieu Thu Duc - TP. Thủ Đức", code: "_5740", province_code: "_1", district_code: "_113"},
        { label: "<b>Vo Van Ngan Thu Duc</b> - TP. Thủ Đức", value: "Vo Van Ngan Thu Duc - TP. Thủ Đức", code: "_5949", province_code: "_1", district_code: "_113"},
        { label: "<b>No.2 Truong Tho Thu Duc</b> - TP. Thủ Đức", value: "No.2 Truong Tho Thu Duc - TP. Thủ Đức", code: "_5952", province_code: "_1", district_code: "_113"},
        { label: "<b>Tropical VH Grand Park D9</b> - TP. Thủ Đức", value: "Tropical VH Grand Park D9 - TP. Thủ Đức", code: "_6015", province_code: "_1", district_code: "_113"},
        { label: "<b>Hoan My Hospital Thu Duc</b> - TP. Thủ Đức", value: "Hoan My Hospital Thu Duc - TP. Thủ Đức", code: "_6073", province_code: "_1", district_code: "_113"},
        { label: "<b>VTI LIC Nguyen Co Thach</b> - TP. Thủ Đức", value: "VTI LIC Nguyen Co Thach - TP. Thủ Đức", code: "_6448", province_code: "_1", district_code: "_113"},
        { label: "<b>Celadon Tan Phu</b> - Tân Phú", value: "Celadon Tan Phu - Tân Phú", code: "_17", province_code: "_1", district_code: "_114"},
        { label: "<b>Kenh Tan Hoa Tan Phu</b> - Tân Phú", value: "Kenh Tan Hoa Tan Phu - Tân Phú", code: "_102", province_code: "_1", district_code: "_114"},
        { label: "<b>71 D9 Tan Phu</b> - Tân Phú", value: "71 D9 Tan Phu - Tân Phú", code: "_484", province_code: "_1", district_code: "_114"},
        { label: "<b>284 Hoa Binh Tan Phu</b> - Tân Phú", value: "284 Hoa Binh Tan Phu - Tân Phú", code: "_224", province_code: "_1", district_code: "_114"},
        { label: "<b>124D Thoai Ngoc Hau</b> - Tân Phú", value: "124D Thoai Ngoc Hau - Tân Phú", code: "_261", province_code: "_1", district_code: "_114"},
        { label: "<b>87 Tan Thang Tan Phu</b> - Tân Phú", value: "87 Tan Thang Tan Phu - Tân Phú", code: "_313", province_code: "_1", district_code: "_114"},
        { label: "<b>105 Doc Lap Tan Phu</b> - Tân Phú", value: "105 Doc Lap Tan Phu - Tân Phú", code: "_318", province_code: "_1", district_code: "_114"},
        { label: "<b>Tops Market Au Co</b> - Tân Phú", value: "Tops Market Au Co - Tân Phú", code: "_343", province_code: "_1", district_code: "_114"},
        { label: "<b>49 Le Trong Tan</b> - Tân Phú", value: "49 Le Trong Tan - Tân Phú", code: "_420", province_code: "_1", district_code: "_114"},
        { label: "<b>255 Luy Ban Bich</b> - Tân Phú", value: "255 Luy Ban Bich - Tân Phú", code: "_441", province_code: "_1", district_code: "_114"},
        { label: "<b>55 Vuon Lai Tan Phu</b> - Tân Phú", value: "55 Vuon Lai Tan Phu - Tân Phú", code: "_442", province_code: "_1", district_code: "_114"},
        { label: "<b>377 Tan Ky Tan Quy</b> - Tân Phú", value: "377 Tan Ky Tan Quy - Tân Phú", code: "_448", province_code: "_1", district_code: "_114"},
        { label: "<b>287 Au Co</b> - Tân Phú", value: "287 Au Co - Tân Phú", code: "_538", province_code: "_1", district_code: "_114"},
        { label: "<b>184 Lam Van Ben</b> - Tân Phú", value: "184 Lam Van Ben - Tân Phú", code: "_603", province_code: "_1", district_code: "_114"},
        { label: "<b>Aeon Tan Phu</b> - Tân Phú", value: "Aeon Tan Phu - Tân Phú", code: "_604", province_code: "_1", district_code: "_114"},
        { label: "<b>180 Thach Lam</b> - Tân Phú", value: "180 Thach Lam - Tân Phú", code: "_615", province_code: "_1", district_code: "_114"},
        { label: "<b>370 Tan Son Nhi</b> - Tân Phú", value: "370 Tan Son Nhi - Tân Phú", code: "_669", province_code: "_1", district_code: "_114"},
        { label: "<b>827 Au Co Tan Phu</b> - Tân Phú", value: "827 Au Co Tan Phu - Tân Phú", code: "_6451", province_code: "_1", district_code: "_114"},
        { label: "<b>72 Le Thuc Hoach Tan Phu</b> - Tân Phú", value: "72 Le Thuc Hoach Tan Phu - Tân Phú", code: "_6455", province_code: "_1", district_code: "_114"},
        { label: "<b>Tra Khuc Tan Binh</b> - Tân Bình", value: "Tra Khuc Tan Binh - Tân Bình", code: "_5", province_code: "_1", district_code: "_115"},
        { label: "<b>163 Hoang Hoa Tham</b> - Tân Bình", value: "163 Hoang Hoa Tham - Tân Bình", code: "_28", province_code: "_1", district_code: "_115"},
        { label: "<b>Hong Lac Tan Binh</b> - Tân Bình", value: "Hong Lac Tan Binh - Tân Bình", code: "_36", province_code: "_1", district_code: "_115"},
        { label: "<b>Phan Huy Ich 2</b> - Tân Bình", value: "Phan Huy Ich 2 - Tân Bình", code: "_488", province_code: "_1", district_code: "_115"},
        { label: "<b>TSN Intl Airport</b> - Tân Bình", value: "TSN Intl Airport - Tân Bình", code: "_210", province_code: "_1", district_code: "_115"},
        { label: "<b>TSN airport-K3 ISO</b> - Tân Bình", value: "TSN airport-K3 ISO - Tân Bình", code: "_221", province_code: "_1", district_code: "_115"},
        { label: "<b>TSN airport-K2 ISO</b> - Tân Bình", value: "TSN airport-K2 ISO - Tân Bình", code: "_222", province_code: "_1", district_code: "_115"},
        { label: "<b>TSN Airport-K1</b> - Tân Bình", value: "TSN Airport-K1 - Tân Bình", code: "_230", province_code: "_1", district_code: "_115"},
        { label: "<b>TSN Airport-K4</b> - Tân Bình", value: "TSN Airport-K4 - Tân Bình", code: "_232", province_code: "_1", district_code: "_115"},
        { label: "<b>Foodcourt Menas Mall</b> - Tân Bình", value: "Foodcourt Menas Mall - Tân Bình", code: "_281", province_code: "_1", district_code: "_115"},
        { label: "<b>1B Pho Quang HCMC</b> - Tân Bình", value: "1B Pho Quang HCMC - Tân Bình", code: "_402", province_code: "_1", district_code: "_115"},
        { label: "<b>35 Thang Long Tan Binh HCMC</b> - Tân Bình", value: "35 Thang Long Tan Binh HCMC - Tân Bình", code: "_424", province_code: "_1", district_code: "_115"},
        { label: "<b>26A Hoang Viet HCM</b> - Tân Bình", value: "26A Hoang Viet HCM - Tân Bình", code: "_478", province_code: "_1", district_code: "_115"},
        { label: "<b>506 Truong Chinh</b> - Tân Bình", value: "506 Truong Chinh - Tân Bình", code: "_602", province_code: "_1", district_code: "_115"},
        { label: "<b>Botanica</b> - Tân Bình", value: "Botanica - Tân Bình", code: "_667", province_code: "_1", district_code: "_115"},
        { label: "<b>Bau Cat</b> - Tân Bình", value: "Bau Cat - Tân Bình", code: "_677", province_code: "_1", district_code: "_115"},
        { label: "<b>58E Bach Dang</b> - Tân Bình", value: "58E Bach Dang - Tân Bình", code: "_690", province_code: "_1", district_code: "_115"},
        { label: "<b>Tan Son Nhat Airport</b> - Tân Bình", value: "Tan Son Nhat Airport - Tân Bình", code: "_732", province_code: "_1", district_code: "_115"},
        { label: "<b>PICO Plaza_HCM</b> - Tân Bình", value: "PICO Plaza_HCM - Tân Bình", code: "_748", province_code: "_1", district_code: "_115"},
        { label: "<b>Maxi CH</b> - Tân Bình", value: "Maxi CH - Tân Bình", code: "_790", province_code: "_1", district_code: "_115"},
        { label: "<b>140 Truong Chinh</b> - Tân Bình", value: "140 Truong Chinh - Tân Bình", code: "_5735", province_code: "_1", district_code: "_115"},
        { label: "<b>TSN Airport-K5 ISO</b> - Tân Bình", value: "TSN Airport-K5 ISO - Tân Bình", code: "_5745", province_code: "_1", district_code: "_115"},
        { label: "<b>249 Hoang Van Thu</b> - Tân Bình", value: "249 Hoang Van Thu - Tân Bình", code: "_5750", province_code: "_1", district_code: "_115"},
        { label: "<b>Tan Binh Post Office</b> - Tân Bình", value: "Tan Binh Post Office - Tân Bình", code: "_6097", province_code: "_1", district_code: "_115"},
        { label: "<b>NGUYEN KIEM PHUNHUAN</b> - Phú Nhuận", value: "NGUYEN KIEM PHUNHUAN - Phú Nhuận", code: "_39", province_code: "_1", district_code: "_116"},
        { label: "<b>Bamboo Airways HCMC</b> - Phú Nhuận", value: "Bamboo Airways HCMC - Phú Nhuận", code: "_98", province_code: "_1", district_code: "_116"},
        { label: "<b>Nguyen Van Troi HCMC</b> - Phú Nhuận", value: "Nguyen Van Troi HCMC - Phú Nhuận", code: "_162", province_code: "_1", district_code: "_116"},
        { label: "<b>213 Hoang Van Thu</b> - Phú Nhuận", value: "213 Hoang Van Thu - Phú Nhuận", code: "_279", province_code: "_1", district_code: "_116"},
        { label: "<b>Nguyen Trong Tuyen</b> - Phú Nhuận", value: "Nguyen Trong Tuyen - Phú Nhuận", code: "_639", province_code: "_1", district_code: "_116"},
        { label: "<b>Le Van Sy</b> - Phú Nhuận", value: "Le Van Sy - Phú Nhuận", code: "_697", province_code: "_1", district_code: "_116"},
        { label: "<b>Central Point</b> - Phú Nhuận", value: "Central Point - Phú Nhuận", code: "_783", province_code: "_1", district_code: "_116"},
        { label: "<b>Hoang Minh Giam Phu Nhuan</b> - Phú Nhuận", value: "Hoang Minh Giam Phu Nhuan - Phú Nhuận", code: "_6096", province_code: "_1", district_code: "_116"},
        { label: "<b>Central Retail Phu Nhuan</b> - Phú Nhuận", value: "Central Retail Phu Nhuan - Phú Nhuận", code: "_6186", province_code: "_1", district_code: "_116"},
        { label: "<b>Le Van Tho Go Vap</b> - Gò Vấp", value: "Le Van Tho Go Vap - Gò Vấp", code: "_489", province_code: "_1", district_code: "_117"},
        { label: "<b>433 LeDuc Tho Go Vap</b> - Gò Vấp", value: "433 LeDuc Tho Go Vap - Gò Vấp", code: "_342", province_code: "_1", district_code: "_117"},
        { label: "<b>288 Thong Nhat Go Vap</b> - Gò Vấp", value: "288 Thong Nhat Go Vap - Gò Vấp", code: "_406", province_code: "_1", district_code: "_117"},
        { label: "<b>262 Nguyen Thai Son</b> - Gò Vấp", value: "262 Nguyen Thai Son - Gò Vấp", code: "_415", province_code: "_1", district_code: "_117"},
        { label: "<b>158 Pham Van Chieu</b> - Gò Vấp", value: "158 Pham Van Chieu - Gò Vấp", code: "_551", province_code: "_1", district_code: "_117"},
        { label: "<b>57 Le Duc Tho</b> - Gò Vấp", value: "57 Le Duc Tho - Gò Vấp", code: "_586", province_code: "_1", district_code: "_117"},
        { label: "<b>Vincom Quang Trung</b> - Gò Vấp", value: "Vincom Quang Trung - Gò Vấp", code: "_590", province_code: "_1", district_code: "_117"},
        { label: "<b>Vincom Phan Van Tri</b> - Gò Vấp", value: "Vincom Phan Van Tri - Gò Vấp", code: "_598", province_code: "_1", district_code: "_117"},
        { label: "<b>172 Duong So 10</b> - Gò Vấp", value: "172 Duong So 10 - Gò Vấp", code: "_600", province_code: "_1", district_code: "_117"},
        { label: "<b>1180 Quang Trung GV</b> - Gò Vấp", value: "1180 Quang Trung GV - Gò Vấp", code: "_606", province_code: "_1", district_code: "_117"},
        { label: "<b>399 Phan Huy Ich</b> - Gò Vấp", value: "399 Phan Huy Ich - Gò Vấp", code: "_613", province_code: "_1", district_code: "_117"},
        { label: "<b>SG Mall</b> - Gò Vấp", value: "SG Mall - Gò Vấp", code: "_736", province_code: "_1", district_code: "_117"},
        { label: "<b>Lotte Go Vap_HCM</b> - Gò Vấp", value: "Lotte Go Vap_HCM - Gò Vấp", code: "_749", province_code: "_1", district_code: "_117"},
        { label: "<b>Van Lang Center</b> - Gò Vấp", value: "Van Lang Center - Gò Vấp", code: "_5753", province_code: "_1", district_code: "_117"},
        { label: "<b>631 Le Duc Tho Go Vap</b> - Gò Vấp", value: "631 Le Duc Tho Go Vap - Gò Vấp", code: "_5895", province_code: "_1", district_code: "_117"},
        { label: "<b>Phan Van Tri Go Vap</b> - Gò Vấp", value: "Phan Van Tri Go Vap - Gò Vấp", code: "_6077", province_code: "_1", district_code: "_117"},
        { label: "<b>Emart Phan Van Tri Go Vap</b> - Gò Vấp", value: "Emart Phan Van Tri Go Vap - Gò Vấp", code: "_6188", province_code: "_1", district_code: "_117"},
        { label: "<b>18E Phan Van Tri Go Vap</b> - Gò Vấp", value: "18E Phan Van Tri Go Vap - Gò Vấp", code: "_6446", province_code: "_1", district_code: "_117"},
        { label: "<b>Landmark 4 BinhThanh</b> - Bình Thạnh", value: "Landmark 4 BinhThanh - Bình Thạnh", code: "_24", province_code: "_1", district_code: "_118"},
        { label: "<b>398 Nguyen Xi HCMC</b> - Bình Thạnh", value: "398 Nguyen Xi HCMC - Bình Thạnh", code: "_38", province_code: "_1", district_code: "_118"},
        { label: "<b>659 XVNT Binh Thanh</b> - Bình Thạnh", value: "659 XVNT Binh Thanh - Bình Thạnh", code: "_50", province_code: "_1", district_code: "_118"},
        { label: "<b>Sunwah Pearl</b> - Bình Thạnh", value: "Sunwah Pearl - Bình Thạnh", code: "_51", province_code: "_1", district_code: "_118"},
        { label: "<b>606 Dien Bien Phu</b> - Bình Thạnh", value: "606 Dien Bien Phu - Bình Thạnh", code: "_60", province_code: "_1", district_code: "_118"},
        { label: "<b>97 Ung Van Khiem</b> - Bình Thạnh", value: "97 Ung Van Khiem - Bình Thạnh", code: "_103", province_code: "_1", district_code: "_118"},
        { label: "<b>43 Phan Dang Luu</b> - Bình Thạnh", value: "43 Phan Dang Luu - Bình Thạnh", code: "_107", province_code: "_1", district_code: "_118"},
        { label: "<b>UEF University HCMC</b> - Bình Thạnh", value: "UEF University HCMC - Bình Thạnh", code: "_131", province_code: "_1", district_code: "_118"},
        { label: "<b>312 Dien Bien Phu</b> - Bình Thạnh", value: "312 Dien Bien Phu - Bình Thạnh", code: "_145", province_code: "_1", district_code: "_118"},
        { label: "<b>416 Pham Van Dong</b> - Bình Thạnh", value: "416 Pham Van Dong - Bình Thạnh", code: "_170", province_code: "_1", district_code: "_118"},
        { label: "<b>123 Hoang Hoa Tham</b> - Bình Thạnh", value: "123 Hoang Hoa Tham - Bình Thạnh", code: "_311", province_code: "_1", district_code: "_118"},
        { label: "<b>417 Dien Bien Phu</b> - Bình Thạnh", value: "417 Dien Bien Phu - Bình Thạnh", code: "_336", province_code: "_1", district_code: "_118"},
        { label: "<b>270C Bach Dang HCMC</b> - Bình Thạnh", value: "270C Bach Dang HCMC - Bình Thạnh", code: "_338", province_code: "_1", district_code: "_118"},
        { label: "<b>170 Dinh Bo Linh</b> - Bình Thạnh", value: "170 Dinh Bo Linh - Bình Thạnh", code: "_352", province_code: "_1", district_code: "_118"},
        { label: "<b>25 No Trang Long</b> - Bình Thạnh", value: "25 No Trang Long - Bình Thạnh", code: "_371", province_code: "_1", district_code: "_118"},
        { label: "<b>92 Pham Dinh Ho D6</b> - Bình Thạnh", value: "92 Pham Dinh Ho D6 - Bình Thạnh", code: "_375", province_code: "_1", district_code: "_118"},
        { label: "<b>Dai Hoc Hutech</b> - Bình Thạnh", value: "Dai Hoc Hutech - Bình Thạnh", code: "_413", province_code: "_1", district_code: "_118"},
        { label: "<b>127C Dinh Tien Hoang</b> - Bình Thạnh", value: "127C Dinh Tien Hoang - Bình Thạnh", code: "_495", province_code: "_1", district_code: "_118"},
        { label: "<b>46 Hoa Hong PN</b> - Bình Thạnh", value: "46 Hoa Hong PN - Bình Thạnh", code: "_510", province_code: "_1", district_code: "_118"},
        { label: "<b>154 Nguyen Xi</b> - Bình Thạnh", value: "154 Nguyen Xi - Bình Thạnh", code: "_513", province_code: "_1", district_code: "_118"},
        { label: "<b>359A Le Quang Dinh</b> - Bình Thạnh", value: "359A Le Quang Dinh - Bình Thạnh", code: "_519", province_code: "_1", district_code: "_118"},
        { label: "<b>Sun Village</b> - Bình Thạnh", value: "Sun Village - Bình Thạnh", code: "_608", province_code: "_1", district_code: "_118"},
        { label: "<b>Landmark 81</b> - Bình Thạnh", value: "Landmark 81 - Bình Thạnh", code: "_632", province_code: "_1", district_code: "_118"},
        { label: "<b>Vinhomes Park 1.09</b> - Bình Thạnh", value: "Vinhomes Park 1.09 - Bình Thạnh", code: "_687", province_code: "_1", district_code: "_118"},
        { label: "<b>Vincom Saigonres</b> - Bình Thạnh", value: "Vincom Saigonres - Bình Thạnh", code: "_706", province_code: "_1", district_code: "_118"},
        { label: "<b>Saigon Pearl</b> - Bình Thạnh", value: "Saigon Pearl - Bình Thạnh", code: "_723", province_code: "_1", district_code: "_118"},
        { label: "<b>Phan Xich Long</b> - Bình Thạnh", value: "Phan Xich Long - Bình Thạnh", code: "_750", province_code: "_1", district_code: "_118"},
        { label: "<b>Pearl Plaza</b> - Bình Thạnh", value: "Pearl Plaza - Bình Thạnh", code: "_764", province_code: "_1", district_code: "_118"},
        { label: "<b>Citi Ground</b> - Bình Thạnh", value: "Citi Ground - Bình Thạnh", code: "_796", province_code: "_1", district_code: "_118"},
        { label: "<b>The Manor</b> - Bình Thạnh", value: "The Manor - Bình Thạnh", code: "_804", province_code: "_1", district_code: "_118"},
        { label: "<b>Long Tower Binh Thanh</b> - Bình Thạnh", value: "Long Tower Binh Thanh - Bình Thạnh", code: "_5817", province_code: "_1", district_code: "_118"},
        { label: "<b>Thi Nghe Post Office</b> - Bình Thạnh", value: "Thi Nghe Post Office - Bình Thạnh", code: "_6086", province_code: "_1", district_code: "_118"},
        { label: "<b>3 No.8 Binh Tan</b> - Bình Tân", value: "3 No.8 Binh Tan - Bình Tân", code: "_74", province_code: "_1", district_code: "_119"},
        { label: "<b>539 Kinh Duong Vuong</b> - Bình Tân", value: "539 Kinh Duong Vuong - Bình Tân", code: "_123", province_code: "_1", district_code: "_119"},
        { label: "<b>Akari City Binh Tan</b> - Bình Tân", value: "Akari City Binh Tan - Bình Tân", code: "_144", province_code: "_1", district_code: "_119"},
        { label: "<b>366 Le Van Quoi</b> - Bình Tân", value: "366 Le Van Quoi - Bình Tân", code: "_257", province_code: "_1", district_code: "_119"},
        { label: "<b>183 Ten Lua Binh Tan</b> - Bình Tân", value: "183 Ten Lua Binh Tan - Bình Tân", code: "_288", province_code: "_1", district_code: "_119"},
        { label: "<b>925 Tan Ky Tan Quy</b> - Bình Tân", value: "925 Tan Ky Tan Quy - Bình Tân", code: "_291", province_code: "_1", district_code: "_119"},
        { label: "<b>565 Tinh Lo 10</b> - Bình Tân", value: "565 Tinh Lo 10 - Bình Tân", code: "_341", province_code: "_1", district_code: "_119"},
        { label: "<b>Ben xe Mien Tay HCMC</b> - Bình Tân", value: "Ben xe Mien Tay HCMC - Bình Tân", code: "_440", province_code: "_1", district_code: "_119"},
        { label: "<b>Centre Mall</b> - Bình Tân", value: "Centre Mall - Bình Tân", code: "_580", province_code: "_1", district_code: "_119"},
        { label: "<b>No.7 Binh Tan</b> - Bình Tân", value: "No.7 Binh Tan - Bình Tân", code: "_670", province_code: "_1", district_code: "_119"},
        { label: "<b>Big C An Lac</b> - Bình Tân", value: "Big C An Lac - Bình Tân", code: "_731", province_code: "_1", district_code: "_119"},
        { label: "<b>Aeon Mall Binh Tan</b> - Bình Tân", value: "Aeon Mall Binh Tan - Bình Tân", code: "_741", province_code: "_1", district_code: "_119"},
        { label: "<b>No.1 Binh Tan</b> - Bình Tân", value: "No.1 Binh Tan - Bình Tân", code: "_5819", province_code: "_1", district_code: "_119"},
        { label: "<b>Huong Lo 3 Binh Tan</b> - Bình Tân", value: "Huong Lo 3 Binh Tan - Bình Tân", code: "_6079", province_code: "_1", district_code: "_119"},
        { label: "<b>No.1 Binh Chanh</b> - Bình Chánh", value: "No.1 Binh Chanh - Bình Chánh", code: "_207", province_code: "_1", district_code: "_120"},
        { label: "<b>BV Nhi Dong TPHCM</b> - Bình Chánh", value: "BV Nhi Dong TPHCM - Bình Chánh", code: "_273", province_code: "_1", district_code: "_120"},
        { label: "<b>195 Trung Son HCM</b> - Bình Chánh", value: "195 Trung Son HCM - Bình Chánh", code: "_480", province_code: "_1", district_code: "_120"},
        { label: "<b>Dai Phuc Binh Chanh</b> - Bình Chánh", value: "Dai Phuc Binh Chanh - Bình Chánh", code: "_198", province_code: "_1", district_code: "_120"},
        { label: "<b>Central Mall Cu Chi</b> - Củ Chi", value: "Central Mall Cu Chi - Củ Chi", code: "_625", province_code: "_1", district_code: "_122"},
        { label: "<b>Tinh Lo 8 Cu Chi</b> - Củ Chi", value: "Tinh Lo 8 Cu Chi - Củ Chi", code: "_5458", province_code: "_1", district_code: "_122"},
        { label: "<b>26 Lieu Binh Huong Cu Chi</b> - Củ Chi", value: "26 Lieu Binh Huong Cu Chi  - Củ Chi", code: "_6458", province_code: "_1", district_code: "_122"},
        { label: "<b>1800 Nguyen Anh Thu</b> - Hóc Môn", value: "1800 Nguyen Anh Thu - Hóc Môn", code: "_91", province_code: "_1", district_code: "_123"},
        { label: "<b>TSN Airport VJET G24</b> - Hóc Môn", value: "TSN Airport VJET G24 - Hóc Môn", code: "_96", province_code: "_1", district_code: "_123"},
        { label: "<b>Dang Thuc Vinh HCMC</b> - Hóc Môn", value: "Dang Thuc Vinh HCMC - Hóc Môn", code: "_125", province_code: "_1", district_code: "_123"},
        { label: "<b>Le Thi Ha Hoc Mon</b> - Hóc Môn", value: "Le Thi Ha Hoc Mon - Hóc Môn", code: "_229", province_code: "_1", district_code: "_123"},
        { label: "<b>Ly Thuong Kiet HM</b> - Hóc Môn", value: "Ly Thuong Kiet HM - Hóc Môn", code: "_556", province_code: "_1", district_code: "_123"},
        { label: "<b>Phan Van Hon Hoc Mon</b> - Hóc Môn", value: "Phan Van Hon Hoc Mon - Hóc Môn", code: "_6098", province_code: "_1", district_code: "_123"},
        { label: "<b>Dragon Hill 1 Nha Be</b> - Nhà Bè", value: "Dragon Hill 1 Nha Be - Nhà Bè", code: "_357", province_code: "_1", district_code: "_124"},
        { label: "<b>Huynh Tan Phat Nha Be</b> - Nhà Bè", value: "Huynh Tan Phat Nha Be - Nhà Bè", code: "_5894", province_code: "_1", district_code: "_124"},
        { label: "<b>01 Le Duan HN</b> - Ba Đình", value: "01 Le Duan HN - Ba Đình", code: "_163", province_code: "_2", district_code: "_201"},
        { label: "<b>Capital place Ha Noi</b> - Ba Đình", value: "Capital place Ha Noi - Ba Đình", code: "_213", province_code: "_2", district_code: "_201"},
        { label: "<b>Rmit Ha Noi</b> - Ba Đình", value: "Rmit Ha Noi - Ba Đình", code: "_329", province_code: "_2", district_code: "_201"},
        { label: "<b>543 Kim Ma HN</b> - Ba Đình", value: "543 Kim Ma HN - Ba Đình", code: "_479", province_code: "_2", district_code: "_201"},
        { label: "<b>115 Quan Thanh</b> - Ba Đình", value: "115 Quan Thanh - Ba Đình", code: "_587", province_code: "_2", district_code: "_201"},
        { label: "<b>Vincom Lieu Giai B1</b> - Ba Đình", value: "Vincom Lieu Giai B1 - Ba Đình", code: "_595", province_code: "_2", district_code: "_201"},
        { label: "<b>Rose Garden HN</b> - Ba Đình", value: "Rose Garden HN - Ba Đình", code: "_744", province_code: "_2", district_code: "_201"},
        { label: "<b>VTV Outside_HN</b> - Ba Đình", value: "VTV Outside_HN - Ba Đình", code: "_751", province_code: "_2", district_code: "_201"},
        { label: "<b>Quan Thanh</b> - Ba Đình", value: "Quan Thanh - Ba Đình", code: "_761", province_code: "_2", district_code: "_201"},
        { label: "<b>HC DuThuyen TrucBach</b> - Ba Đình", value: "HC DuThuyen TrucBach - Ba Đình", code: "_781", province_code: "_2", district_code: "_201"},
        { label: "<b>HC VTV Inside</b> - HN</b> - Ba Đình", value: "HC VTV Inside - HN - Ba Đình", code: "_791", province_code: "_2", district_code: "_201"},
        { label: "<b>Hanoi Centre Nguyen Thai Hoc</b> - Ba Đình", value: "Hanoi Centre Nguyen Thai Hoc - Ba Đình", code: "_6449", province_code: "_2", district_code: "_201"},
        { label: "<b>Historical Museum HN</b> - Hoàn Kiếm", value: "Historical Museum HN - Hoàn Kiếm", code: "_68", province_code: "_2", district_code: "_202"},
        { label: "<b>16 Phan Chu Trinh HN</b> - Hoàn Kiếm", value: "16 Phan Chu Trinh HN - Hoàn Kiếm", code: "_449", province_code: "_2", district_code: "_202"},
        { label: "<b>01 Hang Bac</b> - Hoàn Kiếm", value: "01 Hang Bac - Hoàn Kiếm", code: "_571", province_code: "_2", district_code: "_202"},
        { label: "<b>129 Le Duan HN</b> - Hoàn Kiếm", value: "129 Le Duan HN - Hoàn Kiếm", code: "_777", province_code: "_2", district_code: "_202"},
        { label: "<b>Savina</b> - Hoàn Kiếm", value: "Savina - Hoàn Kiếm", code: "_784", province_code: "_2", district_code: "_202"},
        { label: "<b>Ha Noi Post office</b> - Hoàn Kiếm", value: "Ha Noi Post office - Hoàn Kiếm", code: "_5311", province_code: "_2", district_code: "_202"},
        { label: "<b>38-40 Le Thai To HN</b> - Hoàn Kiếm", value: "38-40 Le Thai To HN - Hoàn Kiếm", code: "_5754", province_code: "_2", district_code: "_202"},
        { label: "<b>LPB Tower HN</b> - Hoàn Kiếm", value: "LPB Tower HN - Hoàn Kiếm", code: "_6443", province_code: "_2", district_code: "_202"},
        { label: "<b>Ben tau song Hong HN</b> - Hoàn Kiếm", value: "Ben tau song Hong HN - Hoàn Kiếm", code: "_6452", province_code: "_2", district_code: "_202"},
        { label: "<b>213 Trich Sai HN</b> - Tây Hồ", value: "213 Trich Sai HN - Tây Hồ", code: "_117", province_code: "_2", district_code: "_203"},
        { label: "<b>101 Xuan La HN</b> - Tây Hồ", value: "101 Xuan La HN - Tây Hồ", code: "_156", province_code: "_2", district_code: "_203"},
        { label: "<b>Lotte Tay Ho HN</b> - Tây Hồ", value: "Lotte Tay Ho HN - Tây Hồ", code: "_177", province_code: "_2", district_code: "_203"},
        { label: "<b>48 An Duong Vuong HN</b> - Tây Hồ", value: "48 An Duong Vuong HN - Tây Hồ", code: "_250", province_code: "_2", district_code: "_203"},
        { label: "<b>Vinmart Tay Ho</b> - Tây Hồ", value: "Vinmart Tay Ho - Tây Hồ", code: "_537", province_code: "_2", district_code: "_203"},
        { label: "<b>Ho Tay Water Park</b> - Tây Hồ", value: "Ho Tay Water Park - Tây Hồ", code: "_605", province_code: "_2", district_code: "_203"},
        { label: "<b>Kiosk Ho Tay</b> - Tây Hồ", value: "Kiosk Ho Tay - Tây Hồ", code: "_626", province_code: "_2", district_code: "_203"},
        { label: "<b>Syrena</b> - Tây Hồ", value: "Syrena - Tây Hồ", code: "_803", province_code: "_2", district_code: "_203"},
        { label: "<b>181 Nhat Chieu Ha Noi</b> - Tây Hồ", value: "181 Nhat Chieu Ha Noi - Tây Hồ", code: "_6024", province_code: "_2", district_code: "_203"},
        { label: "<b>59-61 Nguyen Dinh Thi HN</b> - Tây Hồ", value: "59-61 Nguyen Dinh Thi HN - Tây Hồ", code: "_6072", province_code: "_2", district_code: "_203"},
        { label: "<b>Phuong Dong Hospital HN</b> - Tây Hồ", value: "Phuong Dong Hospital HN - Tây Hồ", code: "_6189", province_code: "_2", district_code: "_203"},
        { label: "<b>BT6 Luu Khanh Dam HN</b> - Long Biên", value: "BT6 Luu Khanh Dam HN - Long Biên", code: "_118", province_code: "_2", district_code: "_204"},
        { label: "<b>50 Chu Huy Man Lbien</b> - Long Biên", value: "50 Chu Huy Man Lbien - Long Biên", code: "_241", province_code: "_2", district_code: "_204"},
        { label: "<b>Vincom Long Bien</b> - Long Biên", value: "Vincom Long Bien - Long Biên", code: "_254", province_code: "_2", district_code: "_204"},
        { label: "<b>41 Nguyen Lam HN</b> - Long Biên", value: "41 Nguyen Lam HN - Long Biên", code: "_268", province_code: "_2", district_code: "_204"},
        { label: "<b>Golden City Long Bien</b> - Long Biên", value: "Golden City Long Bien - Long Biên", code: "_373", province_code: "_2", district_code: "_204"},
        { label: "<b>Eco City Ha Noi</b> - Long Biên", value: "Eco City Ha Noi - Long Biên", code: "_484", province_code: "_2", district_code: "_204"},
        { label: "<b>Airimex</b> - Long Biên", value: "Airimex - Long Biên", code: "_655", province_code: "_2", district_code: "_204"},
        { label: "<b>Savico HN</b> - Long Biên", value: "Savico HN - Long Biên", code: "_745", province_code: "_2", district_code: "_204"},
        { label: "<b>Aeon HN</b> - Long Biên", value: "Aeon HN - Long Biên", code: "_763", province_code: "_2", district_code: "_204"},
        { label: "<b>Vietnam Airlines JSC</b> - Long Biên", value: "Vietnam Airlines JSC - Long Biên", code: "_5755", province_code: "_2", district_code: "_204"},
        { label: "<b>Ngoc Lam Post Office HN</b> - Long Biên", value: "Ngoc Lam Post Office HN - Long Biên", code: "_6442", province_code: "_2", district_code: "_204"},
        { label: "<b>VC Tran Duy Hung HN</b> - Cầu Giấy", value: "VC Tran Duy Hung HN - Cầu Giấy", code: "_72", province_code: "_2", district_code: "_205"},
        { label: "<b>G4 Vu Pham Ham HN</b> - Cầu Giấy", value: "G4 Vu Pham Ham HN - Cầu Giấy", code: "_76", province_code: "_2", district_code: "_205"},
        { label: "<b>Indochina Tower HN</b> - Cầu Giấy", value: "Indochina Tower HN - Cầu Giấy", code: "_86", province_code: "_2", district_code: "_205"},
        { label: "<b>36 Duy Tan HN</b> - Cầu Giấy", value: "36 Duy Tan HN - Cầu Giấy", code: "_110", province_code: "_2", district_code: "_205"},
        { label: "<b>148 Nguyen Chanh HN</b> - Cầu Giấy", value: "148 Nguyen Chanh HN - Cầu Giấy", code: "_175", province_code: "_2", district_code: "_205"},
        { label: "<b>Nguyen Khanh Toan HN</b> - Cầu Giấy", value: "Nguyen Khanh Toan HN - Cầu Giấy", code: "_179", province_code: "_2", district_code: "_205"},
        { label: "<b>N06B1 Thanh Thai HN</b> - Cầu Giấy", value: "N06B1 Thanh Thai HN - Cầu Giấy", code: "_190", province_code: "_2", district_code: "_205"},
        { label: "<b>Charmvit Tower</b> - Cầu Giấy", value: "Charmvit Tower - Cầu Giấy", code: "_465", province_code: "_2", district_code: "_205"},
        { label: "<b>CTM Cau Giay Ha Noi</b> - Cầu Giấy", value: "CTM Cau Giay Ha Noi - Cầu Giấy", code: "_483", province_code: "_2", district_code: "_205"},
        { label: "<b>17T4 Hoang Dao Thuy</b> - Cầu Giấy", value: "17T4 Hoang Dao Thuy - Cầu Giấy", code: "_486", province_code: "_2", district_code: "_205"},
        { label: "<b>PVI Tower</b> - Cầu Giấy", value: "PVI Tower - Cầu Giấy", code: "_523", province_code: "_2", district_code: "_205"},
        { label: "<b>Lam Vien Complex</b> - Cầu Giấy", value: "Lam Vien Complex - Cầu Giấy", code: "_576", province_code: "_2", district_code: "_205"},
        { label: "<b>Fivimart Trang An</b> - Cầu Giấy", value: "Fivimart Trang An - Cầu Giấy", code: "_680", province_code: "_2", district_code: "_205"},
        { label: "<b>Chelsea Ha Noi</b> - Cầu Giấy", value: "Chelsea Ha Noi - Cầu Giấy", code: "_780", province_code: "_2", district_code: "_205"},
        { label: "<b>Somerset Hoa Binh</b> - Cầu Giấy", value: "Somerset Hoa Binh - Cầu Giấy", code: "_802", province_code: "_2", district_code: "_205"},
        { label: "<b>Go! Thang Long</b> - Cầu Giấy", value: "Go! Thang Long - Cầu Giấy", code: "_5736", province_code: "_2", district_code: "_205"},
        { label: "<b>FPT Pham Van Bach</b> - Cầu Giấy", value: "FPT Pham Van Bach - Cầu Giấy", code: "_5823", province_code: "_2", district_code: "_205"},
        { label: "<b>Mipec Xuan Thuy HN</b> - Cầu Giấy", value: "Mipec Xuan Thuy HN - Cầu Giấy", code: "_5899", province_code: "_2", district_code: "_205"},
        { label: "<b>789 Building HN</b> - Cầu Giấy", value: "789 Building HN - Cầu Giấy", code: "_5947", province_code: "_2", district_code: "_205"},
        { label: "<b>N04 Hoang Dao Thuy HN</b> - Cầu Giấy", value: "N04 Hoang Dao Thuy HN - Cầu Giấy", code: "_6087", province_code: "_2", district_code: "_205"},
        { label: "<b>90 Tran Thai Tong HN</b> - Cầu Giấy", value: "90 Tran Thai Tong HN - Cầu Giấy", code: "_6192", province_code: "_2", district_code: "_205"},
        { label: "<b>55 Nguyen Luong Bang</b> - Đống Đa", value: "55 Nguyen Luong Bang - Đống Đa", code: "_6", province_code: "_2", district_code: "_206"},
        { label: "<b>Hoc Vien Phu Nu VN</b> - Đống Đa", value: "Hoc Vien Phu Nu VN - Đống Đa", code: "_53", province_code: "_2", district_code: "_206"},
        { label: "<b>33 Hoang Cau HN</b> - Đống Đa", value: "33 Hoang Cau HN - Đống Đa", code: "_79", province_code: "_2", district_code: "_206"},
        { label: "<b>109 Duong Lang HN</b> - Đống Đa", value: "109 Duong Lang HN - Đống Đa", code: "_87", province_code: "_2", district_code: "_206"},
        { label: "<b>Mipec Tay Son HN</b> - Đống Đa", value: "Mipec Tay Son HN - Đống Đa", code: "_100", province_code: "_2", district_code: "_206"},
        { label: "<b>Lancaster Ha Noi</b> - Đống Đa", value: "Lancaster Ha Noi - Đống Đa", code: "_271", province_code: "_2", district_code: "_206"},
        { label: "<b>139 Hao Nam Ha Noi</b> - Đống Đa", value: "139 Hao Nam Ha Noi - Đống Đa", code: "_354", province_code: "_2", district_code: "_206"},
        { label: "<b>TNR Tower</b> - Đống Đa", value: "TNR Tower - Đống Đa", code: "_497", province_code: "_2", district_code: "_206"},
        { label: "<b>VC Pham Ngoc Thach</b> - Đống Đa", value: "VC Pham Ngoc Thach - Đống Đa", code: "_514", province_code: "_2", district_code: "_206"},
        { label: "<b>Ocean Park</b> - Đống Đa", value: "Ocean Park - Đống Đa", code: "_541", province_code: "_2", district_code: "_206"},
        { label: "<b>129 Thai Thinh</b> - Đống Đa", value: "129 Thai Thinh - Đống Đa", code: "_563", province_code: "_2", district_code: "_206"},
        { label: "<b>FiviMart Ha Dong</b> - Đống Đa", value: "FiviMart Ha Dong - Đống Đa", code: "_739", province_code: "_2", district_code: "_206"},
        { label: "<b>Pullman HN</b> - Đống Đa", value: "Pullman HN - Đống Đa", code: "_779", province_code: "_2", district_code: "_206"},
        { label: "<b>Banking Academy HN</b> - Đống Đa", value: "Banking Academy HN - Đống Đa", code: "_4736", province_code: "_2", district_code: "_206"},
        { label: "<b>Petrowaco Lang Ha HN</b> - Đống Đa", value: "Petrowaco Lang Ha HN - Đống Đa", code: "_4737", province_code: "_2", district_code: "_206"},
        { label: "<b>Mipec Long Bien HN</b> - Đống Đa", value: "Mipec Long Bien HN - Đống Đa", code: "_5818", province_code: "_2", district_code: "_206"},
        { label: "<b>VCCI Tower Dao Duy Anh HN</b> - Đống Đa", value: "VCCI Tower Dao Duy Anh HN - Đống Đa", code: "_6016", province_code: "_2", district_code: "_206"},
        { label: "<b>T11 Times City HN</b> - Hai Bà Trưng", value: "T11 Times City HN - Hai Bà Trưng", code: "_97", province_code: "_2", district_code: "_207"},
        { label: "<b>Imperia Minh Khai HN</b> - Hai Bà Trưng", value: "Imperia Minh Khai HN - Hai Bà Trưng", code: "_129", province_code: "_2", district_code: "_207"},
        { label: "<b>42 Vo Thi Sau Ha Noi</b> - Hai Bà Trưng", value: "42 Vo Thi Sau Ha Noi - Hai Bà Trưng", code: "_150", province_code: "_2", district_code: "_207"},
        { label: "<b>Sun Grand City HN</b> - Hai Bà Trưng", value: "Sun Grand City HN - Hai Bà Trưng", code: "_400", province_code: "_2", district_code: "_207"},
        { label: "<b>48 Tran Nhan Tong</b> - Hai Bà Trưng", value: "48 Tran Nhan Tong - Hai Bà Trưng", code: "_607", province_code: "_2", district_code: "_207"},
        { label: "<b>Bach Khoa University</b> - Hai Bà Trưng", value: "Bach Khoa University - Hai Bà Trưng", code: "_619", province_code: "_2", district_code: "_207"},
        { label: "<b>Hoang Thanh Tower</b> - Hai Bà Trưng", value: "Hoang Thanh Tower - Hai Bà Trưng", code: "_641", province_code: "_2", district_code: "_207"},
        { label: "<b>Vincom Ba Trieu</b> - Hai Bà Trưng", value: "Vincom Ba Trieu - Hai Bà Trưng", code: "_694", province_code: "_2", district_code: "_207"},
        { label: "<b>Park Hill 8</b> - Hai Bà Trưng", value: "Park Hill 8 - Hai Bà Trưng", code: "_711", province_code: "_2", district_code: "_207"},
        { label: "<b>VTC Online</b> - Hai Bà Trưng", value: "VTC Online - Hai Bà Trưng", code: "_760", province_code: "_2", district_code: "_207"},
        { label: "<b>Vinafor Ha Noi</b> - Hai Bà Trưng", value: "Vinafor Ha Noi - Hai Bà Trưng", code: "_773", province_code: "_2", district_code: "_207"},
        { label: "<b>Times City Ha Noi</b> - Hai Bà Trưng", value: "Times City Ha Noi - Hai Bà Trưng", code: "_782", province_code: "_2", district_code: "_207"},
        { label: "<b>TTTM Times City HN</b> - Hai Bà Trưng", value: "TTTM Times City HN - Hai Bà Trưng", code: "_5757", province_code: "_2", district_code: "_207"},
        { label: "<b>Phuong Dong Greenpark</b> - Hoàng Mai", value: "Phuong Dong Greenpark - Hoàng Mai", code: "_227", province_code: "_2", district_code: "_208"},
        { label: "<b>96 Dinh Cong Ha Noi</b> - Hoàng Mai", value: "96 Dinh Cong Ha Noi - Hoàng Mai", code: "_231", province_code: "_2", district_code: "_208"},
        { label: "<b>Sao Mai Plaza Ha Noi</b> - Hoàng Mai", value: "Sao Mai Plaza Ha Noi - Hoàng Mai", code: "_332", province_code: "_2", district_code: "_208"},
        { label: "<b>Eco Lakeview HN</b> - Hoàng Mai", value: "Eco Lakeview HN - Hoàng Mai", code: "_426", province_code: "_2", district_code: "_208"},
        { label: "<b>Gamuda Gardens</b> - Hoàng Mai", value: "Gamuda Gardens - Hoàng Mai", code: "_504", province_code: "_2", district_code: "_208"},
        { label: "<b>South Building</b> - Hoàng Mai", value: "South Building - Hoàng Mai", code: "_530", province_code: "_2", district_code: "_208"},
        { label: "<b>Ban Dao Linh Dam</b> - Hoàng Mai", value: "Ban Dao Linh Dam - Hoàng Mai", code: "_533", province_code: "_2", district_code: "_208"},
        { label: "<b>Golden Heart</b> - Hoàng Mai", value: "Golden Heart - Hoàng Mai", code: "_554", province_code: "_2", district_code: "_208"},
        { label: "<b>Truong Dinh Plaza</b> - Hoàng Mai", value: "Truong Dinh Plaza - Hoàng Mai", code: "_643", province_code: "_2", district_code: "_208"},
        { label: "<b>Tran Nguyen Dan</b> - Hoàng Mai", value: "Tran Nguyen Dan - Hoàng Mai", code: "_662", province_code: "_2", district_code: "_208"},
        { label: "<b>Dam FC</b> - Hoàng Mai", value: "Dam FC - Hoàng Mai", code: "_666", province_code: "_2", district_code: "_208"},
        { label: "<b>New Horizon</b> - Hoàng Mai", value: "New Horizon - Hoàng Mai", code: "_679", province_code: "_2", district_code: "_208"},
        { label: "<b>Feliz Home Hoang Mai HN</b> - Hoàng Mai", value: "Feliz Home Hoang Mai HN - Hoàng Mai", code: "_5902", province_code: "_2", district_code: "_208"},
        { label: "<b>Gamuda Gardens HN</b> - Hoàng Mai", value: "Gamuda Gardens HN - Hoàng Mai", code: "_6181", province_code: "_2", district_code: "_208"},
        { label: "<b>Rose Town Ngoc Hoi HN</b> - Hoàng Mai", value: "Rose Town Ngoc Hoi HN - Hoàng Mai", code: "_6456", province_code: "_2", district_code: "_208"},
        { label: "<b>Gold Season HN</b> - Thanh Xuân", value: "Gold Season HN - Thanh Xuân", code: "_29", province_code: "_2", district_code: "_209"},
        { label: "<b>230 Thuong Dinh HN</b> - Thanh Xuân", value: "230 Thuong Dinh HN - Thanh Xuân", code: "_95", province_code: "_2", district_code: "_209"},
        { label: "<b>15 Khuat Duy Tien HN</b> - Thanh Xuân", value: "15 Khuat Duy Tien HN - Thanh Xuân", code: "_172", province_code: "_2", district_code: "_209"},
        { label: "<b>Nguy Nhu Kon Tum HN</b> - Thanh Xuân", value: "Nguy Nhu Kon Tum HN - Thanh Xuân", code: "_485", province_code: "_2", district_code: "_209"},
        { label: "<b>Gold Tower</b> - Thanh Xuân", value: "Gold Tower - Thanh Xuân", code: "_455", province_code: "_2", district_code: "_209"},
        { label: "<b>Imperia Garden</b> - Thanh Xuân", value: "Imperia Garden - Thanh Xuân", code: "_489", province_code: "_2", district_code: "_209"},
        { label: "<b>Star City</b> - Thanh Xuân", value: "Star City - Thanh Xuân", code: "_618", province_code: "_2", district_code: "_209"},
        { label: "<b>495 Nguyen Trai HN</b> - Thanh Xuân", value: "495 Nguyen Trai HN - Thanh Xuân", code: "_634", province_code: "_2", district_code: "_209"},
        { label: "<b>Rivera Park</b> - Thanh Xuân", value: "Rivera Park - Thanh Xuân", code: "_638", province_code: "_2", district_code: "_209"},
        { label: "<b>Five Star Kim Giang</b> - Thanh Xuân", value: "Five Star Kim Giang - Thanh Xuân", code: "_654", province_code: "_2", district_code: "_209"},
        { label: "<b> RoyalCity HN</b> - Thanh Xuân", value: " RoyalCity HN - Thanh Xuân", code: "_787", province_code: "_2", district_code: "_209"},
        { label: "<b>Red River 68 Le Van Luong HN</b> - Thanh Xuân", value: "Red River 68 Le Van Luong HN - Thanh Xuân", code: "_5809", province_code: "_2", district_code: "_209"},
        { label: "<b>24T2 Hapulico HN</b> - Thanh Xuân", value: "24T2 Hapulico HN - Thanh Xuân", code: "_5812", province_code: "_2", district_code: "_209"},
        { label: "<b>173 Truong Chinh HN</b> - Thanh Xuân", value: "173 Truong Chinh HN - Thanh Xuân", code: "_5890", province_code: "_2", district_code: "_209"},
        { label: "<b>Ha Noi Center point</b> - Thanh Xuân", value: "Ha Noi Center point - Thanh Xuân", code: "_5948", province_code: "_2", district_code: "_209"},
        { label: "<b>Thang Long Tower HN</b> - Thanh Xuân", value: "Thang Long Tower HN - Thanh Xuân", code: "_6090", province_code: "_2", district_code: "_209"},
        { label: "<b>R3 Royal City HN</b> - Thanh Xuân", value: "R3 Royal City HN - Thanh Xuân", code: "_6445", province_code: "_2", district_code: "_209"},
        { label: "<b>Park City HN</b> - Hà Đông", value: "Park City HN - Hà Đông", code: "_85", province_code: "_2", district_code: "_210"},
        { label: "<b>Dai Hoc Dai Nam HN</b> - Hà Đông", value: "Dai Hoc Dai Nam HN - Hà Đông", code: "_105", province_code: "_2", district_code: "_210"},
        { label: "<b>Mipec Ha Dong HN</b> - Hà Đông", value: "Mipec Ha Dong HN - Hà Đông", code: "_127", province_code: "_2", district_code: "_210"},
        { label: "<b>Dai Hoc Phenikaa HN</b> - Hà Đông", value: "Dai Hoc Phenikaa HN - Hà Đông", code: "_167", province_code: "_2", district_code: "_210"},
        { label: "<b>Duong Noi Ha Dong</b> - Hà Đông", value: "Duong Noi Ha Dong - Hà Đông", code: "_333", province_code: "_2", district_code: "_210"},
        { label: "<b>CUTM6-1 To Huu HaNoi</b> - Hà Đông", value: "CUTM6-1 To Huu HaNoi - Hà Đông", code: "_353", province_code: "_2", district_code: "_210"},
        { label: "<b>Geleximco Ha Noi</b> - Hà Đông", value: "Geleximco Ha Noi - Hà Đông", code: "_358", province_code: "_2", district_code: "_210"},
        { label: "<b>Hoang Thanh Villas HN</b> - Hà Đông", value: "Hoang Thanh Villas HN - Hà Đông", code: "_412", province_code: "_2", district_code: "_210"},
        { label: "<b>Huyndai Hillsmall HN</b> - Hà Đông", value: "Huyndai Hillsmall HN - Hà Đông", code: "_425", province_code: "_2", district_code: "_210"},
        { label: "<b>Lang Viet Kieu HN</b> - Hà Đông", value: "Lang Viet Kieu HN - Hà Đông", code: "_524", province_code: "_2", district_code: "_210"},
        { label: "<b>Aeon Mall Ha Dong</b> - Hà Đông", value: "Aeon Mall Ha Dong - Hà Đông", code: "_528", province_code: "_2", district_code: "_210"},
        { label: "<b>HPC Landmark</b> - Hà Đông", value: "HPC Landmark - Hà Đông", code: "_575", province_code: "_2", district_code: "_210"},
        { label: "<b>The K Park</b> - Hà Đông", value: "The K Park - Hà Đông", code: "_599", province_code: "_2", district_code: "_210"},
        { label: "<b>Machinco</b> - Hà Đông", value: "Machinco - Hà Đông", code: "_647", province_code: "_2", district_code: "_210"},
        { label: "<b>BT5 Van Quan</b> - Hà Đông", value: "BT5 Van Quan - Hà Đông", code: "_656", province_code: "_2", district_code: "_210"},
        { label: "<b>Muong Thanh Xa La</b> - Hà Đông", value: "Muong Thanh Xa La - Hà Đông", code: "_710", province_code: "_2", district_code: "_210"},
        { label: "<b>SME Hoang Gia</b> - Hà Đông", value: "SME Hoang Gia - Hà Đông", code: "_722", province_code: "_2", district_code: "_210"},
        { label: "<b>Ho Guom Ha Dong</b> - Hà Đông", value: "Ho Guom Ha Dong - Hà Đông", code: "_755", province_code: "_2", district_code: "_210"},
        { label: "<b>Samsora Premier Chu Van An HN</b> - Hà Đông", value: "Samsora Premier Chu Van An HN - Hà Đông", code: "_5946", province_code: "_2", district_code: "_210"},
        { label: "<b>Ngoai Giao Doan HN</b> - Bắc Từ Liêm", value: "Ngoai Giao Doan HN - Bắc Từ Liêm", code: "_173", province_code: "_2", district_code: "_211"},
        { label: "<b>Mega Thang Long</b> - Bắc Từ Liêm", value: "Mega Thang Long - Bắc Từ Liêm", code: "_275", province_code: "_2", district_code: "_211"},
        { label: "<b>CT2 Nghia Do Ha Noi</b> - Bắc Từ Liêm", value: "CT2 Nghia Do Ha Noi - Bắc Từ Liêm", code: "_320", province_code: "_2", district_code: "_211"},
        { label: "<b>Ecohome 3 Ha Noi</b> - Bắc Từ Liêm", value: "Ecohome 3 Ha Noi - Bắc Từ Liêm", code: "_410", province_code: "_2", district_code: "_211"},
        { label: "<b>Kosmo Tay Ho</b> - Bắc Từ Liêm", value: "Kosmo Tay Ho - Bắc Từ Liêm", code: "_529", province_code: "_2", district_code: "_211"},
        { label: "<b>Ciputra Club</b> - Bắc Từ Liêm", value: "Ciputra Club - Bắc Từ Liêm", code: "_579", province_code: "_2", district_code: "_211"},
        { label: "<b>Green Star</b> - Bắc Từ Liêm", value: "Green Star - Bắc Từ Liêm", code: "_674", province_code: "_2", district_code: "_211"},
        { label: "<b>S4.03 VH Smart City</b> - Nam Từ Liêm", value: "S4.03 VH Smart City - Nam Từ Liêm", code: "_49", province_code: "_2", district_code: "_212"},
        { label: "<b>Dolphin Plaza HN</b> - Nam Từ Liêm", value: "Dolphin Plaza HN - Nam Từ Liêm", code: "_160", province_code: "_2", district_code: "_212"},
        { label: "<b>17T1 Vinaconex3 HN</b> - Nam Từ Liêm", value: "17T1 Vinaconex3 HN - Nam Từ Liêm", code: "_255", province_code: "_2", district_code: "_212"},
        { label: "<b>VH Smart City 1 HN</b> - Nam Từ Liêm", value: "VH Smart City 1 HN - Nam Từ Liêm", code: "_289", province_code: "_2", district_code: "_212"},
        { label: "<b>BT2 Hateco Apollo HN</b> - Nam Từ Liêm", value: "BT2 Hateco Apollo HN - Nam Từ Liêm", code: "_305", province_code: "_2", district_code: "_212"},
        { label: "<b>Florence Ha Noi</b> - Nam Từ Liêm", value: "Florence Ha Noi - Nam Từ Liêm", code: "_363", province_code: "_2", district_code: "_212"},
        { label: "<b>VC Smart City HN</b> - Nam Từ Liêm", value: "VC Smart City HN - Nam Từ Liêm", code: "_390", province_code: "_2", district_code: "_212"},
        { label: "<b>A1 Nguyen Co Thach HN</b> - Nam Từ Liêm", value: "A1 Nguyen Co Thach HN - Nam Từ Liêm", code: "_391", province_code: "_2", district_code: "_212"},
        { label: "<b>The Light Ha Noi</b> - Nam Từ Liêm", value: "The Light Ha Noi - Nam Từ Liêm", code: "_459", province_code: "_2", district_code: "_212"},
        { label: "<b>FLC 36 Pham Hung</b> - Nam Từ Liêm", value: "FLC 36 Pham Hung - Nam Từ Liêm", code: "_558", province_code: "_2", district_code: "_212"},
        { label: "<b>Vincom Skylake</b> - Nam Từ Liêm", value: "Vincom Skylake - Nam Từ Liêm", code: "_582", province_code: "_2", district_code: "_212"},
        { label: "<b>Vinhome Green Bay HN</b> - Nam Từ Liêm", value: "Vinhome Green Bay HN - Nam Từ Liêm", code: "_583", province_code: "_2", district_code: "_212"},
        { label: "<b>The Manor 2 HN</b> - Nam Từ Liêm", value: "The Manor 2 HN - Nam Từ Liêm", code: "_620", province_code: "_2", district_code: "_212"},
        { label: "<b>Vinhome Gardenia</b> - Nam Từ Liêm", value: "Vinhome Gardenia - Nam Từ Liêm", code: "_678", province_code: "_2", district_code: "_212"},
        { label: "<b>Ecolife</b> - Nam Từ Liêm", value: "Ecolife - Nam Từ Liêm", code: "_691", province_code: "_2", district_code: "_212"},
        { label: "<b>Fivimart My Dinh</b> - Nam Từ Liêm", value: "Fivimart My Dinh - Nam Từ Liêm", code: "_726", province_code: "_2", district_code: "_212"},
        { label: "<b>Sunsquare HN</b> - Nam Từ Liêm", value: "Sunsquare HN - Nam Từ Liêm", code: "_740", province_code: "_2", district_code: "_212"},
        { label: "<b>Handico Ha Noi</b> - Nam Từ Liêm", value: "Handico Ha Noi - Nam Từ Liêm", code: "_742", province_code: "_2", district_code: "_212"},
        { label: "<b>19 Nguyen Co Thach HN</b> - Nam Từ Liêm", value: "19 Nguyen Co Thach HN - Nam Từ Liêm", code: "_5813", province_code: "_2", district_code: "_212"},
        { label: "<b>Viglacera Tower HN</b> - Nam Từ Liêm", value: "Viglacera Tower HN - Nam Từ Liêm", code: "_6453", province_code: "_2", district_code: "_212"},
        { label: "<b>16B Hub Son Tay</b> - Sơn Tây", value: "16B Hub Son Tay - Sơn Tây", code: "_223", province_code: "_2", district_code: "_213"},
        { label: "<b>Post Office Chuong My HN</b> - Chương Mỹ", value: "Post Office Chuong My HN - Chương Mỹ", code: "_5815", province_code: "_2", district_code: "_215"},
        { label: "<b>LK03 TAN TAY DO HN</b> - Đan Phượng", value: "LK03 TAN TAY DO HN - Đan Phượng", code: "_296", province_code: "_2", district_code: "_216"},
        { label: "<b>Cao Lo Dong Anh</b> - Đông Anh", value: "Cao Lo Dong Anh - Đông Anh", code: "_196", province_code: "_2", district_code: "_217"},
        { label: "<b>Intracom Dong Anh HN</b> - Đông Anh", value: "Intracom Dong Anh HN - Đông Anh", code: "_202", province_code: "_2", district_code: "_217"},
        { label: "<b>The Grand Expo Dong Anh</b> - Đông Anh", value: "The Grand Expo Dong Anh - Đông Anh", code: "_5900", province_code: "_2", district_code: "_217"},
        { label: "<b>Vin University HN</b> - Gia Lâm", value: "Vin University HN - Gia Lâm", code: "_116", province_code: "_2", district_code: "_218"},
        { label: "<b>Ha Huy Tap HN</b> - Gia Lâm", value: "Ha Huy Tap HN - Gia Lâm", code: "_147", province_code: "_2", district_code: "_218"},
        { label: "<b>BH68 VH Ocean Park</b> - Gia Lâm", value: "BH68 VH Ocean Park - Gia Lâm", code: "_483", province_code: "_2", district_code: "_218"},
        { label: "<b>SH16-130 Ocean Park</b> - Gia Lâm", value: "SH16-130 Ocean Park - Gia Lâm", code: "_243", province_code: "_2", district_code: "_218"},
        { label: "<b>S2.07 VH Ocean Park</b> - Gia Lâm", value: "S2.07 VH Ocean Park - Gia Lâm", code: "_330", province_code: "_2", district_code: "_218"},
        { label: "<b>Urban Area Gia Lam</b> - Gia Lâm", value: "Urban Area Gia Lam - Gia Lâm", code: "_378", province_code: "_2", district_code: "_218"},
        { label: "<b>S2.03 VH Ocean Park</b> - Gia Lâm", value: "S2.03 VH Ocean Park - Gia Lâm", code: "_401", province_code: "_2", district_code: "_218"},
        { label: "<b>SB22 VH Ocean Park</b> - Gia Lâm", value: "SB22 VH Ocean Park - Gia Lâm", code: "_461", province_code: "_2", district_code: "_218"},
        { label: "<b>Nam An Khanh HN</b> - Hoài Đức", value: "Nam An Khanh HN - Hoài Đức", code: "_133", province_code: "_2", district_code: "_219"},
        { label: "<b>Essensia HN</b> - Hoài Đức", value: "Essensia HN - Hoài Đức", code: "_399", province_code: "_2", district_code: "_219"},
        { label: "<b>Me Linh Plaza Ha Noi</b> - Mê Linh", value: "Me Linh Plaza Ha Noi - Mê Linh", code: "_436", province_code: "_2", district_code: "_220"},
        { label: "<b>Dai Hoc FPT HN</b> - Quốc Oai", value: "Dai Hoc FPT HN - Quốc Oai", code: "_476", province_code: "_2", district_code: "_224"},
        { label: "<b>QL3 Soc Son HN</b> - Sóc Sơn", value: "QL3 Soc Son HN - Sóc Sơn", code: "_135", province_code: "_2", district_code: "_225"},
        { label: "<b>A3 T1 NoiBai Airport</b> - Sóc Sơn", value: "A3 T1 NoiBai Airport - Sóc Sơn", code: "_451", province_code: "_2", district_code: "_225"},
        { label: "<b>D8</b> - T1 Noi Bai HN</b> - Sóc Sơn", value: "D8 - T1 Noi Bai HN - Sóc Sơn", code: "_491", province_code: "_2", district_code: "_225"},
        { label: "<b>T1 Noi Bai Airport</b> - Sóc Sơn", value: "T1 Noi Bai Airport - Sóc Sơn", code: "_622", province_code: "_2", district_code: "_225"},
        { label: "<b>4T2 Noi Bai Airport</b> - Sóc Sơn", value: "4T2 Noi Bai Airport - Sóc Sơn", code: "_653", province_code: "_2", district_code: "_225"},
        { label: "<b>Warehouse Noi Bai</b> - Sóc Sơn", value: "Warehouse Noi Bai - Sóc Sơn", code: "_6089", province_code: "_2", district_code: "_225"},
        { label: "<b>FV3 FPT Hoa Lac</b> - Thạch Thất", value: "FV3 FPT Hoa Lac - Thạch Thất", code: "_5901", province_code: "_2", district_code: "_226"},
        { label: "<b>Cuong Ngo Thanh Tri</b> - Thanh Trì", value: "Cuong Ngo Thanh Tri - Thanh Trì", code: "_259", province_code: "_2", district_code: "_228"},
        { label: "<b>PVOIL CHXD Lien Ninh</b> - Thanh Trì", value: "PVOIL CHXD Lien Ninh - Thanh Trì", code: "_5465", province_code: "_2", district_code: "_228"},
        { label: "<b>2 Thang 9 Da Nang</b> - Hải Châu", value: "2 Thang 9 Da Nang - Hải Châu", code: "_7", province_code: "_3", district_code: "_301"},
        { label: "<b>VTV8 Da Nang 2</b> - Hải Châu", value: "VTV8 Da Nang 2 - Hải Châu", code: "_9", province_code: "_3", district_code: "_301"},
        { label: "<b>Misa Tower Da Nang</b> - Hải Châu", value: "Misa Tower Da Nang - Hải Châu", code: "_23", province_code: "_3", district_code: "_301"},
        { label: "<b>XVNT Da Nang</b> - Hải Châu", value: "XVNT Da Nang - Hải Châu", code: "_265", province_code: "_3", district_code: "_301"},
        { label: "<b>203 Ong Ich Khiem DN</b> - Hải Châu", value: "203 Ong Ich Khiem DN - Hải Châu", code: "_505", province_code: "_3", district_code: "_301"},
        { label: "<b>DNG Airport Arrivals</b> - Hải Châu", value: "DNG Airport Arrivals - Hải Châu", code: "_550", province_code: "_3", district_code: "_301"},
        { label: "<b>VTV8 Da Nang</b> - Hải Châu", value: "VTV8 Da Nang - Hải Châu", code: "_557", province_code: "_3", district_code: "_301"},
        { label: "<b>Nui Thanh DNG</b> - Hải Châu", value: "Nui Thanh DNG - Hải Châu", code: "_588", province_code: "_3", district_code: "_301"},
        { label: "<b>9 Dang Thuy Tram DNG</b> - Hải Châu", value: "9 Dang Thuy Tram DNG - Hải Châu", code: "_637", province_code: "_3", district_code: "_301"},
        { label: "<b>214 Tran Phu DNG</b> - Hải Châu", value: "214 Tran Phu DNG - Hải Châu", code: "_640", province_code: "_3", district_code: "_301"},
        { label: "<b>145 Quang Trung DNG</b> - Hải Châu", value: "145 Quang Trung DNG - Hải Châu", code: "_645", province_code: "_3", district_code: "_301"},
        { label: "<b>76 Duy Tan DNG</b> - Hải Châu", value: "76 Duy Tan DNG - Hải Châu", code: "_649", province_code: "_3", district_code: "_301"},
        { label: "<b>DNG Airport VIP</b> - Hải Châu", value: "DNG Airport VIP - Hải Châu", code: "_695", province_code: "_3", district_code: "_301"},
        { label: "<b>DNG Inter Airport</b> - Hải Châu", value: "DNG Inter Airport - Hải Châu", code: "_705", province_code: "_3", district_code: "_301"},
        { label: "<b>Lotte DNG</b> - Hải Châu", value: "Lotte DNG - Hải Châu", code: "_712", province_code: "_3", district_code: "_301"},
        { label: "<b>Hoang Anh Gia Lai</b> - Hải Châu", value: "Hoang Anh Gia Lai - Hải Châu", code: "_770", province_code: "_3", district_code: "_301"},
        { label: "<b>Kiosk Airport</b> - Hải Châu", value: "Kiosk Airport - Hải Châu", code: "_793", province_code: "_3", district_code: "_301"},
        { label: "<b>AirPort</b> - Hải Châu", value: "AirPort - Hải Châu", code: "_794", province_code: "_3", district_code: "_301"},
        { label: "<b>Indochina</b> - Hải Châu", value: "Indochina - Hải Châu", code: "_801", province_code: "_3", district_code: "_301"},
        { label: "<b>Ong Ich Khiem 2 DNG</b> - Hải Châu", value: "Ong Ich Khiem 2 DNG - Hải Châu", code: "_5749", province_code: "_3", district_code: "_301"},
        { label: "<b>Lotte Mart Da Nang</b> - Hải Châu", value: "Lotte Mart Da Nang - Hải Châu", code: "_6014", province_code: "_3", district_code: "_301"},
        { label: "<b>ThaiGrand Da Nang</b> - Hải Châu", value: "ThaiGrand Da Nang - Hải Châu", code: "_6450", province_code: "_3", district_code: "_301"},
        { label: "<b>338 Ng Van Linh DNG</b> - Thanh Khê", value: "338 Ng Van Linh DNG - Thanh Khê", code: "_549", province_code: "_3", district_code: "_302"},
        { label: "<b>Kim DN FC</b> - Thanh Khê", value: "Kim DN FC - Thanh Khê", code: "_664", province_code: "_3", district_code: "_302"},
        { label: "<b>239 Dien Bien Phu_DN</b> - Thanh Khê", value: "239 Dien Bien Phu_DN - Thanh Khê", code: "_681", province_code: "_3", district_code: "_302"},
        { label: "<b>957 Ng Tat Thanh DNG</b> - Thanh Khê", value: "957 Ng Tat Thanh DNG - Thanh Khê", code: "_4740", province_code: "_3", district_code: "_302"},
        { label: "<b>Hoan My Da Nang</b> - Thanh Khê", value: "Hoan My Da Nang - Thanh Khê", code: "_5956", province_code: "_3", district_code: "_302"},
        { label: "<b>Ga Da Nang</b> - Thanh Khê", value: "Ga Da Nang - Thanh Khê", code: "_6095", province_code: "_3", district_code: "_302"},
        { label: "<b>Go! Mall Da Nang</b> - Thanh Khê", value: "Go! Mall Da Nang - Thanh Khê", code: "_6194", province_code: "_3", district_code: "_302"},
        { label: "<b>233 Ng Van Thoai DNG</b> - Sơn Trà", value: "233 Ng Van Thoai DNG - Sơn Trà", code: "_75", province_code: "_3", district_code: "_303"},
        { label: "<b>Monarchy Da Nang</b> - Sơn Trà", value: "Monarchy Da Nang - Sơn Trà", code: "_306", province_code: "_3", district_code: "_303"},
        { label: "<b>517 Tran Hung Dao DN</b> - Sơn Trà", value: "517 Tran Hung Dao DN - Sơn Trà", code: "_398", province_code: "_3", district_code: "_303"},
        { label: "<b>Azura Da Nang</b> - Sơn Trà", value: "Azura Da Nang - Sơn Trà", code: "_518", province_code: "_3", district_code: "_303"},
        { label: "<b>95 NG Van Thoai DNG</b> - Sơn Trà", value: "95 NG Van Thoai DNG - Sơn Trà", code: "_540", province_code: "_3", district_code: "_303"},
        { label: "<b>Vincom Da Nang</b> - Sơn Trà", value: "Vincom Da Nang - Sơn Trà", code: "_772", province_code: "_3", district_code: "_303"},
        { label: "<b>Celia Nesta Da Nang</b> - Sơn Trà", value: "Celia Nesta Da Nang - Sơn Trà", code: "_6023", province_code: "_3", district_code: "_303"},
        { label: "<b>Thanh Da Nang</b> - Sơn Trà", value: "Thanh Da Nang - Sơn Trà", code: "_6082", province_code: "_3", district_code: "_303"},
        { label: "<b>A-04 Vo Nguyen Giap Da Nang</b> - Sơn Trà", value: "A-04 Vo Nguyen Giap Da Nang - Sơn Trà", code: "_6187", province_code: "_3", district_code: "_303"},
        { label: "<b>FPT Complex Da Nang</b> - Ngũ Hành Sơn", value: "FPT Complex Da Nang - Ngũ Hành Sơn", code: "_73", province_code: "_3", district_code: "_304"},
        { label: "<b>Nesta Hotel Da Nang</b> - Ngũ Hành Sơn", value: "Nesta Hotel Da Nang - Ngũ Hành Sơn", code: "_315", province_code: "_3", district_code: "_304"},
        { label: "<b>Thanh Quang Nam</b> - Ngũ Hành Sơn", value: "Thanh Quang Nam - Ngũ Hành Sơn", code: "_6083", province_code: "_3", district_code: "_304"},
        { label: "<b>Nguyen Tat Thanh DNG</b> - Liên Chiểu", value: "Nguyen Tat Thanh DNG - Liên Chiểu", code: "_326", province_code: "_3", district_code: "_305"},
        { label: "<b>277 Ton Duc ThangDNG</b> - Liên Chiểu", value: "277 Ton Duc ThangDNG - Liên Chiểu", code: "_488", province_code: "_3", district_code: "_305"},
        { label: "<b>68 Ngo Van So DNG</b> - Liên Chiểu", value: "68 Ngo Van So DNG - Liên Chiểu", code: "_490", province_code: "_3", district_code: "_305"},
        { label: "<b>Dai Hoc Su Pham DNG</b> - Liên Chiểu", value: "Dai Hoc Su Pham DNG - Liên Chiểu", code: "_534", province_code: "_3", district_code: "_305"},
        { label: "<b>Mega Mall Da Nang</b> - Liên Chiểu", value: "Mega Mall Da Nang - Liên Chiểu", code: "_6196", province_code: "_3", district_code: "_305"},
        { label: "<b>29 Thang 3 Da Nang</b> - Cẩm Lệ", value: "29 Thang 3 Da Nang - Cẩm Lệ", code: "_204", province_code: "_3", district_code: "_306"},
        { label: "<b>Mega Market Da Nang</b> - Cẩm Lệ", value: "Mega Market Da Nang - Cẩm Lệ", code: "_317", province_code: "_3", district_code: "_306"},
        { label: "<b>Nguyen Huu Tho</b> - Cẩm Lệ", value: "Nguyen Huu Tho - Cẩm Lệ", code: "_693", province_code: "_3", district_code: "_306"},
        { label: "<b>Ba Na Hill Da Nang</b> - Hòa Vang", value: "Ba Na Hill Da Nang - Hòa Vang", code: "_5748", province_code: "_3", district_code: "_307"},
        { label: "<b>Ba Na Hill 2 Da Nang</b> - Hòa Vang", value: "Ba Na Hill 2 Da Nang - Hòa Vang", code: "_5958", province_code: "_3", district_code: "_307"},
        { label: "<b>Tran Van Kheo CanTho</b> - Ninh Kiều", value: "Tran Van Kheo CanTho - Ninh Kiều", code: "_199", province_code: "_4", district_code: "_401"},
        { label: "<b>91 3/2 Can Tho</b> - Ninh Kiều", value: "91 3/2 Can Tho - Ninh Kiều", code: "_88", province_code: "_4", district_code: "_401"},
        { label: "<b>Huynh Cuong Can Tho</b> - Ninh Kiều", value: "Huynh Cuong Can Tho - Ninh Kiều", code: "_481", province_code: "_4", district_code: "_401"},
        { label: "<b>CV Song Hau Can Tho</b> - Ninh Kiều", value: "CV Song Hau Can Tho - Ninh Kiều", code: "_195", province_code: "_4", district_code: "_401"},
        { label: "<b>TTC Hotel Can Tho</b> - Ninh Kiều", value: "TTC Hotel Can Tho - Ninh Kiều", code: "_463", province_code: "_4", district_code: "_401"},
        { label: "<b>398R Ng Van Cu CT</b> - Ninh Kiều", value: "398R Ng Van Cu CT - Ninh Kiều", code: "_508", province_code: "_4", district_code: "_401"},
        { label: "<b>No.01 3/2 Can Tho</b> - Ninh Kiều", value: "No.01 3/2 Can Tho - Ninh Kiều", code: "_651", province_code: "_4", district_code: "_401"},
        { label: "<b>Vincom Xuan Khanh</b> - Ninh Kiều", value: "Vincom Xuan Khanh - Ninh Kiều", code: "_730", province_code: "_4", district_code: "_401"},
        { label: "<b>Sense Can Tho</b> - Ninh Kiều", value: "Sense Can Tho - Ninh Kiều", code: "_734", province_code: "_4", district_code: "_401"},
        { label: "<b>Lotte Can Tho</b> - Ninh Kiều", value: "Lotte Can Tho - Ninh Kiều", code: "_766", province_code: "_4", district_code: "_401"},
        { label: "<b>Vincom Can Tho</b> - Ninh Kiều", value: "Vincom Can Tho - Ninh Kiều", code: "_771", province_code: "_4", district_code: "_401"},
        { label: "<b>Thanh Can Tho</b> - Ninh Kiều", value: "Thanh Can Tho - Ninh Kiều", code: "_6084", province_code: "_4", district_code: "_401"},
        { label: "<b>Hoan My Cuu Long</b> - Cái Răng", value: "Hoan My Cuu Long - Cái Răng", code: "_5734", province_code: "_4", district_code: "_403"},
        { label: "<b>Go! Can Tho</b> - Cái Răng", value: "Go! Can Tho - Cái Răng", code: "_6201", province_code: "_4", district_code: "_403"},
        { label: "<b>PVOil No.4 QL91 Can Tho</b> - Ô Môn", value: "PVOil No.4 QL91 Can Tho - Ô Môn", code: "_5467", province_code: "_4", district_code: "_404"},
        { label: "<b>PVOil Petec Nga Ba Lo Te Can Tho</b> - Thốt Nốt", value: "PVOil Petec Nga Ba Lo Te Can Tho - Thốt Nốt", code: "_5739", province_code: "_4", district_code: "_405"},
        { label: "<b>Da Tuong 2 Nha Trang</b> - TP. Nha Trang", value: "Da Tuong 2 Nha Trang - TP. Nha Trang", code: "_19", province_code: "_5", district_code: "_501"},
        { label: "<b>Vien Dong hotel 2</b> - TP. Nha Trang", value: "Vien Dong hotel 2 - TP. Nha Trang", code: "_56", province_code: "_5", district_code: "_501"},
        { label: "<b>Thong Nhat Nha Trang</b> - TP. Nha Trang", value: "Thong Nhat Nha Trang - TP. Nha Trang", code: "_106", province_code: "_5", district_code: "_501"},
        { label: "<b>Pham Van Dong Ntrang</b> - TP. Nha Trang", value: "Pham Van Dong Ntrang - TP. Nha Trang", code: "_193", province_code: "_5", district_code: "_501"},
        { label: "<b>Vinwonders Nha Trang</b> - TP. Nha Trang", value: "Vinwonders Nha Trang - TP. Nha Trang", code: "_233", province_code: "_5", district_code: "_501"},
        { label: "<b>Panorama Nha Trang</b> - TP. Nha Trang", value: "Panorama Nha Trang - TP. Nha Trang", code: "_295", province_code: "_5", district_code: "_501"},
        { label: "<b>26 Hong Bang N.Trang</b> - TP. Nha Trang", value: "26 Hong Bang N.Trang - TP. Nha Trang", code: "_322", province_code: "_5", district_code: "_501"},
        { label: "<b>Thanh Nha Trang-FC</b> - TP. Nha Trang", value: "Thanh Nha Trang-FC - TP. Nha Trang", code: "_457", province_code: "_5", district_code: "_501"},
        { label: "<b>Vinh Diem Trung NT</b> - TP. Nha Trang", value: "Vinh Diem Trung NT - TP. Nha Trang", code: "_482", province_code: "_5", district_code: "_501"},
        { label: "<b>112 Hai Thang Tu NT</b> - TP. Nha Trang", value: "112 Hai Thang Tu NT - TP. Nha Trang", code: "_498", province_code: "_5", district_code: "_501"},
        { label: "<b>108 Le Hong Phong NT</b> - TP. Nha Trang", value: "108 Le Hong Phong NT - TP. Nha Trang", code: "_502", province_code: "_5", district_code: "_501"},
        { label: "<b>105 Da Tuong NT</b> - TP. Nha Trang", value: "105 Da Tuong NT - TP. Nha Trang", code: "_512", province_code: "_5", district_code: "_501"},
        { label: "<b>Florida Hotel NT</b> - TP. Nha Trang", value: "Florida Hotel NT - TP. Nha Trang", code: "_548", province_code: "_5", district_code: "_501"},
        { label: "<b>Star City NT</b> - TP. Nha Trang", value: "Star City NT - TP. Nha Trang", code: "_561", province_code: "_5", district_code: "_501"},
        { label: "<b>Le Thanh Phuong NT</b> - TP. Nha Trang", value: "Le Thanh Phuong NT - TP. Nha Trang", code: "_572", province_code: "_5", district_code: "_501"},
        { label: "<b>Vietsky Hotel NT</b> - TP. Nha Trang", value: "Vietsky Hotel NT - TP. Nha Trang", code: "_594", province_code: "_5", district_code: "_501"},
        { label: "<b>12 Han Thuyen</b> - TP. Nha Trang", value: "12 Han Thuyen - TP. Nha Trang", code: "_658", province_code: "_5", district_code: "_501"},
        { label: "<b>Vincom Nha Trang</b> - TP. Nha Trang", value: "Vincom Nha Trang - TP. Nha Trang", code: "_672", province_code: "_5", district_code: "_501"},
        { label: "<b>Citadine Hotel</b> - TP. Nha Trang", value: "Citadine Hotel - TP. Nha Trang", code: "_701", province_code: "_5", district_code: "_501"},
        { label: "<b>Lotte Nha Trang</b> - TP. Nha Trang", value: "Lotte Nha Trang - TP. Nha Trang", code: "_738", province_code: "_5", district_code: "_501"},
        { label: "<b>No.10 & No.28 Nha Trang</b> - TP. Nha Trang", value: "No.10 & No.28 Nha Trang - TP. Nha Trang", code: "_5898", province_code: "_5", district_code: "_501"},
        { label: "<b>Dang Tat Nha Trang</b> - TP. Nha Trang", value: "Dang Tat Nha Trang - TP. Nha Trang", code: "_6017", province_code: "_5", district_code: "_501"},
        { label: "<b>43C Hai Thang Tu Nha Trang</b> - TP. Nha Trang", value: "43C Hai Thang Tu Nha Trang - TP. Nha Trang", code: "_6022", province_code: "_5", district_code: "_501"},
        { label: "<b>Cam Ranh Airport 2</b> - INTL</b> - Cam Ranh", value: "Cam Ranh Airport 2 - INTL - Cam Ranh", code: "_6197", province_code: "_5", district_code: "_502"},
        { label: "<b>3 Thang 4 Cam Ranh</b> - Cam Ranh", value: "3 Thang 4 Cam Ranh - Cam Ranh", code: "_335", province_code: "_5", district_code: "_502"},
        { label: "<b>Cam Ranh Airport</b> - Cam Ranh", value: "Cam Ranh Airport - Cam Ranh", code: "_355", province_code: "_5", district_code: "_502"},
        { label: "<b>Vincom Bien Hoa 2</b> - TP. Biên Hòa", value: "Vincom Bien Hoa 2 - TP. Biên Hòa", code: "_31", province_code: "_6", district_code: "_601"},
        { label: "<b>396 Nguyen Ai Quoc</b> - TP. Biên Hòa", value: "396 Nguyen Ai Quoc - TP. Biên Hòa", code: "_158", province_code: "_6", district_code: "_601"},
        { label: "<b>972 Dong Khoi BH</b> - TP. Biên Hòa", value: "972 Dong Khoi BH - TP. Biên Hòa", code: "_272", province_code: "_6", district_code: "_601"},
        { label: "<b>Sonadezi Tower</b> - TP. Biên Hòa", value: "Sonadezi Tower - TP. Biên Hòa", code: "_293", province_code: "_6", district_code: "_601"},
        { label: "<b>Phan Dinh Phung BH</b> - TP. Biên Hòa", value: "Phan Dinh Phung BH - TP. Biên Hòa", code: "_344", province_code: "_6", district_code: "_601"},
        { label: "<b>Tran Quoc Toan BH</b> - TP. Biên Hòa", value: "Tran Quoc Toan BH - TP. Biên Hòa", code: "_431", province_code: "_6", district_code: "_601"},
        { label: "<b>707Pham Van Thuan DN</b> - TP. Biên Hòa", value: "707Pham Van Thuan DN - TP. Biên Hòa", code: "_499", province_code: "_6", district_code: "_601"},
        { label: "<b>8C1 Dong Khoi BH</b> - TP. Biên Hòa", value: "8C1 Dong Khoi BH - TP. Biên Hòa", code: "_560", province_code: "_6", district_code: "_601"},
        { label: "<b>Lotte Dong Nai</b> - TP. Biên Hòa", value: "Lotte Dong Nai - TP. Biên Hòa", code: "_642", province_code: "_6", district_code: "_601"},
        { label: "<b>210 No.5 Bien Hoa</b> - TP. Biên Hòa", value: "210 No.5 Bien Hoa - TP. Biên Hòa", code: "_644", province_code: "_6", district_code: "_601"},
        { label: "<b>779 Nguyen Ai Quoc</b> - TP. Biên Hòa", value: "779 Nguyen Ai Quoc - TP. Biên Hòa", code: "_671", province_code: "_6", district_code: "_601"},
        { label: "<b>08 Nguyen Ai Quoc</b> - TP. Biên Hòa", value: "08 Nguyen Ai Quoc - TP. Biên Hòa", code: "_683", province_code: "_6", district_code: "_601"},
        { label: "<b>K24 Vo Thi Sau</b> - TP. Biên Hòa", value: "K24 Vo Thi Sau - TP. Biên Hòa", code: "_713", province_code: "_6", district_code: "_601"},
        { label: "<b>Hung Dao Vuong-DN</b> - TP. Biên Hòa", value: "Hung Dao Vuong-DN - TP. Biên Hòa", code: "_725", province_code: "_6", district_code: "_601"},
        { label: "<b>Hotel Dong Nai</b> - TP. Biên Hòa", value: "Hotel Dong Nai - TP. Biên Hòa", code: "_752", province_code: "_6", district_code: "_601"},
        { label: "<b>Big C Tan Hiep</b> - TP. Biên Hòa", value: "Big C Tan Hiep - TP. Biên Hòa", code: "_753", province_code: "_6", district_code: "_601"},
        { label: "<b>Go! Dong Nai</b> - TP. Biên Hòa", value: "Go! Dong Nai - TP. Biên Hòa", code: "_5752", province_code: "_6", district_code: "_601"},
        { label: "<b>Hoan My Bien Hoa</b> - TP. Biên Hòa", value: "Hoan My Bien Hoa - TP. Biên Hòa", code: "_5959", province_code: "_6", district_code: "_601"},
        { label: "<b>132 Bui Van Hoa Bien Hoa</b> - TP. Biên Hòa", value: "132 Bui Van Hoa Bien Hoa - TP. Biên Hòa", code: "_6021", province_code: "_6", district_code: "_601"},
        { label: "<b>1 NTMK Long Khanh</b> - TP. Long Khánh", value: "1 NTMK Long Khanh - TP. Long Khánh", code: "_219", province_code: "_6", district_code: "_602"},
        { label: "<b>Hung Vuong LongKhanh</b> - TP. Long Khánh", value: "Hung Vuong LongKhanh - TP. Long Khánh", code: "_253", province_code: "_6", district_code: "_602"},
        { label: "<b>Le Duan Long Thanh 2</b> - Long Thành", value: "Le Duan Long Thanh 2 - Long Thành", code: "_168", province_code: "_6", district_code: "_603"},
        { label: "<b>299 Le Duan LT</b> - Long Thành", value: "299 Le Duan LT - Long Thành", code: "_569", province_code: "_6", district_code: "_603"},
        { label: "<b>KCN Nhon Trach 3</b> - Nhơn Trạch", value: "KCN Nhon Trach 3 - Nhơn Trạch", code: "_5312", province_code: "_6", district_code: "_604"},
        { label: "<b>Hung Vuong Trang Bom</b> - Trảng Bom", value: "Hung Vuong Trang Bom - Trảng Bom", code: "_282", province_code: "_6", district_code: "_605"},
        { label: "<b>10 Ba Thang Hai DN</b> - Trảng Bom", value: "10 Ba Thang Hai DN - Trảng Bom", code: "_492", province_code: "_6", district_code: "_605"},
        { label: "<b>Pvoil Thanh To Hai Phong</b> - Hải An", value: "Pvoil Thanh To Hai Phong - Hải An", code: "_48", province_code: "_7", district_code: "_703"},
        { label: "<b>Go! Mall Hai Phong</b> - Hải An", value: "Go! Mall Hai Phong - Hải An", code: "_174", province_code: "_7", district_code: "_703"},
        { label: "<b>San Bay Cat Bi</b> - Hải An", value: "San Bay Cat Bi - Hải An", code: "_699", province_code: "_7", district_code: "_703"},
        { label: "<b>Dinh Vu Plaza Hai Phong</b> - Hải An", value: "Dinh Vu Plaza Hai Phong - Hải An", code: "_5897", province_code: "_7", district_code: "_703"},
        { label: "<b>125 Tran Thanh Ngo HP</b> - Kiến An", value: "125 Tran Thanh Ngo HP - Kiến An", code: "_417", province_code: "_7", district_code: "_704"},
        { label: "<b>SH Imperial HP</b> - Hồng Bàng", value: "SH Imperial HP - Hồng Bàng", code: "_591", province_code: "_7", district_code: "_705"},
        { label: "<b>Vincom Imperia HP</b> - Hồng Bàng", value: "Vincom Imperia HP - Hồng Bàng", code: "_597", province_code: "_7", district_code: "_705"},
        { label: "<b>Quang Trung HP</b> - Hồng Bàng", value: "Quang Trung HP - Hồng Bàng", code: "_715", province_code: "_7", district_code: "_705"},
        { label: "<b>Huu Nghi Hai Phong</b> - Hồng Bàng", value: "Huu Nghi Hai Phong - Hồng Bàng", code: "_769", province_code: "_7", district_code: "_705"},
        { label: "<b>103 Tam Bac HP</b> - Hồng Bàng", value: "103 Tam Bac HP - Hồng Bàng", code: "_5891", province_code: "_7", district_code: "_705"},
        { label: "<b>Post Office Hai Phong</b> - Hồng Bàng", value: "Post Office Hai Phong - Hồng Bàng", code: "_5896", province_code: "_7", district_code: "_705"},
        { label: "<b>KDT Nga 5 Cat Bi HP</b> - Ngô Quyền", value: "KDT Nga 5 Cat Bi HP - Ngô Quyền", code: "_256", province_code: "_7", district_code: "_706"},
        { label: "<b>274 Da Nang HaiPhong</b> - Ngô Quyền", value: "274 Da Nang HaiPhong - Ngô Quyền", code: "_369", province_code: "_7", district_code: "_706"},
        { label: "<b>2A Le Hong Phong HP</b> - Ngô Quyền", value: "2A Le Hong Phong HP - Ngô Quyền", code: "_507", province_code: "_7", district_code: "_706"},
        { label: "<b>Van Cao</b> - Ngô Quyền", value: "Van Cao - Ngô Quyền", code: "_581", province_code: "_7", district_code: "_706"},
        { label: "<b>Vien Thong Hai Phong</b> - Ngô Quyền", value: "Vien Thong Hai Phong - Ngô Quyền", code: "_747", province_code: "_7", district_code: "_706"},
        { label: "<b>Sholega Hai Phong</b> - Ngô Quyền", value: "Sholega Hai Phong - Ngô Quyền", code: "_754", province_code: "_7", district_code: "_706"},
        { label: "<b>Tran Phu Hai Phong</b> - Ngô Quyền", value: "Tran Phu Hai Phong - Ngô Quyền", code: "_759", province_code: "_7", district_code: "_706"},
        { label: "<b>Vincom Hai Phong</b> - Ngô Quyền", value: "Vincom Hai Phong - Ngô Quyền", code: "_768", province_code: "_7", district_code: "_706"},
        { label: "<b>Cung Van Hoa 45 Lach Tray HP</b> - Ngô Quyền", value: "Cung Van Hoa 45 Lach Tray HP - Ngô Quyền", code: "_6198", province_code: "_7", district_code: "_706"},
        { label: "<b>Tran Nguyen Han HP</b> - Lê Chân", value: "Tran Nguyen Han HP - Lê Chân", code: "_200", province_code: "_7", district_code: "_707"},
        { label: "<b>120 Hai Ba Trung HP</b> - Lê Chân", value: "120 Hai Ba Trung HP - Lê Chân", code: "_77", province_code: "_7", district_code: "_707"},
        { label: "<b>Hoang Huy Hai Phong</b> - Lê Chân", value: "Hoang Huy Hai Phong - Lê Chân", code: "_104", province_code: "_7", district_code: "_707"},
        { label: "<b>Water Front HaiPhong</b> - Lê Chân", value: "Water Front HaiPhong - Lê Chân", code: "_109", province_code: "_7", district_code: "_707"},
        { label: "<b>Aeon Mall Hai Phong</b> - Lê Chân", value: "Aeon Mall Hai Phong - Lê Chân", code: "_473", province_code: "_7", district_code: "_707"},
        { label: "<b>Pruksa Hai Phong</b> - An Dương", value: "Pruksa Hai Phong - An Dương", code: "_360", province_code: "_7", district_code: "_708"},
        { label: "<b>PVoil An Hai Hai Phong</b> - An Dương", value: "PVoil An Hai Hai Phong - An Dương", code: "_5746", province_code: "_7", district_code: "_708"},
        { label: "<b>Vinfast Factory HP</b> - Cát Hải", value: "Vinfast Factory HP - Cát Hải", code: "_67", province_code: "_7", district_code: "_711"},
        { label: "<b>Vinfast Hai Phong</b> - Cát Hải", value: "Vinfast Hai Phong - Cát Hải", code: "_630", province_code: "_7", district_code: "_711"},
        { label: "<b>Cable Car Cat Hai HP</b> - Cát Hải", value: "Cable Car Cat Hai HP - Cát Hải", code: "_5313", province_code: "_7", district_code: "_711"},
        { label: "<b>Sun Cat Ba HP</b> - Cát Hải", value: "Sun Cat Ba HP - Cát Hải", code: "_5756", province_code: "_7", district_code: "_711"},
        { label: "<b>Bach Dang HP</b> - Thủy Nguyên", value: "Bach Dang HP - Thủy Nguyên", code: "_531", province_code: "_7", district_code: "_715"},
        { label: "<b>Rest stop V52 1 CT HP-HN</b> - Thủy Nguyên", value: "Rest stop V52 1 CT HP-HN - Thủy Nguyên", code: "_5810", province_code: "_7", district_code: "_715"},
        { label: "<b>Rest stop V52 2 CT HN-HP</b> - Thủy Nguyên", value: "Rest stop V52 2 CT HN-HP - Thủy Nguyên", code: "_5811", province_code: "_7", district_code: "_715"},
        { label: "<b>Pho Moi Thuy Nguyen HP</b> - Thủy Nguyên", value: "Pho Moi Thuy Nguyen HP - Thủy Nguyên", code: "_5950", province_code: "_7", district_code: "_715"},
        { label: "<b>Vincom Vu Yen Hai Phong</b> - Thủy Nguyên", value: "Vincom Vu Yen Hai Phong - Thủy Nguyên", code: "_6009", province_code: "_7", district_code: "_715"},
        { label: "<b>Thanh Cua Dong</b> - TP. Vinh", value: "Thanh Cua Dong - TP. Vinh", code: "_69", province_code: "_13", district_code: "_1301"},
        { label: "<b>Tran Phu Vinh</b> - TP. Vinh", value: "Tran Phu Vinh - TP. Vinh", code: "_134", province_code: "_13", district_code: "_1301"},
        { label: "<b>Vinh Airport-2.1 ISO</b> - TP. Vinh", value: "Vinh Airport-2.1 ISO - TP. Vinh", code: "_136", province_code: "_13", district_code: "_1301"},
        { label: "<b>Vinh Airport-2.4</b> - TP. Vinh", value: "Vinh Airport-2.4 - TP. Vinh", code: "_137", province_code: "_13", district_code: "_1301"},
        { label: "<b>Lotte Mart Vinh</b> - TP. Vinh", value: "Lotte Mart Vinh - TP. Vinh", code: "_367", province_code: "_13", district_code: "_1301"},
        { label: "<b>Cong Vien Vinh</b> - TP. Vinh", value: "Cong Vien Vinh - TP. Vinh", code: "_511", province_code: "_13", district_code: "_1301"},
        { label: "<b>City Hub Vinh</b> - TP. Vinh", value: "City Hub Vinh - TP. Vinh", code: "_562", province_code: "_13", district_code: "_1301"},
        { label: "<b>Vinh Centre</b> - TP. Vinh", value: "Vinh Centre - TP. Vinh", code: "_566", province_code: "_13", district_code: "_1301"},
        { label: "<b>Vinh FC</b> - TP. Vinh", value: "Vinh FC - TP. Vinh", code: "_663", province_code: "_13", district_code: "_1301"},
        { label: "<b>Huu Nghi-Vinh</b> - TP. Vinh", value: "Huu Nghi-Vinh - TP. Vinh", code: "_714", province_code: "_13", district_code: "_1301"},
        { label: "<b>Big C Vinh</b> - TP. Vinh", value: "Big C Vinh - TP. Vinh", code: "_717", province_code: "_13", district_code: "_1301"},
        { label: "<b>QT09-11 Vincom Shophouse Vinh</b> - TP. Vinh", value: "QT09-11 Vincom Shophouse Vinh - TP. Vinh", code: "_6075", province_code: "_13", district_code: "_1301"},
        { label: "<b>Thanh Bac Ninh</b> - TP. Bắc Ninh", value: "Thanh Bac Ninh - TP. Bắc Ninh", code: "_149", province_code: "_48", district_code: "_4801"},
        { label: "<b>Viglacera Bac Ninh</b> - TP. Bắc Ninh", value: "Viglacera Bac Ninh - TP. Bắc Ninh", code: "_351", province_code: "_48", district_code: "_4801"},
        { label: "<b>Thanh Binh Bac Ninh</b> - TP. Bắc Ninh", value: "Thanh Binh Bac Ninh - TP. Bắc Ninh", code: "_370", province_code: "_48", district_code: "_4801"},
        { label: "<b>Mandala Hotel B.Ninh</b> - TP. Bắc Ninh", value: "Mandala Hotel B.Ninh - TP. Bắc Ninh", code: "_475", province_code: "_48", district_code: "_4801"},
        { label: "<b>Vincom Bac Ninh</b> - TP. Bắc Ninh", value: "Vincom Bac Ninh - TP. Bắc Ninh", code: "_627", province_code: "_48", district_code: "_4801"},
        { label: "<b>Nguyen Cao</b> - TP. Bắc Ninh", value: "Nguyen Cao - TP. Bắc Ninh", code: "_635", province_code: "_48", district_code: "_4801"},
        { label: "<b>148 Ly Anh Tong Bac Ninh</b> - TP. Bắc Ninh", value: "148 Ly Anh Tong Bac Ninh - TP. Bắc Ninh", code: "_6076", province_code: "_48", district_code: "_4801"},
        { label: "<b>386 Tran Phu Tu Son</b> - Từ Sơn", value: "386 Tran Phu Tu Son - Từ Sơn", code: "_435", province_code: "_48", district_code: "_4802"},
        { label: "<b>Tu Son Super Market</b> - Từ Sơn", value: "Tu Son Super Market - Từ Sơn", code: "_692", province_code: "_48", district_code: "_4802"},
        { label: "<b>Golden Park BN</b> - Quế Võ", value: "Golden Park BN - Quế Võ", code: "_395", province_code: "_48", district_code: "_4805"},
        { label: "<b>Frasers KCN Yen Phong BN</b> - Yên Phong", value: "Frasers KCN Yen Phong BN - Yên Phong", code: "_5747", province_code: "_48", district_code: "_4808"},
        { label: "<b>Frasers 2 KCN Yen Phong BN</b> - Yên Phong", value: "Frasers 2 KCN Yen Phong BN - Yên Phong", code: "_5758", province_code: "_48", district_code: "_4808"},
        { label: "<b>DH Quoc Te Mien Dong</b> - TP. Thủ Dầu Một", value: "DH Quoc Te Mien Dong - TP. Thủ Dầu Một", code: "_1", province_code: "_17", district_code: "_1701"},
        { label: "<b>621A Dai Lo Binh Duong</b> - TP. Thủ Dầu Một", value: "621A Dai Lo Binh Duong - TP. Thủ Dầu Một", code: "_94", province_code: "_17", district_code: "_1701"},
        { label: "<b>30/4 Thu Dau Mot</b> - TP. Thủ Dầu Một", value: "30/4 Thu Dau Mot - TP. Thủ Dầu Một", code: "_139", province_code: "_17", district_code: "_1701"},
        { label: "<b>World Trade Center</b> - TP. Thủ Dầu Một", value: "World Trade Center - TP. Thủ Dầu Một", code: "_277", province_code: "_17", district_code: "_1701"},
        { label: "<b>No.8 Thu Dau Mot</b> - TP. Thủ Dầu Một", value: "No.8 Thu Dau Mot - TP. Thủ Dầu Một", code: "_348", province_code: "_17", district_code: "_1701"},
        { label: "<b>Sora II Binh Duong</b> - TP. Thủ Dầu Một", value: "Sora II Binh Duong - TP. Thủ Dầu Một", code: "_434", province_code: "_17", district_code: "_1701"},
        { label: "<b>265 Phu Loi BDG</b> - TP. Thủ Dầu Một", value: "265 Phu Loi BDG - TP. Thủ Dầu Một", code: "_447", province_code: "_17", district_code: "_1701"},
        { label: "<b>Midori Park BDG</b> - TP. Thủ Dầu Một", value: "Midori Park BDG - TP. Thủ Dầu Một", code: "_521", province_code: "_17", district_code: "_1701"},
        { label: "<b>540 Dai Lo BinhDuong</b> - TP. Thủ Dầu Một", value: "540 Dai Lo BinhDuong - TP. Thủ Dầu Một", code: "_621", province_code: "_17", district_code: "_1701"},
        { label: "<b>Binh Duong Square</b> - TP. Thủ Dầu Một", value: "Binh Duong Square - TP. Thủ Dầu Một", code: "_718", province_code: "_17", district_code: "_1701"},
        { label: "<b>Coopmark-Binh Duong</b> - TP. Thủ Dầu Một", value: "Coopmark-Binh Duong - TP. Thủ Dầu Một", code: "_724", province_code: "_17", district_code: "_1701"},
        { label: "<b>325 Dai Lo BinhDuong</b> - TP. Thủ Dầu Một", value: "325 Dai Lo BinhDuong - TP. Thủ Dầu Một", code: "_729", province_code: "_17", district_code: "_1701"},
        { label: "<b>Nguyen Kim BinhDuong</b> - TP. Thủ Dầu Một", value: "Nguyen Kim BinhDuong - TP. Thủ Dầu Một", code: "_765", province_code: "_17", district_code: "_1701"},
        { label: "<b>D1 Thu Dau Mot Binh Duong</b> - TP. Thủ Dầu Một", value: "D1 Thu Dau Mot Binh Duong - TP. Thủ Dầu Một", code: "_6020", province_code: "_17", district_code: "_1701"},
        { label: "<b>22 thang 12 Thuan An</b> - Thuận An", value: "22 thang 12 Thuan An - Thuận An", code: "_108", province_code: "_17", district_code: "_1702"},
        { label: "<b>27 Dai Lo Binh Duong</b> - Thuận An", value: "27 Dai Lo Binh Duong - Thuận An", code: "_239", province_code: "_17", district_code: "_1702"},
        { label: "<b>Nguyen Van Tiet BD 2</b> - Thuận An", value: "Nguyen Van Tiet BD 2 - Thuận An", code: "_286", province_code: "_17", district_code: "_1702"},
        { label: "<b>VietSing Residence</b> - Thuận An", value: "VietSing Residence - Thuận An", code: "_308", province_code: "_17", district_code: "_1702"},
        { label: "<b>43Phan Dinh Phung BD</b> - Thuận An", value: "43Phan Dinh Phung BD - Thuận An", code: "_601", province_code: "_17", district_code: "_1702"},
        { label: "<b>Nguyen Van Tiet BD</b> - Thuận An", value: "Nguyen Van Tiet BD - Thuận An", code: "_633", province_code: "_17", district_code: "_1702"},
        { label: "<b>Lotte Mart BD</b> - Thuận An", value: "Lotte Mart BD - Thuận An", code: "_707", province_code: "_17", district_code: "_1702"},
        { label: "<b>Aeon Binh Duong</b> - Thuận An", value: "Aeon Binh Duong - Thuận An", code: "_778", province_code: "_17", district_code: "_1702"},
        { label: "<b>Hanh Phuc Hospital</b> - Thuận An", value: "Hanh Phuc Hospital - Thuận An", code: "_5463", province_code: "_17", district_code: "_1702"},
        { label: "<b>Becamex Hospital Binh Duong</b> - Thuận An", value: "Becamex Hospital Binh Duong - Thuận An", code: "_5816", province_code: "_17", district_code: "_1702"},
        { label: "<b>KTX DHQG TPHCM</b> - Dĩ An", value: "KTX DHQG TPHCM - Dĩ An", code: "_45", province_code: "_17", district_code: "_1703"},
        { label: "<b>GS1 DONG HOA DI AN</b> - Dĩ An", value: "GS1 DONG HOA DI AN - Dĩ An", code: "_240", province_code: "_17", district_code: "_1703"},
        { label: "<b>East Gate Apartment</b> - Dĩ An", value: "East Gate Apartment - Dĩ An", code: "_278", province_code: "_17", district_code: "_1703"},
        { label: "<b>68 No.9 TTHC Di An</b> - Dĩ An", value: "68 No.9 TTHC Di An - Dĩ An", code: "_297", province_code: "_17", district_code: "_1703"},
        { label: "<b>Tran Hung Dao Di An</b> - Dĩ An", value: "Tran Hung Dao Di An - Dĩ An", code: "_346", province_code: "_17", district_code: "_1703"},
        { label: "<b>Big C Di An</b> - Dĩ An", value: "Big C Di An - Dĩ An", code: "_466", province_code: "_17", district_code: "_1703"},
        { label: "<b>232 Ng An Ninh BDG</b> - Dĩ An", value: "232 Ng An Ninh BDG - Dĩ An", code: "_506", province_code: "_17", district_code: "_1703"},
        { label: "<b>Vincom Di An</b> - Dĩ An", value: "Vincom Di An - Dĩ An", code: "_543", province_code: "_17", district_code: "_1703"},
        { label: "<b>05 Ly Thuong Kiet BD</b> - Dĩ An", value: "05 Ly Thuong Kiet BD - Dĩ An", code: "_593", province_code: "_17", district_code: "_1703"},
        { label: "<b>Le Trong Tan Binh Duong</b> - Dĩ An", value: "Le Trong Tan Binh Duong - Dĩ An", code: "_5954", province_code: "_17", district_code: "_1703"},
        { label: "<b>Coopmart Bcons Binh Duong</b> - Dĩ An", value: "Coopmart Bcons Binh Duong - Dĩ An", code: "_6074", province_code: "_17", district_code: "_1703"},
        { label: "<b>Nguyen Tri Phuong Di An</b> - Dĩ An", value: "Nguyen Tri Phuong Di An - Dĩ An", code: "_6444", province_code: "_17", district_code: "_1703"},
        { label: "<b>KCN VSIP 2</b> - Tân Uyên", value: "KCN VSIP 2 - Tân Uyên", code: "_6457", province_code: "_17", district_code: "_1704"},
        { label: "<b>KCN My Phuoc Ben Cat</b> - Bến Cát", value: "KCN My Phuoc Ben Cat - Bến Cát", code: "_5741", province_code: "_17", district_code: "_1705"},
        { label: "<b>KCN My Phuoc 3 Ben Cat</b> - Bến Cát", value: "KCN My Phuoc 3 Ben Cat - Bến Cát", code: "_6185", province_code: "_17", district_code: "_1705"}
        
    ];

    const dropdown = new DropDownList(
        document.getElementById("_Q2"),
        document.getElementsByClassName("dropdown-list")[2],
        data,
        hiddenInitially = false,
        isMultiSelect = false
    );

    // Biến lưu trữ các lựa chọn hiện tại
    let selectedProvinces = new Set();
    let selectedDistricts = new Set();

    // Hàm lọc stores dựa trên provinces và districts được chọn
    function filterStores() {
        let filteredStores = data;

        // Lọc theo provinces nếu có chọn
        if (selectedProvinces.size > 0) {
            filteredStores = filteredStores.filter(store => selectedProvinces.has(store.province_code));
        }

        // Lọc theo districts nếu có chọn
        if (selectedDistricts.size > 0) {
            filteredStores = filteredStores.filter(store => selectedDistricts.has(store.district_code));
        }

        dropdown.updateData(filteredStores);
    }

    // Thêm cascading logic cho province
    province_dropdown.onSelectionChange = (selectedProvinceCodes) => {
        selectedProvinces = new Set(selectedProvinceCodes);

        if (selectedProvinceCodes.length === 0) {
            // Nếu không chọn province nào, hiển thị tất cả districts
            district_dropdown.updateData(district_data);
        } else {
            // Lọc districts dựa trên provinces được chọn
            const filteredDistricts = district_data.filter(district =>
                selectedProvinceCodes.includes(district.province_code)
            );
            district_dropdown.updateData(filteredDistricts);
        }

        // Lọc stores
        filterStores();
    };

    // Thêm logic cho district
    district_dropdown.onSelectionChange = (selectedDistrictCodes) => {
        selectedDistricts = new Set(selectedDistrictCodes);

        // Lọc stores
        filterStores();
    };

        // Ẩn các input hidden
    document.getElementById("_Q0").style.display = "none";
    document.getElementById("_Q1").style.display = "none";
    document.getElementById("_Q2").style.display = "none";

});