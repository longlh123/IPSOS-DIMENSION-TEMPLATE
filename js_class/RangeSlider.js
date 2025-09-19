class RangeSlider{
    constructor(id, properties){
        this.properties = properties;

        this.html = {
            root : objHTML.get(id)[0]
        }
        
        this.init();
    }

    init(){
        this.render();
    }

    render(){
        this.html.questionText = document.getElementsByClassName('mrQuestionText')[0];
        this.html.numDimension = this.html.root.previousElementSibling;
        
        var cur_value = 0;

        this.html.numDimension.childNodes.forEach(function(element){
            if(element.nodeName.toLowerCase() == "input"){
                cur_value = (element.value.length == 0 ? 0 : element.value);
            }
        });

        var txt = this.html.questionText.innerHTML;
        this.html.questionText.innerHTML = txt.replace(/<img.*>/g, '');
        this.html.questionText.innerHTML = txt.replace(/<div.*>.*<\/div>/g, '')
        
        if(txt.match('<img.*>') != null){
            this.html.rangeImage = objHTML.template('<div class="range-image" id="range-image">' + txt.match('<img.*>')[0] + '</div>');
        } else {
            this.html.rangeImage = objHTML.template('<div class="range-title" id="range-title">' + txt.match('<div.*>.*<\/div>')[0] + '</div>')
        }
        
        this.html.rangeValue = objHTML.template('<div class="range-value" id="range-value"></div>');
        this.html.rangeInput = objHTML.template('<input type="range" min="' + this.properties["minrange"] + '" max="' + this.properties["maxrange"] + '" value="' + cur_value + '" />');

        this.html.root.appendChild(this.html.rangeImage);
        this.html.root.appendChild(this.html.rangeValue);
        this.html.root.appendChild(this.html.rangeInput);
        this.html.root.appendChild(this.html.numDimension);
        this.html.numDimension.hidden = true;
        
        switch(this.properties["questiontype"].toLowerCase()){
            case "range-slider":
                this.html.rangeLabel = objHTML.template('<div class="range-label"><div>' + this.properties["bottomlabel"]  + '</div><div>' + this.properties["toplabel"]  + '</div></div>');
                this.html.root.appendChild(this.html.rangeLabel);
                break;
        }
        
        if(cur_value > 0){
            this.renderRangeSlider(this.html.rangeInput);
            this.renderRangeValue(this.html.rangeInput);
        }

        let that = this;
        
        this.html.rangeInput.on('change', function(e){
            that.renderRangeSlider(this);
            that.renderRangeValue(this);
            that.setValue(this);
        });
    }

    renderRangeSlider(element){
        //Get value of the input
        let x = element.value;
        //Get min and max value
        const num_min = element.min;
        const num_max = element.max;
        
        const range_width = getComputedStyle(element).getPropertyValue('width');
        const num_range_width = range_width.substring(0, range_width.length - 2);

        let n =  num_range_width / (num_max - num_min); //độ rộng của mỗi phần
        let p = (x - 1) * (n / num_range_width) * 100.0; //% một khoảng chiếm trên range
        
        //var color = 'linear-gradient(90deg, #047AA8 ' + p + '%, #d3d3d3 ' + p + '%)';
        let color = 'linear-gradient(to right, #047AA8 0, #047AA8 ' + p + '%, #d3d3d3 ' + p + '%, #d3d3d3 100%)';
        element.style.background = color;
    }

    renderRangeValue(element){
        //Get value of the input
        let x = element.value;
        //Get min and max value
        const num_min = element.min;
        const num_max = element.max;

        while(element.previousElementSibling.firstChild){
            element.previousElementSibling.removeChild(element.previousElementSibling.lastChild);
        }

        let span;

        switch(this.properties["questiontype"].toLowerCase()){
            case "closeness-slider":
                span = objHTML.template('<span class="heart"></span>');
                break;
            case "range-slider":
                span = objHTML.template('<span class="comment">' + x + '</span>');
                break;
        }

        element.previousElementSibling.appendChild(span);
                
        //Get the width of the input
        const range_width = getComputedStyle(element).getPropertyValue('width');
        //Remove px and convert to number
        const num_range_width = range_width.substring(0, range_width.length - 2);
        //get the width of the label
        const label_width = getComputedStyle(element.previousElementSibling.childNodes[0]).getPropertyValue('width');
        //Remove px and convert to number
        const num_lable_width = label_width.substring(0, label_width.length - 2);

        let n =  num_range_width / (num_max - num_min); //độ rộng của mỗi phần

        switch(this.properties["questiontype"].toLowerCase()){
            case "closeness-slider":
                let heart = document.getElementsByClassName('heart')[0];
                heart.style.left = (((x - 1) * n) - this.scale(x, num_min, num_max, 25)) + "px";
                heart.style.transform = 'rotate(45deg) scale(' + (1 + (((x - 1) / (num_max - num_min))) * 0.4) + ')';
                heart.style.top = (1 - Math.ceil(x / 10)) + "px";
                break;
            case "range-slider":
                span.style.left = (((x - 1) * n) - this.scale(x, num_min, num_max, 25)) + "px";
                span.style.transform = 'translateX(0) scale(1.5)';
                //span.style.top = "65%";
                span.style.top = "35%";
                break;
        }
    }

    scale(x, min, max, value){
        let r = value + ((x - max) * (value / (max - min)));
        return r;
    }

    setValue(element){
        /*
        switch(this.properties["questiontype"].toLowerCase()){
            case "closeness-slider":
                this.html.numDimension.lastElementChild.value = Math.round(e.target.value / 10 + 0.4);
                break;
            case "range-slider":
                this.html.numDimension.lastElementChild.value = e.target.value;
                break;
        }
        */
        this.html.numDimension.lastElementChild.value = element.value;
    }
}