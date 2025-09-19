document.addEventListener("DOMContentLoaded", function(){
    let customQuestionProperties = document.getElementsByClassName('custom_question_properties');
    let properties = {};
    
    if(customQuestionProperties.length > 0){
        properties = convertJSON(customQuestionProperties[0].innerHTML);

        customQuestionProperties[0].hidden = true;
    }

    let rangeSlider = new RangeSlider("#range-slider", properties);
});


