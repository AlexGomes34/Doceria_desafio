let idUsuarioLogado = localStorage.getItem('idUsuarioLogado') || null;

export async function lerDoces() {
    const response = await fetch("http://localhost:8080/doces")
    const dados = await response.json()
    console.log(dados)
    return dados

}



export async function cadastrarDoce(doce) {
    const response = await fetch("http://localhost:8080/doces", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(doce)

    })
    const dados = await response.json()
    return dados
}



export async function atualizarDoce(id, doce) {
    const response = await fetch(`http://localhost:8080/doces/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doce)
    })
    const dados = await response.json()
    return dados
}



export async function excluirDoce(id) {
    const response = await fetch(`http://localhost:8080/doces/desativar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id_usuario: idUsuarioLogado 
        })
    })

    if (response.ok) {
        console.log('Produto ocultado e registrado no histórico com sucesso!')
    }
    
    const dados = await response.json()
    return dados
}



export async function logarUsuario(usuario) {

    const response = await fetch("http://localhost:8080/login", {

        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },

        body: JSON.stringify(usuario)

    })

    const dados = await response.json()
    return dados

}

export async function lerDocesExcluidos() {
    const response = await fetch('http://localhost:8080/doces/excluido')
    const dados = await response.json()

    console.log(dados)
    return dados
}

const login = document.getElementById('login')
const home = document.getElementById('home')
const registroProdutos = document.getElementById('registroProdutos')
const emailInput = document.getElementById('email')
const senhaInput = document.getElementById('senha')
const btnLogin = document.getElementById('btnLogin')
const corpoTabela = document.getElementById('corpo-tabela')

const btnCadastrar = document.getElementById('btnCadastrar')
const btnRegistro = document.getElementById('btnRegistro')
const btnVoltar = document.getElementById('btnVoltar')
const modalProduto = document.getElementById('modalProduto')
const btnFecharModal = document.getElementById('btnFecharModal')
const btnSalvar = document.getElementById('btnSalvar')

const formId = document.getElementById('doceId')
const formNome = document.getElementById('formNome')
const formRecheio = document.getElementById('formRecheio')
const formCobertura = document.getElementById('formCobertura')
const formMassa = document.getElementById('formMassa')
const formPeso = document.getElementById('formPeso')
const formPorcoes = document.getElementById('formPorcoes')
const formVencimento = document.getElementById('formVencimento')

const corpoTabelaExcluidos = document.getElementById('corpo-tabela-excluidos')

btnLogin.addEventListener('click', async () => {
    let usuario = { email: emailInput.value, senha: senhaInput.value }
    const response = await logarUsuario(usuario)
    
    if (response.status_code == 200) {
        idUsuarioLogado = response.result?.id_usuario; 
        
        if (idUsuarioLogado) {
            localStorage.setItem('idUsuarioLogado', idUsuarioLogado);

            login.style.display = "none"
            atualizarInterfaceTabela()
            home.style.display = "flex"
        } else {
            console.error("Erro: Não foi possível capturar o id_usuario de dentro do result.", response);
            alert("Erro interno ao ler os dados do usuário logado.");
        }
    } else {
        alert(response.message || "E-mail ou senha inválidos");
    }
})

btnRegistro.addEventListener('click', async () => {
    home.style.display = "none"
    registroProdutos.style.display = "flex"
    const dadosExcluidos = await lerDocesExcluidos()
    carregarTabelaExcluidos(dadosExcluidos)
})

btnVoltar.addEventListener('click', () => {
    registroProdutos.style.display = "none"
    home.style.display = "flex"
})

btnCadastrar.addEventListener('click', () => {
    document.getElementById('modalTitulo').textContent = "Cadastrar Doce"
    formId.value = ""
    limparFormulario()
    modalProduto.style.display = "flex"
})

btnFecharModal.addEventListener('click', () => modalProduto.style.display = "none")

async function atualizarInterfaceTabela() {
    const bolos = await lerDoces()
    carregarTabela(bolos)
}

function limparFormulario() {
    formNome.value = ""
    formRecheio.value = ""
    formCobertura.value = ""
    formMassa.value = ""
    formPeso.value = ""
    formPorcoes.value = ""
    formVencimento.value = ""
}

async function excluirBolo(id) {
    if (!idUsuarioLogado) {
        alert("Sessão expirada ou usuário não identificado. Faça login novamente.");
        return;
    }

    if (confirm("Tem certeza que deseja ocultar este bolo e mover para o histórico?")) {
        await excluirDoce(id)
        await atualizarInterfaceTabela()
    }
}

