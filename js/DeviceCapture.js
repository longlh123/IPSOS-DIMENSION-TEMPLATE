/**
 * DeviceCapture.js
 * Tự động ghi nhận IP, trình duyệt, hệ điều hành và loại thiết bị
 * vào các biến ẩn trong Dimension khi đáp viên mở survey.
 *
 * Yêu cầu: 4 câu hỏi OpenEnd ẩn trong Dimension project (xem README).
 * Tên biến được cấu hình tại phần CONFIG bên dưới.
 */

(function () {

    // -------------------------------------------------------------------------
    // CONFIG — đổi tên biến cho khớp với tên câu hỏi trong Dimension project
    // -------------------------------------------------------------------------
    var VAR_IP      = '_Q0';  // Địa chỉ IP của đáp viên
    var VAR_BROWSER = '_Q1';  // Tên + phiên bản trình duyệt
    var VAR_OS      = '_Q2';  // Hệ điều hành
    var VAR_DEVICE  = '_Q3';  // Desktop / Mobile / Tablet
    var VAR_GPS     = '_Q4';  // Tọa độ GPS: "latitude|longitude"
    // -------------------------------------------------------------------------

    /**
     * Ghi giá trị vào input/textarea của câu hỏi Dimension.
     * Dimension render open-end question thành <textarea id="TÊN_BIẾN">.
     */
    function setVar(varName, value) {
        var el = document.getElementById(varName);
        if (!el) {
            el = document.querySelector('textarea[name="' + varName + '"], input[name="' + varName + '"]');
        }
        if (el) {
            el.value = value;
        }
    }

    // ---- Browser detection --------------------------------------------------

    function getBrowser(ua) {
        var match;
        if ((match = ua.match(/Edg\/([\d.]+)/)))       return 'Microsoft Edge ' + match[1];
        if ((match = ua.match(/OPR\/([\d.]+)/)))        return 'Opera ' + match[1];
        if ((match = ua.match(/SamsungBrowser\/([\d.]+)/))) return 'Samsung Browser ' + match[1];
        if ((match = ua.match(/Chrome\/([\d.]+)/)))     return 'Chrome ' + match[1];
        if ((match = ua.match(/Firefox\/([\d.]+)/)))    return 'Firefox ' + match[1];
        if (/Safari\//.test(ua) && (match = ua.match(/Version\/([\d.]+)/))) return 'Safari ' + match[1];
        if (/MSIE|Trident/.test(ua))                    return 'Internet Explorer';
        return 'Unknown Browser';
    }

    // ---- OS detection -------------------------------------------------------

    function getOS(ua) {
        var match;
        if (/Windows NT 10/.test(ua))                   return 'Windows 10/11';
        if (/Windows NT 6\.3/.test(ua))                 return 'Windows 8.1';
        if (/Windows NT 6\.1/.test(ua))                 return 'Windows 7';
        if ((match = ua.match(/Android ([\d.]+)/)))     return 'Android ' + match[1];
        if ((match = ua.match(/iPhone OS ([\d_]+)/)))   return 'iOS ' + match[1].replace(/_/g, '.');
        if ((match = ua.match(/iPad.*OS ([\d_]+)/)))    return 'iPadOS ' + match[1].replace(/_/g, '.');
        if ((match = ua.match(/Mac OS X ([\d_]+)/)))    return 'macOS ' + match[1].replace(/_/g, '.');
        if (/Linux/.test(ua))                           return 'Linux';
        return 'Unknown OS';
    }

    // ---- Device type detection ----------------------------------------------

    function getDeviceType(ua) {
        if (/iPad/.test(ua))                            return 'Tablet';
        if (/Android/.test(ua) && !/Mobile/.test(ua))  return 'Tablet';
        if (/Mobile|iPhone|iPod|Android/.test(ua))     return 'Mobile';
        return 'Desktop';
    }

    // ---- GPS via Geolocation API --------------------------------------------
    // Lưu ý: trình duyệt sẽ hiện popup xin quyền truy cập vị trí cho đáp viên.
    // Kết quả lưu dạng "latitude|longitude", ví dụ: "10.7769|106.7009"

    function captureGPS() {
        if (!navigator.geolocation) {
            setVar(VAR_GPS, 'Not Supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                var lat = position.coords.latitude.toFixed(6);
                var lng = position.coords.longitude.toFixed(6);
                setVar(VAR_GPS, lat + '|' + lng);
            },
            function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setVar(VAR_GPS, 'Permission Denied');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setVar(VAR_GPS, 'Position Unavailable');
                        break;
                    case error.TIMEOUT:
                        setVar(VAR_GPS, 'Timeout');
                        break;
                    default:
                        setVar(VAR_GPS, 'Unavailable');
                }
            },
            {
                enableHighAccuracy: true,  // Dùng GPS (nếu có), thay vì WiFi/IP
                timeout: 10000,            // Chờ tối đa 10 giây
                maximumAge: 0              // Không dùng cache vị trí cũ
            }
        );
    }

    // ---- IP via public API --------------------------------------------------

    function captureIP() {
        // Dùng api.ipify.org — miễn phí, không cần key
        // Fallback: cloudflare-dns nếu ipify không phản hồi
        fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                setVar(VAR_IP, data.ip || 'Unavailable');
            })
            .catch(function () {
                // Fallback — Cloudflare trace
                fetch('https://www.cloudflare.com/cdn-cgi/trace', { signal: AbortSignal.timeout(5000) })
                    .then(function (res) { return res.text(); })
                    .then(function (text) {
                        var match = text.match(/ip=([^\n]+)/);
                        setVar(VAR_IP, match ? match[1] : 'Unavailable');
                    })
                    .catch(function () {
                        setVar(VAR_IP, 'Unavailable');
                    });
            });
    }

    // ---- Main ---------------------------------------------------------------

    document.addEventListener('DOMContentLoaded', function () {
        var ua = navigator.userAgent;

        setVar(VAR_BROWSER, getBrowser(ua));
        setVar(VAR_OS,      getOS(ua));
        setVar(VAR_DEVICE,  getDeviceType(ua));

        captureIP();  // async — ghi vào biến khi API trả về
        // captureGPS(); // async — hiện popup xin quyền, ghi vào biến sau khi đáp viên đồng ý
    });

})();
