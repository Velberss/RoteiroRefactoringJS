// StatementRenderer.js

// Importa a classe de serviço de cálculo, pois o renderer precisa dela para fazer os cálculos
const ServicoCalculoFatura = require('./ServicoCalculoFatura'); 
// Note: getPeca e formatarMoeda ainda são globais e serão acessíveis aqui.

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
            // Chamada para o método de cálculo através da instância 'this.calc'
            let total = this.calc.calcularTotalApresentacao(apre, this.pecas);
            // Chamadas para funções globais
            result += `   ${getPeca(apre, this.pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
        }

        // Chamadas para métodos de cálculo através da instância 'this.calc'
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

// Exporta a classe para que outros arquivos possam importá-la
module.exports = StatementRenderer;