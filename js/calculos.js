const CalculadoraFinanceira = {
    taxaAnualParaMensal(taxaAnual) {
        const dec = taxaAnual / 100
        if (dec <= -1) return 0
        return Math.pow(1 + dec, 1 / 12) - 1
    },

    obterAliquotaIR(meses) {
        if (meses <= 6) return 0.225
        if (meses <= 12) return 0.20
        if (meses <= 24) return 0.175
        return 0.15
    },

    simularItem({ id, nome, cor, taxaMensal, taxaAnualDesc, dataAtualizacao = (new Date()).toLocaleDateString('pt-BR'), isentoIR = false, taxaCustodiaAnual = 0, inicial, mensal, meses }) {
        const totalInvestido = inicial + (mensal * meses)
        let saldoBruto = inicial
        const evolucao = [{ mes: 0, saldoBruto: inicial, totalInvestido: inicial }]

        const taxaCustodiaMensal = taxaCustodiaAnual > 0 ? (Math.pow(1 + taxaCustodiaAnual / 100, 1 / 12) - 1) : 0

        for (let m = 1; m <= meses; m++) {
            saldoBruto = saldoBruto * (1 + taxaMensal)
            if (taxaCustodiaMensal > 0) saldoBruto = saldoBruto * (1 - taxaCustodiaMensal)
            saldoBruto += mensal
            evolucao.push({ mes: m, saldoBruto, totalInvestido: inicial + (mensal * m) })
        }

        const lucroBruto = Math.max(0, saldoBruto - totalInvestido)
        const aliquotaIR = isentoIR ? 0 : this.obterAliquotaIR(meses)
        const valorIR = isentoIR ? 0 : (lucroBruto * aliquotaIR)
        const montanteLiquido = saldoBruto - valorIR
        const lucroLiquido = montanteLiquido - totalInvestido
        const rentabilidadeLiquida = totalInvestido > 0 ? ((lucroLiquido / totalInvestido) * 100) : 0

        return {
            id,
            nome,
            cor,
            taxaAnualDesc,
            dataAtualizacao,
            isentoIR,
            aliquotaIR,
            totalInvestido,
            saldoBruto,
            lucroBruto,
            valorIR,
            montanteLiquido,
            lucroLiquido,
            rentabilidadeLiquida,
            evolucao
        }
    },

    executarSimulacao(params, taxas) {
        const { inicial, mensal, meses, percentualCDB, juroRealIpca, percentualLCI } = params
        const selic = taxas.selic.valor
        const cdi = taxas.cdi.valor
        const ipca = taxas.ipca.valor
        const tr = taxas.tr.valor / 100

        const selicMensal = this.taxaAnualParaMensal(selic)
        const resSelic = this.simularItem({
            id: 'selic',
            nome: 'Tesouro Selic',
            cor: '#10b981',
            taxaMensal: selicMensal,
            taxaAnualDesc: `${selic.toFixed(2)}% a.a.`,
            dataAtualizacao: taxas.selic.data,
            isentoIR: false,
            taxaCustodiaAnual: inicial > 10000 ? 0.20 : 0,
            inicial, mensal, meses
        })

        const taxaCDBAnual = cdi * (percentualCDB / 100)
        const cdbMensal = this.taxaAnualParaMensal(taxaCDBAnual)
        const resCDB = this.simularItem({
            id: 'cdb',
            nome: `CDB (${percentualCDB}% CDI)`,
            cor: '#3b82f6',
            taxaMensal: cdbMensal,
            taxaAnualDesc: `${taxaCDBAnual.toFixed(2)}% a.a.`,
            dataAtualizacao: taxas.cdi.data,
            isentoIR: false,
            inicial, mensal, meses
        })

        const taxaNominalIpca = ((1 + (ipca / 100)) * (1 + (juroRealIpca / 100)) - 1) * 100
        const ipcaMensal = this.taxaAnualParaMensal(taxaNominalIpca)
        const resIpca = this.simularItem({
            id: 'ipca',
            nome: `Tesouro IPCA+ (${juroRealIpca}% + IPCA)`,
            cor: '#8b5cf6',
            taxaMensal: ipcaMensal,
            taxaAnualDesc: `${taxaNominalIpca.toFixed(2)}% a.a.`,
            dataAtualizacao: taxas.ipca.data,
            taxaCustodiaAnual: 0.20,
            isentoIR: false,
            inicial, mensal, meses
        })

        const taxaLCIAnual = cdi * (percentualLCI / 100)
        const lciMensal = this.taxaAnualParaMensal(taxaLCIAnual)
        const resLCI = this.simularItem({
            id: 'lci',
            nome: `LCI/LCA (${percentualLCI}% CDI)`,
            cor: '#f97316',
            taxaMensal: lciMensal,
            taxaAnualDesc: `${taxaLCIAnual.toFixed(2)}% a.a. (Isento)`,
            dataAtualizacao: taxas.cdi.data,
            isentoIR: true,
            inicial, mensal, meses
        })

        let poupancaMensal = taxas.poupanca.valor / 100
        if (selic > 8.5) {
            poupancaMensal = (1 + 0.005) * (1 + tr) - 1
        } else {
            poupancaMensal = (1 + this.taxaAnualParaMensal(selic * 0.70)) * (1 + tr) - 1
        }
        const taxaPoupancaAnual = (Math.pow(1 + poupancaMensal, 12) - 1) * 100
        const resPoupanca = this.simularItem({
            id: 'poupanca',
            nome: 'Poupança',
            cor: '#eab308',
            taxaMensal: poupancaMensal,
            taxaAnualDesc: `${taxaPoupancaAnual.toFixed(2)}% a.a. (Isento)`,
            dataAtualizacao: taxas.poupanca.data,
            isentoIR: true,
            inicial, mensal, meses
        })

        const lista = [resSelic, resCDB, resIpca, resLCI, resPoupanca]
        lista.sort((a, b) => b.montanteLiquido - a.montanteLiquido)
        return lista
    }
}

window.CalculadoraFinanceira = CalculadoraFinanceira
