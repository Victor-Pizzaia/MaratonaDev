// configurando o servidor
const express = require("express");
const server = express();


// configurar o servideor para apresentar arquivos estaticos
server.use(express.static('public'))


// habilitar body do formulario
server.use(express.urlencoded({extended: true}))


// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Pizzaia',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true
})


// Configurar a apresentação da página
server.get("/", (req, res)=>{
    
    db.query("SELECT * FROM donors ORDER BY id DESC LIMIT 4", (err, result)=>{
        if (err) return res.send("Erro de banco de dados" + err)


        const donors = result.rows
        return res.render("index.html", {donors})
    })
    //return res.send("ok, cheguei aqui!") 
})


server.post("/", (req, res)=>{
    // pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood ==""){
        return res.send("Todos os campos são obrigatórios")
    }

    // colocar os valores dentro do banco de dados
    const query = `
        INSERT INTO donors("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]    
    db.query(query, values, function(error){
        if (error){
            return res.send("erro no banco de dados."+error);
        } 

        return res.redirect("/")
    })

    // coloca valores no array
    //donors.push({
    //    name: name,
    //    blood: blood
    //})

    
})

// Ligar o servidor na porta 3333
server.listen(3333, ()=>{
    console.log("Server already start !")
})