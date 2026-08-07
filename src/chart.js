let grafico = null

export function inicializarGrafico() {
  const canvas = document.getElementById('graficoRendimento')
  if (!canvas) {
    console.error('Elemento #graficoRendimento não encontrado.')
    return null
  }

  const ctx = canvas.getContext('2d')

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Tesouro Selic',
        'Tesouro IPCA',
        'Poupança',
        'Rentabilidade CDB',
        'Rentabilidade Fundo DI',
        'Tesouro Prefixado',
      ],
      datasets: [{
        label: 'Rendimento Estimado (R$)',
        data: [0, 0, 0, 0, 0, 0],
        borderWidth: 1,
        backgroundColor: '#4FA153',
        borderColor: '#4FA153',
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true },
        y: { type: 'category' },
      },
      plugins: {
        datalabels: {
          anchor: 'center',
          align: 'end',
          color: '#000',
          formatter: (valor) =>
            valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        },
      },
    },
    plugins: [ChartDataLabels],
  })

  return grafico
}

export function atualizarGrafico(valores) {
  if (!grafico) {
    console.warn('Gráfico ainda não inicializado. Ignorando atualização.')
    return
  }

  grafico.data.datasets[0].data = valores
  grafico.update()
}