var sqlite3 = require('sqlite3').verbose();
const dbpath = 'shopdb.db';
//const dbpath = '../models/shopdb.db';
var db = new sqlite3.Database(dbpath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.log(err);
        }
    });

//new sqlite3.Database(dbpath);


const dbinit = (req, res) => {
    console.log('dbinit');

    // const sql_create = `CREATE TABLE IF NOT EXISTS Books (
    //     Book_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    //     Title VARCHAR(100) NOT NULL,
    //     Author VARCHAR(100) NOT NULL,
    //     Comments TEXT
    //   );`;

    //   db.run(sql_create, err => {
    //     if (err) {
    //       return console.log(err.message);
    //     } else {
    //         console.log("Successful creation of the 'Books' table");
    //     }
    //   });



    let createsql = 'CREATE TABLE IF NOT EXISTS shoptb (';
    createsql += 'id INTEGER PRIMARY KEY AUTOINCREMENT,';
    createsql += 'shopname VARCHAR(128) NOT NULL,';
    createsql += 'brokeremail VARCHAR(128) NOT NULL UNIQUE,';
    createsql += 'phoneno VARCHAR(128),';
    createsql += 'email VARCHAR(128) NOT NULL,';
    createsql += 'addr VARCHAR(256),';
    createsql += 'vip VARCHAR(128),';
    createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP)';
    //console.log(createsql);
    db.serialize(() => {
        // 1rst operation (run create table statement)
        db.run(createsql, (err) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: err, data: '' });
            } else {
                console.log('shoptb is existed');
                // res.status(200)
                // .json({message:'',data:''});
            }
        });
    });



    createsql = 'CREATE TABLE IF NOT EXISTS shopext (';
    createsql += 'id INTEGER NOT NULL UNIQUE,';
    createsql += 'shopid INTEGER NOT NULL UNIQUE,';
    createsql += 'paytype text NOT NULL,';
    createsql += 'payid INTEGER NOT NULL,';
    createsql += 'actiondate DATETIME  NOT NULL,';
    createsql += 'paiddate DATETIME,';
    createsql += 'duedate DATETIME,';
    createsql += 'descript text)';
    db.serialize(() => {
        db.run(createsql, (err) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: err, data: '' });
            } else {
                console.log('shopext is existed');
            }
        });
    });

    createsql = 'CREATE TABLE IF NOT EXISTS paytb (';
    createsql += 'id INTEGER NOT NULL UNIQUE,';
    createsql += 'shopid INTEGER NOT NULL UNIQUE,';
    createsql += 'useremail text NOT NULL,';
    createsql += 'amount INTEGER NOT NULL,';
    createsql += 'paytype text NOT NULL,';
    createsql += 'discount INTEGER NOT NULL,';
    createsql += 'paymethod text NOT NULL,';
    createsql += 'actiondate DATETIME  NOT NULL,';
    createsql += 'duedate DATETIME  NOT NULL,';
    createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)';
    db.serialize(() => {
        db.run(createsql, (err) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: err, data: '' });
            } else {
                console.log('paytb is existed');
            }
        });
    });

    createsql = '';
    createsql = 'CREATE TABLE IF NOT EXISTS usertb (';
    createsql += 'id INTEGER PRIMARY KEY AUTOINCREMENT,';
    createsql += 'name text NOT NULL,';
    createsql += 'password text NOT NULL,';
    createsql += 'phoneno text NOT NULL,';
    createsql += 'email text NOT NULL UNIQUE,';
    createsql += 'gender INTEGER NOT NULL,';
    createsql += 'role text NOT NULL,';//1.admin, 2.shophost, 3.client
    createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)';
    db.serialize(() => {
        db.run(createsql, (err) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: err, data: '' });
            } else {
                console.log('usertb is existed');
            }
        });
    });

    //店與用戶的關聯檔
    createsql = '';
    createsql = 'CREATE TABLE IF NOT EXISTS shopusertb (';
    createsql += 'shopid INTEGER NOT NULL,';
    createsql += 'userid INTEGER NOT NULL,';
    createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)';
    db.serialize(() => {
        db.run(createsql, (err) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: err, data: '' });
            } else {
                console.log('shopusertb is existed');
            }
        });
    });

    createsql = '';
    createsql = 'CREATE TABLE IF NOT EXISTS resevedlist (';
    createsql += 'id INTEGER PRIMARY KEY AUTOINCREMENT,';
    createsql += 'shopid INTEGER NOT NULL,';
    createsql += 'status INTEGER DEFAULT 0 NOT NULL,';// 0:表示未完成，1:表示完成, 2:過號未完成, 3:過號完成  
    createsql += 'reserveday text NOT NULL,';  //20220812 
    createsql += 'update_at text NOT NULL,';
    createsql += 'email text NOT NULL UNIQUE,';
    createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)';
    db.serialize(() => {
        db.run(createsql, (err) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: err, data: '' });
            } else {
                console.log('resevedlist is existed');
            }
        });
    });
    //預插入系統管理者
    const sql = 'SELECT * from usertb where email = ?';
    db.serialize(() => {
        db.get(sql, ['martinfb168@gmail.com'], (err, rows) => {
            if (err) {
                console.log(err);
            } else if (rows) {
                console.log(rows);
                console.log('admin existed.');
                res.status(200).json({ message: '', data: '' });
            } else {
                const tabName = 'usertb';
                const colList = ['name', 'password', 'phoneno', 'email', 'gender', 'role',];
                const valList = ['Martin', 'shop888', '0933866241', 'martinfb168@gmail.com', '1', 'admin'];
                insertrow(tabName, colList, valList, res, 6);
            }
        });
    });
}

const getuserbymail = (mail) => {
    let ret = false;
    const sql = 'SELECT * from usertb where email = ?';
    db.serialize(() => {
        db.get(sql, [mail], (err, rows) => {
            if (err) {
                console.log(err);
                return ret;
            } else if (rows) {
                console.log(rows);
                console.log('admin existed.');
                ret = true;
                return ret;
            }
        });
    });
}

const insertrow = (tabName, colList, valList, res, colCount) => {
    console.log(colCount);
    let colStr = '(';
    let qmStr = '(';
    for (let i = 0; i < colCount; i++) {
        if (i === colCount - 1) {
            colStr += colList[i] + ')';
            qmStr += '?)';
        } else {
            colStr += colList[i] + ',';
            qmStr += '?,';
        }
    }
    const sqlStr = `insert into ${tabName}${colStr} values${qmStr}`;
    console.log(sqlStr);
    //res.status(200).json({ message: '', data: '' });
    db.serialize(() => {
        db.run(sqlStr, valList, (err) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: err, data: '' });
            } else {
                console.log(`A row inserted to ${tabName}`);
                res.status(200).json({ message: '', data: '' });
            }
        });
    });
}

//db.close();

module.exports = {
    dbinit
};    