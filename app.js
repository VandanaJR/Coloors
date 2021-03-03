//Global Declarations
const colorDiv = document.querySelectorAll(".color");
const currentHexText = document.querySelectorAll(".color h2");
const slider = document.querySelectorAll('.sliders');
const generate = document.querySelector(".generate");
const copyContainer = document.querySelector(".copy-container");
const closeSlider = document.querySelectorAll(".close-slider");
const adjust = document.querySelectorAll(".adjust");
const lock=document.querySelectorAll(".lock");
let initialColors;



//Event Listners---------------------------------------------------
generate.addEventListener('click',randomColors);

slider.forEach(slider=>{
    slider.addEventListener('input',updateColor);
});
currentHexText.forEach(hex =>{
    hex.addEventListener("click",() =>{
        copyToClipboad(hex);
    });
});

copyContainer.addEventListener("transitionend",() =>{
    copyContainer.classList.remove("active");
    copyContainer.children[0].classList.remove("active");

});

adjust.forEach((button,index)=>{
    button.addEventListener('click',() =>{
        openAdjustmentPanel(index);
    });
});

closeSlider.forEach((button,index) =>{
    button.addEventListener('click',() =>{
        closeAdjustmentPanel(index);
    });
});

lock.forEach((button,index)=>{
    button.addEventListener('click',()=>{
        lockColor(index);
    });
});

 //Functions--------------------------------------------------------
 randomColors();

function generateHex(){
     const hexColor=  chroma.random();
     return hexColor;
}

function randomColors(){
     initialColors=[];
     
     colorDiv.forEach((div) => {
         //console.log(div);
         const randomHex= generateHex();
         //console.log(initialColors);
         const hexValue= div.children[0];
         const divIcons=div.children[1].children;
         
         if(div.classList.contains("locked")){
            initialColors.push(hexValue.innerText);
            return;
        }else{
            initialColors.push(randomHex.hex());
           }
         //console.log(divIcons);
         div.style.backgroundColor= randomHex;
         hexValue.innerText= randomHex;
         //Change text contrast
         changeTextContrast(randomHex,hexValue);
         for(icon of divIcons){
            changeTextContrast(randomHex,icon);
         }
         
         //Initialize color sliders---------------------------------
         const color= chroma(randomHex);
         const sliders= div.querySelectorAll(".sliders input");
         const hue = sliders[0];
         const brightness= sliders[1];
         const saturation = sliders[2];

        colorizeSliders(color,hue,brightness,saturation);
    });
      //ResetInputs------------------------------------
     resetInputs();
}

function changeTextContrast(color,text){
     const luminance = chroma(color).luminance();
     //console.log(luminance);
     if(luminance>.5){
         text.style.color="black";
     }else{
         text.style.color="white";
     }
}


function colorizeSliders(color,hue,brightness,saturation){
     //Saturation Scale------------------------------------------
     const noSat = color.set('hsl.s', 0);
     const fullSat= color.set('hsl.s', 1);
     //console.log(noSat);
     //console.log(fullSat);
     const scaleSat = chroma.scale([noSat,color,fullSat]);
     //console.log(scaleSat(0));
     saturation.style.backgroundImage= `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
     
    //Brightness Scale--------------------------------------------
    const midBright= color.set('hsl.l',0.5);
    const scaleBright= chroma.scale(["black",midBright,"white"]);
    brightness.style.backgroundImage= `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;

    //Hue Scale----------------------------------------------------
    hue.style.backgroundImage='linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))';
}


//------------------------------------------------------------------------
function updateColor(e){
    const index = e.target.getAttribute("data-hue")||e.target.getAttribute("data-bright")||e.target.getAttribute("data-sat");
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    //console.log(sliders);
    const hue = sliders[0];
    const brightness= sliders[1];
    const saturation = sliders[2];
    //console.log(saturation);
    //console.log(saturation.value);

    //Generate color a/c to slider values---------------------------------------------------------==============
    let color = chroma(initialColors[index])
    .set('hsl.s',saturation.value)
    .set('hsl.l',brightness.value)
    .set('hsl.h',hue.value);

    colorDiv[index].style.backgroundColor = color;
    colorizeSliders(color,hue,brightness,saturation);
    const hexValue= e.target.parentElement.parentElement.children[0];
    const divIcons=e.target.parentElement.parentElement.children[1].children;
    hexValue.innerText = color.hex();
    changeTextContrast(color,hexValue);
    for(icon of divIcons){
       changeTextContrast(color,icon);
    }

}

//----------------------------------------------------------------------

function resetInputs(){
            const sliders= document.querySelectorAll(".sliders input");
            sliders.forEach( slider => {
                
                if(slider.name === 'hue'){
                    const color= initialColors[slider.getAttribute("data-hue")];
                    //console.log(color);
                    const value= chroma(color).hsl()[0];
                    //console.log(value);
                    slider.value= Math.floor(value);
                }

               if(slider.name === 'brightness'){
                    const color= initialColors[slider.getAttribute("data-bright")];
                    //console.log(color);
                    const value= chroma(color).hsl()[2];
                    //console.log(value);
                    slider.value= Math.floor(value*100)/100;
                }

                if(slider.name === 'saturtion'){
                    const color= initialColors[slider.getAttribute("data-sat")];
                    //console.log(color);
                    const value= chroma(color).hsl()[1];
                    //console.log(value);
                    slider.value= Math.floor(value*100)/100;
                }
            });
            
            
            
}

function copyToClipboad(hex){
    const el =document.createElement("textarea");
    el.value=hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    //PopUp Animation--------------------
    copyContainer.classList.add("active");
    copyContainer.children[0].classList.add("active");
}

function openAdjustmentPanel(index){
    slider[index].classList.toggle("active");
}

function closeAdjustmentPanel(index){
    slider[index].classList.remove("active");
}


function lockColor(index){
    lock[index].parentElement.parentElement.classList.toggle("locked");
    
    if(lock[index].parentElement.parentElement.classList.contains("locked")){
        lock[index].innerHTML='<i class="fas fa-lock"></i>';
    }else{
        lock[index].innerHTML='<i class="fas fa-lock-open"></i>';
    }
}

