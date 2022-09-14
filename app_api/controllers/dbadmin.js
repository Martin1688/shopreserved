var sqlite3 = require('sqlite3').verbose();
const dbpath = '../models/shopdb.db';
var db = new sqlite3.Database(dbpath);


const dbinit = () => {
    let createsql = 'CREATE TABLE IF NOT EXISTS shoptb (';
    createsql += 'id INTEGER PRIMARY KEY AUTOINCREMENT,';
    createsql += 'shopname text NOT NULL UNIQUE,';
    createsql += 'brokeremail text NOT NULL,';
    createsql += 'phoneno text,';
    createsql += 'email text NOT NULL,';
    createsql += 'addr text,';
    createsql += 'vip text,';
    createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)';
    db.run(createsql);

    createsql = 'CREATE TABLE IF NOT EXISTS shopext (';
    createsql += 'id INTEGER NOT NULL UNIQUE,';
    createsql += 'shopid INTEGER NOT NULL UNIQUE,';
    createsql += 'paytype text NOT NULL,';
    createsql += 'payid INTEGER NOT NULL,';
    createsql += 'actiondate DATETIME  NOT NULL,';
    createsql += 'paiddate DATETIME,';
    createsql += 'duedate DATETIME,';
    createsql += 'descript text)';
    db.run(createsql);

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
    db.run(createsql);

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
    db.run(createsql);

    //店與用戶的關聯檔
    createsql = '';
    createsql = 'CREATE TABLE IF NOT EXISTS shopusertb (';
    createsql += 'shopid INTEGER NOT NULL,';
    createsql += 'userid INTEGER NOT NULL,';
    createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)';
    db.run(createsql);

    // createsql = '';
    // createsql = 'CREATE TABLE IF NOT EXISTS resevedlist (';
    // createsql += 'id INTEGER PRIMARY KEY AUTOINCREMENT,';
    // createsql += 'shopid INTEGER NOT NULL,';
    // createsql += 'status INTEGER DEFAULT 0 NOT NULL,';// 0:表示未完成，1:表示完成, 2:過號未完成, 3:過號完成  
    // createsql += 'reserveday text NOT NULL,';  //20220812 
    // createsql += 'update_at text NOT NULL,';
    // createsql += 'email text NOT NULL UNIQUE,';
    // createsql += 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)';
    // db.run(createsql);
    //預插入系統管理者
    if (!getuserbymail('martinfb168@gmail.com')) {
       const tabName='';
       const colList=['name','password','phoneno','email','gender','role',];
       const valList=['Martin','shop888','0933866241','martinfb168@gmail.com','1','admin'];
       insertrow(tabName,colList,valList);
    }

}

const getuserbymail = (mail) => {
    let ret = false;
    const sql = 'SELECT * from usertb where email = ?';
    db.get(sql, [mail], (err, rows) => {
        if (err) {
            console.log(err);
        } else if (row) {
            ret = true;
            console.log(row);
        }
    });
    return ret;
}

const insertrow = (tabName, colList, valList) => {
    let colStr = '(';
    let qmStr = '(';
    for (let i = 0; i < colList.length; i++) {
        if (i = colList.length - 1) {
            colStr += colList[i] + ')';
            qmStr += '?)';
        } else {
            colStr += colList[i] + ',';
            qmStr += '?,';
        }
    }
    const sqlStr=`insert into ${tabName}${colList} values${qmStr}`;
    db.run(sqlStr,valList,(err,rows)=>{
        if(err){
            console.log(err);
        } else {
            console.log(JSON.stringify(rows));
        }
    });
}

db.close();

module.exports = {
    dbinit,
    insertrow
};    