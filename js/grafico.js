const GerenciadorGrafico = {
    instancia: null,
    tipoAtual: 'barras',

    formatarLabel(nome) {
        if (nome.includes('(') && nome.includes(')')) {
            const idx = nome.indexOf('(')
            return [nome.slice(0, idx).trim(), nome.slice(idx).trim()]
        }
        return nome
    },

    renderizar(resultados, tipo = this.tipoAtual) {
        const canvas = document.getElementById('graficoCanvas')
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        if (tipo === 'barras') {
            const labelsFormatados = resultados.map(r => this.formatarLabel(r.nome))
            const dadosInvestido = resultados.map(r => r.totalInvestido)
            const dadosLiquido = resultados.map(r => r.montanteLiquido)
            const coresLiquido = resultados.map(r => r.cor)

            if (this.instancia && this.tipoAtual === 'barras') {
                this.instancia.data.labels = labelsFormatados
                this.instancia.data.datasets[0].data = dadosInvestido
                this.instancia.data.datasets[1].data = dadosLiquido
                this.instancia.data.datasets[1].backgroundColor = coresLiquido
                this.instancia.reset()
                this.instancia.update()
                return
            }

            if (this.instancia) {
                this.instancia.destroy()
            }
            this.tipoAtual = 'barras'

            this.instancia = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labelsFormatados,
                    datasets: [
                        {
                            label: 'Investido',
                            data: dadosInvestido,
                            backgroundColor: '#475569',
                            borderRadius: 6
                        },
                        {
                            label: 'Líquido Final',
                            data: dadosLiquido,
                            backgroundColor: coresLiquido,
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 800,
                        easing: 'easeOutQuart'
                    },
                    animations: {
                        y: {
                            duration: 800,
                            easing: 'easeOutQuart'
                        }
                    },
                    indexAxis: window.innerWidth < 640 ? 'y' : 'x',
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: '#94a3b8', font: { size: 12 }, usePointStyle: true }
                        },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderWidth: 1,
                            callbacks: {
                                title: (items) => {
                                    if (!items.length) return ''
                                    const item = items[0]
                                    const label = item.chart.data.labels[item.dataIndex]
                                    return Array.isArray(label) ? label.join(' ') : label
                                },
                                label: (c) => ` ${c.dataset.label}: ${window.ApiBCB.formatarMoeda(c.raw)}`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(51, 65, 85, 0.3)' },
                            ticks: {
                                color: '#94a3b8',
                                maxRotation: 0,
                                minRotation: 0,
                                autoSkip: false,
                                font: { size: 11, weight: '500' }
                            }
                        },
                        y: {
                            grid: { color: 'rgba(51, 65, 85, 0.3)' },
                            ticks: {
                                color: '#94a3b8',
                                callback: (v) => 'R$ ' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
                            }
                        }
                    }
                }
            })
        } else {
            const meses = resultados[0].evolucao.length - 1
            const passo = meses > 24 ? Math.ceil(meses / 12) : 1
            const pontos = []
            for (let i = 0; i <= meses; i += passo) pontos.push(i)
            if (pontos[pontos.length - 1] !== meses) pontos.push(meses)

            const datasets = resultados.map(r => ({
                label: r.nome,
                data: pontos.map(p => r.evolucao[p]?.saldoBruto || 0),
                borderColor: r.cor,
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: meses > 12 ? 0 : 2,
                tension: 0.15
            }))

            datasets.unshift({
                label: 'Aportado',
                data: pontos.map(p => resultados[0].evolucao[p]?.totalInvestido || 0),
                borderColor: '#64748b',
                borderDash: [4, 4],
                borderWidth: 1.5,
                pointRadius: 0
            })

            if (this.instancia && this.tipoAtual === 'linhas') {
                this.instancia.data.labels = pontos.map(p => `Mês ${p}`)
                this.instancia.data.datasets = datasets
                this.instancia.update()
                return
            }

            if (this.instancia) {
                this.instancia.destroy()
            }
            this.tipoAtual = 'linhas'

            this.instancia = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: pontos.map(p => `Mês ${p}`),
                    datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 800,
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true }
                        },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderWidth: 1,
                            callbacks: {
                                label: (c) => ` ${c.dataset.label}: ${window.ApiBCB.formatarMoeda(c.raw)}`
                            }
                        }
                    },
                    scales: {
                        x: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', maxTicksLimit: 8 } },
                        y: {
                            grid: { color: 'rgba(51, 65, 85, 0.3)' },
                            ticks: {
                                color: '#94a3b8',
                                callback: (v) => 'R$ ' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
                            }
                        }
                    }
                }
            })
        }
    }
}

window.GerenciadorGrafico = GerenciadorGrafico
