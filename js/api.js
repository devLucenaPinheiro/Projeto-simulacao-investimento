const dataPadraoBcb = new Date().toLocaleDateString('pt-BR')

const ApiBCB = {
    taxas: {
        selic: { valor: 13.75, data: dataPadraoBcb, serie: '432', status: 'padrao' },
        cdi: { valor: 13.65, data: dataPadraoBcb, serie: '4389', status: 'padrao' },
        ipca: { valor: 4.22, data: dataPadraoBcb, serie: '13522', status: 'padrao' },
        tr: { valor: 0.1332, data: dataPadraoBcb, serie: '226', status: 'padrao' },
        poupanca: { valor: 0.6339, data: dataPadraoBcb, serie: '195', status: 'padrao' }
    },

    async buscarTaxas(onStatusChange) {
        if (onStatusChange) onStatusChange('carregando')

        const series = [
            { chave: 'selic', id: 432, padrao: 13.75 },
            { chave: 'cdi', id: 4389, padrao: 13.65 },
            { chave: 'ipca', id: 13522, padrao: 4.22 },
            { chave: 'tr', id: 226, padrao: 0.1332 },
            { chave: 'poupanca', id: 195, padrao: 0.6339 }
        ]

        let teveSucesso = false

        await Promise.allSettled(series.map(async (serie) => {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 5000)
                
                const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie.id}/dados/ultimos/1?formato=json`
                const res = await fetch(url, { signal: controller.signal })
                clearTimeout(timeoutId)

                if (!res.ok) throw new Error('Erro na requisição')
                const dados = await res.json()

                if (Array.isArray(dados) && dados[0]?.valor) {
                    const num = parseFloat(dados[0].valor)
                    if (!isNaN(num)) {
                        this.taxas[serie.chave] = {
                            valor: num,
                            data: dados[0].data,
                            serie: serie.id.toString(),
                            status: 'online'
                        }
                        teveSucesso = true
                    }
                }
            } catch (e) {
                this.taxas[serie.chave].status = 'fallback'
                if (!this.taxas[serie.chave].data || this.taxas[serie.chave].data.includes('Carregando')) {
                    this.taxas[serie.chave].data = dataPadraoBcb
                }
            }
        }))

        if (onStatusChange) {
            onStatusChange(teveSucesso ? 'online' : 'offline', this.taxas)
        }

        return this.taxas
    },

    formatarMoeda(valor) {
        if (isNaN(valor) || valor === null || valor === undefined) return 'R$ 0,00'
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },

    formatarPercentual(valor, decimais = 2) {
        if (isNaN(valor) || valor === null) return '0,00%'
        return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais })}%`
    }
}

window.ApiBCB = ApiBCB
