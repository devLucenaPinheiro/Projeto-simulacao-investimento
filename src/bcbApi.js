import { BCB_SERIES, BCB_BASE_URL } from './config.js'

async function fetchUltimoValor(serieCode) {
  const url = `${BCB_BASE_URL}.${serieCode}/dados/ultimos/1?formato=json`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    const ultimo = data[data.length - 1]

    return {
      valor: parseFloat(ultimo?.valor),
      data: ultimo?.data ?? null,
    }
  } catch (error) {
    console.error(`Erro ao buscar série ${serieCode}:`, error)
    return { valor: NaN, data: null }
  }
}

export async function buscarTodasTaxas() {
  const [selic, cdi, ipca, tr, poupanca] = await Promise.all([
    fetchUltimoValor(BCB_SERIES.selic),
    fetchUltimoValor(BCB_SERIES.cdi),
    fetchUltimoValor(BCB_SERIES.ipca),
    fetchUltimoValor(BCB_SERIES.tr),
    fetchUltimoValor(BCB_SERIES.poupanca),
  ])

  return { selic, cdi, ipca, tr, poupanca }
}