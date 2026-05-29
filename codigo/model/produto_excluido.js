const database = require("../database.js")

const getSelectAllProductsExcluidos = async () => {
    try {
        const result = await database('vw_produtos_excluidos_por_usuario').orderBy('id_produto_excluido')
        return result.length > 0 ? result : false
    } catch (error) {
        return false
    }
}

const setInsertProdutoExcluido = async (produto_excluido) => {
    try {
        const result = await database('tbl_produto_excluido').insert({
            id_usuario: produto_excluido.id_usuario,
            id_produto: produto_excluido.id_produto
        })
        return result ? result : false
    } catch (error) {
        return false
    }
}

const setUpdateProdutoExcluido = async function(produto_excluido) {
    try {
        const result = await database('tbl_produto_excluido').where('id_produto_excluido', produto_excluido.id).update({
            id_produto: produto_excluido.id_produto,
            id_usuario: produto_excluido.id_usuario
        })
        return result > 0 ? result : false
    } catch (error) {
        return false
    }
}

const setDeleteProdutoExcluido = async function(id) {
    try {
        const result = await database('tbl_produto_excluido').where('id_produto_excluido', id).del()
        return result > 0 ? result : false
    } catch (error) {
        return false
    }
}

module.exports = {
    setDeleteProdutoExcluido,
    setInsertProdutoExcluido,
    setUpdateProdutoExcluido,
    getSelectAllProductsExcluidos
}