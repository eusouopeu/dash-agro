// Dados reais extraídos de demonstrações financeiras AUDITADAS de duas
// empresas do setor de proteína animal:
//
// 1) BRF S.A. (B3: BRFS3) — demonstrações CONSOLIDADAS, extraídas dos CSVs
//    estruturados da CVM Dados Abertos (DFP — Demonstrações Financeiras
//    Padronizadas): https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/
//    CD_CVM 016292. Anos disponíveis: 2020-2024.
//
// 2) Copacol - Cooperativa Agroindustrial Consolata — demonstrações
//    CONSOLIDADAS, auditadas (KPMG Auditores Independentes para o exercício
//    de 2025; mesma firma/rede nos exercícios anteriores), extraídas dos
//    Relatórios Financeiros anuais da cooperativa (PDFs fornecidos
//    diretamente pelo usuário — a Copacol não disponibiliza esses relatórios
//    publicamente de forma indexável). Anos disponíveis: 2021-2025.
//
// Valores em R$ mil, exatamente como reportado (sem arredondamento).
//
// Ano-base comum às duas empresas para a comparação principal: 2021-2024.
// BRF também tem 2020 (sem par na Copacol) e Copacol também tem 2025 (sem
// par na BRF) — mantidos nos dados brutos de cada empresa para as
// sparklines/séries históricas, mas fora da tabela comparativa lado a lado.

export interface AnnualFinancials {
  ano: number
  receitaLiquida: number // Receita Operacional Líquida / Ingressos e receitas operacionais líquidas
  cmv: number // Custo dos Produtos/Mercadorias Vendidos (valor absoluto)
  estoques: number // Estoques, saldo final do exercício
  contasAReceber: number // Contas a Receber de Clientes, circulante, saldo final
  fornecedores: number // Fornecedores, passivo circulante, saldo final
  ativoTotal: number
  patrimonioLiquido: number // inclui participação de não controladores, quando consolidado
  dividaLiquida: number // Dívida Bruta (empréstimos e financiamentos, CP+LP) − Caixa e Equivalentes − Aplicações Financeiras CP
  ebitda: number // EBIT + Depreciação/Amortização (inclui direito de uso, IFRS16) — calculado, não é linha formal do DFP/relatório
  ebit: number // Resultado antes do resultado financeiro e dos tributos
  fluxoCaixaOperacional: number // Caixa Líquido das Atividades Operacionais
  aliquotaEfetiva: number // (IR + CSLL) / Resultado Antes dos Tributos, do próprio exercício — fração (ex.: 0.15 = 15%)

  // --- Campos com cobertura parcial -----------------------------------------
  // `null` = a base usada para essa empresa ainda não traz o dado. Nunca
  // estimado: o painel mostra "sem dado" e diz o que falta extrair.

  /** Aquisição de imobilizado + intangível, das atividades de investimento da DFC. */
  capex: number | null
  /** Depreciação + amortização do exercício, da DFC. */
  depreciacaoAmortizacao: number | null
  /** Número de funcionários no fim do exercício. */
  funcionarios: number | null
  /** Volume físico recebido/produzido no exercício, em toneladas. */
  volumeToneladas: number | null
  /** Capacidade estática de armazenagem, em toneladas. */
  capacidadeArmazenagemToneladas: number | null
}

/** Empresas cuja base ainda não cobre CAPEX nem dados operacionais. */
const SEM_OPERACIONAL = {
  capex: null,
  depreciacaoAmortizacao: null,
  funcionarios: null,
  volumeToneladas: null,
  capacidadeArmazenagemToneladas: null,
} as const

