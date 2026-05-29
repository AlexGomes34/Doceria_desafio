const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controllerProduto = require('./controller/produto/produto_controller.js')
const controllerUsuario = require('./controller/usuario/usuario_controller.js')
const controllerProdutoExcluido = require('./controller/produto/produto_excluido_controller.js')

const PORT = process.env.PORT || 8080;
const app = express();

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    app.use(cors());
    next();
})

app.post('/doces', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']
    let result = await controllerProduto.inserirProduto(dadosBody, contentType)
    console.log(result)
    response.status(result.status_code)
    response.json(result)
})

app.get('/doces', cors(), async (request, response) => {
    let result = await controllerProduto.listarProdutos()

    response.status(result.status_code);
    response.json(result);
});

app.post('/login', bodyParserJSON, async (request, response) => {
    const dadosLogin = request.body;
    const result = await controllerUsuario.loginUsuario(dadosLogin);

    response.status(result.status_code)
    response.json(result);
});

app.get('/doces/excluido', cors(), async (request, response) => {
    let result = await controllerProdutoExcluido.listarProdutosExcluidos()

    response.status(result.status_code);
    response.json(result);
});

app.put('/doces/:id', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body
    let id = request.params.id
    let contentType = request.headers['content-type']
    let result = await controllerProduto.atualizarProduto(dadosBody, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.put('/doces/desativar/:id', cors(), bodyParserJSON, async function (req, res) {
    const idDoce = req.params.id;
    const idUsuarioLogado = req.body.id_usuario; 
    const resultado = await controllerProduto.deletarProduto(idDoce, idUsuarioLogado);
    
    res.status(resultado.status_code).json(resultado);
});

app.listen(PORT, function () {
    console.log('Servidor ligado...');
});