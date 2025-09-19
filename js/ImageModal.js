class ImageModal{

    constructor(){
        
        this.modal = document.getElementById("img-modal");
        
        this.modal.innerHTML += ("<span class='close'>&times;</span><img class='modal-content' id='modal-image'><div id='caption'></div>");

        this.close = document.getElementsByClassName("close")[0];

        this.close.addEventListener("click", function(e){

            this.modal = document.getElementById("img-modal");

            this.modal.style.display = "none"
        });

        let imgs = document.getElementsByClassName("modal-item");

        for(let i = 0; i < imgs.length; i++)
        {
            imgs[i].addEventListener("click", function(e){
                
                this.modal = document.getElementById("img-modal");

                this.modal_img = document.getElementById("modal-image");
                this.caption_text = document.getElementById("caption");

                this.modal.style.display = "block";
                this.modal_img.src = imgs[i].src;
                this.caption_text = imgs[i].alt;
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    
    new ImageModal();
});