// ---------------------------------------------------------------------------
// BRF S.A. (B3: BRFS3) — Consolidado
// Fonte: dfp_cia_aberta_{2020..2025}.zip, CVM Dados Abertos
// (https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/), CD_CVM 016292.
// Valor "como originalmente arquivado" (ORDEM_EXERC = ÚLTIMO no ano do
// próprio exercício), não o comparativo republicado no ano seguinte — ver
// ressalvas em `fontes.brf.ressalvas`.
// ---------------------------------------------------------------------------
export const brfBruto: AnnualFinancials[] = [
  { ano: 2020, receitaLiquida: 39_469_700, cmv: 29_998_822, estoques: 6_802_759, contasAReceber: 4_092_855, fornecedores: 10_832_005, ativoTotal: 49_664_906, patrimonioLiquido: 8_813_534, dividaLiquida: 14_827_801, ebitda: 5_241_171, ebit: 2_846_793, fluxoCaixaOperacional: 4_417_630, aliquotaEfetiva: -0.2111, ...SEM_OPERACIONAL },
  { ano: 2021, receitaLiquida: 48_343_305, cmv: 38_177_609, estoques: 9_654_870, contasAReceber: 4_039_155, fornecedores: 14_411_927, ativoTotal: 55_903_387, patrimonioLiquido: 8_825_623, dividaLiquida: 17_927_210, ebitda: 5_756_141, ebit: 3_009_787, fluxoCaixaOperacional: 3_923_636, aliquotaEfetiva: 0.01587, ...SEM_OPERACIONAL },
  { ano: 2022, receitaLiquida: 53_805_028, cmv: 45_672_376, estoques: 8_660_891, contasAReceber: 4_187_756, fornecedores: 14_805_629, ativoTotal: 57_854_447, patrimonioLiquido: 11_822_869, dividaLiquida: 15_386_071, ebitda: 2_855_416, ebit: -136_289, fluxoCaixaOperacional: 1_876_384, aliquotaEfetiva: -0.1018, ...SEM_OPERACIONAL },
  { ano: 2023, receitaLiquida: 53_615_440, cmv: 44_781_739, estoques: 6_628_890, contasAReceber: 4_766_071, fornecedores: 13_536_332, ativoTotal: 57_272_090, patrimonioLiquido: 15_643_656, dividaLiquida: 10_830_884, ebitda: 4_060_923, ebit: 836_141, fluxoCaixaOperacional: 3_939_397, aliquotaEfetiva: 0.0584, ...SEM_OPERACIONAL },
  { ano: 2024, receitaLiquida: 61_379_038, cmv: 45_543_222, estoques: 6_728_002, contasAReceber: 6_075_013, fornecedores: 14_573_097, ativoTotal: 62_675_076, patrimonioLiquido: 16_499_204, dividaLiquida: 9_575_184, ebitda: 10_364_890, ebit: 6_840_386, fluxoCaixaOperacional: 10_776_742, aliquotaEfetiva: 0.2689, ...SEM_OPERACIONAL },
]

// ---------------------------------------------------------------------------
// Copacol - Cooperativa Agroindustrial Consolata — Consolidado
// Fonte: Relatórios Financeiros anuais da Copacol (PDFs auditados, fornecidos
// pelo usuário) — ver `fontes.copacol` para arquivo/período/auditor de cada
// ano. "Ingressos e receitas operacionais líquidas" tratado como Receita
// Líquida; "Dispêndios e custos das vendas e serviços" tratado como CMV.
// ---------------------------------------------------------------------------
export const copacolBruto: AnnualFinancials[] = [
  { ano: 2021, receitaLiquida: 7_445_178, cmv: 6_121_951, estoques: 1_830_706, contasAReceber: 911_563, fornecedores: 516_514, ativoTotal: 7_762_351, patrimonioLiquido: 2_198_493, dividaLiquida: 1_761_294, ebitda: 845_406, ebit: 604_290, fluxoCaixaOperacional: -135_788, aliquotaEfetiva: 0.0306, ...SEM_OPERACIONAL },
  { ano: 2022, receitaLiquida: 8_805_180, cmv: 6_899_673, estoques: 1_884_438, contasAReceber: 1_126_686, fornecedores: 519_323, ativoTotal: 8_661_355, patrimonioLiquido: 2_453_037, dividaLiquida: 2_025_643, ebitda: 1_007_553, ebit: 699_937, fluxoCaixaOperacional: 814_083, aliquotaEfetiva: 0.0670, ...SEM_OPERACIONAL },
  { ano: 2023, receitaLiquida: 9_424_815, cmv: 7_643_347, estoques: 1_512_424, contasAReceber: 1_285_222, fornecedores: 556_605, ativoTotal: 8_786_550, patrimonioLiquido: 2_901_037, dividaLiquida: 1_314_869, ebitda: 1_205_591, ebit: 855_858, fluxoCaixaOperacional: 1_444_053, aliquotaEfetiva: 0.0199, ...SEM_OPERACIONAL },
  { ano: 2024, receitaLiquida: 10_192_495, cmv: 7_800_110, estoques: 1_617_505, contasAReceber: 1_492_180, fornecedores: 664_100, ativoTotal: 9_994_085, patrimonioLiquido: 3_560_004, dividaLiquida: 1_099_461, ebitda: 1_464_051, ebit: 1_054_884, fluxoCaixaOperacional: 1_660_816, aliquotaEfetiva: 0.0150, ...SEM_OPERACIONAL },
  { ano: 2025, receitaLiquida: 10_492_542, cmv: 8_354_180, estoques: 1_793_789, contasAReceber: 1_385_617, fornecedores: 709_039, ativoTotal: 10_448_395, patrimonioLiquido: 4_295_438, dividaLiquida: 623_529, ebitda: 1_418_787, ebit: 1_014_487, fluxoCaixaOperacional: 1_965_864, aliquotaEfetiva: 0.0349, capex: null, depreciacaoAmortizacao: null, funcionarios: 16_800, volumeToneladas: 2_372_000, capacidadeArmazenagemToneladas: null },
]

