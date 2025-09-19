$(document).ready(function(){

    switch($('.mrQuestionTable').prop('tagName').toLowerCase()){
        case 'table':
            $(".mrQuestionTable").addClass('grid-container');

            console.log("hi");

            var idx_row = 0;
            var numberofcells = 0;
            var $header_scales = undefined;

            $(".mrQuestionTable tbody tr").get().map(function(row){
                
                var idx_cell = 0;
                
                $(row).addClass('grid-row');
                
                $(row).find('td').get().map(function(cell){
                    
                    if($(cell).find('input[type=radio]').length + $(cell).find('input[type=checkbox]').length == 0){
                        
                        if((idx_row == 0 && $(cell).find('.mrQuestionText').length == 0) || (idx_row != 0 && $(cell).find('.mrQuestionText').length == 1)){
                            
                            $(row).before($(cell));
                            
                            if($(row).prev().attr('rowspan') != undefined){
                                $(row).prev().removeAttr('rowspan');
                                $(row).prev().wrap("<tr class='grid-subgroup'/>");
                            } else{
                                if($(row).prev().find('.mrQuestionText').length == 1){
                                    $(row).prev().wrap("<tr class='grid-attr grid-content bg-primary'/>");

                                    var text = $(row).prev().find('.mrQuestionText').html();
                                    var regExp = new RegExp("<img.*?>");
                                    
                                    if(regExp.test(text)){
                                        var s1 = text.replace(regExp, "");
                                        var s2 = text.replace(s1, "");

                                        s1 = s1.replace(/<.*?(\/>)/, "");
                                        s1 = s1.replace(/<.*?(>)/, "");
                                        
                                        $(row).prev().find('.mrQuestionText').html(s1 + "<br/>" + s2);
                                    }
                                } else {
                                    $(row).prev().wrap("<tr class='grid-row'/>");
                                }
                            }
                            
                            $(row).prev().find('td:first').removeAttr('style');

                            if(idx_row == 0) numberofcells = $(row).find('td').length;

                            $(row).prev().find('td:first').attr('colspan', numberofcells);
                        }
                    } else {
                        
                        $(cell).addClass('grid-cell');

                        if($(cell).find('input[type=radio]').length + $(cell).find('input[type=checkbox]').length == 1){
                            
                            $(cell).parent().removeClass('grid-row');
                            $(cell).parent().addClass('grid-scale');

                            $item = $(cell).find('input[type=radio]').length == 1 ? $(cell).find('input[type=radio]') : $(cell).find('input[type=checkbox]');

                            $item.wrap("<span class='cat-default'/>");
                            $item.after("<label for='" + $item.prop('id') + "'></label>");
                        }
                    }
                    
                    $(cell).removeAttr('style');
                    idx_cell++;
                });

                if(idx_row == 0){
                    $(".mrQuestionTable tbody tr:first").remove();

                    $header_scales = $(".mrQuestionTable tbody tr:first");
                    $header_scales.find('td').addClass('grid-cell');
                    $(".mrQuestionTable tbody tr:first").remove();
                } else {
                    if($(row).attr('class') == 'grid-scale'){
                        $(row).before("<tr class='grid-label'>" + $header_scales.html() + "</tr>");
                    
                        if(!$(row).is('tr:last')){
                            $(row).after("<tr><td style='padding:3px' colspan='" + $(row).find('.grid-scale').length + "'></td></tr>")
                        }
                    }
                }

                idx_row++;
            });
            break;
    }
});