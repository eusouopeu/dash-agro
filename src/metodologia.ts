// Fórmulas e premissas de cálculo, estruturadas para renderização.
//
// Cada fórmula é escrita como fração (numerador / denominador) ou como
// expressão linear, para que a interface possa desenhá-la como fração de
// verdade em vez de uma linha de texto.

import type { AnnualIndicators } from './data'

export interface Formula {
  key: keyof AnnualIndicators
  nome: string
  sigla?: string
  /** Fração: numerador sobre denominador. */
  numerador?: string
  denominador?: string
  /** Fator multiplicado depois da fração (ex.: × 365). */
  fator?: string
  /** Alternativa à fração, para fórmulas que são somas/subtrações. */
  expressao?: string
  unidade: string
  /** O que o número quer dizer, em uma frase. */
  leitura: string
  melhor: 'maior' | 'menor'
}

export const formulas: Formula[] = [
  {
    key: 'giroEstoque',
    nome: 'Giro do Estoque',
    numerador: 'CMV',
    denominador: 'Estoques',
    unidade: 'vezes por ano (x)',
    leitura: 'Quantas vezes o estoque inteiro é vendido e reposto ao longo do exercício.',
    melhor: 'maior',
  },
  {
    key: 'pmeDias',
    nome: 'Prazo Médio de Estocagem',
    sigla: 'PME',
    numerador: 'Estoques',
    denominador: 'CMV',
    fator: '× 365',
    unidade: 'dias',
    leitura: 'Quantos dias uma mercadoria fica parada no estoque antes de ser vendida.',
    melhor: 'menor',
  },
  {
    key: 'pmrDias',
    nome: 'Prazo Médio de Recebimento',
    sigla: 'PMR',
    numerador: 'Contas a Receber',
    denominador: 'Receita Líquida',
    fator: '× 365',
    unidade: 'dias',
    leitura: 'Quantos dias a empresa espera para receber de um cliente depois da venda.',
    melhor: 'menor',
  },
  {
    key: 'pmpDias',
    nome: 'Prazo Médio de Pagamento',
    sigla: 'PMP',
    numerador: 'Fornecedores',
    denominador: 'CMV',
    fator: '× 365',
    unidade: 'dias',
    leitura: 'Quantos dias a empresa leva para pagar seus fornecedores. Prazo maior financia o giro.',
    melhor: 'maior',
  },
  {
    key: 'cicloFinanceiroDias',
    nome: 'Ciclo Financeiro',
    sigla: 'Ciclo de Caixa Operacional',
    expressao: 'PME + PMR − PMP',
    unidade: 'dias',
    leitura:
      'Dias entre pagar o fornecedor e receber do cliente. Negativo significa que o fornecedor financia a operação.',
    melhor: 'menor',
  },
  {
    key: 'ncg',
    nome: 'Necessidade de Capital de Giro',
    sigla: 'NCG',
    expressao: '(Contas a Receber + Estoques) − Fornecedores',
    unidade: 'R$',
    leitura: 'Quanto de caixa próprio a operação exige para funcionar, fora o financiamento de fornecedores.',
    melhor: 'menor',
  },
  {
    key: 'giroAtivo',
    nome: 'Giro do Ativo',
    numerador: 'Receita Líquida',
    denominador: 'Ativo Total',
    unidade: 'vezes por ano (x)',
    leitura: 'Quanta receita cada real de ativo gera no ano.',
    melhor: 'maior',
  },
  {
    key: 'margemOperacional',
    nome: 'Margem Operacional',
    numerador: 'EBIT',
    denominador: 'Receita Líquida',
    unidade: '%',
    leitura: 'Quanto sobra da receita depois dos custos e despesas da operação, antes de juros e impostos.',
    melhor: 'maior',
  },
  {
    key: 'margemEbitda',
    nome: 'Margem EBITDA',
    numerador: 'EBITDA',
    denominador: 'Receita Líquida',
    unidade: '%',
    leitura: 'Quanto sobra da receita como geração de caixa operacional, antes de juros, impostos e depreciação.',
    melhor: 'maior',
  },
  {
    key: 'roic',
    nome: 'Retorno sobre o Capital Investido',
    sigla: 'ROIC',
    numerador: 'EBIT × (1 − alíquota efetiva)',
    denominador: 'Dívida Líquida + Patrimônio Líquido',
    unidade: '%',
    leitura: 'Quanto o capital investido no negócio rende depois de impostos.',
    melhor: 'maior',
  },
  {
    key: 'endividamento',
    nome: 'Índice de Endividamento',
    numerador: 'Ativo Total − Patrimônio Líquido',
    denominador: 'Ativo Total',
    unidade: '%',
    leitura: 'Quanto do ativo é financiado por capital de terceiros em vez de capital próprio.',
    melhor: 'menor',
  },
  {
    key: 'alavancagem',
    nome: 'Alavancagem',
    sigla: 'Dív. Líq. / EBITDA',
    numerador: 'Dívida Líquida',
    denominador: 'EBITDA',
    unidade: 'vezes (x)',
    leitura: 'Quantos anos de geração de caixa atual seriam necessários para quitar a dívida líquida.',
    melhor: 'menor',
  },
]

