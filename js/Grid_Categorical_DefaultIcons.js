$(document).ready(function(){
    
    var objRows = {};
    
    switch($('.grid_categorical_defaulticons').find('.mrQuestionTable').prop('tagName').toLowerCase()){
        case 'table':
            $(".mrQuestionTable").addClass('grid-container');
            
            //Check if header of grid có chứa subgroup
            var number_of_rows = $(".mrQuestionTable tbody tr:first td:first").prop('rowspan');

            var objGroups = {}, objCats = {};

            if(number_of_rows > 1){
                $(".mrQuestionTable tbody tr:first").append($(".mrQuestionTable tbody tr:first").next().find('td').unwrap());
            }

            var $cells = $(".mrQuestionTable tbody tr:first td").get().sort(function(a, b){

                var pos_1 = parseInt($(a).prop('id').split('.')[2]);
                var pos_2 = parseInt($(b).prop('id').split('.')[2]);
                
                var result = pos_1 > pos_2 ? 1 : (pos_1 < pos_2) ? -1 : 0;
                
                return result;
            });

            var $cells = $(".mrQuestionTable tbody tr:first td").get().sort(function(a, b){

                var pos_group_1 = parseInt($(a).prop('id').split('.')[2]);
                var pos_group_2 = parseInt($(b).prop('id').split('.')[2]);

                var pos_1 = parseInt($(a).prop('id').split('.')[1]);
                var pos_2 = parseInt($(b).prop('id').split('.')[1]);
                
                var result = (pos_group_1 == pos_group_2 && pos_1 > pos_2) ? 1 : (pos_group_1 == pos_group_2 && pos_1 < pos_2) ? -1 : 0;
                
                return result;
            });
            
            $.each($cells, function(index, cell){
                
                var text = $(cell).find('.mrQuestionText').html();
                var regExp = new RegExp("<img.*?>");
                            
                if(regExp.test(text)){
                    var s1 = text.replace(regExp, "");
                    var s2 = text.replace(s1, "");

                    s1 = s1.replace(/<.*?(\/>)/, "");
                    s1 = s1.replace(/<.*?(>)/, "");
                    
                    $(cell).find('.mrQuestionText').html("<div class='cat-image-container'><div class='cat-image-item'>" + s2 + "</div><div class='cat-image-item'>" + s1 + "</div></div>");
                }
                
                switch(number_of_rows){
                    case 2:
                        if($(cell).prop('colspan') > 1 || ($(cell).prop('colspan') == 1 && $(cell).prop('rowspan') == 1 && parseInt($(cell).prop('id').split('.')[2]) == 0)){
                            objGroups[$(cell).prop('id')] = $(cell);
                        } else {
                            objCats[$(cell).prop('id')] = $(cell); 
                        }
                        break;
                    default:
                        if($(cell).prop('colspan') > 1){
                            objGroups[$(cell).prop('id')] = $(cell);
                        } else {
                            objCats[$(cell).prop('id')] = $(cell); 
                        }
                        break;
                }
            });

            $(".mrQuestionTable tbody tr:first").find('td').removeAttr('colspan');
            $(".mrQuestionTable tbody tr:first").find('td').removeAttr('rowspan');
           
            $.each($cells, function(index, cell){
                if($(cell).prop('colspan') == 1){
                    $(".mrQuestionTable tbody tr:first").append(cell);
                } 
            });

            console.log(objCats);

            $(".mrQuestionTable tbody tr:first").remove();
            
            $(".mrQuestionTable tbody").find('td').unwrap().wrap($('<tr/>'));
            $(".mrQuestionTable tbody tr td").removeAttr('style');
            
            $(".mrQuestionTable tbody tr td").find('input[type=checkbox]').wrap("<span class='cat-group'/>");
            $(".mrQuestionTable tbody tr td").find('input[type=radio]').wrap("<span class='cat-group'/>");

            $(".mrQuestionTable tbody tr td").find('.cat-group').get().map(function(cat){
                
                if($(cat).next().prop('tagName') == 'SPAN'){
                    $(cat).append($(cat).next());
                }
            });
            
            var step = 0;
            
            var row = -1, next_now = -1;
            var obj_row = {}, obj_cats = {}, obj_catothers = {}, obj_catexclusives = {}, obj_subgroups = {};

            $(".mrQuestionTable tbody tr td").get().map(function(cell){
                
                if($(cell).find('input[type=checkbox]').length == 1 || $(cell).find('input[type=radio]').length == 1){
                    
                    $(cell).parent().addClass('grid-cat');
                    
                    row = $(cell).prop('id').substring($(cell).prop('id').lastIndexOf('.') + 1, $(cell).prop('id').length);
                    
                    $(cell).attr('row', row);

                    var id_cat = $(cell).prop('id');
                    id_cat = id_cat.substring(0, id_cat.lastIndexOf('.') + 1) + "0";
                    
                    if(Object.keys(objGroups).indexOf(id_cat) != -1){
                        $(cell).parent().before("<tr class='grid-cat'><td id='" + (id_cat + "." + row) + "' class='mrShowText' row='" + row + "' style='display:none;'>" + $(objGroups[id_cat]).html() + "</td></tr>");

                        obj_subgroups[id_cat + "." + row] = $(cell).parent().prev().find('td');
                    }

                    if(Object.keys(objCats).indexOf(id_cat) == -1){
                        id_cat = id_cat.substring(0, id_cat.lastIndexOf('.') + 1) + "1";

                        if(Object.keys(objCats).indexOf(id_cat) == -1){
                            id_cat = id_cat.substring(0, id_cat.lastIndexOf('.') + 1) + "2";
                        }
                    }

                    var $chk = undefined;

                    if($(cell).find('input[type=checkbox]').length == 1){
                        $chk = $(cell).find('input[type=checkbox]');
                    } else if($(cell).find('input[type=radio]').length == 1){
                        $chk = $(cell).find('input[type=radio]');
                    }

                    if($chk != undefined){
                        
                        $chk.after("<label for='" + $chk.prop('id') + "'>" + $(objCats[id_cat]).html() + "</label>");
                        
                        if($chk.hasClass('mrSingle'))
                        {
                            $chk.addClass('cat-single-item');
                        } 
                        if($chk.hasClass('mrMultiple'))      
                        {
                            $chk.addClass('cat-multiple-item');
                        }
                        if($chk.css('visibility') == 'hidden'){
                            $chk.prop('disabled', true);
                        }

                        if($(cell).find('input[type=text]').length == 1){
                            $other = $(cell).find('input[type=text]');
                            
                            obj_catothers[$(cell).prop('id')] = $(cell);
                            $other.addClass('cat-other');

                            $other.hide();

                            if($chk.is(':checked')){
                                $other.show();
                            }
                        }

                        if($(cell).find('.mrQuestionText').length == 1){
                            $exclusive = $(cell).find('.mrQuestionText');

                            if($exclusive.css('font-weight') == "700" || $exclusive.css('font-weight') == "bold")
                            {
                                obj_catexclusives[$(cell).prop('id')] = $(cell);

                                $(cell).find('.cat-group').addClass('exclusive');
                                $exclusive.addClass('exclusive');
                            }
                        }

                        if(Object.keys(obj_catothers).indexOf($(cell).prop('id')) == -1 && Object.keys(obj_catexclusives).indexOf($(cell).prop('id')) == -1){
                            obj_cats[$(cell).prop('id')] = $(cell);
                        }
                    }

                    var flag = false;

                    if(!$(cell).parent().is('tr:last')){
                        var $next_cell = $(cell).parent().next().find('td');
            
                        next_row = $next_cell.prop('id').substring($next_cell.prop('id').lastIndexOf('.') + 1, $next_cell.prop('id').length); 

                        if(row != next_row) flag = true;
                    } else if($(cell).parent().is('tr:last')){
                        flag = true;
                    }
                    
                    if(flag){
                        objRows[row] = {
                            'row' : obj_row,
                            'cats' : obj_cats,
                            'catothers' : obj_catothers,
                            'catexclusives' : obj_catexclusives,
                            'subgroups' : obj_subgroups
                        }

                        obj_row = {};
                        obj_cats = {};
                        obj_catothers = {};
                        obj_catexclusives = {};
                        obj_subgroups = {};
                    }
                    
                    $(cell).hide();
                } else {
                    if($(cell).find('.mrQuestionText').length == 1){
                    
                        var $td = $(cell).parent().find('td');
                        
                        //$(cell).parent().next().find('select').length == 0
                        if($td.prop('rowspan') != 1){
                            $(cell).parent().addClass('grid-subgroup');
                            $td.removeAttr('rowspan');
                        } else {
                            $(cell).parent().addClass('grid-attr');
                            
                            var text = $(cell).find('.mrQuestionText').html();
                            var regExp = new RegExp("<img.*?>");
                            
                            if(regExp.test(text)){
                                
                                var s1 = text.replace(regExp, "");
                                var s2 = text.replace(s1, "");

                                s1 = s1.replace(/<.*?(\/>)/, "");
                                s1 = s1.replace(/<.*?(>)/, "");
                                
                                $(cell).find('.mrQuestionText').html("<div class='row'><div class='cell'>" + s2 + "</div><div class='cell'>" + s1 + "</div></div>");
                            }
                            
                            if($(cell).find('.mrErrorText').length == 1){
                                $(cell).find('.mrErrorText').hide();
                                $(cell).parent().removeClass('bg-primary');
                                $(cell).parent().addClass('bg-danger');
                            } else {
                                $(cell).parent().addClass('bg-primary');
                                $(cell).parent().removeClass('bg-danger');
                            }

                            if($td.prop('colspan') != 1){
                                step = $td.prop('colspan') - 1;
                                $td.removeAttr('colspan');
                            } else {
                                step = $td.prop('id').split('.')[1];
                            }

                            $(cell).parent().addClass('grid-content');
                            
                            obj_row = $(cell);
                        }
                    }
                }
            });
            
            console.log(objRows);
            break;
    }

    $('input:submit').click(function(event){
        
        if(event["currentTarget"].className == "mrNext"){
            
            Object.keys(objRows).forEach(function(row){

                var result_row = false;
                var $grid_attr = undefined;

                Object.keys(objRows[row]).forEach(function(cats){

                    if(cats != 'row'){
                        Object.keys(objRows[row][cats]).forEach(function(cat){

                            var $cat = $(objRows[row][cats][cat]);
    
                            if($cat.find('input[type=checkbox]').is(':checked')){
                                result_row = true;
                            }
                        });
                    } else {
                        $grid_attr = $(objRows[row]['row']);
                    }
                });

                if(result_row){
                    //Attribute is answered.
                    $grid_attr.parent().addClass('bg-primary');
                    $grid_attr.parent().removeClass('bg-danger');
                } else {
                    //Attribute is not answered.
                    $grid_attr.parent().removeClass('bg-primary');
                    $grid_attr.parent().addClass('bg-danger');
                }
            });
        }
    });
    
    $('.grid-attr').click(function(event){
        
        var cur_row = $(this).find('.mrGridCategoryText').prop('id').split('.')[2];

        $(".mrQuestionTable tbody .grid-cat td").hide();

        var $grid_attr = undefined;

        Object.keys(objRows[cur_row]).forEach(function(cats){

            $grid_attr = $(objRows[cur_row]['row']);

            if(cats != 'row'){
                Object.keys(objRows[cur_row][cats]).forEach(function(cat){

                    var $cat = $(objRows[cur_row][cats][cat]);
    
                    if($cat.is(':visible')){
                        $cat.hide();
                    } else {
                        $grid_attr.parent().addClass('bg-primary');
                        $cat.show();
                    } 
                });
            }
        });

        var count_error = 0;

        Object.keys(objRows).forEach(function(row){
            if(cur_row != row){
                var result_row = false;
                $grid_attr = undefined;
                
                Object.keys(objRows[row]).forEach(function(cats){

                    if(cats != 'row'){
                        Object.keys(objRows[row][cats]).forEach(function(cat){

                            var $cat = $(objRows[row][cats][cat]);

                            if($cat.find('input[type=checkbox]').is(':checked')){
                                result_row = true;
                            } else if($cat.find('input[type=radio]').is(':checked')){
                                result_row = true;
                            }
                        });
                    } else {
                        $grid_attr = $(objRows[row]['row']);
                    }
                });

                if(result_row){
                    //Attribute is answered.
                    $grid_attr.parent().addClass('bg-primary');
                    $grid_attr.parent().removeClass('bg-danger');
                } else {
                    //Attribute is not answered.
                    count_error++;

                    $grid_attr.parent().removeClass('bg-primary');
                    $grid_attr.parent().addClass('bg-danger');

                    if(count_error == 1){
                        $('.error').show();
                        $('.mrNext').prop('disabled', true);

                        if(objRows[row]['row'].find('.mrErrorText').length){
                            str_attr = objRows[row]['row'].find('.mrQuestionText').html();
                            str_error = objRows[row]['row'].find('.mrErrorText').html();
    
                            var msg_error = "Câu '" + str_attr + "' (" + row + "): " + str_error
    
                            $('.error').find('.mrErrorText').html(msg_error);
                        }
                    }
                }
            }
        });

        if(count_error == 0){
            $('.mrNext').prop('disabled', false);
            $('.error').hide();
        } 
    });

    $('.cat-single-item').change(function(event){
        
        var $cat = $(this).parent().parent();
        var $other = $cat.find('.cat-other');
        $other.show();

        var row = $cat.attr('row');
        
        $.each(objRows[row]['catothers'], function(key, cat){
            
            if(key != $cat.prop('id')) {

                $oth = cat.find('.cat-other');
                $oth.hide();
                $oth.val("");

                $err = cat.find('.mrErrorText');
                $err.hide();
            }
        });
    });

    $('.cat-multiple-item').change(function(event){
        
        var $cat = $(this).parent().parent();
        var $other = $cat.find('.cat-other');

        var row = $cat.attr('row');

        if($(this).is(':checked')){
            $other.show();

            if($cat.find('.cat-group').hasClass('exclusive')) {
                
                $.each(objRows[row]['cats'], function(key, cat){
                    cat.find('.cat-multiple-item').prop('checked', false);
                });

                $.each(objRows[row]['catothers'], function(key, cat){
                    cat.find('.cat-multiple-item').prop('checked', false);

                    var $oth = cat.find('.cat-other');
                    $oth.hide();
                    $oth.val("");

                    cat.find('.mrErrorText').hide();
                });

                $.each(objRows[row]['catexclusives'], function(key, cat){
                    
                    if($cat.prop('id') != key){
                        cat.find('.cat-multiple-item').prop('checked', false);
                    }
                });
            } else {
                
                $.each(objRows[row]['catexclusives'], function(key, cat){
                    cat.find('.cat-multiple-item').prop('checked', false);
                });
            }
        } else {
            $other.hide();
            $other.val("");

            $other.hide();
        }
    });
});