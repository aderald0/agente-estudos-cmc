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
  { id: 'lp-1', subject: 'Língua Portuguesa', title: '1-2. Leitura, interpretação e gêneros textuais', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-2', subject: 'Língua Portuguesa', title: '3. Variedades linguísticas e registros formal/informal', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-3', subject: 'Língua Portuguesa', title: '4.1-4.2. Fonética, ortografia e morfologia (classes, verbos, pronomes)', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-4', subject: 'Língua Portuguesa', title: '4.3. Sintaxe: concordância, regência e colocação pronominal', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'lp-5', subject: 'Língua Portuguesa', title: '4.4. Semântica: polissemia, paronímia, homonímia, denotação/conotação', overlap: 'ambos-identico', priority: 'media' },
  { id: 'lp-6', subject: 'Língua Portuguesa', title: '5-7. Coesão, coerência, argumentação, pontuação e discurso', overlap: 'ambos-identico', priority: 'alta' },

  { id: 'rlm-1', subject: 'Raciocínio Lógico e Matemático', title: '1-2. Conjuntos, números reais e raciocínio sequencial', overlap: 'ambos-identico', priority: 'media' },
  { id: 'rlm-2', subject: 'Raciocínio Lógico e Matemático', title: '3-4. Proposições, conectivos, negação, tabela-verdade e diagramas', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'rlm-3', subject: 'Raciocínio Lógico e Matemático', title: '5-6. Equivalências, implicações e quantificadores', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'rlm-4', subject: 'Raciocínio Lógico e Matemático', title: '7a. Contagem: princípio aditivo e multiplicativo', overlap: 'ambos-identico', priority: 'media' },
  { id: 'rlm-5', subject: 'Raciocínio Lógico e Matemático', title: '7b-8. Arranjos, combinações, permutações e Probabilidade', overlap: 'exclusivo-analista', priority: 'media' },

  { id: 'inf-1', subject: 'Noções de Informática', title: '1-2. Hardware/software, Windows 10/11 e Linux', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'inf-2', subject: 'Noções de Informática', title: '3. Office/365 e LibreOffice 7+ (atalhos e funções)', overlap: 'ambos-identico', priority: 'alta' },
  { id: 'inf-3', subject: 'Noções de Informática', title: '4-5. Redes, TCP/IP, navegadores, nuvem e colaboração', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'inf-4', subject: 'Noções de Informática', title: '6-7. Segurança da informação básica e Noções de LGPD', overlap: 'ambos-identico', priority: 'media' },

  { id: 'hg-1', subject: 'História e Geografia de MT', title: 'História Colonial de MT: bandeirantes, Cuiabá (1719) e Vila Bela', overlap: 'ambos-identico', priority: 'media' },
  { id: 'hg-2', subject: 'História e Geografia de MT', title: 'História Imperial de MT: A Rusga, quilombos e Guerra do Paraguai', overlap: 'ambos-identico', priority: 'media' },
  { id: 'hg-3', subject: 'História e Geografia de MT', title: 'História Republicana de MT: coronelismo, Era Vargas e atualidades', overlap: 'ambos-identico', priority: 'media' },
  { id: 'hg-4', subject: 'História e Geografia de MT', title: 'Geografia de MT: Centro-Oeste, domínios naturais, fronteira agrícola e economia', overlap: 'ambos-identico', priority: 'media' },

  { id: 'et-1', subject: 'Noções de Ética e Filosofia', title: '1-4. Fundamentos da Filosofia, moral, consciência crítica e cultura', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'et-2', subject: 'Noções de Ética e Filosofia', title: '5-8. Juízos de fato/valor, cidadania, racionalismo ético e liberdade', overlap: 'ambos-identico', priority: 'baixa' },

  { id: 'ri-1', subject: 'Relações Interpessoais', title: '1-4. Relações humanas, comunicação, atendimento e postura profissional', overlap: 'ambos-identico', priority: 'baixa' },
  { id: 'ri-2', subject: 'Relações Interpessoais', title: '5-8. Integração, empatia, escuta e argumentação flexível', overlap: 'ambos-identico', priority: 'baixa' },

  { id: 'leg-1', subject: 'Legislação Municipal', title: '1a. Lei Orgânica de Cuiabá: Competências, Câmara e Vereadores', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-2', subject: 'Legislação Municipal', title: '1b. Lei Orgânica de Cuiabá: Processo Legislativo, Executivo e Orçamento', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-3', subject: 'Legislação Municipal', title: '2a. Regimento Interno CMC (Res. 08/2016): Mesa Diretora, Plenário e Comissões', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-4', subject: 'Legislação Municipal', title: '2b. Regimento Interno CMC: Sessões, Proposições, Quóruns e Prazos', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-5', subject: 'Legislação Municipal', title: '3. LC nº 93/2003 (Estatuto dos Servidores): Provimento, direitos, licenças e PAD', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'leg-6', subject: 'Legislação Municipal', title: '4. LC nº 235/2011 + LC nº 609/2026 (Plano de Cargos e Carreiras CMC)', overlap: 'ponte-peso', priority: 'alta' },

  { id: 'adm-1', subject: 'Noções de Administração Pública', title: '1-3. Estado, Governo, Adm. Direta/Indireta e Agentes Públicos', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'adm-2', subject: 'Noções de Administração Pública', title: '4-5. Poderes administrativos e Atos administrativos (requisitos, atributos, invalidação)', overlap: 'ponte-peso', priority: 'alta' },
  { id: 'adm-3', subject: 'Noções de Administração Pública', title: '6-7. Controle da Administração (adm/jud/leg) e Responsabilidade Civil', overlap: 'ponte-peso', priority: 'alta' },

  { id: 'tec-1', subject: 'Conhecimentos Específicos — Técnico', title: '5. Dir. Constitucional: Direitos fundamentais, sociais e Adm. Pública (CF 37–41)', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-2', subject: 'Conhecimentos Específicos — Técnico', title: '6-7. Poder Legislativo Municipal, Processo Legislativo e Técnica Legislativa', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-3', subject: 'Conhecimentos Específicos — Técnico', title: '8/13. Redação Oficial: ofícios, memorandos, requerimentos, atas e sinopses', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-4', subject: 'Conhecimentos Específicos — Técnico', title: '9. Arquivologia: protocolo, classificação, guarda, conservação e arquivamento', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-5', subject: 'Conhecimentos Específicos — Técnico', title: '11. Contabilidade Pública: receita, despesa e orçamento público', overlap: 'exclusivo-tecnico', priority: 'alta' },
  { id: 'tec-6', subject: 'Conhecimentos Específicos — Técnico', title: '10/12. Atendimento, Higiene/Segurança do Trabalho e Fotografia Institucional', overlap: 'exclusivo-tecnico', priority: 'media' },

  { id: 'ti-1', subject: 'Conhecimentos Específicos — Analista TI', title: '1. Arquitetura de computadores (Von Neumann/Harvard) e SI', overlap: 'exclusivo-analista', priority: 'media' },
  { id: 'ti-2', subject: 'Conhecimentos Específicos — Analista TI', title: '2. Lógica de programação, algoritmos, estruturas de dados e POO', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-3', subject: 'Conhecimentos Específicos — Analista TI', title: '3a. Engenharia de software: requisitos, UML, testes e metodologias ágeis', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-4', subject: 'Conhecimentos Específicos — Analista TI', title: '3b. Desenvolvimento web e APIs: HTML, CSS, JS, web services e REST', overlap: 'exclusivo-analista', priority: 'media' },
  { id: 'ti-5', subject: 'Conhecimentos Específicos — Analista TI', title: '4. Banco de dados: modelagem relacional, SQL, integridade, backup e recuperação', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-6', subject: 'Conhecimentos Específicos — Analista TI', title: '5. Redes: OSI, TCP/IP, protocolos, IP, equipamentos e cabeamento estruturado', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-7', subject: 'Conhecimentos Específicos — Analista TI', title: '6. Windows e Linux: instalação, admin, usuários, permissões, serviços e backup', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-8', subject: 'Conhecimentos Específicos — Analista TI', title: '7. Segurança da informação: IAM, criptografia, firewall, pentest e ISO 27001/27002', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-9', subject: 'Conhecimentos Específicos — Analista TI', title: '8. Governança de TI: PDTI, ITIL/serviços, projetos, riscos e indicadores', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-10', subject: 'Conhecimentos Específicos — Analista TI', title: '9-10. Git, CI/CD, conteinerização, Análise de Dados e BI', overlap: 'exclusivo-analista', priority: 'media' },
  { id: 'ti-11', subject: 'Conhecimentos Específicos — Analista TI', title: '11. Contratação e gestão de soluções de TI na Adm. Pública (Lei 14.133/2021)', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-12', subject: 'Conhecimentos Específicos — Analista TI', title: '12. LGPD (13.709/2018), LAI (12.527/2011) e segurança de dados públicos', overlap: 'exclusivo-analista', priority: 'alta' },
  { id: 'ti-13', subject: 'Conhecimentos Específicos — Analista TI', title: '13. Suporte técnico, atendimento a usuários, treinamento e documentação', overlap: 'exclusivo-analista', priority: 'baixa' },
];

export const ESSAY_PROMPTS = [
  { id: 'anl-1', cargo: 'Analista TI', title: 'LGPD, LAI e ISO 27001/27002 na Câmara Municipal', desc: 'Discorra sobre a conciliação entre transparência ativa (LAI nº 12.527/2011) e proteção de dados pessoais (LGPD nº 13.709/2018) na Câmara Municipal de Cuiabá, citando controles da ISO/IEC 27001 e 27002.' },
  { id: 'anl-2', cargo: 'Analista TI', title: 'Contratação de TI pela Lei nº 14.133/2021 e PDTI', desc: 'Analise a importância do PDTI e do Estudo Técnico Preliminar na contratação de soluções de TI sob a Lei nº 14.133/2021, abordando matriz de riscos e gestão contratual.' },
  { id: 'tec-1', cargo: 'Técnico Legislativo', title: 'Atos Administrativos e Princípios Constitucionais (art. 37 CF)', desc: 'Explique os princípios LIMPE da Administração Pública e diferencie os requisitos de validade dos atos administrativos, bem como anulação e revogação.' },
  { id: 'tec-2', cargo: 'Técnico Legislativo', title: 'Processo Legislativo Municipal, Comissões e Redação Oficial', desc: 'Discorra sobre o papel das Comissões Permanentes e do Plenário na tramitação de proposições municipais e a importância da redação oficial e da arquivologia.' },
];
