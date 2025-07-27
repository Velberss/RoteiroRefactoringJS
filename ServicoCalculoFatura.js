// ServicoCalculoFatura.js

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
        // Note: getPeca ainda é uma função global por enquanto, então não usa 'this.' aqui.
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
        // Note: getPeca ainda é uma função global por enquanto, então não usa 'this.' aqui.
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
            // Chamada para outro método da MESMA CLASSE (USA 'this.')
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
            // Chamada para outro método da MESMA CLASSE (USA 'this.')
            creditosGerais += this.calcularCredito(apre, pecas);
        }
        return creditosGerais;
    }
}

// Exporta a classe para que outros arquivos possam importá-la
module.exports = ServicoCalculoFatura;