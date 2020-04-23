//Data board
var boardData = [
   -1, 1, -1, -1, -1, -1, -1, 9, -1,
   -1, -1, 4, -1, -1, -1, 2, -1, -1,
   -1, -1, 8, -1, -1, 5, -1, -1, -1,
   -1, -1, -1, -1, -1, -1, -1, 3, -1,
   2, -1, -1, -1, 4, -1, 1, -1, -1,
   -1, -1, -1, -1, -1, -1, -1, -1, -1,
   -1, -1, 1, 8, -1, -1, 6, -1, -1,
   -1, 3, -1, -1, -1, -1, -1, 8, -1,
   -1, -1, 6, -1, -1, -1, -1, -1, -1
];

//Global varibale for clickable events
var globalVariable = null;
var active = null;
var recent = [];
var recentHTML = [];
var errors = false;

//Creates the board
function createBoard() {
    //Defining Variables
    var i,j;
    var board = document.getElementById('board');
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
    //Creates and adds a node after tableBody
    table.appendChild(tableBody);

    //Creates 9 by 9 rows of buttons
    for (i = 0; i < 9; i++) {
        //Table row
        var tr = document.createElement('tr');
        tr.setAttribute('id', i);
        //Button
        var button = document.createElement('button');
        //Creates and adds a node after table row
        tableBody.appendChild(tr);

        //Triggers the 9 by 9 rows for data
        for (j = 0; j < 9; j++) {
            //Table data
            var td = document.createElement('TD');
            td.setAttribute("id", j);
            //Collects the board data
            if (boardData[boardPosition(i, j)] == '-1') {
                //Sets -1 as empty box
                td.setAttribute("id", j);
                td.appendChild(document.createTextNode(' '));
            } else {
                //Others are the number provided
                td.setAttribute("id", "perm");
                td.appendChild(document.createTextNode(boardData[boardPosition(i, j)]));
            }
            //Creates and adds a node after table data
            tr.appendChild(td);
            if (j % 3 == 0) {
                td.classList.add("border_right");
            }
            if (i % 3 == 0) {
                td.classList.add("border_down");
            }
        }
    }
    //Creates and adds a node after the table
    board.appendChild(table);
    //Checks if there is an active value and then assigns the selected cell to that value
    $('td').click(function() {
        //If there is no value
        if(!active){
            //Tells you a select a number from the palette
            window.alert("Please select a number");
        }
        //If there is a fixed value assigned to a box
        if(this.getAttribute('id') == "perm"){
            //Tells you that the number cannot be edited and clears the palette background colour
            window.alert("This Number cannot be edited.");
            active.style.backgroundColor = "#ffffff";
            active = null;
        }
        //Or it stores the most recent move made and clears the palette background colour
        else{
            recent.push(this);
            recentHTML.push(this.innerHTML);
            this.innerHTML = active.innerHTML;
            //console.log(this.closest('tr').getAttribute('id'));
            checkErrors(this);
            active.style.backgroundColor = "#ffffff";
            active = null;
        }
    })
    //Creates the palette
    create_Palette();
}

//Performs task
window.onload = createBoard;

//Creates the palette
function create_Palette() {
    //Gets the palette
    var palette = document.getElementById('palette');
    //Sets the palette values 1 to 9
    for (var i = 1; i < 10; i++) {
        //Gets the list
        var list = document.createElement('list');
        //Creates and adds a node after the list
        palette.appendChild(list);
        //Adds 1 to each box to add up to 9
        list.innerHTML = list.innerHTML + [i];
    }
    //Gets and sets the undo image from the folder into a button
    var img = document.createElement("img");
    img.src = "images/undo.png";
    //Places it on the palette
    palette.appendChild(img);
    //If any value in the list is selected it makes that value active
    $('list').click(function() {
        // window.alert("Choose the box to input the number");
        //This sets the background of the active palette
        //If there is one already selected it sets it to white and then changes the background of the new one selected
        if(!active){
            active = this;
            this.style.backgroundColor = "#f5dd90";
        }
        else{
            active.style.backgroundColor = "#ffffff";
            active = this;
            this.style.backgroundColor = "#f5dd90";
        }
    });
    //The undo function
    $('img').click(function(){

        //This clears all the errors on the table
        if(errors){
            recent[recent.length-1].classList.remove('error');
            var errs = document.getElementsByClassName('error');
            for (var i = 0; i < errs.length; i++) {
                errs[i].classList.remove('error');
            }
        }
        //This undo's the most recent move on the table
        if(recent.length != 0){
            recent[recent.length-1].innerHTML = recentHTML[recentHTML.length-1];
            recent.pop();
            recentHTML.pop();
        }
        //Can't undo any further on the table
        else{
            window.alert("Cannot Undo anymore!");
        }
    });
}

//Function to check for error
function checkErrors(cell){
    var rows =document.getElementsByTagName("tbody")[0].rows;
    for(var i =0; i<9; i++){
        //Checks for the rows
        if(i!=parseInt(cell.getAttribute('id'),10)){
            var td = rows[cell.closest('tr').getAttribute('id')].getElementsByTagName("td")[i];
            //If there is a same number in the row it gives an error
            if(td.innerHTML == cell.innerHTML){
                td.classList.add('class','error');
                cell.classList.add('class','error');
                errors = true;
            }
        }
        //Checks the columns
        //If there is a same number in the column it gives an error
        if(i!=parseInt(cell.closest('tr').getAttribute('id'),10)){
            var td = rows[i].getElementsByTagName("td")[cell.getAttribute('id')];
            if(td.innerHTML == cell.innerHTML){
                td.classList.add('class','error');
                cell.classList.add('class','error');
                errors = true;
            }
        }

    }

    //Checks the block 3 by 3
    let firstRow = Math.floor(parseInt(cell.closest('tr').getAttribute('id'),10) / 3) * 3;
    let firstCol = Math.floor(parseInt(cell.getAttribute('id'),10) / 3) * 3;
    for(var j =firstRow; j<firstRow+3; j++){
        for(var i =firstCol; i<firstCol+3; i++){
            //If it has the same number in the 3 by 3 block it gives an error
            if(i != parseInt(cell.getAttribute('id'),10) && j != parseInt(cell.closest('tr').getAttribute('id'),10)){
                var td = rows[j].getElementsByTagName("td")[i];
                if(td.innerHTML == cell.innerHTML){
                    td.classList.add('class','error');
                    cell.classList.add('class','error');
                    errors = true;
                }

            }
        }
    }

}

//Checks for board position
function boardPosition(x, y) {
    return y * 9 + x;
}

//Checks for the same block
function sameBlock(x1, y1, x2, y2) {
    let firstRow = Math.floor(y1 / 3) * 3;
    let firstCol = Math.floor(x1 / 3) * 3;
    return (y2 >= firstRow && y2 <= (firstRow + 2) && x2 >= firstCol && x2 <= (firstCol + 2));
}

//Checks for the same row
function sameRow(x1, y1, x2, y2) {
    return y1 == y2;
}

//Checks for the same column
function sameColumn(x1, y1, x2, y2) {
    return x1 == x2;
}

//Checks if it overlaps
function overlaps(x1, y1, x2, y2) {
    return sameBlock(x1, y1, x2, y2) || sameRow(x1, y1, x2, y2) || sameColumn(x1, y1, x2, y2);
}
