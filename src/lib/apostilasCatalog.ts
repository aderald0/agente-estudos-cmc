export type CargoKey = 'analista' | 'tecnico';
export type ValidationStatus = 'validado' | 'atencao' | 'lacuna' | 'fora-edital';

export interface EditalCargoSpec {
  key: CargoKey;
  code: string;
  name: string;
  shortName: string;
  turno: 'Manhã' | 'Tarde';
  duration: string;
  vagasTotal: number;
  vagasDetail: string;
  jornada: string;
  vencimento: string;
  auxilios: string;
  totalMensal: string;
  minObjetiva: string;
  minDiscursiva: string;
  areas: Array<{
    name: string;
    questions: number;
    weight: number;
    totalPoints: number;
    disciplines: string[];
  }>;
}

export interface EditalAuditFinding {
  id: string;
  severity: 'lacuna' | 'fora-edital' | 'atencao' | 'estrategia';
  title: string;
  cargo: 'Analista TI' | 'Técnico Legislativo' | 'Ambos os Cargos';
  apostilaId: string;
  page?: number;
  summary: string;
  action: string;
  targetApostilaId?: string;
  targetPage?: number;
}

export interface ApostilaChapter {
  chapterNumber: number;
  topicId?: string;
  title: string;
  printedPageStart: number;
  printedPageEnd: number;
  pdfPageStart: number;
  editalRef: string;
  validationStatus: ValidationStatus;
  validationNote?: string;
  fallbackApostilaId?: string;
  fallbackPdfPage?: number;
}

export interface ApostilaSpec {
  id: string;
  slug: string;
  title: string;
  subject: string;
  cargoScope: 'ambos' | 'analista' | 'tecnico';
  kind: 'apostila' | 'material-digital';
  codeAnl?: string;
  codeTec?: string;
  orderAnl?: number;
  orderTec?: number;
  weightAnl?: string;
  weightTec?: string;
  highWeightAnl?: boolean;
  highWeightTec?: boolean;
  driveFileIdAnl?: string;
  driveFileIdTec?: string;
  driveFileNameAnl?: string;
  driveFileNameTec?: string;
  totalPages: number;
  pageOffset: number;
  questionsPrintedPage?: number;
  answerKeyPrintedPage?: number;
  editalSummary: string;
  chapters: ApostilaChapter[];
}

export const EDITAL_INFO = {
  number: 'Edital nº 001/2026-CMC (consolidado com Retificações 01 e 02/2026)',
  organ: 'Câmara Municipal de Cuiabá — MT',
  banca: 'Instituto Selecon',
  examDate: '2026-12-20',
  examDateBR: '20/12/2026 (domingo)',
  discursivaSpec: '20 a 30 linhas · Tema de Conhecimento Específico · 100 pts (80 conteúdo + 20 formal) · Mínimo 40 pts',
  objetivaRule: '70 questões (4 alternativas) · 100 pts · Mínimo 40 pts e não zerar nenhuma área',
};

export const EDITAL_CARGOS: Record<CargoKey, EditalCargoSpec> = {
  analista: {
    key: 'analista',
    code: 'CNS 03',
    name: 'Analista Legislativo — Tecnologia da Informação',
    shortName: 'Analista TI',
    turno: 'Manhã',
    duration: '4h30min',
    vagasTotal: 5,
    vagasDetail: '5 vagas (3 AC · 1 PcD · 1 NI) + CR',
    jornada: '30h/semana',
    vencimento: 'R$ 7.070,51',
    auxilios: 'R$ 1.500 aliment. + R$ 1.000 saúde',
    totalMensal: 'R$ 9.570,51',
    minObjetiva: '40/100 pts (sem zerar área)',
    minDiscursiva: '40/100 pts (20–30 linhas)',
    areas: [
      {
        name: 'Conhecimentos Básicos',
        questions: 15,
        weight: 1.0,
        totalPoints: 15,
        disciplines: ['Língua Portuguesa', 'Raciocínio Lógico e Matemático', 'Noções de Informática'],
      },
      {
        name: 'Conhecimentos Gerais',
        questions: 15,
        weight: 1.0,
        totalPoints: 15,
        disciplines: ['História e Geografia de MT', 'Noções de Ética e Filosofia', 'Relações Interpessoais', 'Noções de Administração Pública'],
      },
      {
        name: 'Conhecimentos Específicos',
        questions: 40,
        weight: 1.75,
        totalPoints: 70,
        disciplines: ['Legislação Municipal', 'Conhecimentos Específicos — Analista TI'],
      },
    ],
  },
  tecnico: {
    key: 'tecnico',
    code: 'CNM 01',
    name: 'Técnico Legislativo',
    shortName: 'Técnico Leg.',
    turno: 'Tarde',
    duration: '4h30min',
    vagasTotal: 11,
    vagasDetail: '11 vagas (8 AC · 1 PcD · 2 NI) + CR',
    jornada: '30h/semana',
    vencimento: 'R$ 5.518,91',
    auxilios: 'R$ 1.500 aliment. + R$ 1.000 saúde',
    totalMensal: 'R$ 8.018,91',
    minObjetiva: '40/100 pts (sem zerar área)',
    minDiscursiva: '40/100 pts (20–30 linhas)',
    areas: [
      {
        name: 'Conhecimentos Básicos',
        questions: 15,
        weight: 1.0,
        totalPoints: 15,
        disciplines: ['Língua Portuguesa', 'Raciocínio Lógico e Matemático', 'Noções de Informática', 'Legislação Municipal'],
      },
      {
        name: 'Conhecimentos Gerais',
        questions: 15,
        weight: 1.0,
        totalPoints: 15,
        disciplines: ['História e Geografia de MT', 'Noções de Ética e Filosofia', 'Relações Interpessoais'],
      },
      {
        name: 'Conhecimentos Específicos',
        questions: 40,
        weight: 1.75,
        totalPoints: 70,
        disciplines: ['Noções de Administração Pública (itens 1–4)', 'Conhecimentos Específicos — Técnico (itens 5–13)'],
      },
    ],
  },
};

