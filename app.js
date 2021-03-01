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

//Save Palette and Library
let savedPalette=[];
const save = document.querySelector('.save');
const saveContainer = document.querySelector('.save-container');
const savePopup = document.querySelector(".save-popup");
const saveInput = document.querySelector(".save-name");
const saveSubmit = document.querySelector(".submit-save");
const closeSaveButton = document.querySelector(".close-save");

save.addEventListener("click", openSave);
closeSaveButton.addEventListener("click",closeSave);
saveSubmit.addEventListener("click",savePalette);
function openSave(){
    saveContainer.classList.add("active");
    savePopup.classList.add("active");
}

function closeSave(){
    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
}

function savePalette(){
    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
    const name= saveInput.value;
    const color=[];
    currentHexText.forEach(hex=>{
        color.push(hex.innerText);
    });

    //generate Palette object
    let paletteNr ;
    const paletteObject=JSON.parse(localStorage.getItem("palettes"));
    if(paletteObject){
        paletteNr= paletteObject.length;
    }
    else{
        paletteNr= savePalette.length;
    }
    //console.log(paletteNr);
    let paletteObj={ name, color, nr:paletteNr}
    savedPalette.push(paletteObj);
    

    //Save palette object to local storage
    saveToLocal(paletteObj);
    saveInput.value="";

    //Generate palette for Library
    const palette = document.createElement('div');
    palette.classList.add("library-palette");
    const title = document.createElement("h4");
    title.innerText= paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObj.color.forEach(smallColor=>{
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor= smallColor;
        preview.appendChild(smallDiv);
    });

    const libPaletteButton = document.createElement("button");
    libPaletteButton.classList.add("pick-palette-button");
    libPaletteButton.classList.add(paletteObj.nr);
    libPaletteButton.innerText="Select";

    //Library Select Button
    libPaletteButton.addEventListener("click",(e)=>{
        
        closeLibrary();
        const copyInitialColors = initialColors;
        initialColors=[];
        const paletteIndex = e.target.classList[1];
       // console.log(savedPalette[paletteIndex].color);
        
        savedPalette[paletteIndex].color.forEach((color,index)=>{
            
            if(colorDiv[index].classList.contains("locked")){
                initialColors.push(copyInitialColors[index]);
                return;
            }else{
                initialColors.push(color);
               }
            //console.log(initialColors);
            colorDiv[index].style.backgroundColor = initialColors[index];
            const text = colorDiv[index].children[0];
            text.innerText =savedPalette[paletteIndex].color[index]; 
            changeTextContrast(color,text);
            const lock = colorDiv[index].children[1].children[0];
            const adjust = colorDiv[index].children[1].children[1];
            changeTextContrast(color,lock); 
            changeTextContrast(color,adjust); 
            color= chroma(color);
            const sliders= colorDiv[index].querySelectorAll(".sliders input");
            const hue = sliders[0];
            const brightness= sliders[1];
            const saturation = sliders[2];
            colorizeSliders(color,hue,brightness,saturation);
        });
        resetInputs();

    });

    //Append library container
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(libPaletteButton);
    libraryContainer.children[0].children[2].appendChild(palette);
    
}

function saveToLocal(paletteObj){
    let localPalettes;
    if(localStorage.getItem("palettes") === null){
        localPalettes=[];
    }
    else{
        localPalettes=JSON.parse(localStorage.getItem("palettes"))
    }
    localPalettes.push(paletteObj);
    //console.log(localPalettes);
    localStorage.setItem("palettes",JSON.stringify(localPalettes));
}



//Libraray functionality

const libraryContainer =document.querySelector('.library-container');
const libraryPopup = document.querySelector('.library-popup');
const closeLibraryButton = document.querySelector('.close-library');
const library = document.querySelector(".library");

library.addEventListener("click",openLibrary);
closeLibraryButton.addEventListener("click",closeLibrary);

function openLibrary(){
    libraryContainer.classList.add("active");
    libraryPopup.classList.add("active");
}

function closeLibrary(){
    libraryContainer.classList.remove("active");
    libraryPopup.classList.remove("active");
}


function getLocal(){
    if(localStorage.getItem("palettes") === null){
        localPalettes=[];
    }
    else{
        const paletteObject=JSON.parse(localStorage.getItem("palettes"));
        //console.log(paletteObject);
        paletteObject.forEach(paletteObj=>{
            //console.log(paletteObj);
            const palette = document.createElement('div');
            palette.classList.add("library-palette");
            const title = document.createElement("h4");
            title.innerText= paletteObj.name;
            const preview = document.createElement("div");
            preview.classList.add("small-preview");
            paletteObj.color.forEach(smallColor=>{
                const smallDiv = document.createElement("div");
                smallDiv.style.backgroundColor= smallColor;
                preview.appendChild(smallDiv);
            });
        
            const libPaletteButton = document.createElement("button");
            libPaletteButton.classList.add("pick-palette-button");
            libPaletteButton.classList.add(paletteObj.nr);
            //console.log("pnr"+paletteObj.nr);
            libPaletteButton.innerText="Select";
        
            //Library Select Button
            libPaletteButton.addEventListener("click",(e)=>{
                closeLibrary();
                const copyInitialColors = initialColors;
                initialColors=[];
                const paletteIndex = e.target.classList[1];
               //console.log("pi:"+paletteIndex);
               //console.log(e.target);
                
                    paletteObject[paletteIndex].color.forEach((color,index)=>{
                        //console.log(colorDiv[index].classList.contains("locked"));
                        if(colorDiv[index].classList.contains("locked")){
                            initialColors.push(copyInitialColors[index]);
                            return;
                        }else{
                            initialColors.push(color);
                           }
                        //console.log(initialColors);
                        colorDiv[index].style.backgroundColor = initialColors[index];
                        const text = colorDiv[index].children[0];
                        text.innerText =paletteObject[paletteIndex].color[index]; 
                        changeTextContrast(color,text);
                        const lock = colorDiv[index].children[1].children[0];
                        const adjust = colorDiv[index].children[1].children[1];
                        changeTextContrast(color,lock); 
                        changeTextContrast(color,adjust); 
                        color= chroma(color);
                        const sliders= colorDiv[index].querySelectorAll(".sliders input");
                        const hue = sliders[0];
                        const brightness= sliders[1];
                        const saturation = sliders[2];
                        colorizeSliders(color,hue,brightness,saturation);
                });
        
                resetInputs();
        
            });
        
            //Append library container
            palette.appendChild(title);
            palette.appendChild(preview);
            palette.appendChild(libPaletteButton);
            libraryContainer.children[0].children[2].appendChild(palette); 
        });
    }
}

getLocal();