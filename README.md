# 📈 SimulaInvest | Simulador de Investimentos em Renda Fixa

Aplicação web moderna, intuitiva e precisa para simulação de investimentos em renda fixa no Brasil, conectada em tempo real com as taxas oficiais do **Banco Central do Brasil (BCB)**.

Permite simular aportes iniciais e mensais, comparando lado a lado os ativos mais populares do mercado com cálculos líquidos, desconto do Imposto de Renda regressivo e identificação automática da melhor aplicação financeira.

---

## 🚀 Demonstração

- **Acesse online:** [simulador-de-investimento](https://projeto-simulador-de-investimento.vercel.app/)

---

## ✨ Principais Funcionalidades

### 🏛️ 1. Taxas Oficiais em Tempo Real (API do Banco Central)
O simulador conecta-se diretamente ao **SGS (Sistema Gerenciador de Séries Temporais)** do Banco Central do Brasil para obter as cotações mais recentes:
- **Taxa Selic Meta** (Série 432)
- **Taxa CDI** (Série 4389)
- **IPCA Acumulado 12 Meses** (Série 13522)
- **Rendimento da Poupança** (Série 195)
- **Taxa Referencial - TR** (Série 226)

*Possui suporte a parâmetros personalizáveis no accordion de configurações para cenários futuros e fallback automático caso esteja offline.*

### 💰 2. Comparativo dos 5 Principais Ativos
Calcula e projeta simultaneamente:
1. **Tesouro Selic:** Projeção oficial com dedução da taxa de custódia da B3 (0,20% a.a. para valores superiores a R$ 10.000).
2. **CDB (Certificado de Depósito Bancário):** Rentabilidade configurável (% do CDI).
3. **Tesouro IPCA+:** Ganho real somado à inflação oficial.
4. **LCI / LCA:** Letras de Crédito Imobiliário e do Agronegócio com isenção total de Imposto de Renda.
5. **Poupança:** Regra oficial do Banco Central (Selic > 8,5% ou ≤ 8,5% com adicional da TR), isenta de IR.

### ⚖️ 3. Dedução de Imposto de Renda Real
Aplica rigorosamente a tabela regressiva da Receita Federal sobre o lucro obtido:
- **22,5%** para prazos de até 180 dias (6 meses)
- **20,0%** para prazos de 181 a 360 dias (12 meses)
- **17,5%** para prazos de 361 a 720 dias (24 meses)
- **15,0%** para prazos acima de 720 dias (2 anos)

### 🏆 4. Identificação do Campeão de Rentabilidade
- Card de destaque com a aplicação de **Maior Retorno Líquido**.
- Microanimação de iluminação suave e brilho neon no nome da aplicação vencedora ao calcular.

### 📊 5. Gráficos Interativos e Detalhamento Completo
- **Visualização em Barras:** Comparação entre Total Investido e Montante Líquido Final com cores exclusivas para cada método.
- **Visualização em Linhas:** Evolução temporal do patrimônio acumulado mês a mês.
- **Tabela Analítica Completa:** Visualização explícita de Aplicação, Taxa a.a., Total Aportado, Lucro Líquido (R$ e %), Valor Líquido Final e IR retido, com tooltips informando a data oficial de cada taxa.

---

## 🎨 Cores e Identidade Visual

Cada método de investimento possui uma cor distintiva para facilitar a leitura visual:

| Ativo | Cor | Identificador |
| :--- | :--- | :--- |
| **Tesouro Selic** | Verde Esmeralda | `#10b981` |
| **CDB** | Azul Royal | `#3b82f6` |
| **Tesouro IPCA+** | Roxo / Violeta | `#8b5cf6` |
| **LCI / LCA** | Laranja | `#f97316` |
| **Poupança** | Amarelo Dourado | `#eab308` |

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** Estrutura acessível com metadados e favicon vetorial em SVG.
- **Sass / SCSS Modular:** Arquitetura limpa dividida em componentes parciais (`_base`, `_header`, `_layout`, `_inputs`, `_ranking`, `_hero`, `_grafico`, `_tabela`).
- **CSS3 Moderno:** Variáveis de design tokens, gradientes suaves, glassmorphism e animações fluidas.
- **JavaScript Moderno (ES6+):** Programação modular sem dependências pesadas, separando lógica de dados, requisições de API e manipulação da interface.
- **[Chart.js](https://www.chartjs.org/):** Renderização dos gráficos de evolução patrimonial.
- **[Lucide Icons](https://lucide.dev/):** Conjunto de ícones vetoriais leves e consistentes.

---

## 📂 Estrutura de Arquivos

```text
Projeto-simulacao-investimento/
├── index.html              # Estrutura principal da página
├── favicon.svg             # Favicon vetorial com o símbolo de crescimento
├── README.md               # Documentação do projeto
├── js/
│   ├── api.js              # Integração e fetch com a API do Banco Central (SGS)
│   ├── calculos.js         # Matemática financeira, juros compostos e regras de IR
│   ├── grafico.js          # Configuração e renderização dos gráficos (Chart.js)
│   └── app.js              # Orquestrador de eventos e atualização do DOM
└── styles/
    ├── main.scss           # Arquivo central orquestrador das importações SCSS
    ├── style.scss          # Ponto de entrada do Sass
    ├── style.css           # Estilos compilados consumidos pela aplicação
    ├── _variables.scss     # Cores, espaçamentos e tokens visuais
    ├── _media.scss         # Mixins responsivos de breakpoints
    ├── _base.scss          # Reset e estilizações globais
    ├── _header.scss        # Cabeçalho e logotipo
    ├── _layout.scss        # Grid responsivo e container principal
    ├── _inputs.scss        # Formulário de investimento e accordion de taxas
    ├── _ranking.scss       # Cards do ranking comparativo
    ├── _hero.scss          # Card de destaque da melhor aplicação e animações
    ├── _grafico.scss       # Controles e container do gráfico
    └── _tabela.scss        # Tabela analítica de detalhamento financeiro
```

---

## 💻 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/devLucenaPinheiro/Projeto-simulacao-investimento.git
   ```

2. **Acesse o diretório do projeto:**
   ```bash
   cd Projeto-simulacao-investimento
   ```

3. **Abra o arquivo `index.html`:**
   - Dê um duplo clique no arquivo `index.html` no seu navegador favorito; ou
   - Utilize a extensão **Live Server** no Visual Studio Code para recarregamento automático.

---

## 🌐 Publicação / Deploy

O projeto é 100% estático (HTML, CSS e JS puro) e pode ser hospedado gratuitamente com um único clique em serviços como:
- **[Vercel](https://vercel.com/)** *(Recomendado)*
- **[Cloudflare Pages](https://pages.cloudflare.com/)**
- **[GitHub Pages](https://pages.github.com/)**

---

## 📄 Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT). Sinta-se livre para utilizar, estudar e aprimorar.
