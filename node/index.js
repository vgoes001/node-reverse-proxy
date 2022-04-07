const express = require('express');
const { faker } = require('@faker-js/faker');

const app = express();
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}
const mysql = require('mysql')
const connection = mysql.createConnection(config)
const sqlCreateTable = `CREATE TABLE people(id int NOT NULL AUTO_INCREMENT, name varchar(255), PRIMARY KEY (id))`
connection.query(sqlCreateTable)


app.listen(3000,() => {
    console.log('App is running on port 3000')
})

app.get('/', async (req, res) => {
    try{
        const randomName = faker.name.findName();
        const sqlInsert = `INSERT INTO people(name) values('${randomName}')`;

        const insertPromise = new Promise((resolve, reject) => {
            connection.query(sqlInsert, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        })
        await insertPromise;
        const sqlSelect = `SELECT * from people`;
        const selectPromise = new Promise((resolve, reject) => {
            connection.query(sqlSelect, (error, results)=> {
                if (error) reject(error);
                resolve(results);
            })
        })
        const result = await selectPromise;
        const names = result.map(element => {
            const { name } = element;
            return name;

        });

        return res.send(
            `<h1>Full Cycle Rocks!</h1>
            <ul>
            ${names.map(name => `<li>${name}</li>`)}
            </ul>
        `)

    }catch(err){
        console.error(err);
    }


})