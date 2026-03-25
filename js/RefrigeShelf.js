document.addEventListener("DOMContentLoaded", function(event){
  
  var custom_question_properties = document.getElementsByClassName("custom_question_properties");
  
  var objProperties = {};

  if(custom_question_properties.length > 0){
      var str_obj = custom_question_properties[0].innerText;

      objProperties = convertJSON(str_obj);
      custom_question_properties[0].parentNode.style.display = "none";
  }

  // objProperties = {
  //   rotation: 1,
  //   product_group: 'fem wash',
  //   product_cell: 1,
  //   shopping_cart: 0
  // }

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

  document.getElementById("_Q0").value = ""; //Hinh ảnh được chọn
  document.getElementById("_Q1").value = ""; //Thời gian vào kệ
  document.getElementById("_Q2").value = ""; //Thời gian xem hình ảnh
  document.getElementById("_Q3").value = ""; //Thời gian chọn sản phẩm
  
  document.getElementById("_Q0").style.display = "none";

  document.querySelectorAll(".openend_basic").forEach((div) => {
    div.style.display = "none";
  });
 
  // Functions to open and close the modal
  let modalOpenTime = null;

  function openModal() {
    shelfOverlay.style.display = 'block';
    shelfModal.style.display = 'flex';

    modalOpenTime = new Date();
  }

  function closeModal() {
    shelfOverlay.style.display = 'none';
    shelfModal.style.display = 'none';
  }

  function selectdModal() {
    let selectedTime = new Date();

    if(modalOpenTime){
        document.getElementById("_Q2").value = modalOpenTime;
    }

    document.getElementById("_Q3").value = selectedTime;

    //--Modal Content--//
    let img = document.getElementById('shelf-image').querySelector("img");
    
    document.getElementById("_Q0").value = img.alt;

    closeModal();
  }

  // Close the modal if the overlay is clicked
  shelfOverlay.addEventListener('click', closeModal);

  document.getElementById('btnSelected').addEventListener('click', (event) => {
    selectdModal();
    event.defaultPrevented;        
  });

  document.getElementById('btnClose').addEventListener('click', (event) => {
    closeModal();
    event.defaultPrevented;
  });

  const canvas = document.getElementById('shelfCanvas');
  const ctx = canvas.getContext('2d');
  
  let zoomLevel = 1;
  let offsetX = 0;
  let offsetY = 0;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let pinchDistance = null;

  let isClicking = false;

  let imageOffsetX = 0; 
  let imageOffsetY = 0;

  let clickStartX = 0;
  let clickStartY = 0;

  // Define an array to store image objects and their properties
  const images = {
    'image_shelf' : { group: 'Shelf', name: 'Shelf',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/refrige_shelf.png', alt: 'image_shelf', floor: 0, x: 0, y: 0, width: 0, height: 0, volume: '', price: '', amount: 0 },
  }

  const image_details = {
    'code_1' : { floor: 1, index: 0, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_1.png', alt: 'code_1', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_2' : { floor: 1, index: 1, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_2.png', alt: 'code_2', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_3' : { floor: 1, index: 2, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_3.png', alt: 'code_3', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_4' : { floor: 1, index: 3, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_4.png', alt: 'code_4', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_5' : { floor: 1, index: 4, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_5.png', alt: 'code_5', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_6' : { floor: 2, index: 0, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_6.png', alt: 'code_6', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_7' : { floor: 2, index: 1, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_7.png', alt: 'code_7', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_8' : { floor: 2, index: 2, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_8.png', alt: 'code_8', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_9' : { floor: 2, index: 3, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_9.png', alt: 'code_9', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_10' : { floor: 2, index: 4, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_10.png', alt: 'code_10', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_11' : { floor: 3, index: 0, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_11.png', alt: 'code_11', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_12' : { floor: 3, index: 1, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_12.png', alt: 'code_12', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_13' : { floor: 3, index: 2, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_13.png', alt: 'code_13', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_14' : { floor: 3, index: 3, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_14.png', alt: 'code_14', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 },
    'code_15' : { floor: 3, index: 4, iteration: 1, rotation: '1', name: 'Sữa tắm gội Lactacyd Extra Milky',src: 'https://images1.ipsosinteractive.com/ABC_VIETNAM_10072020/images/playground_images/code_15.png', alt: 'code_15', x: 0, y: 0, width: 0, height: 0, volume: '250ml', price: '89500', amount: 0 }
  }
  
  for(const[key, image] of Object.entries(image_details)){
    if(objProperties['rotation'] == image.rotation){
      images[key] = image;
    }
  }

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

    try {

      const loadedImages = await Promise.all(
        Object.values(images).map(loadImage)
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* =========================
        APPLY ZOOM + PAN
      ==========================*/

      ctx.save();
      ctx.setTransform(
        zoomLevel,
        0,
        0,
        zoomLevel,
        offsetX,
        offsetY
      );

      const floorIndex = {};

      loadedImages.forEach(image => {

        /* =========================
          DRAW SHELF
        ==========================*/

        if (image.alt === "image_shelf") {

          const scale = Math.min(
            canvas.width / image.width,
            canvas.height / image.height
          );

          const dwidth = image.width * scale;
          const dheight = image.height * scale;

          const dx = (canvas.width - dwidth) / 2;
          const dy = (canvas.height - dheight) / 2;

          ctx.drawImage(image, dx, dy, dwidth, dheight);

          images[image.alt].x = dx;
          images[image.alt].y = dy;
          images[image.alt].width = dwidth;
          images[image.alt].height = dheight;

          return;
        }

        const shelf = images["image_shelf"];

        /* =========================
          PRODUCT SIZE
        ==========================*/

        let volume = parseInt(images[image.alt].volume.replace(/mlg/, ""));
        let volume_ratio = 1;

        if (volume <= 400) volume_ratio = (volume / 800) + 0.5;
        else if (volume <= 600) volume_ratio = (volume / 800) + 0.4;
        else if (volume <= 700) volume_ratio = (volume / 800) + 0.2;
        else if (volume < 800) volume_ratio = (volume / 800) + 0.2;
        else volume_ratio = 1.15;

        const startX = shelf.x + shelf.width * 0.18;
        const startY = shelf.y + shelf.height * 0.35;

        const shelfGap = shelf.height * 0.15;

        const floor = images[image.alt].floor;

        let shelfY = startY + (floor - 1) * shelfGap;

        const floorOffset = {
          1: 0,
          2: -15,
          3: -20,
          4: -25
        };

        shelfY += floorOffset[floor] || 0;

        const maxProductHeight = shelfGap * 0.75;

        const ratio = image.naturalWidth / image.naturalHeight;

        image.height = maxProductHeight * volume_ratio;
        image.width = image.height * ratio;

        /* =========================
          SLOT INDEX
        ==========================*/

        // if (!floorIndex[floor]) {
        //   floorIndex[floor] = 0;
        // }

        // const index = floorIndex[floor];
        // floorIndex[floor]++;

        const index = images[image.alt].index;
        
        const slots = 7;
        const slotWidth = shelf.width / slots;

        let shelfX =
          startX +
          index * slotWidth +
          (slotWidth - image.width) / 2;

        /* =========================
          DRAW ITERATIONS
        ==========================*/

        for (let iter = 1; iter <= images[image.alt].iteration; iter++) {

          // let opacity = 0.6;
          let opacity = 1;
          let x_step = 0;
          let y_step = 0;

          for (let i = 1; i <= 1; i++) {

            const dx = shelfX - x_step;

            const dy =
              shelfY +
              shelfGap * 0.12 -
              image.height +
              y_step;

            ctx.globalAlpha = opacity;

            ctx.drawImage(
              image,
              dx,
              dy,
              image.width,
              image.height
            );

            // DEBUG: vẽ bounding box
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(dx, dy, image.width, image.height);

            // opacity += 0.2;
            x_step += 2;
            y_step += 2;
          }

          /* SAVE POSITION */

          if (iter === 1) {

            images[image.alt].x = shelfX - x_step;

            images[image.alt].y =
              shelfY +
              shelfGap * 0.12 -
              image.height +
              y_step;

            images[image.alt].width =
              image.width * images[image.alt].iteration;

            images[image.alt].height = image.height;

          }

          shelfX += slotWidth;
        }

      });

      ctx.restore();

    } catch (error) {

      console.error("Error loading image:", error);

    }
  }

  function resizeCanvas(){

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.setTransform(1,0,0,1,0,0);

    drawImages();
  }

  function screenToWorld(x, y) {
    return {
      x: (x - offsetX) / zoomLevel,
      y: (y - offsetY) / zoomLevel
    };
  }

  function getPointer(event) {
    const rect = canvas.getBoundingClientRect();

    if (event.touches) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function detectProduct(worldX, worldY){

  const sortedImages = Object.entries(images)
      .filter(([key]) => key !== "image_shelf")
      .sort((a,b)=>{
        const imgA = a[1];
        const imgB = b[1];

        if(imgA.floor === imgB.floor){
          return imgA.index - imgB.index;
        }

        return imgA.floor - imgB.floor;
      });

    for(const [key,image] of sortedImages){

      if(
        worldX >= image.x &&
        worldX <= image.x + image.width &&
        worldY >= image.y &&
        worldY <= image.y + image.height
      ){

        openModal();

        document.getElementById('shelf-image').innerHTML =
          "<img src='"+image.src+"' alt='"+image.alt+"'/>";

        document.getElementById('shelf-product-info').innerHTML =
          "<div class='product-item'>" + image_details[key].name + "</div>";

        break;
      }
    }
  }

  function pointerDown(event){

    const pos = getPointer(event);

    startX = pos.x;
    startY = pos.y;

    clickStartX = pos.x;
    clickStartY = pos.y;

    isDragging = true;
  }

  function pointerMove(event){

    if(!isDragging) return;

    const pos = getPointer(event);

    const dx = pos.x - startX;
    const dy = pos.y - startY;

    offsetX += dx;
    offsetY += dy;

    startX = pos.x;
    startY = pos.y;

    drawImages();
  }

  function pointerUp(event){

    const pos = getPointer(event);

    const distance = Math.sqrt(
      Math.pow(pos.x - clickStartX,2) +
      Math.pow(pos.y - clickStartY,2)
    );

    if(distance < 5){

      const world = screenToWorld(pos.x,pos.y);

      detectProduct(world.x, world.y);

    }

    isDragging = false;
  }

  function handleTouchMove(event){

    event.preventDefault();

    // Chỉ cho phép drag 1 ngón
    if(event.touches.length === 1){
      pointerMove(event);
    }
  }

  function handleTouchEnd(){

    pinchDistance = null;
    isDragging = false;

  }

  resizeCanvas();
  
  drawImages().then(() => {
    canvas.addEventListener("mousedown",pointerDown);
    canvas.addEventListener("mousemove",pointerMove);
    canvas.addEventListener("mouseup",pointerUp);

    canvas.addEventListener("touchstart",pointerDown);
    canvas.addEventListener("touchmove",handleTouchMove);
    canvas.addEventListener("touchend",handleTouchEnd);

    // Ẩn loading
    document.getElementById("loading-screen").style.display = "none";

    // Lưu thời gian vào kệ
    let cur = new Date();
    document.getElementById("_Q1").value = cur;
  });
});
