const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new (Solver)
let string = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
suite('Unit Tests', () => {
 // #1
 test('Logic handles a valid puzzle string of 81 characters', function(){
    assert.isTrue(solver.validateLen(string));
    assert.isTrue(solver.validateChar(string));
   })
// #2
test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(){
    let string2 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.x'
    assert.isFalse(solver.validateChar(string2));
   })
// #3
test('Logic handles a puzzle string that is not 81 characters in length', function(){
    assert.isFalse(solver.validateLen(string +"."));
   })
// #4
test('Logic handles a valid row placement', function(){
    assert.isTrue(solver.checkRowPlacement(string,"A",2));
   })
// #5
test('Logic handles an invalid row placement', function(){
    assert.isFalse(solver.checkRowPlacement(string,"A",1));
   })
// #6
test('Logic handles a valid column placement', function(){
    assert.isTrue(solver.checkColPlacement(string,1,2));
   })
// #7
test('Logic handles an invalid column placement', function(){
    assert.isFalse(solver.checkColPlacement(string,1,1));
   })
// #8
test('Logic handles a valid region (3x3 grid) placement', function(){
    assert.isTrue(solver.checkRegionPlacement(string,"A",1,1));
   })
// #9
test('Logic handles an invalid region (3x3 grid) placement', function(){
    assert.isFalse(solver.checkRegionPlacement(string,"A",1,5));
   })
// #10
test('Valid puzzle strings pass the solver', function(){
    assert.isNotFalse(solver.solve(string));
   })
// #11
test('Invalid puzzle strings fail the solver', function(){
   let string3 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.7'
   assert.isFalse(solver.solve(string3));
  })
// #12
test('Solver returns the expected solution for an incomplete puzzle', function(){
   assert.equal(solver.solve(string),'769235418851496372432178956174569283395842761628713549283657194516924837947381625');
  })
});
