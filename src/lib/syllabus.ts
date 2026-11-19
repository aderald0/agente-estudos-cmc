export interface SubjectMeta {
  name: string;
  overlap: 'ambos-identico' | 'ponte-peso' | 'exclusivo-analista' | 'exclusivo-tecnico';
  wAnl: string;
  wTec: string;
}

export interface SeedTopic {
  id: string;
  subject: string;
  title: string;
  overlap: string;
  priority: 'alta' | 'media' | 'baixa';
}

export const EXAM_DATE = '2026-12-20';

export const SUBJECT_META: SubjectMeta[] = [
  { name: 'Língua Portuguesa', overlap: 'ambos-identico', wAnl: 'Básicos (1,00)', wTec: 'Básicos (1,00)' },
  { name: 'Raciocínio Lógico e Matemático', overlap: 'ponte-peso', wAnl: 'Básicos (1,00)', wTec: 'Básicos (1,00)' },
  { name: 'Noções de Informática', overlap: 'ambos-identico', wAnl: 'Básicos (1,00)', wTec: 'Básicos (1,00)' },
  { name: 'História e Geografia de MT', overlap: 'ambos-identico', wAnl: 'Gerais (1,00)', wTec: 'Gerais (1,00)' },
  { name: 'Noções de Ética e Filosofia', overlap: 'ambos-identico', wAnl: 'Gerais (1,00)', wTec: 'Gerais (1,00)' },
  { name: 'Relações Interpessoais', overlap: 'ambos-identico', wAnl: 'Gerais (1,00)', wTec: 'Gerais (1,00)+Esp' },
  { name: 'Legislação Municipal', overlap: 'ponte-peso', wAnl: 'Específicos (1,75)', wTec: 'Básicos (1,00)' },
  { name: 'Noções de Administração Pública', overlap: 'ponte-peso', wAnl: 'Gerais (1,00)', wTec: 'Específicos (1,75)' },
  { name: 'Conhecimentos Específicos — Técnico', overlap: 'exclusivo-tecnico', wAnl: '—', wTec: 'Específicos (1,75+Disc)' },
  { name: 'Conhecimentos Específicos — Analista TI', overlap: 'exclusivo-analista', wAnl: 'Específicos (1,75+Disc)', wTec: '—' },
];

