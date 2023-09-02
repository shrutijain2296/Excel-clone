// table properties
const theadRow = document.getElementById("table-heading-row");
const tbody = document.getElementById("table-body");
const columns = 26;
const rows = 100;


// button-styles
const boldBtn = document.getElementById("bold-btn");
const italicsBtn = document.getElementById("italics-btn");
const underlineBtn = document.getElementById("underline-btn");

// text-alignment
const leftAlign = document.getElementById("left-align");
const centerAlign = document.getElementById("center-align");
const rightAlign = document.getElementById("right-align");

// font-size
const fontSizeDropdown = document.getElementById("font-size");
// font-style
const fontStyleDropdown =  document.getElementById("font-style");

// copy cut paste
const copyBtn = document.getElementById("copy-btn");
const cutBtn = document.getElementById("cut-btn");
const pasteBtn = document.getElementById("paste-btn");


// Color input
const bgColorInput = document.getElementById("bg-color");
const textColorInput = document.getElementById("text-color");
const uploadJsonFile = document.getElementById("jsonFile");

// add sheet button
const addSheetBtn = document.getElementById("add-sheet-btn");
const sheetNumHeading = document.getElementById("sheet-num");

// Clipboard
let currentCell;
let cutCell = {};
let copiedText = "";

// forming outer array
let matrix = new Array(rows);
for(let row = 0; row < rows; row++){
    // adding inner arrays
    matrix[row] = new Array(columns);
    for(let col = 0; col < columns; col++){
        // fixing inner arrays to empty objects
        matrix[row][col] = {};
    }
}

// things related to multiple sheets
let numSheets = 1;  //number of sheets
let currentSheetNum = 1;  //current sheet

// -> [
  // [], // this is my 0th row -> it's storing cols
  // []
// ]

// updateMatrix will take currentCell
function updateMatrix(currentCell){
    let obj = {
        style: currentCell.style.cssText,
        text: currentCell.innerText,
        id : currentCell.id
    }
    // id -> A1, B1, C1
    let id = currentCell.id.split('');
    let i = id[1]-1; //1,2,3,4 // 0,1,2,3
    let j = id[0].charCodeAt(0)-65;  //A,B,C,D  //65,66,67,68 // 0,1,2,3
    matrix[i][j] = obj;

} 

// A B C D -----------------Z
for(let col = 0; col < columns; col++){
    let th = document.createElement("th");
    th.innerText = String.fromCharCode(col+65);
    theadRow.append(th);
}


// 1 2 3 4 5 -----------------100  (100*26)
for(let row = 1; row <= rows; row++){
    // created tr
    let tr = document.createElement("tr");
    // created cell for storing 1, 2, 3-----100
    let th = document.createElement("th");
    th.innerText = row;
    // appending th inside tr
    tr.append(th);
    // looping through a-z to get empty cells 100*26
    for(let col = 0; col < columns; col++){
        let td = document.createElement("td");

        // making cells editable
        td.setAttribute("contenteditable", "true");
        td.setAttribute('id', `${String.fromCharCode(col+65)}${row}`)
        td.addEventListener('input', (event) => onInputFn(event));
        // this event listener will triger when any cell comes in focus;
        td.addEventListener('focus', (event) =>onfocus(event));  
        tr.append(td);
    }
    // appending tr inside tbody
    tbody.append(tr);
}

function onInputFn(event){
    updateMatrix(event.target);
}

// BOLD-BUTTON
boldBtn.addEventListener('click', () =>{
    if(currentCell.style.fontWeight === 'bold'){
        currentCell.style.fontWeight = 'normal';
    }
    else currentCell.style.fontWeight = 'bold';
    updateMatrix(currentCell);
    
})
// ITALICS-BUTTON
italicsBtn.addEventListener('click', () =>{
    if(currentCell.style.fontStyle === 'italic'){
        currentCell.style.fontStyle = 'normal';
    }
    else currentCell.style.fontStyle = 'italic';
    updateMatrix(currentCell);
})
// UNDERLINE_BUTTON
underlineBtn.addEventListener('click', () =>{
    if(currentCell.style.textDecoration === 'underline'){
        currentCell.style.textDecoration = 'none';
    }
    else currentCell.style.textDecoration = 'underline';
    updateMatrix(currentCell);
})

