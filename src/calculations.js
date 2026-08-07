
import { IR_TABLE } from './config.js'

export function calcularImpostoRenda(lucro, meses) {
  const faixa = IR_TABLE.find((item) => meses <= item.maxMonths)
  return Math.max(lucro, 0) * faixa.rate
}
export function simularComposto(inicial, aporteMensal, meses, taxaMensal) {
  if (meses <= 0) {
    return { montanteFinal: inicial, totalInvestido: inicial, lucroBruto: 0 }
  }

  let montanteFinal

  if (taxaMensal === 0) {
    montanteFinal = inicial + aporteMensal * meses
  } else {
    const fatorComposto = Math.pow(1 + taxaMensal, meses)
    const montanteInicial = inicial * fatorComposto
    const montanteAportes = aporteMensal * ((fatorComposto - 1) / taxaMensal)
    montanteFinal = montanteInicial + montanteAportes
  }

  const totalInvestido = inicial + aporteMensal * meses
  const lucroBruto = montanteFinal - totalInvestido

  return { montanteFinal, totalInvestido, lucroBruto }
}

export function aplicarImposto(resultado, meses) {
  const imposto = calcularImpostoRenda(resultado.lucroBruto, meses);
  return resultado.montanteFinal - imposto;
}
export function taxaAnualParaMensal(taxaAnualPercentual) {
  const taxaAnual = taxaAnualPercentual / 100
  return Math.pow(1 + taxaAnual, 1 / 12) - 1
}

export function calcularTaxaCDB(percentualCDI, cdiAnualPercentual) {
  const cdiMensal = taxaAnualParaMensal(cdiAnualPercentual)
  return cdiMensal * (percentualCDI / 100)
}

export function calcularTaxaFundoDI(percentualCDI, cdiAnualPercentual, taxaAdminAnualPercentual) {
  const cdiMensal = taxaAnualParaMensal(cdiAnualPercentual)
  const rendimentoBrutoMensal = cdiMensal * (percentualCDI / 100)

  const taxaAdminMensal = taxaAnualParaMensal(taxaAdminAnualPercentual)

  return rendimentoBrutoMensal - taxaAdminMensal
}

export function calcularTaxaIpcaMais(jurRealMensalPercentual, ipcaMensalPercentual) {
  const jurReal = jurRealMensalPercentual / 100
  const ipca = ipcaMensalPercentual / 100

  return (1 + ipca) * (1 + jurReal) - 1
}

export function calcularTaxaPrefixado(taxaAnualPercentual) {
  return taxaAnualParaMensal(taxaAnualPercentual)
}

export function calcularTaxaPoupanca(poupancaMensalPercentual) {
  return poupancaMensalPercentual / 100
}