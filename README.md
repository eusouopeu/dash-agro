# dash-agro — Copacol vs. BRF

Comparativo de eficiência operacional, ciclo financeiro e rentabilidade entre
**BRF S.A.** (B3: BRFS3) e a **Copacol — Cooperativa Agroindustrial Consolata**,
a partir de demonstrações financeiras auditadas.

Anos com dado real para as duas empresas: **2021–2024**. A BRF também tem 2020 e
a Copacol também tem 2025 — mantidos nas séries históricas, fora do comparativo
lado a lado.

## Seções

| Aba                   | Conteúdo                                                              |
| --------------------- | --------------------------------------------------------------------- |
| Panorama geral        | Cascata do ciclo financeiro, porte das empresas, séries e comparativos |
| Tabela de indicadores | Uma tabela por exercício, com ordenação por qualquer coluna            |
| Fontes de dados       | Todas as fontes em formato ABNT NBR 6023:2018, com links               |
| Metodologia           | Fórmulas, premissas de cálculo e limitações do comparativo             |

No desktop a navegação é uma sidebar fixa; abaixo de `lg` ela vira uma barra
inferior só com ícones. Cada aba tem URL própria (`#panorama`, `#indicadores`,
`#fontes`, `#metodologia`).

## Indicadores

Giro do Estoque · PME · PMR · PMP · Ciclo Financeiro · NCG · Giro do Ativo ·
Margem EBITDA · ROIC · Alavancagem (Dív. Líq./EBITDA).

As definições exatas estão em `src/metodologia.ts` e aparecem renderizadas na
aba Metodologia.

## Fontes

- **BRF** — CVM Dados Abertos, DFP consolidadas, CD_CVM 016292:
  https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/
- **Copacol** — Relatórios financeiros anuais auditados, obtidos diretamente
  junto à cooperativa (não publicados de forma indexável).

Referências completas em `src/referencias.ts`.

## Identidade visual

| Papel      | Cor       |
| ---------- | --------- |
| Papel      | `#F5F3EE` |
| Tinta      | `#171717` |
| Cinza      | `#737373` |
| Assinatura | `#087F8C` |
| Acento     | `#E76F32` |

As marcas de dado usam passos derivados dessas famílias — `#008DA0` (BRF) e
`#D45A1E` (Copacol) — validados para contraste mínimo de 3:1 sobre o papel e
separação sob daltonismo. As cores da marca original ficam para a interface
(sidebar, acentos), não para os gráficos.

Tipografia: **Archivo** para texto e títulos, **IBM Plex Mono** para todo número,
rótulo e dado tabular.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Recharts · Heroicons

## Rodando localmente

```bash
npm install
npm run dev
```

Sobe em http://localhost:5175.

## Deploy

```bash
npm run deploy
```

Publica `dist/` na branch `gh-pages`. O site fica em
https://eusouopeu.github.io/dash-agro/ — o `base` do Vite precisa continuar
batendo com o nome do repositório.
