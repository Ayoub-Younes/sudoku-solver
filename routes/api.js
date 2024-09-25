'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //Vars
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      

      //Check
      if(!puzzle || !coordinate || !value){
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      if(!solver.validateChar(puzzle)){
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }
      if(!solver.validateLen(puzzle)){
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }
      if(!solver.validateCrd(coordinate)){
        res.json({ error: 'Invalid coordinate'});
        return;
      };
      if(!solver.validateVal(value)){
        res.json({ error: 'Invalid value'});
        return;
      };

      //Vars
      let [row,col]= coordinate.split("");
      row= row.toUpperCase()
      let position = solver.position(row,col);
      puzzle = puzzle.split('');
      puzzle[position] = '.';
      puzzle = puzzle.join('');
      let conflict = [];
      
      //Check
      if(!solver.checkRowPlacement(puzzle, row, value)){conflict.push("row")};
      if(!solver.checkColPlacement(puzzle, col, value)){conflict.push("column")};
      if(!solver.checkRegionPlacement(puzzle, row, col, value)){conflict.push("region")};
      if(conflict.length == 0){res.json({ valid: true })}
      else{res.json({ valid: false, conflict:  conflict})}
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle

      if(!puzzle){
        res.json({ error: 'Required field missing' });
        return;
      }
      if(!solver.validateChar(puzzle)){
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }
      if(!solver.validateLen(puzzle)){
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }
      if(!solver.solve(puzzle)){
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }
        res.json({solution:solver.solve(puzzle)});
      
    });
};
