//Global Declarations
const colorDiv = document.querySelectorAll(".color");
const currentHexText = document.querySelectorAll(".color h2");
const slider = document.querySelectorAll('.slider');
const generate = document.querySelector(".generate");
const copyContainer= document.querySelector(".copy-container");
//const adjust=document.querySelectorAll(".adjust");
//const lock=document.querySelectorAll(".lock");
let initialColors;
let initialBrightness;
let initialSaturation;

//Event Listners
generate.addEventListener('click',randomColors);

slider.forEach(slider=>{
    slider.addEventListener('input',updateColor);
});
currentHexText.forEach(hex =>{
    hex.addEventListener("click",()=>{
        copyToClipboad(hex);
    });
});

copyContainer.addEventListener("transitionend",()=>{
    copyContainer.classList.remove("active");
    copyContainer.children[0].classList.remove("active");

});

 //Functions--------------------------------------------------------

function generateHex(){
     const hexColor=  chroma.random();
     return hexColor;
}

function randomColors(){
     initialColors=[];
     initialBrightness=[];
     initialSaturation=[];
     colorDiv.forEach((div) => {
         //console.log(div);
         const randomHex= generateHex();
         initialColors.push(randomHex.hex());
         //console.log(initialColors);
         const hexValue= div.children[0];
         const divIcons=div.children[1].children;
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
         //console.log(sliders);
         const hue = sliders[0];
         const brightness= sliders[1];
         const saturation = sliders[2];
         //console.log(hue);
         //console.log(brightness);
         //console.log(saturation);

        colorizeSliders(color,hue,brightness,saturation);


        //ResetInputs------------------------------------
       

     });
     //console.log(initialColors);
     resetInputs();
}

function changeTextContrast(color,text){
     const luminance= chroma(color).luminance();
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
    const selectedSlider=e.target;
    const index= e.target.getAttribute("data-hue")||e.target.getAttribute("data-bright")||e.target.getAttribute("data-sat");
    const selectedSliderValue= selectedSlider.value;
    //Values for change contrast function---------------------------------------------------------
    const hexValue= selectedSlider.parentElement.parentElement.children[0];
    const divIcons=selectedSlider.parentElement.parentElement.children[1].children;
    
        if(selectedSlider.classList.contains("hue-input"))  {
              //console.log(`update hue for color ${index}`);
              const newHueColor=updateHue(index,selectedSliderValue);
              //console.log(selectedSlider.parentElement);
              const resSlider = selectedSlider.parentElement.querySelectorAll("input");
              //console.log(resSlider);
              const resHue = resSlider[0];
              const resBright= resSlider[1];
              const resSat= resSlider[2];
              colorizeSliders(newHueColor,resHue,resBright,resSat);
              initialColors[index]=newHueColor;
              changeTextContrast(initialColors[index],hexValue);
              for(icon of divIcons){
                    changeTextContrast(initialColors[index],icon);
                }
          }else if(selectedSlider.classList.contains("bright-input")){
            console.log(`update bright for color ${index}`);
            updateBright(index,selectedSliderValue);
            const newBrightColor=updateBright(index,selectedSliderValue);
            const resSlider = selectedSlider.parentElement.querySelectorAll("input");
            const resHue = resSlider[0];
            const resBright= resSlider[1];
            const resSat= resSlider[2];
            initialBrightness[index]=newBrightColor.hex();
            //console.log(initialBrightness[index]);
            colorizeSliders(newBrightColor,resHue,resBright,resSat);
            changeTextContrast(initialBrightness[index],hexValue);
            for(icon of divIcons){
                changeTextContrast(initialBrightness[index],icon);
                }
          }else if(selectedSlider.classList.contains("sat-input")){
            //console.log(`update sat for color ${index}`);
            const newSatColor=updateSat(index,selectedSliderValue);
            const resSlider = selectedSlider.parentElement.querySelectorAll("input");
            const resHue = resSlider[0];
            const resBright= resSlider[1];
            const resSat= resSlider[2];
            initialSaturation[index]=newSatColor;
            initialColors[index]=newSatColor;
            colorizeSliders(newSatColor,resHue,resBright,resSat);
            changeTextContrast(initialBrightness[index],hexValue);
            for(icon of divIcons){
                changeTextContrast(initialSaturation[index],icon);
                }
          }
            
}

function updateHue(index,selectedSliderValue){
            const divColorValue = initialColors[index];
            //console.log(divColorValue);
            let newColor= chroma(divColorValue).set("hsl.h",selectedSliderValue);
            colorDiv[index].children[0].innerText = newColor.hex();
            //initialColors[index]= newColor.hex();
            colorDiv[index].style.backgroundColor= newColor;
            return newColor;
 }
function updateBright(index,selectedSliderValue){
            const divColorValue = initialColors[index];
            //console.log(divColorValue);
            let newColor= chroma(divColorValue).set("hsl.l",selectedSliderValue);
            colorDiv[index].children[0].innerText = newColor.hex();
            colorDiv[index].style.backgroundColor= newColor;
            return newColor;
}
function updateSat(index,selectedSliderValue){
            const divColorValue =initialBrightness[index];
            //console.log(divColorValue);
            let newColor= chroma(divColorValue).set("hsl.s",selectedSliderValue);
            colorDiv[index].children[0].innerText = newColor.hex();
            colorDiv[index].style.backgroundColor= newColor;
            return newColor;
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

