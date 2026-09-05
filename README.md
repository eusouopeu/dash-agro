# dash-agro — BRF · Copacol · C.Vale

Comparativo de eficiência operacional, ciclo financeiro e rentabilidade entre
**BRF S.A.** (B3: BRFS3), a **Copacol — Cooperativa Agroindustrial Consolata** e
a **C.Vale — Cooperativa Agroindustrial**, a partir de demonstrações financeiras
auditadas.

Anos com dado real para as três empresas: **2022–2025**. Cada empresa mantém sua
série completa nas tabelas e nos gráficos de evolução: BRF e Copacol 2021–2025,
C.Vale 2022–2025 (sem demonstração anterior nesta base).

Os prazos médios (PME, PMR, PMP, Ciclo Financeiro e Giro do Estoque) podem ser
calculados sobre o saldo final do exercício ou sobre a média com o saldo do
exercício anterior — um seletor "Base de cálculo" alterna entre as duas
convenções no panorama e na tabela de indicadores.

## Seções

| Aba                   | Conteúdo                                                              |
| --------------------- | --------------------------------------------------------------------- |
| Panorama geral        | Cascatas do ciclo financeiro, porte das empresas, séries e quatro blocos de indicadores |
| Tabela de indicadores | Uma tabela por exercício, com ordenação por qualquer coluna            |
| Fontes de dados       | Todas as fontes em formato ABNT NBR 6023:2018, com links               |
| Metodologia           | Fórmulas, premissas de cálculo e limitações do comparativo             |

No desktop a navegação é uma sidebar fixa; abaixo de `lg` ela vira uma barra
inferior só com ícones. Cada aba tem URL própria (`#panorama`, `#indicadores`,
`#fontes`, `#metodologia`).

## Indicadores

**Cobertura completa** — Giro do Estoque · PME · PMR · PMP · Ciclo Financeiro ·
NCG · NCG sobre Receita · Conversão de Caixa (FCO/EBITDA) · Giro do Ativo ·
Margem Operacional · Margem EBITDA · ROIC · Índice de Endividamento Geral ·
Índice de Alavancagem Financeira.

**Cobertura parcial** — Margem Líquida, ROE e ROA (só BRF, falta extrair a
linha de Resultado Líquido/Sobras de Copacol e C.Vale); Intensidade do CAPEX e
CAPEX/Depreciação (só C.Vale); Volume recebido, Receita por Funcionário e
Utilização da Capacidade de Armazenagem (só C.Vale, 2022–2025). Onde falta a
base, o painel mostra "sem dado" e diz o que precisa ser extraído. Nada é
estimado.

Cada indicador tem um botão "?" ao lado do nome, com a fórmula exata e uma
frase no formato "quanto maior/menor o indicador, ..." explicando o sentido —
tanto no panorama quanto na tabela de indicadores. O PMP é marcado como "sem
direção normativa": numa companhia aberta um prazo maior costuma liberar caixa,
mas numa cooperativa o "fornecedor" é em boa parte o próprio associado, e
demorar mais para pagá-lo não é um resultado a comemorar.

As definições exatas estão em `src/metodologia.ts` e aparecem renderizadas na
aba Metodologia.

## Fontes

- **BRF** — CVM Dados Abertos, DFP consolidadas, CD_CVM 016292:
  https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/
- **Copacol** — Relatórios financeiros anuais auditados, obtidos diretamente
  junto à cooperativa (não publicados de forma indexável).
- **C.Vale** — Demonstrações consolidadas dos relatórios de 2023, 2024 e 2025
  (2022 vem da coluna comparativa do relatório de 2023), mais os Relatórios
  Anuais de 2022 a 2025 para os dados operacionais.

Referências completas em `src/referencias.ts`.

## Identidade visual

| Papel      | Cor       |
| ---------- | --------- |
| Papel      | `#F5F3EE` |
| Tinta      | `#171717` |
| Cinza      | `#737373` |
| Assinatura | `#087F8C` |
| Acento     | `#E76F32` |

As marcas de dado usam passos derivados dessas famílias — `#008DA0` (BRF),
`#D45A1E` (Copacol) e `#7A4FA3` (C.Vale) — validados em conjunto para contraste
mínimo de 3:1 sobre o papel e separação sob daltonismo em todos os pares. As
cores da marca original ficam para a interface (sidebar, acentos), não para os
gráficos.

Tipografia: **Archivo** para texto e títulos, **IBM Plex Mono** para todo número,
rótulo e dado tabular.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Recharts · Heroicons

## Rodando localmente

```bash
npm install
npm run dev
```

## Dados pendentes (rentabilidade, dívida, inflação e concorrentes)

Além dos indicadores operacionais, o dashboard já traz a lógica e o layout
prontos para:

- **ROE, ROA, ROIC e estrutura de capital** (dívida líquida/EBITDA, cobertura
  de juros) — faltam os campos `ebit`, `lucroLiquido`, `patrimonioLiquido`,
  `ativoTotal`, `dividaBruta`, `caixaEquivalentes`, `despesaFinanceiraLiquida`
  e `depreciacaoAmortizacao` em `src/data.ts` (procure por `TODO`).
- **Decomposição DuPont do ROE** — calculada automaticamente a partir dos
  mesmos campos acima, sem código adicional.
- **Receita real vs. nominal (IPCA)** — falta preencher `IPCA_ANUAL` em
  `src/inflacao.ts` com a variação anual do IPCA de cada ano.
- **Comparação setorial (benchmarking)** — falta adicionar 1–2 concorrentes
  diretos em `src/concorrentes.ts` (ex.: Atacadão/Carrefour Brasil, GPA).

Enquanto esses valores estiverem `null`/vazios, o dashboard mostra um selo de
"dado pendente" em vez de números incorretos ou gráficos quebrados. Basta
preencher os arquivos indicados — nenhuma outra mudança de código é
necessária.

## Testes
Sobe em http://localhost:5175.

## Deploy

```bash
npm run test
```

Testes unitários (Vitest) para as fórmulas financeiras em `src/data.ts`.

## Deploy

Duas opções:

1. **GitHub Actions (recomendado)** — o workflow em
   `.github/workflows/deploy.yml` já está configurado. Basta:
   - dar push para `main`;
   - em Settings → Pages, selecionar "GitHub Actions" como fonte;
   - todo push em `main` publica automaticamente.
2. **`gh-pages` manual**:
   ```bash
   npm run deploy
   ```
   (usa o pacote `gh-pages`, publica a pasta `dist` na branch `gh-pages`).
Publica `dist/` na branch `gh-pages`. O site fica em
https://eusouopeu.github.io/dash-agro/ — o `base` do Vite precisa continuar
batendo com o nome do repositório.