export const INITIAL_TOPICS: SeedTopic[] = [
  // 01_portugues.pdf (100% idêntica)
  { id: 'lp-cap-1', subject: 'Língua Portuguesa', title: 'Leitura e interpretação de textos de variados gêneros discursivos', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-2', subject: 'Língua Portuguesa', title: 'As condições de produção de um texto e as marcas composicionais de gêneros textuais diversos', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-cap-3', subject: 'Língua Portuguesa', title: 'Linguagem e adequação social: Variedades linguísticas e seus determinantes sociais, regionais, históricos e individuais', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-cap-4', subject: 'Língua Portuguesa', title: 'Registros formal e informal da linguagem', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-cap-5', subject: 'Língua Portuguesa', title: 'Aspectos linguísticos na construção do texto: Fonética: prosódia', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'lp-cap-6', subject: 'Língua Portuguesa', title: 'Ortografia', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-7', subject: 'Língua Portuguesa', title: 'Morfologia: formação, classificação e flexão das palavras; emprego de nomes, pronomes, conjunções, advérbios, modos e tempos verbais', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-8', subject: 'Língua Portuguesa', title: 'Sintaxe: concordâncias verbal e nominal', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-9', subject: 'Língua Portuguesa', title: 'Regências verbal e nominal', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-10', subject: 'Língua Portuguesa', title: 'Colocação pronominal', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-cap-11', subject: 'Língua Portuguesa', title: 'Semântica: polissemia, paronímia, homonímia, denotação e conotação', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-cap-12', subject: 'Língua Portuguesa', title: 'Textualidade: coesão, coerência', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-13', subject: 'Língua Portuguesa', title: 'Intertextualidade', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-cap-14', subject: 'Língua Portuguesa', title: 'Argumentação', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-15', subject: 'Língua Portuguesa', title: 'Pontuação', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-cap-16', subject: 'Língua Portuguesa', title: 'Tipos de discurso: direto e indireto', overlap: 'ambos-identico', priority: 'media' },

  // 02_rlm.pdf (Analista contém 100% do Técnico + Contagem avançada + Probabilidade)
  { id: 'rlm-cap-1', subject: 'Raciocínio Lógico e Matemático', title: 'Operações com conjuntos', overlap: 'ambos-identico', priority: 'media' },
  { id: 'rlm-cap-2', subject: 'Raciocínio Lógico e Matemático', title: 'Raciocínio lógico numérico: problemas envolvendo operações com números reais', overlap: 'ambos-identico', priority: 'media' },
  { id: 'rlm-cap-3', subject: 'Raciocínio Lógico e Matemático', title: 'Raciocínio sequencial', overlap: 'ambos-identico', priority: 'media' },
  { id: 'rlm-cap-4', subject: 'Raciocínio Lógico e Matemático', title: 'Conceito de proposição: valores lógicos das proposições; conectivos, negação e tabela-verdade. Tautologias. Condição necessária e suficiente', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'rlm-cap-5', subject: 'Raciocínio Lógico e Matemático', title: 'Argumentação lógica, estruturas lógicas e diagramas lógicos', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'rlm-cap-6', subject: 'Raciocínio Lógico e Matemático', title: 'Equivalências e implicações lógicas', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'rlm-cap-7', subject: 'Raciocínio Lógico e Matemático', title: 'Quantificadores universal e existencial', overlap: 'ambos-identico', priority: 'media' },
  { id: 'rlm-cap-8', subject: 'Raciocínio Lógico e Matemático', title: 'Problemas de Contagem: Princípio Aditivo e Princípio Multiplicativo. Arranjos, combinações e permutações', overlap: 'ponte-peso', priority: 'media' },
  { id: 'rlm-cap-9', subject: 'Raciocínio Lógico e Matemático', title: 'Noções de Probabilidade', overlap: 'exclusivo-analista', priority: 'media' },

  // 03_informatica.pdf (100% idêntica)
  { id: 'inf-cap-1', subject: 'Noções de Informática', title: 'Microinformática: conceitos, hardware, software, dispositivos de entrada, saída e armazenamento', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'inf-cap-2', subject: 'Noções de Informática', title: 'Sistemas operacionais: conceitos, recursos e uso do Windows 10 e 11 e de distribuições Linux', overlap: 'ambos-identico', priority: 'media' },
  { id: 'inf-cap-3', subject: 'Noções de Informática', title: 'Pacotes de escritório: Microsoft Office/Microsoft 365 (Word, Excel e PowerPoint) e LibreOffice 7 ou superior (Writer, Calc e Impress): conceitos, recursos, atalhos de teclado e uso', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'inf-cap-4', subject: 'Noções de Informática', title: 'Redes de computadores e internet: conceitos, protocolos, arquitetura TCP/IP, navegadores (Microsoft Edge, Mozilla Firefox e Google Chrome), correio eletrônico e ferramentas de colaboração', overlap: 'ambos-identico', priority: 'media' },
  { id: 'inf-cap-5', subject: 'Noções de Informática', title: 'Computação em nuvem, armazenamento e serviços online', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'inf-cap-6', subject: 'Noções de Informática', title: 'Redes sociais e comunicação digital', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'inf-cap-7', subject: 'Noções de Informática', title: 'Segurança da informação: conceitos, ameaças (vírus, malware, phishing e engenharia social), backup, firewall, antivírus e autenticação em dois fatores', overlap: 'ambos-identico', priority: 'media' },
  { id: 'inf-cap-8', subject: 'Noções de Informática', title: 'Noções da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais)', overlap: 'ambos-identico', priority: 'alta' },

  // 08_hist_geo_mt.pdf (100% idêntica)
  { id: 'hg-cap-1', subject: 'História e Geografia de MT', title: 'História de Mato Grosso: Período Colonial (bandeirantes, fundação de Cuiabá, Vila Bela e escravidão)', overlap: 'ambos-identico', priority: 'media' },
  { id: 'hg-cap-2', subject: 'História e Geografia de MT', title: 'Período Imperial (crise da mineração, A Rusga, quilombos, Guerra da Tríplice Aliança e fim do Império)', overlap: 'ambos-identico', priority: 'media' },
  { id: 'hg-cap-3', subject: 'História e Geografia de MT', title: 'Período Republicano (coronelismo, usinas de açúcar e gado, Era Vargas, política fundiária e governadores)', overlap: 'ambos-identico', priority: 'media' },
  { id: 'hg-cap-4', subject: 'História e Geografia de MT', title: 'Tópicos relevantes e atuais de política, economia, sociedade, educação, tecnologia, energia, relações internacionais, desenvolvimento sustentável, segurança, ecologia e suas vinculações históricas', overlap: 'ambos-identico', priority: 'media' },
  { id: 'hg-cap-5', subject: 'História e Geografia de MT', title: 'Geografia de Mato Grosso: Centro-Oeste, geopolítica, ocupação, domínios naturais, fronteira agrícola, economia e urbanização', overlap: 'ambos-identico', priority: 'media' },

  // 04_etica.pdf (100% idêntica)
  { id: 'et-cap-1', subject: 'Noções de Ética e Filosofia', title: 'Fundamentos da Filosofia', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'et-cap-2', subject: 'Noções de Ética e Filosofia', title: 'Filosofia moral: Ética ou filosofia moral', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'et-cap-3', subject: 'Noções de Ética e Filosofia', title: 'Consciência crítica e filosofia', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'et-cap-4', subject: 'Noções de Ética e Filosofia', title: 'A relação entre os valores éticos ou morais e a cultura', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'et-cap-5', subject: 'Noções de Ética e Filosofia', title: 'Juízos de fato ou de realidade e juízos de valor', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'et-cap-6', subject: 'Noções de Ética e Filosofia', title: 'Ética e cidadania', overlap: 'ambos-identico', priority: 'media' },
  { id: 'et-cap-7', subject: 'Noções de Ética e Filosofia', title: 'Racionalismo ético', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'et-cap-8', subject: 'Noções de Ética e Filosofia', title: 'Ética e liberdade', overlap: 'ambos-identico', priority: 'baixa' },

  // 05_relacoes.pdf (100% idêntica)
  { id: 'ri-cap-1', subject: 'Relações Interpessoais', title: 'Relações Humanas/interpessoal', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'ri-cap-2', subject: 'Relações Interpessoais', title: 'Comunicação Interpessoal', overlap: 'ambos-identico', priority: 'media' },
  { id: 'ri-cap-3', subject: 'Relações Interpessoais', title: 'Característica de um bom atendimento', overlap: 'ambos-identico', priority: 'media' },
  { id: 'ri-cap-4', subject: 'Relações Interpessoais', title: 'Postura Profissional', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'ri-cap-5', subject: 'Relações Interpessoais', title: 'Integração', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'ri-cap-6', subject: 'Relações Interpessoais', title: 'Empatia', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'ri-cap-7', subject: 'Relações Interpessoais', title: 'Capacidade de ouvir', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'ri-cap-8', subject: 'Relações Interpessoais', title: 'Argumentação Flexível', overlap: 'ambos-identico', priority: 'baixa' },

  // 09_legislacao.pdf (100% idêntica; peso 1,75 no Analista)
  { id: 'leg-cap-1', subject: 'Legislação Municipal', title: 'Lei Orgânica do Município de Cuiabá-MT', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-cap-2', subject: 'Legislação Municipal', title: 'Regimento Interno da Câmara Municipal de Cuiabá (Resolução nº 08, de 15 de dezembro de 2016)', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-cap-3', subject: 'Legislação Municipal', title: 'Lei Complementar nº 93, de 23 de junho de 2003 (Estatuto dos Servidores)', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-cap-4', subject: 'Legislação Municipal', title: 'Lei Complementar nº 235, de 3 de junho de 2011 (Plano de Cargos, Carreiras e Vencimentos da Câmara Municipal), com as alterações da Lei Complementar nº 609/2026', overlap: 'ponte-peso', priority: 'alta' },

  // 06_adm_publica.pdf (Ponte: Gerais no Analista, Específicos itens 1-8 no Técnico)
  { id: 'adm-cap-1', subject: 'Noções de Administração Pública', title: 'Estado, governo e administração pública: conceitos, elementos, poderes e organização; natureza, fins e princípios', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'adm-cap-2', subject: 'Noções de Administração Pública', title: 'Organização administrativa do Estado: Administração direta e indireta', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'adm-cap-3', subject: 'Noções de Administração Pública', title: 'Agentes públicos: espécies e classificação, poderes, deveres e prerrogativas; cargo, emprego e função públicos', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'adm-cap-4', subject: 'Noções de Administração Pública', title: 'Poderes administrativos', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'adm-cap-5', subject: 'Noções de Administração Pública', title: 'Atos administrativos: conceitos, requisitos, atributos, classificação, espécies e invalidação', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'adm-cap-6', subject: 'Noções de Administração Pública', title: 'Controle e responsabilização da administração: controle administrativo, controle judicial, controle legislativo, responsabilidade civil', overlap: 'ponte-peso', priority: 'alta' },

  // 10_tec_especificos.pdf (Capítulos exclusivos de Técnico além de Adm. Pública)
  { id: 'tec-cap-1', subject: 'Conhecimentos Específicos — Técnico', title: 'Noções de Direito Administrativo: princípios administrativos', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-cap-2', subject: 'Conhecimentos Específicos — Técnico', title: 'Direitos e garantias fundamentais: Direitos e deveres individuais e coletivos; Direitos sociais; Cidadania; Administração Pública (arts. 37 a 41 da Constituição Federal)', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-cap-3', subject: 'Conhecimentos Específicos — Técnico', title: 'Organização e funcionamento do Poder Legislativo Municipal: Câmara Municipal; Mesa Diretora; Plenário; Comissões Permanentes e Temporárias; Processo Legislativo e técnica legislativa', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-cap-4', subject: 'Conhecimentos Específicos — Técnico', title: 'Redação oficial: comunicações oficiais, ofícios, memorandos, requerimentos, atas, sinopses, relatórios e correspondências administrativas', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-cap-5', subject: 'Conhecimentos Específicos — Técnico', title: 'Arquivologia: protocolo, classificação, organização, guarda, conservação e arquivamento de documentos', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-cap-6', subject: 'Conhecimentos Específicos — Técnico', title: 'Atendimento ao público, recepção e relações interpessoais no ambiente de trabalho', overlap: 'exclusivo-tecnico', priority: 'media' },
  { id: 'tec-cap-7', subject: 'Conhecimentos Específicos — Técnico', title: 'Noções de contabilidade aplicada ao setor público: receita, despesa e orçamento público', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-cap-8', subject: 'Conhecimentos Específicos — Técnico', title: 'Noções de higiene e segurança do trabalho', overlap: 'exclusivo-tecnico', priority: 'media' },
  { id: 'tec-cap-9', subject: 'Conhecimentos Específicos — Técnico', title: 'Noções de fotografia aplicada às atividades institucionais', overlap: 'exclusivo-tecnico', priority: 'baixa' },

  // 07_ti_especificos.pdf (14 capítulos exatos do sumário)
  { id: 'ti-cap-1', subject: 'Conhecimentos Específicos — Analista TI', title: 'Fundamentos de computação, arquitetura de computadores e sistemas de informação', overlap: 'exclusivo-analista', priority: 'media' },
  { id: 'ti-cap-2', subject: 'Conhecimentos Específicos — Analista TI', title: 'Lógica de programação, algoritmos, estruturas de dados e programação orientada a objetos', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-3', subject: 'Conhecimentos Específicos — Analista TI', title: 'Engenharia de software: análise e modelagem de sistemas, levantamento de requisitos, documentação, testes, manutenção e metodologias ágeis', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-4', subject: 'Conhecimentos Específicos — Analista TI', title: 'Desenvolvimento de aplicações web e APIs: HTML, CSS, JavaScript, serviços web e APIs REST', overlap: 'exclusivo-analista', priority: 'media' },
  { id: 'ti-cap-5', subject: 'Conhecimentos Específicos — Analista TI', title: 'Banco de dados: modelagem relacional, SQL, administração, integridade, disponibilidade, backup e recuperação', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-6', subject: 'Conhecimentos Específicos — Analista TI', title: 'Redes de computadores: modelos OSI e TCP/IP, protocolos de comunicação, endereçamento IP, equipamentos de rede, cabeamento estruturado, serviços de rede e administração de ambientes cliente-servidor', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-7', subject: 'Conhecimentos Específicos — Analista TI', title: 'Sistemas operacionais Windows e Linux: instalação, configuração, administração, gerenciamento de usuários, permissões, serviços e rotinas de backup', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-8', subject: 'Conhecimentos Específicos — Analista TI', title: 'Segurança da informação: políticas de segurança, gestão de identidades e acessos, criptografia, certificados digitais, firewall, monitoramento, análise de vulnerabilidades, testes de intrusão, resposta a incidentes e ABNT NBR ISO/IEC 27001 e 27002', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-9', subject: 'Conhecimentos Específicos — Analista TI', title: 'Governança e gestão de TI: planejamento estratégico, plano diretor de TI, gestão de serviços, gestão de projetos, gestão de riscos, indicadores e boas práticas de governança', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-10', subject: 'Conhecimentos Específicos — Analista TI', title: 'Controle de versões, integração contínua, entrega contínua e conteinerização de aplicações', overlap: 'exclusivo-analista', priority: 'media' },
  { id: 'ti-cap-11', subject: 'Conhecimentos Específicos — Analista TI', title: 'Análise de dados, visualização de informações e ferramentas de Business Intelligence', overlap: 'exclusivo-analista', priority: 'media' },
  { id: 'ti-cap-12', subject: 'Conhecimentos Específicos — Analista TI', title: 'Contratação e gestão de soluções de tecnologia da informação na Administração Pública, incluindo a Lei nº 14.133/2021', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-13', subject: 'Conhecimentos Específicos — Analista TI', title: 'Lei nº 13.709/2018 (LGPD), Lei nº 12.527/2011 (Lei de Acesso à Informação) e segurança de dados na Administração Pública', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-cap-14', subject: 'Conhecimentos Específicos — Analista TI', title: 'Suporte técnico, atendimento a usuários, treinamento e documentação técnica', overlap: 'exclusivo-analista', priority: 'baixa' },
];

export const ESSAY_PROMPTS = [
  { id: 'anl-1', cargo: 'Analista TI', title: 'LGPD, LAI e ISO 27001/27002 na Câmara Municipal', desc: 'Discorra sobre a conciliação entre transparência ativa (LAI nº 12.527/2011) e proteção de dados pessoais (LGPD nº 13.709/2018) na Câmara Municipal de Cuiabá, citando controles da ISO/IEC 27001 e 27002.' },
  { id: 'anl-2', cargo: 'Analista TI', title: 'Contratação de TI pela Lei nº 14.133/2021 e PDTI', desc: 'Analise a importância do PDTI e do Estudo Técnico Preliminar na contratação de soluções de TI sob a Lei nº 14.133/2021, abordando matriz de riscos e gestão contratual.' },
  { id: 'tec-1', cargo: 'Técnico Legislativo', title: 'Atos Administrativos e Princípios Constitucionais (art. 37 CF)', desc: 'Explique os princípios LIMPE da Administração Pública e diferencie os requisitos de validade dos atos administrativos, bem como anulação e revogação.' },
  { id: 'tec-2', cargo: 'Técnico Legislativo', title: 'Processo Legislativo Municipal, Comissões e Redação Oficial', desc: 'Discorra sobre o papel das Comissões Permanentes e do Plenário na tramitação de proposições municipais e a importância da redação oficial e da arquivologia.' },
];
