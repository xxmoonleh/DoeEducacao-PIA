const { json } = require('express');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json())
app.listen(9000, () => console. log("OK"));

const mysql = require('mysql2/promise')
const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''
})

app.get('/',(req,res)=>{
    res.send("Helicia");
});



app.get('/doador', async (req,res)=>{
    const [query] = await connection.execute('select * from doeeducacao.doador');
    return res.status(200).json(query);
})

app.get('/doador:id', async (req,res)=>{
    const {id} = req.params;
    const [query] = await connection.execute('select * from doeeducacao.doador where id = ?', [id]);
    if(query.length === 0) return res.status(400).json({mensagem: 'Não Encontrado.'})
    return res.status(200).json(query);
})

app.get('/doador/nome/:busca', async (req, res) => {
    const { busca } = req.params;
    
    const [query] = await connection.execute('SELECT * FROM doeeducacao.doador WHERE nome LIKE ?', [`%${busca}%`]);
    
    if (query.length === 0) {
        return res.status(400).json({ mensagem: 'Não Encontrado.' });
    }
    
    return res.status(200).json(query);
});


app.post('/doador', async (req, res) => {
    try {
        const { nome, email, endereco, cpf, nascimento, cep, cidade, estado, bairro, rua, numero, complemento } = req.body; // Suponha que o cliente envie o nome e a idade no corpo da requisição

        // Realize a inserção no banco de dados
        const [result] = await connection.execute('INSERT INTO doeeducacao.doador (nome, email, endereco, cpf, nascimento, cep, cidade, estado, bairro, rua, numero, complemento) VALUES (?, ?)', [nome, email, endereco, cpf, nascimento, cep, cidade, estado, bairro, rua, numero, complemento]);

        // Verifique se a inserção foi bem-sucedida
        if (result.affectedRows === 1) {
            return res.status(201).json({ mensagem: 'Pessoa inserida com sucesso.' });
        } else {
            return res.status(400).json({ mensagem: 'Não foi possível inserir a pessoa.' });
        }
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
});

app.put('/doador/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body; // Suponha que o cliente envie os novos dados no corpo da requisição

        // Verifique se a pessoa existe no banco de dados antes de tentar a atualização
        const [existingPerson] = await connection.execute('SELECT * FROM doeeducacao.doador WHERE id = ?', [id]);

        if (existingPerson.length === 0) {
            return res.status(400).json({ mensagem: 'Pessoa não encontrada.' });
        }

        // Atualize os dados da pessoa no banco de dados
        const [result] = await connection.execute('UPDATE doeeducacao.doador SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);

        // Verifique se a atualização foi bem-sucedida
        if (result.affectedRows === 1) {
            return res.status(200).json({ mensagem: 'Pessoa atualizada com sucesso.' });
        } else {
            return res.status(400).json({ mensagem: 'Não foi possível atualizar a pessoa.' });
        }
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
});

app.delete('/doador/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifique se a pessoa existe no banco de dados antes de tentar a exclusão
        const [existingPerson] = await connection.execute('SELECT * FROM doeeducacao.doador WHERE id = ?', [id]);

        if (existingPerson.length === 0) {
            return res.status(400).json({ mensagem: 'Pessoa não encontrada.' });
        }

        // Exclua a pessoa do banco de dados
        const [result] = await connection.execute('DELETE FROM doeeducacao.doador WHERE id = ?', [id]);

        // Verifique se a exclusão foi bem-sucedida
        if (result.affectedRows === 1) {
            return res.status(200).json({ mensagem: 'Pessoa excluída com sucesso.' });
        } else {
            return res.status(400).json({ mensagem: 'Não foi possível excluir a pessoa.' });
        }
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
});