export interface BlocoPremissas {
  titulo: string
  base: string
  itens: string[]
}

export const premissas: BlocoPremissas[] = [
  {
    titulo: 'Premissas gerais',
    base: 'Válidas para as duas empresas, para manter a comparação legítima.',
    itens: [
      'Todos os valores são consolidados e vêm de demonstrações auditadas, em R$ mil, exatamente como reportado — sem arredondamento ou reexpressão por inflação.',
      'Os prazos médios usam o saldo final do exercício, não a média entre abertura e fechamento. A convenção é a mesma nas duas empresas.',
      'Contas a Receber e Fornecedores usam apenas o saldo circulante, nas duas empresas.',
      'O ano comercial é de 365 dias, sem ajuste para anos bissextos.',
      'A comparação lado a lado cobre 2021–2024, os únicos exercícios com dado real para as duas empresas. A BRF tem 2020 e a Copacol tem 2025, mantidos nas séries históricas mas fora do comparativo.',
    ],
  },
  {
    titulo: 'BRF S.A.',
    base: 'DFP consolidada de cada exercício — contas BPA 1.01.03.01 / 1.01.04 / 1, BPP 2.01.02 / 2.03 / 2.01.04 / 2.02.01, DRE 3.01 / 3.02 / 3.05 / 3.07 / 3.08 e DFC_MI 6.01.',
    itens: [
      'EBITDA não é linha formal do DFP: foi derivado como EBIT + Depreciação e Amortização extraídas da Demonstração dos Fluxos de Caixa.',
      'A alíquota efetiva de IR/CSLL também é derivada: (IR + CSLL) ÷ Resultado Antes dos Tributos do próprio exercício.',
      'Dívida Líquida é derivada: Dívida Bruta (empréstimos, financiamentos e debêntures, circulante + não circulante) − Caixa e Equivalentes − Aplicações Financeiras de curto prazo.',
      'O Patrimônio Líquido inclui a participação de acionistas não controladores.',
      'Há divergência entre o valor como originalmente arquivado e o comparativo republicado no ano seguinte em: CMV e Fluxo de Caixa Operacional de 2020, e Fornecedores e Dívida Bruta de 2024 — possivelmente ligada a reclassificações da fusão BRF–Marfrig. Este painel usa sempre o valor como originalmente arquivado.',
    ],
  },
  {
    titulo: 'Copacol',
    base: 'Balanço Patrimonial, Demonstração de Sobras ou Perdas e Demonstração dos Fluxos de Caixa consolidados de cada relatório anual.',
    itens: [
      'Por ser cooperativa, a nomenclatura difere: "Ingressos e receitas operacionais líquidas" é tratado como Receita Líquida, e "Dispêndios e custos das vendas e serviços" como CMV.',
      'EBITDA foi derivado como EBIT + Depreciação e Amortização (imobilizado, ativo biológico e intangível) + Depreciação de direito de uso (IFRS 16), todas obtidas na Demonstração dos Fluxos de Caixa.',
      'Dívida Líquida derivada como Empréstimos e Financiamentos (circulante + não circulante) − Caixa e Equivalentes − Aplicações Financeiras.',
      'Os quatro relatórios trazem cada exercício como coluna corrente em pelo menos um deles e batem exatamente entre si nos anos sobrepostos — nenhuma reapresentação foi identificada, ao contrário da BRF.',
    ],
  },
]

export const limitacoes: string[] = [
  'Comparar uma companhia aberta com uma cooperativa tem limite: a cooperativa distribui sobras aos cooperados e tem estrutura tributária própria, o que afeta diretamente margem e alíquota efetiva.',
  'A Copacol opera integração de produção com os cooperados; parte do que na BRF seria compra de fornecedor circula por outra via contábil. Isso ajuda a explicar o PMP muito mais curto.',
  'ROIC e Margem EBITDA dependem de EBITDA derivado, não divulgado nesse formato por nenhuma das duas — comparações entre empresas devem considerar a margem de erro dessa derivação.',
]
