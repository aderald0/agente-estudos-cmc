export interface FlashcardSeed {
  id: string;
  subject: string;
  front: string;
  back: string;
  tag: string;
}

export const FLASHCARDS_SEED: FlashcardSeed[] = [
  // Legislação Municipal (Peso 1,75 Analista | 1,00 Técnico)
  {
    id: 'fc-leg-1',
    subject: 'Legislação Municipal',
    front: 'Quais são os símbolos oficiais do Município de Cuiabá segundo o art. 3º da Lei Orgânica?',
    back: 'O Brasão, o Hino e a Bandeira, representativos da cultura, da história e tradição do seu povo.',
    tag: 'LOM Cuiabá · Art. 3º',
  },
  {
    id: 'fc-leg-2',
    subject: 'Legislação Municipal',
    front: 'Como se dá o exercício direto do poder pelo povo no Município de Cuiabá (Art. 2º-A, parágrafo único da LOM)?',
    back: 'Por meio de: I - plebiscito; II - referendo; III - iniciativa popular de lei; IV - participação na administração pública; V - ação fiscalizadora sobre a administração pública.',
    tag: 'LOM Cuiabá · Soberania Popular',
  },
  {
    id: 'fc-leg-3',
    subject: 'Legislação Municipal',
    front: 'Qual o quórum exigido para aprovação de Emenda à Lei Orgânica de Cuiabá e quantos turnos de votação?',
    back: 'Dois turnos de discussão e votação, com interstício mínimo de 10 dias, aprovada por 2/3 (dois terços) dos membros da Câmara Municipal.',
    tag: 'LOM Cuiabá · Quórum 2/3',
  },
  {
    id: 'fc-leg-4',
    subject: 'Legislação Municipal',
    front: 'Qual o quórum para aprovação de Lei Complementar Municipal e para rejeição de Veto do Prefeito na Câmara de Cuiabá?',
    back: 'Ambos exigem MAIORIA ABSOLUTA dos membros da Câmara Municipal (primeiro número inteiro acima da metade do total de vereadores).',
    tag: 'LOM / Regimento Interno · Maioria Absoluta',
  },
  {
    id: 'fc-leg-5',
    subject: 'Legislação Municipal',
    front: 'Qual é a jornada semanal padrão dos servidores efetivos da Câmara Municipal de Cuiabá (art. 36 da LC 235/2011)?',
    back: '30 (trinta) horas semanais.',
    tag: 'LC 235/2011 · Jornada',
  },
  {
    id: 'fc-leg-6',
    subject: 'Legislação Municipal',
    front: 'Quais especialidades foram criadas na Câmara Municipal de Cuiabá pela Lei Complementar nº 609/2026?',
    back: 'Analista Legislativo: TI, Segurança do Trabalho, Psicólogo, Assistente Social e Jornalismo. Técnico Legislativo: Sonorização e Cerimonial (além de ampliar Controlador Interno).',
    tag: 'LC 609/2026 · Novos Cargos',
  },
  {
    id: 'fc-leg-7',
    subject: 'Legislação Municipal',
    front: 'Segundo a LC nº 93/2003 (Estatuto dos Servidores de Cuiabá), quais são as formas de provimento de cargo público?',
    back: 'Nomeação, promoção, readaptação, reversão, aproveitamento, reintegração e recondução.',
    tag: 'LC 93/2003 · Provimento',
  },
  {
    id: 'fc-leg-8',
    subject: 'Legislação Municipal',
    front: 'Diferencie Reintegração, Recondução, Reversão e Aproveitamento no Estatuto dos Servidores (LC 93/2003).',
    back: 'Reintegração = retorno do demitido (invalidada a demissão); Recondução = retorno do estável ao cargo anterior; Reversão = retorno do aposentado; Aproveitamento = retorno do colocado em disponibilidade.',
    tag: 'LC 93/2003 · Pegadinha Clássica',
  },
  {
    id: 'fc-leg-9',
    subject: 'Legislação Municipal',
    front: 'No Regimento Interno da CMC (Res. 08/2016), qual a diferença entre Comissões Permanentes e Temporárias?',
    back: 'Permanentes subsistem através das legislaturas (caráter técnico-legislativo permanente); Temporárias (Especiais, CPI, Representação) extinguem-se ao término da legislatura ou quando atingem seu fim/prazo.',
    tag: 'Regimento Interno · Comissões',
  },

  // Noções de Administração Pública (Peso 1,75 Técnico | 1,00 Analista)
  {
    id: 'fc-adm-1',
    subject: 'Noções de Administração Pública',
    front: 'Diferencie Estado, Governo e Administração Pública.',
    back: 'Estado = pessoa jurídica permanente (povo + território + soberania); Governo = comando político/direção temporária; Administração Pública = estrutura técnica e executiva que operacionaliza as funções públicas.',
    tag: 'Adm. Pública · Conceitos Fundamentais',
  },
  {
    id: 'fc-adm-2',
    subject: 'Noções de Administração Pública',
    front: 'Qual a diferença entre Desconcentração e Descentralização Administrativa?',
    back: 'Desconcentração = distribuição interna de competências na MESMA pessoa jurídica (cria órgãos, há hierarquia); Descentralização = transferência para OUTRA pessoa jurídica (cria entidades da Adm. Indireta ou delega a particulares, sem hierarquia, apenas controle/tutela).',
    tag: 'Adm. Pública · Campeã Selecon',
  },
  {
    id: 'fc-adm-3',
    subject: 'Noções de Administração Pública',
    front: 'Compare Autarquia, Fundação Pública, Empresa Pública (EP) e Sociedade de Economia Mista (SEM).',
    back: 'Autarquia = Direito Público, criada por lei específica; EP = Direito Privado, capital 100% público, qualquer forma societária; SEM = Direito Privado, capital misto (maioria votante pública), sempre S/A.',
    tag: 'Adm. Indireta · Comparativo',
  },
  {
    id: 'fc-adm-4',
    subject: 'Noções de Administração Pública',
    front: 'Quais são os 5 requisitos (elementos) de validade do Ato Administrativo (CO-FI-FO-M-OB)?',
    back: 'Competência, Finalidade e Forma (sempre vinculados) + Motivo e Objeto (podem ser vinculados ou discricionários, formando o mérito administrativo).',
    tag: 'Atos Administrativos · Requisitos',
  },
  {
    id: 'fc-adm-5',
    subject: 'Noções de Administração Pública',
    front: 'Quais são os 4 atributos do Ato Administrativo (PATI)?',
    back: 'Presunção de legitimidade/veracidade (presente em todos), Autoexecutoriedade, Tipicidade e Imperatividade.',
    tag: 'Atos Administrativos · Atributos',
  },
  {
    id: 'fc-adm-6',
    subject: 'Noções de Administração Pública',
    front: 'Diferencie Anulação e Revogação de Ato Administrativo (Súmula 473 STF).',
    back: 'Anulação = por ILEGALIDADE, efeito retroativo (ex tunc), feita pela Administração ou Judiciário; Revogação = por mérito (conveniência/oportunidade) em ato válido discricionário, efeito não retroativo (ex nunc), EXCLUSIVA da Administração.',
    tag: 'Atos Administrativos · Anulação x Revogação',
  },
  {
    id: 'fc-adm-7',
    subject: 'Noções de Administração Pública',
    front: 'Como funciona a Responsabilidade Civil do Estado (Art. 37, § 6º da CF/88)?',
    back: 'Responsabilidade OBJETIVA (Teoria do Risco Administrativo) para pessoas jurídicas de direito público e privado prestadoras de serviço público (independe de dolo/culpa); e SUBJETIVA na ação regressiva contra o agente causador.',
    tag: 'Responsabilidade Civil · Art. 37 §6º',
  },

  // Conhecimentos Específicos — Técnico Legislativo
  {
    id: 'fc-tec-1',
    subject: 'Conhecimentos Específicos — Técnico',
    front: 'No Processo Legislativo, quais são as fases ordinárias de formação de uma lei?',
    back: '1. Fase Introdutória (Iniciativa); 2. Fase Constitutiva (Discussão/Comissões, Votação em Plenário e Sanção/Veto do Executivo); 3. Fase Complementar (Promulgação e Publicação).',
    tag: 'Processo Legislativo · Fases',
  },
  {
    id: 'fc-tec-2',
    subject: 'Conhecimentos Específicos — Técnico',
    front: 'Na Arquivologia (Teoria das Três Idades), diferencie Arquivo Corrente, Intermediário e Permanente.',
    back: 'Corrente (1ª idade) = uso frequente, junto ao setor produtor (valor primário); Intermediário (2ª idade) = uso eventual, aguarda prazo de prescrição/destinação na tabela de temporalidade (valor primário); Permanente (3ª idade) = valor histórico/probatório definitivo, imprescritível e inalienável (valor secundário).',
    tag: 'Arquivologia · 3 Idades',
  },
  {
    id: 'fc-tec-3',
    subject: 'Conhecimentos Específicos — Técnico',
    front: 'Quais são os 3 estágios da Despesa Pública e os 4 estágios da Receita Orçamentária?',
    back: 'Despesa: Empenho → Liquidação → Pagamento (ELP). Receita: Previsão (planejamento) → Lançamento → Arrecadação → Recolhimento (execução).',
    tag: 'Contabilidade Pública · Estágios',
  },
  {
    id: 'fc-tec-4',
    subject: 'Conhecimentos Específicos — Técnico',
    front: 'Na Redação Oficial, qual é o padrão de vocativo e fecho para autoridades segundo o Manual de Redação?',
    back: 'Fechos reduzidos a apenas dois: "Respeitosamente," (para autoridades superiores) e "Atenciosamente," (para autoridades de mesma hierarquia, inferiores ou particulares).',
    tag: 'Redação Oficial · Fechos',
  },

  // Conhecimentos Específicos — Analista TI
  {
    id: 'fc-ti-1',
    subject: 'Conhecimentos Específicos — Analista TI',
    front: 'Quais são as 7 camadas do Modelo OSI (de baixo para cima) e as 4 camadas do Modelo TCP/IP?',
    back: 'OSI: 1-Física, 2-Enlace, 3-Rede, 4-Transporte, 5-Sessão, 6-Apresentação, 7-Aplicação (FERTSAA). TCP/IP: Acesso à Rede (Enlace/Física), Internet (Rede), Transporte, Aplicação.',
    tag: 'Redes · OSI x TCP/IP',
  },
  {
    id: 'fc-ti-2',
    subject: 'Conhecimentos Específicos — Analista TI',
    front: 'Em Banco de Dados Relacional, resuma as Formas Normais (1FN, 2FN e 3FN).',
    back: '1FN = atributos atômicos (sem grupos repetitivos/multivalorados); 2FN = está na 1FN + sem dependência funcional PARCIAL da chave primária composta; 3FN = está na 2FN + sem dependência funcional TRANSITIVA (atributo não-chave dependendo de outro não-chave).',
    tag: 'Banco de Dados · Normalização',
  },
  {
    id: 'fc-ti-3',
    subject: 'Conhecimentos Específicos — Analista TI',
    front: 'Diferencie Backup Completo (Full), Incremental e Diferencial.',
    back: 'Completo = copia todos os dados e limpa o bit de arquivamento; Incremental = copia só o alterado desde o ÚLTIMO backup de qualquer tipo (mais rápido de fazer, mais lento de restaurar); Diferencial = copia tudo alterado desde o último COMPLETO (acumula alterações, restaura só com Full + último Diferencial).',
    tag: 'Segurança / BD · Tipos de Backup',
  },
  {
    id: 'fc-ti-4',
    subject: 'Conhecimentos Específicos — Analista TI',
    front: 'Qual a diferença entre ABNT NBR ISO/IEC 27001 e ISO/IEC 27002?',
    back: 'ISO 27001 = especifica os REQUISITOS para estabelecer, implementar, manter e melhorar um SGSI (é a norma certificável); ISO 27002 = código de prática e diretrizes para implementação dos CONTROLES de segurança (organizados em Organizacionais, Pessoas, Físicos e Tecnológicos).',
    tag: 'Segurança · ISO 27001 x 27002',
  },
  {
    id: 'fc-ti-5',
    subject: 'Conhecimentos Específicos — Analista TI',
    front: 'Na LGPD (Lei nº 13.709/2018), diferencie Controlador, Operador e Encarregado (DPO).',
    back: 'Controlador = a quem competem as decisões referentes ao tratamento de dados pessoais; Operador = realiza o tratamento em nome do controlador; Encarregado (DPO) = atua como canal de comunicação entre o controlador, os titulares dos dados e a ANPD.',
    tag: 'LGPD · Agentes de Tratamento',
  },
  {
    id: 'fc-ti-6',
    subject: 'Conhecimentos Específicos — Analista TI',
    front: 'Na Lei nº 14.133/2021 (Nova Lei de Licitações), quais são as 5 modalidades de licitação?',
    back: 'Pregão, Concorrência, Concurso, Leilão e Diálogo Competitivo. (Atenção: Tomada de Preços e Convite foram EXTINTOS!).',
    tag: 'Lei 14.133/2021 · Modalidades',
  },
  {
    id: 'fc-ti-7',
    subject: 'Conhecimentos Específicos — Analista TI',
    front: 'Na Lei de Acesso à Informação (Lei nº 12.527/2011), quais são os graus e prazos máximos de sigilo da informação?',
    back: 'Ultrassecreta = 25 anos; Secreta = 15 anos; Reservada = 5 anos.',
    tag: 'LAI 12.527/2011 · Prazos de Sigilo',
  },

  // Língua Portuguesa & RLM
  {
    id: 'fc-lp-1',
    subject: 'Língua Portuguesa',
    front: 'Qual a regra de ouro das Equivalências Lógicas da Condicional (p → q) em RLM?',
    back: '1) Contrapositiva (Inverte e Nega): (~q → ~p); 2) Disjunção (Ne-Ma / Neymar — Nega a 1ª ou Mantém a 2ª): (~p v q). Já a NEGAÇÃO de (p → q) é o MANÉ (Mantém a 1ª E Nega a 2ª): (p ^ ~q).',
    tag: 'RLM · Condicional (Cai em Toda Prova)',
  },
  {
    id: 'fc-lp-2',
    subject: 'Língua Portuguesa',
    front: 'Diferencie Polissemia, Homonímia e Paronímia em Semântica.',
    back: 'Polissemia = UMA mesma palavra com múltiplos sentidos (ex: "cabeça" do corpo / "cabeça" do prego); Homonímia = palavras diferentes com mesma grafia ou som (ex: sessão/seção/cessão); Paronímia = palavras parecidas na grafia/som, mas diferentes (ex: ratificar x retificar).',
    tag: 'Português · Semântica',
  },
];