// ---------------------------------------------------------------------------
// C.Vale - Cooperativa Agroindustrial — Consolidado
// CNPJ 77.863.223/0001-07, sede em Palotina (PR).
// Fonte: Balanço Patrimonial, Demonstração de Sobras ou Perdas e Demonstração
// dos Fluxos de Caixa consolidados dos Relatórios anuais de 2023, 2024 e 2025
// (o exercício de 2022 vem da coluna comparativa do relatório de 2023).
// Dados operacionais (funcionários, produção recebida e capacidade estática de
// armazenagem) vêm de páginas avulsas dos Relatórios Anuais de 2022 a 2025
// (seções "Funcionários", "Produção Total" e "Armazenamento", fornecidas pelo
// usuário — os relatórios completos não foram fornecidos, só essas seções).
// Cada valor é o dado corrente do relatório do próprio ano-exercício (nunca
// tirado do gráfico histórico de um relatório posterior); os relatórios de
// anos seguintes reproduzem exatamente os mesmos valores em suas séries
// históricas, sem nenhum restatement identificado.
//
// Convenções aplicadas para manter a comparação com BRF e Copacol:
//  - "Ingressos e receitas operacionais líquidas" = Receita Líquida
//  - "Dispêndios e custos das vendas" = CMV
//  - Contas a Receber = associados + terceiros, apenas circulante
//  - Fornecedores = Obrigações com associados + Obrigações com terceiros,
//    apenas circulante (numa cooperativa, o associado é o fornecedor da
//    matéria-prima) — ver ressalva de comparabilidade em `premissas`
//  - Estoques = linha "Estoques"; o Ativo biológico fica de fora
// ---------------------------------------------------------------------------
export const cvaleBruto: AnnualFinancials[] = [
  { ano: 2022, receitaLiquida: 22_436_067, cmv: 18_760_922, estoques: 4_380_866, contasAReceber: 2_199_502, fornecedores: 3_703_119, ativoTotal: 13_510_253, patrimonioLiquido: 3_391_491, dividaLiquida: 3_813_762, ebitda: 1_309_564, ebit: 1_102_827, fluxoCaixaOperacional: 304_357, aliquotaEfetiva: 0.034383, capex: 686_263, depreciacaoAmortizacao: 206_737, funcionarios: 13_668, volumeToneladas: 4_195_769, capacidadeArmazenagemToneladas: 2_938_322 },
  { ano: 2023, receitaLiquida: 23_780_553, cmv: 20_597_885, estoques: 3_354_172, contasAReceber: 2_671_909, fornecedores: 3_567_305, ativoTotal: 13_225_325, patrimonioLiquido: 3_701_919, dividaLiquida: 3_439_150, ebitda: 1_126_148, ebit: 891_012, fluxoCaixaOperacional: 1_264_714, aliquotaEfetiva: 0.185503, capex: 958_213, depreciacaoAmortizacao: 235_136, funcionarios: 13_886, volumeToneladas: 6_136_109, capacidadeArmazenagemToneladas: 3_326_366 },
  { ano: 2024, receitaLiquida: 21_387_940, cmv: 17_895_743, estoques: 3_025_500, contasAReceber: 2_278_011, fornecedores: 3_289_943, ativoTotal: 14_004_920, patrimonioLiquido: 4_338_354, dividaLiquida: 3_414_659, ebitda: 1_503_818, ebit: 1_156_920, fluxoCaixaOperacional: 1_025_867, aliquotaEfetiva: 0.054122, capex: 839_042, depreciacaoAmortizacao: 346_898, funcionarios: 15_018, volumeToneladas: 5_174_053, capacidadeArmazenagemToneladas: 3_219_612 },
  { ano: 2025, receitaLiquida: 24_647_822, cmv: 20_761_621, estoques: 2_861_511, contasAReceber: 2_899_368, fornecedores: 3_322_422, ativoTotal: 16_251_612, patrimonioLiquido: 5_104_495, dividaLiquida: 3_655_461, ebitda: 1_820_765, ebit: 1_464_398, fluxoCaixaOperacional: 615_027, aliquotaEfetiva: 0.123733, capex: 970_737, depreciacaoAmortizacao: 356_367, funcionarios: 15_346, volumeToneladas: 6_560_771, capacidadeArmazenagemToneladas: 3_413_927 },
]

