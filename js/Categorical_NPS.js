$(document).ready(function(){

    var $table = $(".mrQuestionTable");
    var $cells = $table.children();
    var totalItems = $cells.length;
    var minVal = 0;
    var maxVal = totalItems - 1;

    // Lấy label của phần tử đầu và cuối
    var firstLabel = $cells.first().find('.mrSingleText').text().trim();
    var lastLabel  = $cells.last().find('.mrSingleText').text().trim();

    // Kiểm tra giá trị đang được chọn
    var currentVal = -1;
    $cells.each(function(index){
        if($(this).find('input').is(':checked')){
            currentVal = index;
        }
    });

    // Ẩn bảng radio gốc
    $table.hide();

    // Dựng UI slider
    var valuePanelHtml = currentVal >= 0
        ? '<span class="nps-value">' + currentVal + '</span>'
        : '';

    $('#nps-slider-container').html(
        '<div class="nps-wrapper">' +
            '<div class="nps-value-display" id="nps-value-display">' + valuePanelHtml + '</div>' +
            '<div class="nps-track-wrapper">' +
                '<input type="range" id="nps-input" class="nps-input"' +
                    ' min="' + minVal + '" max="' + maxVal + '"' +
                    ' value="' + (currentVal >= 0 ? currentVal : minVal) + '" />' +
            '</div>' +
            '<div class="nps-end-labels">' +
                '<span class="nps-label-left">' + firstLabel + '</span>' +
                '<span class="nps-label-right">' + lastLabel + '</span>' +
            '</div>' +
        '</div>'
    );

    var $input = $('#nps-input');

    if(currentVal >= 0){
        updateTrack(currentVal);
    }

    $input.on('input change', function(){
        var val = parseInt($(this).val());
        updateTrack(val);
        showValue(val);
        syncRadio(val);
    });

    function updateTrack(val){
        var pct = ((val - minVal) / (maxVal - minVal)) * 100;
        $input.css('background',
            'linear-gradient(to right, #047AA8 ' + pct + '%, #d3d3d3 ' + pct + '%)');
        $input.css('opacity', '1');
    }

    function showValue(val){
        $('#nps-value-display').html('<span class="nps-value">' + val + '</span>');
    }

    function syncRadio(val){
        $cells.each(function(index){
            $(this).find('input').prop('checked', index === val);
        });
    }

});
