const { readFileSync } = require('fs');

// --- Importações das Classes e Funções ---
// Importa as classes que foram movidas para arquivos separados
const ServicoCalculoFatura = require('./ServicoCalculoFatura');
const StatementRenderer = require('./StatementRenderer');

// Funções globais que ainda não foram movidas para um módulo de utilidades (próximos commits)
/**
 * Retorna o objeto da peça de teatro correspondente a uma apresentação.
 * @param {object} apresentacao - O objeto da apresentação.
 * @param {object} pecas - O objeto contendo todas as peças.
 * @returns {object} O objeto da peça.
 */
function getPeca(apresentacao, pecas) {
    return pecas[apresentacao.id];
}

/**
 * Formata um valor numérico para o formato de moeda brasileira (BRL).
 * @param {number} valor - O valor a ser formatado (presume-se em centavos, será dividido por 100).
 * @returns {string} O valor formatado como string de moeda.
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
        {
            style: "currency", currency: "BRL",
            minimumFractionDigits: 2
        }).format(valor / 100);
}

// --- Funções de Geração de Fatura (Orquestradores) ---
// Elas continuam aqui, mas agora usam as classes importadas

/**
 * Gera a fatura em formato de texto plano.
 * @param {object} fatura - O objeto da fatura.
 * @param {object} pecas - O objeto contendo todas as peças.
 * @param {ServicoCalculoFatura} calc - Uma instância do serviço de cálculo de fatura.
 * @returns {string} A fatura formatada em texto plano.
 */
function gerarFaturaStr(fatura, pecas, calc) {
    // Instancia o StatementRenderer passando fatura, pecas e a instância de cálculo
    const renderer = new StatementRenderer(fatura, pecas, calc);
    return renderer.renderPlainText(); // Chama o método de renderização da classe
}

/*
// Função de geração de fatura HTML (comentada, como no roteiro atual)
// Você pode descomentar esta função e o método renderHTML em StatementRenderer.js
// no futuro, quando for implementá-la por completo novamente.
function gerarFaturaHTML(fatura, pecas, calc) {
    const renderer = new StatementRenderer(fatura, pecas, calc);
    return renderer.renderHTML();
}
*/

// --- Execução do Programa (main) ---

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);