//LEFT-ALIGN
leftAlign.addEventListener('click', () =>{
    currentCell.style.textAlign = "left";
    updateMatrix(currentCell);
})
// CENTER-ALIGN
centerAlign.addEventListener('click', () =>{
    currentCell.style.textAlign = "center";
    updateMatrix(currentCell);
})
// RIGHT-ALIGN
rightAlign.addEventListener('click', () =>{
    currentCell.style.textAlign = "right";
    updateMatrix(currentCell);
}) 

// FONT-SIZE
fontSizeDropdown.addEventListener('change', () =>{
    currentCell.style.fontSize = fontSizeDropdown.value;
    updateMatrix(currentCell);
})
// FONT_STYLE
fontStyleDropdown.addEventListener('change', () =>{
    currentCell.style.fontFamily = fontStyleDropdown.value;
    updateMatrix(currentCell);
})

// COPY CUT PASTE
cutBtn.addEventListener('click', () =>{
    // cutCell = {
    //     style: currentCell.style.cssText,
    //     text : currentCell.innerText
    // };
    // currentCell.innerText = "";
    // currentCell.style = null;
    // updateMatrix(currentCell);  //O(1)
    copiedText = currentCell.innerText;
    currentCell.innerText = "";
    currentCell.style.cssText = "";
    updateMatrix(currentCell);
})
copyBtn.addEventListener('click', () =>{
    // cutCell = {
    //     style: currentCell.style.cssText,
    //     text : currentCell.innerText
    // };

    copiedText = currentCell.innerText;
})
pasteBtn.addEventListener('click', () =>{
    // if(cutCell.text){
    //     currentCell.innerText = cutCell.text;
    //     currentCell.style = cutCell.style;
    //     updateMatrix(currentCell);
    //     cutCell = null;
        
    // }
    if (copiedText) {
        currentCell.innerText += copiedText; // Append the copied text
        updateMatrix(currentCell);
    }
  
})

// BACKGROUND-COLOR
bgColorInput.addEventListener('input', () =>{
    currentCell.style.backgroundColor = bgColorInput.value;
    updateMatrix(currentCell);
})

// TEXT-COLOR
textColorInput.addEventListener('input', () =>{
    currentCell.style.color = textColorInput.value;
    updateMatrix(currentCell);
})

// function trigger when we focus on any td
function onfocus(value){
    currentCell = value.target;
    document.getElementById('current-cell').innerText = currentCell.id;
}

// download the entire file
function downloadJson(){
    // converting this matrix to string
    const matrixString = JSON.stringify(matrix);

    // converting text form of matrix to downloadable form (blob is a built in method)
    const blob = new Blob([matrixString],{type: 'application/json'});
    // creating link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    // naming the file which will be downloaded;
    link.download = 'data.json';  //// data.json is name of file
    // I add this link in my DOM to make it clickable
    document.body.appendChild(link);
    link.click();
      // remove link
    document.body.removeChild(link)

}

uploadJsonFile.addEventListener('change', readJSONfileFn);
// uploading files in the form of array files = [files]
function readJSONfileFn(event){
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e){
        // reader has read the file and converted it into
        // code
        // fileContent is in string
        const fileContent = e.target.result;
        try{
          const fileContentJSON = JSON.parse(fileContent);
          matrix=fileContentJSON;
  
          // iterating over matrix and saving it in my html table
          fileContentJSON.forEach((row)=>{
            row.forEach((cell)=>{
              // cell is reflection object of my currentCell
              // in matrix
              if(cell.id){
                // respecting currentCell of cell 
                // in html or table
                var currentCell = document.getElementById(cell.id);
                currentCell.innerText=cell.text;
                currentCell.style.cssText=cell.style;
              }
            })
          })
        }
        catch(err){
          console.log('error in reading json file',err);
        }
      };
    }
  }


