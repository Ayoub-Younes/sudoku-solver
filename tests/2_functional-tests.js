const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let string = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
suite('Functional Tests', () => {
 suite('POST request to /api/solve, tests', () => {
  
  //1
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .send({puzzle: string})
    .end((err,res)=>{
     assert.equal(res.status, 200);
     assert.equal(res.type, "application/json");
     assert.deepEqual(JSON.parse(res.text), {solution: '769235418851496372432178956174569283395842761628713549283657194516924837947381625'});
     done();
    })
  })
  
  //2
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .end((err,res)=>{
     assert.equal(res.status, 200);
     assert.equal(res.type, "application/json");
     assert.deepEqual(JSON.parse(res.text), { error: 'Required field missing' });
     done();
    })
  })

  //3
  test('Solve a puzzle with invalid characters: POST request to /api/solve',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.x'})
    .end((err,res)=>{
     assert.equal(res.status, 200);
     assert.equal(res.type, "application/json");
     assert.deepEqual(JSON.parse(res.text), { error: 'Invalid characters in puzzle' });
     done();
    })
  })

   //4
   test('Solve a puzzle with incorrect length: POST request to /api/solve',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...'})
    .end((err,res)=>{
     assert.equal(res.status, 200);
     assert.equal(res.type, "application/json");
     assert.deepEqual(JSON.parse(res.text), { error: 'Expected puzzle to be 81 characters long' });
     done();
    })
  })

  //5
  test('Solve a puzzle that cannot be solved: POST request to /api/solve',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.9'})
    .end((err,res)=>{
     assert.equal(res.status, 200);
     assert.equal(res.type, "application/json");
     assert.deepEqual(JSON.parse(res.text), { error: 'Puzzle cannot be solved' });
     done();
    })
  })
 });

 suite('POST request to /api/check, test', ()=>{
  
  //1
  test('Check a puzzle placement with all fields: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:string, coordinate:"A1", value:'7'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.deepEqual(JSON.parse(res.text), { valid: true });
    done();
    })
  })

  //2
  test('Check a puzzle placement with single placement conflict: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:string, coordinate:"A1", value:'2'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(JSON.parse(res.text).conflict.length, 1);
    done();
    })
  })

  //3
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:string, coordinate:"A1", value:'1'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.isAtLeast(JSON.parse(res.text).conflict.length, 2);
    done();
    })
  })

  //4
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:string, coordinate:"A1", value:'5'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.deepEqual(JSON.parse(res.text), { valid: false, conflict: [ "row", "column", "region" ] });
    done();
    })
  })

  //5
  test('Check a puzzle placement with missing required fields: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({coordinate:"A1", value:'7'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.deepEqual(JSON.parse(res.text), { error: 'Required field(s) missing' });
    done();
    })
  })

  //6
  test('Check a puzzle placement with invalid characters: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.x", coordinate:"A1", value:'7'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.deepEqual(JSON.parse(res.text), { error: 'Invalid characters in puzzle' });
    done();
    })
  })

  //7
  test('Check a puzzle placement with incorrect length: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...", coordinate:"A1", value:'7'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.deepEqual(JSON.parse(res.text), { error: 'Expected puzzle to be 81 characters long' });
    done();
    })
  })

  //8
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:string, coordinate:"A11", value:'5'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.deepEqual(JSON.parse(res.text), { error: 'Invalid coordinate'});
    done();
    })
  })

  //9
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check',(done)=>{
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle:string, coordinate:"A1", value:'10'})
    .end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.deepEqual(JSON.parse(res.text), { error: 'Invalid value'});
    done();
    })
  })
 });
});

