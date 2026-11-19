export interface PracticeOption {
  letter: string;
  text: string;
}

export interface PracticeQuestionSeed {
  id: string;
  subject: string;
  qnum: number;
  stem: string;
  options: PracticeOption[];
  answer: string;
}

export const PRACTICE_QUESTIONS_SEED: PracticeQuestionSeed[] = [
  {
    "id": "lp-q1",
    "subject": "Língua Portuguesa",
    "qnum": 1,
    "stem": "SELECON - 2025 Leia o texto a seguir: Urticária: condição provoca irritação na pele e muita coceira A urticária é uma irritação na pele caracterizada por lesões avermelhadas e levemente inchadas, que causam intensa coceira. Essa condição está entre as queixas mais comuns em consultórios de dermatologia. As lesões podem aparecer em qualquer região do corpo, podendo ser pequenas e isoladas, ou ainda se agrupar e formar grandes placas avermelhadas. Geralmente, essas lesões ocorrem em surtos, duram por algumas horas e depois desaparecem sem deixar marcas na pele. No entanto, a urticária pode reaparecer se a pessoa entrar em contato novamente com a substância que desencadeou a crise. Portanto, é fundamental buscar acompanhamento médico para investigar as possíveis causas da urticária. Estima-se que essa condição afete entre 15% e 20% da população pelo menos uma vez na vida. O sintoma mais prevalente é a coceira intensa, embora as lesões possam também desencadear sensações de ardor ou queimação. É possível ocorrer um inchaço rápido, intenso e localizado, frequentemente afetando áreas como pálpebras, lábios, língua e garganta. Esse tipo de inchaço é denominado angioedema e, em algumas circunstâncias, devido ao seu impacto na respiração, pode representar um risco à vida. Adicionalmente, existe uma complicação conhecida como anafilaxia, que afeta todo o corpo, gerando sintomas como náuseas, vômitos, queda na pressão arterial e inchaço na garganta. Esses são casos graves que demandam assistência médica de urgência. Com base no texto, há uma relação de causa e consequência na ideia de que:",
    "options": [
      {
        "letter": "A",
        "text": "o inchaço localizado (angioedema) pode afetar áreas vitais da respiração, o que, em algumas situações, gera risco à vida; em casos mais graves, a reação sistêmica evolui para anafilaxia"
      },
      {
        "letter": "B",
        "text": "o contato com substâncias desencadeantes causa coceira intensa, que inevitavelmente leva ao angioedema, resultando em anafilaxia"
      },
      {
        "letter": "C",
        "text": "a anafilaxia ocorre antes do angioedema, sendo o inchaço localizado apenas uma consequência da queda de pressão arterial"
      },
      {
        "letter": "D",
        "text": "a urticária causa diretamente anafilaxia em todos os casos, e o angioedema é apenas um efeito secundário irrelevante"
      }
    ],
    "answer": "A"
  },
  {
    "id": "lp-q2",
    "subject": "Língua Portuguesa",
    "qnum": 2,
    "stem": "SELECON - 2025 Apaixonados por morcegos: conhecer é importante para conviver em harmonia Pequenos mamíferos voadores são peças-chave para o equilíbrio ambiental Você teria coragem de pegar um morcego com as próprias mãos? A resposta mais comum é um “não” decidido. Esses pequenos mamíferos alados carregam um pesado fardo cultural, pois são ligados a mitos, histórias de terror e doenças. Mas a realidade é bem diferente: sem eles, nossas florestas seriam mais frágeis, as plantações mais vulneráveis e até o preço do chocolate poderia disparar. Isso porque os morcegos são peças-chave para o equilíbrio ambiental, atuando em diferentes frentes dentro dos ecossistemas. Os morcegos frugívoros, por exemplo, são responsáveis por espalhar sementes e ajudar na recuperação de áreas degradadas, por isso são conhecidos como os “jardineiros da noite”. Já as espécies nectarívoras são aliadas na polinização de flores que desabrocham apenas à noite, como as agaves, usadas na produção da tequila. Há ainda os morcegos insetívoros, verdadeiros controladores naturais de pragas. Um único indivíduo pode devorar milhares de insetos em poucas horas, incluindo mosquitos transmissores de doenças como a dengue. “Eles são grandes aliados das lavouras e da saúde pública”, explica a bióloga e pesquisadora Elizabete Captivo Lourenço, da Universidade do Estado do Rio de Janeiro (Uerj) , bolsista do programa Pós-Doutorado Sênior da FAPERJ. Segundo ela, ao reduzir populações de insetos, os morcegos ajudam também a diminuir o uso de pesticidas, protegendo o ambiente e as pessoas. Elizabete destaca ainda outro papel importante desses animais: o de bioindicadores. “Por serem extremamente sensíveis a mudanças ambientais, a presença ou ausência de certas espécies de morcegos é um reflexo direto da saúde dos ecossistemas”, explica. Foi durante a graduação em Ciências Biológicas, na Universidade Federal Rural do Rio de Janeiro (UFRRJ) , que ela teve o primeiro contato com esses animais. “Bastou um único morcego para eu me apaixonar. Desde então, venho descobrindo o quanto esse grupo é fascinante e essencial para o planeta.” “Eles são grandes aliados das lavouras e da saúde pública” (3º parágrafo) . No texto, o pronome em destaque faz referência aos:",
    "options": [
      {
        "letter": "A",
        "text": "insetos"
      },
      {
        "letter": "B",
        "text": "pesquisadores"
      },
      {
        "letter": "C",
        "text": "morcegos frugíveros"
      },
      {
        "letter": "D",
        "text": "morcegos insetívoros"
      }
    ],
    "answer": "D"
  },
  {
    "id": "lp-q3",
    "subject": "Língua Portuguesa",
    "qnum": 3,
    "stem": "SELECON - 2025 Leia o texto a seguir: SES distribui 500 mil doses e incentiva campanha de multivacinação de crianças e adolescentes de até 15 anos A Secretaria de Estado de Saúde (SES) distribuiu 500 mil doses de vacina para que os 142 municípios do Estado realizem ações da Campanha Nacional de Multivacinação, entre os dias 6 e 31 de outubro. A iniciativa do Ministério da Saúde, em parceria com Estados e prefeituras, é voltada para o público de até 15 anos de idade. O Dia D de mobilização está marcado para 18 de outubro (sábado) , quando os postos de saúde ficarão abertos em todo o país para atender a população. “É muito importante que todos, em especial crianças e adolescentes, mantenham a caderneta atualizada. Todas as doses previstas no Calendário Nacional de Vacinação estarão à disposição da população de Mato Grosso. O Dia D, que vai ocorrer em um sábado, será mais uma oportunidade para que os pais e responsáveis possam proteger as nossas crianças”, destacou o secretário de Estado de Saúde, Gilberto Figueiredo. Segundo a superintendente de Vigilância em Saúde da SES, Alessandra Moraes, os não vacinados contra o HPV (papilomavírus humano) , febre amarela e sarampo estão entre as prioridades da campanha. “Precisamos reforçar a prevenção contra o sarampo em todo o Estado, principalmente pela proximidade com a Bolívia, onde houve um surto de casos. Por isso, essa vacina será oferecida também aos adultos até 59 anos. É muito importante que nós atinjamos alta cobertura vacinal para prevenir a reintrodução da doença no Brasil”, esclareceu Alessandra. Até 1º de outubro de 2025, o Brasil confirmou 31 casos importados, quando a infecção ocorre fora do país. Em Mato Grosso, foram registrados três casos no município de Primavera do Leste. Durante a campanha, estarão disponíveis vacinas contra BCG, rotavírus, pneumocócica-10 valente, meningocócica C, meningocócica ACWY, pentavalente, poliomielite, febre amarela, tríplice viral, varicela, hepatite A, hepatite B, dupla adulto, HPV e dTpa. De acordo com o coordenador estadual de Imunização, Marx Camarão, a SES tem mantido um diálogo constante com os municípios para garantir que a vacinação seja ampliada de forma eficaz durante toda a campanha. “Trabalhamos juntos para otimizar a distribuição de doses e mobilizar as equipes de saúde, assegurando que todos os cidadãos tenham acesso a essa importante medida de proteção. O objetivo é alcançar o maior número de pessoas possível, priorizando as áreas com maior vulnerabilidade e garantindo a continuidade das ações de imunização”, afirmou o coordenador. Com cobertura vacinal de 98,9%, a dose contra BCG é a única no Estado que está acima da ideal, de 90%. As vacinas contra rotavírus e HPV têm a mesma meta, mas estão, respectivamente, com cobertura de 84,13% e de 85,54% em meninas e de 72,23% em meninos. As outras vacinas têm cobertura ideal de 95%, mas, conforme atualização do painel nesta terça-feira (7.10) , estão abaixo do desejado: pneumocócica-10: 87%; meningo C: 83,8%; poliomielite: 81,1%; febre amarela: 72,4%; pentavalente: 81,7%; tríplice viral: 89,9%; varicela: 67,8%; e hepatite A: 77,9%. “É muito importante que todos, em especial crianças e adolescentes, mantenham a caderneta atualizada” (3º parágrafo) . A expressão em destaque cumpre a função de:",
    "options": [
      {
        "letter": "A",
        "text": "atenuar a obrigação expressa pela frase"
      },
      {
        "letter": "B",
        "text": "expressar dúvida sobre a eficácia das vacinas"
      },
      {
        "letter": "C",
        "text": "apresentar um fato comprovado cientificamente"
      },
      {
        "letter": "D",
        "text": "introduzir uma recomendação com valor de apelo"
      }
    ],
    "answer": "D"
  },
  {
    "id": "lp-q4",
    "subject": "Língua Portuguesa",
    "qnum": 4,
    "stem": "SELECON - 2025 Leia o texto a seguir: Rússia anuncia vacina contra o câncer, e prevê distribuição gratuita em 2025 Avanço tecnológico inclui mRNA e vírus oncolíticos desenvolvidos por centros de pesquisa russos A Rússia anunciou o desenvolvimento de uma vacina mRNA contra o câncer, que será disponibilizada gratuitamente aos pacientes no país. Segundo o diretor-geral do Centro Nacional de Pesquisa Radiológica do Ministério da Saúde da Rússia, Andrey Kaprin, o lançamento para uso geral está previsto para o início de 2025. A informação foi divulgada pela agência estatal TASS nesta semana. O desenvolvimento é resultado de esforços conjuntos entre centros de pesquisa, incluindo o Centro Nacional de Pesquisa em Epidemiologia e Microbiologia Gamaleya. De acordo com Alexander Gintsburg, diretor do Gamaleya, os testes pré-clínicos da vacina já demonstraram eficácia na supressão do desenvolvimento de tumores e no potencial controle de metástases. A abordagem mRNA utiliza a análise genética individual para criar vacinas personalizadas que programam o sistema imunológico a identificar e destruir células cancerígenas. Esse método analisa o perfil mutacional do tumor (neoantígenos) e projeta vacinas direcionadas, permitindo um combate específico a cada tipo de tumor. Além disso, o país estuda uma frente de vacinas oncolítica chamada de EnteroMix, desenvolvida em colaboração com o Instituto Engelhardt. Ela utiliza um conjunto de quatro vírus não patogênicos capazes de destruir células malignas e, ao mesmo tempo, ativar a imunidade antitumoral do paciente. De acordo com o Centro Nacional de Pesquisa Radiológica, os estudos pré-clínicos do EnteroMix já foram concluídos, confirmando sua segurança e eficácia. Os cientistas russos informam que os testes clínicos e o recrutamento de pacientes para as fases iniciais do EnteroMix começarão entre o final de 2024 e o início de 2025. Enquanto isso, a vacina mRNA avança para os testes finais de eficácia e deve ser liberada ao público em 2025. Considerando as suas características discursivas, a linguagem empregada e o suporte onde foi publicado, infere-se que o texto anterior foi produzido tendo em vista um determinado público, que são os:",
    "options": [
      {
        "letter": "A",
        "text": "professores de Biologia"
      },
      {
        "letter": "B",
        "text": "leitores de um modo geral interessados em Ciência"
      },
      {
        "letter": "C",
        "text": "pesquisadores brasileiros que trabalham com vacinas"
      },
      {
        "letter": "D",
        "text": "cientistas, especialmente da especialidade da Oncologia"
      }
    ],
    "answer": "B"
  },
  {
    "id": "lp-q5",
    "subject": "Língua Portuguesa",
    "qnum": 5,
    "stem": "SELECON - 2025 TEXTO II porto alegre, 2016 quando você viu na tv aquelas pessoas em fila na chuva à noite numa estrada na fronteira de um país que não as deseja e quando você viu as bombas caírem sobre cidades distantes com aquelas casas e ruas tão sujas e tão diferentes e quando você viu a polícia na praça do país estrangeiro partir pra cima de manifestantes com bombas de gás lacrimogêneo não pensou duas vezes nem trocou o canal e foi pegar comida na geladeira não reparou o que vinha que era só uma questão de tempo não interpretou como sinal a notícia não precisou estocar mantimentos agora a colher cai da boca e o barulho de bomba é ali fora e a polícia pra cima dos teus afetos munida de espadas, sobre cavalos Em relação ao conjunto de estrofes anteriores, o verso “agora a colher cai da boca” (v. 21) marca uma quebra de expectativa e provoca o seguinte efeito de sentido:",
    "options": [
      {
        "letter": "A",
        "text": "comparação entre a passividade do eu lírico e a aflição do interlocutor"
      },
      {
        "letter": "B",
        "text": "concordância entre as atitudes otimistas e os pensamentos negativos"
      },
      {
        "letter": "C",
        "text": "contraste entre a indiferença no passado e o espanto no presente"
      },
      {
        "letter": "D",
        "text": "contradição entre os desejos cultivados e a frustração enfrentada"
      }
    ],
    "answer": "C"
  },
  {
    "id": "lp-q6",
    "subject": "Língua Portuguesa",
    "qnum": 6,
    "stem": "SELECON - 2025 TEXTO I Por uma cultura de paz Uma das coisas mais bonitas de ver é a atuação pacífica de mães e de pais com seus filhos, educando-os no diálogo, na alteridade, no cuidado e no respeito aos outros. Nosso dia se ilumina ao ver um adulto se portando como adulto, sendo capaz de transmitir à geração mais nova o melhor que tem em si. Uma das coisas mais constrangedoras de ver é a atuação descontrolada de mães e de pais com seus filhos, falando em tom agressivo, agindo com brusquidão, tentando impor seu poder pela força, com palavras ou atos físicos. Entristece-nos contemplar o ciclo de agressividade se reproduzindo, com consequências que vão muito além do que os nossos olhos podem ver naquele momento. Essas duas situações me vêm ao pensar no cenário de agressividade que tem dominado a vida pública nacional. O ciclo de violência que permeia e estrutura nossa sociedade não é um dado da natureza. É uma realidade histórica renovada diariamente. Há um passado a influenciar, mas há também uma escolha feita no tempo presente: pais violentos, professores violentos, estudantes violentos, cidadãos violentos, policiais violentos, candidatos violentos, eleitores violentos, maridos violentos, motoristas violentos. Como nossa sensibilidade reage a essas situações? O problema não é só aqui. Conheci recentemente um casal de professores universitários americanos que se mudaram para Glasgow, na Escócia, depois que o Estado do Arkansas aprovou uma lei permitindo que estudantes portassem armas ocultas no campus. Não se sentiam seguros de dar aulas sob as novas condições. O incrível é que parcela da sociedade brasileira olha para os Estados Unidos e deseja emular a mesma loucura armamentista. É uma escolha. A cultura da violência é o oposto da cultura democrática, que é respeito, diálogo, negociação, cooperação. É evidente, diante disso, a necessidade de promover uma cultura de paz, uma cultura verdadeiramente democrática. Não é tarefa fácil, nem simples. Mas talvez o primeiro passo seja reconhecer o problema. Não somos um país pacífico. A sociedade brasileira tem historicamente tolerado – e continua tolerando – altos índices de violência. E, pior, quando nos indignamos com a violência das nossas cidades, a resposta tem sido uma só: mais violência. Almejam-se o aumento da pena e o endurecimento das condições de cumprimento da pena. Ou seja, ainda preferimos lidar com uma questão difícil e complexa por meio de uma resposta fácil e simplista. Se queremos uma sociedade mais pacífica, em vez de pedir penas mais altas – como se todos os problemas fossem causados pelos outros –, temos de entender as causas da cultura de violência e da cultura de paz. Há exemplos interessantes. Considerada nos anos 1970 e 1980 como uma cidade difícil e violenta, Glasgow conseguiu transformar sua realidade social por meio de políticas públicas de apoio à educação e à arte e de fortalecimento dos laços comunitários. A paz, assim como a democracia, não vem por decreto. É uma construção diária, que começa em casa, mas passa também, entre outros âmbitos, pelas eleições e por políticas públicas efetivas. Que nossa indignação com a criminalidade e a insegurança não desemboque em descontrole irracional, mas desperte uma resposta adulta – articulada e responsável – para o problema. Nos períodos “Mas talvez o primeiro passo seja reconhecer o problema. Não somos um país pacífico.” (5º parágrafo) , o enunciador emprega formas distintas de um mesmo verbo. Essa diferença evidencia, respectivamente, uma oposição entre:",
    "options": [
      {
        "letter": "A",
        "text": "imposição e apelo"
      },
      {
        "letter": "B",
        "text": "desejo e frustração"
      },
      {
        "letter": "C",
        "text": "rejeição e aceitação"
      },
      {
        "letter": "D",
        "text": "possibilidade e certeza"
      }
    ],
    "answer": "D"
  },
  {
    "id": "lp-q7",
    "subject": "Língua Portuguesa",
    "qnum": 7,
    "stem": "SELECON - 2025 Leia o texto a seguir: Internet virou “campo minado” para crianças e jovens, diz especialista Por Luiz Claudio Ferreira - As crianças já vulnerabilizadas socialmente estão mais suscetíveis a riscos no ambiente digital depois de decisão da empresa Meta de redução das normas de moderação das plataformas. A avaliação é do pesquisador Pedro Hartung, diretor de Políticas e Direitos das Crianças do Instituto Alana. “A internet aumenta as vulnerabilidades que já existem no ambiente offline”, explicou em entrevista à Agência Brasil. Ele identifica que a internet se transformou em um “campo minado” para crianças e adolescentes. E reitera que, quando as plataformas não são pensadas para sobrepor ou superar essas violências, acabam reforçando e ampliando as desigualdades. “Crianças negras, periféricas e meninas estão muito mais sujeitas a essas violências no mundo digital não só pela reprodução dessa violência social, mas pelo aumento dessa violência”, afirmou Pedro Hartung. O pesquisador lamenta a falta de participação das grandes empresas em debates, como o que ocorreu nesta semana, em uma audiência pública na Advocacia-Geral da União (AGU) com pesquisadores e representantes da sociedade civil para elencar argumentos sobre o tema. Ele sublinha que o ano de 2025 marca os 35 anos do Estatuto da Criança e do Adolescente (ECA) e o país se vê em desafi os para enfrentar o que ele chama de “colonialismo digital”. E alerta para o fato de que o afrouxamento da moderação das redes Instagram e Facebook, da Meta, por exemplo, eleva a chance de crimes nas redes. “A gente não está falando somente de dimensões ligadas a uma manifestação de uma opinião”. Como saída, ele identifica a necessidade de o Estado aplicar a lei e também da implantação de uma política de educação digital. Confira abaixo os principais trechos da entrevista. Nesta semana, houve uma audiência pública com a participação de pesquisadores e representantes de diferentes áreas da sociedade civil. O governo está recolhendo subsídios e argumentos nesse embate com as plataformas digitais. Mas os representantes das empresas não foram. O que você pensa sobre isso? Lamentavelmente, as empresas e as plataformas digitais que operam no Brasil não estiveram na audiência. Escolheram não estar e contribuir para o debate com a perspectiva delas, com as informações que elas têm, para a gente criar um espaço de busca de soluções. Sem dúvida alguma, como está agora, não podemos admitir. O Congresso Nacional já vem trabalhando há alguns anos, na verdade, em projetos de lei para clarifi car e detalhar a proteção e a segurança de todos nós, inclusive de crianças no ambiente digital. O STF, recentemente, estava julgando o marco legal da internet, especialmente a constitucionalidade do artigo 19 [que aponta que a empresa somente poderá ser responsabilizada por danos se, após ordem judicial específi ca, não tomar providências]. Agora chegou a vez do Executivo assumir a sua responsabilidade de monitorar e fiscalizar o cumprimento da legislação que já existe e que garante, no caso de crianças e adolescentes, prioridade absoluta na proteção dos seus direitos. Antes da decisão da Meta de alterar a moderação de conteúdo, as crianças já estavam vulnerabilizadas, certo? Esse problema de moderação de conteúdo é uma falha da indústria como um todo, de todas as plataformas, de maior ou menor grau. É um verdadeiro campo minado para crianças e adolescentes, de exposição a conteúdos indevidos e muitas vezes ilegais e criminosos. A internet pode ser mais perigosa para crianças e adolescentes? O que era ruim vai ficar ainda pior. Porque a Meta, por mais que ela tenha respondido que essas mudanças não chegaram ainda ao Brasil, sem dúvida alguma é uma mensagem do setor e é um posicionamento ideológico dessas empresas do entendimento de que o espaço da internet não teria lei. É uma mensagem muito ruim para todo o setor e, na verdade, para todos nós como sociedade. Quais são os principais riscos que nossas crianças e adolescentes estão submetidos? Infelizmente, a internet que hoje a gente utiliza não foi a pensada pelos criadores da rede. Essa internet de hoje representa o verdadeiro campo minado para crianças e adolescentes no mundo, especialmente no Brasil, onde regras protetivas são menos aplicadas pelas mesmas empresas. O que já era ruim vai fi car muito pior. Vai fi car muito semelhante ao Discord, onde não tem uma moderação ativa de conteúdo e abre possibilidades para uma distribuição de informação que pode ser muito prejudicial para a saúde e integridade de crianças e adolescentes. Nós estamos falando aqui, por exemplo, de um crescimento de imagens advindas de violência contra a criança, que podem ser utilizadas, inclusive, para ameaçar crianças e adolescentes. Um crescimento, por exemplo, de cyberbullying, e também a exposição não autorizada da imagem em informações pessoais de crianças e adolescentes, ou conteúdos que ou representam ou são mesmo tratamento cruel e degradante, discurso de ódio, incitação e apologia a crimes. Então não estamos falando de liberdade de expressão? Aqui a gente não está falando somente de dimensões ligadas a uma manifestação de uma opinião. A gente está falando aqui de crime muito severo que crianças e adolescentes estão submetidos por uma internet não regulada. Já vi casos de plataformas sem moderação ativa de conteúdo em que cenas advindas de violência pessoal, que a gente chamaria de pornografia infantil e de violência, circulando livremente. A plataforma sem moderação de conteúdo gera muito mais riscos para a violência contra a criança e o adolescente. E os nossos filhos e filhas, netos, sobrinhos, sobrinhas, vão estar muito mais sujeitos a esses perigos e violências. “Crianças negras, periféricas e meninas estão muito mais sujeitas a essas violências no mundo digital não só pela reprodução dessa violência social, mas pelo aumento dessa violência” (4º parágrafo) . Os conectivos em destaque veiculam sentido de:",
    "options": [
      {
        "letter": "A",
        "text": "modo"
      },
      {
        "letter": "B",
        "text": "adição"
      },
      {
        "letter": "C",
        "text": "condição"
      },
      {
        "letter": "D",
        "text": "comparação"
      },
      {
        "letter": "E",
        "text": "consequência"
      }
    ],
    "answer": "B"
  },
  {
    "id": "lp-q8",
    "subject": "Língua Portuguesa",
    "qnum": 8,
    "stem": "SELECON - 2024 Leia o texto a seguir: Total de mulheres responsáveis por domicílios cresce, revela Censo Os homens são maioria (50,9%) entre as pessoas responsáveis pelas unidades domésticas no Brasil, com um total de 37 milhões, mas a quantidade de mulheres, no entanto, está bem próxima (49,1%) e somou 36 milhões. Como mostrou a pesquisa Censo Demográfico 2022: Composição domiciliar e óbitos informados, os dados indicam uma mudança importante em relação a 2010, quando o percentual de homens responsáveis (61,3%) era significativamente maior que o de mulheres (38,7%) . Ainda segundo a pesquisa - divulgada no Rio de Janeiro nesta sexta-feira (25) pelo Instituto Brasileiro de Geografia e Estatística (IBGE) - o percentual de mulheres nesta condição supera os 50% em 10 estados. Em Pernambuco, ficou em 53,9%, seguido de Sergipe 53,1%, Maranhão 53,0%, Amapá 52,9%, Ceará 52,6%, Rio de Janeiro 52,3%, Alagoas e Paraíba 51,7%, Bahia 51,0% e Piauí 50,4%. Segundo o Censo 2022, havia cerca de 72 milhões 522 mil 372 unidades domésticas no Brasil. O número é 15 milhões a mais do que o anotado em 2010, quando existiam 57 milhões. A quantidade média de moradores ficou em 2,8 pessoas. Esse resultado é menor do que em 2000 (3,7 pessoas) e em 2010 (3,3) . Entre as unidades domésticas, cerca de 72,3% têm até três moradores e 28,7% têm dois residentes. Em “Os homens são maioria (50,9%) entre as pessoas responsáveis pelas unidades domésticas no Brasil, com um total de 37 milhões, mas a quantidade de mulheres, no entanto, está bem próxima (49,1%) e somou 36 milhões” (1º parágrafo) , os elementos destacados, respectivamente, expressam valor semântico de:",
    "options": [
      {
        "letter": "A",
        "text": "adição e adição"
      },
      {
        "letter": "B",
        "text": "oposição e adição"
      },
      {
        "letter": "C",
        "text": "adição e oposição"
      },
      {
        "letter": "D",
        "text": "oposição e oposição"
      }
    ],
    "answer": "D"
  },
  {
    "id": "lp-q9",
    "subject": "Língua Portuguesa",
    "qnum": 9,
    "stem": "SELECON - 2023 Leia o texto a seguir: Cafezinho Rubem Braga Leio a reclamação de um repórter irritado que precisava falar com um delegado e lhe disseram que o homem havia ido tomar um cafezinho. Ele esperou longamente, e chegou à conclusão de que o funcionário passou o dia inteiro tomando café. Tinha razão o rapaz de ficar zangado. Mas com um pouco de imaginação e bom humor podemos pensar que uma das delícias do gênio carioca é exatamente esta frase: — Ele foi tomar café. A vida é triste e complicada. Diariamente é preciso falar com um número excessivo de pessoas. O remédio é ir tomar um “cafezinho”. Para quem espera nervosamente, esse “cafezinho” é qualquer coisa infinita e torturante. Depois de esperar duas ou três horas, dá vontade de dizer: — Bem, cavalheiro, eu me retiro. Naturalmente o Sr. Bonifácio morreu afogado no cafezinho. Ah, sim, mergulhemos de corpo e alma no cafezinho. Sim, deixemos em todos os lugares este recado simples e vago: — Ele saiu para tomar um café e disse que volta já. Quando a bem-amada vier com seus olhos tristes e perguntar: — Ele está? — Alguém dará o nosso recado sem endereço. Quando vier o amigo e quando vier o credor, e quando vier o parente, e quando vier a tristeza, e quando a morte vier, o recado será o mesmo: — Ele disse que ia tomar um cafezinho… Podemos, ainda, deixar o chapéu. Devemos até comprar um chapéu especialmente para deixá-lo. Assim dirão: — Ele foi tomar um café. Com certeza volta logo. O chapéu dele está aí… Ah! fujamos assim, sem drama, sem tristeza, fujamos assim. A vida é complicada demais. Gastamos muito pensamento, muito sentimento, muita palavra. O melhor é não estar. Quando vier a grande hora de nosso destino, nós teremos saído há uns cinco minutos para tomar um café. Vamos, vamos tomar um cafezinho. Em termos morfológicos, a palavra “cafezinho” foi criada por meio do processo de:",
    "options": [
      {
        "letter": "A",
        "text": "composição por justaposição"
      },
      {
        "letter": "B",
        "text": "composição por aglutinação"
      },
      {
        "letter": "C",
        "text": "derivação prefixal"
      },
      {
        "letter": "D",
        "text": "derivação sufixal"
      }
    ],
    "answer": "D"
  },
  {
    "id": "lp-q10",
    "subject": "Língua Portuguesa",
    "qnum": 10,
    "stem": "SELECON - 2023 Texto 1 Leia o texto a seguir: Não podemos mais acreditar em nada do que vemos? Com inteligência artificial, até especialistas às vezes têm dificuldade para dizer se uma foto é real ou não Ver não é crer há muito tempo. As fotos são falsificadas e manipuladas há quase tanto tempo quanto existe a fotografia. Agora nem mesmo a realidade é necessária para que as fotos pareçam autênticas – apenas inteligência artificial respondendo a um comando. Mesmo os especialistas às vezes têm dificuldade para dizer se uma foto é real ou não. Você consegue? O rápido advento da inteligência artificial disparou alarmes de que a tecnologia usada para enganar as pessoas está avançando muito mais depressa do que a tecnologia que identifica os truques. Empresas de tecnologia, pesquisadores, agências de fotografia e organizações de notícias estão se esforçando para se atualizar, tentando estabelecer padrões de proveniência e propriedade do conteúdo. Os avanços já estão alimentando a desinformação e sendo usados para instigar divisões políticas. Governos autoritários criaram emissoras de notícias aparentemente realistas para promover seus objetivos políticos. No mês passado, algumas pessoas acreditaram em imagens que mostravam o papa Francisco vestindo uma jaqueta acolchoada e um terremoto devastando o noroeste do Pacífico, embora nenhum desses fatos tenha ocorrido. As imagens foram criadas usando o Midjourney, um popular gerador de imagens. Na terça-feira (4) , quando o ex-presidente americano Donald Trump se apresentou no gabinete do promotor distrital de Manhattan em Nova York para enfrentar acusações criminais, imagens geradas por inteligência artificial apareceram no Reddit mostrando o ator Bill Murray como presidente na Casa Branca. Outra imagem mostrando Trump marchando na frente de uma multidão com bandeiras americanas ao fundo foi rapidamente compartilhada novamente no Twitter sem a informação que acompanhava a postagem original, de que na verdade não era uma fotografia. Especialistas temem que a tecnologia possa acelerar a erosão da confiança na mídia, no governo e na sociedade. Se qualquer imagem pode ser fabricada – e manipulada –, como podemos acreditar em alguma coisa que vemos? “As ferramentas vão melhorar, vão ficar mais baratas e chegará o dia em que não poderemos acreditar em nada do que vemos na internet”, disse Wasim Khaled, CEO da Blackbird.AI, empresa que ajuda clientes a combater a desinformação. A inteligência artificial permite que praticamente qualquer pessoa crie obras de arte complexas, como as agora expostas na galeria de arte Gagosian em Nova York, ou imagens realistas que borram a linha entre o que é real e o que é ficção. Insira uma descrição de texto e a tecnologia produzirá uma imagem relacionada, sem necessidade de habilidades especiais. No trecho “Os avanços já estão alimentando a desinformação e sendo usados para instigar divisões políticas” (4º parágrafo) , a palavra destacada é formada por:",
    "options": [
      {
        "letter": "A",
        "text": "parassíntese"
      },
      {
        "letter": "B",
        "text": "derivação sufixal"
      },
      {
        "letter": "C",
        "text": "derivação prefixal"
      },
      {
        "letter": "D",
        "text": "derivação prefixal e sufixal"
      }
    ],
    "answer": "D"
  },
  {
    "id": "lp-q11",
    "subject": "Língua Portuguesa",
    "qnum": 11,
    "stem": "SELECON - 2025 Leia o texto a seguir: Urticária: condição provoca irritação na pele e muita coceira A urticária é uma irritação na pele caracterizada por lesões avermelhadas e levemente inchadas, que causam intensa coceira. Essa condição está entre as queixas mais comuns em consultórios de dermatologia. As lesões podem aparecer em qualquer região do corpo, podendo ser pequenas e isoladas, ou ainda se agrupar e formar grandes placas avermelhadas. Geralmente, essas lesões ocorrem em surtos, duram por algumas horas e depois desaparecem sem deixar marcas na pele. No entanto, a urticária pode reaparecer se a pessoa entrar em contato novamente com a substância que desencadeou a crise. Portanto, é fundamental buscar acompanhamento médico para investigar as possíveis causas da urticária. Estima-se que essa condição afete entre 15% e 20% da população pelo menos uma vez na vida. O sintoma mais prevalente é a coceira intensa, embora as lesões possam também desencadear sensações de ardor ou queimação. É possível ocorrer um inchaço rápido, intenso e localizado, frequentemente afetando áreas como pálpebras, lábios, língua e garganta. Esse tipo de inchaço é denominado angioedema e, em algumas circunstâncias, devido ao seu impacto na respiração, pode representar um risco à vida. Adicionalmente, existe uma complicação conhecida como anafilaxia, que afeta todo o corpo, gerando sintomas como náuseas, vômitos, queda na pressão arterial e inchaço na garganta. Esses são casos graves que demandam assistência médica de urgência. “No entanto, a urticária pode reaparecer se a pessoa entrar em contato novamente com a substância que desencadeou a crise” (2º parágrafo) . Se o verbo em destaque estivesse no futuro do pretérito do indicativo, seria flexionado como:",
    "options": [
      {
        "letter": "A",
        "text": "desencadeara"
      },
      {
        "letter": "B",
        "text": "desencadeará"
      },
      {
        "letter": "C",
        "text": "desencadearia"
      },
      {
        "letter": "D",
        "text": "desencadeava"
      }
    ],
    "answer": "C"
  },
  {
    "id": "lp-q12",
    "subject": "Língua Portuguesa",
    "qnum": 12,
    "stem": "SELECON - 2025 Leia o texto a seguir: ‘Ainda Estou Aqui’ é escolhido melhor filme do ano pela crítica internacional Longa é a primeira produção brasileira a conquistar o prêmio Fipresci O longa-metragem “Ainda Estou Aqui” foi eleito o melhor filme do ano pela crítica internacional e recebeu o prestigiado Grand Prix da Federação Internacional de Críticos de Cinema (FIPRESCI) . Esta é a primeira vez que uma produção brasileira vence o prêmio, concedido por 739 críticos de 75 países. Estrelado por Fernanda Torres, Selton Mello e Fernanda Montenegro, o filme já havia sido coroado com Oscar na categoria Melhor Filme Internacional, o Globo de Ouro de Melhor Atriz e o Leão de Prata de Melhor Roteiro no Festival de Veneza. Inspirado no livro homônimo de Marcelo Rubens Paiva, a produção retrata a história de Eunice Paiva e sua luta após o desaparecimento de seu marido, o ex-deputado Rubens Paiva, durante a ditadura militar. A narrativa sensível conquistou público e crítica, acumulando prêmios em dezenas de festivais e premiações ao redor do mundo. Responsável por dirigir o longa, Walter Salles receberá o troféu em cerimônia de gala na abertura do Festival de San Sebastian, no dia 19 de setembro. “Estrelado por Fernanda Torres, Selton Mello e Fernanda Montenegro, o filme já havia sido coroado com Oscar na categoria Melhor Filme Internacional [...]” (2º parágrafo) . Nesse trecho, os termos destacados são classificados, respectivamente, como:",
    "options": [
      {
        "letter": "A",
        "text": "conjunção e conjunção"
      },
      {
        "letter": "B",
        "text": "preposição e conjunção"
      },
      {
        "letter": "C",
        "text": "conjunção e preposição"
      },
      {
        "letter": "D",
        "text": "preposição e preposição"
      }
    ],
    "answer": "B"
  },
  {
    "id": "lp-q13",
    "subject": "Língua Portuguesa",
    "qnum": 13,
    "stem": "SELECON - 2024 Leia o texto a seguir: ‘Consequências letais’: 2024 deve ser o primeiro ano com aquecimento de +1,5ºC, diz observatório europeu Dados devem servir como ‘alerta’ na COP29, que acontece a partir de 11 de novembro, no Azerbaijão O ano de 2024 será quase certamente o mais quente já registrado e o primeiro com um aumento da temperatura média global superior a 1,5ºC em relação à era pré-industrial, anunciou nesta quinta-feira o observatório europeu Copernicus. “Após dez meses de 2024, agora é quase certo que 2024 será o ano mais quente já registrado e o primeiro ano com mais de 1,5ºC acima dos níveis pré-industriais”, disse nesta quinta-feira Samantha Burgess, diretora adjunta do serviço de mudanças climáticas (C3S) de Copernicus. Os dados deste observatório indicam que é até “provável” que o aquecimento atinja 1,55ºC este ano. “Isso marca uma nova etapa nos recordes de temperaturas globais e deve servir como um alerta para aumentar a ambição na próxima conferência sobre mudança climática, a COP29”, que começa em Baku em 11 de novembro, disse Burgess. Essa cúpula na capital do Azerbaijão se concentrará na difícil tarefa de estabelecer uma nova meta de financiamento que permita aos países em desenvolvimento reduzir suas emissões de gases de efeito estufa e se adaptar às mudanças climáticas. As reuniões ocorrerão sob a sombra do próximo retorno de Donald Trump à Casa Branca, que no passado chamou a mudança climática de “farsa”. Os dados de Copernicus mostram que o mês passado foi o segundo outubro mais quente já registrado, atrás apenas de 2023, com uma temperatura média de 15,25ºC. Isso representa 1,65ºC acima da média entre 1850-1900, quando o uso massivo de energias fósseis ainda não havia aquecido significativamente a atmosfera e os oceanos. É também o 15º mês dos últimos 16 em que a temperatura média global superou esse limite de 1,5ºC. Este número simbólico corresponde ao objetivo mais ambicioso do acordo climático de Paris de 2015, que busca limitar o aquecimento claramente abaixo de 2ºC e continuar os esforços para não ultrapassar 1,5ºC. No entanto, essa meta se refere a tendências climáticas de longo prazo: para considerar que o limite foi ultrapassado, a média das temperaturas globais precisaria ficar acima de 1,5ºC por 20 ou 30 anos. Em “O ano de 2024 será quase certamente o mais quente já registrado e o primeiro com um aumento da temperatura média global superior a 1,5ºC em relação à era pré-industrial, anunciou nesta quinta-feira o observatório europeu Copernicus.” (1º parágrafo) , o verbo está flexionado no:",
    "options": [
      {
        "letter": "A",
        "text": "imperativo afirmativo"
      },
      {
        "letter": "B",
        "text": "pretérito perfeito do indicativo"
      },
      {
        "letter": "C",
        "text": "pretérito imperfeito do indicativo"
      },
      {
        "letter": "D",
        "text": "pretérito imperfeito do subjuntivo"
      },
      {
        "letter": "E",
        "text": "pretérito mais-que-perfeito do indicativo"
      }
    ],
    "answer": "B"
  },
  {
    "id": "lp-q14",
    "subject": "Língua Portuguesa",
    "qnum": 14,
    "stem": "SELECON - 2024 Leia o texto a seguir: Seca extrema derruba produtividade de cana e usinas antecipam colheita Levantamento da empresa Centro de Tecnologia Canavieira (CTC) indicou queda de produtividade por hectare na cana-de-açúcar colhida na região centro-sul do país, com média de 69,7 toneladas por hectare (t/ha) em setembro de 2024, em relação ao mesmo mês de 2023, quando houve média de 83,4 t/ha. Nesta semana, a entidade patronal União da Indústria de Cana-de-açúcar e Biotecnologia (Unica) apontou adiantamento da colheita no estado, com 12 unidades finalizando a moagem até a segunda quinzena de outubro. No mesmo período da safra anterior, quatro usinas haviam concluído a moagem. A empresa, que faz monitoramento para o desenvolvimento de tecnologias no setor, observou ganho discreto na qualidade da matéria-prima por meio da medição de Açúcar Total Recuperável (ATR) na safra, ligeiramente acima em 2024, com 136,71 kg por tonelada de cana colhida. A UNICA observou melhoria mais acelerada entre seus associados, com 160,30 kg de ATR por tonelada de cana-de-açúcar este ano contra 149,84 kg por tonelada na safra 2023/2024 – variação positiva de 6,98%. No acumulado da safra, o indicador foi de 142,23 kg de ATR por tonelada, alta de 1,03% em relação ao mesmo período no ano passado. A Unica informou que operaram na primeira quinzena de outubro 255 unidades produtoras na região centro-sul, sendo 236 unidades com processamento de cana, nove empresas que fabricam etanol a partir do milho e dez usinas flex. No mesmo período, na safra 23/24, operaram 259 unidades produtoras. A associação mostrou ainda que, na primeira quinzena de outubro, as unidades produtoras da região centro-sul processaram 33,83 milhões de toneladas, enquanto na safra anterior haviam processado 32,93 milhões. O aumento foi de 2,75%. No acumulado da safra 2024/2025 até 16 de outubro, a moagem atingiu 538,85 milhões de toneladas, 2,36% a mais do que os 526,43 milhões de toneladas registrados no mesmo período do ciclo anterior. Especialistas consultados pela Agência Brasil atribuíram o aumento a um adiantamento na colheita, medida usada para evitar perdas maiores na produtividade. Em “No mesmo período da safra anterior, quatro usinas haviam concluído a moagem” (1º parágrafo) , o verbo em destaque está flexionado no:",
    "options": [
      {
        "letter": "A",
        "text": "pretérito perfeito do indicativo"
      },
      {
        "letter": "B",
        "text": "pretérito imperfeito do indicativo"
      },
      {
        "letter": "C",
        "text": "pretérito imperfeito do subjuntivo"
      },
      {
        "letter": "D",
        "text": "pretérito mais-que-perfeito do indicativo"
      }
    ],
    "answer": "B"
  },
  {
    "id": "lp-q15",
    "subject": "Língua Portuguesa",
    "qnum": 15,
    "stem": "SELECON - 2022 TEXTO I A resistência (trecho) Isto não é uma história. Isto é história. Isto é história e, no entanto, quase tudo o que tenho ao meu dispor é a memória, noções fugazes de dias tão remotos, impressões anteriores à consciência e à linguagem, resquícios indigentes que eu insisto em malversar em palavras. Não se trata aqui de uma preocupação abstrata, embora de abstrações eu tanto me valha: procurei meu irmão no pouco que escrevi até o momento e não o encontrei em parte alguma. Alguma ideia talvez lhe seja justa, alguma descrição porventura o evoque, dissipei em parágrafos sinuosos uns poucos dados ditos verídicos, mais nada. Não se depreenda desta observação desnecessária, ao menos por enquanto, a minha ingenuidade: sei bem que nenhum livro jamais poderá contemplar ser humano nenhum, jamais constituirá em papel e tinta sua existência feita de sangue e de carne. Mas o que digo aqui é algo mais grave, não é um formalismo literário: falei do temor de perder meu irmão e sinto que o perco a cada frase. Por um instante me confundo, esqueço que também as coisas precedem as palavras, que tratar de acessá-las implicará sempre novas falácias, e, como antes pelo texto, parto por este apartamento à procura de rastros do meu irmão, atrás de algo que me restitua sua realidade. Não estou em sua casa, a casa dos meus pais onde o imagino fechado no quarto, não posso bater à sua porta. Milhares de quilômetros nos separam, um país inteiro nos separa, mas tenho a meu favor o estranho hábito de nossa mãe de ir deixando, pelas casas da família, objetos que nos mantenham em contato. Neste apartamento de Buenos Aires ninguém mora. Desde a morte dos meus avós ele é só uma estância de passagem, encruzilhada de familiares distantes, distraídos, apressados, esquecidos da existência dos outros. Encontro um álbum de fotos cruzado na estante, largado no ângulo exato que o faça casual. Tenho que virar algumas páginas para que enfim me assalte o rosto do meu irmão, para que enfim me surpreenda o que eu já esperava. Um verbo encontra-se vinculado a seu complemento diretamente, sem a presença de uma preposição, em:",
    "options": [
      {
        "letter": "A",
        "text": "”tratar de acessá-las implicará sempre novas falácias”"
      },
      {
        "letter": "B",
        "text": "“Neste apartamento de Buenos Aires ninguém mora”"
      },
      {
        "letter": "C",
        "text": "“parto por este apartamento à procura de rastros do meu irmão”"
      },
      {
        "letter": "D",
        "text": "“Não estou em sua casa, a casa dos meus pais”"
      }
    ],
    "answer": "A"
  },
  {
    "id": "lp-q16",
    "subject": "Língua Portuguesa",
    "qnum": 16,
    "stem": "SELECON - 2024 Texto I Pedagogia do caracol Há muitas pessoas de imaginação sensível que amam as crianças. Encontrei na revista pedagógica Cem Modialitá, que se publica na Itália (Via Piamarta 9 – 25121 – Brescia – Itália) , um artigo com um título curioso: “A pedagogia do caracol”. O autor, Gianfranco Zavalloni (www.scuolacreativa.it) conta da mãe de uma menina que o procurou e lhe relatou o seguinte: “Outro dia minha filha me disse: mamãe, os professores dizem sempre: ‘Força, crianças! Não podemos perder tempo porque devemos andar para frente!’. Mas, mamãe, para onde devemos ir? Para frente, onde?’”. Essas perguntas da menina o levaram questionar o ritmo de pressa que as escolas impõem às crianças. No seu lugar, ele propõe a pedagogia do caracol. Os caracóis não sabem o que é pressa. E ele fala de um curso de formação de professores do Gruppo Educhiamoci alla Pace di Bari sobre o tema “Na companhia do ócio, da lentidão e da poesia”. Sugere que no cotidiano dos professores com as crianças deveria haver tempo para simplesmente jogar conversa fora, conversa que não quer ensinar coisa alguma. Simplesmente ouvir as crianças é coisa muito preciosa. Elas aprendem que são importantes e que é importante ouvir as outras. Caminhar, passear, andar a pé, observando as coisas ao redor. Contemplar as nuvens. Escrever cartas e cartões a lápis ou caneta; não usar os e-mails. Plantar uma horta. Plantando uma horta, as crianças aprendem sobre os ritmos da natureza. Quem observa os ritmos da natureza acaba por ganhar equilíbrio pessoal. Plantar uma horta talvez seja uma terapia mais poderosa que a dos consultórios. A velocidade é o ritmo das máquinas. Mas nós não somos máquinas. Somos seres da natureza como os animais e as plantas. E a natureza é sempre vagarosa. É perigoso introduzir a pressa num corpo que tem suas raízes na lentidão da natureza. Em “Essas perguntas da menina o levaram questionar o ritmo de pressa que as escolas impõem às crianças”, as palavras destacadas são classificadas, respectivamente, como:",
    "options": [
      {
        "letter": "A",
        "text": "artigo/artigo"
      },
      {
        "letter": "B",
        "text": "artigo/pronome"
      },
      {
        "letter": "C",
        "text": "pronome/artigo"
      },
      {
        "letter": "D",
        "text": "pronome/pronome"
      }
    ],
    "answer": "C"
  },
  {
    "id": "lp-q17",
    "subject": "Língua Portuguesa",
    "qnum": 17,
    "stem": "SELECON - 2023 Leia o texto a seguir: E tinha a cabeça cheia deles - Marina Colasanti Todos os dias, ao primeiro sol da manhã, mãe e filha sentavam-se na soleira da porta. E deitada a cabeça da filha no colo da mãe, começava esta a catar-lhe piolhos. Os dedos ágeis conheciam sua tarefa. Como se vissem, patrulhavam a cabeleira separando mechas, esquadrinhando entre os fios, expondo o claro azulado do couro. E na alternância ritmada de suas pontas macias, procuravam os minúsculos inimigos, levemente arranhando com as unhas, em carícia de cafuné. Com o rosto metido no escuro pano da saia da mãe, vertidos os cabelos sobre a testa, a filha deixava-se ficar enlanguescida, enquanto a massagem tamborilada daqueles dedos parecia penetrar-lhe a cabeça, e o calor crescente da manhã lhe entrefechava os olhos. Foi talvez devido à modorra que a invadia, entrega prazerosa de quem se submete a outros dedos, que nada percebeu naquela manhã – a não ser, talvez, uma leve pontada – quando a mãe, devassando gulosa o secreto reduto da nuca, segurou seu achado entre polegar e indicador e, puxando-o ao longo do fio negro e lustroso em gesto de vitória, extraiu-lhe o primeiro pensamento. Em “Os dedos ágeis conheciam sua tarefa. Como se vissem, patrulhavam a cabeleira separando mechas, esquadrinhando entre os fios, expondo o claro azulado do couro” (2º parágrafo) , atribuem-se características racionais aos dedos, como se pudessem ter vida própria e pensar por si mesmos. Esse uso reflete a figura de estilo denominada:",
    "options": [
      {
        "letter": "A",
        "text": "paradoxo"
      },
      {
        "letter": "B",
        "text": "catacrese"
      },
      {
        "letter": "C",
        "text": "eufemismo"
      },
      {
        "letter": "D",
        "text": "prosopopeia"
      }
    ],
    "answer": "D"
  },
  {
    "id": "lp-q18",
    "subject": "Língua Portuguesa",
    "qnum": 18,
    "stem": "SELECON - 2023 Leia o texto a seguir: O inverno Rubem Braga Foi a mais estranha manhã que tenho visto no Rio, essa de sexta-feira. Depois de uma noite de lua veio um vento que amontoou nuvens baixas sobre a cidade e, de súbito, desfechou uma chuva forte, com jeito de chuva de verão. Mas sem aquela pressão e eletricidade desses temporais que se formam atrás das montanhas de pedras, como bandidos que se juntam para um assalto ― e de súbito rebentam sobre as casas, entre relâmpagos e trovoadas. O temporal matutino veio com um vento quase frio, e às onze horas da manhã o ar estava escuro e ao mesmo tempo leve como de madrugada. Na minha rua, com a tristeza das árvores podadas, o asfalto molhado tinha um reflexo tão triste, uma luz pálida de olhos de pessoa doente. E aquela escuridão era como um dia de fim de outono na França, esses dias em que a cidade grande assume um ar egoísta, apressado, ao mesmo tempo brutal e cheio de tédio. O inverno! Pode-se amá-lo nas montanhas cobertas de neve e de sol e nas noites urbanas, quando as mulheres esplendem entre os grandes casacos macios, no meio das luzes. Mas a rua diuturna é triste e feroz quando a neve se transforma em lama e o vento gelado esbofeteia o transeunte. A tristeza pior, que mais de uma vez me apertou o coração, é, entretanto, a desse fim de outono, um desses dias escuros, molhados e frios, que dizem que o inverno vai começar, que ele já está chegando, e que é preciso dar adeus aos belos dias de sol em que é doce andar lentamente pelas ruas. Essa estranha manhã do Rio me trouxe a mesma sensação desses dias sujos, deprimentes, do começo de inverno em Paris, em que nos dá uma vontade súbita de embarcar para um Brasil qualquer em que haja luz e calor, em que a gente possa sair com um calção de banho e andar na praia, ao sol ― o pobre condenado a meses de capote, cachecol, chapéu, sapato pesado, ar cheio de fumo e vento frio. Mas o dia avançou um pouco e, como num milagre, as nuvens sumiram e veio um sol tão claro e fino sobre a cidade molhada que a cidade esplendeu no ar limpo, viva como risada de criança. E, por um instante, surpreendi nas pessoas um olhar novo, reconhecido, quase feliz, como se tivéssemos saído afinal da escuridão de um torpe, longo inverno. A cidade renascia com tanta beleza que dava vontade de fazer como na roça, e a todo ser humano que passasse dizer, com uma leve emoção ― bom dia. Leia o trecho a seguir, para responder à questão: O inverno! Pode-se amá-lo nas montanhas cobertas de neve e de sol e nas noites urbanas, quando as mulheres esplendem entre os grandes casacos macios, no meio das luzes. Mas a rua diuturna é triste e feroz quando a neve se transforma em lama e o vento gelado esbofeteia o transeunte (3º parágrafo) . A palavra “diuturna”, registrada no trecho anterior, significa algo que:",
    "options": [
      {
        "letter": "A",
        "text": "ocorre nas dificuldades do dia a dia"
      },
      {
        "letter": "B",
        "text": "se prolonga ou se prorroga no tempo"
      },
      {
        "letter": "C",
        "text": "permanece em diferentes turnos de uma semana"
      },
      {
        "letter": "D",
        "text": "acontece sempre na primeira parte do dia, ou seja, na manhã"
      }
    ],
    "answer": "B"
  },
  {
    "id": "lp-q19",
    "subject": "Língua Portuguesa",
    "qnum": 19,
    "stem": "SELECON - 2024 Leia o texto a seguir: Por que a geração Z e os millennials não atendem mais o telefone “Olá, esta é a caixa postal de Yasmin Rufo. Por favor, não deixe mensagem, pois não vou ouvir, nem ligar de volta.” Infelizmente, esta não é a mensagem da minha caixa postal. Mas eu certamente gostaria que fosse, bem como a maior parte dos jovens da geração Z (nascidos entre 1995 e 2010) e dos millennials (nascidos entre 1981 e 1995) . Uma pesquisa recente concluiu que 25% das pessoas com 18 a 34 anos de idade nunca atendem o telefone. Os participantes responderam que ignoram o toque, respondem por mensagens de texto ou pesquisam o número online se for desconhecido. A pesquisa do site Uswitch envolveu 2 mil pessoas. Ela também concluiu que cerca de 70% das pessoas com 18 a 34 anos preferem mensagens de texto a chamadas telefônicas. Para as gerações mais velhas, falar ao telefone é normal. Meus pais passaram a adolescência brigando com seus irmãos pelo telefone fixo no corredor, o que só fazia com que toda a família ouvisse as suas conversas. Já a minha adolescência foi passada em mensagens de texto. Fiquei obcecada por elas desde o momento em que ganhei meu Nokia cor-de-rosa de presente de aniversário, com 13 anos de idade. Eu passava todas as noites depois da escola redigindo textos de 160 caracteres para os meus amigos. Eu retirava todas as vogais e espaços desnecessários, até que a mensagem parecesse um grupo de consoantes aleatórias que os próprios serviços de inteligência teriam dificuldade de decifrar. Afinal, eu nunca iria pagar a mais para escrever 161 caracteres. E, em 2009, as ligações telefônicas do meu celular custavam uma fortuna. “Nós não demos este telefone para você fofocar com suas amigas a noite inteira”, relembravam meus pais sempre que recebiam minha conta telefônica, todos os meses. Foi assim que surgiu uma geração de pessoas que só se comunicam por texto. As ligações por telefone celular eram para emergências e o telefone fixo era usado raramente para falar com os avós. De acordo com o Novo Acordo Ortográfico, a única palavra que está corretamente grafada é:",
    "options": [
      {
        "letter": "A",
        "text": "assembleia"
      },
      {
        "letter": "B",
        "text": "asteróide"
      },
      {
        "letter": "C",
        "text": "chapeus"
      },
      {
        "letter": "D",
        "text": "vôo"
      }
    ],
    "answer": "A"
  },
  {
    "id": "lp-q20",
    "subject": "Língua Portuguesa",
    "qnum": 20,
    "stem": "SELECON - 2023 Leia o texto a seguir: Rio de Janeiro ganhará museu olímpico Cronograma é que ele seja inaugurado no ano que vem, em comemoração aos oito anos dos jogos na cidade A cidade do Rio de Janeiro ganhará um museu olímpico no ano que vem. A ideia da prefeitura e da Secretaria de Esportes, que toca o projeto, é que ele seja inaugurado em agosto, em comemoração aos oito anos da realização das olimpíadas na cidade, em 2016. O museu ficará no Parque Olímpico, na Barra da Tijuca, no mezanino do Velódromo, que fica no 3º andar. O espaço será oval (a pessoa entra, dá a volta e sai do outro lado) . A Secretaria de Esportes fez duas licitações. A primeira delas para a construção de um acervo olímpico e de obras e de peças interativas. Surpresas estão previstas. A outra licitação foi para as obras, que começaram no mês passado. Será reformado o arco do mezanino e o sistema de ar-condicionado passará por reforma. No trecho “O museu ficará no Parque Olímpico, na Barra da Tijuca, no mezanino do Velódromo” (2º parágrafo) , as vírgulas foram empregadas para:",
    "options": [
      {
        "letter": "A",
        "text": "enumerar elementos em sequência"
      },
      {
        "letter": "B",
        "text": "coordenar orações assindéticas"
      },
      {
        "letter": "C",
        "text": "marcar a presença de vocativo"
      },
      {
        "letter": "D",
        "text": "isolar um adjunto adverbial"
      }
    ],
    "answer": "D"
  },
  {
    "id": "rlm-q1",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 1,
    "stem": "SELECON - 2026 Na inspeção de qualidade de uma fábrica de alimentos, o supervisor anotou no relatório a frase “Alguns potes de geleia estão fora da validade”. Essa afirmação é logicamente equivalente a:",
    "options": [
      {
        "letter": "A",
        "text": "existe pelo menos um pote de geleia que está fora da validade"
      },
      {
        "letter": "B",
        "text": "a maioria absoluta dos potes de geleia está fora da validade"
      },
      {
        "letter": "C",
        "text": "nenhum pote de geleia está fora da validade"
      },
      {
        "letter": "D",
        "text": "todo pote de geleia está fora da validade"
      }
    ],
    "answer": "A"
  },
  {
    "id": "rlm-q2",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 2,
    "stem": "SELECON - 2026 Para que a proposição composta “A auditoria foi concluída e o balanço contábil está correto” seja avaliada como verdadeira na análise de sua tabela verdade, é estritamente necessário que:",
    "options": [
      {
        "letter": "A",
        "text": "apenas a primeira proposição simples seja verdadeira"
      },
      {
        "letter": "B",
        "text": "apenas a segunda proposição simples seja verdadeira"
      },
      {
        "letter": "C",
        "text": "ambas as proposições simples que a compõem sejam falsas"
      },
      {
        "letter": "D",
        "text": "ambas as proposições simples que a compõem sejam verdadeiras"
      }
    ],
    "answer": "D"
  },
  {
    "id": "rlm-q3",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 3,
    "stem": "SELECON - 2026 Em uma campanha institucional de vacinação, um determinado lote de doses foi planejado para atender a uma média diária de 250 pessoas ao longo de 18 dias. Se a procura média diária passar a ser de 450 pessoas, o tempo previsto para o esgotamento total desse mesmo lote será de:",
    "options": [
      {
        "letter": "A",
        "text": "10 dias"
      },
      {
        "letter": "B",
        "text": "12 dias"
      },
      {
        "letter": "C",
        "text": "14 dias"
      },
      {
        "letter": "D",
        "text": "15 dias"
      }
    ],
    "answer": "A"
  },
  {
    "id": "rlm-q4",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 4,
    "stem": "SELECON - 2026 Uma distribuidora de alimentos recebeu um lote com 180 garrafas de azeite e 240 latas de palmito. O gerente de logística determinou que os produtos fossem agrupados em caixas de socorro humanitário idênticas, contendo a mesma quantidade de azeite e a mesma quantidade de palmito em cada uma, sem sobras e com o maior número possível de caixas. A quantidade de latas de palmito em cada caixa será de:",
    "options": [
      {
        "letter": "A",
        "text": "3"
      },
      {
        "letter": "B",
        "text": "4"
      },
      {
        "letter": "C",
        "text": "6"
      },
      {
        "letter": "D",
        "text": "60"
      }
    ],
    "answer": "B"
  },
  {
    "id": "rlm-q5",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 5,
    "stem": "SELECON - 2026 O gerente de projetos de uma empresa de tecnologia da informação afirmou para a sua equipe a seguinte regra de conformidade: “Todo processo de desenvolvimento que foi auditado neste semestre apresentou total conformidade com as normas internacionais.” A negação lógica da afirmação do gerente de projetos é expressa por:",
    "options": [
      {
        "letter": "A",
        "text": "todos os processos de desenvolvimento que não foram auditados neste semestre apresentaram inconformidades"
      },
      {
        "letter": "B",
        "text": "nenhum processo de desenvolvimento que foi auditado neste semestre apresentou total conformidade com as normas internacionais"
      },
      {
        "letter": "C",
        "text": "se um processo de desenvolvimento não foi auditado neste semestre, então ele não apresentou total conformidade com as normas internacionais"
      },
      {
        "letter": "D",
        "text": "pelo menos um processo de desenvolvimento que foi auditado neste semestre não apresentou total conformidade com as normas internacionais"
      }
    ],
    "answer": "D"
  },
  {
    "id": "rlm-q6",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 6,
    "stem": "SELECON - 2026 Uma startup de tecnologia gastou dois quintos do seu capital inicial com infraestrutura de servidores e um terço do capital restante com campanhas de marketing digital. Sabendo que, após esses investimentos, a empresa ainda possui R$ 150.000,00 em caixa, o valor do capital inicial total aportado nessa startup foi de:",
    "options": [
      {
        "letter": "A",
        "text": "R$ 312.500,00"
      },
      {
        "letter": "B",
        "text": "R$ 375.000,00"
      },
      {
        "letter": "C",
        "text": "R$ 450.000,00"
      },
      {
        "letter": "D",
        "text": "R$ 500.000,00"
      }
    ],
    "answer": "B"
  },
  {
    "id": "rlm-q7",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 7,
    "stem": "SELECON - 2026 Uma equipe de auditores fiscais foi designada para analisar declarações de rendimentos. Sabe-se que 6 auditores, trabalhando 7 horas por dia, analisam 420 declarações em 10 dias úteis. Mantendo o mesmo ritmo de produção, se a equipe for reduzida para 5 auditores trabalhando 8 horas por dia, a quantidade de declarações analisadas ao longo de 15 dias úteis será de:",
    "options": [
      {
        "letter": "A",
        "text": "600"
      },
      {
        "letter": "B",
        "text": "720"
      },
      {
        "letter": "C",
        "text": "800"
      },
      {
        "letter": "D",
        "text": "920"
      }
    ],
    "answer": "A"
  },
  {
    "id": "rlm-q8",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 8,
    "stem": "SELECON - 2026 Observe a expressão numérica a seguir 48 ÷ 6 + 7 x 5 - 18 ÷ 3 + 9 x 2 - 4 Para determinar o valor de uma expressão numérica, é necessário considerar a ordem correta de execução das operações. Assim sendo, a expressão numérica acima tem valor igual a:",
    "options": [
      {
        "letter": "A",
        "text": "47"
      },
      {
        "letter": "B",
        "text": "49"
      },
      {
        "letter": "C",
        "text": "51"
      },
      {
        "letter": "D",
        "text": "55"
      }
    ],
    "answer": "C"
  },
  {
    "id": "rlm-q9",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 9,
    "stem": "SELECON - 2026 Helena não tem filhos gêmeos. A probabilidade de que os 3 filhos de Helena tenham nascido no mesmo dia da semana é de:",
    "options": [
      {
        "letter": "A",
        "text": ""
      },
      {
        "letter": "B",
        "text": ""
      },
      {
        "letter": "C",
        "text": ""
      },
      {
        "letter": "D",
        "text": ""
      }
    ],
    "answer": "A"
  },
  {
    "id": "rlm-q10",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 10,
    "stem": "SELECON - 2026 Helena possui 5 livros distintos, dentre eles o livro X, e pretende doar pelo menos dois desses livros, de modo que o livro X será obrigatoriamente doado. O número máximo de maneiras diferentes de Helena escolher os livros que serão doados é:",
    "options": [
      {
        "letter": "A",
        "text": "12"
      },
      {
        "letter": "B",
        "text": "15"
      },
      {
        "letter": "C",
        "text": "21"
      },
      {
        "letter": "D",
        "text": "24"
      }
    ],
    "answer": "B"
  },
  {
    "id": "rlm-q11",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 11,
    "stem": "SELECON - 2025 A princesa Aurora declarou: “O castelo é azul e o dragão está dormindo.” A negação lógica dessa conjunção é:",
    "options": [
      {
        "letter": "A",
        "text": "Se o castelo não é azul, então o dragão não está dormindo."
      },
      {
        "letter": "B",
        "text": "O castelo não é azul ou o dragão não está dormindo."
      },
      {
        "letter": "C",
        "text": "O castelo não é azul e o dragão não está dormindo."
      },
      {
        "letter": "D",
        "text": "O castelo é azul ou o dragão não está dormindo."
      }
    ],
    "answer": "B"
  },
  {
    "id": "rlm-q12",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 12,
    "stem": "SELECON - 2025 O professor Vicente precisa escolher 4 alunos para representá-lo em um congresso (formar uma comissão). Sua turma tem 6 homens e 4 mulheres. O número de maneiras que a comissão pode ser formada, de modo que haja pelo menos uma mulher, é:",
    "options": [
      {
        "letter": "A",
        "text": "15"
      },
      {
        "letter": "B",
        "text": "105"
      },
      {
        "letter": "C",
        "text": "195"
      },
      {
        "letter": "D",
        "text": "210"
      }
    ],
    "answer": "C"
  },
  {
    "id": "rlm-q13",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 13,
    "stem": "SELECON - 2025 O feiticeiro Kelsen usa um código que alterna grupos de vogais e consoantes de acordo com a ordem alfabética: (A, B, E, F, I, J, O, P, ...). A próxima letra da sequência é igual a:",
    "options": [
      {
        "letter": "A",
        "text": "T"
      },
      {
        "letter": "B",
        "text": "U"
      },
      {
        "letter": "C",
        "text": "V"
      },
      {
        "letter": "D",
        "text": "Q"
      }
    ],
    "answer": "B"
  },
  {
    "id": "rlm-q14",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 14,
    "stem": "SELECON - 2025 A estilista Mariah está preparando seu guarda-roupa para uma viagem. Ela separou 4 saias sociais azuis e 7 vestidos longos vermelhos. No total, o número de opções diferentes de vestuário que Mariah tem para se vestir, escolhendo uma saia ou um vestido (mas não ambos), é igual a:",
    "options": [
      {
        "letter": "A",
        "text": "11 maneiras"
      },
      {
        "letter": "B",
        "text": "14 maneiras"
      },
      {
        "letter": "C",
        "text": "28 maneiras"
      },
      {
        "letter": "D",
        "text": "35 maneiras"
      }
    ],
    "answer": "A"
  },
  {
    "id": "rlm-q15",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 15,
    "stem": "SELECON - 2025 Em uma reunião, 70 pessoas leem o jornal A, 50 leem o jornal B e 40 leem o jornal C. Sabendo que 25 pessoas leem os jornais A e B, 20 pessoas leem os jornais A e C e 15 leem os jornais B e C, e que todas as pessoas presentes leem ao menos um dos jornais e que exatamente 5 pessoas leem os três jornais, determine o número total de pessoas na reunião:",
    "options": [
      {
        "letter": "A",
        "text": "105 pessoas"
      },
      {
        "letter": "B",
        "text": "115 pessoas"
      },
      {
        "letter": "C",
        "text": "125 pessoas"
      },
      {
        "letter": "D",
        "text": "145 pessoas"
      }
    ],
    "answer": "A"
  },
  {
    "id": "rlm-q16",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 16,
    "stem": "SELECON - 2025 O próximo número na sequência: (2, 3, 5, 9, 17, 33, ...) é:",
    "options": [
      {
        "letter": "A",
        "text": "49"
      },
      {
        "letter": "B",
        "text": "50"
      },
      {
        "letter": "C",
        "text": "65"
      },
      {
        "letter": "D",
        "text": "67"
      }
    ],
    "answer": "C"
  },
  {
    "id": "rlm-q17",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 17,
    "stem": "SELECON - 2025 A afirmação ‘Se a porta está aberta (P), então a luz está acesa (Q)’ tem como equivalente lógica:",
    "options": [
      {
        "letter": "A",
        "text": "Se a luz está acesa, então a porta está aberta."
      },
      {
        "letter": "B",
        "text": "Se a luz não está acesa, então a porta não está aberta."
      },
      {
        "letter": "C",
        "text": "A porta está aberta e a luz não está acesa."
      },
      {
        "letter": "D",
        "text": "A luz não está acesa ou a porta está aberta."
      }
    ],
    "answer": "B"
  },
  {
    "id": "rlm-q18",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 18,
    "stem": "SELECON - 2025 A gerente Bruna está organizando uma nova vitrine temática para uma loja. Ela tem à sua disposição um acervo composto por 6 calças e 4 blusas. A vitrine tem espaço para expor apenas 3 peças no total. Para manter o equilíbrio visual, Bruna decidiu que a escolha deve ser formada obrigatoriamente por 2 calças e 1 blusa. O número de maneiras distintas que Bruna pode selecionar as peças para compor essa vitrine é igual a:",
    "options": [
      {
        "letter": "A",
        "text": "60"
      },
      {
        "letter": "B",
        "text": "50"
      },
      {
        "letter": "C",
        "text": "40"
      },
      {
        "letter": "D",
        "text": "20"
      }
    ],
    "answer": "A"
  },
  {
    "id": "rlm-q19",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 19,
    "stem": "SELECON - 2025 Um reservatório é abastecido por duas bombas. A bomba “A” enche o reservatório em 6 horas e a bomba “B” em 4 horas. Se ambas forem ligadas juntas, o reservatório estará cheio no tempo exato de:",
    "options": [
      {
        "letter": "A",
        "text": "3 horas e 12 minutos"
      },
      {
        "letter": "B",
        "text": "3 horas"
      },
      {
        "letter": "C",
        "text": "2 horas e 30 minutos"
      },
      {
        "letter": "D",
        "text": "2 horas e 24 minutos"
      }
    ],
    "answer": "D"
  },
  {
    "id": "rlm-q20",
    "subject": "Raciocínio Lógico e Matemático",
    "qnum": 20,
    "stem": "SELECON - 2025 Considere a afirmação: “A aprovação no concurso exige que o candidato tenha feito mais de 60 pontos na prova objetiva.” Nesse sentido, é correto afirmar que ter feito mais de 60 pontos:",
    "options": [
      {
        "letter": "A",
        "text": "é condição sufi ciente para aprovação"
      },
      {
        "letter": "B",
        "text": "é condição necessária para aprovação"
      },
      {
        "letter": "C",
        "text": "é necessário e sufi ciente para aprovação"
      },
      {
        "letter": "D",
        "text": "garante a aprovação, mas não é condição necessária"
      }
    ],
    "answer": "B"
  },
  {
    "id": "inf-q1",
    "subject": "Noções de Informática",
    "qnum": 1,
    "stem": "SELECON - 2025 No que tange às ferramentas Google, uma é uma plataforma de videoconferência que permite realizar chamadas com áudio e vídeo para várias pessoas ao mesmo tempo, possibilitando realizar reuniões, aulas e eventos online, independentemente da localização geográfica dos participantes. Entre as características desse recurso, pode-se compartilhar a tela, apresentações e documentos em tempo real, transformando-o em uma ferramenta útil para trabalhar remotamente, colaborar com colegas e realizar apresentações online. Além disso, é fácil de usar e pode ser acessada diretamente no navegador da web, sem a necessidade de instalar qualquer software adicional. Essa ferramenta é conhecida como:",
    "options": [
      {
        "letter": "A",
        "text": "Google Meet"
      },
      {
        "letter": "B",
        "text": "Google Team"
      },
      {
        "letter": "C",
        "text": "Google Gemini"
      },
      {
        "letter": "D",
        "text": "Google Workspace"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q2",
    "subject": "Noções de Informática",
    "qnum": 2,
    "stem": "SELECON - 2025 A planilha da figura foi criada no Excel do pacote MS Office 2010 BR, em um notebook com sistema operacional Windows 11 BR (x64) . Em D4 foi inserida uma fórmula que adiciona exclusivamente os números mostrados na células A3 e A6, enquanto que em D6, uma outra que determina o valor da média aritmética entre todos os números mostrados nas células A3, A4, A5 e A6. Nesse contexto, as fórmulas inseridas em D4 e D6 são, respectivamente:",
    "options": [
      {
        "letter": "A",
        "text": "=SOMA(A3;A6) e =MÉDIA(A3:A6)"
      },
      {
        "letter": "B",
        "text": "=SOMA(A3:A6) e =MÉDIA(A3;A6)"
      },
      {
        "letter": "C",
        "text": "=SOMA(A3:A6) e =MÉDIA(A3:A6)"
      },
      {
        "letter": "D",
        "text": "=SOMA(A3;A6) e =MÉDIA(A3;A6)"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q3",
    "subject": "Noções de Informática",
    "qnum": 3,
    "stem": "SELECON - 2025 Para utilizar um sistema de e-mail na internet, é necessário ter uma conta que segue regras bem definidas, enquanto que para navegar em sites utiliza-se um software conhecido como browser. Em conformidade com as regras, uma conta válida para uso e um exemplo de browser estão indicados na seguinte opção de resposta:",
    "options": [
      {
        "letter": "A",
        "text": "ouvidoria$marcelandia.mt.gov.br e Google Meet"
      },
      {
        "letter": "B",
        "text": "ouvidoria#marcelandia.mt.gov.br e Google Drive"
      },
      {
        "letter": "C",
        "text": "ouvidoria@marcelandia.mt.gov.br e Google Chrome"
      },
      {
        "letter": "D",
        "text": "ouvidoria%marcelandia.mt.gov.br e Google Workspace"
      }
    ],
    "answer": "C"
  },
  {
    "id": "inf-q4",
    "subject": "Noções de Informática",
    "qnum": 4,
    "stem": "SELECON - 2025 Um usuário, utilizando o Google Gmail, deseja enviar uma mensagem para vários destinatários, mantendo os endereços de e-mail privados e seguros, de modo que os destinatários não vejam os endereços uns dos outros. Para isso, ele deve colocar os destinatários no campo do e-mail, que é o:",
    "options": [
      {
        "letter": "A",
        "text": "Cco"
      },
      {
        "letter": "B",
        "text": "Para"
      },
      {
        "letter": "C",
        "text": "Corpo"
      },
      {
        "letter": "D",
        "text": "Domínio"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q5",
    "subject": "Noções de Informática",
    "qnum": 5,
    "stem": "SELECON - 2025 Um administrador de redes implantou, para os servidores de dados, uma política de backup diferencial. Isso significa que será realizado um backup:",
    "options": [
      {
        "letter": "A",
        "text": "de todos os arquivos que serão destinados para um ambiente de nuvem"
      },
      {
        "letter": "B",
        "text": "de todos os arquivos modificados ou adicionados desde o último backup completo"
      },
      {
        "letter": "C",
        "text": "de todos os arquivos ativos que serão destinados para um HD externo de um servidor de rede diferente"
      },
      {
        "letter": "D",
        "text": "dos dados que foram modificados desde o backup anterior, seja esse backup de qualquer tipo"
      }
    ],
    "answer": "B"
  },
  {
    "id": "inf-q6",
    "subject": "Noções de Informática",
    "qnum": 6,
    "stem": "SELECON - 2025 A planilha da figura foi criada no Excel do pacote MS Office 2013 BR em um notebook Intel com Windows 10 BR (x64) . Em D10, foi inserida a fórmula =SOMA(A8;D8) . Em D12, foi inserida uma fórmula que determina a média aritmética entre todos os números mostrados nas células A8, B8, C8 e D8. Nessas condições, o número mostrado em D10 e a fórmula inserida em D12 são, respectivamente:",
    "options": [
      {
        "letter": "A",
        "text": "110 e =MED(A8:D8)"
      },
      {
        "letter": "B",
        "text": "160 e =MED(A8:D8)"
      },
      {
        "letter": "C",
        "text": "110 e =MÉDIA(A8:D8)"
      },
      {
        "letter": "D",
        "text": "160 e =MÉDIA(A8:D8)"
      }
    ],
    "answer": "C"
  },
  {
    "id": "inf-q7",
    "subject": "Noções de Informática",
    "qnum": 7,
    "stem": "SELECON - 2025 Um usuário de um computador com MS Windows 10BR está confeccionando um texto através do MS Word 2019BR. Esse usuário deseja centralizar uma parte do texto. Para isso, ele deve selecionar o texto não centralizado e usar as teclas de atalho CTRL +",
    "options": [
      {
        "letter": "A",
        "text": "C"
      },
      {
        "letter": "B",
        "text": "D"
      },
      {
        "letter": "C",
        "text": "E"
      },
      {
        "letter": "D",
        "text": "S"
      }
    ],
    "answer": "C"
  },
  {
    "id": "inf-q8",
    "subject": "Noções de Informática",
    "qnum": 8,
    "stem": "SELECON - 2025 Um usuário de computador deseja inserir um conteúdo em uma rede social que trata de microblogging de vídeos, ou seja, permite criar e compartilhar vídeos curtos. Essa rede social é:",
    "options": [
      {
        "letter": "A",
        "text": "Ask.fm"
      },
      {
        "letter": "B",
        "text": "TikTok"
      },
      {
        "letter": "C",
        "text": "YuBliss"
      },
      {
        "letter": "D",
        "text": "ResearchGate"
      }
    ],
    "answer": "B"
  },
  {
    "id": "inf-q9",
    "subject": "Noções de Informática",
    "qnum": 9,
    "stem": "SELECON - 2025 Atualmente, na operação de microcomputadores e notebooks, é comum configurar essas máquinas com dispositivos especializados, pertencentes a três categorias. Na primeira, para uso exclusivo na entrada de dados a serem processados, na segunda para utilização unicamente na saída dos dados já processados, e uma terceira que corresponde ao emprego de periféricos que podem operar tanto na entrada como na saída de dados, em momentos distintos. Três exemplos de dispositivos pertencentes a cada uma dessas categorias são, respectivamente:",
    "options": [
      {
        "letter": "A",
        "text": "plotter, pendrive e teclado"
      },
      {
        "letter": "B",
        "text": "webcam, scanner e plotter"
      },
      {
        "letter": "C",
        "text": "scanner, plotter e pendrive"
      },
      {
        "letter": "D",
        "text": "teclado, webcam e scanner"
      },
      {
        "letter": "E",
        "text": "pendrive, teclado e webcam"
      }
    ],
    "answer": "C"
  },
  {
    "id": "inf-q10",
    "subject": "Noções de Informática",
    "qnum": 10,
    "stem": "SELECON - 2025 Segurança da informação é definida como a prática de proteger dados e sistemas contra ameaças, acesso não autorizado ou violação de dados que resultem na divulgação, alteração ou destruição de informações confidenciais, baseando-se em três princípios fundamentais. Um deles refere-se à privacidade dos dados e seu objetivo é proteger informações sensíveis e confidenciais contra acesso não autorizado, sendo que algumas das ferramentas relevantes utilizadas incluem criptografia, controle de acesso e prevenção de perda de dados. Esse princípio é conhecido como:",
    "options": [
      {
        "letter": "A",
        "text": "confidencialidade"
      },
      {
        "letter": "B",
        "text": "irretratabilidade"
      },
      {
        "letter": "C",
        "text": "disponibilidade"
      },
      {
        "letter": "D",
        "text": "autenticidade"
      },
      {
        "letter": "E",
        "text": "integridade"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q11",
    "subject": "Noções de Informática",
    "qnum": 11,
    "stem": "SELECON - 2025 O Google, como instituição, disponibilizou diversas ferramentas que representam um conjunto de recursos online, que podem ser usados para melhorar a produtividade e o marketing digital. Entre as ferramentas Google, uma constitui o local para armazenamento de todos os documentos recebidos no e-mail ou criados no Google documentos, sendo um espaço de armazenamento na nuvem, que pode ser utilizado para salvar documentos e compartilhá-los com outras pessoas até mesmo fora da organização, tudo isso com muita segurança. Outra ferramenta tem por objetivo melhorar a comunicação em tempo real, com uso em atividades de videoconferência, suportando a realização de chamadas de até 250 pessoas na versão Standard, permitindo a gravação das chamadas, o que para uma equipe de treinamento tem muita utilidade. Essas duas ferramentas são conhecidas, respectivamente, como Google:",
    "options": [
      {
        "letter": "A",
        "text": "WorkSpace e Agenda"
      },
      {
        "letter": "B",
        "text": "OneDrive e Maps"
      },
      {
        "letter": "C",
        "text": "Dropbox e Chat"
      },
      {
        "letter": "D",
        "text": "Drive e Meet"
      },
      {
        "letter": "E",
        "text": "X e Team"
      }
    ],
    "answer": "D"
  },
  {
    "id": "inf-q12",
    "subject": "Noções de Informática",
    "qnum": 12,
    "stem": "SELECON - 2025 A planilha da figura foi criada no Excel 2016 BR, em um notebook Intel, com Windows 10 BR (x64) . Nela, foi inserida a fórmula =SOMA(B7;E7) em E9 e =SE(MÁXIMO(B7:E7) =40;”MT”;”MS”) em E10. Os valores mostrados nas células E9 e E10 são, respectivamente:",
    "options": [
      {
        "letter": "A",
        "text": "40 e MT"
      },
      {
        "letter": "B",
        "text": "40 e MS"
      },
      {
        "letter": "C",
        "text": "72 e MT"
      },
      {
        "letter": "D",
        "text": "72 e MS"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q13",
    "subject": "Noções de Informática",
    "qnum": 13,
    "stem": "SELECON - 2025 As apresentações de slides, tanto no Powerpoint 2016 BR do pacote Office como no software Impress da suíte LibreOffice 6.2.4 BR, geram arquivos que são gravados em formatos nativos utilizando extensões padronizadas nos nomes. Esses formatos/ extensões são, respectivamente:",
    "options": [
      {
        "letter": "A",
        "text": ".PPTX e .ODS"
      },
      {
        "letter": "B",
        "text": ".PPTX e .ODP"
      },
      {
        "letter": "C",
        "text": ".PWPX e .ODS"
      },
      {
        "letter": "D",
        "text": ".PWPX e .ODP"
      }
    ],
    "answer": "B"
  },
  {
    "id": "inf-q14",
    "subject": "Noções de Informática",
    "qnum": 14,
    "stem": "SELECON - 2025 No uso dos recursos de e-mail, as mensagens de correio eletrônico direcionadas a um determinado usuário do sistema, são armazenadas por default em caixa postal padrão tanto na plataforma de WebMail do tipo Gmail como em um software como o Microsoft Outlook, por exemplo. Paralelamente, as contas de e-mail seguem padrões e regras bem definidos na sua criação, para que sejam consideras válidas e reconhecidas. Nesse sentido, a referência para essa caixa postal e um exemplo de conta de e-mail válida estão indicadas na opção:",
    "options": [
      {
        "letter": "A",
        "text": "Entrada e ouvidoria@sinop.mt.gov.br"
      },
      {
        "letter": "B",
        "text": "Entrada e ouvidoria#sinop.mt.gov.br"
      },
      {
        "letter": "C",
        "text": "Mensagens e ouvidoria@sinop.mt.gov.br"
      },
      {
        "letter": "D",
        "text": "Mensagens e ouvidoria#sinop.mt.gov.br"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q15",
    "subject": "Noções de Informática",
    "qnum": 15,
    "stem": "SELECON - 2025 Segurança da informação é definida como a proteção de informações importantes contra acesso não autorizado, divulgação, uso, alteração ou interrupção, com o objetivo de assegurar que os dados organizacionais confidenciais estejam disponíveis para usuários autorizados e permaneçam confidenciais. Entre os pilares da segurança da informação, um deles relaciona-se com a veracidade da informação durante todo o seu ciclo de vida, sendo seu princípio básico que as informações permanecem imutáveis quando estão em repouso ou durante sua transmissão, significando garantir que todas as informações contidas nos bancos de dados da empresa sejam completas e precisas. Esse pilar da segurança da informação é denominado:",
    "options": [
      {
        "letter": "A",
        "text": "confidencialidade"
      },
      {
        "letter": "B",
        "text": "confiabilidade"
      },
      {
        "letter": "C",
        "text": "autenticidade"
      },
      {
        "letter": "D",
        "text": "integridade"
      }
    ],
    "answer": "D"
  },
  {
    "id": "inf-q16",
    "subject": "Noções de Informática",
    "qnum": 16,
    "stem": "SELECON - 2024 Um usuário do MS Word 2016 em português precisa configurar as margens de um documento e colocá-lo com duas colunas. Para que esse usuário possa configurar o documento de acordo com essa necessidade, de forma direta, ele deve acessar a guia que trata de:",
    "options": [
      {
        "letter": "A",
        "text": "correspondências"
      },
      {
        "letter": "B",
        "text": "design"
      },
      {
        "letter": "C",
        "text": "layout"
      },
      {
        "letter": "D",
        "text": "referências"
      }
    ],
    "answer": "C"
  },
  {
    "id": "inf-q17",
    "subject": "Noções de Informática",
    "qnum": 17,
    "stem": "SELECON - 2024 Um administrador de redes de computadores está montando uma rede local de computadores para uma empresa, baseada na topologia lógica na qual computadores vão estar organizados dentro de um padrão circular, de modo que cada computador terá acesso a dois vizinhos. Esse tipo de topologia lógica é conhecida como:",
    "options": [
      {
        "letter": "A",
        "text": "anel"
      },
      {
        "letter": "B",
        "text": "barramento"
      },
      {
        "letter": "C",
        "text": "estrela"
      },
      {
        "letter": "D",
        "text": "malha"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q18",
    "subject": "Noções de Informática",
    "qnum": 18,
    "stem": "SELECON - 2024 Atualmente, a conexão e integração de dispositivos de entrada e saída de dados a um microcomputador Intel com Windows 11 BR, é realizada por meio de conectores padronizados. Nesse contexto, pendrives utilizam um conector específico, mostrado na figura a seguir. No caso, esse conector é conhecido pela sigla:",
    "options": [
      {
        "letter": "A",
        "text": "USB"
      },
      {
        "letter": "B",
        "text": "PS2"
      },
      {
        "letter": "C",
        "text": "RCA"
      },
      {
        "letter": "D",
        "text": "RG6"
      },
      {
        "letter": "E",
        "text": "PCI"
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q19",
    "subject": "Noções de Informática",
    "qnum": 19,
    "stem": "IF - 2025 A Lei n. 13.709, de 14 de agosto de 2018 - Lei Geral de Proteção de Dados Pessoais - LGPD, dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade, assim como o livre desenvolvimento da personalidade da pessoa natural. Assinale a alternativa correta sobre as disposições expostas na LGPD:",
    "options": [
      {
        "letter": "A",
        "text": "A LGPD considera que toda operação realizada com dados pessoais, definida como tratamento, tem como agentes o controlador e o operador."
      },
      {
        "letter": "B",
        "text": "“O desenvolvimento econômico e tecnológico e a inovação” não é um fundamento da proteção de dados pessoais estabelecido na LGPD."
      },
      {
        "letter": "C",
        "text": "Para os fins estabelecidos na LGPD, “operador” é a pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais."
      },
      {
        "letter": "D",
        "text": "A LGPD considera que “dado pessoal sensível” é toda informação relacionada à pessoa natural identificada ou identificável."
      }
    ],
    "answer": "A"
  },
  {
    "id": "inf-q20",
    "subject": "Noções de Informática",
    "qnum": 20,
    "stem": "Unesc - 2025 O tratamento de dados pessoais realizado por órgãos e entidades públicas deve respeitar os princípios previstos na Lei Geral de Proteção de Dados (LGPD) , garantindo segurança jurídica e proteção ao titular das informações. Entre esses princípios, destacam-se aqueles que orientam o propósito do tratamento, a coerência entre esse propósito e o uso real dos dados, e a limitação das informações coletadas ao estritamente necessário. Com base no Art. 6º da LGPD, assinale a alternativa correta:",
    "options": [
      {
        "letter": "A",
        "text": "O princípio da necessidade determina que apenas os dados essenciais devem ser coletados, evitando informações excessivas."
      },
      {
        "letter": "B",
        "text": "A necessidade permite coletar mais dados do que o mínimo exigido, desde que tragam benefícios à administração pública."
      },
      {
        "letter": "C",
        "text": "A finalidade e a adequação tratam do mesmo conceito, podendo ser aplicadas como regras intercambiáveis."
      },
      {
        "letter": "D",
        "text": "Pelo princípio da adequação, o tratamento pode divergir das finalidades informadas, desde que não exponha o titular a riscos."
      },
      {
        "letter": "E",
        "text": "O princípio da finalidade permite ampliar o uso dos dados para qualquer atividade institucional, mesmo sem informar ao titular."
      }
    ],
    "answer": "A"
  },
  {
    "id": "et-q1",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 1,
    "stem": "(2026) A Filosofia surgiu como uma forma de investigação racional sobre a realidade, o conhecimento, a existência humana e os valores que orientam a vida em sociedade. Diferentemente de uma simples aceitação das opiniões estabelecidas, a atividade filosófica procura examinar criticamente os fundamentos das ideias e das crenças. Considerando as características do pensamento filosófico, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Filosofia consiste exclusivamente na memorização de pensamentos de autores antigos, sem possibilidade de questionamento."
      },
      {
        "letter": "B",
        "text": "O conhecimento filosófico depende necessariamente da aceitação de verdades transmitidas pela tradição, independentemente de justificativas."
      },
      {
        "letter": "C",
        "text": "A Filosofia caracteriza-se pela investigação racional, pela problematização de conceitos e pela busca de argumentos que permitam examinar criticamente a realidade."
      },
      {
        "letter": "D",
        "text": "A reflexão filosófica deve evitar questões relacionadas à moralidade, à política e ao conhecimento científico."
      },
      {
        "letter": "E",
        "text": "O pensamento filosófico limita-se à descrição de acontecimentos históricos, sem desenvolver questionamentos sobre seus significados."
      }
    ],
    "answer": "C"
  },
  {
    "id": "et-q2",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 2,
    "stem": "(2026) A Filosofia apresenta diferentes áreas de investigação, entre as quais se destacam a ética, a lógica, a epistemologia, a metafísica e a filosofia política. Cada uma dessas áreas aborda problemas específicos, embora possam existir relações entre seus objetos de estudo. Considerando a organização dos campos de investigação filosófica, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A epistemologia investiga exclusivamente as relações comerciais entre indivíduos, não possuindo relação com a natureza do conhecimento."
      },
      {
        "letter": "B",
        "text": "A lógica dedica-se exclusivamente à interpretação de sentimentos e emoções, sem considerar a validade dos argumentos."
      },
      {
        "letter": "C",
        "text": "A metafísica analisa exclusivamente as normas jurídicas estabelecidas pelo Estado, dispensando questões sobre a realidade."
      },
      {
        "letter": "D",
        "text": "A ética tem como objeto exclusivo o estudo das características físicas dos seres humanos."
      },
      {
        "letter": "E",
        "text": "A ética investiga questões relativas à ação humana e à moralidade, enquanto a epistemologia examina problemas relacionados ao conhecimento e à sua justificação."
      }
    ],
    "answer": "E"
  },
  {
    "id": "et-q3",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 3,
    "stem": "(2026) A filosofia moral, também denominada ética, investiga os fundamentos dos valores, das normas e das escolhas humanas. Em determinada instituição pública, servidores discutem se uma conduta deve ser considerada correta apenas porque é habitualmente praticada pelos integrantes da organização. Considerando a distinção entre ética e moral, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A moral envolve normas, valores e costumes que orientam comportamentos, enquanto a ética realiza reflexão crítica sobre seus fundamentos, sua validade e suas consequências."
      },
      {
        "letter": "B",
        "text": "A ética corresponde exclusivamente às leis penais, enquanto a moral se limita às normas administrativas."
      },
      {
        "letter": "C",
        "text": "A moral é necessariamente universal e imutável, não apresentando diferenças entre culturas ou períodos históricos."
      },
      {
        "letter": "D",
        "text": "A ética impede o questionamento de costumes sociais, pois sua finalidade consiste exclusivamente em preservá-los."
      },
      {
        "letter": "E",
        "text": "Ética e moral são conceitos inteiramente desvinculados, não apresentando qualquer relação com a conduta humana."
      }
    ],
    "answer": "A"
  },
  {
    "id": "et-q4",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 4,
    "stem": "(2026) A reflexão ética permite avaliar condutas considerando princípios, consequências e deveres. Um servidor público identifica que determinado procedimento, embora utilizado há muitos anos, produz tratamento injustificadamente desigual entre os usuários do serviço. Diante dessa situação, a análise filosófica da conduta deve considerar seus fundamentos e efeitos. Nesse contexto, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A existência de uma prática tradicional demonstra necessariamente sua legitimidade moral, independentemente dos resultados produzidos."
      },
      {
        "letter": "B",
        "text": "A avaliação ética deve considerar exclusivamente a opinião da maioria, mesmo quando houver violação da dignidade de determinadas pessoas."
      },
      {
        "letter": "C",
        "text": "A reflexão moral exige a preservação de qualquer comportamento institucional, ainda que seja demonstrada sua injustiça."
      },
      {
        "letter": "D",
        "text": "A análise ética permite questionar práticas consolidadas, examinando sua compatibilidade com princípios como justiça, igualdade, respeito e responsabilidade."
      },
      {
        "letter": "E",
        "text": "As consequências das ações humanas são irrelevantes para qualquer teoria ética, independentemente de seus fundamentos."
      }
    ],
    "answer": "D"
  },
  {
    "id": "et-q5",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 5,
    "stem": "(2026) A consciência crítica constitui uma dimensão importante da atividade filosófica, pois permite que os indivíduos examinem informações, identifiquem pressupostos e desenvolvam posicionamentos fundamentados. Em determinada comunidade, uma notícia é amplamente compartilhada nas redes sociais, embora sua origem e sua veracidade não tenham sido verificadas. Considerando a relação entre Filosofia e consciência crítica, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O pensamento crítico exige rejeitar automaticamente qualquer informação divulgada por instituições reconhecidas."
      },
      {
        "letter": "B",
        "text": "A consciência crítica envolve avaliar fontes, questionar pressupostos, examinar argumentos e distinguir informações fundamentadas de opiniões ou afirmações sem comprovação."
      },
      {
        "letter": "C",
        "text": "A reflexão crítica consiste em aceitar como verdadeira a informação mais compartilhada socialmente."
      },
      {
        "letter": "D",
        "text": "O exercício do pensamento crítico pressupõe abandonar a razão e utilizar exclusivamente impressões pessoais."
      },
      {
        "letter": "E",
        "text": "A consciência crítica impede o reconhecimento de argumentos contrários às próprias convicções."
      }
    ],
    "answer": "B"
  },
  {
    "id": "et-q6",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 6,
    "stem": "(2026) O desenvolvimento da consciência crítica também envolve a capacidade de reconhecer preconceitos, avaliar explicações e identificar contradições presentes nas relações sociais. Em uma discussão sobre determinado problema coletivo, um participante afirma que sua opinião deve prevalecer exclusivamente porque sempre pensou daquela maneira. Considerando as características da atitude filosófica, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A manutenção de uma opinião pessoal constitui prova suficiente de sua validade, dispensando justificativas."
      },
      {
        "letter": "B",
        "text": "A reflexão filosófica exige que todas as pessoas apresentem necessariamente as mesmas conclusões sobre qualquer tema."
      },
      {
        "letter": "C",
        "text": "O pensamento crítico deve ser aplicado exclusivamente às opiniões dos outros, não alcançando as próprias crenças."
      },
      {
        "letter": "D",
        "text": "A atitude filosófica consiste em rejeitar qualquer possibilidade de revisão de ideias diante de novas evidências."
      },
      {
        "letter": "E",
        "text": "A consciência crítica pressupõe disposição para examinar as próprias convicções, reconhecer limitações dos argumentos e revisar posicionamentos quando houver justificativas relevantes."
      }
    ],
    "answer": "E"
  },
  {
    "id": "et-q7",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 7,
    "stem": "(2026) Os valores morais são construídos e transmitidos em contextos históricos e culturais específicos, influenciando concepções de justiça, responsabilidade, solidariedade e convivência. Entretanto, a diversidade cultural também pode provocar conflitos entre costumes e princípios éticos. Considerando a relação entre ética, moral e cultura, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Os valores morais são determinados exclusivamente por fatores biológicos, não sofrendo influência das relações sociais."
      },
      {
        "letter": "B",
        "text": "A diversidade cultural impede qualquer reflexão racional sobre normas e práticas sociais."
      },
      {
        "letter": "C",
        "text": "Os valores morais podem variar entre culturas e períodos históricos, mas suas diferenças não impedem a análise crítica de práticas à luz de princípios como dignidade humana e respeito aos direitos fundamentais."
      },
      {
        "letter": "D",
        "text": "Todos os costumes culturais são necessariamente idênticos e permanecem inalterados ao longo da história."
      },
      {
        "letter": "E",
        "text": "O reconhecimento da diversidade cultural exige aceitar qualquer prática como moralmente correta, independentemente de seus efeitos sobre outras pessoas."
      }
    ],
    "answer": "C"
  },
  {
    "id": "et-q8",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 8,
    "stem": "(2026) A convivência democrática pressupõe respeito à diversidade cultural, religiosa e social, sem eliminar a possibilidade de discutir criticamente comportamentos e normas. Em determinada comunidade, pessoas com diferentes tradições apresentam opiniões divergentes sobre a organização de um espaço coletivo. Considerando os fundamentos éticos dessa convivência, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O respeito à diversidade envolve reconhecer diferenças culturais, promover o diálogo e buscar soluções que preservem a dignidade e os direitos das pessoas envolvidas."
      },
      {
        "letter": "B",
        "text": "A existência de diferentes valores culturais impede a construção de regras comuns de convivência."
      },
      {
        "letter": "C",
        "text": "A convivência democrática exige que grupos minoritários abandonem integralmente suas tradições para adotar os costumes da maioria."
      },
      {
        "letter": "D",
        "text": "O reconhecimento das diferenças culturais dispensa a observância dos direitos fundamentais."
      },
      {
        "letter": "E",
        "text": "A resolução de divergências culturais deve ocorrer exclusivamente pela imposição da vontade do grupo social numericamente maior."
      }
    ],
    "answer": "A"
  },
  {
    "id": "et-q9",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 9,
    "stem": "(2026) Na reflexão filosófica, os juízos de fato, também chamados juízos de realidade, procuram descrever situações ou acontecimentos, enquanto os juízos de valor expressam avaliações fundamentadas em critérios morais, estéticos ou de outra natureza. Considerando essa distinção, analise as afirmações: I. A biblioteca da escola possui cinco mil livros. II. A leitura é uma das atividades mais importantes para a formação humana. III. A reunião teve início às oito horas. IV. É injusto impedir o acesso de determinadas pessoas a um serviço público sem justificativa legítima. Considerando a natureza dos juízos apresentados, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "As afirmações I e II constituem juízos de fato, enquanto III e IV constituem juízos de valor."
      },
      {
        "letter": "B",
        "text": "Todas as afirmações representam juízos de valor, pois foram formuladas por seres humanos."
      },
      {
        "letter": "C",
        "text": "As afirmações II e III constituem juízos de fato, enquanto I e IV constituem juízos de valor."
      },
      {
        "letter": "D",
        "text": "As afirmações I e III constituem juízos de fato, enquanto II e IV constituem juízos de valor."
      },
      {
        "letter": "E",
        "text": "Todas as afirmações constituem juízos de fato, pois podem ser expressas por meio de linguagem declarativa."
      }
    ],
    "answer": "D"
  },
  {
    "id": "et-q10",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 10,
    "stem": "(2026) A distinção entre juízos de fato e juízos de valor é importante para a análise de discursos e para a construção de argumentos consistentes. Em determinado debate, um participante afirma que a taxa de desemprego aumentou em certo período e, em seguida, sustenta que essa situação é socialmente inaceitável. Considerando a natureza dessas afirmações, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Ambas as afirmações constituem necessariamente juízos de fato, pois tratam de assunto econômico."
      },
      {
        "letter": "B",
        "text": "A primeira afirmação apresenta conteúdo descritivo passível de verificação empírica, enquanto a segunda expressa avaliação sobre a situação descrita."
      },
      {
        "letter": "C",
        "text": "A primeira afirmação representa exclusivamente juízo moral, enquanto a segunda corresponde a dado estatístico."
      },
      {
        "letter": "D",
        "text": "A distinção entre fatos e valores impede qualquer discussão racional sobre consequências sociais e decisões públicas."
      },
      {
        "letter": "E",
        "text": "Os juízos de valor possuem necessariamente a mesma forma de verificação empírica utilizada para apurar dados estatísticos."
      }
    ],
    "answer": "B"
  },
  {
    "id": "et-q11",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 11,
    "stem": "(2026) A ética e a cidadania encontram-se relacionadas à participação responsável na vida coletiva e ao reconhecimento de direitos e deveres. Em uma comunidade, moradores organizam reuniões para discutir melhorias nos serviços públicos e acompanhar a utilização dos recursos municipais. Considerando a dimensão ética da cidadania, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A cidadania limita-se exclusivamente ao exercício do voto, não abrangendo participação social ou acompanhamento das decisões públicas."
      },
      {
        "letter": "B",
        "text": "A participação cidadã deve ocorrer exclusivamente por meio de manifestações individuais, sendo incompatível com iniciativas coletivas."
      },
      {
        "letter": "C",
        "text": "A ética cidadã exige obediência incondicional a qualquer decisão estatal, independentemente de sua legalidade."
      },
      {
        "letter": "D",
        "text": "A cidadania pressupõe exclusivamente a reivindicação de direitos, dispensando responsabilidades relacionadas à convivência social."
      },
      {
        "letter": "E",
        "text": "O exercício da cidadania envolve participação na vida pública, reconhecimento de direitos e deveres, respeito às diferenças e compromisso com o interesse coletivo."
      }
    ],
    "answer": "E"
  },
  {
    "id": "et-q12",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 12,
    "stem": "(2026) O comportamento ético no serviço público está relacionado aos princípios da impessoalidade, da honestidade, da responsabilidade e da promoção do interesse coletivo. Um servidor identifica que determinado cidadão necessita de orientação sobre um procedimento administrativo, mas decide ignorar a solicitação porque possui divergências pessoais com o usuário. Considerando a relação entre ética e cidadania, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A atuação ética exige tratamento respeitoso e impessoal aos usuários, evitando discriminações e assegurando a prestação adequada de informações e serviços dentro das atribuições do cargo."
      },
      {
        "letter": "B",
        "text": "A existência de divergência pessoal autoriza o servidor a negar atendimento quando considerar que sua opinião deve prevalecer."
      },
      {
        "letter": "C",
        "text": "O interesse público corresponde exclusivamente à vontade individual dos agentes responsáveis pela execução dos serviços."
      },
      {
        "letter": "D",
        "text": "A ética administrativa permite tratamento desigual entre usuários quando não houver reclamação formal."
      },
      {
        "letter": "E",
        "text": "A cidadania não possui relação com a qualidade do atendimento prestado pelas instituições públicas."
      }
    ],
    "answer": "A"
  },
  {
    "id": "et-q13",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 13,
    "stem": "(2026) O racionalismo ético atribui importância à razão na orientação das escolhas e na avaliação das condutas humanas. Na tradição filosófica, diferentes autores desenvolveram reflexões sobre a relação entre conhecimento, racionalidade e vida moral. Considerando os fundamentos gerais do racionalismo ético, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O racionalismo ético sustenta que as decisões morais devem ser determinadas exclusivamente pelos impulsos e desejos imediatos."
      },
      {
        "letter": "B",
        "text": "A razão não possui qualquer participação na avaliação das ações humanas, sendo a moralidade resultado apenas do costume."
      },
      {
        "letter": "C",
        "text": "O racionalismo ético reconhece a importância da reflexão racional para avaliar princípios e orientar condutas, superando a dependência exclusiva de impulsos, interesses imediatos ou opiniões não examinadas."
      },
      {
        "letter": "D",
        "text": "O pensamento racionalista exige necessariamente que todas as pessoas apresentem comportamentos idênticos em qualquer circunstância."
      },
      {
        "letter": "E",
        "text": "O racionalismo ético considera impossível justificar racionalmente valores ou deveres morais."
      }
    ],
    "answer": "C"
  },
  {
    "id": "et-q14",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 14,
    "stem": "(2026) Na filosofia de Immanuel Kant, a moralidade está relacionada à racionalidade prática e à possibilidade de formular princípios de ação que possam valer universalmente. O filósofo diferencia a ação praticada por dever daquela orientada exclusivamente por interesses ou vantagens particulares. Considerando os fundamentos da ética kantiana, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Uma ação é moralmente correta exclusivamente quando produz benefícios financeiros imediatos para quem a realiza."
      },
      {
        "letter": "B",
        "text": "O valor moral de uma ação depende necessariamente da aprovação da maioria das pessoas envolvidas."
      },
      {
        "letter": "C",
        "text": "O dever moral deve ser abandonado sempre que seu cumprimento provocar algum inconveniente pessoal."
      },
      {
        "letter": "D",
        "text": "A moralidade exige considerar se a máxima que orienta a ação pode ser universalizada, tratando as pessoas como fins em si mesmas e não meramente como meios."
      },
      {
        "letter": "E",
        "text": "O imperativo categórico estabelece que as ações humanas devem ser guiadas exclusivamente pelos desejos e pelas emoções momentâneas."
      }
    ],
    "answer": "D"
  },
  {
    "id": "et-q15",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 15,
    "stem": "(2026) A reflexão sobre ética e liberdade envolve a capacidade humana de realizar escolhas e assumir responsabilidades por suas consequências. Em determinada situação, um indivíduo precisa decidir entre cumprir um compromisso assumido ou abandoná-lo para obter vantagem pessoal imediata. Considerando a relação filosófica entre liberdade e responsabilidade, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A liberdade moral consiste exclusivamente na ausência de qualquer regra social ou obrigação assumida."
      },
      {
        "letter": "B",
        "text": "O exercício da liberdade envolve capacidade de escolha e avaliação das consequências das ações, estando relacionado à responsabilidade pelas decisões tomadas."
      },
      {
        "letter": "C",
        "text": "A existência de deveres morais elimina integralmente a possibilidade de liberdade individual."
      },
      {
        "letter": "D",
        "text": "A liberdade determina que qualquer decisão seja moralmente legítima, independentemente de seus efeitos sobre outras pessoas."
      },
      {
        "letter": "E",
        "text": "A responsabilidade moral somente existe quando as escolhas são realizadas sem qualquer possibilidade de reflexão."
      }
    ],
    "answer": "B"
  },
  {
    "id": "et-q16",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 16,
    "stem": "(2026) A liberdade pode ser compreendida de diferentes maneiras na Filosofia, envolvendo aspectos individuais, sociais, políticos e morais. Em uma sociedade democrática, o exercício das liberdades individuais deve conviver com o reconhecimento dos direitos das demais pessoas. Considerando essa relação, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O exercício da liberdade individual pressupõe o direito irrestrito de prejudicar terceiros, desde que exista interesse pessoal na conduta."
      },
      {
        "letter": "B",
        "text": "A liberdade somente existe quando não há instituições públicas ou normas coletivas de convivência."
      },
      {
        "letter": "C",
        "text": "Os direitos individuais são incompatíveis com a existência de responsabilidades perante a sociedade."
      },
      {
        "letter": "D",
        "text": "A liberdade moral elimina a necessidade de considerar a dignidade e a autonomia das demais pessoas."
      },
      {
        "letter": "E",
        "text": "O exercício responsável da liberdade envolve reconhecer a autonomia individual e os limites decorrentes do respeito aos direitos, à dignidade e à liberdade das outras pessoas."
      }
    ],
    "answer": "E"
  },
  {
    "id": "et-q17",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 17,
    "stem": "(2026) A autonomia moral constitui conceito importante para compreender a relação entre racionalidade, liberdade e responsabilidade. Em determinada organização, um profissional recebe orientação para adotar comportamento que considera injusto e contrário às normas éticas da instituição. Considerando a autonomia moral e a consciência crítica, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A autonomia moral pressupõe a capacidade de avaliar racionalmente normas e decisões, reconhecendo deveres e assumindo responsabilidade pelas próprias escolhas, sem se limitar à obediência acrítica."
      },
      {
        "letter": "B",
        "text": "A autonomia moral determina que o indivíduo deve rejeitar todas as normas coletivas, independentemente de sua legitimidade."
      },
      {
        "letter": "C",
        "text": "A responsabilidade pelas escolhas desaparece quando a conduta é sugerida por pessoa hierarquicamente superior."
      },
      {
        "letter": "D",
        "text": "A consciência moral corresponde exclusivamente à repetição de comportamentos tradicionalmente praticados em determinada organização."
      },
      {
        "letter": "E",
        "text": "O exercício da autonomia é incompatível com o cumprimento de deveres e compromissos legítimos."
      }
    ],
    "answer": "A"
  },
  {
    "id": "et-q18",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 18,
    "stem": "(2026) A Filosofia contribui para o desenvolvimento do pensamento crítico ao estimular perguntas sobre a origem, os fundamentos e as consequências das ideias. Em determinado debate público, um participante apresenta argumento segundo o qual uma proposta deve ser aceita porque foi defendida por uma pessoa famosa. Considerando a análise filosófica dos argumentos, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O reconhecimento público de uma pessoa torna necessariamente verdadeiras todas as afirmações que ela apresenta."
      },
      {
        "letter": "B",
        "text": "A qualidade de um argumento depende exclusivamente da posição social de quem o formula."
      },
      {
        "letter": "C",
        "text": "A avaliação crítica exige examinar as razões e evidências apresentadas, não sendo suficiente aceitar uma afirmação apenas pelo prestígio ou pela autoridade de seu defensor."
      },
      {
        "letter": "D",
        "text": "A análise filosófica dispensa a identificação de premissas e conclusões, concentrando-se exclusivamente nas características pessoais dos debatedores."
      },
      {
        "letter": "E",
        "text": "Um argumento deve ser considerado válido sempre que provocar emoções intensas no público."
      }
    ],
    "answer": "C"
  },
  {
    "id": "et-q19",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 19,
    "stem": "(2026) A ética e a moral relacionam-se à organização da vida coletiva, mas também envolvem decisões individuais diante de situações concretas. Em determinada instituição, um servidor descobre que um procedimento administrativo beneficia injustificadamente alguns usuários em prejuízo de outros. Ao analisar o problema, ele considera os princípios de justiça, igualdade e impessoalidade. Considerando a relação entre valores morais, consciência crítica e cidadania, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A existência de benefício para determinado grupo torna a prática necessariamente justa, independentemente dos prejuízos impostos aos demais."
      },
      {
        "letter": "B",
        "text": "A avaliação ética deve considerar exclusivamente os interesses pessoais do servidor responsável pelo procedimento."
      },
      {
        "letter": "C",
        "text": "Os princípios de justiça e igualdade não possuem relação com o atendimento realizado por instituições públicas."
      },
      {
        "letter": "D",
        "text": "A reflexão ética permite avaliar criticamente procedimentos institucionais, considerando sua compatibilidade com valores de justiça, respeito à dignidade humana e responsabilidade perante a coletividade."
      },
      {
        "letter": "E",
        "text": "A consciência crítica deve ser utilizada exclusivamente para avaliar comportamentos individuais, sem alcançar práticas institucionais."
      }
    ],
    "answer": "D"
  },
  {
    "id": "et-q20",
    "subject": "Noções de Ética e Filosofia",
    "qnum": 20,
    "stem": "(2026) A Filosofia moral, a consciência crítica, a cidadania e a liberdade constituem dimensões relacionadas à formação de indivíduos capazes de participar responsavelmente da vida social. Em uma comunidade, pessoas com diferentes valores e opiniões precisam decidir coletivamente sobre o uso de determinado espaço público. Considerando os fundamentos filosóficos da convivência democrática, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A solução ética exige que os interesses individuais sejam sempre impostos à coletividade, independentemente das consequências."
      },
      {
        "letter": "B",
        "text": "A convivência democrática dispensa diálogo e argumentação, pois as decisões coletivas devem resultar exclusivamente da vontade da autoridade local."
      },
      {
        "letter": "C",
        "text": "O reconhecimento da diversidade cultural impede qualquer construção racional de critérios comuns de justiça."
      },
      {
        "letter": "D",
        "text": "A liberdade individual elimina a necessidade de respeitar direitos e deveres relacionados à vida em sociedade."
      },
      {
        "letter": "E",
        "text": "A construção de decisões éticas e democráticas pressupõe diálogo, reflexão racional, respeito à diversidade, reconhecimento dos direitos e responsabilidades e consideração das consequências das escolhas para a coletividade."
      }
    ],
    "answer": "E"
  },
  {
    "id": "ri-q1",
    "subject": "Relações Interpessoais",
    "qnum": 1,
    "stem": "(2026) As relações humanas no ambiente de trabalho influenciam diretamente a qualidade dos serviços prestados, o desempenho das equipes e a satisfação dos usuários. Em determinada repartição pública, servidores apresentam dificuldades para cooperar na execução de atividades que exigem participação conjunta. Considerando os princípios das relações interpessoais, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "As relações interpessoais devem ser baseadas exclusivamente no cumprimento das tarefas individuais, sendo desnecessária a cooperação entre os profissionais."
      },
      {
        "letter": "B",
        "text": "O desenvolvimento de boas relações humanas exige que todos os integrantes da equipe apresentem opiniões idênticas sobre os assuntos institucionais."
      },
      {
        "letter": "C",
        "text": "A qualidade das relações interpessoais depende exclusivamente das características pessoais dos servidores, não sendo influenciada pelo ambiente organizacional."
      },
      {
        "letter": "D",
        "text": "Relações interpessoais saudáveis envolvem respeito mútuo, cooperação, confiança e reconhecimento das diferenças individuais, contribuindo para o alcance dos objetivos institucionais."
      },
      {
        "letter": "E",
        "text": "A existência de divergências profissionais determina necessariamente a impossibilidade de estabelecer relações de trabalho produtivas."
      }
    ],
    "answer": "D"
  },
  {
    "id": "ri-q2",
    "subject": "Relações Interpessoais",
    "qnum": 2,
    "stem": "(2026) A comunicação interpessoal constitui processo fundamental para a troca de informações, a construção de entendimentos e o desenvolvimento das atividades profissionais. Durante uma reunião, determinado servidor transmite orientações de maneira excessivamente técnica, dificultando a compreensão dos colegas. Considerando os elementos da comunicação eficaz, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A comunicação eficaz depende exclusivamente da quantidade de informações transmitidas, independentemente de sua compreensão pelo receptor."
      },
      {
        "letter": "B",
        "text": "A comunicação interpessoal deve considerar a clareza da mensagem, as características do receptor, o contexto e a possibilidade de feedback, contribuindo para a compreensão mútua."
      },
      {
        "letter": "C",
        "text": "O uso de linguagem excessivamente complexa é obrigatório para demonstrar competência profissional em qualquer situação."
      },
      {
        "letter": "D",
        "text": "A comunicação ocorre adequadamente sempre que o emissor transmite a mensagem, ainda que o receptor não compreenda seu conteúdo."
      },
      {
        "letter": "E",
        "text": "O feedback deve ser evitado, pois representa interferência indevida na comunicação entre os profissionais."
      }
    ],
    "answer": "B"
  },
  {
    "id": "ri-q3",
    "subject": "Relações Interpessoais",
    "qnum": 3,
    "stem": "(2026) O bom atendimento ao público constitui elemento essencial da qualidade dos serviços prestados pelas instituições. Em determinado setor, um cidadão procura esclarecimentos sobre um procedimento administrativo e demonstra dificuldade para compreender as orientações recebidas. Considerando as características de um atendimento adequado, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O atendimento deve ser realizado com rapidez, ainda que as informações fornecidas sejam incompletas ou incorretas."
      },
      {
        "letter": "B",
        "text": "O servidor deve utilizar exclusivamente termos técnicos para demonstrar domínio dos procedimentos administrativos."
      },
      {
        "letter": "C",
        "text": "A qualidade do atendimento depende exclusivamente da solução imediata da demanda, sendo irrelevante a maneira como o usuário é tratado."
      },
      {
        "letter": "D",
        "text": "O atendimento deve priorizar pessoas conhecidas do servidor, independentemente da ordem e dos critérios institucionais."
      },
      {
        "letter": "E",
        "text": "Um bom atendimento envolve cordialidade, clareza, respeito, atenção às necessidades do usuário e prestação de informações corretas, observadas as normas institucionais."
      }
    ],
    "answer": "E"
  },
  {
    "id": "ri-q4",
    "subject": "Relações Interpessoais",
    "qnum": 4,
    "stem": "(2026) A postura profissional compreende atitudes e comportamentos relacionados à ética, à responsabilidade, ao respeito e ao compromisso com as atribuições do cargo. Em uma unidade administrativa, determinado servidor costuma divulgar comentários depreciativos sobre colegas e usuários, prejudicando o ambiente de trabalho. Considerando os princípios de postura profissional, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A postura profissional adequada exige comportamento ético, discrição, responsabilidade, respeito às pessoas e compromisso com a qualidade das atividades desempenhadas."
      },
      {
        "letter": "B",
        "text": "O comportamento profissional deve ser avaliado exclusivamente pela aparência pessoal, independentemente da conduta e do cumprimento das responsabilidades."
      },
      {
        "letter": "C",
        "text": "A divulgação de informações pessoais de colegas constitui prática legítima quando realizada em conversas informais durante o expediente."
      },
      {
        "letter": "D",
        "text": "O respeito aos usuários deve ocorrer exclusivamente quando estes apresentarem comportamento cordial e concordarem com as orientações recebidas."
      },
      {
        "letter": "E",
        "text": "A postura profissional dispensa o cumprimento de normas institucionais quando o servidor possui experiência suficiente na função."
      }
    ],
    "answer": "A"
  },
  {
    "id": "ri-q5",
    "subject": "Relações Interpessoais",
    "qnum": 5,
    "stem": "(2026) A integração entre os profissionais constitui fator relevante para o funcionamento das equipes e para a melhoria dos processos de trabalho. Em determinada instituição, servidores recém-admitidos apresentam dificuldades para compreender as rotinas e estabelecer vínculos com os colegas. Considerando as práticas de integração no ambiente organizacional, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A integração deve ocorrer exclusivamente por iniciativa individual dos novos servidores, sem participação da instituição ou da equipe."
      },
      {
        "letter": "B",
        "text": "O compartilhamento de informações deve ser evitado para preservar a competitividade entre os profissionais."
      },
      {
        "letter": "C",
        "text": "A integração pode ser favorecida pelo acolhimento, pela orientação sobre as rotinas, pelo compartilhamento de conhecimentos e pela cooperação entre profissionais experientes e recém-admitidos."
      },
      {
        "letter": "D",
        "text": "O processo de integração deve limitar-se à apresentação das instalações físicas, independentemente das atribuições e das relações profissionais."
      },
      {
        "letter": "E",
        "text": "A integração organizacional exige que os servidores abandonem suas características individuais e adotem comportamentos absolutamente idênticos."
      }
    ],
    "answer": "C"
  },
  {
    "id": "ri-q6",
    "subject": "Relações Interpessoais",
    "qnum": 6,
    "stem": "(2026) A empatia constitui habilidade importante para o desenvolvimento de relações humanas respeitosas e para a realização de atendimentos adequados. Durante o expediente, um usuário demonstra ansiedade por não conseguir solucionar uma demanda que considera urgente. Considerando a aplicação da empatia no atendimento, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A empatia exige que o servidor concorde com todas as solicitações do usuário, mesmo quando contrárias às normas institucionais."
      },
      {
        "letter": "B",
        "text": "O comportamento empático pressupõe a eliminação dos limites profissionais e a resolução de demandas independentemente da competência do setor."
      },
      {
        "letter": "C",
        "text": "A empatia deve ser utilizada exclusivamente em situações de sofrimento extremo, não sendo necessária nas relações cotidianas."
      },
      {
        "letter": "D",
        "text": "A empatia envolve procurar compreender a perspectiva e as necessidades do usuário, acolhendo suas preocupações com respeito, sem comprometer a observância das normas e dos limites profissionais."
      },
      {
        "letter": "E",
        "text": "A prática da empatia impede o servidor de fornecer respostas negativas, ainda que exista impossibilidade legal de atender à solicitação."
      }
    ],
    "answer": "D"
  },
  {
    "id": "ri-q7",
    "subject": "Relações Interpessoais",
    "qnum": 7,
    "stem": "(2026) A capacidade de ouvir constitui competência fundamental para a comunicação interpessoal e para a resolução de problemas. Durante uma reunião, um servidor interrompe frequentemente seus colegas e apresenta respostas antes de compreender integralmente as informações transmitidas. Considerando os princípios da escuta ativa, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A escuta ativa consiste exclusivamente em permanecer em silêncio, independentemente da compreensão da mensagem recebida."
      },
      {
        "letter": "B",
        "text": "A escuta ativa envolve atenção à mensagem, respeito ao interlocutor, formulação de perguntas pertinentes e confirmação do entendimento, evitando interrupções desnecessárias."
      },
      {
        "letter": "C",
        "text": "A capacidade de ouvir exige concordância integral com as opiniões apresentadas pelos demais participantes."
      },
      {
        "letter": "D",
        "text": "O profissional demonstra escuta eficiente quando antecipa a conclusão da fala do interlocutor, independentemente do conteúdo."
      },
      {
        "letter": "E",
        "text": "A escuta ativa deve ocorrer exclusivamente em reuniões formais, não sendo necessária no atendimento ao público."
      }
    ],
    "answer": "B"
  },
  {
    "id": "ri-q8",
    "subject": "Relações Interpessoais",
    "qnum": 8,
    "stem": "(2026) A argumentação flexível constitui habilidade relacionada à apresentação de ideias, à consideração de diferentes perspectivas e à adaptação da comunicação diante de novas informações. Durante uma discussão sobre a melhoria de um procedimento administrativo, dois servidores apresentam propostas distintas. Considerando a argumentação flexível, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A argumentação flexível exige a manutenção da opinião inicial, mesmo quando surgirem informações que demonstrem sua inadequação."
      },
      {
        "letter": "B",
        "text": "A defesa de uma proposta deve ocorrer exclusivamente por meio da autoridade hierárquica, sem necessidade de apresentar justificativas."
      },
      {
        "letter": "C",
        "text": "A argumentação flexível pressupõe evitar qualquer posicionamento, independentemente das evidências disponíveis."
      },
      {
        "letter": "D",
        "text": "O profissional deve modificar suas opiniões exclusivamente para agradar ao interlocutor, mesmo quando isso prejudicar o interesse institucional."
      },
      {
        "letter": "E",
        "text": "A argumentação flexível envolve apresentar justificativas coerentes, considerar diferentes perspectivas e rever posicionamentos quando surgirem informações relevantes, buscando soluções fundamentadas."
      }
    ],
    "answer": "E"
  },
  {
    "id": "ri-q9",
    "subject": "Relações Interpessoais",
    "qnum": 9,
    "stem": "(2026) As relações humanas podem ser afetadas por conflitos decorrentes de divergências de opiniões, dificuldades de comunicação e diferenças de expectativas. Em determinado setor, dois servidores discordam sobre a distribuição das atividades e passam a evitar o diálogo, comprometendo o desempenho da equipe. Considerando as práticas adequadas de gestão de conflitos, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Os conflitos devem ser tratados exclusivamente por meio da imposição da opinião do servidor mais antigo, independentemente dos argumentos apresentados."
      },
      {
        "letter": "B",
        "text": "A existência de divergências demonstra necessariamente ausência de profissionalismo e exige o afastamento permanente dos envolvidos."
      },
      {
        "letter": "C",
        "text": "A resolução construtiva de conflitos envolve diálogo respeitoso, identificação das causas da divergência, escuta das partes e busca de soluções compatíveis com os objetivos institucionais."
      },
      {
        "letter": "D",
        "text": "Os conflitos devem ser ignorados indefinidamente, pois tendem a desaparecer sem consequências para o ambiente de trabalho."
      },
      {
        "letter": "E",
        "text": "A melhor forma de resolver divergências consiste na exposição pública dos envolvidos, incentivando a competição entre eles."
      }
    ],
    "answer": "C"
  },
  {
    "id": "ri-q10",
    "subject": "Relações Interpessoais",
    "qnum": 10,
    "stem": "(2026) A comunicação interpessoal pode ocorrer por meios verbais e não verbais, sendo influenciada pelo tom de voz, pelas expressões faciais, pelos gestos e pela postura corporal. Durante um atendimento, determinado servidor afirma estar disposto a ajudar, mas mantém expressão de impaciência e interrompe constantemente o usuário. Considerando a coerência comunicacional, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A comunicação não verbal pode reforçar ou contradizer a mensagem verbal, sendo importante manter coerência entre palavras, expressões e atitudes profissionais."
      },
      {
        "letter": "B",
        "text": "A postura corporal não interfere na percepção da mensagem, pois a comunicação depende exclusivamente do conteúdo verbal."
      },
      {
        "letter": "C",
        "text": "O tom de voz elevado constitui requisito de autoridade e deve ser utilizado em todos os atendimentos."
      },
      {
        "letter": "D",
        "text": "As expressões faciais não possuem relação com a qualidade da comunicação interpessoal."
      },
      {
        "letter": "E",
        "text": "A comunicação verbal é sempre suficiente para assegurar confiança, independentemente do comportamento apresentado pelo emissor."
      }
    ],
    "answer": "A"
  },
  {
    "id": "ri-q11",
    "subject": "Relações Interpessoais",
    "qnum": 11,
    "stem": "(2026) A qualidade do atendimento ao público também depende da capacidade de identificar necessidades e encaminhar demandas de maneira eficiente. Em determinada repartição, um usuário apresenta solicitação que não pode ser solucionada pelo setor inicialmente procurado. Considerando a postura adequada do atendente, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor deve encerrar imediatamente o atendimento, informando apenas que a demanda não pertence à sua unidade."
      },
      {
        "letter": "B",
        "text": "O usuário deve ser orientado a procurar diferentes setores por conta própria, sem qualquer indicação sobre o procedimento adequado."
      },
      {
        "letter": "C",
        "text": "A impossibilidade de resolver a demanda autoriza o servidor a fornecer informações não verificadas para encerrar rapidamente o atendimento."
      },
      {
        "letter": "D",
        "text": "O servidor deve explicar, com clareza e cordialidade, os limites de atuação do setor e orientar o usuário sobre o encaminhamento apropriado, evitando informações incorretas ou promessas indevidas."
      },
      {
        "letter": "E",
        "text": "O atendimento adequado exige que o servidor assuma competências de outras unidades, mesmo sem autorização institucional."
      }
    ],
    "answer": "D"
  },
  {
    "id": "ri-q12",
    "subject": "Relações Interpessoais",
    "qnum": 12,
    "stem": "(2026) A postura profissional está relacionada à responsabilidade no cumprimento de horários, à organização das tarefas e ao compromisso com o interesse coletivo. Em determinada instituição, um servidor identifica que não conseguirá concluir uma atividade dentro do prazo estabelecido devido ao surgimento de uma dificuldade operacional. Considerando a conduta profissional adequada, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor deve omitir a dificuldade até o encerramento do prazo, independentemente dos prejuízos decorrentes."
      },
      {
        "letter": "B",
        "text": "O profissional deve comunicar a situação tempestivamente, apresentar as dificuldades identificadas e buscar alternativas viáveis para o cumprimento das responsabilidades."
      },
      {
        "letter": "C",
        "text": "O atraso deve ser atribuído automaticamente aos colegas, mesmo quando não houver relação com suas atividades."
      },
      {
        "letter": "D",
        "text": "A responsabilidade profissional permite abandonar tarefas sempre que surgirem obstáculos não previstos."
      },
      {
        "letter": "E",
        "text": "O cumprimento de prazos é irrelevante quando o servidor mantém boas relações pessoais com seus superiores."
      }
    ],
    "answer": "B"
  },
  {
    "id": "ri-q13",
    "subject": "Relações Interpessoais",
    "qnum": 13,
    "stem": "(2026) A integração organizacional exige o reconhecimento da importância das diferentes funções desempenhadas pelos profissionais. Em determinado órgão público, servidores de setores distintos precisam atuar conjuntamente para concluir um atendimento complexo. Entretanto, alguns integrantes da equipe consideram que suas atividades são mais importantes que as dos demais. Considerando os fundamentos do trabalho integrado, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A integração deve privilegiar exclusivamente o setor com maior número de servidores, independentemente das competências envolvidas."
      },
      {
        "letter": "B",
        "text": "A cooperação entre setores pode ser dispensada quando cada unidade possui atribuições definidas em regulamento."
      },
      {
        "letter": "C",
        "text": "A valorização exclusiva de determinadas funções favorece necessariamente a confiança e o comprometimento dos demais profissionais."
      },
      {
        "letter": "D",
        "text": "A integração exige a eliminação das responsabilidades individuais, tornando impossível identificar os responsáveis por cada atividade."
      },
      {
        "letter": "E",
        "text": "O trabalho integrado pressupõe reconhecimento da complementaridade das funções, cooperação, compartilhamento adequado de informações e respeito às responsabilidades de cada setor."
      }
    ],
    "answer": "E"
  },
  {
    "id": "ri-q14",
    "subject": "Relações Interpessoais",
    "qnum": 14,
    "stem": "(2026) A empatia e o atendimento humanizado são especialmente importantes em situações que envolvem pessoas com dificuldades de comunicação, limitações de mobilidade ou outras necessidades específicas. Um usuário com deficiência auditiva procura atendimento em determinado serviço público e demonstra dificuldade para compreender as orientações recebidas. Considerando as práticas de comunicação inclusiva, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O atendimento deve considerar as necessidades comunicacionais do usuário, utilizando recursos acessíveis e estratégias adequadas, sem pressupor incapacidade ou comprometer sua autonomia."
      },
      {
        "letter": "B",
        "text": "O servidor deve direcionar todas as informações exclusivamente ao acompanhante, mesmo quando o usuário puder participar diretamente da comunicação."
      },
      {
        "letter": "C",
        "text": "O atendimento inclusivo exige a aplicação de procedimentos idênticos para todas as pessoas, independentemente das barreiras existentes."
      },
      {
        "letter": "D",
        "text": "A deficiência auditiva determina necessariamente incapacidade de compreensão das informações administrativas."
      },
      {
        "letter": "E",
        "text": "A adaptação dos meios de comunicação deve ser evitada para não comprometer a padronização do atendimento."
      }
    ],
    "answer": "A"
  },
  {
    "id": "ri-q15",
    "subject": "Relações Interpessoais",
    "qnum": 15,
    "stem": "(2026) A escuta ativa e a comunicação eficiente contribuem para reduzir mal-entendidos e melhorar a precisão das informações transmitidas. Durante um atendimento, uma pessoa apresenta relato extenso e pouco organizado sobre determinada dificuldade administrativa. O servidor precisa compreender os fatos essenciais antes de orientar o encaminhamento. Considerando as técnicas adequadas de escuta, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor deve interromper a exposição logo no início, apresentando uma resposta padronizada sem verificar a demanda."
      },
      {
        "letter": "B",
        "text": "O profissional deve considerar exclusivamente as primeiras informações apresentadas, ignorando esclarecimentos posteriores."
      },
      {
        "letter": "C",
        "text": "A utilização de perguntas objetivas, a reformulação das informações essenciais e a confirmação do entendimento podem contribuir para identificar corretamente a demanda e orientar seu encaminhamento."
      },
      {
        "letter": "D",
        "text": "A escuta ativa impede a realização de perguntas durante o atendimento, ainda que existam dúvidas relevantes."
      },
      {
        "letter": "E",
        "text": "A melhor estratégia consiste em encerrar o atendimento quando o usuário apresentar dificuldades para organizar seu relato."
      }
    ],
    "answer": "C"
  },
  {
    "id": "ri-q16",
    "subject": "Relações Interpessoais",
    "qnum": 16,
    "stem": "(2026) A argumentação flexível não significa ausência de critérios ou concordância automática com todas as opiniões. Ela pressupõe capacidade de dialogar, avaliar informações e adaptar estratégias de comunicação sem comprometer os princípios éticos e institucionais. Em determinada reunião, um servidor recebe críticas fundamentadas sobre sua proposta de organização do atendimento. Considerando uma postura argumentativa adequada, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor deve rejeitar todas as críticas para preservar sua autoridade diante dos colegas."
      },
      {
        "letter": "B",
        "text": "A argumentação deve ser utilizada exclusivamente para demonstrar superioridade intelectual, independentemente da qualidade das propostas."
      },
      {
        "letter": "C",
        "text": "O profissional deve abandonar imediatamente sua proposta, mesmo quando as críticas não apresentarem fundamento."
      },
      {
        "letter": "D",
        "text": "O servidor deve ouvir os argumentos, avaliar as informações apresentadas e, quando necessário, ajustar sua proposta ou justificar tecnicamente a manutenção de determinados pontos."
      },
      {
        "letter": "E",
        "text": "A argumentação flexível exige que as decisões sejam tomadas exclusivamente por votação, sem análise das consequências práticas."
      }
    ],
    "answer": "D"
  },
  {
    "id": "ri-q17",
    "subject": "Relações Interpessoais",
    "qnum": 17,
    "stem": "(2026) A ética nas relações interpessoais também envolve o respeito à diversidade de opiniões, experiências, culturas e características individuais. Em determinado ambiente de trabalho, um servidor realiza comentários depreciativos sobre a origem regional de um colega, provocando constrangimento e prejudicando a convivência. Considerando os princípios de respeito e profissionalismo, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Os comentários são aceitáveis quando apresentados como brincadeira, independentemente dos efeitos produzidos sobre o colega."
      },
      {
        "letter": "B",
        "text": "O respeito à diversidade exige evitar comportamentos discriminatórios e constrangedores, promovendo relações profissionais fundamentadas na dignidade, na igualdade de tratamento e na convivência respeitosa."
      },
      {
        "letter": "C",
        "text": "A diversidade deve ser desconsiderada no ambiente de trabalho, pois as características pessoais não interferem nas relações humanas."
      },
      {
        "letter": "D",
        "text": "O servidor que se sentir constrangido deve obrigatoriamente abandonar suas atividades, sem possibilidade de buscar os canais institucionais pertinentes."
      },
      {
        "letter": "E",
        "text": "O comportamento discriminatório somente apresenta relevância quando ocorre diante de usuários externos."
      }
    ],
    "answer": "B"
  },
  {
    "id": "ri-q18",
    "subject": "Relações Interpessoais",
    "qnum": 18,
    "stem": "(2026) A comunicação interpessoal eficiente pressupõe não apenas a transmissão de informações, mas também a verificação de sua compreensão. Em determinada instituição, um servidor responsável pelo treinamento de novos profissionais percebe que parte da equipe executa incorretamente um procedimento, apesar de ter recebido orientação verbal. Considerando os princípios da comunicação e do feedback, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O treinamento deve ser encerrado imediatamente, pois a transmissão inicial das informações assegura necessariamente sua compreensão."
      },
      {
        "letter": "B",
        "text": "A dificuldade de execução demonstra obrigatoriamente falta de interesse dos servidores, dispensando a avaliação das orientações oferecidas."
      },
      {
        "letter": "C",
        "text": "O feedback deve restringir-se à indicação de erros, sem apresentar orientações para melhoria."
      },
      {
        "letter": "D",
        "text": "As informações devem ser repetidas exatamente da mesma forma, independentemente das dificuldades identificadas."
      },
      {
        "letter": "E",
        "text": "O responsável deve verificar a compreensão das orientações, utilizar exemplos ou demonstrações quando necessários e oferecer feedback específico e construtivo para apoiar a aprendizagem."
      }
    ],
    "answer": "E"
  },
  {
    "id": "ri-q19",
    "subject": "Relações Interpessoais",
    "qnum": 19,
    "stem": "(2026) O atendimento ao público exige equilíbrio emocional e postura profissional diante de situações de pressão, especialmente quando há grande demanda de usuários ou manifestações de insatisfação. Em determinado setor, um cidadão eleva o tom de voz após receber informação de que seu pedido depende de análise adicional. Considerando as práticas adequadas de atendimento, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor deve elevar o tom de voz na mesma intensidade para demonstrar autoridade e encerrar a discussão."
      },
      {
        "letter": "B",
        "text": "O profissional deve interromper definitivamente o atendimento diante de qualquer manifestação de insatisfação, sem avaliar as circunstâncias."
      },
      {
        "letter": "C",
        "text": "A cordialidade exige que o servidor concorde com todas as exigências do cidadão, ainda que sejam contrárias às normas institucionais."
      },
      {
        "letter": "D",
        "text": "O servidor deve manter a calma, ouvir a manifestação, explicar objetivamente os procedimentos e estabelecer limites respeitosos quando necessários, preservando a segurança e a dignidade dos envolvidos."
      },
      {
        "letter": "E",
        "text": "O atendimento deve ser conduzido com expressões irônicas para demonstrar que a insatisfação do usuário é inadequada."
      }
    ],
    "answer": "D"
  },
  {
    "id": "ri-q20",
    "subject": "Relações Interpessoais",
    "qnum": 20,
    "stem": "(2026) As competências relacionadas às relações humanas, à comunicação interpessoal, à empatia, à escuta ativa, à postura profissional e à argumentação flexível podem ser desenvolvidas de maneira integrada. Em uma instituição pública, a equipe pretende aperfeiçoar o atendimento e reduzir conflitos entre os servidores e os usuários. Considerando a articulação dessas competências, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A melhoria do atendimento exige que os servidores adotem respostas padronizadas em todas as situações, independentemente das necessidades apresentadas."
      },
      {
        "letter": "B",
        "text": "A eficiência institucional depende exclusivamente da rapidez na realização das tarefas, sendo secundários o respeito e a qualidade da comunicação."
      },
      {
        "letter": "C",
        "text": "O desenvolvimento de competências interpessoais envolve escuta ativa, comunicação clara, empatia, cooperação, postura ética e capacidade de adaptar argumentos e procedimentos às situações, respeitadas as normas institucionais."
      },
      {
        "letter": "D",
        "text": "A argumentação flexível e a empatia são incompatíveis com a observância de regras administrativas, pois exigem decisões exclusivamente pessoais."
      },
      {
        "letter": "E",
        "text": "A qualidade das relações humanas depende exclusivamente de ações individuais, não podendo ser favorecida por práticas de integração e aperfeiçoamento organizacional."
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q1",
    "subject": "Noções de Administração Pública",
    "qnum": 1,
    "stem": "SELECON - 2026 Órgãos ministeriais e entidades personificadas pertencem, respectivamente, à administração:",
    "options": [
      {
        "letter": "A",
        "text": "Fundacional e Autônoma"
      },
      {
        "letter": "B",
        "text": "Indireta e Direta"
      },
      {
        "letter": "C",
        "text": "Direta e Indireta"
      },
      {
        "letter": "D",
        "text": "Legislativa e Executiva"
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q2",
    "subject": "Noções de Administração Pública",
    "qnum": 2,
    "stem": "SELECON - 2026 A Prefeitura da Cidade de Gato Pardo resolveu criar, por lei específica, uma entidade jurídica de Direito Público, de natureza administrativa, para a realização de atividades de previdência de seus servidores, devendo operar como uma descentralização da Prefeitura e na forma estabelecida na lei instituidora e nos termos de seu regulamento. Essa entidade é do tipo:",
    "options": [
      {
        "letter": "A",
        "text": "autárquica"
      },
      {
        "letter": "B",
        "text": "paraestatal"
      },
      {
        "letter": "C",
        "text": "fundacional"
      },
      {
        "letter": "D",
        "text": "empresarial"
      }
    ],
    "answer": "A"
  },
  {
    "id": "adm-q3",
    "subject": "Noções de Administração Pública",
    "qnum": 3,
    "stem": "SELECON - 2026 O Secretário de Educação do Município resolveu transferir autoridade e responsabilidade de seu Gabinete para a Divisão de Educação Infantil e Ensino Fundamental, para a Divisão de Educação Especial e para a Divisão de Educação Continuada. Esse processo de descentralização é designado:",
    "options": [
      {
        "letter": "A",
        "text": "controle"
      },
      {
        "letter": "B",
        "text": "avocação"
      },
      {
        "letter": "C",
        "text": "delegação"
      },
      {
        "letter": "D",
        "text": "desconcentração"
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q4",
    "subject": "Noções de Administração Pública",
    "qnum": 4,
    "stem": "SELECON - 2026 Sobre a estrutura da Administração Pública direta e indireta, pode-se afirmar que:",
    "options": [
      {
        "letter": "A",
        "text": "os Ministérios são entidades da Administração Pública indireta, pois executam atividades típicas e de estrutura de Estado"
      },
      {
        "letter": "B",
        "text": "as Autarquias e fundações públicas integram a Administração direta, pois executam atividades típicas do Estado sob supervisão ministerial"
      },
      {
        "letter": "C",
        "text": "a Administração direta compreende exclusivamente os órgãos dotados de personalidade jurídica própria integrantes dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios"
      },
      {
        "letter": "D",
        "text": "a Administração indireta é composta por entidades dotadas de personalidade jurídica própria, criadas ou autorizadas por lei para desempenhar atividades administrativas de forma descentralizada"
      }
    ],
    "answer": "D"
  },
  {
    "id": "adm-q5",
    "subject": "Noções de Administração Pública",
    "qnum": 5,
    "stem": "SELECON - 2026 No âmbito do controle administrativo, a Administração Pública exerce a autotutela sobre seus próprios atos. Sobre esse tema, pode-se afirmar que o objetivo é de:",
    "options": [
      {
        "letter": "A",
        "text": "reexame"
      },
      {
        "letter": "B",
        "text": "controle judicial"
      },
      {
        "letter": "C",
        "text": "anulação por ilegalidade"
      },
      {
        "letter": "D",
        "text": "sustação parlamentar de ato normativo"
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q6",
    "subject": "Noções de Administração Pública",
    "qnum": 6,
    "stem": "SELECON - 2026 No que concerne ao controle judicial da Administração Pública, o Poder Judiciário pode intervir adequadamente no ato administrativo na hipótese de:",
    "options": [
      {
        "letter": "A",
        "text": "opção de obra"
      },
      {
        "letter": "B",
        "text": "discricionariedade"
      },
      {
        "letter": "C",
        "text": "desvio de finalidade administrativa"
      },
      {
        "letter": "D",
        "text": "conveniência política do administrador público"
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q7",
    "subject": "Noções de Administração Pública",
    "qnum": 7,
    "stem": "SELECON - 2026 No âmbito da Administração Pública, o controle parlamentar é exercido pelo Poder Legislativo com o objetivo de fiscalizar a atuação da Administração e assegurar a observância dos princípios constitucionais. Constitui exemplo de controle parlamentar o(a):",
    "options": [
      {
        "letter": "A",
        "text": "veto"
      },
      {
        "letter": "B",
        "text": "sustação de atos"
      },
      {
        "letter": "C",
        "text": "julgamento administrativo"
      },
      {
        "letter": "D",
        "text": "fiscalização jurisdicional dos contratos"
      }
    ],
    "answer": "B"
  },
  {
    "id": "adm-q8",
    "subject": "Noções de Administração Pública",
    "qnum": 8,
    "stem": "SELECON - 2026 No que se refere ao controle na Administração Pública, é possível afirmar que o controle:",
    "options": [
      {
        "letter": "A",
        "text": "externo é exercido exclusivamente pelos cidadãos, por meio de denúncias e representações"
      },
      {
        "letter": "B",
        "text": "administrativo somente pode ser exercido pelo Poder Judiciário, mediante provocação do interessado"
      },
      {
        "letter": "C",
        "text": "da Administração Pública limita-se à verificação da legalidade dos atos administrativos, não alcançando aspectos de eficiência e resultados"
      },
      {
        "letter": "D",
        "text": "interno é realizado por órgãos e entidades da própria Administração Pública, com a finalidade de fiscalizar e aperfeiçoar sua atuação"
      }
    ],
    "answer": "D"
  },
  {
    "id": "adm-q9",
    "subject": "Noções de Administração Pública",
    "qnum": 9,
    "stem": "SELECON - 2026 Durante a reestruturação da Secretaria Municipal de Saúde de Araçás (BA), a coordenação técnica de nutrição passou a integrar um setor administrativo específico dentro da própria Secretaria, com atribuições e competências definidas internamente. Considerando que a Secretaria Municipal de Saúde e os setores que a integram pertencem à mesma pessoa jurídica e estão sujeitos à relação de hierarquia, essa forma de organização administrativa caracteriza a:",
    "options": [
      {
        "letter": "A",
        "text": "delegação, que consiste na transferência do exercício de determinada competência a outro agente ou órgão, nos termos da lei"
      },
      {
        "letter": "B",
        "text": "desconcentração, que consiste na distribuição interna de competências entre órgãos de uma mesma pessoa jurídica"
      },
      {
        "letter": "C",
        "text": "descentralização, que consiste na transferência de competências para outra pessoa jurídica"
      },
      {
        "letter": "D",
        "text": "convalidação de atos, que consiste na correção de vício sanável de um ato administrativo"
      }
    ],
    "answer": "B"
  },
  {
    "id": "adm-q10",
    "subject": "Noções de Administração Pública",
    "qnum": 10,
    "stem": "SELECON - 2026 No contexto do serviço público municipal, a estrutura hierárquica estabelece relações de coordenação e de subordinação entre os órgãos e os seus agentes. De acordo com os princípios que regem a autoridade hierárquica na Administração Pública, o Assistente de Desenvolvimento Educacional deve cumprir as determinações de seus superiores quando estas se referirem a:",
    "options": [
      {
        "letter": "A",
        "text": "instruções normativas e ordens de serviço legais voltadas à organização das atividades e das rotinas do setor"
      },
      {
        "letter": "B",
        "text": "determinações de caráter estritamente pessoal, sem relação com as atribuições do cargo ou com o interesse público"
      },
      {
        "letter": "C",
        "text": "atos e ordens manifestamente ilegais ou incompatíveis com os princípios da Administração Pública"
      },
      {
        "letter": "D",
        "text": "solicitações informais de particulares destinadas à alteração de procedimentos ou de prazos estabelecidos em norma"
      }
    ],
    "answer": "A"
  },
  {
    "id": "adm-q11",
    "subject": "Noções de Administração Pública",
    "qnum": 11,
    "stem": "SELECON - 2026 Em uma unidade administrativa, um assistente administrativo analisou a ordem emitida pelo diretor do setor para interromper a tramitação de determinados processos considerados “pouco relevantes”, embora estivessem regularmente instruídos e dentro do prazo legal de análise. A justificativa apresentada foi a necessidade de concentrar esforços em demandas consideradas prioritárias pela chefia. Considerando os poderes e os deveres do administrador público, a conduta adequada exige observar o(a):",
    "options": [
      {
        "letter": "A",
        "text": "dever de agir conforme a competência legal, finalidade pública e indisponibilidade do interesse coletivo"
      },
      {
        "letter": "B",
        "text": "discricionariedade administrativa, que autoriza suspender processos conforme conveniência do gestor"
      },
      {
        "letter": "C",
        "text": "poder hierárquico absoluto, que permite reorganizar livremente qualquer atividade administrativa"
      },
      {
        "letter": "D",
        "text": "autonomia decisória do agente público, independentemente de critérios normativos"
      }
    ],
    "answer": "A"
  },
  {
    "id": "adm-q12",
    "subject": "Noções de Administração Pública",
    "qnum": 12,
    "stem": "SELECON - 2026 Em uma reunião administrativa, discutiu-se a diferença entre órgão público e entidade administrativa. Um servidor afirmou que ambos possuem personalidade jurídica própria, mas outro questionou essa conclusão. Conforme o direito administrativo federal, é correto afirmar que:",
    "options": [
      {
        "letter": "A",
        "text": "entidades administrativas não apresentam autonomia institucional"
      },
      {
        "letter": "B",
        "text": "órgãos públicos têm personalidade jurídica independente em qualquer situação"
      },
      {
        "letter": "C",
        "text": "órgãos e entidades possuem sempre a mesma estrutura jurídica administrativa"
      },
      {
        "letter": "D",
        "text": "entidades possuem personalidade jurídica própria e órgãos são centros de competência administrativa"
      }
    ],
    "answer": "D"
  },
  {
    "id": "adm-q13",
    "subject": "Noções de Administração Pública",
    "qnum": 13,
    "stem": "SELECON - 2026 Durante uma auditoria em uma unidade federal, um assistente administrativo recebeu documentos de um ente responsável pela execução descentralizada de determinada política pública. A análise demonstrou que a instituição possuía patrimônio próprio, capacidade para celebrar contratos e autonomia administrativa e financeira, mas estava submetida à supervisão ministerial quanto ao cumprimento de suas finalidades legais. Considerando a estrutura da Administração Federal, essa instituição é classificada como:",
    "options": [
      {
        "letter": "A",
        "text": "Entidade da Administração Indireta, criada por lei específica ou autorização legal, com personalidade jurídica própria e controle finalístico ministerial"
      },
      {
        "letter": "B",
        "text": "Unidade desconcentrada sem personalidade jurídica, criada para distribuir internamente competências do órgão central"
      },
      {
        "letter": "C",
        "text": "Órgão da Administração Direta, integrante da estrutura ministerial e sujeito à relação hierárquica administrativa"
      },
      {
        "letter": "D",
        "text": "Órgão autônomo integrante do Poder Executivo, com independência administrativa perante o ministério"
      }
    ],
    "answer": "A"
  },
  {
    "id": "adm-q14",
    "subject": "Noções de Administração Pública",
    "qnum": 14,
    "stem": "SELECON - 2026 Em uma repartição federal, foi recebido um processo referente ao planejamento nacional de infraestrutura logística, de transportes e de obras estruturantes. O assistente administrativo observou que o assunto não deveria ser encaminhado ao Ministério do Desenvolvimento Regional, pois a competência administrativa principal, nesse caso, está vinculada ao Ministério:",
    "options": [
      {
        "letter": "A",
        "text": "das Cidades"
      },
      {
        "letter": "B",
        "text": "da Integração"
      },
      {
        "letter": "C",
        "text": "dos Transportes"
      },
      {
        "letter": "D",
        "text": "do Planejamento"
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q15",
    "subject": "Noções de Administração Pública",
    "qnum": 15,
    "stem": "SELECON - 2026 Com relação à responsabilidade civil do Estado, à aplicação da responsabilidade objetiva e ao direito de regresso no ordenamento jurídico brasileiro, verifica-se que o(a):",
    "options": [
      {
        "letter": "A",
        "text": "direito de regresso prescreve em dois anos"
      },
      {
        "letter": "B",
        "text": "ação de regresso prescinde da comprovação de culpa do agente"
      },
      {
        "letter": "C",
        "text": "responsabilidade regressiva do agente público transmite-se aos herdeiros até o limite da herança"
      },
      {
        "letter": "D",
        "text": "terceiro lesado pode ajuizar a ação indenizatória diretamente contra o servidor, conforme já decidido pelo STF"
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q16",
    "subject": "Noções de Administração Pública",
    "qnum": 16,
    "stem": "SELECON - 2026 No que concerne aos elementos de formação do ato administrativo e ao instituto da convalidação, evidencia-se que o(a):",
    "options": [
      {
        "letter": "A",
        "text": "motivo do ato é o seu resultado prático final"
      },
      {
        "letter": "B",
        "text": "vício de finalidade admite convalidação administrativa"
      },
      {
        "letter": "C",
        "text": "ato com vício insanável de forma deve ser convalidado pela lei"
      },
      {
        "letter": "D",
        "text": "competência em razão da matéria é considerada um elemento inderrogável"
      }
    ],
    "answer": "D"
  },
  {
    "id": "adm-q17",
    "subject": "Noções de Administração Pública",
    "qnum": 17,
    "stem": "SELECON - 2026 Em relação à extinção, à invalidação e à revogação dos atos administrativos, bem como aos seus respectivos efeitos no tempo e limites legais, pode-se afirmar que o(a):",
    "options": [
      {
        "letter": "A",
        "text": "ato administrativo nulo gera efeitos ex nunc"
      },
      {
        "letter": "B",
        "text": "revogação de um ato opera efeitos retroativos automáticos"
      },
      {
        "letter": "C",
        "text": "direito da Administração de anular atos favoráveis prescreve em dois anos"
      },
      {
        "letter": "D",
        "text": "invalidação de ato ilegal resguarda os efeitos já produzidos perante terceiros de boa-fé"
      }
    ],
    "answer": "D"
  },
  {
    "id": "adm-q18",
    "subject": "Noções de Administração Pública",
    "qnum": 18,
    "stem": "SELECON - 2026 No exercício de suas atribuições, o técnico almoxarife identifica que uma prática informal consolidada no setor é tolerada pela chefia ao longo dos anos, permitindo o atendimento prioritário de determinadas unidades sem respaldo normativo. Embora não haja registro de prejuízo financeiro direto, a prática compromete a impessoalidade e a transparência administrativa. Considerando os deveres funcionais, a ética pública e o exercício da cidadania no serviço público, a conduta correta é:",
    "options": [
      {
        "letter": "A",
        "text": "adequar-se à prática praticada no almoxarifado, pois o costume administrativo supre a ausência de norma"
      },
      {
        "letter": "B",
        "text": "manter a prática enquanto não houver determinação formal contrária, pois não há registro de prejuízo financeiro"
      },
      {
        "letter": "C",
        "text": "recusar-se a adotar a prática, pautando sua atuação nos princípios constitucionais"
      },
      {
        "letter": "D",
        "text": "denunciar publicamente a prática sem seguir os canais institucionais"
      }
    ],
    "answer": "C"
  },
  {
    "id": "adm-q19",
    "subject": "Noções de Administração Pública",
    "qnum": 19,
    "stem": "SELECON - 2026 Durante atendimento interno, o técnico almoxarife foi pressionado por servidor hierarquicamente superior a priorizar requisição irregular, em detrimento de outras demandas legalmente protocoladas. O superior afirmou que “ordem não se discute”. Conforme as diretrizes dos direitos, deveres e da ética no serviço público, o técnico deveria:",
    "options": [
      {
        "letter": "A",
        "text": "cumprir a ordem, independentemente da legalidade"
      },
      {
        "letter": "B",
        "text": "recusar de forma ríspida e tornar pública a ordem recebida"
      },
      {
        "letter": "C",
        "text": "cumprir parcialmente a ordem, pois trata-se de ordem superior"
      },
      {
        "letter": "D",
        "text": "recusar fundamentadamente a ordem recebida e registrar o ocorrido"
      }
    ],
    "answer": "D"
  },
  {
    "id": "adm-q20",
    "subject": "Noções de Administração Pública",
    "qnum": 20,
    "stem": "SELECON - 2026 Durante o atendimento presencial no almoxarifado, o técnico recebe uma requisição de material encaminhada de urgência por setor interno estratégico. Ao analisar o documento, identifica inconsistências formais. Considerando os princípios do atendimento ao público interno, da legalidade administrativa, do controle documental e da responsabilidade funcional, a conduta mais adequada do técnico almoxarife nessa situação é a de:",
    "options": [
      {
        "letter": "A",
        "text": "atender a requisição excepcionalmente, priorizando a urgência do setor"
      },
      {
        "letter": "B",
        "text": "recusar o atendimento, devolvendo o documento sem orientações adicionais"
      },
      {
        "letter": "C",
        "text": "solicitar correção formal da requisição e registrar o atendimento conforme as normas"
      },
      {
        "letter": "D",
        "text": "corrigir informalmente as inconsistências identificadas e prosseguir com o atendimento para evitar atrasos"
      }
    ],
    "answer": "C"
  },
  {
    "id": "ti-q1",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 1,
    "stem": "SELECON - 2026 Existe um ciclo de vida em que uma fase termina antes de que a próxima comece, isto é, cada fase é executada apenas uma vez, concentrando-se em um tipo específico de trabalho. Esse ciclo de vida se enquadra em uma abordagem de desenvolvimento de tipo:",
    "options": [
      {
        "letter": "A",
        "text": "híbrida"
      },
      {
        "letter": "B",
        "text": "preditiva"
      },
      {
        "letter": "C",
        "text": "adaptativa"
      },
      {
        "letter": "D",
        "text": "incremental"
      }
    ],
    "answer": "B"
  },
  {
    "id": "ti-q2",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 2,
    "stem": "SELECON - 2026 O comando vi, no Linux, é um editor de textos ASCII poderoso e muito usado na interface de caracteres do Linux para edição de arquivos e programas. Seu uso não é muito intuitivo à primeira vista, mas a edição simples de textos pode ser feita usando poucos comandos. Para as ações “salvar arquivo”, “aplicar alinhamento à esquerda” e “localizar texto à frente” são utilizados, respectivamente, os seguintes comandos:",
    "options": [
      {
        "letter": "A",
        "text": ":w, :le e /texto"
      },
      {
        "letter": "B",
        "text": ":s, :es e ?texto"
      },
      {
        "letter": "C",
        "text": ":b, :ae e #texto"
      },
      {
        "letter": "D",
        "text": ":z, :eq e &texto"
      }
    ],
    "answer": "A"
  },
  {
    "id": "ti-q3",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 3,
    "stem": "SELECON - 2026 No que diz respeito aos procedimentos de segurança da informação a serem seguidos por peritos em assuntos relacionados à internet, há situações em que é necessária a análise de determinado endereço IP ou nome de domínio, tais como em cabeçalhos de e-mail ou registros de eventos (logs) de acesso em servidores de rede. Para auxiliar nessa atividade, pode ser utilizado um utilitário TCP/IP, que permite descobrir o caminho executado pelos pacotes desde a sua origem até o seu destino, sendo utilizado em testes, medidas e gerenciamento da rede. Uma outra funcionalidade dessa ferramenta está no fato de ela poder ser usada para detectar falhas como gateways intermediários que descartam pacotes ou rotas que excedem a capacidade de um datagrama IP. Esse utilitário é conhecido como:",
    "options": [
      {
        "letter": "A",
        "text": "wireshark"
      },
      {
        "letter": "B",
        "text": "traceroute"
      },
      {
        "letter": "C",
        "text": "nslookup"
      },
      {
        "letter": "D",
        "text": "ipconfig"
      }
    ],
    "answer": "B"
  },
  {
    "id": "ti-q4",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 4,
    "stem": "SELECON - 2026 Uma empresa de TI passará a atuar de acordo com a norma ISO 27001. Para isso, a empresa está trabalhando na cláusula que trata de exigir que a organização crie uma consciência efetiva sobre segurança de informação, trabalhando para que os funcionários possam compreender seu papel na manutenção da segurança de TI, proporcionando, também, treinamentos e capacitação. Essa cláusula da ISO 27001 é a de:",
    "options": [
      {
        "letter": "A",
        "text": "direção"
      },
      {
        "letter": "B",
        "text": "suporte"
      },
      {
        "letter": "C",
        "text": "avaliação"
      },
      {
        "letter": "D",
        "text": "planejamento"
      }
    ],
    "answer": "B"
  },
  {
    "id": "ti-q5",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 5,
    "stem": "SELECON - 2026 Uma empresa de desenvolvimento de software está seguindo as orientações do CMMI para implantar a capacidade de maturidade de seus processos de software. No momento, a empresa encontra-se no nível do CMMI em que os projetos têm seus requisitos gerenciados, com planejamento, medição e controle dos diferentes processos existentes. Esse nível do CMMI é o:",
    "options": [
      {
        "letter": "A",
        "text": "1"
      },
      {
        "letter": "B",
        "text": "2"
      },
      {
        "letter": "C",
        "text": "3"
      },
      {
        "letter": "D",
        "text": "4"
      }
    ],
    "answer": "B"
  },
  {
    "id": "ti-q6",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 6,
    "stem": "SELECON - 2026 Uma tradicional empresa de software house está no processo de implantação do MPS-BR, como metodologia de desenvolvimento de seus aplicativos. No momento, ela encontra-se no nível de maturidade D. De acordo com o MPS-BR, isso significa que a empresa está:",
    "options": [
      {
        "letter": "A",
        "text": "se preocupando com questões como inovação e análise de causas"
      },
      {
        "letter": "B",
        "text": "avaliando o desempenho dos processos, assim como medindo a gerência de forma quantitativa"
      },
      {
        "letter": "C",
        "text": "no envolvimento de verificações, validações, além da liberação, instalação e integração de produtos"
      },
      {
        "letter": "D",
        "text": "introduzindo os controles de medição, configuração, aquisição e garantia da qualidade dos processos"
      }
    ],
    "answer": "C"
  },
  {
    "id": "ti-q7",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 7,
    "stem": "SELECON - 2025 No que concerne ao projeto de desenvolvimento de sistemas de software, o ciclo de vida constitui a estrutura contendo processos, atividades e tarefas, desde a definição dos requisitos até o término de uso. Cabe destacar que o modelo de ciclo de vida é a primeira escolha a ser feita no processo de software, partindo-se da maneira mais adequada de obter as necessidades do cliente, até quando e como o cliente receberá a primeira versão operacional do sistema. Entre os tipos de ciclos de vida, em um as atividades principais englobam a análise e a definição de requisitos, o projeto, a implementação, os testes e, finalmente, a integração. Esse modelo possui o grande mérito de ter sido o primeiro a impor o planejamento e o gerenciamento ao processo de software, que antes era casual, envolvendo uma sequência das fases em que cada uma só começa quando a anterior termina. Nesse ciclo de vida, é dada muita ênfase às fases de análise e de projeto antes de partir para a programação, a fim de que o objetivo do software esteja bem definido e que sejam evitados retrabalhos. Esse ciclo de vida é conhecido como:",
    "options": [
      {
        "letter": "A",
        "text": "em V ou incremental"
      },
      {
        "letter": "B",
        "text": "em protótipos ou ágil"
      },
      {
        "letter": "C",
        "text": "em espiral ou iterativo"
      },
      {
        "letter": "D",
        "text": "em cascata ou clássico"
      }
    ],
    "answer": "D"
  },
  {
    "id": "ti-q8",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 8,
    "stem": "SELECON - 2025 O MPS-BR representa uma metodologia direcionada à melhoria do processo do software brasileiro, voltada à área de desenvolvimento de sistemas e criada por organizações ligadas ao desenvolvimento de software. A figura mostra os diferentes níveis de maturidade estabelecidos para o MPS-BR. Enquanto em um desses níveis ocorre o gerenciamento de riscos, outro envolve a verificação, a validação, além da liberação, instalação e integração de produtos, dentre outras atividades. Esses dois níveis são, respectivamente:",
    "options": [
      {
        "letter": "A",
        "text": "A – Em otimização e F – Gerenciado"
      },
      {
        "letter": "B",
        "text": "C – Definido e D – Largamente Definido"
      },
      {
        "letter": "C",
        "text": "A – Em otimização e E – Parcialmente Definido"
      },
      {
        "letter": "D",
        "text": "C – Definido e B – Gerenciado quantitativamente"
      }
    ],
    "answer": "B"
  },
  {
    "id": "ti-q9",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 9,
    "stem": "SELECON - 2025 De forma similar ao aplicativo Explorador de Arquivos no sistema operacional Windows 10 BR, as distribuições Linux suportam gerenciadores de pastas e arquivos com a mesma finalidade. Dois exemplos desses gerenciadores no Linux são:",
    "options": [
      {
        "letter": "A",
        "text": "Nautilus e Dolphin"
      },
      {
        "letter": "B",
        "text": "Gnome e Ubuntu"
      },
      {
        "letter": "C",
        "text": "Fedora e Debian"
      },
      {
        "letter": "D",
        "text": "Kernel e Ubuntu"
      }
    ],
    "answer": "A"
  },
  {
    "id": "ti-q10",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 10,
    "stem": "SELECON - 2024 Uma empresa está escolhendo o Sistema Operacional para os seus computadores de rede. Foi examinado o MS Windows, na versão atual, pois esse sistema operacional suporta uma ampla variedade de hardwares e softwares, sendo ideal para diferentes necessidades e requisitos; e também porque usuários podem instalar uma variedade de aplicativos e programas, desde jogos até softwares de produtividade. Observou-se também que o MS Windows é aderente a uma vasta gama de periféricos, significando que os usuários podem conectar esses dispositivos ao seu computador e utilizá-los sem problemas. Essas características do MS Windows são identificadas como sendo de:",
    "options": [
      {
        "letter": "A",
        "text": "segurança"
      },
      {
        "letter": "B",
        "text": "integração"
      },
      {
        "letter": "C",
        "text": "amigabilidade"
      },
      {
        "letter": "D",
        "text": "personalização"
      },
      {
        "letter": "E",
        "text": "compatibilidade"
      }
    ],
    "answer": "E"
  },
  {
    "id": "ti-q11",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 11,
    "stem": "SELECON - 2024 Um administrador de rede de computadores instalou um serviço de transferência de arquivos baseado em um protocolo de transferência de arquivos seguro que utiliza o protocolo SSH (Secure Shell) para criptografar e proteger a comunicação entre cliente e servidor. O protocolo por meio do qual esse serviço foi montado é o:",
    "options": [
      {
        "letter": "A",
        "text": "FTP"
      },
      {
        "letter": "B",
        "text": "RTP"
      },
      {
        "letter": "C",
        "text": "SFTP"
      },
      {
        "letter": "D",
        "text": "TFTP"
      },
      {
        "letter": "E",
        "text": "Telnet"
      }
    ],
    "answer": "C"
  },
  {
    "id": "ti-q12",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 12,
    "stem": "SELECON - 2024 Um usuário de computador, ao investigar o conteúdo de sua máquina, constatou que nela existe um vírus do tipo Keylogger. Isso significa que:",
    "options": [
      {
        "letter": "A",
        "text": "um invasor externo vai poder sobrecarregar a máquina do usuário, fazendo-a travar ou ser impossível de operar por um tempo longo"
      },
      {
        "letter": "B",
        "text": "o tráfego de acesso à internet por meio dessa máquina vai ser manipulado, de modo que o usuário irá a um site falso, que vai roubar seus dados"
      },
      {
        "letter": "C",
        "text": "um invasor externo irá utilizar a camada 4 do TCP/IP para sobrecarregar o processador da máquina desse usuário, até a máquina ficar inutilizada e precisar ser trocada"
      },
      {
        "letter": "D",
        "text": "tudo o que está sendo digitado na máquina desse usuário vai ser registrado em um arquivo, que será utilizado por uma pessoa maliciosa para ver senhas e textos importantes deste usuário"
      },
      {
        "letter": "E",
        "text": "um hacker vai poder utilizar uma rota escondida, burlando o sistema de segurança do computador, de modo a invadir discretamente a máquina do usuário para roubar arquivos e dados"
      }
    ],
    "answer": "D"
  },
  {
    "id": "ti-q13",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 13,
    "stem": "SELECON - 2024 Vírus de computador é um programa ou parte de um programa de computador, normalmente malicioso, que se propaga inserindo cópias de si mesmo e se tornando parte de outros programas e arquivos. Nesse sentido, trojan é um programa que, além de executar as funções para as quais foi aparentemente projetado, também executa outras funções, normalmente maliciosas, e sem o conhecimento do usuário. Há diferentes tipos de trojans, classificados de acordo com as ações maliciosas que costumam executar ao infectar um computador. Um desses tipos redireciona a navegação do usuário para sites específicos, com o objetivo de aumentar a quantidade de acessos a estes sites ou apresentar propagandas. Esse tipo é conhecido como trojan:",
    "options": [
      {
        "letter": "A",
        "text": "Proxy"
      },
      {
        "letter": "B",
        "text": "Clicker"
      },
      {
        "letter": "C",
        "text": "Dropper"
      },
      {
        "letter": "D",
        "text": "Backdoor"
      }
    ],
    "answer": "B"
  },
  {
    "id": "ti-q14",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 14,
    "stem": "SELECON - 2026 A Lei n.º 14.133/2021 prevê diferentes critérios de julgamento para a seleção da proposta mais vantajosa à Administração Pública. Entre eles, destaca-se o critério de técnica e preço, aplicável a determinadas contratações em que a avaliação qualitativa da proposta possui relevância para o atendimento do interesse público. Nos termos da Lei n.º 14.133/2021, o julgamento por técnica e preço considera o(a):",
    "options": [
      {
        "letter": "A",
        "text": "menor preço global ofertado"
      },
      {
        "letter": "B",
        "text": "nota técnica da proposta apenas"
      },
      {
        "letter": "C",
        "text": "maior pontuação obtida pela ponderação das notas de técnica e de preço da proposta"
      },
      {
        "letter": "D",
        "text": "proposta economicamente mais vantajosa, defi nida exclusivamente pelo menor dispêndio para a Administração, independentemente da avaliação técnica"
      }
    ],
    "answer": "C"
  },
  {
    "id": "ti-q15",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 15,
    "stem": "SELECON - 2026 De acordo com a Lei Federal n.º 14.133/2021, no caso de dispensa de licitação cuja contratação possa acarretar comprometimento da segurança nacional, o prazo de contrato poderá ser de até:",
    "options": [
      {
        "letter": "A",
        "text": "2 anos"
      },
      {
        "letter": "B",
        "text": "5 anos"
      },
      {
        "letter": "C",
        "text": "8 anos"
      },
      {
        "letter": "D",
        "text": "10 anos"
      }
    ],
    "answer": "D"
  },
  {
    "id": "ti-q16",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 16,
    "stem": "SELECON - 2026 De acordo com a Lei n.º 12.527/2011 (Lei de Acesso à Informação), um pedido de acesso dirigido a órgão público deve conter a identifi cação do requerente e a especifi cação da informação solicitada. Quanto à justifi cativa do pedido, a Lei:",
    "options": [
      {
        "letter": "A",
        "text": "veda a exigência dos motivos determinantes da solicitação"
      },
      {
        "letter": "B",
        "text": "exige exposição detalhada do interesse particular do requerente"
      },
      {
        "letter": "C",
        "text": "exige autorização prévia da autoridade máxima do órgão"
      },
      {
        "letter": "D",
        "text": "dispensa a identifi cação do requerente em qualquer hipótese"
      }
    ],
    "answer": "A"
  },
  {
    "id": "ti-q17",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 17,
    "stem": "SELECON - 2026 A Lei n.º 12.527/2011 tem por finalidade precípua a regulamentação do direito constitucionalmente garantido de acesso às informações públicas. No que diz respeito a essa lei, pode-se afirmar que a decisão denegatória de acesso a informações por órgãos e entidades do poder público:",
    "options": [
      {
        "letter": "A",
        "text": "é irrecorrível"
      },
      {
        "letter": "B",
        "text": "não autoriza o requerente a obter seu inteiro teor por certidão ou cópia"
      },
      {
        "letter": "C",
        "text": "pode ensejar a interposição de recurso contra a decisão no prazo de 15 dias a contar da sua ciência"
      },
      {
        "letter": "D",
        "text": "pode motivar a interposição de recurso que será dirigido à autoridade hierarquicamente superior à que exarou a decisão impugnada, devendo esta se manifestar no prazo de 5 dias"
      },
      {
        "letter": "E",
        "text": "pode levar o requerente a recorrer à Controladoria-Geral da União, caso a negativa advenha de órgãos ou entidades do Poder Executivo Federal, que deliberará no prazo de 10 dias se o acesso à informação não classificada como sigilosa for negado"
      }
    ],
    "answer": "A"
  },
  {
    "id": "ti-q18",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 18,
    "stem": "SELECON - 2026 Um órgão público precisou tratar de dados pessoais sensíveis, mas teve que fazê-lo sem o fornecimento do consentimento do titular. Uma hipótese que validaria essa ação, segundo a lei 13.709/2018 e atualizações (LGPD), é a de:",
    "options": [
      {
        "letter": "A",
        "text": "confirmação da existência de tratamento"
      },
      {
        "letter": "B",
        "text": "informações acerca do uso compartilhado de dados pelo controlador e a finalidade"
      },
      {
        "letter": "C",
        "text": "se houver mudanças ou alterações da finalidade para o tratamento de dados pessoais sensíveis"
      },
      {
        "letter": "D",
        "text": "realização de estudos por órgão de pesquisa, garantindo a anonimização dos dados pessoais sensíveis"
      }
    ],
    "answer": "D"
  },
  {
    "id": "ti-q19",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 19,
    "stem": "SELECON - 2026 A Lei nº 13.709/2018 (LGPD) aplica-se a qualquer operação de tratamento, incluindo fins:",
    "options": [
      {
        "letter": "A",
        "text": "exclusivos de segurança pública, atividades de investigação, repressão de infrações penais e defesa nacional"
      },
      {
        "letter": "B",
        "text": "de oferta de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional"
      },
      {
        "letter": "C",
        "text": "exclusivamente jornalísticos e artísticos"
      },
      {
        "letter": "D",
        "text": "exclusivamente acadêmicos"
      }
    ],
    "answer": "B"
  },
  {
    "id": "ti-q20",
    "subject": "Conhecimentos Específicos — Analista TI",
    "qnum": 20,
    "stem": "SELECON - 2025 Em computação, um tipo de sistema de gerenciamento de dados é projetado para ativar e fornecer suporte às atividades de Business Intelligence (BI), especialmente a análise avançada, visando a realizar consultas e análises, geralmente contendo grandes quantidades de dados históricos. Esses dados geralmente são derivados de uma ampla variedade de fontes, como arquivos de log de aplicativos e aplicativos de transações. Resumindo, é um recurso que centraliza e consolida grandes quantidades de dados de várias fontes, possibilitando que as organizações obtenham informações de negócios úteis de seus dados para melhorar a tomada de decisões. Com o tempo, cria-se um registro histórico, que pode ser inestimável para cientistas de dados e analistas de negócios. Devido a esses recursos, pode ser considerado como a “única fonte confiável” de uma organização. Esse tipo de gerenciamento de dados é conhecido como Data:",
    "options": [
      {
        "letter": "A",
        "text": "Smart"
      },
      {
        "letter": "B",
        "text": "Mining"
      },
      {
        "letter": "C",
        "text": "Business"
      },
      {
        "letter": "D",
        "text": "Warehouse"
      }
    ],
    "answer": "D"
  },
  {
    "id": "hg-q1",
    "subject": "História e Geografia de MT",
    "qnum": 1,
    "stem": "(2026) A ocupação colonial do território que atualmente corresponde a Mato Grosso esteve relacionada às expedições bandeirantes, à exploração mineral e à incorporação de áreas interiores aos domínios portugueses. Essas iniciativas provocaram transformações econômicas, territoriais e sociais, afetando especialmente as populações indígenas. Considerando a atuação dos bandeirantes e o processo de ocupação colonial, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "As expedições bandeirantes tinham finalidade exclusivamente religiosa, sendo proibida a exploração de riquezas minerais e a captura de indígenas."
      },
      {
        "letter": "B",
        "text": "A atuação bandeirante envolveu a busca por metais preciosos e a captura de indígenas para escravização, contribuindo para a expansão da ocupação portuguesa e para conflitos com as populações originárias."
      },
      {
        "letter": "C",
        "text": "A exploração do ouro começou apenas após a Independência do Brasil, não apresentando relação com a formação dos núcleos coloniais mato-grossenses."
      },
      {
        "letter": "D",
        "text": "A presença dos bandeirantes assegurou a preservação integral dos territórios indígenas, sem deslocamentos populacionais ou conflitos."
      },
      {
        "letter": "E",
        "text": "A colonização portuguesa concentrou-se exclusivamente no litoral, não alcançando as regiões dos rios Cuiabá e Guaporé durante o período colonial."
      }
    ],
    "answer": "B"
  },
  {
    "id": "hg-q2",
    "subject": "História e Geografia de MT",
    "qnum": 2,
    "stem": "(2026) A fundação de Cuiabá está associada às descobertas auríferas e à presença de bandeirantes paulistas na região no início do século XVIII. A consolidação do núcleo populacional também provocou tensões relacionadas à arrecadação de tributos, à distribuição do poder e à atuação das autoridades coloniais. Considerando esse processo histórico, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Cuiabá foi fundada em 1889, após a Proclamação da República, com a finalidade de substituir Vila Bela como capital estadual."
      },
      {
        "letter": "B",
        "text": "A fundação de Cuiabá ocorreu exclusivamente por iniciativa espanhola, sem participação de expedições originárias de São Paulo."
      },
      {
        "letter": "C",
        "text": "A administração colonial dispensou a cobrança de tributos sobre o ouro, favorecendo a autonomia política integral dos mineradores."
      },
      {
        "letter": "D",
        "text": "A fundação de Cuiabá, tradicionalmente datada de 8 de abril de 1719 e associada a Pascoal Moreira Cabral, integrou o avanço da mineração, enquanto a cobrança de tributos e o controle exercido pelas autoridades coloniais contribuíram para tensões com os mineradores."
      },
      {
        "letter": "E",
        "text": "A descoberta do ouro determinou a imediata extinção da influência portuguesa sobre o território mato-grossense."
      }
    ],
    "answer": "D"
  },
  {
    "id": "hg-q3",
    "subject": "História e Geografia de MT",
    "qnum": 3,
    "stem": "(2026) A criação da Capitania de Mato Grosso e a fundação de Vila Bela da Santíssima Trindade integraram a política portuguesa de consolidação territorial na América do Sul. A região do vale do Guaporé possuía importância estratégica em razão das disputas fronteiriças e das possibilidades de exploração econômica. Considerando esses acontecimentos, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Capitania de Mato Grosso foi criada em 1748, e Vila Bela da Santíssima Trindade foi fundada em 1752, durante a administração de Antônio Rolim de Moura, desempenhando papel estratégico na ocupação e defesa da fronteira ocidental portuguesa."
      },
      {
        "letter": "B",
        "text": "A Capitania de Mato Grosso foi criada exclusivamente após a Guerra do Paraguai, para organizar a administração republicana."
      },
      {
        "letter": "C",
        "text": "Vila Bela foi fundada por autoridades paraguaias com a finalidade de impedir a navegação portuguesa pelo rio Amazonas."
      },
      {
        "letter": "D",
        "text": "A instalação de Vila Bela demonstrou que a Coroa portuguesa não possuía interesse na ocupação das áreas próximas ao rio Guaporé."
      },
      {
        "letter": "E",
        "text": "A criação da Capitania extinguiu imediatamente a exploração aurífera e determinou o abandono de todos os núcleos populacionais existentes."
      }
    ],
    "answer": "A"
  },
  {
    "id": "hg-q4",
    "subject": "História e Geografia de MT",
    "qnum": 4,
    "stem": "(2026) A escravidão de africanos e seus descendentes integrou a organização econômica e social de Mato Grosso durante o período colonial. O trabalho escravizado esteve presente em atividades produtivas e domésticas, enquanto diferentes formas de resistência foram desenvolvidas pelas populações submetidas à escravidão. Considerando esse contexto, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A escravidão africana não ocorreu em Mato Grosso, pois a mineração utilizava exclusivamente trabalhadores livres remunerados."
      },
      {
        "letter": "B",
        "text": "A população negra escravizada participou apenas de atividades domésticas, estando inteiramente afastada da mineração e da produção agrícola."
      },
      {
        "letter": "C",
        "text": "As relações escravistas caracterizaram-se pela ausência de violência e pela liberdade de deslocamento dos trabalhadores."
      },
      {
        "letter": "D",
        "text": "A resistência à escravidão ocorreu exclusivamente após a assinatura da Lei Áurea, em 1888."
      },
      {
        "letter": "E",
        "text": "A mão de obra africana escravizada participou de atividades mineradoras, agrícolas, domésticas e de outros serviços, enquanto fugas e a formação de quilombos constituíram manifestações de resistência à ordem escravista."
      }
    ],
    "answer": "E"
  },
  {
    "id": "hg-q5",
    "subject": "História e Geografia de MT",
    "qnum": 5,
    "stem": "(2026) A redução da atividade mineradora provocou mudanças na organização econômica de Mato Grosso entre o final do período colonial e o Império. A economia regional passou a depender de atividades alternativas e de circuitos comerciais que enfrentavam dificuldades relacionadas às distâncias e aos meios de transporte. Considerando essas transformações, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O declínio da mineração eliminou definitivamente a produção econômica da região, impedindo a formação de outras atividades produtivas."
      },
      {
        "letter": "B",
        "text": "A agricultura e a pecuária somente foram introduzidas em Mato Grosso após o início do século XXI."
      },
      {
        "letter": "C",
        "text": "A crise da mineração estimulou a diversificação econômica, com atividades agropecuárias, extrativistas e comerciais, cuja expansão foi condicionada pelas dificuldades de circulação e pelas possibilidades de navegação fluvial."
      },
      {
        "letter": "D",
        "text": "A economia provincial passou a depender exclusivamente da industrialização automobilística, já consolidada durante o Primeiro Reinado."
      },
      {
        "letter": "E",
        "text": "A redução da mineração provocou o abandono imediato de Cuiabá e de todos os demais núcleos urbanos da província."
      }
    ],
    "answer": "C"
  },
  {
    "id": "hg-q6",
    "subject": "História e Geografia de MT",
    "qnum": 6,
    "stem": "(2026) A Rusga, ocorrida em Cuiabá em 1834, constitui episódio importante da história política de Mato Grosso durante o Período Regencial. O movimento expressou rivalidades entre grupos da elite provincial, em um cenário marcado por disputas pela administração pública e por sentimentos antilusitanos. Considerando esse acontecimento, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Rusga foi um movimento republicano ocorrido em 1889, responsável pela proclamação da independência política de Mato Grosso em relação ao Brasil."
      },
      {
        "letter": "B",
        "text": "O movimento foi organizado exclusivamente por tropas paraguaias, sem participação de grupos políticos locais."
      },
      {
        "letter": "C",
        "text": "A Rusga constituiu revolta de trabalhadores industriais contra o fechamento das primeiras fábricas automobilísticas de Cuiabá."
      },
      {
        "letter": "D",
        "text": "O movimento não apresentou conflitos violentos nem disputas pelo controle da administração provincial."
      },
      {
        "letter": "E",
        "text": "A Rusga ocorreu em 1834 e envolveu conflitos entre grupos políticos locais, especialmente setores ligados aos Zelosos da Independência e à elite tradicional associada aos chamados caramurus, resultando em violência contra portugueses e outros moradores."
      }
    ],
    "answer": "E"
  },
  {
    "id": "hg-q7",
    "subject": "História e Geografia de MT",
    "qnum": 7,
    "stem": "(2026) Os quilombos constituíram formas de resistência à escravidão e de organização social, política e econômica de populações negras e, em diferentes situações, indígenas. Em Mato Grosso, a memória de Tereza de Benguela está associada à resistência quilombola no vale do Guaporé. Considerando esse tema, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Os quilombos eram estabelecimentos criados pelas autoridades coloniais para ampliar o controle sobre os trabalhadores escravizados."
      },
      {
        "letter": "B",
        "text": "A formação de quilombos ocorreu exclusivamente em regiões litorâneas, sendo inexistentes experiências semelhantes em Mato Grosso."
      },
      {
        "letter": "C",
        "text": "Tereza de Benguela destacou-se exclusivamente como representante da administração portuguesa na fiscalização das minas."
      },
      {
        "letter": "D",
        "text": "O Quilombo do Quariterê, também conhecido como Quilombo do Piolho, esteve associado à liderança de Tereza de Benguela e à organização de uma comunidade de resistência à escravidão, com participação de negros e indígenas."
      },
      {
        "letter": "E",
        "text": "Os quilombos eram compostos exclusivamente por militares portugueses responsáveis pela defesa das fronteiras coloniais."
      }
    ],
    "answer": "D"
  },
  {
    "id": "hg-q8",
    "subject": "História e Geografia de MT",
    "qnum": 8,
    "stem": "(2026) Durante o Império, os presidentes da Província de Mato Grosso desempenharam funções administrativas e políticas relacionadas à defesa territorial, à infraestrutura e à organização provincial. Entre os personagens importantes desse período encontram-se Augusto Leverger, conhecido como Barão de Melgaço, e José Vieira Couto de Magalhães. Considerando suas atuações, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Os presidentes provinciais eram escolhidos exclusivamente por votação direta de todos os habitantes da província, sem participação do governo imperial."
      },
      {
        "letter": "B",
        "text": "Augusto Leverger destacou-se em atividades administrativas e de defesa de Mato Grosso, inclusive na proteção de Cuiabá durante a Guerra do Paraguai, enquanto Couto de Magalhães esteve associado à organização de ações militares para a retomada de Corumbá."
      },
      {
        "letter": "C",
        "text": "Augusto Leverger participou exclusivamente da fundação de Cuiabá em 1719, não exercendo qualquer função no século XIX."
      },
      {
        "letter": "D",
        "text": "Couto de Magalhães governou a província durante a colonização portuguesa do século XVI."
      },
      {
        "letter": "E",
        "text": "A administração provincial manteve-se integralmente afastada das questões de navegação fluvial e defesa das fronteiras."
      }
    ],
    "answer": "B"
  },
  {
    "id": "hg-q9",
    "subject": "História e Geografia de MT",
    "qnum": 9,
    "stem": "(2026) A Guerra da Tríplice Aliança contra o Paraguai, ocorrida entre 1864 e 1870, produziu importantes consequências militares, políticas, sociais e econômicas para Mato Grosso. O território provincial foi atingido por operações militares, incluindo a ocupação de áreas estratégicas e a interrupção de circuitos comerciais. Considerando a participação de Mato Grosso no conflito, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A guerra ocorreu exclusivamente no litoral brasileiro, sem qualquer operação militar no território mato-grossense."
      },
      {
        "letter": "B",
        "text": "Mato Grosso permaneceu neutro durante todo o conflito, pois não fazia fronteira com o Paraguai."
      },
      {
        "letter": "C",
        "text": "A invasão paraguaia atingiu o sul da então Província de Mato Grosso, e episódios como a defesa do Forte de Coimbra, a Retirada da Laguna e a retomada de Corumbá integraram a história regional do conflito."
      },
      {
        "letter": "D",
        "text": "O conflito foi encerrado em 1865, sem repercussões sobre os transportes e o abastecimento da província."
      },
      {
        "letter": "E",
        "text": "A guerra resultou na anexação permanente de Cuiabá ao território paraguaio."
      }
    ],
    "answer": "C"
  },
  {
    "id": "hg-q10",
    "subject": "História e Geografia de MT",
    "qnum": 10,
    "stem": "(2026) A economia de Mato Grosso sofreu transformações após a Guerra da Tríplice Aliança. A retomada dos fluxos de navegação pela bacia do Paraguai e as atividades agropecuárias e extrativistas contribuíram para reorganizar os circuitos econômicos regionais. Ao final do Império, a Proclamação da República também modificou a estrutura política do país. Considerando esse contexto, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O encerramento da guerra determinou a proibição definitiva da navegação pelo rio Paraguai, impedindo qualquer recuperação comercial."
      },
      {
        "letter": "B",
        "text": "A economia regional tornou-se exclusivamente industrial e urbana imediatamente após 1870, eliminando as atividades agropecuárias."
      },
      {
        "letter": "C",
        "text": "O fim do Império ocorreu por decisão exclusiva da Assembleia Provincial de Mato Grosso, sem relação com os acontecimentos nacionais de 1889."
      },
      {
        "letter": "D",
        "text": "A recuperação econômica posterior à guerra resultou exclusivamente da exploração do petróleo, já dominante na região durante o século XIX."
      },
      {
        "letter": "E",
        "text": "O período posterior à guerra foi marcado pela retomada da navegação e do comércio, pelo desenvolvimento de atividades agropecuárias e extrativistas e, posteriormente, pela reorganização política decorrente da Proclamação da República, em 1889."
      }
    ],
    "answer": "E"
  },
  {
    "id": "hg-q11",
    "subject": "História e Geografia de MT",
    "qnum": 11,
    "stem": "(2026) Na Primeira República, o poder político em Mato Grosso foi influenciado por relações entre lideranças regionais, grandes proprietários rurais e grupos que controlavam recursos econômicos e redes de dependência pessoal. O coronelismo constituiu uma expressão dessas relações, em um contexto de limitada participação política de amplos segmentos da população. Considerando o coronelismo em Mato Grosso, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O coronelismo esteve associado ao poder das oligarquias locais, ao controle de redes de influência política e à utilização de relações de dependência e favorecimento, contribuindo para a concentração do poder."
      },
      {
        "letter": "B",
        "text": "O coronelismo determinou a distribuição igualitária de terras e a eliminação das desigualdades sociais nas áreas rurais."
      },
      {
        "letter": "C",
        "text": "As lideranças coronelistas atuavam exclusivamente como representantes de sindicatos de trabalhadores urbanos, sem vínculos com a propriedade rural."
      },
      {
        "letter": "D",
        "text": "O sistema coronelista impediu qualquer relação entre interesses econômicos regionais e decisões políticas."
      },
      {
        "letter": "E",
        "text": "O coronelismo surgiu exclusivamente após a Constituição Federal de 1988, não apresentando relação com a Primeira República."
      }
    ],
    "answer": "A"
  },
  {
    "id": "hg-q12",
    "subject": "História e Geografia de MT",
    "qnum": 12,
    "stem": "(2026) Durante a Primeira República, a economia mato-grossense manteve forte participação de atividades vinculadas à produção rural e ao aproveitamento dos recursos naturais. Usinas açucareiras e estabelecimentos pecuários desempenharam funções importantes na organização econômica e nas relações de trabalho regionais. Considerando esse período, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A produção açucareira e a criação de gado eram atividades proibidas em Mato Grosso, cuja economia dependia exclusivamente da mineração."
      },
      {
        "letter": "B",
        "text": "As usinas de açúcar funcionavam apenas como centros políticos, sem ligação com atividades agrícolas ou industriais."
      },
      {
        "letter": "C",
        "text": "As usinas açucareiras e a pecuária integraram a economia regional, coexistindo com relações de trabalho marcadas por desigualdades, dependência pessoal e diferentes formas de remuneração e exploração da mão de obra."
      },
      {
        "letter": "D",
        "text": "A expansão da pecuária eliminou imediatamente os conflitos fundiários e assegurou acesso igualitário à propriedade da terra."
      },
      {
        "letter": "E",
        "text": "As relações de trabalho rurais reproduziam integralmente as condições dos atuais contratos industriais, com direitos trabalhistas contemporâneos plenamente consolidados."
      }
    ],
    "answer": "C"
  },
  {
    "id": "hg-q13",
    "subject": "História e Geografia de MT",
    "qnum": 13,
    "stem": "(2026) Durante a Era Vargas, políticas de integração territorial buscaram ampliar a presença do Estado brasileiro no interior do país. A chamada Marcha para o Oeste relacionou-se à ocupação econômica do Centro-Oeste, à construção de infraestrutura e à implantação de núcleos de colonização. Considerando os efeitos dessas políticas em Mato Grosso, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Marcha para o Oeste foi uma iniciativa voltada exclusivamente à industrialização dos estados litorâneos, sem alcançar Mato Grosso."
      },
      {
        "letter": "B",
        "text": "A política varguista determinou a proibição de deslocamentos populacionais para o interior, preservando o isolamento econômico da região."
      },
      {
        "letter": "C",
        "text": "A expansão da fronteira de ocupação ocorreu em territórios efetivamente desabitados, sem presença de comunidades indígenas ou populações tradicionais."
      },
      {
        "letter": "D",
        "text": "A Marcha para o Oeste incentivou a integração territorial e a expansão de núcleos econômicos e de colonização, mas também provocou disputas territoriais e impactos sobre populações indígenas e comunidades já estabelecidas."
      },
      {
        "letter": "E",
        "text": "O Estado Novo extinguiu todas as iniciativas de construção de infraestrutura de transporte e comunicação no Centro-Oeste."
      }
    ],
    "answer": "D"
  },
  {
    "id": "hg-q14",
    "subject": "História e Geografia de MT",
    "qnum": 14,
    "stem": "(2026) A política fundiária de Mato Grosso foi marcada, em diferentes períodos, por projetos de colonização, expansão da produção agropecuária, concentração da propriedade e disputas pelo acesso à terra. Essas transformações produziram conflitos envolvendo agricultores familiares, grandes proprietários, trabalhadores rurais, povos indígenas e comunidades tradicionais. Considerando esses processos, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A expansão da fronteira agrícola eliminou todas as disputas relacionadas à propriedade e ao uso dos recursos naturais."
      },
      {
        "letter": "B",
        "text": "Os programas governamentais de colonização asseguraram automaticamente distribuição igualitária de terras e inexistência de conflitos sociais."
      },
      {
        "letter": "C",
        "text": "A questão fundiária em Mato Grosso é exclusivamente urbana, não apresentando relação com a expansão agropecuária."
      },
      {
        "letter": "D",
        "text": "As disputas territoriais restringem-se ao período colonial, não existindo conflitos contemporâneos de natureza fundiária."
      },
      {
        "letter": "E",
        "text": "A expansão agropecuária e os projetos de ocupação territorial favoreceram transformações econômicas e demográficas, mas também estiveram associados à concentração fundiária, a conflitos sociais e a disputas por terras e recursos naturais."
      }
    ],
    "answer": "E"
  },
  {
    "id": "hg-q15",
    "subject": "História e Geografia de MT",
    "qnum": 15,
    "stem": "(2026) A organização político-administrativa de Mato Grosso passou por mudanças significativas no século XX. A divisão do antigo território estadual e a criação de Mato Grosso do Sul modificaram a composição territorial da região, enquanto as administrações estaduais posteriores enfrentaram desafios relacionados à infraestrutura, à expansão econômica e aos serviços públicos. Considerando esse processo, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Mato Grosso do Sul foi criado pela Lei Complementar nº 31, de 11 de outubro de 1977, sendo instalado em 1979; a reorganização territorial ocorreu em contexto de políticas nacionais de integração e desenvolvimento regional."
      },
      {
        "letter": "B",
        "text": "Mato Grosso foi dividido em 1822, imediatamente após a Independência, dando origem ao atual Mato Grosso do Sul."
      },
      {
        "letter": "C",
        "text": "A divisão estadual extinguiu Cuiabá e transferiu a capital de Mato Grosso para Campo Grande."
      },
      {
        "letter": "D",
        "text": "A criação de Mato Grosso do Sul ocorreu exclusivamente por iniciativa da administração colonial portuguesa, no século XVIII."
      },
      {
        "letter": "E",
        "text": "A divisão territorial eliminou a necessidade de planejamento estadual, pois os dois estados passaram a depender administrativamente da mesma capital."
      }
    ],
    "answer": "A"
  },
  {
    "id": "hg-q16",
    "subject": "História e Geografia de MT",
    "qnum": 16,
    "stem": "(2026) Mato Grosso integra a região Centro-Oeste do Brasil e apresenta características geopolíticas relacionadas à posição interiorana, à proximidade com a Bolívia e às conexões com diferentes regiões brasileiras. Seu território também integra a Amazônia Legal, importante recorte utilizado em políticas de desenvolvimento territorial. Considerando a localização e a geopolítica mato-grossense, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Mato Grosso integra a região Sul e possui saída direta para o oceano Atlântico, o que determina sua organização econômica."
      },
      {
        "letter": "B",
        "text": "A Amazônia Legal corresponde exclusivamente ao bioma Amazônia, não abrangendo regiões de Cerrado ou Pantanal."
      },
      {
        "letter": "C",
        "text": "Mato Grosso integra o Centro-Oeste, possui fronteira internacional com a Bolívia e faz parte da Amazônia Legal, condição relevante para políticas territoriais, ambientais e de desenvolvimento."
      },
      {
        "letter": "D",
        "text": "O estado não mantém relações comerciais com outras regiões brasileiras, pois sua posição geográfica impede a circulação de mercadorias."
      },
      {
        "letter": "E",
        "text": "A posição de Mato Grosso elimina sua relevância nos corredores logísticos de exportação de produtos agropecuários."
      }
    ],
    "answer": "C"
  },
  {
    "id": "hg-q17",
    "subject": "História e Geografia de MT",
    "qnum": 17,
    "stem": "(2026) O território mato-grossense apresenta diversidade de características físicas e ambientais, incluindo áreas de planaltos, depressões, planícies e diferentes formações vegetais. A distribuição dos recursos hídricos e dos biomas influencia as atividades econômicas e os processos de ocupação territorial. Considerando os aspectos naturais de Mato Grosso, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Todo o território mato-grossense apresenta vegetação exclusivamente amazônica, sem ocorrência de Cerrado ou Pantanal."
      },
      {
        "letter": "B",
        "text": "Mato Grosso apresenta exclusivamente clima temperado oceânico, com ocorrência regular de neve durante o inverno."
      },
      {
        "letter": "C",
        "text": "A rede hidrográfica do estado não possui importância para o abastecimento, a conservação ambiental ou as atividades econômicas."
      },
      {
        "letter": "D",
        "text": "Mato Grosso abrange áreas dos biomas Amazônia, Cerrado e Pantanal, com diferentes paisagens naturais e sistemas hidrográficos que influenciam a biodiversidade, a ocupação territorial e as atividades produtivas."
      },
      {
        "letter": "E",
        "text": "O Pantanal corresponde exclusivamente a uma formação desértica, caracterizada pela ausência de inundações sazonais."
      }
    ],
    "answer": "D"
  },
  {
    "id": "hg-q18",
    "subject": "História e Geografia de MT",
    "qnum": 18,
    "stem": "(2026) A formação populacional de Mato Grosso envolve contribuições de povos indígenas, africanos e seus descendentes, grupos de origem europeia e migrantes provenientes de diferentes regiões brasileiras. A ocupação territorial intensificou-se em determinados períodos, especialmente com políticas de colonização e expansão da fronteira agrícola. Considerando os aspectos étnicos e demográficos, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A população mato-grossense possui formação exclusivamente europeia, sem participação indígena, africana ou de migrantes nacionais."
      },
      {
        "letter": "B",
        "text": "Os povos indígenas passaram a ocupar o território somente após a chegada dos bandeirantes, no século XVIII."
      },
      {
        "letter": "C",
        "text": "A expansão agrícola eliminou todas as formas de diversidade cultural entre os municípios do estado."
      },
      {
        "letter": "D",
        "text": "A migração para Mato Grosso ocorreu exclusivamente no século XVIII, não apresentando relevância nas transformações do século XX."
      },
      {
        "letter": "E",
        "text": "A formação social de Mato Grosso resulta de processos históricos diversos, envolvendo povos originários, populações negras, migrações internas e outros grupos, cujas experiências contribuíram para a diversidade cultural e para a ocupação territorial."
      }
    ],
    "answer": "E"
  },
  {
    "id": "hg-q19",
    "subject": "História e Geografia de MT",
    "qnum": 19,
    "stem": "(2026) A economia de Mato Grosso possui expressiva participação da agropecuária, com destaque para cadeias produtivas associadas aos grãos, à pecuária e à agroindústria. Sua integração ao mercado nacional e internacional depende de infraestrutura logística, tecnologias produtivas e mecanismos de comercialização. Considerando as características socioeconômicas do estado, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A economia estadual depende exclusivamente da atividade turística, sendo a agropecuária um setor sem relevância nacional."
      },
      {
        "letter": "B",
        "text": "A expansão econômica de Mato Grosso ocorreu independentemente da mecanização, das pesquisas agropecuárias e da construção de infraestrutura."
      },
      {
        "letter": "C",
        "text": "O estado apresenta importante inserção nas cadeias produtivas de soja, milho e pecuária, com impactos sobre logística, geração de renda e uso do território, ao mesmo tempo em que enfrenta desafios de diversificação econômica e sustentabilidade ambiental."
      },
      {
        "letter": "D",
        "text": "A produção agropecuária destina-se exclusivamente ao consumo doméstico dos produtores, sem participação no comércio entre estados ou nas exportações."
      },
      {
        "letter": "E",
        "text": "A modernização da agropecuária eliminou integralmente as desigualdades sociais e os impactos ambientais nas regiões produtoras."
      }
    ],
    "answer": "C"
  },
  {
    "id": "hg-q20",
    "subject": "História e Geografia de MT",
    "qnum": 20,
    "stem": "(2026) A urbanização de Mato Grosso foi influenciada pela expansão agropecuária, pelas redes de transporte, pelos programas governamentais de ocupação territorial e pela formação de novos centros urbanos. Nas últimas décadas, municípios associados ao agronegócio e à prestação de serviços ampliaram sua importância econômica, enquanto persistem desafios relacionados à infraestrutura, à educação, à segurança, à energia e ao meio ambiente. Considerando esse processo, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A urbanização mato-grossense foi impulsionada por diferentes processos de ocupação e integração econômica, incluindo a expansão da fronteira agrícola e dos serviços, gerando crescimento urbano e novas demandas por infraestrutura, políticas sociais e sustentabilidade."
      },
      {
        "letter": "B",
        "text": "A expansão da fronteira agrícola impediu a formação de cidades, mantendo a totalidade da população estadual em áreas rurais."
      },
      {
        "letter": "C",
        "text": "O crescimento urbano de Mato Grosso ocorreu exclusivamente durante a mineração colonial, sem transformações posteriores."
      },
      {
        "letter": "D",
        "text": "A modernização da agropecuária eliminou a necessidade de centros de armazenamento, transporte, comércio, serviços e inovação tecnológica."
      },
      {
        "letter": "E",
        "text": "Os problemas ambientais e as demandas por serviços urbanos são fenômenos sem relação com o crescimento econômico e populacional do estado."
      }
    ],
    "answer": "A"
  },
  {
    "id": "leg-q1",
    "subject": "Legislação Municipal",
    "qnum": 1,
    "stem": "(2026) A Lei Orgânica do Município de Cuiabá estabelece os fundamentos jurídicos e institucionais da organização municipal, definindo sua autonomia, seus poderes e as formas de participação popular. Considerando o disposto nos arts. 1º, 2º e 2º-A da Lei Orgânica do Município de Cuiabá, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O Município possui autonomia administrativa e financeira, mas depende de autorização estadual para exercer sua competência legislativa."
      },
      {
        "letter": "B",
        "text": "O Poder Judiciário integra a estrutura dos poderes municipais, juntamente com o Legislativo e o Executivo."
      },
      {
        "letter": "C",
        "text": "A participação direta da população nas decisões municipais limita-se à realização de eleições periódicas."
      },
      {
        "letter": "D",
        "text": "O exercício do poder municipal pertence exclusivamente aos representantes eleitos, sendo vedados instrumentos de democracia direta."
      },
      {
        "letter": "E",
        "text": "O Município é pessoa jurídica de direito público interno, dotada de autonomia política, administrativa, financeira e legislativa, sendo o poder exercido pelo povo diretamente ou por representantes eleitos."
      }
    ],
    "answer": "E"
  },
  {
    "id": "leg-q2",
    "subject": "Legislação Municipal",
    "qnum": 2,
    "stem": "(2026) A distribuição constitucional de competências permite que os municípios desempenhem atividades relacionadas às necessidades locais, promovendo serviços públicos e políticas de interesse da população. De acordo com o art. 4º da Lei Orgânica do Município de Cuiabá, especialmente na redação dada pela Emenda à Lei Orgânica nº 23/2010, constitui competência municipal:",
    "options": [
      {
        "letter": "A",
        "text": "Legislar privativamente sobre direito penal, direito civil e normas gerais de processo judicial."
      },
      {
        "letter": "B",
        "text": "Organizar e prestar, diretamente ou sob regime de concessão ou permissão, os serviços públicos de sua competência, além de promover o ordenamento territorial e regulamentar atividades de interesse local."
      },
      {
        "letter": "C",
        "text": "Determinar a organização administrativa dos municípios vizinhos, sempre que houver interesse regional."
      },
      {
        "letter": "D",
        "text": "Instituir tributos de competência exclusiva da União e dos estados, mediante autorização da Câmara Municipal."
      },
      {
        "letter": "E",
        "text": "Substituir integralmente a legislação federal e estadual nas matérias relacionadas à saúde, educação e segurança pública."
      }
    ],
    "answer": "B"
  },
  {
    "id": "leg-q3",
    "subject": "Legislação Municipal",
    "qnum": 3,
    "stem": "(2026) A organização do Poder Legislativo municipal deve observar as disposições da Lei Orgânica, especialmente quanto à composição da Câmara Municipal, ao mandato dos vereadores e à representatividade da população. Considerando o art. 6º da Lei Orgânica do Município de Cuiabá, com as alterações promovidas pelas Emendas à Lei Orgânica nº 28/2011 e nº 45/2023, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Câmara Municipal é composta por vereadores eleitos pelo sistema majoritário, para mandatos de cinco anos."
      },
      {
        "letter": "B",
        "text": "O número de vereadores é definido exclusivamente por decreto do Prefeito, independentemente da população municipal."
      },
      {
        "letter": "C",
        "text": "A legislatura tem duração de três anos, sendo obrigatória a renovação integral da Câmara ao final de cada período."
      },
      {
        "letter": "D",
        "text": "Cada legislatura tem duração de quatro anos, e a Lei Orgânica estabeleceu 27 vagas para a legislatura iniciada em 2025, considerando os dados populacionais oficialmente apurados pelo IBGE."
      },
      {
        "letter": "E",
        "text": "A eleição dos vereadores ocorre por votação indireta, realizada por representantes dos bairros e distritos municipais."
      }
    ],
    "answer": "D"
  },
  {
    "id": "leg-q4",
    "subject": "Legislação Municipal",
    "qnum": 4,
    "stem": "(2026) O funcionamento da Câmara Municipal de Cuiabá compreende sessões legislativas ordinárias, extraordinárias e solenes, submetidas às regras previstas na Lei Orgânica e no Regimento Interno. Considerando o art. 8º da Lei Orgânica do Município de Cuiabá, com redação dada pela Emenda à Lei Orgânica nº 43/2021, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Câmara Municipal reúne-se anualmente de 2 de fevereiro a 17 de julho e de 1º de agosto a 22 de dezembro, sendo possível a convocação extraordinária nos casos previstos na Lei Orgânica."
      },
      {
        "letter": "B",
        "text": "As reuniões ordinárias da Câmara Municipal ocorrem exclusivamente entre março e novembro, sem possibilidade de convocação extraordinária."
      },
      {
        "letter": "C",
        "text": "O Prefeito pode convocar sessões extraordinárias para discutir qualquer matéria, mesmo que não esteja relacionada ao motivo da convocação."
      },
      {
        "letter": "D",
        "text": "As sessões legislativas extraordinárias autorizam o pagamento obrigatório de parcela indenizatória aos vereadores em razão da convocação."
      },
      {
        "letter": "E",
        "text": "Todas as sessões da Câmara Municipal devem ocorrer de forma reservada, salvo autorização expressa do Presidente."
      }
    ],
    "answer": "A"
  },
  {
    "id": "leg-q5",
    "subject": "Legislação Municipal",
    "qnum": 5,
    "stem": "(2026) O processo legislativo municipal compreende diferentes espécies normativas e estabelece requisitos específicos para alteração da Lei Orgânica. Considerando o art. 24 da Lei Orgânica do Município de Cuiabá, analise a seguinte situação: determinado grupo de vereadores pretende apresentar proposta de emenda à Lei Orgânica, observando os requisitos de iniciativa, discussão, votação e promulgação. Nesse contexto, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A proposta poderá ser apresentada por qualquer vereador individualmente e será aprovada por maioria simples, em votação única."
      },
      {
        "letter": "B",
        "text": "A aprovação da proposta depende de votação em três turnos, com intervalo obrigatório de trinta dias entre eles."
      },
      {
        "letter": "C",
        "text": "A Lei Orgânica poderá ser emendada mediante proposta de, no mínimo, um terço dos membros da Câmara, do Prefeito ou de iniciativa popular, exigindo-se aprovação por dois terços dos vereadores, em dois turnos, com interstício mínimo de dez dias."
      },
      {
        "letter": "D",
        "text": "A proposta de emenda somente poderá ser apresentada pelo Prefeito e dependerá de referendo estadual para entrar em vigor."
      },
      {
        "letter": "E",
        "text": "A emenda aprovada deverá ser sancionada pelo Governador do Estado de Mato Grosso antes de sua promulgação."
      }
    ],
    "answer": "C"
  },
  {
    "id": "leg-q6",
    "subject": "Legislação Municipal",
    "qnum": 6,
    "stem": "(2026) A atuação dos vereadores está submetida a regras de responsabilidade política e parlamentar, destinadas a preservar a legitimidade do mandato e o funcionamento das instituições municipais. Considerando o art. 20 da Lei Orgânica do Município de Cuiabá, com as alterações promovidas pela Emenda à Lei Orgânica nº 49/2025, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A perda do mandato parlamentar somente poderá ocorrer mediante condenação criminal definitiva, sendo irrelevantes as infrações ao decoro parlamentar."
      },
      {
        "letter": "B",
        "text": "Nos casos previstos nos incisos I, II, III e VIII do art. 20, a perda do mandato será declarada pela Câmara, por votação nominal de dois terços de seus membros, assegurada ampla defesa."
      },
      {
        "letter": "C",
        "text": "A ausência injustificada às sessões ordinárias jamais poderá ocasionar perda do mandato, independentemente da quantidade de faltas."
      },
      {
        "letter": "D",
        "text": "A mudança de residência do vereador para outro município não possui qualquer repercussão sobre a manutenção do mandato."
      },
      {
        "letter": "E",
        "text": "A decisão de perda do mandato caberá exclusivamente ao Prefeito Municipal, após manifestação consultiva da Câmara."
      }
    ],
    "answer": "B"
  },
  {
    "id": "leg-q7",
    "subject": "Legislação Municipal",
    "qnum": 7,
    "stem": "(2026) O processo legislativo municipal estabelece prazos e procedimentos para sanção, veto e promulgação das leis aprovadas pela Câmara Municipal. Considerando o art. 29 da Lei Orgânica do Município de Cuiabá, assinale a alternativa que apresenta corretamente uma das regras aplicáveis à atuação do Prefeito.",
    "options": [
      {
        "letter": "A",
        "text": "O Prefeito dispõe de trinta dias corridos para sancionar projetos de lei, sendo obrigatório o veto quando não houver manifestação expressa."
      },
      {
        "letter": "B",
        "text": "O veto parcial poderá abranger palavras isoladas ou expressões específicas de determinado artigo, independentemente de sua estrutura normativa."
      },
      {
        "letter": "C",
        "text": "A Câmara somente poderá rejeitar o veto do Prefeito mediante aprovação unânime dos vereadores."
      },
      {
        "letter": "D",
        "text": "A ausência de manifestação do Prefeito dentro do prazo legal determina o arquivamento definitivo do projeto aprovado."
      },
      {
        "letter": "E",
        "text": "O projeto aprovado será encaminhado ao Prefeito no prazo de dez dias úteis, que terá quinze dias úteis para sancioná-lo, importando seu silêncio, após esse prazo, em sanção tácita."
      }
    ],
    "answer": "E"
  },
  {
    "id": "leg-q8",
    "subject": "Legislação Municipal",
    "qnum": 8,
    "stem": "(2026) A Administração Pública Municipal deve observar princípios constitucionais que orientam a prestação dos serviços públicos e a atuação dos agentes administrativos. O art. 49 da Lei Orgânica do Município de Cuiabá, na redação dada pela Emenda à Lei Orgânica nº 12/2003, estabelece regras relacionadas ao concurso público, à investidura em cargos e à organização administrativa. Assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Administração Pública Municipal deve observar os princípios da legalidade, impessoalidade, moralidade, publicidade e eficiência, sendo a aprovação prévia em concurso público a regra para investidura em cargo ou emprego público, ressalvadas as nomeações para cargos em comissão previstos em lei."
      },
      {
        "letter": "B",
        "text": "A nomeação para cargos efetivos poderá ocorrer independentemente de concurso público quando houver indicação do chefe imediato."
      },
      {
        "letter": "C",
        "text": "As funções de confiança poderão ser exercidas por qualquer cidadão, independentemente de vínculo efetivo com a Administração Pública."
      },
      {
        "letter": "D",
        "text": "O prazo de validade dos concursos públicos municipais será obrigatoriamente de cinco anos, permitidas sucessivas prorrogações."
      },
      {
        "letter": "E",
        "text": "A publicidade administrativa poderá conter nomes e imagens de autoridades, desde que sua finalidade seja divulgar realizações individuais dos gestores públicos."
      }
    ],
    "answer": "A"
  },
  {
    "id": "leg-q9",
    "subject": "Legislação Municipal",
    "qnum": 9,
    "stem": "(2026) A Lei Complementar nº 93, de 23 de junho de 2003, instituiu o Regime Jurídico dos Servidores Públicos da Administração Pública Direta, Autárquica e Fundacional do Município de Cuiabá. O art. 5º apresenta conceitos fundamentais para a compreensão da estrutura administrativa e funcional dos servidores. Considerando essas disposições, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Cargo público corresponde exclusivamente ao conjunto de atividades temporárias executadas por prestadores de serviços contratados."
      },
      {
        "letter": "B",
        "text": "Carreira representa qualquer atividade exercida na Administração Pública, independentemente da existência de cargos ou classes."
      },
      {
        "letter": "C",
        "text": "Lotação significa exclusivamente a remuneração recebida pelo servidor em determinada unidade administrativa."
      },
      {
        "letter": "D",
        "text": "Cargo público é o lugar instituído na organização do serviço público, com denominação própria, atribuições e responsabilidades específicas e remuneração correspondente, para ser provido e exercido por um titular, na forma estabelecida em lei."
      },
      {
        "letter": "E",
        "text": "Promoção corresponde obrigatoriamente à transferência do servidor para órgão de outro ente federativo, independentemente de sua carreira."
      }
    ],
    "answer": "D"
  },
  {
    "id": "leg-q10",
    "subject": "Legislação Municipal",
    "qnum": 10,
    "stem": "(2026) A investidura em cargo público municipal exige o atendimento de requisitos legais destinados a assegurar que o candidato possua as condições necessárias ao exercício das atribuições administrativas. Considerando o art. 13 da Lei Complementar nº 93/2003, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A apresentação de certificado de escolaridade é suficiente para a investidura, sendo dispensada a verificação dos demais requisitos legais."
      },
      {
        "letter": "B",
        "text": "A Administração Pública poderá exigir filiação partidária como requisito geral para investidura em cargo efetivo."
      },
      {
        "letter": "C",
        "text": "Entre os requisitos básicos estão o gozo dos direitos políticos, a quitação com as obrigações militares, eleitorais e com o fisco municipal, a escolaridade exigida, a maioridade civil, a aptidão física e mental e a idoneidade moral, além da nacionalidade na forma legalmente prevista."
      },
      {
        "letter": "D",
        "text": "A exigência de aptidão física e mental aplica-se exclusivamente aos cargos de natureza policial, sendo proibida nos demais cargos públicos."
      },
      {
        "letter": "E",
        "text": "A comprovação dos requisitos de investidura poderá ser dispensada mediante declaração verbal do candidato aprovado."
      }
    ],
    "answer": "C"
  },
  {
    "id": "leg-q11",
    "subject": "Legislação Municipal",
    "qnum": 11,
    "stem": "(2026) O concurso público constitui importante instrumento de seleção de servidores, buscando assegurar critérios objetivos de ingresso na Administração Municipal. A Lei Complementar nº 93/2003, em seu art. 16, estabelece disposições sobre as modalidades de concurso, a comprovação dos requisitos de investidura e a observância da classificação dos candidatos. Assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O concurso público municipal deverá ser realizado exclusivamente mediante prova oral, sendo vedada a avaliação de títulos."
      },
      {
        "letter": "B",
        "text": "A Administração poderá desconsiderar livremente a classificação dos candidatos aprovados quando realizar convocações."
      },
      {
        "letter": "C",
        "text": "O candidato aprovado estará dispensado de comprovar os requisitos estabelecidos no edital no momento da posse."
      },
      {
        "letter": "D",
        "text": "A realização de concurso público impede a Administração de estabelecer critérios objetivos relacionados às atribuições do cargo."
      },
      {
        "letter": "E",
        "text": "O concurso poderá ser de provas ou de provas e títulos, conforme a legislação aplicável, devendo os candidatos aprovados comprovar os requisitos do edital na data da posse e ser respeitada a ordem de classificação nas convocações."
      }
    ],
    "answer": "E"
  },
  {
    "id": "leg-q12",
    "subject": "Legislação Municipal",
    "qnum": 12,
    "stem": "(2026) O estágio probatório constitui período destinado à avaliação do servidor nomeado para cargo de provimento efetivo, permitindo à Administração verificar sua capacidade de desempenhar as atribuições funcionais. Considerando os arts. 28 e 29 da Lei Complementar nº 93/2003, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor nomeado para cargo efetivo ficará sujeito a estágio probatório de três anos, durante o qual serão avaliados critérios como disciplina, assiduidade, pontualidade, eficiência, responsabilidade e produtividade, mediante avaliação por comissão especial."
      },
      {
        "letter": "B",
        "text": "O estágio probatório tem duração de seis meses e será concluído automaticamente, independentemente de avaliação funcional."
      },
      {
        "letter": "C",
        "text": "A avaliação do servidor em estágio probatório deverá considerar exclusivamente sua produtividade, sendo proibido examinar critérios relacionados à disciplina e à assiduidade."
      },
      {
        "letter": "D",
        "text": "A comissão especial de avaliação será composta obrigatoriamente por servidores temporários, escolhidos diretamente pelo servidor avaliado."
      },
      {
        "letter": "E",
        "text": "O estágio probatório será aplicado exclusivamente aos ocupantes de cargos em comissão de livre nomeação e exoneração."
      }
    ],
    "answer": "A"
  },
  {
    "id": "leg-q13",
    "subject": "Legislação Municipal",
    "qnum": 13,
    "stem": "(2026) A Lei Complementar nº 93/2003 disciplina diferentes formas de provimento derivado, permitindo que situações específicas da vida funcional dos servidores sejam adequadamente tratadas pela Administração Pública. Considerando os conceitos de readaptação, reintegração e recondução previstos nos arts. 32, 34 e 35 da referida norma, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Readaptação corresponde ao retorno de servidor aposentado à atividade, independentemente de avaliação médica ou das hipóteses legais."
      },
      {
        "letter": "B",
        "text": "Reintegração consiste na transferência definitiva de servidor efetivo para entidade privada mediante autorização administrativa."
      },
      {
        "letter": "C",
        "text": "Recondução significa necessariamente a ascensão do servidor a cargo de maior hierarquia em razão do tempo de serviço."
      },
      {
        "letter": "D",
        "text": "Readaptação é a investidura do servidor em cargo compatível com limitação superveniente de sua capacidade física ou mental; reintegração é a reinvestidura do servidor estável quando invalidada sua demissão; e recondução é o retorno do servidor estável ao cargo anteriormente ocupado nas hipóteses legais."
      },
      {
        "letter": "E",
        "text": "Readaptação, reintegração e recondução são expressões equivalentes, utilizadas indistintamente para designar a nomeação originária."
      }
    ],
    "answer": "D"
  },
  {
    "id": "leg-q14",
    "subject": "Legislação Municipal",
    "qnum": 14,
    "stem": "(2026) O regime jurídico dos servidores municipais estabelece normas relativas à jornada de trabalho e à prestação de serviços extraordinários e noturnos. Considerando os arts. 27, 71 e 72 da Lei Complementar nº 93/2003, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A jornada semanal dos servidores será obrigatoriamente de cinquenta horas, sem possibilidade de redução conforme as atribuições do cargo."
      },
      {
        "letter": "B",
        "text": "O serviço extraordinário deverá ser remunerado com acréscimo de vinte por cento sobre a hora normal."
      },
      {
        "letter": "C",
        "text": "O serviço noturno, prestado entre 22 horas e 5 horas do dia seguinte, será remunerado com acréscimo de 25% sobre o valor-hora, computando-se cada hora como 52 minutos e 30 segundos."
      },
      {
        "letter": "D",
        "text": "O trabalho noturno não possui tratamento remuneratório diferenciado quando prestado por servidor público municipal."
      },
      {
        "letter": "E",
        "text": "A prestação de serviços extraordinários será compensada exclusivamente por folgas, sendo vedado qualquer acréscimo remuneratório."
      }
    ],
    "answer": "C"
  },
  {
    "id": "leg-q15",
    "subject": "Legislação Municipal",
    "qnum": 15,
    "stem": "(2026) A concessão de licenças aos servidores públicos municipais busca assegurar direitos relacionados à maternidade, à paternidade e à proteção familiar, observadas as condições estabelecidas no regime jurídico. Considerando os arts. 105, 107 e 108 da Lei Complementar nº 93/2003, com as alterações legislativas indicadas, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A licença-maternidade terá duração máxima de noventa dias, enquanto a licença-paternidade será de cinco dias."
      },
      {
        "letter": "B",
        "text": "A licença à servidora gestante será de 180 dias consecutivos, sem prejuízo da remuneração, e a licença-paternidade será de dez dias consecutivos, observadas as condições legais."
      },
      {
        "letter": "C",
        "text": "A licença-paternidade somente será concedida quando o servidor comprovar impossibilidade de a mãe exercer os cuidados com a criança."
      },
      {
        "letter": "D",
        "text": "A licença decorrente de adoção ou guarda judicial não poderá ser remunerada, independentemente da idade da criança."
      },
      {
        "letter": "E",
        "text": "O período de licença-maternidade deverá ser compensado mediante prestação de serviços extraordinários após o retorno da servidora."
      }
    ],
    "answer": "B"
  },
  {
    "id": "leg-q16",
    "subject": "Legislação Municipal",
    "qnum": 16,
    "stem": "(2026) A Lei Complementar nº 235, de 3 de junho de 2011, trata da estrutura de cargos e da organização da carreira dos servidores do Poder Legislativo Municipal de Cuiabá. A evolução funcional pode ocorrer mediante diferentes mecanismos, conforme os critérios de formação e desempenho estabelecidos na legislação. Considerando os arts. 10 e 12 da referida Lei Complementar, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A promoção horizontal depende exclusivamente do tempo de serviço, sendo dispensada a apresentação de certificados, diplomas ou títulos."
      },
      {
        "letter": "B",
        "text": "A progressão vertical ocorre automaticamente a cada ano, independentemente de avaliação de desempenho ou de interstício mínimo."
      },
      {
        "letter": "C",
        "text": "A promoção horizontal implica obrigatoriamente transferência para cargo de chefia, mesmo sem previsão na estrutura administrativa."
      },
      {
        "letter": "D",
        "text": "A progressão vertical depende exclusivamente da obtenção de novo diploma de graduação, sem consideração do efetivo exercício."
      },
      {
        "letter": "E",
        "text": "A promoção horizontal, também denominada mudança de classe, relaciona-se à apresentação e análise de certificados, diplomas ou títulos, enquanto a progressão vertical considera o efetivo exercício e os requisitos de avaliação de desempenho previstos na legislação."
      }
    ],
    "answer": "E"
  },
  {
    "id": "leg-q17",
    "subject": "Legislação Municipal",
    "qnum": 17,
    "stem": "(2026) A estruturação das carreiras dos servidores legislativos municipais contempla critérios diferenciados de promoção horizontal, considerando a escolaridade exigida para os cargos e a qualificação profissional apresentada. De acordo com o art. 11, inciso I, da Lei Complementar nº 235/2011, considerando as disposições aplicáveis aos cargos de nível superior nele relacionados, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A passagem para a Classe C exige exclusivamente o cumprimento de dez anos de exercício no cargo, independentemente de formação complementar."
      },
      {
        "letter": "B",
        "text": "A Classe D será alcançada exclusivamente por meio de curso técnico profissionalizante de cento e vinte horas."
      },
      {
        "letter": "C",
        "text": "A Classe B exige obrigatoriamente a conclusão de curso de doutorado, vedada a utilização de certificados de qualificação profissional."
      },
      {
        "letter": "D",
        "text": "A Classe C exige curso de pós-graduação lato sensu com carga mínima de 360 horas, enquanto a Classe D admite dois cursos de pós-graduação lato sensu, cada um com carga mínima de 360 horas, ou título de mestre."
      },
      {
        "letter": "E",
        "text": "A Classe A exige necessariamente título de mestre ou doutor, sendo insuficiente a formação superior exigida para o provimento do cargo."
      }
    ],
    "answer": "D"
  },
  {
    "id": "leg-q18",
    "subject": "Legislação Municipal",
    "qnum": 18,
    "stem": "(2026) A progressão vertical dos servidores do Poder Legislativo de Cuiabá representa mecanismo de evolução na carreira relacionado ao tempo de efetivo exercício e à avaliação funcional. Considerando o art. 12 da Lei Complementar nº 235/2011 e a alteração relativa à avaliação de desempenho introduzida pela Lei Complementar nº 477/2019, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A progressão vertical deverá ocorrer a cada seis meses, sem necessidade de avaliação ou cumprimento de requisitos adicionais."
      },
      {
        "letter": "B",
        "text": "A progressão vertical observará interstícios de três anos e avaliação de desempenho superior a sessenta pontos, em escala de zero a cem, conforme a disciplina estabelecida na legislação."
      },
      {
        "letter": "C",
        "text": "A progressão vertical ocorrerá exclusivamente mediante aprovação em novo concurso público para o mesmo cargo."
      },
      {
        "letter": "D",
        "text": "O servidor somente poderá progredir verticalmente após completar vinte anos de efetivo exercício, independentemente da avaliação funcional."
      },
      {
        "letter": "E",
        "text": "A progressão vertical será concedida exclusivamente mediante indicação política do Presidente da Câmara Municipal."
      }
    ],
    "answer": "B"
  },
  {
    "id": "leg-q19",
    "subject": "Legislação Municipal",
    "qnum": 19,
    "stem": "(2026) A Lei Complementar nº 235/2011 estabelece normas relativas ao desenvolvimento funcional e à organização remuneratória dos servidores efetivos do Poder Legislativo de Cuiabá. Considerando o art. 19 da referida norma, assinale a alternativa correta quanto ao servidor efetivo nomeado para exercer cargo em comissão.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor deverá obrigatoriamente renunciar ao vencimento do cargo efetivo, passando a receber apenas gratificação simbólica."
      },
      {
        "letter": "B",
        "text": "O exercício de cargo em comissão ocasiona automaticamente a perda do vínculo efetivo anteriormente mantido pelo servidor."
      },
      {
        "letter": "C",
        "text": "O servidor poderá optar entre o vencimento do cargo comissionado ou o vencimento do cargo efetivo acrescido de 70% do vencimento do cargo comissionado, sendo possível realizar a opção a qualquer momento."
      },
      {
        "letter": "D",
        "text": "O exercício de cargo em comissão assegura o recebimento integral e cumulativo dos vencimentos dos dois cargos, sem qualquer limitação."
      },
      {
        "letter": "E",
        "text": "O servidor efetivo ficará impedido de exercer cargo em comissão, mesmo quando houver previsão legal."
      }
    ],
    "answer": "C"
  },
  {
    "id": "leg-q20",
    "subject": "Legislação Municipal",
    "qnum": 20,
    "stem": "(2026) A legislação que disciplina o quadro de pessoal do Poder Legislativo Municipal de Cuiabá estabelece regras relacionadas à jornada de trabalho dos servidores efetivos e à possibilidade de adequação da carga horária conforme as necessidades administrativas. Considerando o art. 36 da Lei Complementar nº 235/2011, com redação dada pela Lei Complementar nº 477/2019, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A carga horária oficial dos servidores efetivos da Câmara Municipal é de trinta horas semanais, podendo a Administração estabelecer outra carga horária de até quarenta horas semanais, observados o interesse público, a disponibilidade orçamentária e a anuência expressa do servidor, com incremento remuneratório proporcional."
      },
      {
        "letter": "B",
        "text": "Todos os servidores deverão cumprir obrigatoriamente quarenta e quatro horas semanais, sendo vedada qualquer alteração de jornada."
      },
      {
        "letter": "C",
        "text": "A jornada de trabalho será definida exclusivamente pelo servidor, sem necessidade de observância das exigências administrativas."
      },
      {
        "letter": "D",
        "text": "A ampliação da jornada semanal poderá ocorrer livremente, sem anuência do servidor e sem incremento remuneratório proporcional."
      },
      {
        "letter": "E",
        "text": "A carga horária oficial será de vinte horas semanais, sendo proibida sua ampliação por ato administrativo."
      }
    ],
    "answer": "A"
  },
  {
    "id": "tec-q1",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 1,
    "stem": "(2026) O Estado, o Governo e a Administração Pública constituem elementos fundamentais para a compreensão da organização político-administrativa brasileira. Embora estejam relacionados, apresentam características, funções e formas de atuação distintas. Considerando os conceitos de Estado, Governo e Administração Pública, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O Estado corresponde exclusivamente ao conjunto de governantes eleitos, sendo sua existência limitada à duração dos mandatos políticos."
      },
      {
        "letter": "B",
        "text": "A Administração Pública é responsável pela definição das principais diretrizes políticas do Estado, enquanto o Governo atua exclusivamente na execução técnica dessas decisões."
      },
      {
        "letter": "C",
        "text": "O Governo constitui uma estrutura permanente e juridicamente independente, que permanece inalterada diante das mudanças políticas e eleitorais."
      },
      {
        "letter": "D",
        "text": "O Estado representa a organização política e jurídica permanente; o Governo exerce a direção política temporária; e a Administração Pública executa concretamente as atividades administrativas destinadas ao interesse coletivo."
      },
      {
        "letter": "E",
        "text": "O Estado brasileiro caracteriza-se pela adoção da monarquia, do parlamentarismo e de uma organização territorial unitária."
      }
    ],
    "answer": "D"
  },
  {
    "id": "tec-q2",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 2,
    "stem": "(2026) A organização administrativa brasileira compreende diferentes pessoas jurídicas, órgãos e entidades responsáveis pela execução das atividades estatais. Nesse contexto, a distinção entre Administração direta e indireta permite compreender a distribuição das competências administrativas e os diferentes níveis de autonomia das estruturas públicas. Assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Administração direta é composta exclusivamente por autarquias, fundações públicas, empresas públicas e sociedades de economia mista."
      },
      {
        "letter": "B",
        "text": "A Administração direta compreende União, Estados, Distrito Federal e Municípios, enquanto a Administração indireta é formada por entidades dotadas de personalidade jurídica própria, destinadas ao desempenho descentralizado de atividades específicas."
      },
      {
        "letter": "C",
        "text": "Os órgãos públicos integrantes da Administração direta possuem personalidade jurídica própria e autonomia política equivalente à dos entes federativos."
      },
      {
        "letter": "D",
        "text": "As entidades da Administração indireta possuem competência legislativa própria e podem estabelecer livremente suas finalidades institucionais."
      },
      {
        "letter": "E",
        "text": "A Administração indireta é composta apenas por pessoas jurídicas de Direito Privado, sendo vedada a existência de autarquias de Direito Público."
      }
    ],
    "answer": "B"
  },
  {
    "id": "tec-q3",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 3,
    "stem": "(2026) A desconcentração e a descentralização administrativas representam técnicas utilizadas pelo Estado para distribuir competências e organizar a prestação dos serviços públicos. Embora ambas tenham como finalidade aprimorar a atuação administrativa, apresentam diferenças relacionadas à personalidade jurídica e à titularidade ou execução das atividades. Assinale a alternativa que apresenta corretamente essa distinção.",
    "options": [
      {
        "letter": "A",
        "text": "A desconcentração ocorre quando o Estado transfere a execução de determinado serviço público a uma empresa privada mediante contrato de concessão."
      },
      {
        "letter": "B",
        "text": "A descentralização pressupõe a distribuição interna de atribuições entre departamentos pertencentes à mesma pessoa jurídica."
      },
      {
        "letter": "C",
        "text": "A desconcentração e a descentralização exigem, necessariamente, a criação de novas pessoas jurídicas de Direito Público."
      },
      {
        "letter": "D",
        "text": "A descentralização elimina qualquer possibilidade de fiscalização do ente político sobre a entidade responsável pela atividade transferida."
      },
      {
        "letter": "E",
        "text": "A desconcentração consiste na distribuição interna de competências dentro da mesma pessoa jurídica, enquanto a descentralização envolve a execução de atividades por outra pessoa jurídica, administrativa ou particular colaboradora."
      }
    ],
    "answer": "E"
  },
  {
    "id": "tec-q4",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 4,
    "stem": "(2026) As entidades da Administração indireta apresentam características específicas quanto à personalidade jurídica, à composição do capital e à forma de organização. As empresas públicas e as sociedades de economia mista, embora submetidas a determinados controles estatais, possuem personalidade jurídica de Direito Privado. Considerando essas características, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "As empresas públicas possuem capital exclusivamente público e podem assumir diferentes formas jurídicas admitidas em direito, enquanto as sociedades de economia mista possuem capital público e privado, sob controle estatal, devendo adotar a forma de sociedade anônima."
      },
      {
        "letter": "B",
        "text": "As sociedades de economia mista possuem personalidade jurídica de Direito Público e são criadas diretamente por decreto do chefe do Poder Executivo."
      },
      {
        "letter": "C",
        "text": "As empresas públicas devem obrigatoriamente adotar a forma de sociedade anônima, enquanto as sociedades de economia mista podem assumir qualquer forma empresarial."
      },
      {
        "letter": "D",
        "text": "As empresas públicas e as sociedades de economia mista estão integralmente dispensadas de concurso público para admissão de empregados."
      },
      {
        "letter": "E",
        "text": "As sociedades de economia mista não integram a Administração indireta, pois a participação de capital privado afasta sua vinculação administrativa ao Estado."
      }
    ],
    "answer": "A"
  },
  {
    "id": "tec-q5",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 5,
    "stem": "(2026) As parcerias estabelecidas entre a Administração Pública e entidades privadas sem fins lucrativos permitem a execução colaborativa de atividades de interesse social, educacional, cultural e científico. Entre os modelos de colaboração encontram-se as organizações sociais e as organizações da sociedade civil de interesse público. Considerando os instrumentos utilizados nessas parcerias, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "As organizações sociais passam a integrar automaticamente a Administração direta após sua qualificação pelo Poder Público."
      },
      {
        "letter": "B",
        "text": "As organizações da sociedade civil de interesse público somente podem atuar mediante concessão de serviço público, com finalidade econômica."
      },
      {
        "letter": "C",
        "text": "As organizações sociais utilizam tipicamente o contrato de gestão, enquanto as organizações da sociedade civil de interesse público utilizam o termo de parceria, permanecendo ambas como entidades privadas sujeitas aos controles aplicáveis."
      },
      {
        "letter": "D",
        "text": "O contrato de gestão transfere definitivamente às organizações sociais a titularidade de todas as competências administrativas relacionadas à atividade desenvolvida."
      },
      {
        "letter": "E",
        "text": "As entidades privadas parceiras ficam dispensadas de prestação de contas sempre que executarem atividades consideradas de relevante interesse coletivo."
      }
    ],
    "answer": "C"
  },
  {
    "id": "tec-q6",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 6,
    "stem": "(2026) Os agentes públicos compreendem diferentes categorias de pessoas físicas que exercem atribuições relacionadas às atividades do Estado. A classificação desses agentes é importante para identificar os regimes jurídicos aplicáveis, as formas de ingresso e as responsabilidades decorrentes do exercício da função pública. Assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Apenas os servidores ocupantes de cargos efetivos podem ser considerados agentes públicos, pois a remuneração é requisito indispensável dessa condição."
      },
      {
        "letter": "B",
        "text": "Os empregados públicos são necessariamente estatutários e possuem o mesmo regime jurídico dos servidores ocupantes de cargos efetivos."
      },
      {
        "letter": "C",
        "text": "Os particulares que colaboram com o Poder Público mediante delegação ou convocação tornam-se automaticamente integrantes permanentes da Administração direta."
      },
      {
        "letter": "D",
        "text": "Os agentes temporários possuem vínculo permanente com a Administração e são contratados para substituir definitivamente os cargos efetivos."
      },
      {
        "letter": "E",
        "text": "A expressão agente público possui sentido amplo, abrangendo agentes políticos, servidores estatutários, empregados públicos, agentes temporários e particulares em colaboração com o Poder Público, conforme a natureza das atribuições exercidas."
      }
    ],
    "answer": "E"
  },
  {
    "id": "tec-q7",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 7,
    "stem": "(2026) O provimento, a vacância, a efetividade e a estabilidade são institutos relevantes para a compreensão do vínculo funcional dos servidores públicos. Cada um apresenta características próprias e consequências distintas para a organização administrativa e para a situação jurídica do agente. Considerando esses institutos, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A exoneração constitui necessariamente sanção disciplinar aplicada ao servidor público em razão de infração funcional."
      },
      {
        "letter": "B",
        "text": "A reintegração corresponde ao retorno do servidor anteriormente demitido ao cargo público em decorrência da invalidação de sua demissão, observadas as condições previstas no regime jurídico aplicável."
      },
      {
        "letter": "C",
        "text": "A estabilidade é adquirida automaticamente no momento da nomeação, independentemente do cumprimento de requisitos constitucionais."
      },
      {
        "letter": "D",
        "text": "A aposentadoria constitui modalidade de provimento originário, pois representa o ingresso inicial do servidor em determinado cargo público."
      },
      {
        "letter": "E",
        "text": "A readaptação corresponde exclusivamente ao retorno de servidor aposentado ao exercício de suas atividades funcionais."
      }
    ],
    "answer": "B"
  },
  {
    "id": "tec-q8",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 8,
    "stem": "(2026) O artigo 37, caput, da Constituição Federal de 1988 estabelece os princípios expressos que orientam a atuação da Administração Pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios. Esses princípios funcionam como parâmetros de validade e legitimidade dos atos administrativos. Assinale a alternativa que apresenta corretamente os cinco princípios expressamente previstos nesse dispositivo constitucional.",
    "options": [
      {
        "letter": "A",
        "text": "Legalidade, supremacia do interesse público, autotutela, razoabilidade e continuidade."
      },
      {
        "letter": "B",
        "text": "Impessoalidade, proporcionalidade, segurança jurídica, motivação e eficiência."
      },
      {
        "letter": "C",
        "text": "Moralidade, publicidade, indisponibilidade do interesse público, hierarquia e especialidade."
      },
      {
        "letter": "D",
        "text": "Legalidade, impessoalidade, moralidade, publicidade e eficiência."
      },
      {
        "letter": "E",
        "text": "Publicidade, eficiência, autotutela, finalidade e presunção de legitimidade."
      }
    ],
    "answer": "D"
  },
  {
    "id": "tec-q9",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 9,
    "stem": "(2026) A Administração Pública possui competência para controlar seus próprios atos, corrigindo ilegalidades e reavaliando determinadas decisões administrativas. A Súmula 473 do Supremo Tribunal Federal estabelece parâmetros para o exercício da autotutela, distinguindo a anulação da revogação dos atos administrativos. Considerando esse entendimento, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A Administração pode anular atos ilegais e revogar atos válidos por motivos de conveniência ou oportunidade, respeitados os direitos adquiridos e ressalvada a apreciação judicial."
      },
      {
        "letter": "B",
        "text": "A revogação dos atos administrativos ocorre exclusivamente quando identificada ilegalidade insanável em sua formação."
      },
      {
        "letter": "C",
        "text": "A anulação constitui instrumento de controle de mérito administrativo, sendo utilizada quando o ato se torna inconveniente ao interesse público."
      },
      {
        "letter": "D",
        "text": "Somente o Poder Judiciário possui competência para anular atos administrativos, ainda que a própria Administração reconheça sua ilegalidade."
      },
      {
        "letter": "E",
        "text": "Os atos administrativos vinculados podem ser livremente revogados sempre que houver mudança na orientação política do Governo."
      }
    ],
    "answer": "A"
  },
  {
    "id": "tec-q10",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 10,
    "stem": "(2026) Os poderes administrativos são instrumentos jurídicos utilizados pela Administração Pública para organizar seus serviços, disciplinar condutas, regulamentar a execução das leis e proteger interesses coletivos. O exercício dessas prerrogativas deve observar os limites legais e a finalidade pública. Considerando o poder de polícia administrativa, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O poder de polícia permite à Administração impor restrições arbitrárias aos direitos individuais, independentemente de previsão legal."
      },
      {
        "letter": "B",
        "text": "A autoexecutoriedade autoriza a execução direta de qualquer medida administrativa, sem necessidade de observar condições legais."
      },
      {
        "letter": "C",
        "text": "O poder de polícia permite limitar ou condicionar o exercício de direitos, liberdades e propriedades em benefício da coletividade, observados legalidade, finalidade, razoabilidade e proporcionalidade."
      },
      {
        "letter": "D",
        "text": "O poder de polícia é exercido exclusivamente pelo Poder Judiciário, mediante decisões destinadas à proteção da ordem pública."
      },
      {
        "letter": "E",
        "text": "A coercibilidade elimina a possibilidade de controle judicial das medidas administrativas impostas aos particulares."
      }
    ],
    "answer": "C"
  },
  {
    "id": "tec-q11",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 11,
    "stem": "(2026) Os atos administrativos apresentam requisitos essenciais de validade, cuja observância é indispensável para assegurar a conformidade da atuação estatal com o ordenamento jurídico. Entre esses requisitos estão competência, finalidade, forma, motivo e objeto. Considerando especificamente a distinção entre motivo e motivação do ato administrativo, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O motivo corresponde à manifestação formal da decisão administrativa, enquanto a motivação representa exclusivamente seus efeitos patrimoniais."
      },
      {
        "letter": "B",
        "text": "O motivo consiste nos pressupostos de fato e de direito que fundamentam a prática do ato, enquanto a motivação corresponde à exposição desses fundamentos pela Administração."
      },
      {
        "letter": "C",
        "text": "A motivação substitui a competência administrativa e permite que qualquer agente pratique atos fora de suas atribuições legais."
      },
      {
        "letter": "D",
        "text": "O motivo corresponde à finalidade pública genérica, sendo dispensável a existência de circunstâncias concretas que justifiquem a prática do ato."
      },
      {
        "letter": "E",
        "text": "A motivação impede o controle de legalidade, pois as justificativas apresentadas pelo administrador não podem ser examinadas por órgãos de fiscalização."
      }
    ],
    "answer": "B"
  },
  {
    "id": "tec-q12",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 12,
    "stem": "(2026) A responsabilidade civil do Estado constitui mecanismo jurídico destinado à reparação de danos causados aos particulares em razão da atuação estatal. O artigo 37, § 6º, da Constituição Federal de 1988 estabelece fundamentos relevantes para a responsabilização das pessoas jurídicas de Direito Público e das pessoas jurídicas de Direito Privado prestadoras de serviços públicos. Considerando a teoria do risco administrativo, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A responsabilidade objetiva exige necessariamente a comprovação de dolo ou culpa do agente público pela vítima."
      },
      {
        "letter": "B",
        "text": "A responsabilidade civil do Estado é integral e absoluta, não admitindo causas excludentes ou atenuantes em nenhuma circunstância."
      },
      {
        "letter": "C",
        "text": "A culpa concorrente da vítima afasta automaticamente qualquer obrigação indenizatória do Estado."
      },
      {
        "letter": "D",
        "text": "O direito de regresso contra o agente público independe da demonstração de dolo ou culpa, pois sua responsabilidade pessoal é sempre objetiva."
      },
      {
        "letter": "E",
        "text": "Na responsabilidade objetiva, a vítima deve demonstrar a conduta estatal, o dano e o nexo causal, sendo dispensada, em regra, da comprovação de culpa do agente, sem prejuízo da análise de eventuais causas excludentes ou atenuantes."
      }
    ],
    "answer": "E"
  },
  {
    "id": "tec-q13",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 13,
    "stem": "(2026) A Constituição Federal de 1988 estabelece instrumentos destinados à proteção dos direitos e garantias fundamentais. Entre eles, o artigo 5º, inciso LXXII, prevê o habeas data, regulamentado pela Lei nº 9.507/1997. Considerando a finalidade desse remédio constitucional, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O habeas data destina-se a assegurar o conhecimento de informações relativas à pessoa do impetrante constantes de registros ou bancos de dados de entidades governamentais ou de caráter público, bem como a retificação de dados nas condições constitucionalmente previstas."
      },
      {
        "letter": "B",
        "text": "O habeas data é utilizado exclusivamente para proteger a liberdade de locomoção diante de prisão ilegal ou ameaça de constrangimento."
      },
      {
        "letter": "C",
        "text": "O habeas data permite que qualquer pessoa obtenha irrestritamente informações pessoais de terceiros, independentemente da finalidade do pedido."
      },
      {
        "letter": "D",
        "text": "O habeas data é o instrumento constitucional destinado à anulação de atos lesivos ao patrimônio público, podendo ser proposto por qualquer cidadão."
      },
      {
        "letter": "E",
        "text": "O habeas data substitui o mandado de injunção sempre que houver ausência de norma regulamentadora necessária ao exercício de direitos constitucionais."
      }
    ],
    "answer": "A"
  },
  {
    "id": "tec-q14",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 14,
    "stem": "(2026) A redação oficial constitui instrumento de comunicação utilizado pelos órgãos e entidades públicas para transmitir informações, solicitar providências, registrar decisões e formalizar atos institucionais. Sua elaboração exige observância de características linguísticas que favoreçam a compreensão, a uniformidade e a finalidade administrativa dos documentos. Assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A redação oficial deve privilegiar expressões rebuscadas e construções excessivamente longas, pois a complexidade vocabular demonstra maior autoridade institucional."
      },
      {
        "letter": "B",
        "text": "A impessoalidade permite ao redator inserir preferências pessoais e opiniões subjetivas em documentos administrativos, desde que utilize linguagem formal."
      },
      {
        "letter": "C",
        "text": "A concisão corresponde à eliminação de informações essenciais, independentemente de prejuízo à compreensão do destinatário."
      },
      {
        "letter": "D",
        "text": "A redação oficial deve observar clareza, concisão, impessoalidade, formalidade e padronização, utilizando linguagem adequada à transmissão objetiva das informações administrativas."
      },
      {
        "letter": "E",
        "text": "A padronização deve ser evitada nas comunicações oficiais, pois compromete a identidade individual de cada servidor responsável pela elaboração do documento."
      }
    ],
    "answer": "D"
  },
  {
    "id": "tec-q15",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 15,
    "stem": "(2026) A arquivologia estabelece princípios e técnicas destinados à organização, à preservação e à recuperação dos documentos produzidos e recebidos pelas instituições. Entre esses fundamentos, destaca-se o princípio da proveniência, essencial para a manutenção do contexto de produção documental e para a preservação da identidade dos conjuntos arquivísticos. Assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O princípio da proveniência determina que todos os documentos sejam reunidos exclusivamente por assunto, independentemente da instituição responsável por sua produção."
      },
      {
        "letter": "B",
        "text": "A proveniência autoriza a mistura de documentos de diferentes produtores sempre que apresentarem semelhança temática."
      },
      {
        "letter": "C",
        "text": "O princípio da proveniência estabelece que os documentos de uma mesma origem devem permanecer vinculados ao respectivo produtor, preservando sua identidade e seu contexto de produção."
      },
      {
        "letter": "D",
        "text": "A aplicação da proveniência exige que os documentos sejam eliminados após o encerramento de sua utilização administrativa imediata."
      },
      {
        "letter": "E",
        "text": "O princípio da proveniência é aplicável exclusivamente a documentos digitais, não alcançando arquivos físicos ou conjuntos documentais históricos."
      }
    ],
    "answer": "C"
  },
  {
    "id": "tec-q16",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 16,
    "stem": "(2026) O protocolo desempenha papel fundamental na gestão de documentos administrativos, pois permite acompanhar sua entrada, sua movimentação e seu encaminhamento dentro de uma instituição. A adequada execução das atividades de protocolo contribui para a rastreabilidade dos processos, a segurança das informações e o cumprimento dos prazos administrativos. Considerando essas atribuições, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "As atividades de protocolo compreendem o recebimento, o registro, a classificação inicial, a distribuição e o controle da tramitação documental, permitindo acompanhar a localização e o andamento dos documentos."
      },
      {
        "letter": "B",
        "text": "O protocolo possui como única finalidade eliminar documentos considerados desnecessários, dispensando o registro de sua movimentação."
      },
      {
        "letter": "C",
        "text": "O controle de tramitação deve ser realizado exclusivamente pelo interessado externo, não cabendo à Administração acompanhar os documentos recebidos."
      },
      {
        "letter": "D",
        "text": "O registro de documentos no protocolo impede sua transferência entre setores, pois estabelece localização administrativa permanente."
      },
      {
        "letter": "E",
        "text": "A utilização de sistemas eletrônicos de protocolo torna desnecessárias a identificação documental, a rastreabilidade e a observância dos procedimentos internos."
      }
    ],
    "answer": "A"
  },
  {
    "id": "tec-q17",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 17,
    "stem": "(2026) O atendimento ao público e as relações interpessoais no ambiente profissional exigem habilidades de comunicação, respeito, empatia e capacidade de resolução de problemas. Em uma unidade administrativa, determinado usuário apresenta uma reclamação sobre a demora na conclusão de um procedimento. O servidor responsável precisa conduzir o atendimento de maneira eficiente e profissional. Considerando as boas práticas de comunicação e relacionamento interpessoal, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "O servidor deve interromper a manifestação do usuário para evitar prolongamento do atendimento, apresentando imediatamente a justificativa institucional."
      },
      {
        "letter": "B",
        "text": "A solução mais adequada consiste em transferir a reclamação a outro setor sem fornecer orientações, evitando assumir qualquer responsabilidade pelo acompanhamento."
      },
      {
        "letter": "C",
        "text": "O atendimento eficiente exige tratamento padronizado e inflexível, desconsiderando as necessidades específicas de cada usuário."
      },
      {
        "letter": "D",
        "text": "A comunicação profissional deve priorizar exclusivamente a transmissão de informações, sendo desnecessária a confirmação de que o usuário compreendeu as orientações."
      },
      {
        "letter": "E",
        "text": "O servidor deve praticar escuta ativa, demonstrar empatia, identificar a necessidade apresentada, fornecer informações claras e buscar encaminhamento adequado, respeitando os limites de sua competência."
      }
    ],
    "answer": "E"
  },
  {
    "id": "tec-q18",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 18,
    "stem": "(2026) A receita pública representa importante instrumento de financiamento das atividades estatais, permitindo a execução de políticas públicas e a manutenção dos serviços administrativos. Sua realização envolve procedimentos que podem compreender previsão, lançamento, arrecadação e recolhimento, conforme a natureza da receita. Considerando essas etapas, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "A previsão corresponde ao recebimento efetivo dos recursos financeiros diretamente na conta do Tesouro Público."
      },
      {
        "letter": "B",
        "text": "A previsão estima os valores a serem arrecadados; o lançamento identifica, quando cabível, os elementos da obrigação; a arrecadação corresponde ao recebimento dos recursos; e o recolhimento consiste em sua transferência ao Tesouro."
      },
      {
        "letter": "C",
        "text": "O lançamento constitui etapa obrigatória para todas as receitas públicas, inclusive aquelas que não envolvem identificação de devedor ou obrigação tributária."
      },
      {
        "letter": "D",
        "text": "A arrecadação ocorre exclusivamente após o encerramento do exercício financeiro, quando são consolidadas as contas públicas."
      },
      {
        "letter": "E",
        "text": "O recolhimento corresponde à elaboração da proposta orçamentária, não envolvendo movimentação efetiva de recursos financeiros."
      }
    ],
    "answer": "B"
  },
  {
    "id": "tec-q19",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 19,
    "stem": "(2026) A higiene e a segurança no ambiente de trabalho envolvem medidas destinadas à prevenção de acidentes, doenças ocupacionais e exposição dos trabalhadores a diferentes agentes de risco. Em ambientes hospitalares, a identificação dos riscos e a adoção de procedimentos preventivos são fundamentais para proteger profissionais, pacientes e demais pessoas que circulam pelas instalações. Considerando os riscos ocupacionais e as medidas preventivas, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Os riscos biológicos decorrem exclusivamente da exposição a ruídos, temperaturas extremas e radiações presentes no ambiente hospitalar."
      },
      {
        "letter": "B",
        "text": "Os riscos químicos estão associados apenas a conflitos interpessoais e situações de sobrecarga emocional."
      },
      {
        "letter": "C",
        "text": "A utilização de equipamentos de proteção individual elimina a necessidade de treinamento, protocolos operacionais e demais medidas preventivas."
      },
      {
        "letter": "D",
        "text": "Os riscos biológicos incluem exposição a vírus, bactérias e fungos; os riscos químicos envolvem contato com substâncias potencialmente nocivas; e a prevenção exige medidas adequadas às características de cada atividade."
      },
      {
        "letter": "E",
        "text": "Os riscos psicossociais não possuem relação com a saúde ocupacional, pois não produzem consequências sobre o desempenho e o bem-estar dos trabalhadores."
      }
    ],
    "answer": "D"
  },
  {
    "id": "tec-q20",
    "subject": "Conhecimentos Específicos — Técnico",
    "qnum": 20,
    "stem": "(2026) A fotografia institucional constitui recurso de documentação, comunicação e preservação da memória organizacional. Sua utilização exige cuidados técnicos, éticos e administrativos, especialmente quando envolve imagens de pessoas, informações reservadas e acontecimentos que precisam ser representados com fidelidade. Considerando a Lei nº 13.709/2018, Lei Geral de Proteção de Dados Pessoais (LGPD) , quando aplicável, e as boas práticas de gestão de imagens institucionais, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Toda fotografia produzida em atividade institucional pode ser divulgada livremente, independentemente da existência de dados pessoais ou informações reservadas."
      },
      {
        "letter": "B",
        "text": "A edição de fotografias institucionais permite remover ou acrescentar pessoas e objetos para tornar o acontecimento visualmente mais favorável à organização."
      },
      {
        "letter": "C",
        "text": "A utilização de fotografias institucionais deve respeitar a finalidade do registro, os direitos de imagem e privacidade, a proteção de dados pessoais e a fidelidade aos acontecimentos documentados, mantendo controles adequados sobre os arquivos originais e as versões de divulgação."
      },
      {
        "letter": "D",
        "text": "A preservação de fotografias institucionais exige manter exclusivamente as versões publicadas, eliminando imediatamente os arquivos originais de captura."
      },
      {
        "letter": "E",
        "text": "As legendas institucionais podem atribuir livremente intenções, emoções e resultados às pessoas retratadas, mesmo quando essas informações não tenham sido verificadas."
      }
    ],
    "answer": "C"
  }
];
