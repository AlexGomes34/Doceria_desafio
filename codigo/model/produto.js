const knex = require('knex')
const database = require("../database.js")

const getSelectAllProducts = async function() {
    try {
        const result = await database('tbl_produto')
            .where('is_visivel', true)
            .orderBy('id_produto');
        
        return result.length > 0 ? result : false;
    } catch (error) {
        console.error("Erro ao listar produtos do banco:", error);
        return false;
    }
}

const setInsertProduct = async function(produto) {
    try {
        const result = await database('tbl_produto').insert({
            nome: produto.nome,
            recheio: produto.recheio,
            cobertura: produto.cobertura,
            massa: produto.massa,
            peso: produto.peso,
            porcoes: produto.porcoes,
            data_de_vencimento: produto.data_de_vencimento,
            is_visivel: true
        })

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setUpdateProduct = async function(produto) {
    try {
        const result = await database('tbl_produto').where('id_produto', produto.id).update({
            nome: produto.nome,
            recheio: produto.recheio,
            cobertura: produto.cobertura,
            massa: produto.massa,
            peso: produto.peso,
            porcoes: produto.porcoes,
            data_de_vencimento: produto.data_de_vencimento,
            is_visivel: true
        })
        if(result > 0)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteProduct = async function(id) {
    try {
        const result = await database('tbl_produto')
            .where('id_produto', id)
            .update({ is_visivel: false });
        
        return result > 0 ? result : false;
    } catch (error) {
        return false;
    }
}

module.exports = {
    getSelectAllProducts,
    setInsertProduct,
    setUpdateProduct,
    setDeleteProduct
}