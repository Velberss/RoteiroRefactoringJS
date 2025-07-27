const { readFileSync } = require('fs');

// --- Funções Globais ---

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

// --- Classe de Serviço para Cálculos (Commit 7) ---

/**
 * Classe responsável por realizar todos os cálculos relacionados a uma fatura.
 */
class ServicoCalculoFatura {
    /**
     * Calcula os créditos acumulados para uma apresentação específica.
     * @param {object} apre - O objeto da apresentação.
     * @param {object} pecas - O objeto contendo todas as peças.
     * @returns {number} Os créditos da apresentação.
     */
    calcularCredito(apre, pecas) {
        let creditosDaApresentacao = 0;
        creditosDaApresentacao += Math.max(apre.audiencia - 30, 0);
        if (getPeca(apre, pecas).tipo === "comedia") {
            creditosDaApresentacao += Math.floor(apre.audiencia / 5);
        }
        return creditosDaApresentacao;
    }

    /**
     * Calcula o valor total de uma apresentação específica.
     * @param {object} apre - O objeto da apresentação.
     * @param {object} pecas - O objeto contendo todas as peças.
     * @returns {number} O valor total da apresentação em centavos.
     */
    calcularTotalApresentacao(apre, pecas) {
        let total = 0;
        switch (getPeca(apre, pecas).tipo) {
            case "tragedia":
                total = 40000;
                if (apre.audiencia > 30) {
                    total += 1000 * (apre.audiencia - 30);
                }
                break;
            case "comedia":
                total = 30000;
                if (apre.audiencia > 20) {
                    total += 10000 + 500 * (apre.audiencia - 20);
                }
                total += 300 * apre.audiencia;
                break;
            default:
                throw new Error(`Peça desconhecida: ${getPeca(apre, pecas).tipo}`);
        }
        return total;
    }

    /**
     * Calcula o valor total de todas as apresentações na fatura.
     * @param {object} pecas - O objeto contendo todas as peças.
     * @param {Array<object>} apresentacoes - O array de apresentações da fatura.
     * @returns {number} O valor total da fatura em centavos.
     */
    calcularTotalFatura(pecas, apresentacoes) {
        let totalGeral = 0;
        for (let apre of apresentacoes) {
            totalGeral += this.calcularTotalApresentacao(apre, pecas);
        }
        return totalGeral;
    }

    /**
     * Calcula o total de créditos acumulados em todas as apresentações da fatura.
     * @param {object} pecas - O objeto contendo todas as peças.
     * @param {Array<object>} apresentacoes - O array de apresentações da fatura.
     * @returns {number} O total de créditos acumulados.
     */
    calcularTotalCreditos(pecas, apresentacoes) {
        let creditosGerais = 0;
        for (let apre of apresentacoes) {
            creditosGerais += this.calcularCredito(apre, pecas);
        }
        return creditosGerais;
    }
}

// --- Classe de Renderização (Commit 8) ---

/**
 * Classe responsável por renderizar a fatura em diferentes formatos (texto plano, HTML).
 */
class StatementRenderer {
    /**
     * @param {object} fatura - O objeto da fatura.
     * @param {object} pecas - O objeto contendo todas as peças.
     * @param {ServicoCalculoFatura} calc - Uma instância do serviço de cálculo de fatura.
     */
    constructor(fatura, pecas, calc) {
        this.fatura = fatura;
        this.pecas = pecas;
        this.calc = calc;
    }

    /**
     * Renderiza a fatura em formato de texto plano.
     * @returns {string} A fatura formatada em texto plano.
     */
    renderPlainText() {
        let result = `Fatura ${this.fatura.cliente}\n`;

        for (let apre of this.fatura.apresentacoes) {
            let total = this.calc.calcularTotalApresentacao(apre, this.pecas);
            result += `   ${getPeca(apre, this.pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
        }

        result += `Valor total: ${formatarMoeda(this.calc.calcularTotalFatura(this.pecas, this.fatura.apresentacoes))}\n`;
        result += `Créditos acumulados: ${this.calc.calcularTotalCreditos(this.pecas, this.fatura.apresentacoes)} \n`;
        return result;
    }

    /*
    // Método para renderizar HTML (permanece comentado como no roteiro atual)
    renderHTML() {
        let htmlStr = `<html>\n<p> Fatura ${this.fatura.cliente} </p>\n<ul>\n`;

        for (let apre of this.fatura.apresentacoes) {
            let total = this.calc.calcularTotalApresentacao(apre, this.pecas);
            htmlStr += `<li> ${getPeca(apre, this.pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
        }

        htmlStr += `</ul>\n`;
        htmlStr += `<p> Valor total: ${formatarMoeda(this.calc.calcularTotalFatura(this.pecas, this.fatura.apresentacoes))} </p>\n`;
        htmlStr += `<p> Créditos acumulados: ${this.calc.calcularTotalCreditos(this.pecas, this.fatura.apresentacoes)} </p>\n`;
        htmlStr += `</html>`;

        return htmlStr;
    }
    */
}

// --- Funções de Geração de Fatura (Orquestradores) ---

/**
 * Gera a fatura em formato de texto plano.
 * @param {object} fatura - O objeto da fatura.
 * @param {object} pecas - O objeto contendo todas as peças.
 * @param {ServicoCalculoFatura} calc - Uma instância do serviço de cálculo de fatura.
 * @returns {string} A fatura formatada em texto plano.
 */
function gerarFaturaStr(fatura, pecas, calc) {
    const renderer = new StatementRenderer(fatura, pecas, calc);
    return renderer.renderPlainText();
}

/*
// Função de geração de fatura HTML (comentada)
function gerarFaturaHTML(fatura, pecas, calc) {
    const renderer = new StatementRenderer(fatura, pecas, calc);
    return renderer.renderHTML(); // Chamar renderHTML se descomentada a função
}
*/

// --- Execução do Programa (main) ---

// Leitura dos dados de faturas e peças
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));


const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);

/*
// Geração e exibição da fatura em HTML (chamadas comentadas)
console.log('\n--- Fatura em HTML ---\n');
const faturaHTML = gerarFaturaHTML(faturas, pecas, calc);
console.log(faturaHTML);
*/