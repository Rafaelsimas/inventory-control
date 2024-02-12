const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()
const port = 3000

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

//Renderizando a home
app.get('/', (req, res) => {
    res.render('home')
})

//Inserindo dados no banco
app.post('/estoque/insertproducts', (req, res) => {
    const title = req.body.title
    const productqty = req.body.productqty

    const sql = `INSERT INTO estoque (title, productqty) VALUES  ('${title}', '${productqty}')`

    conn.query(sql, function(err){
        if(err){
            console.log(err);
            return
        }

        res.redirect('/')
    })
})


//Resgatando dados
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM  estoque'

    conn.query(sql, function(err, data){
        if(err){
            console.log(err);
            return
        }

        const products = data
        console.log(products);

        res.render('products', {products})
    })
})

//Resgatando dados por id
app.get('/products/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM estoque WHERE  id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err);
            return
        }

        const product = data[0]

        res.render('product', {product})
    })
})

//Editando dados
app.get('/products/edit/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM estoque WHERE id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err);
            return
        }

        const product = data[0]
        res.render('editproduct', {product})
    })
})

//Atualizando dados editados
app.post('/products/updateproduct', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const productqty = req.body.productqty

    const sql = `UPDATE estoque SET  title = '${title}', productqty = '${productqty}' WHERE id = ${id}`
    conn.query(sql, function(err) {
        if(err){
            console.log(err);
            return
        }

        res.redirect('/products')
    })
})

//Deletando um item
app.post('/products/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM estoque WHERE id = ${id}`

    conn.query(sql, function(err) {
        if(err){
            console.log(err);
            return
        }

        res.redirect('/products')
    })
})
//Conectando com o MySQL
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'estoquecasa'
})

//Ligando o servidor quando conectar com o MySQL
conn.connect(function (err){
    if(err){
        console.log(err);
    }

    console.log('Conexão com banco de dados realizada com sucesso');
    app.listen(port, () => {
        console.log(`Server running with success in port ${port}`);
    })
})