export const EDITAL_AUDIT_FINDINGS: EditalAuditFinding[] = [
  {
    id: 'audit-lacuna-leg-tec',
    severity: 'lacuna',
    title: 'Lacuna na Apostila 07 do Técnico: Poder Legislativo Municipal e Processo Legislativo',
    cargo: 'Técnico Legislativo',
    apostilaId: 'ap-especificos-tecnico',
    page: 62,
    summary:
      'O sumário da Apostila 07 do Técnico aponta o item 6/7 (Câmara, Mesa Diretora, Comissões, Processo Legislativo) na pág. 62, mas o PDF traz apenas o final do art. 41 da CF/88 e já salta para Redação Oficial na pág. 63.',
    action: 'Estude esse tema diretamente pela Apostila de Legislação (Lei Orgânica p. 1 e Regimento Interno p. 54).',
    targetApostilaId: 'ap-legislacao',
    targetPage: 55,
  },
  {
    id: 'audit-fora-fotografia',
    severity: 'fora-edital',
    title: 'Capítulo fora do Edital na Apostila 07 do Técnico: Noções de Fotografia (p. 102–107)',
    cargo: 'Técnico Legislativo',
    apostilaId: 'ap-especificos-tecnico',
    page: 102,
    summary:
      'A Apostila 07 do Técnico inclui 6 páginas de "Noções de fotografia aplicada às atividades institucionais", mas esse tema NÃO existe no Anexo V de Técnico Legislativo.',
    action: 'Ignorar este capítulo para economizar tempo de estudo.',
  },
  {
    id: 'audit-higiene-enfermagem',
    severity: 'atencao',
    title: 'Conteúdo genérico em Higiene e Segurança do Trabalho (Apostila 07 Técnico, p. 100–102)',
    cargo: 'Técnico Legislativo',
    apostilaId: 'ap-especificos-tecnico',
    page: 100,
    summary:
      'O capítulo da apostila traz exemplos voltados a "enfermeiros do trabalho". O edital cobra noções gerais de higiene e segurança no ambiente administrativo.',
    action: 'Foque em ergonomia (NR-17), prevenção de riscos em escritório, CIPA/EPI básicos e use o Mentor para questões Selecon.',
  },
  {
    id: 'audit-rlm-superset',
    severity: 'estrategia',
    title: 'RLM do Analista (9 caps) cobre 100% do Técnico (6 caps) + Tabela-Verdade e Probabilidade',
    cargo: 'Ambos os Cargos',
    apostilaId: 'ap-rlm-analista',
    page: 1,
    summary:
      'O Técnico cobra itens 1–7 de RLM (até Princípio Aditivo/Multiplicativo). O Analista acrescenta tabela-verdade, tautologias, arranjos/combinações/permutações e probabilidade.',
    action: 'Estude pela Apostila 02 do Analista TI para matar os dois cargos de uma vez.',
    targetApostilaId: 'ap-rlm-analista',
    targetPage: 2,
  },
  {
    id: 'audit-ponte-70',
    severity: 'estrategia',
    title: 'Ponte de Ouro: 70% da nota (peso 1,75) + Discursiva estão em apenas 3 blocos',
    cargo: 'Ambos os Cargos',
    apostilaId: 'ap-legislacao',
    page: 1,
    summary:
      'No Analista TI (manhã), Legislação + TI valem 70 pts. No Técnico (tarde), Adm. Pública + Específicos Técnico valem 70 pts. Além disso, 6 apostilas (LP, Informática, Ética, Relações, Hist/Geo MT e Legislação) são 100% idênticas entre os dois cargos.',
    action: 'Priorize Legislação Municipal, Específicos de TI e Específicos de Técnico (+ Adm. Pública) como núcleo diário.',
    targetApostilaId: 'ap-especificos-ti',
    targetPage: 2,
  },
];

