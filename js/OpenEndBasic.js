$(document).ready(function(){
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

    //List the custom properties, if any.
    $(".mrBannerText").css('display', 'none');

    var objProperties = {};
    
    $(".openend_basic").children().each(function(){
        
        var $properties = undefined;

        if($(this).parent().find(".mrBannerText").length == 1){
            
            $properties = $(this).parent().find(".mrBannerText");
        }

        if($(this).is("span")) {

            var hascheckbox = false;
            var checkboxes = new Array();

            var $textbox = null;
            var $select = null;

            var id = "";
            
            $(this).children().each(function(){

                if($(this).is('input:text') || $(this).is('textarea'))
                {
                    id = $(this).prop('id');
                    
                    $textbox = $(this);
                    
                    var str_obj = ($properties == undefined ? "" : $properties.text());
                    objProperties[id] = $.fn.convertJSON(str_obj);
                        
                    console.log(objProperties);
                } 
                else if($(this).is('input:checkbox'))
                {
                    hascheckbox = true;
                    checkboxes.push($(this));

                    var $label = $(this).next().clone();

                    $(this).next().remove();
                    $(this).wrap("<span class='cat-group'/>");
                    $(this).parent().append($label);
                    
                } 
                else if($(this).is('select'))
                {
                    $select = $(this);
                }
            });

            if($textbox != null)
            {
                $textbox.attr('placeholder', objProperties[id]['placeholder']);

                if(Object.keys(objProperties[id]['dataset']).length > 0){
                    for(const[key, value] of Object.entries(objProperties[id]['dataset'])){

                        $textbox.attr('data-' + key, value);

                        if(key == 'province'){
                            var $str_note = $textbox.parent().parent().find('.str_note');

                            if(value == '_1' || value == '_2'){
                                $str_note.html("<i><b>PVV lưu ý</b>: Cách nhập số điện thoại cố định ở " + areaCodes[value]['name'] + ": " + "0 + " + areaCodes[value]['area_code'] + " + XXXXXXXX (8 chữ số)</i>");
                            } else {
                                $str_note.html("<i><b>PVV lưu ý</b>: Cách nhập số điện thoại cố định ở " + areaCodes[value]['name'] + ": " + "0 + " + areaCodes[value]['area_code'] + " + XXXXXXX (7 chữ số)</i>");
                            }
                        }
                    }
                }

                //Nếu textbox có giá trị thì sẽ tạo lại format 0.000,000
                if($textbox.val().length > 0)
                {
                    if(objProperties[id]['type'].toLowerCase() == 'long' || objProperties[id]['type'].toLowerCase() == 'double')
                    {
                        $textbox.val($.fn.formatNumber($textbox.val(), $('html').attr('lang').toLowerCase()));
                    }
                }
                
                $textbox.change(function(){
                
                    if($(this).val().length > 0)
                    {
                        for(var i = 0; i < checkboxes.length; i++)
                        {
                            if(checkboxes[i].is(':checked'))
                            {
                                checkboxes[i].prop('checked', false);
                            }
                        }
                    }
                });
                
                if(Object.keys(objProperties[id]).length)
                {
                    //Nếu type = long|double sẽ format theo 0.000,000
                    if(objProperties[id]['type'].toLowerCase() == 'long' || objProperties[id]['type'].toLowerCase() == 'double')
                    {
                        //Chỉ cho phép textbox được nhập number
                        $textbox.keypress(function(e){
                            //44 - dấu phẩy
                            //46 - dấu chấm
                            var lang = $('html').attr('lang').toLowerCase();
                            var f = objProperties[id]['type'].toLowerCase() == 'long' ? ((e.keyCode >= 48 && e.keyCode <= 57) && e.keyCode != 44 && e.keyCode != 46)
                                            : ((lang == "vi-vn" ? (((e.keyCode >= 48 && e.keyCode <= 57) || 
                                            e.keyCode == 44) && e.keyCode != 46) : (((e.keyCode >= 48 && e.keyCode <= 57) 
                                            || e.keyCode == 46) && e.keyCode != 44)));
                            //alert(f);
                            if(!f)
                            {
                                e.preventDefault();
                                return false;
                            }
                        });

                        //Format giá trị sau mỗi lần nhập 
                        $textbox.keyup(function(){
                            
                            $(this).val($.fn.formatNumber($(this).val(), $('html').attr('lang').toLowerCase()));
                        });
                    } else {
                        $textbox.keyup(function(e){
                            if(objProperties[id]['validation'] != "checkemail"){
								if($.fn.valCheckSpecialCharacters($(this).val())){
									$(this).val($(this).val().substring(0, $(this).val().length - 1));
								}
							}
                        });
                    } 
                }
                 
                //Xóa giá trị tren textbox nếu checkbox được chọn
                if(hascheckbox)
                {
                    for(var i = 0; i < checkboxes.length; i++)
                    {
                        checkboxes[i].change(function(){
    
                            if($(this).is(':checked'))
                            {
                                $textbox.val("");

                                for(var i = 0; i < checkboxes.length; i++)
                                {
                                    if(checkboxes[i].prop('id') !== $(this).prop('id'))
                                    {
                                        checkboxes[i].prop('checked', false);
                                    }
                                }
                            }
                        });
                    }
                }
            }
            
            if($select != null)
            {
                $select.append('<option value="" disabled="disabled" selected>Chọn câu trả lời...</option>');
            }
        }
    });

    //Format lại giá trị number khi nhấn submit
    $('input:submit').click(function(e){

        $('.openend_basic').children().each(function(){

            if($(this).is('span')){

                $(this).children().each(function(){
                    
                    if($(this).prop('class') == "error"){
                        $(this).remove();
                    } else if($(this).is('input:text') || $(this).is('textarea'))
                    {
                        var props = objProperties[$(this).prop('id')];

                        if($(this).val().length > 0){
                            
                            switch(props['type'].toLowerCase())
                            {
                                case 'long':
                                case 'double':
                                    //Nếu format theo 0.000,000
                                    switch($('html').attr('lang').toLowerCase())
                                    {
                                        case "vi-vn":
                                            $(this).val($(this).val().split('.').join(''));
                                            break;
                                        default:
                                            $(this).val($(this).val().split(',').join(''));
                                            break;
                                    }
                                    break;   
                                case 'text':
                                    if(props['validation'] != null){
                                        switch(props['validation'].toLowerCase()){
                                            case 'checkphonenumber':
                                                var str_message = $.fn.valCheckPhoneNumber($(this)[0].dataset.province, $(this).val());

                                                if(str_message.length > 0){
                                                    
                                                    $(this).parent().prepend("<span class='error'>&ldquo;" + str_message + "&rdquo;</span>");
                                                    $(this).parent().parent().find('.mrErrorText').hide();
                                                    e.preventDefault();
                                                }
                                                break;
                                            case 'checkcellphonenumber':
                                                if(!$.fn.valCheckCellPhoneNumber($(this).val())){
                                                    $(this).parent().prepend("<span class='error'>&ldquo;" + "Số điện thoại không đúng." + "&rdquo;</span>");
                                                    $(this).parent().parent().find('.mrErrorText').hide();
                                                    e.preventDefault();
                                                }
                                                break;
                                            case 'checkemail':
                                                if(!$.fn.valCheckEmail($(this).val())){
                                                    $(this).parent().prepend("<span class='error'>&ldquo;" + "Email không đúng." + "&rdquo;</span>");
                                                    $(this).parent().parent().find('.mrErrorText').hide();
                                                    e.preventDefault();
                                                }
                                                break;
                                            case 'checkletters':
                                                if(!$.fn.valCheckLettters($(this).val())){
                                                    $(this).parent().prepend("<span class='error'>&ldquo;" + "Thông tin nhập không đúng." + "&rdquo;</span>");
                                                    $(this).parent().parent().find('.mrErrorText').hide();
                                                    e.preventDefault();
                                                }
                                                break;
                                        }
                                    }
                                    break;     
                            }
                        }
                        
                    } 
                });
            }
        });
    });
});