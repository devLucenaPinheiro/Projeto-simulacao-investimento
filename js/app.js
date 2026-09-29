document.addEventListener('DOMContentLoaded', () => {
    let ultimosResultados = []

    const inputInicial = document.getElementById('valor-inicial')
    const inputMensal = document.getElementById('valor-mensal')
    const inputPeriodo = document.getElementById('valor-periodo')
    const selectUnidade = document.getElementById('unidade-periodo')

    const inputSelic = document.getElementById('taxa-selic')
    const inputCdi = document.getElementById('taxa-cdi')
    const inputIpcaTaxa = document.getElementById('taxa-ipca')
    const inputPoupanca = document.getElementById('taxa-poupanca')
    const inputTr = document.getElementById('taxa-tr')

    const inputCdb = document.getElementById('param-cdb')
    const inputIpca = document.getElementById('param-ipca')
    const inputLci = document.getElementById('param-lci')

    const btnGraficoBarras = document.getElementById('btn-grafico-barras')
    const btnGraficoLinhas = document.getElementById('btn-grafico-linhas')

    function atualizarSimulacao() {
        const inicial = Math.max(0, parseFloat(inputInicial.value) || 0)
        const mensal = Math.max(0, parseFloat(inputMensal.value) || 0)
        const periodo = Math.max(1, parseFloat(inputPeriodo.value) || 1)
        const meses = selectUnidade.value === 'anos' ? Math.round(periodo * 12) : Math.round(periodo)

        if (inputSelic) window.ApiBCB.taxas.selic.valor = parseFloat(inputSelic.value) || window.ApiBCB.taxas.selic.valor
        if (inputCdi) window.ApiBCB.taxas.cdi.valor = parseFloat(inputCdi.value) || window.ApiBCB.taxas.cdi.valor
        if (inputIpcaTaxa) window.ApiBCB.taxas.ipca.valor = parseFloat(inputIpcaTaxa.value) || window.ApiBCB.taxas.ipca.valor
        if (inputPoupanca) window.ApiBCB.taxas.poupanca.valor = parseFloat(inputPoupanca.value) || window.ApiBCB.taxas.poupanca.valor
        if (inputTr) window.ApiBCB.taxas.tr.valor = parseFloat(inputTr.value) || window.ApiBCB.taxas.tr.valor

        const params = {
            inicial,
            mensal,
            meses,
            percentualCDB: parseFloat(inputCdb?.value) || 100,
            juroRealIpca: parseFloat(inputIpca?.value) || 6.5,
            percentualLCI: parseFloat(inputLci?.value) || 90
        }

        const resultados = window.CalculadoraFinanceira.executarSimulacao(params, window.ApiBCB.taxas)
        ultimosResultados = resultados

        const campeao = resultados[0]
        const elemMelhorNome = document.getElementById('destaque-melhor-nome')
        const elemMelhorTotal = document.getElementById('destaque-melhor-total')
        const elemMelhorLucro = document.getElementById('destaque-melhor-lucro')
        const elemTotalInvestido = document.getElementById('destaque-total-investido')

        if (elemMelhorNome) {
            elemMelhorNome.textContent = campeao.nome
            elemMelhorNome.classList.remove('glow-text-anim')
            void elemMelhorNome.offsetWidth
            elemMelhorNome.classList.add('glow-text-anim')
        }
        if (elemMelhorTotal) elemMelhorTotal.textContent = window.ApiBCB.formatarMoeda(campeao.montanteLiquido)
        if (elemMelhorLucro) elemMelhorLucro.textContent = `+${window.ApiBCB.formatarMoeda(campeao.lucroLiquido)} (+${window.ApiBCB.formatarPercentual(campeao.rentabilidadeLiquida)})`
        if (elemTotalInvestido) elemTotalInvestido.textContent = window.ApiBCB.formatarMoeda(campeao.totalInvestido)

        const cardCampeao = document.querySelector('.hero-highlight')
        if (cardCampeao) {
            cardCampeao.classList.remove('glow-anim')
            void cardCampeao.offsetWidth
            cardCampeao.classList.add('glow-anim')
        }

        const containerLista = document.getElementById('lista-investimentos')
        if (containerLista) {
            containerLista.innerHTML = ''
            resultados.forEach((item, index) => {
                const ehPrimeiro = index === 0
                const card = document.createElement('div')
                card.className = `ranking-card ${ehPrimeiro ? 'champion' : ''}`

                card.innerHTML = `
                    <div class="card-info">
                        <div class="color-indicator" style="background-color: ${item.cor}"></div>
                        <div class="name-group">
                            <div class="name-row">
                                <h4>${item.nome}</h4>
                                ${ehPrimeiro ? '<span class="champion-badge">1º Lugar</span>' : ''}
                                ${item.isentoIR ? '<span class="tax-exempt">Isento IR</span>' : ''}
                            </div>
                            <div class="rate-label flex-items">
                                <span>${item.taxaAnualDesc}</span>
                                <span class="info-tooltip">
                                    <i data-lucide="info"></i>
                                    <span class="tooltip-text">Atualizado pelo BCB em: ${item.dataAtualizacao || (new Date()).toLocaleDateString('pt-BR')}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card-values">
                        <span class="net-amount ${ehPrimeiro ? 'champion-text' : ''}">
                            ${window.ApiBCB.formatarMoeda(item.montanteLiquido)}
                        </span>
                        <span class="profit-badge">
                            +${window.ApiBCB.formatarMoeda(item.lucroLiquido)}
                        </span>
                    </div>
                `
                containerLista.appendChild(card)
            })
        }

        window.GerenciadorGrafico.renderizar(resultados)

        const tbody = document.getElementById('tabela-detalhada-corpo')
        if (tbody) {
            tbody.innerHTML = ''
            resultados.forEach(item => {
                const tr = document.createElement('tr')
                tr.innerHTML = `
                    <td class="font-medium">${item.nome}</td>
                    <td class="mono-cell flex-cell">
                        <span>${item.taxaAnualDesc}</span>
                        <span class="info-tooltip">
                            <i data-lucide="info"></i>
                            <span class="tooltip-text">BCB: ${item.dataAtualizacao || (new Date()).toLocaleDateString('pt-BR')}</span>
                        </span>
                    </td>
                    <td>${window.ApiBCB.formatarMoeda(item.totalInvestido)}</td>
                    <td class="profit-cell">+${window.ApiBCB.formatarMoeda(item.lucroLiquido)} <span class="profit-pct">(+${window.ApiBCB.formatarPercentual(item.rentabilidadeLiquida)})</span></td>
                    <td class="highlight-cell">${window.ApiBCB.formatarMoeda(item.montanteLiquido)}</td>
                    <td class="mono-cell">${item.isentoIR ? 'Isento' : window.ApiBCB.formatarMoeda(item.valorIR)}</td>
                `
                tbody.appendChild(tr)
            })
        }

        if (window.lucide) {
            window.lucide.createIcons()
        }
    }

    if (btnGraficoBarras) {
        btnGraficoBarras.addEventListener('click', () => {
            btnGraficoBarras.classList.add('active')
            btnGraficoLinhas.classList.remove('active')
            window.GerenciadorGrafico.renderizar(ultimosResultados, 'barras')
        })
    }

    if (btnGraficoLinhas) {
        btnGraficoLinhas.addEventListener('click', () => {
            btnGraficoLinhas.classList.add('active')
            btnGraficoBarras.classList.remove('active')
            window.GerenciadorGrafico.renderizar(ultimosResultados, 'linhas')
        })
    }

    const inputsMonitorados = [
        inputInicial, inputMensal, inputPeriodo, selectUnidade,
        inputSelic, inputCdi, inputIpcaTaxa, inputPoupanca, inputTr,
        inputCdb, inputIpca, inputLci
    ]
    inputsMonitorados.forEach(inp => {
        if (!inp) return
        inp.addEventListener('input', atualizarSimulacao)
        inp.addEventListener('change', atualizarSimulacao)
    })

    function atualizarStatusBcb(status, taxas) {
        if (taxas && (status === 'online' || status === 'offline')) {
            if (inputSelic) inputSelic.value = taxas.selic.valor.toFixed(2)
            if (inputCdi) inputCdi.value = taxas.cdi.valor.toFixed(2)
            if (inputIpcaTaxa) inputIpcaTaxa.value = taxas.ipca.valor.toFixed(2)
            if (inputPoupanca) inputPoupanca.value = taxas.poupanca.valor.toFixed(4)
            if (inputTr) inputTr.value = taxas.tr.valor.toFixed(4)

            const setTip = (id, data, serie) => {
                const el = document.getElementById(id)
                if (el) el.textContent = `Atualizado pelo BCB (SGS ${serie}) em: ${data}`
            }
            setTip('tip-selic', taxas.selic.data, '432')
            setTip('tip-cdi', taxas.cdi.data, '4389')
            setTip('tip-ipca', taxas.ipca.data, '13522')
            setTip('tip-poupanca', taxas.poupanca.data, '195')
            setTip('tip-tr', taxas.tr.data, '226')
        }

        if (window.lucide) {
            window.lucide.createIcons()
        }
    }

    window.ApiBCB.buscarTaxas(atualizarStatusBcb).then(() => {
        atualizarSimulacao()
    })
})
