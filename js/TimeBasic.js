$(document).ready(function(){

    var objProperties = {};
    var $properties = undefined;
    var id = "";
    var $textbox = null;

    $('.timebasic').children().each(function(){

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
        } else if($(this).prop('class') == "timebasic-container"){
            
            var h = null, m = null;
            
            if($textbox.val().length > 0){
                h = parseInt($textbox.val().split(':')[0]);
                m = parseInt($textbox.val().split(':')[1]);
            }

            var hour_html = "<span><select class='sel-hour'>";
            hour_html += "<option value='--' disabled='disabled' selected>Giờ</option>";

            for(var i = 0; i <= 23; i++){
                if(h == i) {
                    hour_html += "<option value='" + i + "' selected>" + i + "</option>"
                } else {
                    hour_html += "<option value='" + i + "'>" + i + "</option>"
                }
            }
            
            hour_html += "</select></span>";

            var minute_html = "<span><select class='sel-minute'>";
            minute_html += "<option value='--' disabled='disabled' selected>Phút</option>";

            for(var i = 0; i <= 59; i += parseInt(objProperties[id]['step'])){
                if(m == i){
                    minute_html += "<option value='" + i + "' selected>" + i + "</option>"
                } else {
                    minute_html += "<option value='" + i + "'>" + i + "</option>"
                }
            }
            
            minute_html += "</select></span>";
            
            $(this).html(hour_html + "<span class='separate'>:</span>" + minute_html);
        }
    });
    
    console.log(objProperties);

    $('input:submit').click(function(e){

        if($(e.currentTarget).prop('name') == '_NNext'){
            
            var $timebasics = $('.timebasic').find('.timebasic-container');
        
            $('.timebasic').find('.error').remove();
            
            $.each($timebasics, function(key, timebasic){
                
                var $sel_hour = $(timebasic).find('.sel-hour');
                var $sel_minute = $(timebasic).find('.sel-minute');
                
                var $txt = $(timebasic).parent().find('input:text');

                if($sel_hour.val() != null && $sel_minute.val() != null){
                    
                    var t = ($sel_hour.val().length == 1 ? "0" : "") + $sel_hour.val() + ":" + ($sel_minute.val().length == 1 ? "0" : "") + $sel_minute.val();

                    $txt.val(t);

                    console.log(t);
                }else{
                    var str = "<span class='error'>&ldquo;" + "Nhập thông tin Giờ/Phút." + "&rdquo;</span>";
                    
                    if($(timebasic).parent().find('.mrBannerText').length == 1){
                        $(timebasic).parent().find('.mrBannerText').after(str);
                    }
                    else {
                        $(timebasic).parent().prepend(str);
                    }

                    e.preventDefault();
                }
            });
        }
    });
});