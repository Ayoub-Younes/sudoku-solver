class SudokuSolver {

// VALIDITY
  validateLen(puzzleString) {
    return puzzleString.length != 81? false: true;
  }

  validateChar(puzzleString) {
    let regex = /[^1-9.]/
    return regex.test(puzzleString)? false :true;
  }
  
  validateCrd(crd) {
    let [row ,col] = [crd.substring(0,1).toUpperCase(),crd.substring(1)]
    let rows = ["A","B","C","D","E","F","G","H","I"];
    let regex = /[^1-9]/
    let rIndex = rows.indexOf(row);
    return (rIndex == -1 || regex.test(col) || crd.length != 2)? false: true;
  }

  validateVal(val) {
    let regex = /[^1-9]/
    return (regex.test(val) || val.length != 1)? false: true;
  }

//CHECKING
  position(row,col){
    let rows = ["A","B","C","D","E","F","G","H","I"];
    let rIndex = rows.indexOf(row);
    let cIndex = col-1;
    return rIndex*9 + cIndex;
  }
  rowString(puzzleString, row){
    let rows = ["A","B","C","D","E","F","G","H","I"];
    let rIndex = rows.indexOf(row);
    let rowString = puzzleString.slice(9*rIndex,9*(rIndex+1))
    return rowString
  }

  colString(puzzleString, column){
    let cIndex = column-1
    let colString = ""
    for (let i = 0; i < puzzleString.length; i++){
      if(i%9 == cIndex) {
        colString += puzzleString[i]
      }
    }
    return colString
  }

  checkRowPlacement(puzzleString, row, value) {
    let rowString = this.rowString(puzzleString, row)
    let regex = new RegExp(`${value}`)
    return regex.test(rowString)? false: true;
  }

  checkColPlacement(puzzleString, column, value) {
  let colString = this.colString(puzzleString, column);
  let regex = new RegExp(`${value}`)

  return regex.test(colString)? false: true;
  }
  checkRegionPlacement(puzzleString, row, column, value) {
    let divCol = Math.floor((column-1)/3);
    let colStrings = [this.colString(puzzleString, (divCol*3)+1), this.colString(puzzleString, ((divCol*3)+2)), this.colString(puzzleString, (divCol*3)+3)]
    let rows = ["A","B","C","D","E","F","G","H","I"];
    let rIndex = rows.indexOf(row);
    let divRow = Math.floor((rIndex)/3);
    let regString = colStrings.map(str => str.slice(3*divRow,3*(divRow+1))).join("");
    let regex = new RegExp(`${value}`)
    return regex .test(regString)? false: true;
  }
  

//SOLVING
  solve(puzzleString) {
   let solStr = puzzleString;
   let solArr = []
   for(let i=0 ; i < 81; i++){
    solArr.push(puzzleString[i])
    solArr = solArr.map(char => {
      return char == "."? "123456789": char})
   }
   let rows = ["A","B","C","D","E","F","G","H","I"]
   let reg = /^\d$/
   let solveRow =(row => {
    for(let col=1 ; col <= 9; col++){
      let index = col-1 + row*9
      if(!reg.test(solArr[index])){ 
         for(let n=1 ; n <= 9; n++){
          if(!this.checkRowPlacement(solStr, rows[row], n) || !this.checkColPlacement(solStr, col, n) || !this.checkRegionPlacement(solStr, rows[row],col, n)){
            solArr[index]= solArr[index].replace(n,"");
          }
         }
      }
     }
   })
   for(let i=0 ; i < 9; i++){solveRow(i)}
   for(let i=0 ; i < 81; i++){
    solArr = solArr.map(char => {
      return !reg.test(char)? '.' : char})
   }
    solStr = solArr .join("")
    if(/\./.test(solStr)){
      try{solStr = this.solve(solStr);}
      catch (err){return false}
    }
    let solChecker = (sol) => {
      if (sol){let result = true;
        for(let i=0 ; i < 81; i++){
          let str = sol;
          str = str.split('');
          str[i] = '.';
          str = str.join('');
          let row = rows[Math.floor(i/9)];
          let col = (i%9 + 1);
          let n = sol[i]
          if (!this.checkRowPlacement(str, row, n) || !this.checkColPlacement(str, col, n) || !this.checkRegionPlacement(str, row, col, n)){
            result = false
          }
        }
        return result}
    }
    if(!solChecker(solStr)){ return false};
    return solStr
  }
}

module.exports = SudokuSolver;
const Sudoku = new SudokuSolver()
let puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.6"
let rows = ["A","B","C","D","E","F","G","H","I"]
//console.log(Sudoku.colString(".5..1.2....85...1.....3...8.....2....7...6.3.1...7.9..7.....5..4......6.3..8...47",7));
//console.log(Sudoku.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",1,8))
//console.log(Sudoku.checkRegionPlacement(".5..1.2....85...1.....3...8.....2....7...6.3.1...7.9..7.....5..4......6.3..8...47","D",7,1))
//console.log(Sudoku.validateCrd("A10"));
//console.log(Sudoku.validateVal("9"));
//console.log(Sudoku.solve(puzzleString));
console.log(Sudoku.position("C3"))