addSheetBtn.addEventListener('click', () =>{

    // we need to handle matrix of my previous sheet
    // befor clearing, we are saving
    if(numSheets === 1){
        var tempArr = [matrix];  //virtual memory of my matrix
        localStorage.setItem('arrMatrix', JSON.stringify(tempArr));
    }
    else{
        // get my previous array
        var previousSheetArray = JSON.parse(localStorage.getItem('arrMatrix'));
        // previousSheetArr = [matrix1, matrix2, matrix3]
        var updatedArr = [...previousSheetArray, matrix];
        localStorage.setItem('arrMatrix', JSON.stringify(updatedArr));
    }
    // update variable related to my sheet
    numSheets++;
    currentSheetNum = numSheets;

    // cleanup my virtual memory
    for(let row = 0; row < rows; row++){
        matrix[row] = new Array(columns);
        for(let col = 0; col < columns; col++){
            matrix[row][col] = {};
        }
    }

    // cleanup table body(it will be none for new sheet)
    tbody.innerHTML = ``;

    // cleaning up table(cleaning up and making new things are same)
    // 1 2 3 4 5 -----------------100  (100*26)
    for(let row = 1; row <= rows; row++){
        // created tr
        let tr = document.createElement("tr");
        // created cell for storing 1, 2, 3-----100
        let th = document.createElement("th");
        th.innerText = row;
        // appending th inside tr
        tr.append(th);
        // looping through a-z to get empty cells 100*26
        for(let col = 0; col < columns; col++){
            let td = document.createElement("td");

            // making cells editable
            td.setAttribute("contenteditable", "true");
            td.setAttribute('id', `${String.fromCharCode(col+65)}${row}`)
            td.addEventListener('input', (event) => onInputFn(event));
            // this event listener will triger when any cell comes in focus;
            td.addEventListener('focus', (event) =>onfocus(event));  
            tr.append(td);
        }
        // appending tr inside tbody
        tbody.append(tr);
    }
    sheetNumHeading.innerText = "Sheet No. " + currentSheetNum;

})
  



// matrix is representing virtual memory of my currentTable
// Row * Col
// 101 * 27

// whole table copy -> array of object
// [
  // {},{},
  // {},{},
  // {},{},
// ]
// A2 -> 1,0
// 1*(number of cols) + 0 -> 2
// row -> 1st -> 1*2 + 0th -> 2 // here 0th means colNumber
// Col -> 0th

// B3 -> row -> 2nd, col-> 1
// rowIndex*(number of cols)+colindex
// 2*2+1 ->5

// whole table copy -> array of arrays of objects

// [ -> outer array -> storing rows
  // [{},{},{}], -> inner array -> storing cols
  // [{},{},{}],
  // [{},{},{}],
  // [{},{},{}],
// ]
// 2dMatrix[1][0]
// 2dMatrix[row][col]
// rows-> number of arrays inside my main array


// There are 2 ways of cloning my table

// 1st we iterate over whole table and copy every cell
// 2nd when we are editing any cell, we update that respective cell in 2d matrix

  // [
  //  [{},{},{}],
  //  [{},{},{}],
  //  [{},{},{}],
  // ]

// user invokes download function
  // row * col
  // [
  //    [{},{},{}],
  //    [{},{},{}],
  //    [{},{},{}],
  // ]

// number of cells edited
  // [
  //  [{},{},{}],
  //  [{},{},{}],
  //  [{},{},{}],
  // ]

  // A1 -> row -> 1 -1
  // A -> 0

  // matrix[(row-1)(letter to number -65)]

 