$(document).ready(function(){

    //List the custom properties, if any.
    $(".mrBannerText").css('display', 'none');

    var objProperties = {};

    var str_obj = $(this).find(".custom_question_properties").length == 0 ? "" : $(this).find(".custom_question_properties").html();
    objProperties = $.fn.convertJSON(str_obj);

    var contents = {}, textareas = {};
    
    switch($(".mrQuestionTable").prop('tagName').toLowerCase())
    {
        case "table":
            if($(".grid_openend_basic").find('.error').length != 0)
            {
                $(".grid_openend_basic").find('.error').hide();
            }

            $(".mrQuestionTable").addClass('grid-container');
            
            $(".mrQuestionTable").find('td').unwrap().wrap($('<tr/>'));
            
            var cols = [], rows = [];
            var isgridrow = true;

            $(".mrQuestionTable tbody tr").get().map(function(row){
                
                return $(row).find('td').get().map(function(cell){
                    
                    var arr = $(cell).prop('id').split('.');
                    
                    if(cols.indexOf(arr[1]) == -1) cols.push(arr[1]);
                    if(rows.indexOf(arr[2]) == -1) rows.push(arr[2]);

                    $(row).attr('pos_1', arr[1]);
                    $(row).attr('pos_2', arr[2]);        
                });
            });

            //Determine whether the open-end grid have column or row attribute.
            if(cols.length > rows.length) isgridrow = false;
                
            if(!isgridrow)
            {
                var $rows = $(".mrQuestionTable tbody tr").get();

                $rows.sort(function(a, b){

                    var x1 = parseInt($(a).attr('pos_1')), x2 = parseInt($(b).attr('pos_1'));
                    
                    var result = x1 > x2 ? 1 : (x1 < x2) ? -1 : 0;
                    
                    return result;
                });

                $.each($rows, function(index, row) {
                    $('.mrQuestionTable tbody').append(row);
                });
            }
            
            var sumcheck = 0;
            var obj_rows = {};

            var items = $('.mrQuestionTable tbody tr').get().map(function(row){
                                
                return $(row).find('td').get().map(function(cell){
                    
                    var $td_txt = $(cell);

                    $td_txt.css({
                        'text-align' : '',
                        'vertical-align' : ''
                    });
                    
                    var attr = isgridrow ? $td_txt.attr('rowspan') :  $td_txt.attr('colspan');

                    if(typeof attr != 'undefined' && attr !== false)
                    {
                        $td_txt.addClass('grid-group');
                    }
                    
                    if($td_txt.find('textarea').length > 0 || $td_txt.find('input[type=text]').length > 0)
                    {
                        var $td_content = $td_txt.parent().prev().find('td');;
                        var $error = $td_txt.find('.mrErrorText').length != 0 ? $td_txt.find('.mrErrorText') : undefined;
                        var $checkboxs = $td_txt.find('input[type=checkbox]').length != 0 ? $td_txt.find('input[type=checkbox]') : undefined;
                        
                        var $texts = $td_txt.find('textarea').length > 0 ? $td_txt.find('textarea') : undefined;
                        
                        if($texts == undefined){
                            $texts = $td_txt.find('input[type=text]').length > 0 ? $td_txt.find('input[type=text]') : undefined;
                        }

                        obj_rows[$texts.parent().parent().attr('id')] = $(row);

                        //console.log($td_content);
                        switch(objProperties['questiontype']){
                            case 'TOM-SPON':
                                if($error != undefined) $error.hide();
                                
                                $td_content.hide();
                                
                                $texts.addClass('grid-openend-txt');
                                
                                var pos1 = parseInt($texts.parent().parent().parent().attr('pos_1'));
                                var pos2 = parseInt($texts.parent().parent().parent().attr('pos_2'));
                                
                                $texts.addClass('txt-' + pos1 + "-" + pos2);

                                if($td_content.find('.mrQuestionText').html().length == 0){
                                    $texts.attr('placeholder', objProperties['placeholder']);
                                } else {
                                    $texts.attr('placeholder', $td_content.find('.mrQuestionText').html());
                                }
                                
                                if(pos2 != 0){
                                    if($texts.val().length == 0 || $texts.val() == '98'){
                                        $texts.val('');
                                        
                                        $prev_text = obj_rows["Cell." + pos1 + "." + (pos2 - 1)].find('input[type=text]');

                                        if($prev_text.val().length == 0 || $prev_text.val() == '98'){
                                            $(row).hide();
                                        }
                                    }
                                }
                                break;
                            default:
                                $td_content.addClass('grid-content');
                                $td_content.addClass('grid-content-openend');
                                $td_content.addClass('bg-info');
                                
                                $texts.addClass('grid-openend-txt');
                                $texts.attr('placeholder', objProperties['placeholder']);
                                
                                if($texts.is('textarea')){
                                    $texts.attr('rows', 3);
                                }
                                
                                if($checkboxs != undefined){
                                    $checkboxs.each(function(index, chk){
                                        $(chk).addClass('grid-openend-chk');
                                    });
                                }

                                var str = $td_content.find('.mrQuestionText').html().replace(/<hr>.*<\/span>/g, '');
                                
                                $td_content.find('.mrQuestionText').html(str);

                                if($error != undefined) {
                                    $error.hide();
                                    $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + $error.html() + "&rdquo;</span>");
                                
                                    $td_txt.show();
                                    $texts.focus();
                                } else {
                                    $td_txt.hide();

                                    if($texts.val().length > 0){
                                        switch(objProperties['type'].toLowerCase()){
                                            case 'text':
                                                $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $texts.val() + "&rdquo;</span>");
                                                break;
                                            case 'long':
                                            case 'double':
                                                $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $.fn.formatNumber($texts.val(), $('html').attr('lang').toLowerCase()) + "&rdquo;</span>");
                                                break;
                                        }
                                    } else {
                                        if($checkboxs != undefined){
                                            var flag = false;
                                            $checkboxs.each(function(index, chk){
                                                if($(chk).is(':checked')){
                                                    flag = true;
                                                    $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $(chk).next().find('span').html() + "&rdquo;</span>");
                                                }
                                            });

                                            if(!flag){
                                                $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + "Thiếu câu trả lời." + "&rdquo;</span>");
                                            }
                                        }
                                    }
                                }

                                if(objProperties['validation'] != null){
                                    sumcheck += ($texts.val().length == 0 ? 0 : objProperties['type'].toLowerCase() ? parseInt($texts.val()) : parseFloat($texts.val()));
                                }
                                break;
                        }
                        
                    } else if($td_txt.find('select').length > 0){

                        $td_txt.find('select option[value="__0"]').prop('disabled', 'disabled');
                        $td_txt.find('select option[value="__0"]').hide();
                        
                        console.log($td_txt.find('select option:selected').val());

                        //$td_txt.find('select').append('<option value="" disabled="disabled" selected>Chọn câu trả lời...</option>');
                    }
                    
                    return $(cell);
                });
            });

            if(objProperties['validation'] != null){
                $(".mrQuestionTable").parent().append("<div id='grid-sum' class='grid-group'>Tổng cộng: " + sumcheck + "</div>")
            }
            break;
    }

    if(objProperties['questiontype'] == 'TOM-SPON'){
        var count = 0;
        
        for(const[key, item] of Object.entries(obj_rows)){
            count += (item.find('input[type=text]').val().length === 0 ? 0 : 1)
        }

        $('.mrNext').prop('disabled', !(count > 0));
    }

    console.log(objProperties);

    //The OpenEnd Grid
    $('.grid-content-openend').click(function(event){
        
        var $td_content = $(this);
        var $td_txt = $(this).parent().next().find('td');
        var $checkboxs = $td_txt.find('input[type=checkbox]').length != 0 ? $td_txt.find('input[type=checkbox]') : undefined;
        var $error = $td_txt.find('.mrErrorText').length != 0 ? $td_txt.find('.mrErrorText') : undefined;
                        
        var $texts = $td_txt.find('textarea').length > 0 ? $td_txt.find('textarea') : undefined;
                        
        if($texts == undefined){
            $texts = $td_txt.find('input[type=text]').length > 0 ? $td_txt.find('input[type=text]') : undefined;
        }

        var str = $td_content.find('.mrQuestionText').html().replace(/<hr>.*<\/span>/g, '');
        
        $td_content.find('.mrQuestionText').html(str);
        
        if($texts.is(':visible')){
            if($texts.val().length > 0){
                switch(objProperties['type'].toLowerCase()){
                    case 'text':
                        $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $texts.val() + "&rdquo;</span>");
                        break;
                    case 'long':
                    case 'double':
                        $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $.fn.formatNumber($texts.val(), $('html').attr('lang').toLowerCase()) + "&rdquo;</span>");
                        break;
                }
            } else {
                if($checkboxs != undefined){
                    $checkboxs.each(function(index, chk){
                        if($(chk).is(':checked')){
                            $td_content.find('.mrQuestionText').append("<hr><span>&ldquo;" + $(chk).next().find('span').html() + "&rdquo;</span>");
                        }
                    });
                } else {
                    if($error != undefined) {
                        $error.hide();
                        $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + $error.html() + "&rdquo;</span>");
                    } else {
                        $td_content.find('.mrQuestionText').append("<hr><span class='error'>&ldquo;" + "Thiếu câu trả lời." + "&rdquo;</span>");
                    }
                }
            }
            
            $td_txt.hide();
        } else {
            if(objProperties['type'].toLowerCase() == 'long' || objProperties['type'].toLowerCase() == 'double')
            {
                $texts.val($.fn.formatNumber($texts.val(), $('html').attr('lang').toLowerCase()));
            }

            $td_txt.show();
            $texts.focus();
        }
    });

    //Format giá trị sau mỗi lần nhập 
    $('.grid-openend-txt').keyup(function(){
        switch(objProperties['questiontype']){
            case 'TOM-SPON':
                var classList = $(this).attr('class').split(/\s+/);
                var pos_1 = parseInt(classList[classList.length - 1].split('-')[1]);
                var pos_2 = parseInt(classList[classList.length - 1].split('-')[2]);
                var $tr = undefined;
                
                var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;

                if(format.test($(this).val())){
                    $(this).val($(this).val().replace(format, ''));
                }

                if(pos_2 == 0){
                    if($(this).val() == '98'){
                        $(this).val('');
                    }
                     
                    $tr = obj_rows["Cell." + pos_1 + "." + pos_2];
                    $('.mrNext').prop('disabled', ($tr.find('input[type=text]').val().length == 0));
                }

                if(pos_2 < Object.keys(obj_rows).length - 1){
                    var $tr = obj_rows["Cell." + pos_1 + "." + (pos_2 + 1)];

                    if($(this).val().length > 0){
                        $tr.show();
                        $('.mrNext').prop('disabled', false);
                    } else {
                        for(var i = pos_2 + 1; i < Object.keys(obj_rows).length; i ++){
                            $tr = obj_rows["Cell." + pos_1 + "." + i];
                            
                            $tr.hide();
                            $tr.find('input[type=text]').val('');
                        }
                    }
                } 
                break;
            default:
                //Nếu type = long|double sẽ format theo 0.000,000
                if(objProperties['type'].toLowerCase() == 'long' || objProperties['type'].toLowerCase() == 'double')
                {
                    $(this).val($.fn.formatNumber($(this).val(), $('html').attr('lang').toLowerCase()));
                    /*
                    var $content = $(this).parent().parent().parent().prev().find('.mrQuestionText');
                    
                    if($(this).val().length > 0)
                    {
                        var str = $content.html().split('<hr>');
                        $content.html(str[0]);
                    }
                    */
                }
                break;
        }
        
    });

    $('.grid-openend-txt').keypress(function(e){
        //Nếu type = long|double sẽ format theo 0.000,000
        if(objProperties['type'].toLowerCase() == 'long' || objProperties['type'].toLowerCase() == 'double')
        {
            //44 - dấu phẩy
            //46 - dấu chấm
            var lang = $('html').attr('lang').toLowerCase();
            var f = objProperties['type'].toLowerCase() == 'long' ? ((e.keyCode >= 48 && e.keyCode <= 57) && e.keyCode != 44 && e.keyCode != 46)
                                            : ((lang == "vi-vn" ? (((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 44) && e.keyCode != 46) : (((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 46) && e.keyCode != 44)));
            
            if(!f)
            {
                e.preventDefault();
                return false;
            }
        }
    });

    $('.grid-openend-txt').change(function(event){
        
        if($(this).val().length > 0)
        {
            if($(this).parent().find('input[type=checkbox]').length > 0)
            {
                $(this).parent().find('input[type=checkbox]').each(function(index, chk){

                    if($(chk).is(':checked')) $(chk).prop('checked', false);
                });
            }
        }
    });

    $('.grid-openend-chk').change(function(event){

        if($(this).is(':checked'))
        {
            $(this).parent().find('textarea').each(function(index, txt){

                $(txt).val("");
            });
        }
    });

    $('.grid-openend-txt').focusin(function(event){
        
        if(objProperties['validation'] != null){
            $(this).data('sumcheck', $(this).val());
        }
    });

    $('.grid-openend-txt').focusout(function(event){
        
        if(objProperties['validation'] != null){
            var prev = $.fn.convertToNumber($(this).data('sumcheck'), objProperties['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            var current = $.fn.convertToNumber($(this).val(), objProperties['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var s = $('#grid-sum').html().split(':');
            
            var sum_prev = $.fn.convertToNumber(s[1].trim(), objProperties['type'].toLowerCase(), $('html').attr('lang').toLowerCase());
            
            var sum = sum_prev - prev + current;
            
            $('#grid-sum').html("Tổng cộng: " + sum);
        }
    });

    //Format lại giá trị number khi nhấn submit
    $('input:submit').click(function(e){
        //Nếu type = long|double sẽ format theo 0.000,000
        if(objProperties['type'].toLowerCase() == 'long' || objProperties['type'].toLowerCase() == 'double')
        {
            $('.mrQuestionTable tbody tr').get().map(function(row){
                
                return $(row).find('td').get().map(function(cell){
                    
                    if($(cell).find('input[type=text]').length == 1)
                    {
                        var $this = $(cell).find('input[type=text]');

                        if($this.val().length > 0)
                        {
                            switch($('html').attr('lang').toLowerCase())
                            {
                                case "vi-vn":
                                    $this.val($this.val().split('.').join(''));
                                    break;
                                default:
                                    $this.val($this.val().split(',').join(''));
                                    break;
                            }
                        }
                    }
                });
            });
            
            if(objProperties['validation'] != null)
            {
                var s = $('#grid-sum').html().split(':');

                var sum = $.fn.convertToNumber(s[1].trim(), objProperties['type'].toLowerCase(), $('html').attr('lang').toLowerCase());

                var html_error = "<div class='error'>Kiểm tra tổng phải bằng " + objProperties['sumcheck'] + ".</div>";

                if(sum != objProperties['sumcheck'])
                {
                    if($('#grid-sum').parent().find('.error').length == 0) $('#grid-sum').before(html_error);
                    
                    e.preventDefault();
                    return false;
                }
                else
                {
                    $('#grid-sum').parent().find('.error').each(function(index, k){
                        k.remove()
                    });
                }
            }
        }
    });
});