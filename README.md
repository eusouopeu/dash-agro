# Dashboard Operacional — Assaí Atacadista

Análise de indicadores operacionais (eficiência de estoque e ciclo de caixa
operacional) do Assaí Atacadista (B3: ASAI3) entre 2020 e 2024, a partir de
dados públicos.

## Indicadores

- Giro do estoque e PME (prazo médio de estocagem)
- PMR (prazo médio de recebimento) e PMP (prazo médio de pagamento)
- Ciclo de caixa operacional
- Necessidade de Capital de Giro (NCG)

## Fonte dos dados

CVM — Dados Abertos, Demonstrações Financeiras Padronizadas (DFP) de Sendas
Distribuidora S.A. (CD_CVM 025372): https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/

A CVM só recebe demonstrações **individuais** (não consolidadas) dessa
empresa em todo o período 2020–2024 — é a única base disponível, e por isso
é a usada aqui de forma consistente nos 5 anos. Fórmulas e premissas
completas na seção "Premissas e fontes" do próprio dashboard e em
`src/data.ts`.

## Stack

React + TypeScript + Vite + Tailwind CSS + Recharts + Heroicons, fonte
Montserrat.

## Rodando localmente

```bash
npm install
npm run dev
```

## Testes

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
