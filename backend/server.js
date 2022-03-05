// 필요한 모듈 가져오기
const express = require("express");
const bodyParser = require('body-parser');
// db.js 파일을 가져오기
const db = require('./db');

// 익스프레스 서버 생성
const app = express();

// JSON 형태로 전달되는 요청의 본문을 해석할 수 있게 등록
app.use(bodyParser.json());


// 테이블 생성
db.pool.query(`CREATE TABLE lists (
    id INTEGER AUTO_INCREMENT,
    value TEXT, 
    PRIMARY KEY (id)
)`, (err, results, fileds) => {
    console.log('results', results)
})

// DB의 lists 테이블에 있는 모든 데이터를 프런트엔드 서버로 보내주기
app.get('/api/values', function (req, res) {
    // DB에서 모든 정보 가져오기
    db.pool.query('SELECT * FROM lists;',
        (err, results, fileds) => {
        if (err)
            return res.status(500).send(err);
        else
            // 프런트엔드에 DB 에서 가져온 정보를 json 형식으로 보냄
            return res.json(results);
    })
})


// 클라이언트에서 입력한 값을 DB의 lists 테이블에 넣어주기
app.post('/api/value', function (req, res, next) {
    // 데이터 베이스에 값 넣어주기
    db.pool.query('INSERT INTO lists (value) VALUES("${req.body.value}")',
        (err, results, fileds) => {
        if (err)
            return res.status(500).send(err);
        else
            return res.json({ success: true, value: req.body.value });
    })
})


app.listen(5000, () => {
    console.log('애플리케이션이 5000번 포트에서 시작됐습니다.');
})
