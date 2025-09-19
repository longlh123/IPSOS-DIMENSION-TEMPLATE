/*
obj = {
    placeholder : "text", //a symbol or piece of text that temporarily replaces st that is missing. 
    validation : "checkphonenumber", //the act of proving that st is true or correct
    type : "text|long|double", 
    questiontype : "TOM-SPON"          : Using for the TOM_SPON question
                   "CLOSENESS-SLIDER"  : Using for the scale question with a heart thumb. (minRange:1 & maxRange:100)
                   "RANGE-SLIDER"      : Using for the scase question (minRange:1 & maxRange:5|7|9|10 & bottomLabel:Khong thich & topLabel:thich) 
                   "DATE"              : Using with textContentRule: DD/MM/YYYY or MM/YYYY
    rangeExpression                    : Regular expression
    videoid : "string", //Ma video tu Youtube
    sum : value
}
*/
function convertJSON(s){
    var obj = {};
    
    var a = s.split(',');

    for(var i in a){
        var b = a[i].split(':');
        obj[b[0].toLowerCase()] = b[1];
    }

    //set the default value of type of a text field is 'text'.
    if(!obj.hasOwnProperty('type')) obj['type'] = 'text';
    //set the default value of type of a questiontype is default
    if(!obj.hasOwnProperty('questiontype')) obj['questiontype'] = 'default';
    //set the default value of validation is null.
    if(!obj.hasOwnProperty('validation')) obj['validation'] = null;
    //set the default value of placeholder
    if(!obj.hasOwnProperty('placeholder')) obj['placeholder'] = 'Điền câu trả lời...';
    //set the default value of step
    if(!obj.hasOwnProperty('step')) obj['step'] = 1;
    //set the range expression 
    if(!obj.hasOwnProperty('rangeexpression')) obj['rangeexpression'] = null;

    return obj;
}

objHTML = {
    get : function(selector){
        let elements = document.querySelectorAll(selector);
        for(let i = 0; i < elements.length; i++){
            this.init(elements[i]);
        }
        return elements;
    },
    template : function(html){
        var template = document.createElement('div');
        template.innerHTML = html.trim();
        return this.init(template.childNodes[0]);
    },
    init : function(element){
        element.on = function(event, func){
            this.addEventListener(event, func);
        }
        return element;
    }
}