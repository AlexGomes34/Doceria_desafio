const produto_excluido_model = require('../../model/produto_excluido.js')
const MESSAGE_DEFAULT = require('../modulo/messages.js')

const listarProdutosExcluidos = async () => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        let result = await produto_excluido_model.getSelectAllProductsExcluidos()
        if (result && result.length > 0) {
            MESSAGE.REQUEST_SUCESS.result = result
            return MESSAGE.REQUEST_SUCESS
        }
        return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Nenhum histórico encontrado" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const atualizarProdutoExcluido = async (produto_excluido, id, contentType) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            produto_excluido.id = Number(id)
            const dadosValidos = validarDados(produto_excluido)

            if (dadosValidos) {
                let result = await produto_excluido_model.setUpdateProdutoExcluido(produto_excluido)
                if (result) {
                    MESSAGE.SUCESS_UPDATE_ITEM.result = result
                    return MESSAGE.SUCESS_UPDATE_ITEM
                }
                return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Item não encontrado" }
            }
            return { status_code: 400, message: "Dados de IDs inválidos" }
        }
        return { status_code: 415, message: "Content-Type inválido" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const inserirProdutoExcluido = async (produto_excluido, contentType) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            const dadosValidos = validarDados(produto_excluido)

            if (dadosValidos) {
                let result = await produto_excluido_model.setInsertProdutoExcluido(produto_excluido)
                if (result) {
                    MESSAGE.SUCESS_CREATED_ITEM.result = result
                    return MESSAGE.SUCESS_CREATED_ITEM
                }
            }
            return { status_code: 400, message: "IDs de usuário ou produto inválidos" }
        }
        return { status_code: 415, message: "Content-Type inválido" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const deletarProdutoExcluido = async (id) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        const idNumero = Number(id)
        if (!isNaN(idNumero) && idNumero > 0) {
            let result = await produto_excluido_model.setDeleteProdutoExcluido(idNumero)
            if (result) {
                return MESSAGE.SUCESS_DELETE_ITEM
            }
            return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Item não encontrado" }
        }
        return { status_code: 400, message: "ID inválido" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

function validarDados(produto_excluido) {
    if (
        typeof produto_excluido.id_usuario !== "number" || produto_excluido.id_usuario <= 0 ||
        typeof produto_excluido.id_produto !== "number" || produto_excluido.id_produto <= 0
    ) {
       return false
    } else {
        return true
    }
}

module.exports = {
    listarProdutosExcluidos,
    inserirProdutoExcluido,
    atualizarProdutoExcluido,
    deletarProdutoExcluido
}