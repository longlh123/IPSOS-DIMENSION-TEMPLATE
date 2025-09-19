let startTime;
let endTime;

document.addEventListener("DOMContentLoaded", function(event){

    let openendedQres = document.getElementsByClassName('openend_basic');

    for(var i = 0; i < openendedQres.length; i++)
    {
        openendedQres[i].style.display = "none";
    }

    let duelInfor = document.getElementsByClassName("duel-infor")[0];
    let duelContent = document.getElementsByClassName("duel-content")[0];
    
    if(duelInfor && duelContent){
        duelInfor.style.display = "none";
        duelContent.innerHTML = duelInfor.innerHTML.trim();
    }

    let images = [];

    //Disable the button
    document.getElementById('btnSelected').disabled = true;

    $(".mrQuestionTable").addClass('pair-component');

    $cells = $(".mrQuestionTable");
    
    cells = $cells.children().get().map(function(span){
        
        $(span).addClass('cat-image');

        $(span).children().each(function(){
            if($(this).is('input:radio') || $(this).is('input:checkbox')) {

                if($(this).hasClass('mrSingle'))
                {
                    $(this).addClass('cat-single-item');
                } 
            }
        });

        $(span).find('img').css({
            'width': '100%',
            'object-fit': 'contain',
            'max-width': '500px',
        });

        $(span).find('img').each(function(){
            
            let imgSrc = $(this).attr('src');
            images.push(imgSrc);
        });
    });

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            let img = new Image(); // Create a new image element
            img.src = src;
    
            // Resolve the promise when the image loads
            img.onload = () => resolve(src);
    
            // Reject the promise if the image fails to load
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
    }
    
    // Load all images and wait for them to complete
    Promise.all(images.map(loadImage))
        .then((loadedImages) => {
            console.log("All images loaded successfully:", loadedImages);
            // Continue with the rest of your logic here
            document.getElementById('btnSelected').disabled = false;
        })
        .catch((error) => {
            console.error(error.message); // Handle any image load failure
        });

    $('.cat-single-item').change(function(event) {

        var $cat_container = $(this).parent().parent();

        $cat_container.children().each(function(){

            ischecked = $(this).find('.cat-single-item').is(':checked');

            if(ischecked){
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        $(".mrNext").removeAttr("disabled");

        endTime = new Date();
        document.getElementById("_Q2").value = formatDateWithMilliseconds(endTime);

        // Calculate time difference in milliseconds
        if (startTime && endTime) {
            let timeDifference = endTime - startTime;
            document.getElementById("_Q3").value = timeDifference;

            console.log("Time difference in milliseconds:", timeDifference);
        }
    });

    $(".mrNext").attr("disabled", true);
    
    document.getElementById("_Q1").value = "";
    document.getElementById("_Q2").value = "";
    document.getElementById("_Q3").value = "";
    
    let duelModal = document.getElementById('duel-modal');
    let duelOverlay = document.getElementById('duel-overlay');

    function openModal() {
        duelOverlay.style.display = 'block';
        duelModal.style.display = 'flex';
    }

    function closeModal() {
        duelOverlay.style.display = 'none';
        duelModal.style.display = 'none';
    }

    document.getElementById('btnSelected').addEventListener('click', (event) => {
        closeModal();

        startTime = new Date();
        document.getElementById("_Q1").value = formatDateWithMilliseconds(startTime);
        
        event.defaultPrevented;        
    });

    openModal();

    function formatDateWithMilliseconds(date) {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');
        let milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
});