export interface AnnualIndicators extends AnnualFinancials {
  giroEstoque: number // CMV / Estoques
  pmeDias: number // Estoques / CMV × 365
  pmrDias: number // Contas a Receber / Receita Líquida × 365
  pmpDias: number // Fornecedores / CMV × 365
  cicloFinanceiroDias: number // PME + PMR − PMP
  ncg: number // (Contas a Receber + Estoques) − Fornecedores
  giroAtivo: number // Receita Líquida / Ativo Total
  margemOperacional: number // EBIT / Receita Líquida (fração)
  margemEbitda: number // EBITDA / Receita Líquida (fração)
  roic: number // EBIT × (1 − alíquota efetiva) / (Dívida Líquida + Patrimônio Líquido) (fração)
  alavancagem: number // Dívida Líquida / EBITDA (x)
  endividamento: number // (Ativo Total − Patrimônio Líquido) / Ativo Total — quanto do ativo é financiado por terceiros (fração)

  // Derivados dos campos de cobertura parcial — `null` onde falta a base.
  capexSobreReceita: number | null // CAPEX / Receita Líquida (fração)
  capexSobreDepreciacao: number | null // CAPEX / Depreciação e Amortização (x)
  receitaPorFuncionario: number | null // Receita Líquida / funcionários (R$ mil por funcionário)
  utilizacaoCapacidade: number | null // Volume recebido / capacidade estática de armazenagem (x)
}

function computarIndicadores(d: AnnualFinancials): AnnualIndicators {
  const pmeDias = (d.estoques / d.cmv) * 365
  const pmrDias = (d.contasAReceber / d.receitaLiquida) * 365
  const pmpDias = (d.fornecedores / d.cmv) * 365
  const ncg = d.contasAReceber + d.estoques - d.fornecedores
  return {
    ...d,
    giroEstoque: d.cmv / d.estoques,
    pmeDias,
    pmrDias,
    pmpDias,
    cicloFinanceiroDias: pmeDias + pmrDias - pmpDias,
    ncg,
    giroAtivo: d.receitaLiquida / d.ativoTotal,
    margemOperacional: d.ebit / d.receitaLiquida,
    margemEbitda: d.ebitda / d.receitaLiquida,
    roic: (d.ebit * (1 - d.aliquotaEfetiva)) / (d.dividaLiquida + d.patrimonioLiquido),
    alavancagem: d.dividaLiquida / d.ebitda,
    endividamento: (d.ativoTotal - d.patrimonioLiquido) / d.ativoTotal,
    capexSobreReceita: d.capex === null ? null : d.capex / d.receitaLiquida,
    capexSobreDepreciacao:
      d.capex === null || d.depreciacaoAmortizacao === null ? null : d.capex / d.depreciacaoAmortizacao,
    receitaPorFuncionario: d.funcionarios === null ? null : d.receitaLiquida / d.funcionarios,
    utilizacaoCapacidade:
      d.volumeToneladas === null || d.capacidadeArmazenagemToneladas === null
        ? null
        : d.volumeToneladas / d.capacidadeArmazenagemToneladas,
  }
}

export interface Empresa {
  id: 'brf' | 'copacol' | 'cvale'
  nome: string
  nomeCurto: string
  subtitulo: string
  /** Cor da marca de dado — passo validado (contraste + daltonismo) da paleta. */
  cor: string
  /** Fundo de tinta suave para chips e realces da empresa. */
  corSuave: string
  bruto: AnnualFinancials[]
  indicadores: AnnualIndicators[]
}

