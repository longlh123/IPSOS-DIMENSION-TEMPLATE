class DropDownList{
    constructor(selector){
        this.html = {
            root : selector
        };

        this.init();
    }

    init(){
        this.render();
    };

    render(){
        this.html.display = objHTML.template("<div class='dropdownlist-display'></div>");
        this.html.options = objHTML.template("<div class='dropdownlist-options'></div>");

        this.html.root.appendChild(this.html.display);
        this.html.root.appendChild(this.html.options);
    };
}