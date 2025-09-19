document.addEventListener("DOMContentLoaded", function(event){
  
  var custom_question_properties = document.getElementsByClassName("custom_question_properties");
            
  if(custom_question_properties != null){
      var str_obj = custom_question_properties[0].innerText;

      objProperties = convertJSON(str_obj);
      custom_question_properties[0].parentNode.style.display = "none";
  }

  /*
  obj = {
      placeholder : "text", //a symbol or piece of text that temporarily replaces st that is missing. 
      validation : "checkphonenumber", //the act of proving that st is true or correct
      type : "text|long|double", 
      questiontype : "TOM-SPON", //TOM-SPON: Using for the TOM_SPON question
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
      if(!obj.hasOwnProperty('placeholder')) obj['placeholder'] = 'Điền câu trả lời...'
      //set the default value of step
      if(!obj.hasOwnProperty('step')) obj['step'] = 1

      return obj;
  }

  let shelfModal = document.getElementById('shelf-modal');
  let shelfOverlay = document.getElementById('shelf-overlay');

  let shoppingCartModal = document.getElementById('shopping-cart-modal');
  let shoppingCartWrapper = shoppingCartModal.querySelector(".shopping-cart-wrapper");

  let txtTotalBurget = document.getElementById("txtTotalBurget");
  let txtAmount = document.getElementById("txtAmount");

  document.getElementById("_Q0").value = "";
  let cur = new Date();
  document.getElementById("_Q1").value = cur;
  document.getElementById("_Q2").value = "";
  
  document.getElementById("_Q0").style.display = "none";
  document.getElementById("_Q1").style.display = "none";
  document.getElementById("_Q2").style.display = "none";
 

  // Functions to open and close the modal
  function openModal() {
    shelfOverlay.style.display = 'block';
    shelfModal.style.display = 'flex';
  }

  function closeModal() {
    shelfOverlay.style.display = 'none';
    shelfModal.style.display = 'none';
    shoppingCartModal.style.display = 'none';

    txtAmount.value = 0;
  }

  function selectdModal() {
    let cur = new Date();
    document.getElementById("_Q2").value = cur;

    //--Modal Content--//
    let img = document.getElementById('shelf-image').querySelector("img");
    
    //--Modal Shopping Cart--//
    if(parseInt(txtAmount.value) > 0){
      let total_burget = parseInt(txtTotalBurget.textContent.replace(/\D/g, "")) + parseInt(txtAmount.value) * parseInt(image_details[img.alt].price.replace(/\D/g, ""));

      image_details[img.alt].amount = parseInt(image_details[img.alt].amount) + parseInt(txtAmount.value);

      txtTotalBurget.innerHTML = total_burget.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.') + " VND";
    }

    if(objProperties['shopping_cart'] == 1){
      let products = [];
      for(const[key, image] of Object.entries(images)){
        if(image.amount > 0){
          products.push(image.alt + "#" + image.amount);
        }
      }
      document.getElementById("_Q0").value = products.join("|");
    } else {
      document.getElementById("_Q0").value = img.alt;
    }

    closeModal();
  }

  function verifiedModal(){
    let cur = new Date();
    document.getElementById("_Q2").value = cur;

    let txt_products = shoppingCartWrapper.querySelectorAll("input[type=number]");
    let total_burget = 0;

    txt_products.forEach(product => {
      image_details[product.id.replace("txtAmount", "")].amount = product.value;

      total_burget += product.value * parseInt(image_details[product.id.replace("txtAmount", "")].price.replace(/\D/g, "")); 
    });

    txtTotalBurget.innerHTML = total_burget.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.') + " VND";

    let products = [];
    
    for(const[key, image] of Object.entries(images)){
      if(image.amount > 0){
        products.push(image.alt + "#" + image.amount);
      }
    }
    document.getElementById("_Q0").value = products.join("|");
    
    closeModal();
  }

  function openShoppingCartModal() {
    shoppingCartWrapper.innerHTML = "";

    shelfOverlay.style.display = 'block';
    shoppingCartModal.style.display = 'flex';
    
    for(const[key, image] of Object.entries(images)){
      if(image.alt != "image_shelf"){
        if(image_details[image.alt].amount > 0){
          shoppingCartWrapper.appendChild(objHTML.template(
            "<div class='product'><img src='" + image.src + "' alt='" + image_details[image.alt].name + "'/><div class='product-info'><div class='product-name'>" + image_details[image.alt].name + "</div><div class='product-amount'><label for='txtAmount" + image.alt + "'>Số lượng:</label><input type='number' id='txtAmount" + image.alt + "' value='" + image_details[image.alt].amount + "' min='0' max='100' /></div></div></div>"
          ));
        }
      }
    };
  }

  // Close the modal if the overlay is clicked
  shelfOverlay.addEventListener('click', closeModal);

  document.getElementById('btnSelected').addEventListener('click', (event) => {
    selectdModal();
    event.defaultPrevented;        
  });

  document.getElementById('btnClose1').addEventListener('click', (event) => {
    closeModal();
    event.defaultPrevented;
  });

  document.getElementById('btnTotalBurget').addEventListener('click', (event) => {
    openShoppingCartModal();
    event.defaultPrevented;        
  });

  document.getElementById('btnVerified').addEventListener('click', (event) => {
    verifiedModal();
    event.defaultPrevented;        
  });

  document.getElementById('btnClose2').addEventListener('click', (event) => {
    closeModal();
    event.defaultPrevented;
  });

  const canvas = document.getElementById('shelfCanvas');
  const ctx = canvas.getContext('2d');
    
  // Initial zoom level
  let pinchDistance;
  let zoomLevel = 1;
  
  // Offset for image position during drag
  let isDragging = false;
  let isClicking = false;

  let imageOffsetX = 0; 
  let imageOffsetY = 0;

  // Define an array to store image objects and their properties
  const images = {
    'image_shelf' : { group: 'Shelf', name: 'Shelf',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/shelf_template_test/shelf_4.png', alt: 'image_shelf', floor: 0, x: 0, y: 0, width: 0, height: 0, volume: '', price: '', amount: 0 },
  }

  const image_details = {
    'Baby_L1_LacBabyCur_EM_250' : { floor: 1, index: 0, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyCur_EM_250.png', alt: 'Baby_L1_LacBabyCur_EM_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'Baby_L1_LacBabyCur_GC_250' : { floor: 1, index: 1, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyCur_GC_250.png', alt: 'Baby_L1_LacBabyCur_GC_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89000', amount: 0 },
    'Baby_L1_LacBabyR1_EM_250' : { floor: 1, index: 0, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyR1_EM_250.png', alt: 'Baby_L1_LacBabyR1_EM_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'Baby_L1_LacBabyR1_GC_250' : { floor: 1, index: 1, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyR1_GC_250.png', alt: 'Baby_L1_LacBabyR1_GC_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89000', amount: 0 },
    'Baby_L1_LacBabyR2_EM_250' : { floor: 1, index: 0, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyR2_EM_250.png', alt: 'Baby_L1_LacBabyR2_EM_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'Baby_L1_LacBabyR2_GC_250' : { floor: 1, index: 1, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyR2_GC_250.png', alt: 'Baby_L1_LacBabyR2_GC_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89000', amount: 0 },
    'Baby_L1_LacBabyR3_EM_250' : { floor: 1, index: 0, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyR3_EM_250.png', alt: 'Baby_L1_LacBabyR3_EM_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'Baby_L1_LacBabyR3_GC_250' : { floor: 1, index: 1, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_LacBabyR3_GC_250.png', alt: 'Baby_L1_LacBabyR3_GC_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89000', amount: 0 },
    'Baby_L1_JohnsonBaby_Cotton_200' : { floor: 1, index: 2, iteration: 2, group: 'baby wash', name: 'Sữa tắm gội toàn thân Johnson Baby cotton touch',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_JohnsonBaby_Cotton_200.png', alt: 'Baby_L1_JohnsonBaby_Cotton_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '75500', amount: 0 },
    'Baby_L1_JohnsonBaby_MR_200' : { floor: 1, index: 3, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội toàn thân Johnson Baby milk & rice',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_JohnsonBaby_MR_200.png', alt: 'Baby_L1_JohnsonBaby_MR_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '62500', amount: 0 },
    'Baby_L1_Pigeon_HoaHD_200' : { floor: 1, index: 4, iteration: 1, group: 'baby wash', name: 'Tắm gội Pigeon Hoa Hướng Dương',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_Pigeon_HoaHD_200.png', alt: 'Baby_L1_Pigeon_HoaHD_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '70000', amount: 0 },
    'Baby_L1_Cetaphil_GW_230' : { floor: 1, index: 5, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội Cetaphil Baby Gentle Wash 2in1',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_Cetaphil_GW_230.png', alt: 'Baby_L1_Cetaphil_GW_230', x: 0, y: 0, width: 0, height: 0, volume: '230ml', price: '172000', amount: 0 },
    'Baby_L1_Cetaphil_HC_230' : { floor: 1, index: 6, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội hoa cúc Cetaphil',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_Cetaphil_HC_230.png', alt: 'Baby_L1_Cetaphil_HC_230', x: 0, y: 0, width: 0, height: 0, volume: '230ml', price: '210000', amount: 0 },
    'Baby_L1_Cetaphil_GW_400' : { floor: 1, index: 7, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội Cetaphil Baby Gentle Wash 2in1',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_Cetaphil_GW_400.png', alt: 'Baby_L1_Cetaphil_GW_400', x: 0, y: 0, width: 0, height: 0, volume: '400ml', price: '245000', amount: 0 },
    'Baby_L1_Cetaphil_HC_400' : { floor: 1, index: 8, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội hoa cúc Cetaphil',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_Cetaphil_HC_400.png', alt: 'Baby_L1_Cetaphil_HC_400', x: 0, y: 0, width: 0, height: 0, volume: '400ml', price: '295000', amount: 0 },
    'Baby_L1_Dnee_hong_400' : { floor: 1, index: 9, iteration: 1, group: 'baby wash', name: 'Tắm gội cho bé Dnee kids hồng',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_Dnee_hong_400.png', alt: 'Baby_L1_Dnee_hong_400', x: 0, y: 0, width: 0, height: 0, volume: '400ml', price: '100000', amount: 0 },
    'Baby_L1_Dnee_tim_400' : { floor: 1, index: 10, iteration: 1, group: 'baby wash', name: 'Tắm gội cho bé Dnee kids tím',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_Dnee_tim_400.png', alt: 'Baby_L1_Dnee_tim_400', x: 0, y: 0, width: 0, height: 0, volume: '400ml', price: '100000', amount: 0 },
    'Baby_L2_LacBabyCur_EM_500' : { floor: 2, index: 11, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyCur_EM_500.png', alt: 'Baby_L2_LacBabyCur_EM_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '158000', amount: 0 },
    'Baby_L2_LacBabyCur_GC_500' : { floor: 2, index: 12, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyCur_GC_500.png', alt: 'Baby_L2_LacBabyCur_GC_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '166500', amount: 0 },
    'Baby_L2_LacBabyR1_EM_500' : { floor: 2, index: 11, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyR1_EM_500.png', alt: 'Baby_L2_LacBabyR1_EM_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '158000', amount: 0 },
    'Baby_L2_LacBabyR1_GC_500' : { floor: 2, index: 12, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyR1_GC_500.png', alt: 'Baby_L2_LacBabyR1_GC_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '166500', amount: 0 },
    'Baby_L2_LacBabyR2_EM_500' : { floor: 2, index: 11, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyR2_EM_500.png', alt: 'Baby_L2_LacBabyR2_EM_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '158000', amount: 0 },
    'Baby_L2_LacBabyR2_GC_500' : { floor: 2, index: 12, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyR2_GC_500.png', alt: 'Baby_L2_LacBabyR2_GC_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '166500', amount: 0 },
    'Baby_L2_LacBabyR3_EM_500' : { floor: 2, index: 11, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyR3_EM_500.png', alt: 'Baby_L2_LacBabyR3_EM_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '158000', amount: 0 },
    'Baby_L2_LacBabyR3_GC_500' : { floor: 2, index: 12, iteration: 3, group: 'baby wash', name: 'Sữa tắm gội Lactacyd Gentle Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_LacBabyR3_GC_500.png', alt: 'Baby_L2_LacBabyR3_GC_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '166500', amount: 0 },
    'Baby_L2_JohnsonBaby_T2T_200' : { floor: 2, index: 13, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội toàn thân Johnson Baby top-to-toe',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_JohnsonBaby_T2T_200.png', alt: 'Baby_L2_JohnsonBaby_T2T_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '65000', amount: 0 },
    'Baby_L2_JohnsonBaby_MR_200' : { floor: 2, index: 14, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội toàn thân Johnson Baby milk & rice',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L1_JohnsonBaby_MR_200.png', alt: 'Baby_L2_JohnsonBaby_MR_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '62500', amount: 0 },
    'Baby_L2_Pigeon_Daugoi_200' : { floor: 2, index: 15, iteration: 1, group: 'baby wash', name: 'Dầu Gội Pigeon',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_Pigeon_Daugoi_200.png', alt: 'Baby_L2_Pigeon_Daugoi_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '65000', amount: 0 },
    'Baby_L2_Pigeon_Suatam_200' : { floor: 2, index: 16, iteration: 1, group: 'baby wash', name: 'Sữa Tắm Pigeon Jojoba ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_Pigeon_Suatam_200.png', alt: 'Baby_L2_Pigeon_Suatam_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '60000', amount: 0 },
    'Baby_L2_Pigeon_Sakura_200' : { floor: 2, index: 17, iteration: 1, group: 'baby wash', name: 'Tắm gội Pigeon Sakura 2-in-1',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_Pigeon_Sakura_200.png', alt: 'Baby_L2_Pigeon_Sakura_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '89000', amount: 0 },
    'Baby_L2_Dnee_Xanhla_380' : { floor: 2, index: 18, iteration: 1, group: 'baby wash', name: 'Tắm gội cho bé Dnee xanh lá',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_Dnee_Xanhla_380.png', alt: 'Baby_L2_Dnee_Xanhla_380', x: 0, y: 0, width: 0, height: 0, volume: '380ml', price: '85500', amount: 0 },
    'Baby_L2_Dnee_Xanh_380' : { floor: 2, index: 19, iteration: 1, group: 'baby wash', name: 'Tắm gội cho bé Dnee xanh ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_Dnee_Xanh_380.png', alt: 'Baby_L2_Dnee_Xanh_380', x: 0, y: 0, width: 0, height: 0, volume: '380ml', price: '86000', amount: 0 },
    'Baby_L2_Dnee_Hong_380' : { floor: 2, index: 20, iteration: 1, group: 'baby wash', name: 'Tắm gội cho bé Dnee hồng',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L2_Dnee_Hong_380.png', alt: 'Baby_L2_Dnee_Hong_380', x: 0, y: 0, width: 0, height: 0, volume: '380ml', price: '86500', amount: 0 },
    'Baby_L3_CarrieJun_TCSua_700' : { floor: 3, index: 21, iteration: 1, group: 'baby wash', name: 'Tắm gội Carrie Junior tinh chất sữa',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_CarrieJun_TCSua_700.png', alt: 'Baby_L3_CarrieJun_TCSua_700', x: 0, y: 0, width: 0, height: 0, volume: '700g', price: '165000', amount: 0 },
    'Baby_L3_CarrieJun_Cherry_700' : { floor: 3, index: 22, iteration: 1, group: 'baby wash', name: 'Tắm gội Carrie Junior hương cherry',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_CarrieJun_Cherry_700.png', alt: 'Baby_L3_CarrieJun_Cherry_700', x: 0, y: 0, width: 0, height: 0, volume: '700g', price: '164000', amount: 0 },
    'Baby_L3_CarrieJun_Berry_700' : { floor: 3, index: 23, iteration: 1, group: 'baby wash', name: 'Tắm gội Carrie Junior hương grapeberry',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_CarrieJun_Berry_700.png', alt: 'Baby_L3_CarrieJun_Berry_700', x: 0, y: 0, width: 0, height: 0, volume: '700g', price: '164500', amount: 0 },
    'Baby_L3_Wesser_WhMusk_500' : { floor: 3, index: 24, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội White Musk Wesser',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_Wesser_WhMusk_500.png', alt: 'Baby_L3_Wesser_WhMusk_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '108000', amount: 0 },
    'Baby_L3_JohnsonBaby_Cotton_500' : { floor: 3, index: 25, iteration: 2, group: 'baby wash', name: 'Sữa tắm gội toàn thân Johnson Baby cotton touch',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_JohnsonBaby_Cotton_500.png', alt: 'Baby_L3_JohnsonBaby_Cotton_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '145500', amount: 0 },
    'Baby_L3_JohnsonBaby_MR_500' : { floor: 3, index: 26, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội toàn thân Johnson Baby milk & rice',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_JohnsonBaby_MR_500.png', alt: 'Baby_L3_JohnsonBaby_MR_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '124000', amount: 0 },
    'Baby_L3_Pigeon_HoaHD_700' : { floor: 3, index: 27, iteration: 2, group: 'baby wash', name: 'Tắm gội Pigeon Hoa Hướng Dương',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_Pigeon_HoaHD_700.png', alt: 'Baby_L3_Pigeon_HoaHD_700', x: 0, y: 0, width: 0, height: 0, volume: '700ml', price: '192000', amount: 0 },
    'Baby_L3_Pureen_Cherry_750' : { floor: 3, index: 28, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội Pureen hương Cherry',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_Pureen_Cherry_750.png', alt: 'Baby_L3_Pureen_Cherry_750', x: 0, y: 0, width: 0, height: 0, volume: '750ml', price: '178000', amount: 0 },
    'Baby_L3_Pureen_Baby_750' : { floor: 3, index: 29, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội Pureen baby',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L3_Pureen_Baby_750.png', alt: 'Baby_L3_Pureen_Baby_750', x: 0, y: 0, width: 0, height: 0, volume: '750ml', price: '178000', amount: 0 },
    'Baby_L4_CarrieJun_Melon_700' : { floor: 4, index: 30, iteration: 1, group: 'baby wash', name: 'Tắm gội Carrie Junior hương yogurt melon',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_CarrieJun_Melon_700.png', alt: 'Baby_L4_CarrieJun_Melon_700', x: 0, y: 0, width: 0, height: 0, volume: '700g', price: '180500', amount: 0 },
    'Baby_L4_CarrieJun_Apricot_700' : { floor: 4, index: 31, iteration: 1, group: 'baby wash', name: 'Tắm gội Carrie Junior hương yogurt apricot',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_CarrieJun_Apricot_700.png', alt: 'Baby_L4_CarrieJun_Apricot_700', x: 0, y: 0, width: 0, height: 0, volume: '700g', price: '180500', amount: 0 },
    'Baby_L4_CarrieJun_Apple_700' : { floor: 4, index: 32, iteration: 1, group: 'baby wash', name: 'Tắm gội Carrie Junior hương yogurt apple',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_CarrieJun_Apple_700.png', alt: 'Baby_L4_CarrieJun_Apple_700', x: 0, y: 0, width: 0, height: 0, volume: '700g', price: '183500', amount: 0 },
    'Baby_L4_Wesser_Powder_500' : { floor: 4, index: 33, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội Powder Wesser',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_Wesser_Powder_500.png', alt: 'Baby_L4_Wesser_Powder_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '105000', amount: 0 },
    'Baby_L4_JohnsonBaby_T2T_500' : { floor: 4, index: 34, iteration: 2, group: 'baby wash', name: 'Sữa tắm gội toàn thân Johnson Baby top-to-toe',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_JohnsonBaby_T2T_500.png', alt: 'Baby_L4_JohnsonBaby_T2T_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '132500', amount: 0 },
    'Baby_L4_JohnsonBaby_AK_500' : { floor: 4, index: 35, iteration: 1, group: 'baby wash', name: 'Sữa tắm Johnson`s ® Active Kids™ Clean & Fresh Bath',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_JohnsonBaby_AK_500.png', alt: 'Baby_L4_JohnsonBaby_AK_500', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '104500', amount: 0 },
    'Baby_L4_Pigeon_Daugoi_700' : { floor: 4, index: 36, iteration: 1, group: 'baby wash', name: 'Dầu Gội Pigeon',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_Pigeon_Daugoi_700.png', alt: 'Baby_L4_Pigeon_Daugoi_700', x: 0, y: 0, width: 0, height: 0, volume: '700ml', price: '190000', amount: 0 },
    'Baby_L4_Pigeon_Suatam_700' : { floor: 4, index: 37, iteration: 1, group: 'baby wash', name: 'Sữa Tắm Pigeon Jojoba ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_Pigeon_Suatam_700.png', alt: 'Baby_L4_Pigeon_Suatam_700', x: 0, y: 0, width: 0, height: 0, volume: '700ml', price: '187500', amount: 0 },
    'Baby_L4_Pigeon_Sakura_700' : { floor: 4, index: 38, iteration: 1, group: 'baby wash', name: 'Tắm gội Pigeon Sakura 2-in-1',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_Pigeon_Sakura_700.png', alt: 'Baby_L4_Pigeon_Sakura_700', x: 0, y: 0, width: 0, height: 0, volume: '700ml', price: '244500', amount: 0 },
    'Baby_L4_BabiMild_Sakura_800' : { floor: 4, index: 39, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội Babi Mild White Sakura',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_BabiMild_Sakura_800.png', alt: 'Baby_L4_BabiMild_Sakura_800', x: 0, y: 0, width: 0, height: 0, volume: '800ml', price: '169500', amount: 0 },
    'Baby_L4_BabiMild_Bioganik_800' : { floor: 4, index: 40, iteration: 1, group: 'baby wash', name: 'Sữa tắm gội Babi Mild Bioganik',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/babywash/Baby_L4_BabiMild_Bioganik_800.png', alt: 'Baby_L4_BabiMild_Bioganik_800', x: 0, y: 0, width: 0, height: 0, volume: '800ml', price: '176500', amount: 0 },
    'Fem_L1_LactCur_OF_150' : { floor: 1, index: 0, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactCur_OF_150.png', alt: 'Fem_L1_LactCur_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L1_LactCur_SS_150' : { floor: 1, index: 1, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactCur_SS_150.png', alt: 'Fem_L1_LactCur_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_LactCur_PS_150' : { floor: 1, index: 2, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactCur_PS_150.png', alt: 'Fem_L1_LactCur_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_LactR1_OF_150' : { floor: 1, index: 0, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR1_OF_150.png', alt: 'Fem_L1_LactR1_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L1_LactR1_SS_150' : { floor: 1, index: 1, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR1_SS_150.png', alt: 'Fem_L1_LactR1_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_LactR1_PS_150' : { floor: 1, index: 2, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR1_PS_150.png', alt: 'Fem_L1_LactR1_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_LactR2_OF_150' : { floor: 1, index: 0, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR2_OF_150.png', alt: 'Fem_L1_LactR2_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L1_LactR2_SS_150' : { floor: 1, index: 1, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR2_SS_150.png', alt: 'Fem_L1_LactR2_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_LactR2_PS_150' : { floor: 1, index: 2, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR2_PS_150.png', alt: 'Fem_L1_LactR2_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_LactR3_OF_150' : { floor: 1, index: 0, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR3_OF_150.png', alt: 'Fem_L1_LactR3_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L1_LactR3_SS_150' : { floor: 1, index: 1, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR3_SS_150.png', alt: 'Fem_L1_LactR3_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_LactR3_PS_150' : { floor: 1, index: 2, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR3_PS_150.png', alt: 'Fem_L1_LactR3_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L1_DaHuong_TX_100' : { floor: 1, index: 3, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương trà xanh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_DaHuong_TX_100.jpeg', alt: 'Fem_L1_DaHuong_TX_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '35500', amount: 0 },
    'Fem_L1_DaHuong_ND_100' : { floor: 1, index: 4, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương nha đam',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_DaHuong_ND_100.jpeg', alt: 'Fem_L1_DaHuong_ND_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '35500', amount: 0 },
    'Fem_L1_DaHuong_LV_100' : { floor: 1, index: 5, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương lavender',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_DaHuong_LV_100.jpeg', alt: 'Fem_L1_DaHuong_LV_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '35500', amount: 0 },
    'Fem_L1_Betadine_GP_100' : { floor: 1, index: 6, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Betadine Gentle Protection',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_Betadine_GP_100.png', alt: 'Fem_L1_Betadine_GP_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '58500', amount: 0 },
    'Fem_L1_Betadine_GP_250' : { floor: 1, index: 7, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Betadine Gentle Protection',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_Betadine_GP_250.png', alt: 'Fem_L1_Betadine_GP_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '78000', amount: 0 },
    'Fem_L2_LactCur_OF_150' : { floor: 2, index: 8, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactCur_OF_150.png', alt: 'Fem_L2_LactCur_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L2_LactCur_SS_150' : { floor: 2, index: 9, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactCur_SS_150.png', alt: 'Fem_L2_LactCur_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_LactCur_PS_150' : { floor: 2, index: 10, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactCur_PS_150.png', alt: 'Fem_L2_LactCur_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_LactR1_OF_150' : { floor: 2, index: 8, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR1_OF_150.png', alt: 'Fem_L2_LactR1_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L2_LactR1_SS_150' : { floor: 2, index: 9, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR1_SS_150.png', alt: 'Fem_L2_LactR1_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_LactR1_PS_150' : { floor: 2, index: 10, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR1_PS_150.png', alt: 'Fem_L2_LactR1_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_LactR2_OF_150' : { floor: 2, index: 8, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR2_OF_150.png', alt: 'Fem_L2_LactR2_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L2_LactR2_SS_150' : { floor: 2, index: 9, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR2_SS_150.png', alt: 'Fem_L2_LactR2_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_LactR2_PS_150' : { floor: 2, index: 10, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR2_PS_150.png', alt: 'Fem_L2_LactR2_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_LactR3_OF_150' : { floor: 2, index: 8, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR3_OF_150.png', alt: 'Fem_L2_LactR3_OF_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '53000', amount: 0 },
    'Fem_L2_LactR3_SS_150' : { floor: 2, index: 9, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR3_SS_150.png', alt: 'Fem_L2_LactR3_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_LactR3_PS_150' : { floor: 2, index: 10, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_LactR3_PS_150.png', alt: 'Fem_L2_LactR3_PS_150', x: 0, y: 0, width: 0, height: 0, volume: '150ml', price: '60000', amount: 0 },
    'Fem_L2_DaHuong_TX_100' : { floor: 2, index: 11, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương trà xanh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_DaHuong_TX_100.jpeg', alt: 'Fem_L2_DaHuong_TX_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '35500', amount: 0 },
    'Fem_L2_DaHuong_ND_100' : { floor: 2, index: 12, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương nha đam',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_DaHuong_ND_100.jpeg', alt: 'Fem_L2_DaHuong_ND_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '35500', amount: 0 },
    'Fem_L2_DaHuong_LV_100' : { floor: 2, index: 13, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương lavender',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L1_DaHuong_LV_100.jpeg', alt: 'Fem_L2_DaHuong_LV_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '35500', amount: 0 },
    'Fem_L2_Hanayuki_SS_150' : { floor: 2, index: 14, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh Hanayuki soft silk',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L2_Hanayuki_SS_150.jpeg', alt: 'Fem_L2_Hanayuki_SS_150', x: 0, y: 0, width: 0, height: 0, volume: '150g', price: '114000', amount: 0 },
    'Fem_L2_Hanayuki_VB_150' : { floor: 2, index: 15, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh hồng Hanayuki VB soft silk',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L2_Hanayuki_VB_150.jpeg', alt: 'Fem_L2_Hanayuki_VB_150', x: 0, y: 0, width: 0, height: 0, volume: '150g', price: '114000', amount: 0 },
    'Fem_L3_LactCur_OF_250' : { floor: 3, index: 16, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactCur_OF_250.png', alt: 'Fem_L3_LactCur_OF_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '75000', amount: 0 },
    'Fem_L3_LactCur_SS_250' : { floor: 3, index: 17, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactCur_SS_250.png', alt: 'Fem_L3_LactCur_SS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '82000', amount: 0 },
    'Fem_L3_LactCur_PS_250' : { floor: 3, index: 18, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactCur_PS_250.png', alt: 'Fem_L3_LactCur_PS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '84000', amount: 0 },
    'Fem_L3_LactR1_OF_250' : { floor: 3, index: 16, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR1_OF_250.png', alt: 'Fem_L3_LactR1_OF_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '75000', amount: 0 },
    'Fem_L3_LactR1_SS_250' : { floor: 3, index: 17, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR1_SS_250.png', alt: 'Fem_L3_LactR1_SS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '82000', amount: 0 },
    'Fem_L3_LactR1_PS_250' : { floor: 3, index: 18, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR1_PS_250.png', alt: 'Fem_L3_LactR1_PS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '84000', amount: 0 },
    'Fem_L3_LactR2_OF_250' : { floor: 3, index: 16, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR2_OF_250.png', alt: 'Fem_L3_LactR2_OF_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '75000', amount: 0 },
    'Fem_L3_LactR2_SS_250' : { floor: 3, index: 17, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR2_SS_250.png', alt: 'Fem_L3_LactR2_SS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '82000', amount: 0 },
    'Fem_L3_LactR2_PS_250' : { floor: 3, index: 18, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR2_PS_250.png', alt: 'Fem_L3_LactR2_PS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '84000', amount: 0 },
    'Fem_L3_LactR3_OF_250' : { floor: 3, index: 16, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Odor Fresh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR3_OF_250.png', alt: 'Fem_L3_LactR3_OF_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '75000', amount: 0 },
    'Fem_L3_LactR3_SS_250' : { floor: 3, index: 17, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Soft & Silky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR3_SS_250.png', alt: 'Fem_L3_LactR3_SS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '82000', amount: 0 },
    'Fem_L3_LactR3_PS_250' : { floor: 3, index: 18, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Lactacyd Pro sensitive ',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_LactR3_PS_250.png', alt: 'Fem_L3_LactR3_PS_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '84000', amount: 0 },
    'Fem_L3_DaHuong_TX_120' : { floor: 3, index: 19, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương trà xanh',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_DaHuong_TX_120.jpeg', alt: 'Fem_L3_DaHuong_TX_120', x: 0, y: 0, width: 0, height: 0, volume: '120ml', price: '45500', amount: 0 },
    'Fem_L3_DaHuong_ND_120' : { floor: 3, index: 20, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương nha đam',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_DaHuong_ND_120.jpeg', alt: 'Fem_L3_DaHuong_ND_120', x: 0, y: 0, width: 0, height: 0, volume: '120ml', price: '45500', amount: 0 },
    'Fem_L3_DaHuong_LV_120' : { floor: 3, index: 21, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Dạ Hương tươi mới hương lavender',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_DaHuong_LV_120.jpeg', alt: 'Fem_L3_DaHuong_LV_120', x: 0, y: 0, width: 0, height: 0, volume: '120ml', price: '45500', amount: 0 },
    'Fem_L3_Shema_NN_100' : { floor: 3, index: 22, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Shema Lá Đôi hương nồng nàn',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_Shema_NN_100.jpeg', alt: 'Fem_L3_Shema_NN_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '29000', amount: 0 },
    'Fem_L3_Shema_DM_100' : { floor: 3, index: 23, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Shema Lá Đôi hương dịu mát',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L3_Shema_DM_100.jpeg', alt: 'Fem_L3_Shema_DM_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '29000', amount: 0 },
    'Fem_L4_Gynofar_100' : { floor: 4, index: 24, iteration: 2, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Gynofar',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Gynofar_100.png', alt: 'Fem_L4_Gynofar_100', x: 0, y: 0, width: 0, height: 0, volume: '500ml', price: '23000', amount: 0 },
    'Fem_L4_Ziaja_Cam_200' : { floor: 4, index: 25, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Ziaja Intima màu cam',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Ziaja_Cam_200.png', alt: 'Fem_L4_Ziaja_Cam_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '123000', amount: 0 },
    'Fem_L4_Ziaja_Hong_200' : { floor: 4, index: 26, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Ziaja Intima màu hồng',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Ziaja_Hong_200.png', alt: 'Fem_L4_Ziaja_Hong_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '123000', amount: 0 },
    'Fem_L4_Ziaja_XanhNhat_200' : { floor: 4, index: 27, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Ziaja Intima màu xanh nhạt',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Ziaja_XanhNhat_200.png', alt: 'Fem_L4_Ziaja_XanhNhat_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '123000', amount: 0 },
    'Fem_L4_Ziaja_XanhDam_200' : { floor: 4, index: 28, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Ziaja Intima màu xanh đậm',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Ziaja_XanhDam_200.png', alt: 'Fem_L4_Ziaja_XanhDam_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '123000', amount: 0 },
    'Fem_L4_Saforelle_100' : { floor: 4, index: 29, iteration: 1, group: 'fem wash', name: 'Saforelle Intensive Moisturizing Cleansing Care',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Saforelle_100.jpeg', alt: 'Fem_L4_Saforelle_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '132000', amount: 0 },
    'Fem_L4_Phytogyno_100' : { floor: 4, index: 30, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Phytogyno',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Phytogyno_100.jpeg', alt: 'Fem_L4_Phytogyno_100', x: 0, y: 0, width: 0, height: 0, volume: '100ml', price: '30000', amount: 0 },
    'Fem_L4_Femfresh_Daily_250' : { floor: 4, index: 31, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Femfresh Daily Intimate Wash',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Femfresh_Daily_250.png', alt: 'Fem_L4_Femfresh_Daily_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '168000', amount: 0 },
    'Fem_L4_Femfresh_Soothing_250' : { floor: 4, index: 32, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ Femfresh Soothing Wash',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Femfresh_Soothing_250.png', alt: 'Fem_L4_Femfresh_Soothing_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '203000', amount: 0 },
    'Fem_L4_Femfresh_Sensitive_250' : { floor: 4, index: 33, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh phụ nữ cho da nhạy cảm Femfresh 0% Sensitive Intimate Wash',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Femfresh_Sensitive_250.png', alt: 'Fem_L4_Femfresh_Sensitive_250', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '203000', amount: 0 },
    'Fem_L4_Chilly_Protect_200' : { floor: 4, index: 34, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh CHILLY PROTECT',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Chilly_Protect_200.png', alt: 'Fem_L4_Chilly_Protect_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '190000', amount: 0 },
    'Fem_L4_Chilly_Delicato_200' : { floor: 4, index: 35, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh CHILLY DELICATO',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Chilly_Delicato_200.png', alt: 'Fem_L4_Chilly_Delicato_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '190000', amount: 0 },
    'Fem_L4_Chilly_Gel_200' : { floor: 4, index: 36, iteration: 1, group: 'fem wash', name: 'Dung dịch vệ sinh CHILLY GEL',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/karena_shelf/femwash/Fem_L4_Chilly_Gel_200.png', alt: 'Fem_L4_Chilly_Gel_200', x: 0, y: 0, width: 0, height: 0, volume: '200ml', price: '190000', amount: 0 }
  }
  
  switch(parseInt(objProperties['rotation'])){
    case 1:
      for(const[key, image] of Object.entries(image_details)){
        if(objProperties['product_group'] == image.group){
          switch(objProperties['product_group']){
            case 'baby wash':
              if(key.search(/LacBabyCur|LacBabyR1|LacBabyR2|LacBabyR3/) != -1){
                switch(parseInt(objProperties['product_cell'])){
                  case 1:
                    if(key.search(/LacBabyCur/) != -1){
                      images[key] = image;
                    }
                    break;
                  case 2:
                    if(key.search(/LacBabyR1/) != -1){
                      images[key] = image;
                      images[key].iteration = 2;
                    }
                    break;
                  case 3:
                    if(key.search(/LacBabyR2/) != -1){
                      images[key] = image;
                      images[key].iteration = 2;
                    }
                    break;
                  case 4:
                    if(key.search(/LacBabyR3/) != -1){
                      images[key] = image;
                      images[key].iteration = 2;
                    }
                    break;
                }
              } else {
                images[key] = image;
              }
              break;
            case 'fem wash':
              if(key.search(/LactCur|LactR1|LactR2|LactR3/) != -1){
                switch(parseInt(objProperties['product_cell'])){
                  case 1:
                    if(key.search(/LactCur/) != -1){
                      images[key] = image;
                    }
                    break;
                  case 2:
                    if(key.search(/LactR1/) != -1){
                      images[key] = image;
                    }
                    break;
                  case 3:
                    if(key.search(/LactR2/) != -1){
                      images[key] = image;
                    }
                    break;
                  case 4:
                    if(key.search(/LactR3/) != -1){
                      images[key] = image;
                    }
                    break;
                }
              } else {
                images[key] = image;
              }
              break;
          }
        }
      }
      break;
    case 2:
      switch(objProperties['product_group']){
        case 'baby wash':
          let indexs = [2,3,4,0,1,5,6,7,8,9,10,13,14,15,16,17,11,12,18,19,20,25,26,27,21,22,23,24,28,29,34,35,36,37,38,30,31,32,33,39,40];
          
          for(let i = 0; i < indexs.length; i++){
            for(const[key, image] of Object.entries(image_details)){
              if(image.group == objProperties['product_group'] && image.index == indexs[i]){
                if(key.search(/LacBabyCur|LacBabyR1|LacBabyR2|LacBabyR3/) != -1){
                  switch(parseInt(objProperties['product_cell'])){
                    case 1:
                      if(key.search(/LacBabyCur/) != -1){
                        images[key] = image;
                      }
                      break;
                    case 2:
                      if(key.search(/LacBabyR1/) != -1){
                        images[key] = image;
                        images[key].iteration = 2;
                      }
                      break;
                    case 3:
                      if(key.search(/LacBabyR2/) != -1){
                        images[key] = image;
                        images[key].iteration = 2;
                      }
                      break;
                    case 4:
                      if(key.search(/LacBabyR3/) != -1){
                        images[key] = image;
                        images[key].iteration = 2;
                      }
                      break;
                  }
                } else {
                  images[key] = image;
                }
              }
            }
          }
          break;
        case 'fem wash':
          let floors = [4,1,2,3];
          
          for(let i = 0; i < floors.length; i++){
            for(const[key, image] of Object.entries(image_details)){
              if(image.group == objProperties['product_group'] && image.floor == floors[i]){
                if(key.search(/LactCur|LactR1|LactR2|LactR3/) != -1){
                  switch(parseInt(objProperties['product_cell'])){
                    case 1:
                      if(key.search(/LactCur/) != -1){
                        images[key] = image;
                      }
                      break;
                    case 2:
                      if(key.search(/LactR1/) != -1){
                        images[key] = image;
                      }
                      break;
                    case 3:
                      if(key.search(/LactR2/) != -1){
                        images[key] = image;
                      }
                      break;
                    case 4:
                      if(key.search(/LactR3/) != -1){
                        images[key] = image;
                      }
                      break;
                  }
                } else {
                  images[key] = image;
                }
              }
            }
          }
          break;
      }
      break;
  }

  let a = "";
  
  function loadImage(image) {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;

          img.src = image.src;
          img.alt = image.alt;
      });
  }
  
  //Function to draw rectangle with text
  function drawRectWithText(x, y, width, height, text) {
    // Draw rectangle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // Draw text
    ctx.fillStyle = '#000';
    ctx.font = (8 * zoomLevel) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
  }
  
  async function drawImages() {
    try{
      const loadedImages = await Promise.all(Object.values(images).map(loadImage));

      let dx = 0;
      let dy = 0;
      let dwidth = 0;
      let dheight = 0;

      //let ratio = 0.135
      let ratio = 0.0;
      let count = 0;
      let floor_prev = 1;

      let top_left_corner = { dx: 0, dy: 0 };
      top_left_corner.dx = images['image_shelf'].x + 110;
      top_left_corner.dy = images['image_shelf'].y + 185;

      loadedImages.forEach(image => {
        if(image.alt == 'image_shelf'){
          dx = imageOffsetX * zoomLevel;
          dy = imageOffsetY * zoomLevel;
          dwidth = image.width * zoomLevel;
          dheight = image.height * zoomLevel;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
          ctx.drawImage(image, dx, dy, dwidth, dheight);

          images[image.alt].width = image.width;
          images[image.alt].height = image.height;
        } else {
          for(let iter = 1; iter <= images[image.alt].iteration; iter++){
            let volume = parseInt(images[image.alt].volume.replace(/mlg/, ""));
            let volume_ratio = 0;

            switch(true){
              case (volume >= 0 && volume <= 400):
                volume_ratio = (volume / 800) + 0.5;
                break;
              case (volume > 400 && volume <= 600):
                volume_ratio = (volume / 800) + 0.4;
                break;
              case (volume > 600 && volume <= 700):
                volume_ratio = (volume / 800) + 0.2;
                break;
              case (volume > 700 && volume < 800):
                volume_ratio = (volume / 800) + 0.2;
                break;
              case (volume >= 800):
                volume_ratio = 1.15;
                break;
            }

            ratio = image.naturalWidth / image.naturalHeight;
            image.width = 100 * ratio * volume_ratio;
            image.height = image.width * (image.naturalHeight / image.naturalWidth);

            let x_step = 0, y_step = 0;
            let opacity = 0.6;
            let ratio_rect = 1;

            if(floor_prev != images[image.alt].floor){
              floor_prev = images[image.alt].floor;

              if(objProperties['product_group'] == 'fem wash' && parseInt(objProperties['rotation']) == 2){
                if(images[image.alt].floor == 1){
                  top_left_corner.dx = images['image_shelf'].x + 115;
                  top_left_corner.dy += 133;
                }
                if(images[image.alt].floor == 2){
                  top_left_corner.dx = images['image_shelf'].x + 115;
                  top_left_corner.dy += 136;
                }
                if(images[image.alt].floor == 3){
                  top_left_corner.dx = images['image_shelf'].x + 115;
                  top_left_corner.dy += 140;
                }
              } else {
                if(images[image.alt].floor == 2){
                  top_left_corner.dx = images['image_shelf'].x + 115;
                  top_left_corner.dy += 133;
                }
                if(images[image.alt].floor == 3){
                  top_left_corner.dx = images['image_shelf'].x + 115;
                  top_left_corner.dy += 136;
                }
                if(images[image.alt].floor == 4){
                  top_left_corner.dx = images['image_shelf'].x + 115;
                  top_left_corner.dy += 140;
                }
              }
            }

            for(let i = 1; i <= 3; i++){
              dx = (imageOffsetX + top_left_corner.dx - x_step) * zoomLevel;

              if(objProperties['product_group'] == 'fem wash' && parseInt(objProperties['rotation']) == 2){
                dy = (imageOffsetY + top_left_corner.dy - image.height + (images[image.alt].floor == 4 ? 12 : y_step)) * zoomLevel;
              } else {
                dy = (imageOffsetY + top_left_corner.dy - image.height + (images[image.alt].floor == 1 ? 12 : y_step)) * zoomLevel;
              } 
              
              dwidth = image.width * zoomLevel;
              dheight = image.height * zoomLevel;
              
              ctx.globalAlpha = opacity;
              ctx.drawImage(image, dx, dy, dwidth, dheight);

              if(i == 3){
                let rect_dwidth = 30 * zoomLevel
                let rect_dheight = 10 * zoomLevel
                let rect_dx = (imageOffsetX + top_left_corner.dx + (image.width / 2 - 20)) * zoomLevel;
                let rect_dy = (imageOffsetY + top_left_corner.dy + 15) * zoomLevel;
                
                drawRectWithText(rect_dx, rect_dy, rect_dwidth, rect_dheight, image_details[image.alt].price);
              }

              opacity += 0.2
              ratio_rect += 0.2
              x_step += 2
              y_step += 2
            }

            if(iter == 1){
              images[image.alt].x = top_left_corner.dx;
              images[image.alt].y = top_left_corner.dy - image.height;
              images[image.alt].width = image.width * images[image.alt].iteration;
              images[image.alt].height = image.height;
            }
            
            top_left_corner.dx = top_left_corner.dx + image.width + 5
            count++;
          }
        }
      });
    }catch(error){
      console.error("Error loading image:", error);
    }
  }
  function attachClickListener() {
    canvas.addEventListener('click', handleClick, false);
    canvas.addEventListener('mousedown', handleMouseDown, false);
    canvas.addEventListener('mouseup', handleMouseUp, false);
    canvas.addEventListener('mouseout', handleMouseOut, false);
    canvas.addEventListener('mousemove', handleMouseMove, false);

    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);
    canvas.addEventListener('touchend', handleTouchEnd, false);
    canvas.addEventListener('touchcancel', handleTouchCancel, false);
  }

  function handleClick(event) {
      if (isDragging) return;

      const rect = canvas.getBoundingClientRect();
      
      let x = 0, y = 0;
        
      if(event.touches != undefined){
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }
      
      if(!isClicking) return;

      for(const [key, image] of Object.entries(images)){

        if(key != 'image_shelf'){
          if (x >= imageOffsetX + image.x * zoomLevel && x <= imageOffsetX + (image.x + image.width) * zoomLevel &&
            y >= imageOffsetY + image.y * zoomLevel && y <= imageOffsetY + (image.y + image.height) * zoomLevel) {
              console.log("Image", image.src, "Clicked!");
              // You can add specific actions for each image here based on the index (i)
              
              openModal();
              
              document.getElementById('shelf-image').innerHTML = ("<img src='" + image.src + "' alt='" + image.alt + "'/>");
              document.getElementById('shelf-info-name').innerHTML = image_details[key].name
              document.getElementById('shelf-info-volume').innerHTML = "Dung tích: " + image_details[key].volume
              document.getElementById('shelf-info-price').innerHTML = "Giá: " + image_details[key].price
              break; // Exit loop after finding the clicked image
          }
        }
      }
  }

  let startX = null;
  let startY = null;

  function is_mouse_in_shape(event){
    const rect = canvas.getBoundingClientRect();
      
      if(event.touches != undefined){
        mouseX = event.touches[0].clientX - rect.left;
        mouseY = event.touches[0].clientY - rect.top;
      } else {
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
      }
      
      let imageX = images['image_shelf'].x;
      let imageY = images['image_shelf'].y;

      let shape_left =  images['image_shelf'].x;
      let shape_right = imageX + images['image_shelf'].width * zoomLevel;
      let shape_top = imageX;
      let shape_bottom = imageY + images['image_shelf'].height * zoomLevel;

      if(mouseX > shape_left && mouseX < shape_right && mouseY > shape_top && mouseY < shape_bottom){
        return true;
      }
      return false;
  }

  function handleMouseDown(event){
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();

    if(event.touches != undefined){
      startX = event.touches[0].clientX - rect.left;
      startY = event.touches[0].clientY - rect.top;
    } else {
      startX = event.clientX - rect.left;
      startY = event.clientY - rect.top;
    }
    
    if(is_mouse_in_shape(event)){
      //console.log("yes");
      isDragging = true;
    } else {
      //console.log("no");
    }
  }

  function handleMouseMove(event){
    
    if(!isDragging){
      isClicking = true;
      return;
    } else {
      isClicking = false;
      
      event.preventDefault();

      const rect = canvas.getBoundingClientRect();
      
      let mouseX = 0, mouseY = 0;

      if(event.touches != undefined){
        mouseX = event.touches[0].clientX - rect.left;
        mouseY = event.touches[0].clientY - rect.top;
      } else {
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
      }
      
      imageOffsetX = mouseX - startX;
      imageOffsetY = mouseY - startY;

      imageOffsetX += imageOffsetX * (1 - zoomLevel);
      imageOffsetY += imageOffsetY * (1 - zoomLevel);

      images['image_shelf'].x += imageOffsetX;
      images['image_shelf'].y += imageOffsetY;
      
      drawImages();
      
      startX = mouseX;
      startY = mouseY;
    }
  }
  
  function handleMouseUp(event){
    if(!isDragging){
      return;
    }

    event.preventDefault();
    isDragging = false;
    
    if(images['image_shelf'].x < 0){
      let chieu_rong_con_lai = images['image_shelf'].width * zoomLevel + images['image_shelf'].x;
    
      if(chieu_rong_con_lai < canvas.width){
        images['image_shelf'].x = images['image_shelf'].x + (canvas.width - chieu_rong_con_lai)  * zoomLevel;
      }
    } else{
      images['image_shelf'].x = 0;
    }

    if(images['image_shelf'].y < 0){
      let chieu_cao_con_lai = images['image_shelf'].height * zoomLevel + images['image_shelf'].y;
    
      if(chieu_cao_con_lai < canvas.height){
        images['image_shelf'].y = images['image_shelf'].y + (canvas.height - chieu_cao_con_lai)  * zoomLevel;
      }
    } else{
      images['image_shelf'].y = 0;
    }
    
    drawImages();
  }
  
  function handleMouseOut(event){
    if(!isDragging){
      return;
    }

    event.preventDefault();
    isDragging = false;

    if(images['image_shelf'].x < 0){
      let chieu_rong_con_lai = images['image_shelf'].width * zoomLevel + images['image_shelf'].x;
    
      if(chieu_rong_con_lai < canvas.width){
        images['image_shelf'].x = images['image_shelf'].x + (canvas.width - chieu_rong_con_lai)  * zoomLevel;
      }
    } else{
      images['image_shelf'].x = 0;
    }

    if(images['image_shelf'].y < 0){
      let chieu_cao_con_lai = images['image_shelf'].height * zoomLevel + images['image_shelf'].y;
    
      if(chieu_cao_con_lai < canvas.height){
        images['image_shelf'].y = images['image_shelf'].y + (canvas.height - chieu_cao_con_lai)  * zoomLevel;
      }
    } else{
      images['image_shelf'].y = 0;
    }
    
    drawImages();
  }

  function getTouchPos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
  }

  function handlePinch(event) {
    if (event.touches.length >= 2) {
        const distanceX = event.touches[0].clientX - event.touches[1].clientX;
        const distanceY = event.touches[0].clientY - event.touches[1].clientY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (pinchDistance) {
            const scaleFactor = distance / pinchDistance;
            zoom(scaleFactor);
        }
        pinchDistance = distance;
    }
  }

  function zoom(factor) {
    zoomLevel *= factor;
    drawImages();
  }

  function handleTouchMove(event){
    event.preventDefault();
    const touchPos = getTouchPos(canvas, event.touches[0]);

    if (event.touches.length >= 2) {
      handlePinch(event);
    } else if (isDragging) {
      // Handle dragging behavior here
      const deltaX = touchPos.x - lastX;
      const deltaY = touchPos.y - lastY;

      imageOffsetX += deltaX;
      imageOffsetY += deltaY;
      
      lastX = touchPos.x;
      lastY = touchPos.y;

      drawImages();
    }
  };

  function handleTouchStart(event){
      event.preventDefault();
      const touchPos = getTouchPos(canvas, event.touches[0]);
      lastX = touchPos.x;
      lastY = touchPos.y;
      isDragging = true;
  };

  function handleTouchEnd(event){
    const touchPos = getTouchPos(canvas, event.changedTouches[0]); // event is undefined here
    const endX = touchPos.x;
    const endY = touchPos.y;

    // Calculate distance moved
    const distance = Math.sqrt(Math.pow(endX - lastX, 2) + Math.pow(endY - lastY, 2));

    if (distance < 5) { // Adjust this threshold as needed
        // Treat it as a click
        console.log('Click detected');
        
        for(const [key, image] of Object.entries(images)){

          if(key != 'image_shelf'){
            if (touchPos.x >= (imageOffsetX + image.x) * zoomLevel && touchPos.x <= (imageOffsetX + image.x + image.width) * zoomLevel &&
            touchPos.y >= (imageOffsetY + image.y) * zoomLevel && touchPos.y <= (imageOffsetY + image.y + image.height) * zoomLevel) {
                console.log("Image", image.src, "Clicked!");
                // You can add specific actions for each image here based on the index (i)
                
                openModal();
                
                document.getElementById('shelf-image').innerHTML = ("<img src='" + image.src + "' alt='" + image.alt + "'/>");
                document.getElementById('shelf-info-name').innerHTML = image_details[key].name
                document.getElementById('shelf-info-volume').innerHTML = "Dung tích: " + image_details[key].volume
                document.getElementById('shelf-info-price').innerHTML = "Giá: " + image_details[key].price
                break; // Exit loop after finding the clicked image
            }
          }
        }
    } else {
        // Treat it as a drag
        console.log('Drag detected');
    }

    if (event.touches.length < 2) {
      pinchDistance = undefined;
    }
    isDragging = false;
  }

  function handleTouchCancel(event){
    pinchDistance = undefined;
    isDragging = false;
  };
  
  function zoomIn() {
    zoomLevel *= 1.2; // Increase zoom level by 20%
    drawImages();
  }

  function zoomOut() {
      if (zoomLevel > 1) {
          zoomLevel /= 1.2; // Decrease zoom level by 20%
          drawImages();
      }
  }

  const zoomInButton = document.getElementById('zoomIn');
  const zoomOutButton = document.getElementById('zoomOut');

  zoomInButton.addEventListener('click', zoomIn);
  zoomOutButton.addEventListener('click', zoomOut);

  drawImages().then(attachClickListener);
});