export const brf: Empresa = {
  id: 'brf',
  nome: 'BRF S.A.',
  nomeCurto: 'BRF',
  subtitulo: 'B3: BRFS3 — companhia aberta',
  cor: '#008DA0', // passo de dado da família verde petróleo
  corSuave: '#E2F0F2',
  bruto: brfBruto,
  indicadores: brfBruto.map(computarIndicadores),
}

export const copacol: Empresa = {
  id: 'copacol',
  nome: 'Copacol Cooperativa Agroindustrial',
  nomeCurto: 'Copacol',
  subtitulo: 'Cooperativa agroindustrial — Cafelândia (PR)',
  cor: '#D45A1E', // passo de dado da família laranja queimado
  corSuave: '#FBEADF',
  bruto: copacolBruto,
  indicadores: copacolBruto.map(computarIndicadores),
}

export const cvale: Empresa = {
  id: 'cvale',
  nome: 'C.Vale Cooperativa Agroindustrial',
  nomeCurto: 'C.Vale',
  subtitulo: 'Cooperativa agroindustrial — Palotina (PR)',
  cor: '#7A4FA3', // violeta — terceiro passo validado da paleta
  corSuave: '#EDE6F3',
  bruto: cvaleBruto,
  indicadores: cvaleBruto.map(computarIndicadores),
}

export const empresas: Empresa[] = [brf, copacol, cvale]

// Anos em que AS TRÊS empresas têm dado real — base do seletor do panorama.
// Fora dessa faixa cada empresa mantém sua série própria (BRF 2020-2024,
// Copacol 2021-2025, C.Vale 2022-2025), usada nas sparklines e nos gráficos
// de evolução e mostrada nas tabelas por exercício.
export const anosComuns = [2022, 2023, 2024] as const

/** Todos os anos com dado para pelo menos uma das empresas, do mais recente ao mais antigo. */
export const todosAnos: number[] = Array.from(
  new Set([...brfBruto, ...copacolBruto, ...cvaleBruto].map((d) => d.ano)),
).sort((a, b) => b - a)

/** Indicadores do ano, ou `null` quando a empresa não tem dado nesse exercício. */
export function indicadorOpcional(empresa: Empresa, ano: number): AnnualIndicators | null {
  return empresa.indicadores.find((x) => x.ano === ano) ?? null
}

export function indicadorPorAno(empresa: Empresa, ano: number): AnnualIndicators {
  const i = empresa.indicadores.find((x) => x.ano === ano)
  if (!i) throw new Error(`Ano ${ano} não disponível para ${empresa.nome}`)
  return i
}

export const anoPadrao = anosComuns[anosComuns.length - 1]

