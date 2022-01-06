const mysql = require('mysql2');
const fs = require('fs');

// establish db connection
const con = mysql.createConnection({
  host: "ise-mysql",
  user: "ise-editor",
  password: "ise-password",
  database: "card-game"
});


exports.isDbReady = function() {
  let success;
  con.connect(function(err) {
    if (err) {     
      success = false;
      return false;
    }
    success = true;
    return true;
  });
  
  return success;
}

exports.populateDb = function() {
  // insert users
  fs.readFile('./data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file. ${err}`);
      return;
    }

    const users = JSON.parse(data);
    for (const user in users) {
      console.log(users[user]);
      // use the ? notation to escape the values. Prevents sql injection.
      con.query('INSERT INTO User VALUES (?, ?, ?, ?)', [users[user]["username"], users[user]["password"], users[user]["email"], users[user]["birthday"]]);

//      con.query(`INSERT INTO User VALUES ("${}", "${}", "${}", "${}")`);
    }
  });
}