export const APOSTILAS_CATALOG: ApostilaSpec[] = [
  {
    id: 'ap-portugues',
    slug: '01-lingua-portuguesa',
    title: 'Língua Portuguesa',
    subject: 'Língua Portuguesa',
    cargoScope: 'ambos',
    kind: 'apostila',
    codeAnl: 'Apostila 01',
    codeTec: 'Apostila 01',
    orderAnl: 1,
    orderTec: 1,
    weightAnl: 'Básicos (1,00)',
    weightTec: 'Básicos (1,00)',
    driveFileIdAnl: '1YExtgwGkLosLJBFyJEYFiBdCoqpVd3Lr',
    driveFileIdTec: '1nIkVHfOFxQFGSKHYLlQbxmaygotcQQaA',
    driveFileNameAnl: '01 SL 162OT 26 CUIABA MT ANAL LEG TI_Lingua Portuguesa.pdf',
    driveFileNameTec: '01 SL 157OT 26 CUIABA MT TEC LEG_Lingua Portuguesa.pdf',
    totalPages: 108,
    pageOffset: 1,
    questionsPrintedPage: 91,
    answerKeyPrintedPage: 107,
    editalSummary: '100% idêntica para Analista TI e Técnico Legislativo. Cobre integralmente os itens 1 a 7 do Anexo V.',
    chapters: [
      { chapterNumber: 1, topicId: 'lp-cap-1', title: 'Leitura e interpretação de textos de variados gêneros discursivos', printedPageStart: 1, printedPageEnd: 5, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'lp-cap-2', title: 'As condições de produção de um texto e as marcas composicionais de gêneros textuais diversos', printedPageStart: 6, printedPageEnd: 14, pdfPageStart: 7, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'lp-cap-3', title: 'Linguagem e adequação social: Variedades linguísticas e seus determinantes', printedPageStart: 15, printedPageEnd: 15, pdfPageStart: 16, editalRef: 'Item 3.1', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'lp-cap-4', title: 'Registros formal e informal da linguagem', printedPageStart: 16, printedPageEnd: 20, pdfPageStart: 17, editalRef: 'Item 3.2', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'lp-cap-5', title: 'Aspectos linguísticos na construção do texto: Fonética e prosódia', printedPageStart: 21, printedPageEnd: 21, pdfPageStart: 22, editalRef: 'Item 4.1', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'lp-cap-6', title: 'Ortografia', printedPageStart: 22, printedPageEnd: 28, pdfPageStart: 23, editalRef: 'Item 4.1', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'lp-cap-7', title: 'Morfologia: formação, classificação, flexão e emprego de classes gramaticais', printedPageStart: 29, printedPageEnd: 51, pdfPageStart: 30, editalRef: 'Itens 4.2 e 4.3', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'lp-cap-8', title: 'Sintaxe: concordâncias verbal e nominal', printedPageStart: 52, printedPageEnd: 58, pdfPageStart: 53, editalRef: 'Item 4.3', validationStatus: 'validado' },
      { chapterNumber: 9, topicId: 'lp-cap-9', title: 'Regências verbal e nominal', printedPageStart: 59, printedPageEnd: 64, pdfPageStart: 60, editalRef: 'Item 4.3', validationStatus: 'validado' },
      { chapterNumber: 10, topicId: 'lp-cap-10', title: 'Colocação pronominal', printedPageStart: 65, printedPageEnd: 67, pdfPageStart: 66, editalRef: 'Item 4.3', validationStatus: 'validado' },
      { chapterNumber: 11, topicId: 'lp-cap-11', title: 'Semântica: polissemia, paronímia, homonímia, denotação e conotação', printedPageStart: 68, printedPageEnd: 71, pdfPageStart: 69, editalRef: 'Item 4.4', validationStatus: 'validado' },
      { chapterNumber: 12, topicId: 'lp-cap-12', title: 'Textualidade: coesão e coerência', printedPageStart: 72, printedPageEnd: 76, pdfPageStart: 73, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 13, topicId: 'lp-cap-13', title: 'Intertextualidade', printedPageStart: 77, printedPageEnd: 80, pdfPageStart: 78, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 14, topicId: 'lp-cap-14', title: 'Argumentação', printedPageStart: 81, printedPageEnd: 81, pdfPageStart: 82, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 15, topicId: 'lp-cap-15', title: 'Pontuação', printedPageStart: 82, printedPageEnd: 85, pdfPageStart: 83, editalRef: 'Item 6', validationStatus: 'validado' },
      { chapterNumber: 16, topicId: 'lp-cap-16', title: 'Tipos de discurso: direto e indireto', printedPageStart: 86, printedPageEnd: 90, pdfPageStart: 87, editalRef: 'Item 7', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-rlm-analista',
    slug: '02-rlm-analista',
    title: 'Raciocínio Lógico e Matemático (Completo — Analista & Técnico)',
    subject: 'Raciocínio Lógico e Matemático',
    cargoScope: 'analista',
    kind: 'apostila',
    codeAnl: 'Apostila 02',
    codeTec: 'Cobre Ap. 02 Téc',
    orderAnl: 2,
    weightAnl: 'Básicos (1,00)',
    weightTec: 'Básicos (1,00)',
    driveFileIdAnl: '1xsQOL1ez31q8cmILCFLMJLqAoaj2-62M',
    driveFileNameAnl: '02 SL 162OT 26 CUIABA MT ANAL LEG TI_Raciocinio Logico e Matematico.pdf',
    totalPages: 55,
    pageOffset: 1,
    questionsPrintedPage: 49,
    answerKeyPrintedPage: 54,
    editalSummary: 'Contém 100% do edital de Analista TI (itens 1–8) e engloba integralmente os 7 itens de Técnico Legislativo.',
    chapters: [
      { chapterNumber: 1, topicId: 'rlm-cap-1', title: 'Operações com conjuntos', printedPageStart: 1, printedPageEnd: 9, pdfPageStart: 2, editalRef: 'Item 1 (Ambos)', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'rlm-cap-2', title: 'Raciocínio lógico numérico: operações com números reais', printedPageStart: 10, printedPageEnd: 15, pdfPageStart: 11, editalRef: 'Item 2 (Ambos)', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'rlm-cap-3', title: 'Raciocínio sequencial', printedPageStart: 16, printedPageEnd: 21, pdfPageStart: 17, editalRef: 'Item 2 (Ambos)', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'rlm-cap-4', title: 'Proposições, conectivos, negação, tabela-verdade, tautologias e condição necessária/suficiente', printedPageStart: 22, printedPageEnd: 24, pdfPageStart: 23, editalRef: 'Item 3 (Tabela-verdade: Analista)', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'rlm-cap-5', title: 'Argumentação lógica, estruturas lógicas e diagramas lógicos', printedPageStart: 25, printedPageEnd: 28, pdfPageStart: 26, editalRef: 'Item 4 (Ambos)', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'rlm-cap-6', title: 'Equivalências e implicações lógicas', printedPageStart: 29, printedPageEnd: 38, pdfPageStart: 30, editalRef: 'Item 5 (Ambos)', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'rlm-cap-7', title: 'Quantificadores universal e existencial', printedPageStart: 39, printedPageEnd: 42, pdfPageStart: 40, editalRef: 'Item 6 (Ambos)', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'rlm-cap-8', title: 'Problemas de Contagem: Princípio Aditivo/Multiplicativo, Arranjos, Combinações e Permutações', printedPageStart: 43, printedPageEnd: 45, pdfPageStart: 44, editalRef: 'Item 7 (Arranjos/Comb.: Analista)', validationStatus: 'validado' },
      { chapterNumber: 9, topicId: 'rlm-cap-9', title: 'Noções de Probabilidade', printedPageStart: 46, printedPageEnd: 48, pdfPageStart: 47, editalRef: 'Item 8 (Exclusivo Analista)', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-rlm-tecnico',
    slug: '02-rlm-tecnico',
    title: 'Raciocínio Lógico e Matemático (Edição Técnico)',
    subject: 'Raciocínio Lógico e Matemático',
    cargoScope: 'tecnico',
    kind: 'apostila',
    codeTec: 'Apostila 02',
    orderTec: 2,
    weightTec: 'Básicos (1,00)',
    driveFileIdTec: '1mIZA66L5TTWwAhRrSqUHv1ROFgn_ghY4',
    driveFileNameTec: '02 SL 157OT 26 CUIABA MT TEC LEG_Raciocinio Logico e Matematico.pdf',
    totalPages: 54,
    pageOffset: 1,
    questionsPrintedPage: 48,
    answerKeyPrintedPage: 53,
    editalSummary: 'Cobre exatamente os itens 1–7 do edital de Técnico Legislativo (sem probabilidade nem análise combinatória avançada).',
    chapters: [
      { chapterNumber: 1, topicId: 'rlm-cap-1', title: 'Operações com conjuntos', printedPageStart: 1, printedPageEnd: 8, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'rlm-cap-2', title: 'Raciocínio lógico numérico: números reais e raciocínio sequencial', printedPageStart: 9, printedPageEnd: 20, pdfPageStart: 10, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'rlm-cap-4', title: 'Conceito de proposição: valores lógicos, conectivos e negação', printedPageStart: 21, printedPageEnd: 23, pdfPageStart: 22, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'rlm-cap-5', title: 'Argumentação lógica, diagramas lógicos e quantificadores universal e existencial', printedPageStart: 24, printedPageEnd: 35, pdfPageStart: 25, editalRef: 'Itens 4 e 6', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'rlm-cap-6', title: 'Equivalências e implicações lógicas', printedPageStart: 36, printedPageEnd: 44, pdfPageStart: 37, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'rlm-cap-8', title: 'Problemas de contagem: princípios aditivo e multiplicativo', printedPageStart: 45, printedPageEnd: 47, pdfPageStart: 46, editalRef: 'Item 7', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-informatica',
    slug: '03-informatica',
    title: 'Noções de Informática',
    subject: 'Noções de Informática',
    cargoScope: 'ambos',
    kind: 'apostila',
    codeAnl: 'Apostila 03',
    codeTec: 'Apostila 03',
    orderAnl: 3,
    orderTec: 3,
    weightAnl: 'Básicos (1,00)',
    weightTec: 'Básicos (1,00)',
    driveFileIdAnl: '1FznVFgK11g3f48Bprm4u95lCm5RtNK76',
    driveFileIdTec: '1Ii1TO82LYnbSJ__dHMiVPKjtBZ83IU3J',
    driveFileNameAnl: '03 SL 162OT 26 CUIABA MT ANAL LEG TI_Nocoes de Informatica.pdf',
    driveFileNameTec: '03 SL 157OT 26 CUIABA MT TEC LEG_Nocoes de Informatica.pdf',
    totalPages: 154,
    pageOffset: 1,
    questionsPrintedPage: 146,
    answerKeyPrintedPage: 153,
    editalSummary: '100% idêntica para Analista TI e Técnico. Cobre todos os itens 1 a 7 do Anexo V, incluindo LGPD.',
    chapters: [
      { chapterNumber: 1, topicId: 'inf-cap-1', title: 'Microinformática: hardware, software, dispositivos de entrada, saída e armazenamento', printedPageStart: 1, printedPageEnd: 6, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'inf-cap-2', title: 'Sistemas operacionais: Windows 10 e 11 e distribuições Linux', printedPageStart: 7, printedPageEnd: 32, pdfPageStart: 8, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'inf-cap-3', title: 'Pacotes de escritório: Microsoft 365 (Word, Excel, PowerPoint) e LibreOffice 7+ (Writer, Calc, Impress)', printedPageStart: 33, printedPageEnd: 68, pdfPageStart: 34, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'inf-cap-4', title: 'Redes de computadores, internet, TCP/IP, navegadores, e-mail e colaboração', printedPageStart: 69, printedPageEnd: 91, pdfPageStart: 70, editalRef: 'Item 4', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'inf-cap-5', title: 'Computação em nuvem, armazenamento e serviços online', printedPageStart: 92, printedPageEnd: 99, pdfPageStart: 93, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'inf-cap-6', title: 'Redes sociais e comunicação digital', printedPageStart: 100, printedPageEnd: 102, pdfPageStart: 101, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'inf-cap-7', title: 'Segurança da informação: ameaças, backup, firewall, antivírus e 2FA', printedPageStart: 103, printedPageEnd: 122, pdfPageStart: 104, editalRef: 'Item 6', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'inf-cap-8', title: 'Noções da Lei nº 13.709/2018 (LGPD)', printedPageStart: 123, printedPageEnd: 145, pdfPageStart: 124, editalRef: 'Item 7', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-etica',
    slug: '04-etica-filosofia',
    title: 'Noções de Ética e Filosofia',
    subject: 'Noções de Ética e Filosofia',
    cargoScope: 'ambos',
    kind: 'apostila',
    codeAnl: 'Apostila 04',
    codeTec: 'Apostila 05',
    orderAnl: 4,
    orderTec: 5,
    weightAnl: 'Gerais (1,00)',
    weightTec: 'Gerais (1,00)',
    driveFileIdAnl: '1_AVzNUdJhvKZiwdlWlBE36iSR_8qld2s',
    driveFileIdTec: '1bcmyRzm0BYSW5P5ZACwvFrStP7--S1Ue',
    driveFileNameAnl: '04 SL 162OT 26 CUIABA MT ANAL LEG TI_Nocoes de Etica e Filosofia.pdf',
    driveFileNameTec: '05 SL 157OT 26 CUIABA MT TEC LEG_Nocoes de Etica e Filosofia.pdf',
    totalPages: 53,
    pageOffset: 1,
    questionsPrintedPage: 45,
    answerKeyPrintedPage: 52,
    editalSummary: '100% idêntica para ambos os cargos. Cobre exatamente os 8 itens do Anexo V.',
    chapters: [
      { chapterNumber: 1, topicId: 'et-cap-1', title: 'Fundamentos da Filosofia', printedPageStart: 1, printedPageEnd: 5, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'et-cap-2', title: 'Filosofia moral: Ética ou filosofia moral', printedPageStart: 6, printedPageEnd: 11, pdfPageStart: 7, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'et-cap-3', title: 'Consciência crítica e filosofia', printedPageStart: 12, printedPageEnd: 16, pdfPageStart: 13, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'et-cap-4', title: 'A relação entre os valores éticos ou morais e a cultura', printedPageStart: 17, printedPageEnd: 22, pdfPageStart: 18, editalRef: 'Item 4', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'et-cap-5', title: 'Juízos de fato ou de realidade e juízos de valor', printedPageStart: 23, printedPageEnd: 27, pdfPageStart: 24, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'et-cap-6', title: 'Ética e cidadania', printedPageStart: 28, printedPageEnd: 33, pdfPageStart: 29, editalRef: 'Item 6', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'et-cap-7', title: 'Racionalismo ético', printedPageStart: 34, printedPageEnd: 38, pdfPageStart: 35, editalRef: 'Item 7', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'et-cap-8', title: 'Ética e liberdade', printedPageStart: 39, printedPageEnd: 44, pdfPageStart: 40, editalRef: 'Item 8', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-relacoes',
    slug: '05-relacoes-interpessoais',
    title: 'Relações Interpessoais',
    subject: 'Relações Interpessoais',
    cargoScope: 'ambos',
    kind: 'apostila',
    codeAnl: 'Apostila 05',
    codeTec: 'Apostila 06',
    orderAnl: 5,
    orderTec: 6,
    weightAnl: 'Gerais (1,00)',
    weightTec: 'Gerais (1,00) + Esp.',
    driveFileIdAnl: '1wnJGT2EhMhqaIswDJ6N49BTXlsu7n2fS',
    driveFileIdTec: '1JekfeRZm-e2GohlKgW3WxlPzq-E0kaLQ',
    driveFileNameAnl: '05 SL 162OT 26 CUIABA MT ANAL LEG TI_Relacoes Interpessoais.pdf',
    driveFileNameTec: '06 SL 157OT 26 CUIABA MT TEC LEG_Relacoes Interpessoais.pdf',
    totalPages: 36,
    pageOffset: 1,
    questionsPrintedPage: 28,
    answerKeyPrintedPage: 35,
    editalSummary: '100% idêntica para ambos os cargos. No Técnico, o tema também reaparece no item 10 dos Conhecimentos Específicos.',
    chapters: [
      { chapterNumber: 1, topicId: 'ri-cap-1', title: 'Relações Humanas / Interpessoal', printedPageStart: 1, printedPageEnd: 5, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'ri-cap-2', title: 'Comunicação Interpessoal', printedPageStart: 6, printedPageEnd: 6, pdfPageStart: 7, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'ri-cap-3', title: 'Característica de um bom atendimento', printedPageStart: 7, printedPageEnd: 10, pdfPageStart: 8, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'ri-cap-4', title: 'Postura Profissional', printedPageStart: 11, printedPageEnd: 11, pdfPageStart: 12, editalRef: 'Item 4', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'ri-cap-5', title: 'Integração', printedPageStart: 12, printedPageEnd: 17, pdfPageStart: 13, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'ri-cap-6', title: 'Empatia', printedPageStart: 18, printedPageEnd: 22, pdfPageStart: 19, editalRef: 'Item 6', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'ri-cap-7', title: 'Capacidade de ouvir', printedPageStart: 23, printedPageEnd: 24, pdfPageStart: 24, editalRef: 'Item 7', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'ri-cap-8', title: 'Argumentação Flexível', printedPageStart: 25, printedPageEnd: 27, pdfPageStart: 26, editalRef: 'Item 8', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-adm-publica',
    slug: '06-adm-publica',
    title: 'Noções de Administração Pública',
    subject: 'Noções de Administração Pública',
    cargoScope: 'analista',
    kind: 'apostila',
    codeAnl: 'Apostila 06',
    codeTec: 'Dentro da Ap. 07',
    orderAnl: 6,
    weightAnl: 'Gerais (1,00)',
    weightTec: 'Específicos (1,75)',
    highWeightTec: true,
    driveFileIdAnl: '1NQP3aLoHC67nBtsJ5ByBstY0LIHzKKl2',
    driveFileNameAnl: '06 SL 162OT 26 CUIABA MT ANAL LEG TI_Nocoes de Administracao Publica.pdf',
    totalPages: 42,
    pageOffset: 1,
    questionsPrintedPage: 35,
    answerKeyPrintedPage: 40,
    editalSummary: 'Ponte estratégica: cai em Gerais no Analista TI (1,00) e com peso 1,75 nos itens 1–4 dos Específicos de Técnico Legislativo.',
    chapters: [
      { chapterNumber: 1, topicId: 'adm-cap-1', title: 'Estado, governo e administração pública: conceitos, elementos, poderes, fins e princípios', printedPageStart: 1, printedPageEnd: 4, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'adm-cap-2', title: 'Organização administrativa do Estado: Administração direta e indireta', printedPageStart: 5, printedPageEnd: 10, pdfPageStart: 6, editalRef: 'Itens 2 e 3', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'adm-cap-3', title: 'Agentes públicos: espécies, classificação, poderes, deveres, cargo, emprego e função', printedPageStart: 11, printedPageEnd: 17, pdfPageStart: 12, editalRef: 'Item 4', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'adm-cap-4', title: 'Poderes administrativos', printedPageStart: 18, printedPageEnd: 20, pdfPageStart: 19, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'adm-cap-5', title: 'Atos administrativos: conceitos, requisitos, atributos, classificação, espécies e invalidação', printedPageStart: 21, printedPageEnd: 26, pdfPageStart: 22, editalRef: 'Item 6', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'adm-cap-6', title: 'Controle e responsabilização da administração: administrativo, judicial, legislativo e responsabilidade civil', printedPageStart: 27, printedPageEnd: 34, pdfPageStart: 28, editalRef: 'Item 7', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-especificos-ti',
    slug: '07-especificos-analista-ti',
    title: 'Conhecimentos Específicos — Analista TI',
    subject: 'Conhecimentos Específicos — Analista TI',
    cargoScope: 'analista',
    kind: 'apostila',
    codeAnl: 'Apostila 07',
    orderAnl: 7,
    weightAnl: 'Específicos (1,75 + Disc.)',
    highWeightAnl: true,
    driveFileIdAnl: '1l6xfsHsp0rNeasjITEMhi2Vb3dQYQl_H',
    driveFileNameAnl: '07 SL 162OT 26 CUIABA MT ANAL LEG TI_Conhecimentos Especificos.pdf',
    totalPages: 234,
    pageOffset: 1,
    questionsPrintedPage: 226,
    answerKeyPrintedPage: 232,
    editalSummary: 'Núcleo decisivo do Analista TI (junto com Legislação = 70% da objetiva + 100 pts discursiva). Cobre 100% dos 14 tópicos do Anexo V (o edital repete o nº 3 duas vezes, totalizando 14 itens).',
    chapters: [
      { chapterNumber: 1, topicId: 'ti-cap-1', title: 'Fundamentos de computação, arquitetura de computadores e sistemas de informação', printedPageStart: 1, printedPageEnd: 12, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'ti-cap-2', title: 'Lógica de programação, algoritmos, estruturas de dados e POO', printedPageStart: 13, printedPageEnd: 18, pdfPageStart: 14, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'ti-cap-3', title: 'Engenharia de software: análise, modelagem, requisitos, documentação, testes e ágil', printedPageStart: 19, printedPageEnd: 25, pdfPageStart: 20, editalRef: 'Item 3 (parte A)', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'ti-cap-4', title: 'Desenvolvimento web e APIs: HTML, CSS, JavaScript, serviços web e APIs REST', printedPageStart: 26, printedPageEnd: 31, pdfPageStart: 27, editalRef: 'Item 3 (parte B)', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'ti-cap-5', title: 'Banco de dados: modelagem relacional, SQL, administração, integridade, backup e recuperação', printedPageStart: 32, printedPageEnd: 42, pdfPageStart: 33, editalRef: 'Item 4', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'ti-cap-6', title: 'Redes de computadores: OSI, TCP/IP, protocolos, IP, equipamentos, cabeamento e cliente-servidor', printedPageStart: 43, printedPageEnd: 53, pdfPageStart: 44, editalRef: 'Item 5', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'ti-cap-7', title: 'Sistemas operacionais Windows e Linux: administração, usuários, permissões, serviços e backup', printedPageStart: 54, printedPageEnd: 68, pdfPageStart: 55, editalRef: 'Item 6', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'ti-cap-8', title: 'Segurança da informação: políticas, IAM, criptografia, firewall, pentest, incidentes e ISO 27001/27002', printedPageStart: 69, printedPageEnd: 84, pdfPageStart: 70, editalRef: 'Item 7', validationStatus: 'validado' },
      { chapterNumber: 9, topicId: 'ti-cap-9', title: 'Governança e gestão de TI: planejamento estratégico, PDTI, serviços, projetos, riscos e indicadores', printedPageStart: 85, printedPageEnd: 90, pdfPageStart: 86, editalRef: 'Item 8', validationStatus: 'validado' },
      { chapterNumber: 10, topicId: 'ti-cap-10', title: 'Controle de versões, integração contínua (CI), entrega contínua (CD) e conteinerização', printedPageStart: 91, printedPageEnd: 93, pdfPageStart: 92, editalRef: 'Item 9', validationStatus: 'validado' },
      { chapterNumber: 11, topicId: 'ti-cap-11', title: 'Análise de dados, visualização de informações e ferramentas de Business Intelligence', printedPageStart: 94, printedPageEnd: 101, pdfPageStart: 95, editalRef: 'Item 10', validationStatus: 'validado' },
      { chapterNumber: 12, topicId: 'ti-cap-12', title: 'Contratação e gestão de soluções de TI na Administração Pública (Lei nº 14.133/2021)', printedPageStart: 102, printedPageEnd: 183, pdfPageStart: 103, editalRef: 'Item 11', validationStatus: 'validado' },
      { chapterNumber: 13, topicId: 'ti-cap-13', title: 'Lei nº 13.709/2018 (LGPD), Lei nº 12.527/2011 (LAI) e segurança de dados no setor público', printedPageStart: 184, printedPageEnd: 219, pdfPageStart: 185, editalRef: 'Item 12', validationStatus: 'validado' },
      { chapterNumber: 14, topicId: 'ti-cap-14', title: 'Suporte técnico, atendimento a usuários, treinamento e documentação técnica', printedPageStart: 220, printedPageEnd: 225, pdfPageStart: 221, editalRef: 'Item 13', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-hist-geo',
    slug: '08-historia-geografia-mt',
    title: 'História e Geografia de Mato Grosso',
    subject: 'História e Geografia de MT',
    cargoScope: 'ambos',
    kind: 'apostila',
    codeAnl: 'Apostila 08',
    codeTec: 'Apostila 04',
    orderAnl: 8,
    orderTec: 4,
    weightAnl: 'Gerais (1,00)',
    weightTec: 'Gerais (1,00)',
    driveFileIdAnl: '1C4qcF4A-1Bhn_wmfCjef4iE-s-LvBurD',
    driveFileIdTec: '1SKxWhJJGFQDpPaFJIDbtgmVUazwA3Vxi',
    driveFileNameAnl: '08 SL 162OT 26 CUIABA MT ANAL LEG TI_Historia e Geografia de Mato Grosso.pdf',
    driveFileNameTec: '04 SL 157OT 26 CUIABA MT TEC LEG_Historia e Geografia de Mato Grosso.pdf',
    totalPages: 34,
    pageOffset: 1,
    questionsPrintedPage: 25,
    answerKeyPrintedPage: 33,
    editalSummary: '100% idêntica para ambos os cargos. Cobre História (Colonial, Imperial, Republicano + Atualidades) e Geografia de MT.',
    chapters: [
      { chapterNumber: 1, topicId: 'hg-cap-1', title: 'História de MT — Período Colonial (bandeirantes, Cuiabá, Vila Bela, escravidão)', printedPageStart: 1, printedPageEnd: 5, pdfPageStart: 2, editalRef: 'História Colonial 1–4', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'hg-cap-2', title: 'História de MT — Período Imperial (mineração, A Rusga, quilombos, Guerra do Paraguai)', printedPageStart: 6, printedPageEnd: 11, pdfPageStart: 7, editalRef: 'História Imperial 1–7', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'hg-cap-3', title: 'História de MT — Período Republicano (coronelismo, açúcar/gado, Era Vargas, governadores)', printedPageStart: 12, printedPageEnd: 17, pdfPageStart: 13, editalRef: 'História Republicano 1–6', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'hg-cap-4', title: 'Tópicos relevantes e atuais de política, economia, sociedade, tecnologia e ecologia', printedPageStart: 18, printedPageEnd: 18, pdfPageStart: 19, editalRef: 'História Republicano 7', validationStatus: 'atencao', validationNote: 'Capítulo curto (1 página); complemente com atualidades recentes de MT e do Brasil.' },
      { chapterNumber: 5, topicId: 'hg-cap-5', title: 'Geografia de Mato Grosso (Centro-Oeste, geopolítica, domínios naturais, agro e urbanização)', printedPageStart: 19, printedPageEnd: 24, pdfPageStart: 20, editalRef: 'Geografia 1–10', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-legislacao',
    slug: '09-legislacao',
    title: 'Legislação Municipal de Cuiabá',
    subject: 'Legislação Municipal',
    cargoScope: 'ambos',
    kind: 'apostila',
    codeAnl: 'Apostila 09',
    codeTec: 'Apostila 08',
    orderAnl: 9,
    orderTec: 8,
    weightAnl: 'Específicos (1,75)',
    weightTec: 'Básicos (1,00)',
    highWeightAnl: true,
    driveFileIdAnl: '1kUQBUz0MSjnXiSlQkZP2nUQf2jjyu30s',
    driveFileIdTec: '14fnmbIEF6fbbbsgM1CJfLoqepG4jI7dt',
    driveFileNameAnl: '09 SL 162OT 26 CUIABA MT ANAL LEG TI_Legislacao.pdf',
    driveFileNameTec: '08 SL 157OT 26 CUIABA MT TEC LEG_Legislacao.pdf',
    totalPages: 191,
    pageOffset: 1,
    questionsPrintedPage: 182,
    answerKeyPrintedPage: 190,
    editalSummary: '100% idêntica para ambos os cargos! Vale peso 1,75 no Analista TI e supre também a lacuna de Poder Legislativo/Processo Legislativo da Apostila 07 do Técnico.',
    chapters: [
      { chapterNumber: 1, topicId: 'leg-cap-1', title: 'Lei Orgânica do Município de Cuiabá-MT', printedPageStart: 1, printedPageEnd: 53, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'leg-cap-2', title: 'Regimento Interno da Câmara Municipal de Cuiabá (Resolução nº 08/2016)', printedPageStart: 54, printedPageEnd: 117, pdfPageStart: 55, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'leg-cap-3', title: 'Lei Complementar nº 93/2003 (Estatuto dos Servidores Públicos de Cuiabá)', printedPageStart: 118, printedPageEnd: 158, pdfPageStart: 119, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'leg-cap-4', title: 'Lei Complementar nº 235/2011 (Plano de Cargos da CMC) com alterações da LC nº 609/2026', printedPageStart: 159, printedPageEnd: 181, pdfPageStart: 160, editalRef: 'Item 4', validationStatus: 'validado' },
    ],
  },
  {
    id: 'ap-especificos-tecnico',
    slug: '10-especificos-tecnico',
    title: 'Conhecimentos Específicos — Técnico Legislativo',
    subject: 'Conhecimentos Específicos — Técnico',
    cargoScope: 'tecnico',
    kind: 'apostila',
    codeTec: 'Apostila 07',
    orderTec: 7,
    weightTec: 'Específicos (1,75 + Disc.)',
    highWeightTec: true,
    driveFileIdTec: '12Whet0rumVvriYoFvvWvqcGQKbSr7LFD',
    driveFileNameTec: '07 SL 157OT 26 CUIABA MT TEC LEG_Conhecimentos Especificos.pdf',
    totalPages: 117,
    pageOffset: 1,
    questionsPrintedPage: 108,
    answerKeyPrintedPage: 116,
    editalSummary: 'Vale 70% da prova de Técnico (peso 1,75 + Discursiva). Atenção: Cap. 10 (Poder Legislativo) tem lacuna — usar Apostila de Legislação; Cap. 16 (Fotografia) está fora do edital.',
    chapters: [
      { chapterNumber: 1, topicId: 'adm-cap-1', title: 'Estado, governo e Administração Pública: conceitos, elementos, organização e princípios', printedPageStart: 1, printedPageEnd: 4, pdfPageStart: 2, editalRef: 'Item 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'adm-cap-2', title: 'Organização administrativa do Estado: Administração Direta, Indireta e Órgãos públicos', printedPageStart: 5, printedPageEnd: 10, pdfPageStart: 6, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'adm-cap-3', title: 'Agentes públicos: cargo, emprego e função pública', printedPageStart: 11, printedPageEnd: 17, pdfPageStart: 12, editalRef: 'Item 2', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'tec-cap-1', title: 'Noções de Direito Administrativo: princípios administrativos', printedPageStart: 18, printedPageEnd: 23, pdfPageStart: 19, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'adm-cap-4', title: 'Poderes administrativos', printedPageStart: 24, printedPageEnd: 27, pdfPageStart: 25, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'adm-cap-5', title: 'Atos administrativos: conceito, requisitos, atributos e espécies', printedPageStart: 28, printedPageEnd: 33, pdfPageStart: 29, editalRef: 'Item 3', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'adm-cap-6', title: 'Controle da Administração Pública: administrativo, legislativo e judicial', printedPageStart: 34, printedPageEnd: 37, pdfPageStart: 35, editalRef: 'Item 4', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'adm-cap-7', title: 'Responsabilidade civil da Administração Pública', printedPageStart: 38, printedPageEnd: 41, pdfPageStart: 39, editalRef: 'Item 4', validationStatus: 'validado' },
      { chapterNumber: 9, topicId: 'tec-cap-2', title: 'Direitos e garantias fundamentais, cidadania e Administração Pública (arts. 37 a 41 CF)', printedPageStart: 42, printedPageEnd: 61, pdfPageStart: 43, editalRef: 'Item 5', validationStatus: 'validado' },
      {
        chapterNumber: 10,
        topicId: 'tec-cap-3',
        title: 'Organização e funcionamento do Poder Legislativo Municipal, Processo e Técnica Legislativa',
        printedPageStart: 62,
        printedPageEnd: 62,
        pdfPageStart: 63,
        editalRef: 'Itens 6 e 7',
        validationStatus: 'lacuna',
        validationNote: 'Lacuna na apostila (pág. 62 traz apenas fim do art. 41 CF). Estude pela Apostila de Legislação (Lei Orgânica p. 1 e Regimento Interno p. 54).',
        fallbackApostilaId: 'ap-legislacao',
        fallbackPdfPage: 55,
      },
      { chapterNumber: 11, topicId: 'tec-cap-4', title: 'Redação oficial: ofícios, memorandos, requerimentos, atas, sinopses e relatórios', printedPageStart: 63, printedPageEnd: 76, pdfPageStart: 64, editalRef: 'Itens 8 e 13', validationStatus: 'validado' },
      { chapterNumber: 12, topicId: 'tec-cap-5', title: 'Arquivologia: protocolo, classificação, guarda, conservação e arquivamento', printedPageStart: 77, printedPageEnd: 86, pdfPageStart: 78, editalRef: 'Item 9', validationStatus: 'validado' },
      { chapterNumber: 13, topicId: 'tec-cap-6', title: 'Atendimento ao público, recepção e relações interpessoais no ambiente de trabalho', printedPageStart: 87, printedPageEnd: 95, pdfPageStart: 88, editalRef: 'Item 10', validationStatus: 'validado' },
      { chapterNumber: 14, topicId: 'tec-cap-7', title: 'Noções de contabilidade aplicada ao setor público: receita, despesa e orçamento', printedPageStart: 96, printedPageEnd: 99, pdfPageStart: 97, editalRef: 'Item 11', validationStatus: 'validado' },
      {
        chapterNumber: 15,
        topicId: 'tec-cap-8',
        title: 'Noções de higiene e segurança do trabalho',
        printedPageStart: 100,
        printedPageEnd: 101,
        pdfPageStart: 101,
        editalRef: 'Item 12',
        validationStatus: 'atencao',
        validationNote: 'Texto da apostila traz exemplos voltados a enfermagem do trabalho; foque em ergonomia (NR-17), riscos ambientais e segurança em escritório.',
      },
      {
        chapterNumber: 16,
        topicId: 'tec-cap-9',
        title: 'Noções de fotografia aplicada às atividades institucionais',
        printedPageStart: 102,
        printedPageEnd: 107,
        pdfPageStart: 103,
        editalRef: 'Fora do Edital',
        validationStatus: 'fora-edital',
        validationNote: 'Não consta no Anexo V de Técnico Legislativo. Pode ignorar para otimizar seu tempo.',
      },
    ],
  },
  {
    id: 'md-analista-ti',
    slug: '11-md-analista-ti',
    title: 'Material Digital — História/Geo MT + Legislação (Analista TI)',
    subject: 'Legislação Municipal',
    cargoScope: 'analista',
    kind: 'material-digital',
    codeAnl: 'Material Digital',
    orderAnl: 10,
    weightAnl: 'Gerais + Esp. (1,75)',
    driveFileIdAnl: '1kMw5lrJWEZ2FCog30mdSQBvRK-96PVCa',
    driveFileNameAnl: 'SL-162OT-26-CUIABA-MT-ANAL-LEG-TI_MD.pdf',
    totalPages: 136,
    pageOffset: 0,
    editalSummary: 'Versão digital complementar contendo História e Geografia de MT (p. 3–24) e Legislação Municipal (p. 25–136).',
    chapters: [
      { chapterNumber: 1, topicId: 'hg-cap-1', title: 'História de MT — Período Colonial', printedPageStart: 3, printedPageEnd: 6, pdfPageStart: 3, editalRef: 'História Colonial', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'hg-cap-2', title: 'História de MT — Período Imperial', printedPageStart: 7, printedPageEnd: 10, pdfPageStart: 7, editalRef: 'História Imperial', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'hg-cap-3', title: 'História de MT — Período Republicano', printedPageStart: 11, printedPageEnd: 14, pdfPageStart: 11, editalRef: 'História Republicano', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'hg-cap-4', title: 'Tópicos relevantes e atuais', printedPageStart: 15, printedPageEnd: 15, pdfPageStart: 15, editalRef: 'Atualidades', validationStatus: 'validado' },
      { chapterNumber: 5, topicId: 'hg-cap-5', title: 'Geografia de Mato Grosso', printedPageStart: 16, printedPageEnd: 24, pdfPageStart: 16, editalRef: 'Geografia 1–10', validationStatus: 'validado' },
      { chapterNumber: 6, topicId: 'leg-cap-1', title: 'Lei Orgânica do Município de Cuiabá-MT', printedPageStart: 25, printedPageEnd: 55, pdfPageStart: 25, editalRef: 'Legislação 1', validationStatus: 'validado' },
      { chapterNumber: 7, topicId: 'leg-cap-2', title: 'Regimento Interno da Câmara Municipal de Cuiabá (Res. nº 08/2016)', printedPageStart: 56, printedPageEnd: 92, pdfPageStart: 56, editalRef: 'Legislação 2', validationStatus: 'validado' },
      { chapterNumber: 8, topicId: 'leg-cap-3', title: 'Lei Complementar nº 93/2003 (Estatuto dos Servidores)', printedPageStart: 93, printedPageEnd: 115, pdfPageStart: 93, editalRef: 'Legislação 3', validationStatus: 'validado' },
      { chapterNumber: 9, topicId: 'leg-cap-4', title: 'Lei Complementar nº 235/2011 + LC nº 609/2026 (Plano de Cargos)', printedPageStart: 116, printedPageEnd: 136, pdfPageStart: 116, editalRef: 'Legislação 4', validationStatus: 'validado' },
    ],
  },
  {
    id: 'md-tecnico',
    slug: '12-md-tecnico',
    title: 'Material Digital — Legislação Municipal (Técnico)',
    subject: 'Legislação Municipal',
    cargoScope: 'tecnico',
    kind: 'material-digital',
    codeTec: 'Material Digital',
    orderTec: 9,
    weightTec: 'Básicos (1,00)',
    driveFileIdTec: '1vX7u4u5HWLwmk5wB7uLeoBOi3Vgc0Ga5',
    driveFileNameTec: 'SL-157OT-26-CUIABA-MT-TEC-LEG_MD (1).pdf',
    totalPages: 114,
    pageOffset: 0,
    editalSummary: 'Versão digital complementar da Legislação Municipal para Técnico Legislativo.',
    chapters: [
      { chapterNumber: 1, topicId: 'leg-cap-1', title: 'Lei Orgânica do Município de Cuiabá-MT', printedPageStart: 3, printedPageEnd: 33, pdfPageStart: 3, editalRef: 'Legislação 1', validationStatus: 'validado' },
      { chapterNumber: 2, topicId: 'leg-cap-2', title: 'Regimento Interno da Câmara Municipal de Cuiabá (Res. nº 08/2016)', printedPageStart: 34, printedPageEnd: 70, pdfPageStart: 34, editalRef: 'Legislação 2', validationStatus: 'validado' },
      { chapterNumber: 3, topicId: 'leg-cap-3', title: 'Lei Complementar nº 93/2003 (Estatuto dos Servidores)', printedPageStart: 71, printedPageEnd: 93, pdfPageStart: 71, editalRef: 'Legislação 3', validationStatus: 'validado' },
      { chapterNumber: 4, topicId: 'leg-cap-4', title: 'Lei Complementar nº 235/2011 + LC nº 609/2026 (Plano de Cargos)', printedPageStart: 94, printedPageEnd: 114, pdfPageStart: 94, editalRef: 'Legislação 4', validationStatus: 'validado' },
    ],
  },
];

export function getApostilaById(id: string): ApostilaSpec | undefined {
  return APOSTILAS_CATALOG.find(a => a.id === id);
}

export function getApostilasForCargo(scope: 'analista' | 'tecnico' | 'all', includeDigital = false): ApostilaSpec[] {
  const base = includeDigital ? APOSTILAS_CATALOG : APOSTILAS_CATALOG.filter(a => a.kind === 'apostila');
  if (scope === 'analista') {
    return base
      .filter(a => a.cargoScope === 'ambos' || a.cargoScope === 'analista')
      .sort((a, b) => (a.orderAnl ?? 99) - (b.orderAnl ?? 99));
  }
  if (scope === 'tecnico') {
    return base
      .filter(a => a.cargoScope === 'ambos' || a.cargoScope === 'tecnico')
      .sort((a, b) => (a.orderTec ?? 99) - (b.orderTec ?? 99));
  }
  return base;
}

export function getDrivePreviewUrl(ap: ApostilaSpec, preferredCargo?: CargoKey): string | null {
  const fileId =
    preferredCargo === 'tecnico'
      ? ap.driveFileIdTec || ap.driveFileIdAnl
      : ap.driveFileIdAnl || ap.driveFileIdTec;
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
}

export function getDriveViewUrl(ap: ApostilaSpec, preferredCargo?: CargoKey): string | null {
  const fileId =
    preferredCargo === 'tecnico'
      ? ap.driveFileIdTec || ap.driveFileIdAnl
      : ap.driveFileIdAnl || ap.driveFileIdTec;
  return fileId ? `https://drive.google.com/file/d/${fileId}/view` : null;
}

export function findChapterForTopic(
  topicId: string,
  preferredCargo: CargoKey = 'analista'
): { apostila: ApostilaSpec; chapter: ApostilaChapter } | null {
  const ordered = getApostilasForCargo(preferredCargo, false);
  for (const ap of ordered) {
    const ch = ap.chapters.find(c => c.topicId === topicId);
    if (ch) return { apostila: ap, chapter: ch };
  }
  for (const ap of APOSTILAS_CATALOG) {
    const ch = ap.chapters.find(c => c.topicId === topicId);
    if (ch) return { apostila: ap, chapter: ch };
  }
  return null;
}

export function matchPdfFileToApostila(fileName: string): ApostilaSpec | null {
  const norm = fileName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (norm.includes('162ot') && norm.includes('_md')) return getApostilaById('md-analista-ti') || null;
  if (norm.includes('157ot') && norm.includes('_md')) return getApostilaById('md-tecnico') || null;
  if (norm.includes('lingua portuguesa') || norm.includes('portugues')) return getApostilaById('ap-portugues') || null;
  if (norm.includes('raciocinio') || norm.includes('rlm')) {
    if (norm.includes('157ot') || norm.includes('tec')) return getApostilaById('ap-rlm-tecnico') || null;
    return getApostilaById('ap-rlm-analista') || null;
  }
  if (norm.includes('informatica')) return getApostilaById('ap-informatica') || null;
  if (norm.includes('etica') || norm.includes('filosofia')) return getApostilaById('ap-etica') || null;
  if (norm.includes('relacoes') || norm.includes('interpesso')) return getApostilaById('ap-relacoes') || null;
  if (norm.includes('administracao publica') || norm.includes('adm_publica')) return getApostilaById('ap-adm-publica') || null;
  if (norm.includes('historia') || norm.includes('geografia')) return getApostilaById('ap-hist-geo') || null;
  if (norm.includes('legislacao')) return getApostilaById('ap-legislacao') || null;
  if (norm.includes('especificos')) {
    if (norm.includes('157ot') || norm.includes('tec')) return getApostilaById('ap-especificos-tecnico') || null;
    return getApostilaById('ap-especificos-ti') || null;
  }
  return null;
}
