$(document).ready(function(){
    
    var objCats = {}, objCatOthers = {}, objCatExclusives = {};

    //Properties
    var objProperties = {};

    if($('.custom_question_properties').length == 1){
        $('.custom_question_properties').hide();

        objProperties = $.fn.convertJSON($('.custom_question_properties').text());
    }

    //Determine whether a question is the single or multiple answer question.
    var ismultiple = false;
    var cells = [];
    var iscensydiam_template = false;

    var iscatimages = $('.content').find('.categorical_imagineicons').length == 1;

    console.log(iscatimages);

    if(!iscatimages){
        iscatimages = $('.content').find('.categorical_censydiam_imagineicons').length == 1;
        iscensydiam_template = iscatimages;
    }

    switch($(".mrQuestionTable").prop('tagName').toLowerCase())
    {
        case "table":
            $('.mrQuestionTable').css('border-collapse', 'collapse');

            if(iscatimages){
                $(".mrQuestionTable").addClass('cat-image-container');
            } else {
                $(".mrQuestionTable").addClass('cat-container');
            }
            
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
            
            var $rows = $(".mrQuestionTable tbody tr").get();

            $rows.sort(function(a, b){

                var x1 = parseInt($(a).attr('pos_1')), x2 = parseInt($(b).attr('pos_1'));
                
                var result = x1 > x2 ? 1 : (x1 < x2) ? -1 : 0;
                
                return result;
            });

            $.each($rows, function(index, row) {
                $('.mrQuestionTable tbody').append(row);
            });

            $cells = $(".mrQuestionTable tbody tr");
            break;
        default:
            if(iscatimages){
                if(iscensydiam_template){
                    $(".mrQuestionTable").addClass('cat-image-censydiam-container');
                } else {
                    $(".mrQuestionTable").addClass('cat-image-container');
                }
            } else {
                $(".mrQuestionTable").addClass('cat-container');
            }

            $cells = $(".mrQuestionTable");
            break;
    }

    cells = $cells.children().get().map(function(span){

        var ischecked = false, isonlycat = true;
        
        $(span).addClass('cat-group');

        if (iscatimages){
            $(span).addClass('cat-image');
        } else {
            var $text = $(span).find('.mrMultipleText').length == 1 ? $(span).find('.mrMultipleText') : $(span).find('.mrSingleText');

            var text = $text.html();
            var regExp = new RegExp("<img.*?>");
            
            if(regExp.test(text)){
                $(span).addClass('cat-image-new');
                /*
                var s1 = text.replace(regExp, "");
                var s2 = text.replace(s1, "");

                s1 = s1.replace(/<.*?(\/>)/, "");
                s1 = s1.replace(/<.*?(>)/, "");
                
                $text.html("<div class='cat-image-container'><div class='cat-image-item'>" + s2 + "</div><div class='cat-image-item'>" + s1 + "</div></div>");
                */
            }
        }

        $(span).children().each(function(){

            if($(this).is('input:radio') || $(this).is('input:checkbox')) {

                if($(this).hasClass('mrSingle'))
                {
                    $(this).addClass('cat-single-item');
                } 
                if($(this).hasClass('mrMultiple'))      
                {
                    $(this).addClass('cat-multiple-item');
                }

                ischecked = $(this).is(':checked');
            }
            else if($(this).is('label')) {

                $(this).children().each(function(){

                    if($(this).is('span') && $(this).attr('class') == "mrMultipleText")
                    {
                        console.log($(this).css('font-weight'));

                        if($(this).css('font-weight') == "700" || $(this).css('font-weight') == "bold")
                        {
                            objCatExclusives[$(span).prop('id')] = $(span);

                            $(this).addClass('exclusive');
                            $(this).css('font-weight', 400);
                            
                            $(span).addClass('exclusive');

                            isonlycat = false;
                        }
                    }
                });
            }
            else if($(this).is('span')) {

                $(this).children().each(function() {
                    
                    if($(this).is('span') && $(this).prop('class') == 'mrErrorText') {
                        $(this).addClass('error');
                        $(this).show();
                    } else if($(this).is('input:text')) {

                        objCatOthers[$(span).prop('id')] = $(span);
                        
                        $(this).addClass('cat-other');
                        $(this).show();
                        
                        if(!ischecked) $(this).parent().hide();

                        if($(this).prev().length == 1) {
                            $(this).prev().show();
                        }

                        if(objProperties.hasOwnProperty('placeholder')) {
                            $(this).attr('placeholder', objProperties['placeholder']);
                        }

                        isonlycat = false;
                    }
                });
            }
        });

        if(isonlycat) objCats[$(span).prop('id')] = $(span);

        return($(span));        
    });

    $('.cat-single-item').change(function(event) {
        
        var $cat_container = $(this).parent().parent();

        $cat_container.children().each(function(){

            $oth = $(this).find('.cat-other');
            $err = $(this).find('.mrErrorText');

            ischecked = $(this).find('.cat-single-item').is(':checked');

            if(ischecked){
                $oth.parent().show();
            } else {
                $oth.parent().hide();
                $oth.val("");

                $err.hide();
            }
        });
    });

    $('.cat-multiple-item').change(function(event) {
        
        var $cat_container = $(this).parent().parent();

        $other = $(this).parent().find('.cat-other');
        $error = $(this).parent().find('.mrErrorText');

        if($(this).is(':checked')){
            
            if($(this).parent().hasClass('exclusive')){

                id_main = $(this).parent().prop('id');

                $cat_container.children().each(function(){

                    if(id_main != $(this).prop('id')){

                        $(this).find('.cat-multiple-item').prop('checked', false);

                        $oth = $(this).find('.cat-other');
                        $err = $(this).find('.mrErrorText');

                        $oth.parent().hide();
                        $oth.val("");
                        $err.hide();
                    }
                });
            } else {

                $cat_container.children().each(function(){

                    if($(this).hasClass('exclusive')){

                        $(this).find('.cat-multiple-item').prop('checked', false);
                    }
                })
            } 

            if($other.length != 0){
                
                if($(this).is(':checked')){
                    $other.parent().show();
                } else {
                    $other.parent().hide();
                    $other.val("");

                    $error.hide();
                }
            }     
        } else {

            if($other.length != 0){

                $other.parent().hide();
                $other.val("");

                $error.hide();
            }
        }


        
        /*
        var $cat_group = $(this).parent();
        
        if($(this).is(':checked')) {
            $cat_group.find('.cat-other').show();

            if($cat_group.find('.cat-other').prev().length == 1){
                $cat_group.find('.cat-other').prev().show();
            }

            if($cat_group.hasClass('exclusive')) {
                
                $.each(objCats, function(key, cat) {
                    cat.find('.cat-multiple-item').prop('checked', false);
                });

                $.each(objCatOthers, function(key, cat) {
                    cat.find('.cat-multiple-item').prop('checked', false);

                    cat.find('.cat-other').hide();
                    cat.find('.cat-other').val("");

                    cat.find('.mrErrorText').hide();
                });

                $.each(objCatExclusives, function(key, cat) {
                    
                    if($cat_group.prop('id') != key) {
                        cat.find('.cat-multiple-item').prop('checked', false);
                    }
                });
            } else {
                
                $.each(objCatExclusives, function(key, cat){
                    cat.find('.cat-multiple-item').prop('checked', false);
                });
            }
        } else {
            $cat_group.find('.cat-other').hide();
            $cat_group.find('.cat-other').val("");

            if($cat_group.find('.cat-other').prev().length == 1) {
                $cat_group.find('.cat-other').prev().hide();
            }

            $cat_group.find('.mrErrorText').hide();
        }
        */
    });

    
});

