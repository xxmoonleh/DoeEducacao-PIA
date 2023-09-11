const { json } = require('express');
const express = require('express');
const app = express();
app.use(express.json())
app.listen(9000, () => console.log("OK"));

const mysql = require('mysql2/promise')
const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''
})

app.get('/',(req,res)=>{
    res.send("Manjiro");
});

const getAllPessoas = async () =>{
    const [query] = await connection.execute('select * from testepessoa.pessoa');
    return query;
}

app.get('/pessoa', async (req,res)=>{
    const consulta = await getAllPessoas();
    return res.status(200).json(consulta);
})

app.get('/pessoa:id', async (req,res)=>{
    const {id} = req.params;
    const [query] = await connection.execute('select * from testepessoa.pessoa where id = ?', [id]);
    if(query.lenght === 0) return res.status(400).json({mensagem: 'Não Encontrado.'})
    return res.status(200).json(query);
})