function editarBolo(bolo) {
    document.getElementById('modalTitulo').textContent = "Editar Doce"

    formId.value = bolo.id_produto 
    formNome.value = bolo.nome
    formRecheio.value = bolo.recheio
    formCobertura.value = bolo.cobertura
    formMassa.value = bolo.massa
    formPeso.value = bolo.peso
    formPorcoes.value = bolo.porcoes 

    if (bolo.data_de_vencimento) {
        formVencimento.value = bolo.data_de_vencimento.split('T')[0]
    }

    modalProduto.style.display = "flex"
}

btnSalvar.addEventListener('click', async () => {
    const id = formId.value

    const doceDados = {
    nome: formNome.value,
    recheio: formRecheio.value,
    cobertura: formCobertura.value,
    massa: formMassa.value,
    peso: parseFloat(formPeso.value),
    porcoes: parseInt(formPorcoes.value), 
    data_de_vencimento: formVencimento.value ? formVencimento.value : null
}

    if (id) {
        const result = await atualizarDoce(id, doceDados)
        console.log(result)
    } else {
        await cadastrarDoce(doceDados)
    }

    modalProduto.style.display = "none"
    await atualizarInterfaceTabela()
})

async function carregarTabela(bolos) {
    corpoTabela.textContent = '';

    bolos.result.forEach(bolo => {
        const tr = document.createElement('tr');

        const tdNome = document.createElement('td');
        tdNome.textContent = bolo.nome;

        const tdRecheio = document.createElement('td');
        tdRecheio.textContent = bolo.recheio;

        const tdCobertura = document.createElement('td');
        tdCobertura.textContent = bolo.cobertura;

        const tdMassa = document.createElement('td');
        tdMassa.textContent = bolo.massa;

        const tdPeso = document.createElement('td');
        tdPeso.textContent = bolo.peso;

        const tdPorcoes = document.createElement('td');
        tdPorcoes.textContent = bolo.porcoes; 

        const tdVencimento = document.createElement('td');
        tdVencimento.textContent = bolo.data_de_vencimento ? new Date(bolo.data_de_vencimento).toLocaleDateString('pt-BR') : 'N/A'; // <-- Aqui

        const tdAcoes = document.createElement('td');
        tdAcoes.classList.add('actions-cell');

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-editar');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => editarBolo(bolo));

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('btn', 'btn-excluir');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => excluirBolo(bolo.id_produto)); 

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdNome);
        tr.appendChild(tdRecheio);
        tr.appendChild(tdCobertura);
        tr.appendChild(tdMassa);
        tr.appendChild(tdPeso);
        tr.appendChild(tdPorcoes);
        tr.appendChild(tdVencimento);
        tr.appendChild(tdAcoes);

        corpoTabela.appendChild(tr);
    });
}

async function carregarTabelaExcluidos(dadosExcluidos) {
    corpoTabelaExcluidos.textContent = '';

    if (!dadosExcluidos || !dadosExcluidos.result) return;

    dadosExcluidos.result.forEach(item => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = item.id_produto_excluido;

        const tdEmail = document.createElement('td');
        tdEmail.textContent = item.email || 'N/A';

        const tdIdProd = document.createElement('td');
        tdIdProd.textContent = item.id_produto || item.produto_id;

        const tdNome = document.createElement('td');
        tdNome.textContent = item.nome_produto;

        const tdRecheio = document.createElement('td');
        tdRecheio.textContent = item.recheio;

        const tdCobertura = document.createElement('td');
        tdCobertura.textContent = item.cobertura;

        const tdMassa = document.createElement('td');
        tdMassa.textContent = item.massa;

        const tdPeso = document.createElement('td');
        tdPeso.textContent = item.peso;

        const tdPorcoes = document.createElement('td');
        tdPorcoes.textContent = item.porcoes || item.numero_porcoes;

        const tdVencimento = document.createElement('td');
        tdVencimento.textContent = item.data_de_vencimento ? new Date(item.data_de_vencimento).toLocaleDateString('pt-BR') : 'N/A';

        tr.appendChild(tdId);
        tr.appendChild(tdEmail);
        tr.appendChild(tdIdProd);
        tr.appendChild(tdNome);
        tr.appendChild(tdRecheio);
        tr.appendChild(tdCobertura);
        tr.appendChild(tdMassa);
        tr.appendChild(tdPeso);
        tr.appendChild(tdPorcoes);
        tr.appendChild(tdVencimento);

        corpoTabelaExcluidos.appendChild(tr);
    });
}