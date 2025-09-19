class Conjoint{
    constructor(id){
        this.allowNext = false;
        
        this.html = {
            root : objHTML.get(id)[0]
        }
        this.init();
    }

    init(){
        this.render();
    }

    render(){
        this.html.attributes = this.html['root'].querySelectorAll('.mrGridCategoryText');

        this.html.conjointMsgError = objHTML.template("<div class='error'></div>")
        this.html.conjointWrapper = objHTML.template("<div class='conjoint-wrapper'></div>");
        this.html.conjointButton = objHTML.template("<div class='attr-button'><button type='button' id='btnNone'>KHÔNG CHỌN SẢN PHẨM NÀO</button></div>");

        this.html['root'].appendChild(this.html.conjointMsgError);
        this.html['root'].appendChild(this.html.conjointWrapper);
        this.html['root'].appendChild(this.html.conjointButton);

        this.hideErrorTexts();
        this.renderAttributes();
        
        let that = this;
        
        this.html.conjointButton.querySelector('#btnNone').addEventListener('click', function(e){
            that.setValue(0);

            // Update visible text input fields
            let textInputs = that.html.conjointWrapper.querySelectorAll('input[type=text]');
            textInputs.forEach(input => {
                input.value = 0; // Set text input to 0
            });
            
            this.setAttribute('disabled', "");
        });
    }

    setValue(v){
        let inputs = this.html.conjointWrapper.querySelectorAll('input[type=hidden]');
        
        inputs.forEach(function(input, index){
            
            input.value = v

            let button_select = input.parentNode.parentNode.previousElementSibling
            button_select.value = "ON";
            button_select.classList.remove("btn-selected"); 
            button_select.removeChild(button_select.childNodes[0]);
            button_select.appendChild(objHTML.template("<span>CHỌN</span>")); 
        });

        this.allowNext = true;
    }

    renderAttributes(){
        let that = this;

        let count_blank = 0, count_zero = 0;

        this.html.attributes.forEach(function(attr, index){
            that.clearProperty(attr);
            
            let childHTML = objHTML.template("<div class='attr'></div>");

            let attrControlHTML = objHTML.template("<div class='attr-control'></div>");
            
            let buttonHTML = undefined;
            let inputHTML = attr.nextElementSibling.querySelector("input[type=text]");
            //inputHTML.setAttribute('type', 'hidden');

            if(inputHTML.value == 0){
                buttonHTML = objHTML.template("<button type='button' id='btn." + attr.id.toLowerCase() + "' value='OFF' style='display: none;'><span>CHỌN</span></button>");
                buttonHTML.value = "ON";
                buttonHTML.classList.remove("btn-selected");
            } else {
                buttonHTML = objHTML.template("<button type='button' id='btn." + attr.id.toLowerCase() + "' value='OFF' style='display: none;'><div class='check'></div></button>");
                buttonHTML.value = "OFF";
                buttonHTML.classList.add("btn-selected");
            }

            attrControlHTML.appendChild(buttonHTML)
            attrControlHTML.appendChild(attr.nextElementSibling);
            
            let txt1s =  attr.querySelectorAll('.alias_name')[0].innerHTML.replace('\t\t\t\t\t\t\t\t\t\t\t','').replace('\n','').split("###,");
            
            let txt1_content = "";

            if (txt1s.length != 0){
                if(txt1s.length == 1){
                    txt1_content = txt1s[0];
                } else {
                    txt1_content = "<ul>"
            
                    txt1s.forEach(txt1 => {
                        let txt2s = txt1.split("|");

                        if(txt2s.length == 1){
                            txt1_content += "<li>" + txt1 + "</li>";
                        }else{
                            let txt2_content = "";

                            for(let i = 0; i < txt2s.length; i++){
                                if(i == 0){
                                    txt2_content += "<li>" + txt2s[i] + "<ul>";
                                } else {
                                    txt2_content += "<li>" + txt2s[i] + "</li>";
                                }
                            }

                            txt2_content += "</ul></li>";
                            txt1_content += txt2_content;
                        }
                    });

                    txt1_content += "</ul>"
                }
            }
            

            //let attAliasNameHTML = objHTML.template("<div class='alias_name'>" +  attr.querySelectorAll('.alias_name')[0].textContent + "</div>")
            let attAliasNameHTML = objHTML.template("<div class='alias_name'>" +  txt1_content.replace("###", "") + "</div>");
            attr.querySelectorAll('.alias_name')[0].remove();

            let discount, price, promotion;

            if(attr.querySelectorAll('.discount').length > 0){
                discount = attr.querySelectorAll('.discount')[0].textContent.length == 0 ? 0 : parseInt(attr.querySelectorAll('.discount')[0].textContent);

                attr.querySelectorAll('.discount')[0].remove();
            }

            if(attr.querySelectorAll('.price').length > 0){
                price = attr.querySelectorAll('.price')[0].textContent.length == 0 ? 0 : parseInt(attr.querySelectorAll('.price')[0].textContent);
                
                attr.querySelectorAll('.price')[0].remove();
            }

            if(attr.querySelectorAll('.promotion').length > 0){
                promotion = attr.querySelectorAll('.promotion')[0].textContent;

                attr.querySelectorAll('.promotion')[0].remove();
            }
            
            let priceHTML = "<div class='price-wrapper'>";
            let attPromotionHTML = undefined;

            if(attr.querySelectorAll('.discount').length > 0){
                if(discount == 0){
                    priceHTML += "<span class='discount'>" + $.fn.formatNumber(price) + "<sup>đ</sup></span><span class='price'></span>";
    
                    //Promotion tặng quà đi kèm
                    if(promotion.length > 0 && promotion != "No discount"){
                        attPromotionHTML = objHTML.template("<div class='promotion'>" + promotion + "</div>");
                    }
                } else {
                    //Promotion giảm giá
                    //priceHTML += "<span class='discount'>" + $.fn.formatNumber(discount) + "<sup>đ</sup></span><span class='price'>" + $.fn.formatNumber(price) + "<sup>đ</sup></span><span class='promotion-discount'>" + promotion + "</span>";
                    priceHTML += "<span class='discount'>" + $.fn.formatNumber(discount) + "<sup>đ</sup></span>";
                }
            } else{
                if(price > 0){
                    priceHTML += "<span class='price'>Đơn giá: " + $.fn.formatNumber(price) + "<sup>đ</sup></span";
                }
            }

            priceHTML += "</div>" 

            let attPriceHTML = objHTML.template(priceHTML);

            let attrTextHTML = objHTML.template("<div class='attr-text'></div>");
            attrTextHTML.appendChild(attr);

            //let input = attrControlHTML.querySelector('input[type=text]');
            //let button_select = attrControlHTML.querySelector('button');

            if(inputHTML.value.length == 0){
                count_blank++;
            } else {
                if(inputHTML.value == 0){
                    count_zero++;
                }
            }

            inputHTML.addEventListener('change', function(e){
                
                let count_blank = 0, count_zero = 0;

                that.html.attributes.forEach(function(attr, index){
                    let attr_control = attr.parentElement.parentElement.querySelector("input[type='text']");

                    if(attr_control.value.length == 0){
                        count_blank++;
                    } else {
                        if(attr_control.value == 0){
                            count_zero++;
                        }
                    }    
                });
                
                let btnNone = that.html.conjointButton.querySelector('#btnNone');
                
                if(e.target.value.length > 0){
                    if(count_zero == that.count()){
                        btnNone.setAttribute('disabled', "");
                    } else {
                        if(btnNone.hasAttribute('disabled')){
                            btnNone.removeAttribute('disabled');
                        }
                    }
                } else {
                    if(count_zero + count_blank == that.count()){
                        if(btnNone.hasAttribute('disabled')){
                            btnNone.removeAttribute('disabled');
                        }
                    }
                }

                that.allowNext = !(count_blank > 0 && that.count() == count_blank + count_zero);
            });

            buttonHTML.addEventListener('click', function(e){
                
                that.html.attributes.forEach(function(attr, index){
                    let attr_control = attr.parentElement.parentElement.querySelector("button");

                    if(attr_control.id != buttonHTML.id){

                        attr_control.value = "ON";
                        attr_control.classList.remove("btn-selected");
                        attr_control.removeChild(attr_control.childNodes[0]);
                        attr_control.appendChild(objHTML.template("<span>CHỌN</span>"));

                        let input_control = attr_control.nextElementSibling.querySelector("input[type='text']");
                        input_control.value = null;
                    }
                });
                
                let btnNone = that.html.conjointButton.querySelector('#btnNone');
                
                this.removeChild(this.childNodes[0])

                if(this.value == "OFF"){
                    this.value = "ON"
                    this.classList.remove("btn-selected")
                    
                    this.appendChild(objHTML.template("<span>CHỌN</span>"))
                    inputHTML.value = null
                } else {
                    this.value = "OFF"
                    this.classList.add("btn-selected")
                    
                    this.appendChild(objHTML.template("<div class='check'></div>"))
                    inputHTML.value = 1

                    if(btnNone.hasAttribute('disabled')){
                        btnNone.removeAttribute('disabled');
                    }
                }
            });
            
            if(txt1_content.length > 0){
                childHTML.appendChild(attAliasNameHTML);
            }
            
            childHTML.appendChild(attrTextHTML);
            childHTML.appendChild(attPriceHTML);
            if(attPromotionHTML != undefined) childHTML.appendChild(attPromotionHTML);
            childHTML.appendChild(attrControlHTML);

            that.html.conjointWrapper.appendChild(childHTML);
        }); 

        this.allowNext = !(this.count() == count_blank);

        let btn = this.html.conjointButton.querySelector('#btnNone');

        if(this.count() == count_zero){
            btn.setAttribute('disabled', "");
        } 
    }

    clearProperty(attr){
        attr.style.removeProperty('text-align');
        attr.style.removeProperty('vertical-align');
    }

    hideErrorTexts(){
        let msg_error = "";

        let mrErrorTexts = this.html['root'].querySelectorAll('.mrErrorText');

        if(mrErrorTexts.length > 0){
            mrErrorTexts.forEach(function(item, index){
                item.style.display = "none";
                msg_error = item.textContent;
            });
        }

        if(msg_error.length == 0){
            this.html.conjointMsgError.style.display = "none";
        } else {
            this.html.conjointMsgError.style.display = "block";
        }

        this.html.conjointMsgError.textContent = msg_error;
    }

    count(){
        return this.html['root'].querySelectorAll('.mrGridCategoryText').length;
    }

    count_blank(){
        let s = 0;

        this.html.conjointWrapper.childNodes.forEach(function(attr, index){

            let txt = attr.querySelectorAll('input')[0];
            s += (txt.value.length == 0 ? 1 : 0);
        });

        return s;
    }

    sum(){
        let s = 0;

        this.html.conjointWrapper.childNodes.forEach(function(attr, index){

            let txt = attr.querySelectorAll('input')[0];
            s += (txt.value.length == 0 ? 0 : parseInt(txt.value));
        });

        return s;
    }
}

document.addEventListener("DOMContentLoaded", function(){

    let conjoint = new Conjoint('.conjoint-container');

    let btnSubmit = document.getElementsByName('_NNext')[0];

    btnSubmit.addEventListener('click', function(e){

        if(conjoint.allowNext){
            if(conjoint.count_blank() == conjoint.count()){
                conjoint.html.conjointMsgError.textContent = "Vui lòng chọn sản phẩm bạn muốn mua hoặc click chọn 'Không chọn sản phẩm nào'.";
                conjoint.html.conjointMsgError.style.display = "block";
                e.preventDefault();
            } else {
                conjoint.html.conjointMsgError.textContent = "";
                conjoint.html.conjointMsgError.style.display = "none";
            }
        } else {
            if(conjoint.count_blank() == conjoint.count()){
                conjoint.html.conjointMsgError.textContent = "Vui lòng chọn sản phẩm bạn muốn mua hoặc click chọn 'Không chọn sản phẩm nào'.";
                conjoint.html.conjointMsgError.style.display = "block";
                e.preventDefault();
            }
        }
    });
});