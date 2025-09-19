document.addEventListener("DOMContentLoaded", function(event){

    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
        console.log("is dark mode");
		
		if(document.getElementById("logo") != undefined){
			document.getElementById("logo").src = "https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/source_ipsos/images/Manulife logo_2.png";
		}
    }

    var elements = document.getElementsByTagName("input");
    
    for(var i = 0; i < elements.length; i++)
    {
        switch(elements[i].type)
        {
            case "submit":
                elements[i].style.removeProperty("width");
                break;
            case "text":
            case "checkbox":
            case "radio":
                elements[i].style.removeProperty("margin-left");
                break;
        }
    }

    var elements = document.getElementsByTagName("textarea");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("margin-left");
    }

    var elements = document.getElementsByTagName("select")
    
    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("margin-left");
    }

    var elements = document.getElementsByClassName("mrErrorText");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("color");
        elements[i].style.removeProperty("font-weight");
        elements[i].style.removeProperty("border-color");
    }

    var elements = document.getElementsByClassName("mrQuestionTable");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("display");
        elements[i].style.removeProperty("margin-left");
    }

    var elements = document.getElementsByClassName("mrMultipleText");

    for(var i = 0; i < elements.length; i++)
    {
        elements[i].style.removeProperty("text-align");
        elements[i].style.removeProperty("vertical-align");
    }
    
    var mrPrevs = document.getElementsByName("_NPrev");
    
    if(mrPrevs.length > 0){
        //console.log(!mrPrevs[0].hasOwnProperty('display'));

        if(!mrPrevs[0].hasOwnProperty('display')){
            mrPrevs[0].style.visibility = "visible";
            //mrPrevs[0].style.display = "none";
        }
    }

    var mrNext = document.getElementsByName("_NNext")[0];
    var mrPrev = document.getElementsByName("_NPrev")[0];
    var divContent = document.getElementsByClassName("content")[0];
    
    setTimeout(function(){
        var videobasic = document.getElementsByClassName("videobasic")[0];
        var duel_container = document.getElementsByClassName("duel-container")[0];

        if(videobasic == undefined){
            if(mrNext != undefined){
                var domRect = divContent.getBoundingClientRect();
                
                //console.log(divContent.clientHeight);
                //console.log(divContent.scrollTop);
                //console.log(divContent.scrollHeight);

                var p = ((divContent.getBoundingClientRect()["height"] + divContent.scrollTop) / divContent.scrollHeight) * 100;

                if(p >= 95.0){
                    mrNext.disabled = false;
                } else {
                    mrNext.disabled = true;
                }

                //mrNext.disabled = (divContent.scrollHeight > divContent.clientHeight);
            }
        }
        if(duel_container != undefined){
            mrNext.disabled = true;
            mrPrev.disabled = true;
        }
    }, 300);
    
    divContent.addEventListener("scroll", function(e){
        //console.log(divContent.getBoundingClientRect()["height"]);
        //console.log(divContent.scrollTop);
        //console.log(divContent.scrollHeight);

        var domRect = divContent.getBoundingClientRect();
        var p = ((divContent.getBoundingClientRect()["height"] + divContent.scrollTop) / divContent.scrollHeight) * 100;

        if(mrNext != undefined){
            if(p >= 95.0){
                mrNext.disabled = false;
            } else {
                mrNext.disabled = true;
            }
        }
    });
});

/*
window.onload = function(){

    
}
*/
