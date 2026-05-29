const historicoController = require('./produto_excluido_controller.js');
const produtoDAO = require('../../model/produto.js')
const MESSAGE_DEFAULT = require('../modulo/messages.js')

const listarProdutos = async () => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        let result = await produtoDAO.getSelectAllProducts()
        if (result && result.length > 0) {
            MESSAGE.REQUEST_SUCESS.result = result
            return MESSAGE.REQUEST_SUCESS
        }
        return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Nenhum produto encontrado" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const atualizarProduto = async (produto, id, contentType) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            produto.id = Number(id)

            let result = await produtoDAO.setUpdateProduct(produto)
            if (result) {
                MESSAGE.SUCESS_UPDATE_ITEM.result = result
                return MESSAGE.SUCESS_UPDATE_ITEM
            }
            return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Produto não encontrado para atualizar" }
        }
        return { status_code: 415, message: "Content-Type inválido" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const inserirProduto = async (produto, contentType) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let result = await produtoDAO.setInsertProduct(produto)
            if (result) {
                return MESSAGE.SUCESS_CREATED_ITEM
            }
        }
        return { status_code: 400, message: "Falha ao inserir o item. Verifique os dados." }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const deletarProduto = async (idProduto, idUsuarioLogado) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));
    
    try {
        const idProdNumero = Number(idProduto);
        const idUserNumero = Number(idUsuarioLogado);

        if (!isNaN(idProdNumero) && idProdNumero > 0 && !isNaN(idUserNumero) && idUserNumero > 0) {
            
            let atualizouStatus = await produtoDAO.setDeleteProduct(idProdNumero);
            
            if (atualizouStatus) {
                const dadosHistorico = {
                    id_usuario: idUserNumero,
                    id_produto: idProdNumero
                };
                let respostaHistorico = await historicoController.inserirProdutoExcluido(dadosHistorico, 'APPLICATION/JSON');

                if (respostaHistorico.status_code === 201 || respostaHistorico.status_code === 200) {
                    return MESSAGE.SUCESS_DELETE_ITEM; 
                } else {
                    console.error("Falha na validação ou inserção do histórico:", respostaHistorico);
                    return { status_code: 400, message: "Produto desativado, mas houve um erro ao validar os dados do histórico." };
                }
            }
            return MESSAGE.ERROR_NOT_FOUND;
        }
        return { status_code: 400, message: "ID do produto ou do usuário inválido." };
    } catch (error) {
        console.error("Erro no fluxo de exclusão lógica:", error);
        return { status_code: 500, message: "Erro interno no servidor." };
    }
};
module.exports = {
    listarProdutos,
    inserirProduto,
    atualizarProduto,
    deletarProduto
}