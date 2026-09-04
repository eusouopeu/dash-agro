// Referências bibliográficas das fontes de dados, estruturadas segundo a
// ABNT NBR 6023:2018.
//
// Ordem dos elementos na renderização:
//   AUTOR. **Título**: subtítulo. Local: Editora, ano. Complemento.
//   Disponível em: URL. Acesso em: data.
//
// A lista final é ordenada alfabeticamente pelo autor (sistema alfabético,
// NBR 6023, seção 9.1).

export interface ReferenciaABNT {
  id: string
  /** Autoria em caixa alta, como exige a norma para a entrada. */
  autor: string
  titulo: string
  subtitulo?: string
  local: string
  editora: string
  ano: string
  /** Descrição física / natureza do documento, após o ano. */
  complemento?: string
  url?: string
  /** Data de acesso, obrigatória para documentos on-line. */
  acesso?: string
  /** Nota explicativa nossa — fora da referência formal. */
  nota?: string
  /** A qual conjunto de dados esta referência dá origem. */
  grupo: 'brf' | 'copacol' | 'conceitual'
}

const ACESSO = '4 set. 2026'

export const referencias: ReferenciaABNT[] = [
  // --- Fonte primária dos dados da BRF ------------------------------------
  {
    id: 'cvm-dfp',
    autor: 'BRASIL. Comissão de Valores Mobiliários',
    titulo: 'Demonstrações financeiras padronizadas (DFP)',
    subtitulo: 'conjunto de dados abertos de companhias abertas',
    local: 'Rio de Janeiro',
    editora: 'CVM',
    ano: '2025',
    complemento: 'Arquivos dfp_cia_aberta_2021.zip a dfp_cia_aberta_2025.zip',
    url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/',
    acesso: ACESSO,
    nota: 'Repositório de onde foram extraídos os formulários DFP da BRF listados a seguir.',
    grupo: 'brf',
  },
  {
    id: 'brf-2020',
    autor: 'BRF S.A.',
    titulo: 'Demonstrações financeiras padronizadas (DFP)',
    subtitulo: 'exercício social encerrado em 31 de dezembro de 2020',
    local: 'Itajaí, SC',
    editora: 'BRF',
    ano: '2021',
    complemento: 'Demonstrações consolidadas. CD_CVM 016292; CNPJ 01.838.723/0001-27',
    url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_2021.zip',
    acesso: ACESSO,
    grupo: 'brf',
  },
  {
    id: 'brf-2021',
    autor: 'BRF S.A.',
    titulo: 'Demonstrações financeiras padronizadas (DFP)',
    subtitulo: 'exercício social encerrado em 31 de dezembro de 2021',
    local: 'Itajaí, SC',
    editora: 'BRF',
    ano: '2022',
    complemento: 'Demonstrações consolidadas. CD_CVM 016292',
    url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_2022.zip',
    acesso: ACESSO,
    grupo: 'brf',
  },
  {
    id: 'brf-2022',
    autor: 'BRF S.A.',
    titulo: 'Demonstrações financeiras padronizadas (DFP)',
    subtitulo: 'exercício social encerrado em 31 de dezembro de 2022',
    local: 'Itajaí, SC',
    editora: 'BRF',
    ano: '2023',
    complemento: 'Demonstrações consolidadas. CD_CVM 016292',
    url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_2023.zip',
    acesso: ACESSO,
    grupo: 'brf',
  },
  {
    id: 'brf-2023',
    autor: 'BRF S.A.',
    titulo: 'Demonstrações financeiras padronizadas (DFP)',
    subtitulo: 'exercício social encerrado em 31 de dezembro de 2023',
    local: 'Itajaí, SC',
    editora: 'BRF',
    ano: '2024',
    complemento: 'Demonstrações consolidadas. CD_CVM 016292',
    url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_2024.zip',
    acesso: ACESSO,
    grupo: 'brf',
  },
  {
    id: 'brf-2024',
    autor: 'BRF S.A.',
    titulo: 'Demonstrações financeiras padronizadas (DFP)',
    subtitulo: 'exercício social encerrado em 31 de dezembro de 2024',
    local: 'Itajaí, SC',
    editora: 'BRF',
    ano: '2025',
    complemento: 'Demonstrações consolidadas. CD_CVM 016292',
    url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_2025.zip',
    acesso: ACESSO,
    grupo: 'brf',
  },

  // --- Fonte primária dos dados da Copacol --------------------------------
  {
    id: 'copacol-2022',
    autor: 'COPACOL — COOPERATIVA AGROINDUSTRIAL CONSOLATA',
    titulo: 'Relatório financeiro 2022',
    local: 'Cafelândia, PR',
    editora: 'Copacol',
    ano: '2023',
    complemento:
      'Demonstrações financeiras consolidadas auditadas. Arquivo relatorio-2022-financeiro-copacol.pdf. Fonte dos exercícios de 2021 (coluna comparativa) e 2022 (coluna corrente)',
    nota: 'Documento não disponibilizado publicamente de forma indexável; obtido diretamente junto à cooperativa.',
    grupo: 'copacol',
  },
  {
    id: 'copacol-2023',
    autor: 'COPACOL — COOPERATIVA AGROINDUSTRIAL CONSOLATA',
    titulo: 'Relatório financeiro 2023',
    local: 'Cafelândia, PR',
    editora: 'Copacol',
    ano: '2024',
    complemento:
      'Demonstrações financeiras consolidadas auditadas. Arquivo relatorio-2023-financeiro-copacol.pdf. Fonte do exercício de 2023',
    nota: 'Documento não disponibilizado publicamente de forma indexável; obtido diretamente junto à cooperativa.',
    grupo: 'copacol',
  },
  {
    id: 'copacol-2024',
    autor: 'COPACOL — COOPERATIVA AGROINDUSTRIAL CONSOLATA',
    titulo: 'Relatório financeiro 2024',
    local: 'Cafelândia, PR',
    editora: 'Copacol',
    ano: '2025',
    complemento:
      'Demonstrações financeiras consolidadas auditadas. Arquivo relatorio-2024-financeiro-copacol.pdf. Fonte do exercício de 2024',
    nota: 'Documento não disponibilizado publicamente de forma indexável; obtido diretamente junto à cooperativa.',
    grupo: 'copacol',
  },
  {
    id: 'copacol-2025',
    autor: 'COPACOL — COOPERATIVA AGROINDUSTRIAL CONSOLATA',
    titulo: 'Relatório financeiro 2025',
    local: 'Cafelândia, PR',
    editora: 'Copacol',
    ano: '2026',
    complemento:
      'Demonstrações financeiras consolidadas auditadas por KPMG Auditores Independentes. Arquivo relatorio-2025-financeiro-copacol.pdf. Fonte do exercício de 2025',
    nota: 'Documento não disponibilizado publicamente de forma indexável; obtido diretamente junto à cooperativa.',
    grupo: 'copacol',
  },

  // --- Referência conceitual ----------------------------------------------
  {
    id: 'fleuriet',
    autor: 'FLEURIET, Michel; KEHDY, Ricardo; BLANC, Georges',
    titulo: 'O modelo Fleuriet',
    subtitulo: 'a dinâmica financeira das empresas brasileiras',
    local: 'Rio de Janeiro',
    editora: 'Elsevier',
    ano: '2003',
    nota: 'Origem do conceito de Necessidade de Capital de Giro (NCG) usado neste painel.',
    grupo: 'conceitual',
  },
]

export const gruposReferencia: {
  id: ReferenciaABNT['grupo']
  titulo: string
  descricao: string
}[] = [
  {
    id: 'brf',
    titulo: 'BRF S.A.',
    descricao:
      'Formulários DFP consolidados, extraídos dos CSVs estruturados do portal de dados abertos da CVM. Usamos sempre o valor como originalmente arquivado, não o comparativo republicado no exercício seguinte.',
  },
  {
    id: 'copacol',
    titulo: 'Copacol',
    descricao:
      'Relatórios financeiros anuais da cooperativa, com demonstrações consolidadas auditadas. Cada exercício aparece como coluna corrente em pelo menos um relatório.',
  },
  {
    id: 'conceitual',
    titulo: 'Referência conceitual',
    descricao: 'Obra de origem de um dos indicadores calculados aqui.',
  },
]