// ---------------------------------------------------------------------------
// Fontes, base contábil e premissas
// ---------------------------------------------------------------------------
export const fontes = {
  brf: {
    empresa: 'BRF S.A. (B3: BRFS3), CNPJ 01.838.723/0001-27, CD_CVM 016292',
    origem: 'CVM — Dados Abertos, Demonstrações Financeiras Padronizadas (DFP), demonstrações CONSOLIDADAS',
    url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/',
    base: 'DFP consolidada de cada exercício (arquivo dfp_cia_aberta_{ano+1}.zip, ORDEM_EXERC = ÚLTIMO) — contas BPA 1.01.03.01/1.01.04/1, BPP 2.01.02/2.03/2.01.04/2.02.01, DRE 3.01/3.02/3.05/3.07/3.08, DFC_MI 6.01',
    ressalvas: [
      'EBITDA e alíquota efetiva de IR/CSLL não são linhas formais do DFP nem valores divulgados pela própria BRF nesse formato — foram derivados (EBITDA = EBIT + Depreciação/Amortização do DFC; alíquota = (IR+CSLL)/Resultado Antes dos Tributos).',
      'Dívida Líquida não é uma linha do DFP — derivada como Dívida Bruta (empréstimos, financiamentos e debêntures, circulante + não circulante) − Caixa e Equivalentes − Aplicações Financeiras de curto prazo.',
      'Há divergência entre o valor "como originalmente arquivado" e o comparativo republicado no ano seguinte em: CMV e Fluxo de Caixa Operacional de 2020, e Fornecedores/Dívida Bruta de 2024 (possivelmente ligada a reclassificações da fusão BRF–Marfrig). Os dados aqui usam sempre o valor "como originalmente arquivado".',
      'Patrimônio Líquido inclui participação de acionistas não controladores (minoritários).',
    ],
  },
  copacol: {
    empresa: 'Copacol - Cooperativa Agroindustrial Consolata, Cascavel/PR',
    origem: 'Relatórios Financeiros anuais da Copacol (demonstrações consolidadas, auditadas por KPMG Auditores Independentes)',
    url: 'Relatórios fornecidos diretamente pelo usuário (a Copacol não disponibiliza esses PDFs publicamente de forma indexável) — arquivos relatorio-{2022,2023,2024,2025}-financeiro-copacol.pdf',
    base: 'Balanço Patrimonial, Demonstração de Sobras ou Perdas (DRE) e Demonstração dos Fluxos de Caixa consolidados de cada relatório — "Ingressos e receitas operacionais líquidas" tratado como Receita Líquida; "Dispêndios e custos das vendas e serviços" tratado como CMV',
    ressalvas: [
      'EBITDA não é uma linha formal do relatório — derivado como EBIT + Depreciação/Amortização (imobilizado + biológico + intangível) + Depreciação de direito de uso (IFRS16), todas obtidas na Demonstração dos Fluxos de Caixa.',
      'Dívida Líquida derivada como Empréstimos e Financiamentos (circulante + não circulante) − Caixa e Equivalentes − Aplicações Financeiras.',
      'Contas a Receber e Fornecedores usam apenas o saldo circulante (mesma convenção aplicada à BRF, para comparabilidade).',
      'Os quatro relatórios (referência 2022, 2023, 2024, 2025) trazem cada ano como coluna corrente em pelo menos um deles e batem exatamente entre si nos anos sobrepostos — nenhuma restatement foi identificada, ao contrário da BRF.',
      'Ano de 2025 disponível apenas para a Copacol (sem par na BRF nesta base) — mantido na série histórica da empresa, fora da comparação direta 2021-2024.',
      'Funcionários e volume recebido de 2025 vêm do Relatório do Conselho de Administração 2025 (relatorio-2025-adm-v2.pdf, disponível publicamente em copacol.com.br), não do relatório financeiro: "16,8 mil colaboradores" (arredondado, sem casa decimal exata) e 2.372 mil toneladas de recebimento de grãos. CAPEX, depreciação/amortização e capacidade estática de armazenagem não aparecem nesse relatório administrativo (ele só traz "armazenagem de grãos" como volume movimentado, não capacidade estática) e continuam sem dado.',
    ],
    porAno: [
      { ano: 2021, documento: 'Relatório Financeiro 2022 (coluna comparativa 2021)', arquivo: 'relatorio-2022-financeiro-copacol.pdf' },
      { ano: 2022, documento: 'Relatório Financeiro 2022 (coluna corrente 2022)', arquivo: 'relatorio-2022-financeiro-copacol.pdf' },
      { ano: 2023, documento: 'Relatório Financeiro 2023 (coluna corrente 2023)', arquivo: 'relatorio-2023-financeiro-copacol.pdf' },
      { ano: 2024, documento: 'Relatório Financeiro 2024 (coluna corrente 2024)', arquivo: 'relatorio-2024-financeiro-copacol.pdf' },
      { ano: 2025, documento: 'Relatório Financeiro 2025 (coluna corrente 2025), auditado por KPMG', arquivo: 'relatorio-2025-financeiro-copacol.pdf' },
    ],
  },
  formulas: [
    'Giro do Estoque = CMV / Estoques (saldo final do exercício)',
    'PME (Prazo Médio de Estocagem) = Estoques / CMV × 365',
    'PMR (Prazo Médio de Recebimento) = Contas a Receber / Receita Líquida × 365',
    'PMP (Prazo Médio de Pagamento) = Fornecedores / CMV × 365',
    'Ciclo Financeiro (Ciclo de Caixa Operacional) = PME + PMR − PMP',
    'NCG (Necessidade de Capital de Giro) = (Contas a Receber + Estoques) − Fornecedores',
    'Giro do Ativo = Receita Líquida / Ativo Total',
    'Margem EBITDA = EBITDA / Receita Líquida',
    'ROIC = EBIT × (1 − alíquota efetiva de IR/CSLL do exercício) / (Dívida Líquida + Patrimônio Líquido)',
    'Indicador de Alavancagem = Dívida Líquida / EBITDA',
  ],
}
