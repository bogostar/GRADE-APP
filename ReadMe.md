#GRADE-APP-main<br>

This is a grading system that stores the information in a MYSQL database,<br>
 created with express and views(ejs);<br>

Dont forget to npm install express to use this app<br>

In this app you will able to add new courses<br>
delete courses and uptade/edit it by id<br>
Also u can filter your courses by year<br>
or by year and semester<br>

to run the application node index.js <br>
And go to http://localhost:3000<br>

Make sure you run those lines in you mysql workbench: <br>
and make sure to change to the correct db port in index.js <br>

create database Courses; <br>
use courses;<br>
CREATE TABLE IF NOT EXISTS student_grades( <br>
    id INT not null AUTO_INCREMENT, <br>
    course_name varchar(20) not null,<br>
    year int not null,<br>
    semester varchar(20) not null,<br>
    grade int not null,<br>
    primary key(id)<br>
);



