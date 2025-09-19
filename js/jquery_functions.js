(function($){
    /*
    obj = {
        placeholder : "text", //a symbol or piece of text that temporarily replaces st that is missing. 
        validation : "checkphonenumber", //the act of proving that st is true or correct
        type : "text|long|double", 
        questiontype : 
            "TOM-SPON": Using for the TOM_SPON question
            "DATE"    : Using for the DATEBASIC question with textcontentrule by DD/MM/YYYY or MM/YYYY
            "TIME"    : Using for the TIMEBASIC question with textcontentrule by HH:MM and step:1-10
            "CLOSENESS-SLIDER" : Using for the CLOSENESS question with minRange:1 and maxRange:100
            "RANGE-SLIDER": Using for the RANGE SLIDER question with minRange:1 and maxRange:5|7|9|11
        sum : value
    }
    */
    $.fn.convertJSON = function(s){
        var obj = {};
        var a = s.split(',');
        $.each(a, function(k, v){
            var b = v.split(':');

            if(b[0].split('-').length == 2){
                var c = b[0].split('-');

                if(!obj.hasOwnProperty('dataset')){
                    obj['dataset'] = {};
                }

                obj['dataset'][c[1].toLowerCase()] = b[1];
            } else {
                obj[b[0].toLowerCase()] = b[1];
            }
        });

        if(!obj.hasOwnProperty('dataset')) obj['dataset'] = {};
        //set the default value of type of a text field is 'text'.
        if(!obj.hasOwnProperty('type')) obj['type'] = 'text';
        //set the default value of type of a questiontype is default
        if(!obj.hasOwnProperty('questiontype')) obj['questiontype'] = 'default';
        //set the default value of step
        switch(obj['questiontype']){
            case "DATE":
                if(!obj.hasOwnProperty('textcontentrule')) obj['textcontentrule'] = "DD/MM/YYYY";
                break;
            case "TIME":
                if(!obj.hasOwnProperty('textcontentrule')) obj['textcontentrule'] = "HH:MM";
                break;
            default:
                if(!obj.hasOwnProperty('textcontentrule')) obj['textcontentrule'] = "DD/MM/YYYY";
                break;
        }
        
        //set the default value of validation is null.
        if(!obj.hasOwnProperty('validation')) obj['validation'] = null;
        
        if(obj['validation'] != null && (obj['type'] == 'long' || obj['type'] == 'double')){
            var regExp = new RegExp(/checksum\([0-9]*\)/);

            if(regExp.test(obj['validation'].toLowerCase())){
                var str = obj['validation'].toLowerCase().replace('checksum(', '');
                str = str.replace(')', '');

                obj['validation'] = "checksum";
                obj['sumcheck'] = (obj['type'] == 'long' ? parseInt(str) : parseFloat(str));
            }
        }
        //set the default value of placeholder
        if(!obj.hasOwnProperty('placeholder')) obj['placeholder'] = 'Điền câu trả lời...'
        //set the default value of step
        if(!obj.hasOwnProperty('step')) obj['step'] = 1
        return obj;
    };

    $.fn.formatNumber = function(num, lang) {
        switch(lang)
        {
            case "vi-vn":
                var n = num.toString().split(',');
                p = n[0].toString().split('.').join('');  
                return p.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.') + (n.length == 2 ? "," + n[1] : "");
                break;
            default:
                var n = num.toString().split('.');
                p = n[0].toString().split(',').join('');  
                return p.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.') + (n.length == 2 ? "." + n[1] : "");
                break;
        }
    };
    
    $.fn.convertToNumber = function(n, type, lang){

        if(n.length == 0) return 0;
        
        var x = n;
        x = x.split((lang == "vi-vn" ? "." : ",")).join('');
        return (type == "long" ? parseInt(x) : parseFloat(x));
    };

    $.fn.valCheckPhoneNumber = function(p, n){
        var areaCodes = {
            '_1' : {"name":"Hồ Chí Minh","abbreviation":"01_HCM","region_id":"2","old_area_code":"8","area_code":"28"},
            '_10' : {"name":"Bắc Giang","abbreviation":"10_BG","region_id":"7","old_area_code":"240","area_code":"204"},
            '_11' : {"name":"Nam Định","abbreviation":"11_ND","region_id":"3","old_area_code":"350","area_code":"228"},
            '_12' : {"name":"Thanh Hóa","abbreviation":"12_TH","region_id":"4","old_area_code":"37","area_code":"237"},
            '_13' : {"name":"Nghệ An","abbreviation":"13_NA","region_id":"4","old_area_code":"38","area_code":"238"},
            '_14' : {"name":"Thừa Thiên - Huế","abbreviation":"14_TTH","region_id":"4","old_area_code":"54","area_code":"234"},
            '_15' : {"name":"Thái Nguyên","abbreviation":"15_TN","region_id":"7","old_area_code":"280","area_code":"208"},
            '_16' : {"name":"Vĩnh Phúc","abbreviation":"16_VP","region_id":"3","old_area_code":"211","area_code":"211"},
            '_17' : {"name":"Bình Dương","abbreviation":"17_BD","region_id":"2","old_area_code":"650","area_code":"274"},
            '_18' : {"name":"Quảng Ninh","abbreviation":"18_QN","region_id":"7","old_area_code":"33","area_code":"203"},
            '_19' : {"name":"Sơn La","abbreviation":"19_SL","region_id":"1","old_area_code":"22","area_code":"212"},
            '_2' : {"name":"Hà Nội","abbreviation":"02_HN","region_id":"3","old_area_code":"4","area_code":"24"},
            '_20' : {"name":"Bình Định","abbreviation":"20_BD","region_id":"5","old_area_code":"56","area_code":"256"},
            '_21' : {"name":"Kiên Giang","abbreviation":"21_KG","region_id":"8","old_area_code":"77","area_code":"297"},
            '_22' : {"name":"Vĩnh Long","abbreviation":"22_VL","region_id":"8","old_area_code":"70","area_code":"270"},
            '_23' : {"name":"Đắk Lắk","abbreviation":"23_DL","region_id":"6","old_area_code":"500","area_code":"262"},
            '_24' : {"name":"Long An","abbreviation":"24_LA","region_id":"8","old_area_code":"72","area_code":"272"},
            '_25' : {"name":"Lâm Đồng","abbreviation":"25_LD","region_id":"6","old_area_code":"63","area_code":"263"},
            '_26' : {"name":"Đồng Tháp","abbreviation":"26_DT","region_id":"8","old_area_code":"67","area_code":"277"},
            '_27' : {"name":"Bình Thuận","abbreviation":"27_BT","region_id":"5","old_area_code":"62","area_code":"252"},
            '_28' : {"name":"Cà Mau","abbreviation":"28_CM","region_id":"8","old_area_code":"780","area_code":"290"},
            '_29' : {"name":"Phú Thọ","abbreviation":"29_PT","region_id":"7","old_area_code":"210","area_code":"210"},
            '_3' : {"name":"Đà Nẵng","abbreviation":"03_DN","region_id":"5","old_area_code":"511","area_code":"236"},
            '_30' : {"name":"Tây Ninh","abbreviation":"30_TN","region_id":"2","old_area_code":"66","area_code":"276"},
            '_31' : {"name":"Hưng Yên","abbreviation":"31_HY","region_id":"3","old_area_code":"321","area_code":"221"},
            '_32' : {"name":"Thái Bình","abbreviation":"32_TB","region_id":"3","old_area_code":"36","area_code":"227"},
            '_33' : {"name":"Quảng Nam","abbreviation":"33_QN","region_id":"5","old_area_code":"510","area_code":"235"},
            '_34' : {"name":"Bến Tre","abbreviation":"34_BT","region_id":"8","old_area_code":"75","area_code":"275"},
            '_35' : {"name":"Quảng Ngãi","abbreviation":"35_QN","region_id":"5","old_area_code":"55","area_code":"255"},
            '_36' : {"name":"Lạng Sơn","abbreviation":"36_LS","region_id":"7","old_area_code":"25","area_code":"205"},
            '_37' : {"name":"Hải Dương","abbreviation":"37_HD","region_id":"3","old_area_code":"320","area_code":"220"},
            '_38' : {"name":"Ninh Bình","abbreviation":"38_NB","region_id":"3","old_area_code":"30","area_code":"229"},
            '_39' : {"name":"Bắc Kạn","abbreviation":"39_BK","region_id":"7","old_area_code":"281","area_code":"209"},
            '_4' : {"name":"Cần Thơ","abbreviation":"04_CT","region_id":"8","old_area_code":"710","area_code":"292"},
            '_40' : {"name":"Cao Bằng","abbreviation":"40_CB","region_id":"7","old_area_code":"26","area_code":"206"},
            '_41' : {"name":"Hà Giang","abbreviation":"41_HG","region_id":"7","old_area_code":"219","area_code":"219"},
            '_42' : {"name":"Tuyên Quang","abbreviation":"42_TQ","region_id":"7","old_area_code":"27","area_code":"207"},
            '_43' : {"name":"Điện Biên","abbreviation":"43_DB","region_id":"1","old_area_code":"230","area_code":"215"},
            '_44' : {"name":"Hòa Bình","abbreviation":"44_HB","region_id":"1","old_area_code":"218","area_code":"218"},
            '_45' : {"name":"Lai Châu","abbreviation":"45_LC","region_id":"1","old_area_code":"231","area_code":"213"},
            '_46' : {"name":"Lào Cai","abbreviation":"46_LC","region_id":"1","old_area_code":"20","area_code":"214"},
            '_47' : {"name":"Yên Bái","abbreviation":"47_YB","region_id":"1","old_area_code":"29","area_code":"216"},
            '_48' : {"name":"Bắc Ninh","abbreviation":"48_BN","region_id":"3","old_area_code":"241","area_code":"222"},
            '_49' : {"name":"Hà Nam","abbreviation":"49_HN","region_id":"3","old_area_code":"351","area_code":"226"},
            '_5' : {"name":"Khánh Hòa","abbreviation":"05_KH","region_id":"5","old_area_code":"58","area_code":"258"},
            '_50' : {"name":"Ninh Thuận","abbreviation":"50_NT","region_id":"5","old_area_code":"68","area_code":"259"},
            '_51' : {"name":"Phú Yên","abbreviation":"51_PY","region_id":"5","old_area_code":"57","area_code":"257"},
            '_52' : {"name":"Hà Tĩnh","abbreviation":"52_HT","region_id":"4","old_area_code":"39","area_code":"239"},
            '_53' : {"name":"Quảng Bình","abbreviation":"53_QB","region_id":"4","old_area_code":"52","area_code":"232"},
            '_54' : {"name":"Quảng Trị","abbreviation":"54_QT","region_id":"4","old_area_code":"53","area_code":"233"},
            '_55' : {"name":"Đắk Nông","abbreviation":"55_DN","region_id":"6","old_area_code":"501","area_code":"261"},
            '_56' : {"name":"Gia Lai","abbreviation":"56_GL","region_id":"6","old_area_code":"59","area_code":"269"},
            '_57' : {"name":"Kon Tum","abbreviation":"57_KT","region_id":"6","old_area_code":"60","area_code":"260"},
            '_58' : {"name":"Bà Rịa - Vũng Tàu","abbreviation":"58_BR_VT","region_id":"2","old_area_code":"64","area_code":"254"},
            '_59' : {"name":"Bình Phước","abbreviation":"59_BP","region_id":"2","old_area_code":"651","area_code":"271"},
            '_6' : {"name":"Đồng Nai","abbreviation":"06_DN","region_id":"2","old_area_code":"61","area_code":"251"},
            '_60' : {"name":"Bạc Liêu","abbreviation":"60_BL","region_id":"8","old_area_code":"781","area_code":"291"},
            '_61' : {"name":"Hậu Giang","abbreviation":"61_HG","region_id":"8","old_area_code":"711","area_code":"293"},
            '_62' : {"name":"Sóc Trăng","abbreviation":"62_ST","region_id":"8","old_area_code":"79","area_code":"299"},
            '_63' : {"name":"Trà Vinh","abbreviation":"63_TV","region_id":"8","old_area_code":"74","area_code":"294"},
            '_7' : {"name":"Hải Phòng","abbreviation":"07_HP","region_id":"3","old_area_code":"31","area_code":"225"},
            '_8' : {"name":"Tiền Giang","abbreviation":"08_TG","region_id":"8","old_area_code":"73","area_code":"273"},
            '_9' : {"name":"An Giang","abbreviation":"09_AG","region_id":"8","old_area_code":"76","area_code":"296"}
        };

        var strRegExp = "";
        var str_message = "";

        if(p == '_1' || p == '_2'){
            //Ho chi minh or Ha noi
            strRegExp = "0" + areaCodes[p]['area_code'] + "[0-9]{8}$";
            
            var regexPattern = new RegExp(strRegExp);

            if(!regexPattern.test(n)){
                str_message = "Nhập mã vùng của " + areaCodes[p]['name'] + " (0" + areaCodes[p]['area_code'] + ")" + " trước số điện thoại. Cách nhập: 0 + 2X + XXXXXXXX (8 chữ số)";
            }
        } else {
            strRegExp = "0" + areaCodes[p]['area_code'] + "[0-9]{7}$";

            var regexPattern = new RegExp(strRegExp);

            if(!regexPattern.test(n)){
                str_message = "Nhập mã vùng của " + areaCodes[p]['name'] + " (0" + areaCodes[p]['area_code'] + ")" + " trước số điện thoại. Cách nhập: 0 + 2XX + XXXXXXX (7 chữ số)";
            }
        }

        return str_message;
    };

    $.fn.valCheckCellPhoneNumber = function(n){
        var regexPattern = new RegExp(/0((3[2-9]|5[2,6,8,9]|7[0,6-9]|8[1-6,7,8,9]|9[0-9])|(12[0-9]|16[2-9]|18[6,8]|199))[0-9]{7}$/);
        return regexPattern.test(n);
    };

    $.fn.valCheckEmail = function(n){
        var regexPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regexPattern.test(n);
    };

    $.fn.valCheckSpecialCharacters = function(str){
        var regexPattern = new RegExp(/[!#$^&*_+\-=\[\]{}'"|<>?]+/, 'g'); ///[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        return regexPattern.test(str);
    }

    $.fn.valCheckLettters = function(str){
        var regexPattern = new RegExp(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+$/);
        return regexPattern.test(str);
    }

    $.fn.valCheckDate = function(dt){
		
		var d = parseInt(dt.substring(0, 2));
		var m = parseInt(dt.substring(3, 5));
		var y = parseInt(dt.substring(6, 11));
		
		var result = false;
		
		switch(m)
		{
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				if(d >= 1 && d <= 31)
				{
					result = true;
				}
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				if(d >= 1 && d <= 30)
				{
					result = true;
				}
				break;
			case 2:
				if(y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0))
				{
					if(d >= 1 && d <= 29)
					{
						result = true;
					}
				}
				else
				{
					if(d >= 1 && d <= 28)
					{
						result = true;
					}
				}
		}
		
		return result;
	};

}(jQuery));