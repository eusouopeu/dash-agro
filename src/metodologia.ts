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
  /** 'neutro' = sem direção normativa única entre as três empresas (ver leitura). */
  melhor: 'maior' | 'menor' | 'neutro'
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
    leitura: 'Quantos dias a empresa leva para pagar seus fornecedores. Numa companhia aberta, prazo maior financia o giro; numa cooperativa, o "fornecedor" é em boa parte o próprio associado, e demorar mais para pagá-lo não é um resultado a comemorar — por isso este painel não rotula o PMP como "melhor" em nenhuma direção.',
    melhor: 'neutro',
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
    key: 'ncgSobreReceita',
    nome: 'NCG sobre Receita',
    numerador: 'NCG',
    denominador: 'Receita Líquida',
    unidade: '%',
    leitura: 'A NCG em relação ao tamanho da operação — permite comparar empresas de porte diferente. Negativa significa que o fornecedor financia o giro, não o caixa próprio.',
    melhor: 'menor',
  },
  {
    key: 'conversaoCaixa',
    nome: 'Conversão de Caixa',
    numerador: 'Fluxo de Caixa Operacional',
    denominador: 'EBITDA',
    unidade: 'vezes (x)',
    leitura: 'Quanto do EBITDA de fato virou caixa no ano. Bem abaixo de 1,0x é sinal de lucro que não se converteu em dinheiro — por variação de capital de giro, por exemplo.',
    melhor: 'maior',
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

/** Fórmulas de indicadores que hoje só têm base para parte das empresas. */
export const formulasParciais: Formula[] = [
  {
    key: 'capexSobreReceita',
    nome: 'CAPEX sobre Receita',
    numerador: 'Aquisição de imobilizado + intangível',
    denominador: 'Receita Líquida',
    unidade: '%',
    leitura: 'Quanto da receita do ano volta para o ativo fixo como investimento.',
    melhor: 'maior',
  },
  {
    key: 'capexSobreDepreciacao',
    nome: 'CAPEX sobre Depreciação',
    numerador: 'Aquisição de imobilizado + intangível',
    denominador: 'Depreciação + Amortização',
    unidade: 'vezes (x)',
    leitura: 'Acima de 1x a empresa investe mais do que consome do ativo existente — está expandindo, não só repondo.',
    melhor: 'maior',
  },
  {
    key: 'receitaPorFuncionario',
    nome: 'Receita por Funcionário',
    numerador: 'Receita Líquida',
    denominador: 'Número de funcionários',
    unidade: 'R$ por funcionário',
    leitura: 'Quanta receita cada posto de trabalho gera no ano.',
    melhor: 'maior',
  },
  {
    key: 'utilizacaoCapacidade',
    nome: 'Utilização da Capacidade de Armazenagem',
    numerador: 'Produção recebida no ano (t)',
    denominador: 'Capacidade estática de armazenagem (t)',
    unidade: 'vezes (x)',
    leitura:
      'Quantas vezes a capacidade estática é preenchida ao longo do ano. Passa de 1x porque o grão gira durante a safra — é giro de armazém, não ocupação instantânea.',
    melhor: 'maior',
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
      'Os prazos médios (PME, PMR, PMP, Ciclo Financeiro e Giro do Estoque) podem usar o saldo final do exercício ou a média com o saldo do exercício anterior — um seletor de "base de cálculo" alterna entre as duas convenções no panorama e na tabela de indicadores. No primeiro exercício de cada empresa, sem saldo anterior na base, mantém-se o saldo final.',
      'Contas a Receber e Fornecedores usam apenas o saldo circulante, nas três empresas.',
      'O ano comercial é de 365 dias, sem ajuste para anos bissextos.',
      'O panorama compara 2022–2025, os únicos exercícios com dado real para as três empresas. Cada uma mantém sua série completa nas tabelas e nos gráficos de evolução: BRF e Copacol 2021–2025, C.Vale 2022–2025 (sem demonstração anterior nesta base).',
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
      'Há divergência entre o valor como originalmente arquivado e o comparativo republicado no ano seguinte em: Fornecedores e Dívida Bruta de 2024 — possivelmente ligada a reclassificações da fusão BRF–Marfrig. Este painel usa sempre o valor como originalmente arquivado.',
      'O exercício de 2025 é o primeiro após a fusão societária entre BRF e Marfrig. A BRF S.A. segue arquivando DFP consolidada própria na CVM (CD_CVM 016292); os dados de 2025 usados aqui são dessa demonstração individual, não do grupo combinado.',
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
  {
    titulo: 'C.Vale',
    base: 'Balanço Patrimonial, Demonstração de Sobras ou Perdas e Demonstração dos Fluxos de Caixa consolidados dos relatórios de 2023, 2024 e 2025. O exercício de 2022 vem da coluna comparativa do relatório de 2023.',
    itens: [
      'Como na Copacol, "Ingressos e receitas operacionais líquidas" é tratado como Receita Líquida e "Dispêndios e custos das vendas" como CMV.',
      'Contas a Receber soma os saldos circulantes de associados e de terceiros.',
      'Fornecedores soma Obrigações com associados e Obrigações com terceiros, ambos circulantes: numa cooperativa, o associado é quem entrega a matéria-prima, então excluí-lo subestimaria muito o prazo de pagamento.',
      'Estoques usa apenas a linha "Estoques" — o Ativo biológico, reportado à parte, fica de fora.',
      'EBITDA derivado como EBIT + Depreciação do imobilizado + Amortização de intangível e biológico, ambas da Demonstração dos Fluxos de Caixa. A C.Vale não separa a depreciação de direito de uso (IFRS 16), que fica embutida na depreciação do imobilizado.',
      'Dívida Líquida derivada como Empréstimos e Financiamentos (circulante + não circulante) − Caixa e Equivalentes − Aplicações Financeiras.',
      'CAPEX é a soma de "Aquisição de ativo imobilizado" e "Aquisição de ativo intangível" nas atividades de investimento da DFC. Hoje só a C.Vale tem esse dado extraído.',
      'Os dados operacionais (funcionários, produção total recebida e capacidade estática de armazenagem) vêm dos Relatórios Anuais de 2022 a 2025 e cobrem toda a série da C.Vale nesta base.',
    ],
  },
]

export const limitacoes: string[] = [
  'Comparar uma companhia aberta com duas cooperativas tem limite: a cooperativa distribui sobras aos cooperados e tem estrutura tributária própria, o que afeta diretamente margem e alíquota efetiva.',
  'As duas cooperativas operam integração de produção com os cooperados; parte do que na BRF seria compra de fornecedor circula por outra via contábil.',
  'O PMP da Copacol e o da C.Vale não são estritamente comparáveis entre si: na C.Vale, Fornecedores inclui as obrigações com associados; na Copacol, usa-se a linha "Fornecedores" como reportada. Se a Copacol registra as obrigações com cooperados fora dessa linha, o PMP dela está subestimado nessa comparação.',
  'A C.Vale é uma cooperativa de grãos com agroindústria, não uma processadora de proteína pura — a receita inclui comercialização de soja, milho e trigo, o que naturalmente alonga o ciclo e reduz a margem frente a BRF e Copacol.',
  'ROIC e Margem EBITDA dependem de EBITDA derivado, não divulgado nesse formato por nenhuma das três — comparações devem considerar a margem de erro dessa derivação.',
  'CAPEX e dados operacionais existem hoje só para parte das empresas. Onde faltam, o painel mostra "sem dado" em vez de estimar.',
]
