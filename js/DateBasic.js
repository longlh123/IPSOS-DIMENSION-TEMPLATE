$(document).ready(function(){
    var objProperties = {};
    var $properties = undefined;
    var id = "";
    var $textbox = null;

    var dateNow = new Date();
    var month = dateNow.getMonth() + 1;
    var day = dateNow.getDate();
    var year = dateNow.getFullYear();
    
    $('.datebasic').children().each(function(){

        if($(this).prop('class') == "mrBannerText"){

            $properties = $(this).find(".custom_question_properties");
            $(this).hide();
        } else if($(this).is("span")) {
            
            $(this).children().each(function(){

                if($(this).is('input:text'))
                {
                    id = $(this).prop('id');
                    
                    $textbox = $(this);
                    $textbox.hide();

                    var str_obj = ($properties == undefined ? "" : $properties.html());
                    objProperties[id] = $.fn.convertJSON(str_obj);
                    $properties = undefined;
                } 
            });
        } else if($(this).prop('class') == "datebasic-container"){

            var d = 0, m = 0, y = 0;
            var day_visible = true, month_visible = true, year_visible = true;
            
            switch(objProperties[id]["textcontentrule"]){
                case "MM/YYYY":
                    if($textbox.val().length > 0){
                        m = parseInt($textbox.val().split('/')[0]);
                        y = parseInt($textbox.val().split('/')[1]);
                    }
                    day_visible = false;
                    break;
                default:
                    if($textbox.val().length > 0){
                        d = parseInt($textbox.val().split('/')[0]);
                        m = parseInt($textbox.val().split('/')[1]);
                        y = parseInt($textbox.val().split('/')[2]);
                    }
                    break;
            }
            
            var day_html = "", month_html = "", year_html = "";

            if(day_visible){
                day_html = "<span><select class='sel-day'>";
                day_html += "<option value='--' disabled='disabled' selected>Ngày</option>";

                for(var i = 1; i <= 31; i++){
                    if(d == i){
                        day_html += "<option value='" + i + "' selected>" + i + "</option>"
                    } else {
                        day_html += "<option value='" + i + "'>" + i + "</option>"
                    }
                }
                
                day_html += "</select></span>";
            }

            if(month_visible){
                month_html = "<span><select class='sel-month'>";
                month_html += "<option value='--' disabled='disabled' selected>Tháng</option>";

                for(var i = 1; i <= 12; i++){
                    if(m == i) {
                        month_html += "<option value='" + i + "' selected>" + i + "</option>"
                    } else {
                        month_html += "<option value='" + i + "'>" + i + "</option>"
                    }
                }
                
                month_html += "</select></span>";
            }

            if(year_visible){
                year_html = "<span><select class='sel-year'>";
                year_html += "<option value='--' disabled='disabled' selected>Năm</option>";

                for(var i = year + 5; i >= 1900; i--){
                    if(y == i){
                        year_html += "<option value='" + i + "' selected>" + i + "</option>"
                    } else {
                        year_html += "<option value='" + i + "'>" + i + "</option>"
                    }   
                }

                year_html += "</select></span>";
            }

            var html = "";
            if(day_html.length > 0) html += (html.length == 0 ? "" : "<span class='separate'>/</span>") + day_html;
            if(month_html.length > 0) html += (html.length == 0 ? "" : "<span class='separate'>/</span>") + month_html;
            if(year_html.length > 0) html += (html.length == 0 ? "" : "<span class='separate'>/</span>") + year_html;

            $(this).html(html);
        }
    });

    $('input:submit').click(function(e){
        
        if($(e.currentTarget).prop('name') == '_NNext'){

            var datebasics = $('.datebasic').find('.datebasic-container');
        
            $('.datebasic').find('.error').remove();
            
            $.each(datebasics, function(key, datebasic){
                
                var $sel_day = $(datebasic).find('.sel-day');
                var $sel_month = $(datebasic).find('.sel-month');
                var $sel_year = $(datebasic).find('.sel-year');
                
                var $txt = $(datebasic).parent().find('input:text');

                var has_value = true;
                if(objProperties[id]["textcontentrule"] == "MM/YYYY"){
                    has_value = has_value && $sel_month.val() != null && $sel_year.val() != null;
                } else {
                    has_value = has_value && $sel_day.val() != null && $sel_month.val() != null && $sel_year.val() != null; 
                }

                if(has_value){
                    
                    var dt_check = "", dt_result = "";
                    
                    if($sel_day.length > 0) dt_check += ($sel_day.val().length == 1 ? "0" : "") + $sel_day.val();
                    if($sel_month.length > 0) dt_check += (dt_check.length == 0 ? "01/" : "/") + ($sel_month.val().length == 1 ? "0" : "") +  $sel_month.val();
                    if($sel_year.length > 0) dt_check += (dt_check.length == 0 ? "01/" : "/") + $sel_year.val();

                    if($sel_day.length > 0) dt_result += ($sel_day.val().length == 1 ? "0" : "") + $sel_day.val();
                    if($sel_month.length > 0) dt_result += (dt_result.length == 0 ? "" : "/") + ($sel_month.val().length == 1 ? "0" : "") +  $sel_month.val();
                    if($sel_year.length > 0) dt_result += (dt_result.length == 0 ? "" : "/") + $sel_year.val();

                    if($.fn.valCheckDate(dt_check)){
                        $txt.val(dt_result);
                    } else {
                        var str = "<span class='error'>&ldquo;" + "Ngày '" + dt + "' không hợp lệ." + "&rdquo;</span>";
                    
                        if($(datebasic).parent().find('.mrBannerText').length == 1){
                            $(datebasic).parent().find('.mrBannerText').after(str);
                        }
                        else {
                            $(datebasic).parent().prepend(str);
                        }

                        e.preventDefault();    
                    }
                }else{
                    var str = "<span class='error'>&ldquo;" + "Nhập thông tin Ngày/Tháng/Năm." + "&rdquo;</span>";
                    
                    if($(datebasic).parent().find('.mrBannerText').length == 1){
                        $(datebasic).parent().find('.mrBannerText').after(str);
                    }
                    else {
                        $(datebasic).parent().prepend(str);
                    }

                    e.preventDefault();
                }
            });
        }
    });
});




