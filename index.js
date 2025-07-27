const { readFileSync } = require('fs');

// Funções globais que não pertencem à classe de cálculo
function getPeca(apresentacao, pecas) {
    return pecas[apresentacao.id];
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
        {
            style: "currency", currency: "BRL",
            minimumFractionDigits: 2
        }).format(valor / 100);
}

// Classe de Serviço para agrupar as lógicas de cálculo
class ServicoCalculoFatura {
    
    calcularCredito(apre, pecas) {
        let creditosDaApresentacao = 0;
        creditosDaApresentacao += Math.max(apre.audiencia - 30, 0);
        if (getPeca(apre, pecas).tipo === "comedia") {
            creditosDaApresentacao += Math.floor(apre.audiencia / 5);
        }
        return creditosDaApresentacao;
    }

    calcularTotalApresentacao(apre, pecas) {
        let total = 0;
        // Chamada para função global getPeca
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
                // Chamada para função global getPeca
                throw new Error(`Peça desconhecia: ${getPeca(apre, pecas).tipo}`);
        }
        return total;
    }

    calcularTotalFatura(pecas, apresentacoes) {
        let totalGeral = 0;
        for (let apre of apresentacoes) {
            // Chamada para outro método da CLASSE (USA 'this.')
            totalGeral += this.calcularTotalApresentacao(apre, pecas);
        }
        return totalGeral;
    }

    calcularTotalCreditos(pecas, apresentacoes) {
        let creditosGerais = 0;
        for (let apre of apresentacoes) {
            // Chamada para outro método da CLASSE (USA 'this.')
            creditosGerais += this.calcularCredito(apre, pecas);
        }
        return creditosGerais;
    }
}

function gerarFaturaStr(fatura, pecas, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;

    for (let apre of fatura.apresentacoes) {
        let total = calc.calcularTotalApresentacao(apre, pecas);
        faturaStr += `   ${getPeca(apre, pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
    }

    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

/*
// Função gerarFaturaHTML comentada para este commit
function gerarFaturaHTML(fatura, pecas, calc) { // Adicionado 'calc' como parâmetro
    let htmlStr = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;

    for (let apre of fatura.apresentacoes) {
        let total = calc.calcularTotalApresentacao(apre, pecas);
        htmlStr += `<li> ${getPeca(apre, pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
    }

    htmlStr += `</ul>\n`;
    htmlStr += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
    htmlStr += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`;
    htmlStr += `</html>`;

    return htmlStr;
}
*/

// Execução do programa
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const calc = new ServicoCalculoFatura(); 

const faturaStr = gerarFaturaStr(faturas, pecas, calc); 
console.log(faturaStr);

// const faturaHTML = gerarFaturaHTML(faturas, pecas, calc); // Chamada comentada
// console.log(faturaHTML); // Chamada comentada