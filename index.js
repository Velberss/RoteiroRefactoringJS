const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }

  function calcularCredito(apre) {
    let creditosDaApresentacao = 0;
    creditosDaApresentacao += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre).tipo === "comedia") {
      creditosDaApresentacao += Math.floor(apre.audiencia / 5);
    }
    return creditosDaApresentacao;
  }

  function calcularTotalApresentacao(apre) {
    let total = 0;
    switch (getPeca(apre).tipo) {
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
        throw new Error(`Peça desconhecia: ${getPeca(apre).tipo}`);
    }
    return total;
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
      {
        style: "currency", currency: "BRL",
        minimumFractionDigits: 2
      }).format(valor / 100); // Já divide por 100 aqui
  }

  function calcularTotalFatura() {
    let totalGeral = 0;
    for (let apre of fatura.apresentacoes) {
      totalGeral += calcularTotalApresentacao(apre);
    }
    return totalGeral;
  }

  function calcularTotalCreditos() {
    let creditosGerais = 0;
    for (let apre of fatura.apresentacoes) {
      creditosGerais += calcularCredito(apre);
    }
    return creditosGerais;
  }

  for (let apre of fatura.apresentacoes) {
    // Note que só precisamos do 'total' aqui para a linha individual da fatura
    let total = calcularTotalApresentacao(apre);
    faturaStr += `   ${getPeca(apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
  }
  // As somas totais são feitas pelas novas funções extraídas
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura())}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos()} \n`;
  return faturaStr;
}

// Execução do programa
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);