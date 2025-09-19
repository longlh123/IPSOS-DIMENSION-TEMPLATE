document.addEventListener("DOMContentLoaded", function(){

    let dropdown_items = document.querySelectorAll(".dropdownlist-wrapper");

    dropdown_items.forEach(function(dropdown_item){
        new DropDownList(dropdown_item);
    })
});