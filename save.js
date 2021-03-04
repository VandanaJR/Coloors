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
    let paletteObject=JSON.parse(localStorage.getItem("palettes"));
    console.log("SP:"+savedPalette);
    console.log("PO:"+paletteObject);
    // if(paletteObject){
    //     paletteNr= (paletteObject[paletteObject.length].nr)+Math.floor(Math.random());
    // }
    // else{
    //     paletteNr= savedPalette.length;
    // }
    randomNr = Math.random()*1000000;
    paletteNr=Math.floor(randomNr);
    console.log(paletteNr);
    let paletteObj={ name, color, nr:paletteNr}
    savedPalette.push(paletteObj);


    // //Save palette object to local storage
    saveToLocal(paletteObj);
    saveInput.value="";
    paletteObject=JSON.parse(localStorage.getItem("palettes"));
    console.log("SP1:"+ savedPalette);
    console.log("PO1:"+paletteObject);
    
    generatePalette(paletteObj);
     //Library Select Button
     const selectButton = document.querySelectorAll(".pick-palette-button");
     if (selectButton){
        selectButton.forEach(select=>{
            select.addEventListener("click", e => {
                selectPalette(e);
            });
        });
     }
    
     const deleteButton = document.querySelectorAll(".delete-palette-button");
     if (deleteButton){
        deleteButton.forEach(deleteB => {
            deleteB.addEventListener("click", e => {
                
                savedPalette = deletePalette(e);
            });
        });
     }
   
}

function generatePalette(paletteObj){
   //Generate palette for Library
    const palette = document.createElement('div');
    const previewWrap =document.createElement('div');
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

    const deleteButton= document.createElement('button');
    deleteButton.classList.add("delete-palette-button");
    deleteButton.classList.add(paletteObj.nr);
    deleteButton.innerHTML='<i class="fas fa-trash"></i>'; 

    //Append library container
    palette.appendChild(title);
    previewWrap.appendChild(preview);
    previewWrap.appendChild(libPaletteButton);
    palette.appendChild(previewWrap);
    palette.appendChild(deleteButton);
    libraryContainer.children[0].children[2].appendChild(palette);
    
}
function selectPalette(e){
        
        closeLibrary();
        const copyInitialColors = initialColors;
        initialColors=[];
        const paletteIndex = e.target.classList[1];
        const paletteObject=JSON.parse(localStorage.getItem("palettes"));
        console.log(paletteObject);
        console.log(paletteIndex);
        for( let i=0; i < paletteObject.length; i++){
            console.log(paletteObject[i].nr == paletteIndex);
            if(paletteObject[i].nr == paletteIndex){
                console.log(paletteObject[i].color);
                paletteObject[i].color.forEach((color,index)=>{
            
                    if(colorDiv[index].classList.contains("locked")){
                        initialColors.push(copyInitialColors[index]);
                        return;
                    }else{
                        initialColors.push(color);
                       }
                    //console.log(initialColors);
                    colorDiv[index].style.backgroundColor = initialColors[index];
                    const text = colorDiv[index].children[0];
                    text.innerText =paletteObject[i].color[index]; 
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
            }
        }
       
}
function deletePalette(e){
        paletteObject=JSON.parse(localStorage.getItem("palettes"));
        let index= e.target.classList[1];
        for( let i=0; i < paletteObject.length; i++){
            console.log(paletteObject[i].nr == index);
            if(paletteObject[i].nr == index){
                paletteObject.splice(i,1);
            }
        }
        const palette = e.target.parentElement;
        palette.remove();
        localStorage.clear();
        localStorage.setItem("palettes",JSON.stringify(paletteObject));
        return paletteObject; 
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
            generatePalette(paletteObj);
            });
            
            const selectButton = document.querySelectorAll(".pick-palette-button");
            if (selectButton){
               selectButton.forEach(select=>{
                   select.addEventListener("click", e => {
                       selectPalette(e);
                   });
               });
            }
           
            const deleteButton = document.querySelectorAll(".delete-palette-button");
            if (deleteButton){
               deleteButton.forEach((deleteB,paletteObj) => {
                   deleteB.addEventListener("click", (e,paletteObj) => {
                       
                       deletePalette(e);
                   });
               });
            }
        }
}

getLocal();

            
       
        