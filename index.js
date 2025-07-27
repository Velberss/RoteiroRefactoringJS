const { readFileSync } = require('fs');

function getPeca(apresentacao, pecas) {
    return pecas[apresentacao.id];
}

function calcularCredito(apre, pecas) { // pecas adicionado como parâmetro
    let creditosDaApresentacao = 0;
    creditosDaApresentacao += Math.max(apre.audiencia - 30, 0);
    // Ajuste aqui: getPeca precisa de 'pecas'
    if (getPeca(apre, pecas).tipo === "comedia") {
        creditosDaApresentacao += Math.floor(apre.audiencia / 5);
    }
    return creditosDaApresentacao;
}

function calcularTotalApresentacao(apre, pecas) { // pecas adicionado como parâmetro
    let total = 0;
    // Ajuste aqui: getPeca precisa de 'pecas'
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
            // Ajuste aqui: getPeca precisa de 'pecas'
            throw new Error(`Peça desconhecia: ${getPeca(apre, pecas).tipo}`);
    }
    return total;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
        {
            style: "currency", currency: "BRL",
            minimumFractionDigits: 2
        }).format(valor / 100);
}

function calcularTotalFatura(pecas, apresentacoes) { // pecas e apresentacoes adicionados como parâmetros
    let totalGeral = 0;
    // Ajuste aqui: usar 'apresentacoes' do parâmetro
    for (let apre of apresentacoes) {
        // Ajuste aqui: calcularTotalApresentacao precisa de 'apre' e 'pecas'
        totalGeral += calcularTotalApresentacao(apre, pecas);
    }
    return totalGeral;
}

function calcularTotalCreditos(pecas, apresentacoes) { // pecas e apresentacoes adicionados como parâmetros
    let creditosGerais = 0;
    // Ajuste aqui: usar 'apresentacoes' do parâmetro
    for (let apre of apresentacoes) {
        // Ajuste aqui: calcularCredito precisa de 'apre' e 'pecas'
        creditosGerais += calcularCredito(apre, pecas);
    }
    return creditosGerais;
}

function gerarFaturaStr(fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;

    for (let apre of fatura.apresentacoes) {
        // Chamadas já estão corretas aqui
        let total = calcularTotalApresentacao(apre, pecas);
        faturaStr += `   ${getPeca(apre, pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
    }

    // Chamadas já estão corretas aqui
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
    let htmlStr = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;

    for (let apre of fatura.apresentacoes) {
        let total = calcularTotalApresentacao(apre, pecas); // Reusa a função de cálculo
        htmlStr += `<li> ${getPeca(apre, pecas).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`; // Reusa funções
    }

    htmlStr += `</ul>\n`;
    htmlStr += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`; // Reusa funções
    htmlStr += `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`; // Reusa funções
    htmlStr += `</html>`;

    return htmlStr;
}


// Execução do programa
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML);