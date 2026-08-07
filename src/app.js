import { buscarTodasTaxas } from './bcbApi.js';
import { inicializarGrafico, atualizarGrafico } from './chart.js'
import {
  simularComposto,
  aplicarImposto,
  calcularTaxaCDB,
  calcularTaxaFundoDI,
  calcularTaxaIpcaMais,
  calcularTaxaPrefixado,
  calcularTaxaPoupanca,
} from './calculations.js'

function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getValor(id) {
  return parseFloat(document.getElementById(id).value) || 0
}

async function carregarTaxasNaInterface() {
  const taxas = await buscarTodasTaxas()

  const mapeamento = [
    { input: 'selic', info: '.data-selic', casas: 2, dado: taxas.selic },
    { input: 'cdi', info: '.data-cdi', casas: 2, dado: taxas.cdi },
    { input: 'ipca', info: '.data-ipca', casas: 2, dado: taxas.ipca },
    { input: 'tr', info: '.data-tr', casas: 4, dado: taxas.tr },
    { input: 'poupanca', info: '.data-poupanca', casas: 4, dado: taxas.poupanca },
  ]

  mapeamento.forEach(({ input, info, casas, dado }) => {
    const inputEl = document.getElementById(input)
    const infoEl = document.querySelector(info)

    if (inputEl) {
      inputEl.value = isNaN(dado.valor) ? 'N/A' : dado.valor.toFixed(casas)
    }
    if (infoEl && dado.data) {
      infoEl.title = `Atualizado em: ${dado.data}`
    }
  })
}

function calcularRendimento() {
  const inicial = getValor('inicial')
  const aporteMensal = getValor('mensal')
  const unidade = document.getElementById('periodo-unidade').value

  let meses = getValor('duracao')
  if (unidade === 'anos') {
    meses *= 12
  }

  if (meses <= 0) {
    return
  }

  const cdiAnual = getValor('cdi')
  const selicAnual = getValor('selic')
  const ipcaMensal = getValor('ipca')

  const taxaSelicMensal = Math.pow(1 + selicAnual / 100, 1 / 12) - 1
  const resultSelic = simularComposto(inicial, aporteMensal, meses, taxaSelicMensal)
  const liquidoSelic = aplicarImposto(resultSelic, meses)

  const percentualCDB = getValor('CDB')
  const taxaCDB = calcularTaxaCDB(percentualCDB, cdiAnual)
  const resultCDB = simularComposto(inicial, aporteMensal, meses, taxaCDB)
  const liquidoCDB = aplicarImposto(resultCDB, meses)

  const percentualFundoDI = getValor('rentDi')
  const taxaAdminDI = getValor('admDi')
  const taxaFundoDI = calcularTaxaFundoDI(percentualFundoDI, cdiAnual, taxaAdminDI)
  const resultFundoDI = simularComposto(inicial, aporteMensal, meses, taxaFundoDI)
  const liquidoFundoDI = aplicarImposto(resultFundoDI, meses)

  const jurRealIpca = getValor('tesouro-ipca')
  const taxaIpcaMais = calcularTaxaIpcaMais(jurRealIpca, ipcaMensal)
  const resultIpcaMais = simularComposto(inicial, aporteMensal, meses, taxaIpcaMais)
  const liquidoIpcaMais = aplicarImposto(resultIpcaMais, meses)


  const taxaPrefixadaAnual = getValor('tesouroPrefix')
  const taxaPrefixadaMensal = calcularTaxaPrefixado(taxaPrefixadaAnual)
  const resultPrefixado = simularComposto(inicial, aporteMensal, meses, taxaPrefixadaMensal)
  const liquidoPrefixado = aplicarImposto(resultPrefixado, meses)

  const poupancaMensal = getValor('poupanca')
  const taxaPoupanca = calcularTaxaPoupanca(poupancaMensal)
  const resultPoupanca = simularComposto(inicial, aporteMensal, meses, taxaPoupanca)
  const liquidoPoupanca = resultPoupanca.montanteFinal

  atualizarGrafico([
    liquidoSelic,
    liquidoIpcaMais,
    liquidoPoupanca,
    liquidoCDB,
    liquidoFundoDI,
    liquidoPrefixado,
  ])

  atualizarTextosResultado({
    selic: liquidoSelic,
    tesouroIpca: liquidoIpcaMais,
    poupanca: liquidoPoupanca,
    cdb: liquidoCDB,
    fundoDI: liquidoFundoDI,
    prefixado: liquidoPrefixado,
  })
}

function atualizarTextosResultado(valores) {
  const mapa = {
    'resultado-selic': `Rendimento Selic: ${formatarValor(valores.selic)}`,
    'resultado-tesouro-ipca': `Rendimento Tesouro IPCA: ${formatarValor(valores.tesouroIpca)}`,
    'resultado-poupanca': `Rendimento na poupança: ${formatarValor(valores.poupanca)}`,
    'resultado-cdb': `Rendimento CDB: ${formatarValor(valores.cdb)}`,
    'resultado-fundo-di': `Rendimento Fundo DI: ${formatarValor(valores.fundoDI)}`,
    'resultado-tesouro-prefixado': `Rendimento Tesouro Prefixado: ${formatarValor(valores.prefixado)}`,
  }

  Object.entries(mapa).forEach(([id, texto]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = texto
  })
}
function debounce(fn, delay = 250) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const calcularComDebounce = debounce(calcularRendimento, 250)

window.addEventListener('DOMContentLoaded', async () => {
  inicializarGrafico()
  await carregarTaxasNaInterface()
  calcularRendimento()

  document.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('input', calcularComDebounce);
  })
})