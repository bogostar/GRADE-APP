const path = require('path');
const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

const port = 3000;
const mysql = require('mysql');
const { METHODS } = require('http');
//Create connection;
const gradesdb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Courses',
    port: 3306
});

//connect to database;
gradesdb.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

//show all out data from database in index.ejs;
app.get('/', function(req, res, next) {
    gradesdb.query('select * from student_grades order by year,semester;', function(err, rows) {
        if (err) {
            res.render('index', {
                student_grades: ""
            });
        } else {
            res.render('index', {
                student_grades: rows
            });
        }
    });
});

//render to filterbyear.ejs;
app.get('/yearfilter', function(req, res, next) {
    res.render("filterbyyear");
});

//get our requested param year;
app.get('/currentyear/year/(:year)', function(req, res, next) {
    let year = req.params.year;
    //using query with a condition where to filter our data'; 
    gradesdb.query(`select * from student_grades where year = ${year} order by semester;`, function(err, result) {
        if (err) {
            console.log(err);
            //if there is error redirect app.get('/yearfilter');
            res.redirect('/yearfilter');
        } else {
            //if no erorr render to currentyear.ejs with 2 variables;
            res.render('currentyear', {
                student_grades: result,
                year: req.params.year
            });
        }
    });
});
//geting year and redirect to app.get('/currentyear/year/(:year);
app.post("/currentyear", function(req, res, next) {
    let year = req.body.year;
    res.redirect('/currentyear/year/' + year);
});

//render to filterbysemester.ejs;
app.get('/FilterBySemester', function(req, res, next) {
    res.render("filterbysemester");
});

//get our request params year and semester;
app.get("/currentsemester/year/(:year)/semester/(:semester)", function(req, res, next) {
    let year = req.params.year;
    let semester = req.params.semester;
    //using query to filter our data with 2 conditions;
    gradesdb.query(`select * from student_grades where year = ${year} and semester = '${semester}';`, function(err, result) {
        if (err) {
            console.log(err)
                //if error redirect to filterbysemester;
            res.redirect('/FilterBySemester');
        } else {
            //if no error render to currentsemester.ejs;
            res.render('currentsemester', {
                student_grades: result,
                year: req.params.year,
                semester: req.params.semester
            });
        }
    });
});

//geting year and semester and redirect to app.get("/currentsemester/year/(:year)/semester/(:semester);
app.post('/currentsemester', function(req, res, next) {
    let year = req.body.year;
    let semester = req.body.semester;
    res.redirect('/currentsemester/year/' + year + '/semester/' + semester);
});

//render to Add.ejs;
app.get('/add', function(req, res, next) {
    res.render("Add", {
        course_name: '',
        year: '',
        semester: '',
        grade: ''
    });
});

//add new course to data base;
app.post('/admit', function(req, res, next) {
    let data = {
        course_name: req.body.course_name,
        year: req.body.year,
        semester: req.body.semester,
        grade: req.body.grade
    };

    //insert query to our data base;
    let sql = "insert into student_grades SET?";
    let query = gradesdb.query(sql, data, (err, results) => {
        if (err) {
            console.log(err);
            //if error redirect to add;
            res.redirect('/add');
        } else {
            console.log('course was successfully Added!')
                //if no error redirect to index.ejs;
            res.redirect('/');
        }
    });
});

//edit course by his id;
app.get('/edit/(:id)', (req, res) => {
    const id = req.params.id;
    //selcet course from data base by his id;
    let sql = 'select * from student_grades where id =' + id;
    let query = gradesdb.query(sql, (err, result) => {
        if (err) throw err;
        res.render('edit', {
            student_grades: result[0]
        });
    });
});

//update course by his id;
app.post('/update', (req, res) => {
    const id = req.body.id;
    //query of update course from data base with condition;
    let sql = "update student_grades SET course_name='" + req.body.course_name + "', year='" + req.body.year + "',semester='" + req.body.semester + "', grade='" + req.body.grade + "' where id=" + id;
    let query = gradesdb.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            //if error redirect to index.ejs;
            res.redirect('/');
        } else {
            console.log('course was successfully updated!');
            //if no error redirect to index.ejs;
            res.redirect('/');
        }
    });
});

//detele course by his id;
app.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    //query of delete course from database with condition;
    gradesdb.query('delete from student_grades where id = ' + id, function(err, result) {
        if (err) {
            console.error(err)
                //if error redirect to index.ejs;
            res.redirect('/')
        } else {
            console.log('course was successfully deleted!')
                //if no error redirect to index.ejs;
            res.redirect('/')
        }
    })
})

app.listen(port, () => {
    console.log(`This app listening at http: //localhost:${port}`)
})