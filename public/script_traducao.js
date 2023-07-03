function setLanguage(lang) {
  const translations = {
    "CACB": {
      "pt": "Centro Académico Clínico das Beiras",
      "en": "Clinical Academic Center of Beiras"
    },
    "CA":{
      "pt": "CENTRO ACADÉMICO",
      "en": "CLINICAL ACADEMIC"
    },
    "CB":{
      "pt": "CLÍNICO DAS BEIRAS",
      "en": "CENTER OF BEIRAS"
    },
    "ver_mais": {
      "pt": "Ver mais",
      "en": "See more"
    },
    "dizem":{
      "pt": "O que dizem sobre nós",
      "en": "What they are saying about us"
    },
    "nav_agenda":{
      "pt":"Agenda",
      "en":"Agenda"
    },
    "nav_eventos":{
      "pt": "Eventos",
      "en": "Events"
    },
    "nav_formacao":{
      "pt": "Formação",
      "en": "Training"
    },
    "nav_informacao":{
      "pt": "Informação",
      "en": "Information"
    },
    "nav_noticias":{
      "pt": "Notícias",
      "en": "Media"
    },
    "nav_testemunhos":{
      "pt": "Testemunhos",
      "en": "Outcomes"
    },
    "nav_ensaios":{
      "pt": "Ensaios Clínicos",
      "en": "Clinical Trials"
    },
    "nav_contactos":{
      "pt": "Contactos",
      "en": "Contacts"
    },
    "nav_sobre":{
      "pt": "Sobre Nós",
      "en": "About Us"
    },
    "nav_instituicoes":{
      "pt": "Instituições",
      "en": "Institutions"
    },
    "nav_marca":{
      "pt": "Marca Gráfica",
      "en": "Graphic Brand"
    },
    "nav_visao":{
      "pt": "Visão e Missão",
      "en": "Our Vision and Mission"
    },
    "nav_info":{
      "pt": "Informação Legal",
      "en": "Legal Information"
    },
    "nav_plano":{
      "pt": "Plano de Atividades",
      "en": "Plan of Activities"
    },
    "nav_politica":{
      "pt": "Política de Privacidade",
      "en": "Privacy Policy"
    },
    "nav_relatorio":{
      "pt": "Relatório",
      "en": "Report"
    },
    "nav_linhas":{
      "pt":"Linhas de Ação",
      "en": "Courses of Action"
    },
    "nav_grupos":{
      "pt":"Grupos de Missão",
      "en": "Mission Groups"
    },
    "nav_organigramas":{
      "pt":"Organogramas",
      "en": "Organograms"
    },
    "c2icb":{
      "pt":"Centro de Coordenação de Investigação Clínica das Beiras",
      "en":"Beiras Clinical Research Coordination Centre"
    },
    /*TRADUÇÕES DA VISÃO E MISSÃO*/
    "frase1_visao": {
      "pt": "A Visão estratégica do CACB está definida num sentido claro:",
      "en": "The strategic Vision of the CACB is defined in a clear sense:"
    },
    "frase2_visao": {
        "pt": "“Ser um Centro de Excelência, fortemente capacitado para a formação e investigação na área da Saúde, com base em dinâmicas de inovação e competitividade, qualidade, eficiência e eficácia de processos, e que contribua para a melhoria dos indicadores de saúde das regiões envolvidas e do país.”",
        "en": "“To be a Center of Excellence, strongly capacitated for training and research in the area of Health, based on dynamics of innovation and competitiveness, quality, efficiency and effectiveness of processes, and that contributes to the improvement of health indicators of the regions involved and the country.”"
    },
    "frase3_visao":{
      "pt": "A Missão do CACB, no âmbito referencial da legislação ligada à sua criação, consiste em:",
      "en": "The Mission of the CACB, within the referential framework of the legislation linked to its creation, consists of:"
    },
    "frase4_visao":{
      "pt": "“Assumir um dever público tripartido integrado, de elevado rigor, qualidade e responsabilidade social em que se inclui:",
      "en": "“To assume an integrated tripartite public duty of high rigor, quality and social responsibility in which it includes:"
    },
    "frase5_visao":{
      "pt": "Ensino pré- e pós-graduado, bem como treino e formação de profissionais de saúde;",
      "en": "Pre- and post-graduate education, as well as training and education of health professionals;"
    },
    "frase6_visao":{
      "pt": "Investigação na área da Saúde, com impacto prático nacional e internacional;", 
      "en": "Research in the area of Health, with national and international practical impact;"
   },
   "frase7_visao":{
    "pt": "Reflexo na prestação de cuidados de saúde de elevada eficiência, centrados no doente.”",
    "en": "It reflects in the delivery of high-efficiency, patient-centered healthcare.”"
   },
   /*SOBRE NÓS*/
   "texto1_sobre":{
    "pt":"O Centro Académico Clínico das Beiras, adiante designado CACB, tem como principal missão a promoção do desenvolvimento de melhorias na prestação de cuidados de saúde, das práticas de investigação e do ensino e formação de profissionais altamente qualificados, diferenciados e competentes.  A visão do CACB assenta em ser um centro de excelência, fortemente capacitado para a formação e investigação na área da Saúde, com base em dinâmicas de inovação, de competitividade e de qualidade capaz de contribuir para a melhoria dos indicadores de saúde das regiões envolvidas e do país.",
    "en":"The Clinical Academic Center of Beiras, hereinafter referred to as CACB, has as its main mission the promotion of the development of improvements in health care provision, research practices and the teaching and training of highly qualified, differentiated and competent professionals.  The vision of the CACB is based on being a center of excellence, strongly capacitated for training and research in Health, based on innovation, competitiveness and quality dynamics capable of contributing to the improvement of health indicators of the regions involved and of the country."
   },
   "apresentacao":{
    "pt":"Apresentação",
    "en":"Presentation"
   },
   "texto2_sobre":{
    "pt":"Criado em Abril de 2017 através da Portaria n.º 130/2017, o CACB – Centro Académico Clínico das Beiras é um consórcio entre diversas instituições de saúde e de ensino.",
    "en": "Created in April 2017 through Ordinance No. 130/2017, the CACB - Centro Académico Clínico das Beiras is a consortium between several health and educational institutions."
   },
   "texto3_sobre":{
    "pt":"Ao reunir instituições de ensino superior com cursos na área da Saúde (Medicina, Ciências Farmacêuticas, Enfermagem, Ciências Biomédicas, Optometria/Ciências da Visão, Tecnologias da Saúde), bem como unidades de saúde dos vários tipos de cuidados (primários, secundários e paliativos), o CACB está numa posição ímpar para criar projetos integradores de excelência, com forte impacto na prevenção da doença, bem como na prestação de cuidados de saúde com forte impacto, em termos de qualidade, centrados no doente.",
    "en":"By bringing together higher education institutions with degrees in Health Care (Medicine, Pharmaceutical Sciences, Nursing, Biomedical Sciences, Optometry/Sight Sciences, Health Technologies), as well as health care units from various types of care (primary, secondary and palliative care), the CACB is in a unique position to create integrative projects of excellence, with a strong impact on disease prevention, as well as on the provision of health care with a strong impact, in terms of quality, centered on the patient."
   },
   "texto4_sobre":{
    "pt":"O CACB tem uma ideia precisa acerca da forma como deseja evoluir e que será, muito claramente, no sentido de desenvolver abordagens integradas de ação com impacto na prestação de cuidados de saúde de todos os níveis, através de eixos que envolvem a formação pré e pós-graduada bem como a formação da comunidade em geral, e a investigação, inovação e desenvolvimento.",
    "en": "The CACB has a precise idea about the way it wants to evolve, and that will be, very clearly, towards developing integrated approaches for action with an impact on health care delivery at all levels, through axes that involve pre- and post-graduate training as well as training the community at large, and research, innovation, and development."
   },
   "texto5_sobre":{
    "pt":"O Regime Jurídico dos Centros Académicos Clínicos - Decreto-Lei 61/2018, de 3 de agosto, orienta o funcionamento dos centros académicos clínicos como estruturas integradas de atividade assistencial, ensino e investigação clínica e de translação, que associam unidades prestadoras de cuidados de saúde, instituições de ensino superior e/ou instituições de investigação públicas ou privadas.",
    "en": "The Legal Regime of Clinical Academic Centers - Decree-Law 61/2018, of August 3, guides the operation of clinical academic centers as integrated structures of care, teaching, and clinical and translational research activities, which associate healthcare facilities, higher education institutions, and/or public or private research institutions."
   },
   "texto6_sobre":{
    "pt": "Com o objetivo de estimular e apoiar o desenvolvimento coordenado da atividade dos diferentes Centros Académicos Clínicos foi criado o Conselho Nacional dos Centros Académicos Clínicos - Resolução do Conselho de Ministros n.º 22/2016.",
    "en":"In order to stimulate and support the coordinated development of the activity of the different Clinical Academic Centres, the National Council of Clinical Academic Centres was created - Council of Ministers Resolution no. 22/2016." 
   },
   "texto7_sobre":{
    "pt": "A nível organizacional o CACB conta com dois Conselhos: o Conselho Diretivo, com capacidade de decisão, e o Conselho Estratégico, com papel orientador da ação. Foram criadas duas Comissões: a Comissão de Ensino e Formação Pré e Pós-Graduada (CEF) e a Comissão de Investigação e Desenvolvimento (CID), constituídas por profissionais nomeados de todas as instituições do consórcio, para trabalharem em conjunto nestas temáticas.",
    "en": "At the organisational level, the CACB has two Boards: the Steering Committee, with decision-making capacity, and the Strategic Board, with the role of guiding action.Two Commissions have been created: the Commission for Pre- and Post-Graduate Education and Training (CEF) and the Commission for Research and Development (CID), made up of appointed professionals from all the institutions in the consortium, to work together on these themes."
   },
   "texto8_sobre":{
    "pt": "À data atual o CACB é constituído da seguinte forma:",
    "en": "At the current date the CACB is made up as follows:"
   },
   "conselho_d":{
    "pt": "Conselho Diretivo",
    "en": "Board of Directors"
   },
   "conselho_e":{
    "pt": "Conselho Estratégico",
    "en": "Strategic Board"
   },
   "representacao_da":{
    "pt": "Em representação da",
    "en": "Representing the"
   },
   "representacao_do":{
    "pt": "Em representação do",
    "en": "Representing the"
   },
   "presidente_cd":{
    "pt": "Presidente do Conselho Diretivo",
    "en": "President of the Board of Directors"
   },
   "presidente_ce":{
    "pt": "Presidente do Conselho Estratégico",
    "en": "President of the Strategic Board"
   },
   "membro_co":{
    "pt": "Membro Cooptado",
    "en": "Co-opted Member" 
   },
   "comissao_efppg":{
    "pt": "Comissão de Ensino e Formação Pré e Pós-Graduada",
    "en": "Commission for Pre- and Post-Graduate Education and Training"
   },
   "comissao_cid":{
    "pt": "Comissão de Investigação e Desenvolvimento",
    "en": "Research and Development Committee"
   },
   "imagem_info":{
    "pt": "Imagem Informativa",
    "en": "Informative Image"
   },
   "criacao":{
    "pt": "Criação do CACB",
    "en": "Creation of the CACB"
   },
   /*INSTITUIÇÕES*/
   "int_inst":{
    "pt": "O Centro Académico Clínico das Beiras (CACB) é um consórcio, criado por decreto governamental - Portaria n.º 130/2017, constituído pelas seguintes instituições:",
    "en": "The Centro Académico Clínico das Beiras (CACB) is a consortium, created by government decree - Portaria n.º 130/2017, consisting of the following institutions:"
   },
   "inst1":{
    "pt":"através da Faculdade de Ciências da Saúde e do Centro de Investigação em Ciências da Saúde",
    "en":"through Faculdade de Ciências da Saúde and Centro de Investigação em Ciências da Saúde"
   },
   "inst4":{
    "pt":"através da Escola Superior de Saúde Dr. Lopes Dias",
    "en":"through Escola Superior de Saúde Dr. Lopes Dias"
   },
   "inst5":{
    "pt":"através da Escola Superior de Saúde",
    "en":"through Escola Superior de Saúde"
   },
   "inst6":{
    "pt":"através da Escola Superior de Saúde",
    "en":"through Escola Superior de Saúde"
   }, 
   "inst7":{
    "pt":"Foram igualmente convidados os Agrupamentos de Centros de Saúde (ACeS) Dão-Lafões e Cova da Beira e a Administração Regional do Centro (ARS Centro), neste Conselho, através dos ACeS Dão-Lafões e Cova da Beira, em aditamento à Portaria 130/2017, de 7 de Abril, que criou o CACB.",
    "en":"The Agrupamentos de Centros de Saúde (ACeS) Dão-Lafões and Cova da Beira and the Administração Regional do Centro (ARS Centro) were also invited to this Council, through the ACeS Dão-Lafões and Cova da Beira, in addition to Ordinance 130/2017, of April 7, which created the CACB."
   },
   "inst8":{
    "pt": "E conta com o apoio do C2ICB – Centro de Coordenação de Investigação Clínica das Beiras no âmbito dos ensaios clínicos, estudos e projetos.",
    "en": "And it has the support of C2ICB - Centro de Coordenação de Investigação Clínica das Beiras in the scope of clinical trials, studies and projects."
   },
   /*CONTACTOS E LOCALIZAÇÃO*/
   "nav_contloc":{
    "pt": "Contactos e Localização",
    "en": "Contacts and Location"
   },
   "presidente":{
    "pt": "Presidente do Conselho Diretivo",
    "en": "President of the Board of Directors"
   }, 
   "nome_presidente":{
    "pt":"Professor Doutor Miguel Castelo-Branco",
    "en":"Professor Doctor Miguel Castelo-Branco"
   },
   "chamadas":{
    "pt":"(As chamadas efetuadas para os números externos que constam desta lista/página serão taxadas ao preço de uma comunicação para a rede fixa nacional.)",
    "en":"(Calls made to the external numbers on this list/page will be charged at the price of a communication to the national fixed network)."
   },
   "coordenadas":{
    "pt":"Coordenadas GPS:",
    "en":"GPS Coordinates:"
   },
   /*GRUPOS DE MISSÃO*/
   "missoes_int":{
    "pt": "Numa vertente mais prática, o CACB criou Missões, que representam as linhas de ação principais para a intervenção do CACB, e são grupos constituídos por diferentes profissionais das várias instituições do CACB, que têm como objetivo colaboram em conjunto em atividades para a comunidade e na criação de projetos no âmbito das seguintes temáticas:",
    "en": "On a more practical side, the CACB created Missions, which represent the main lines of action for the intervention of the CACB, and are groups made up of different professionals from the various institutions of the CACB, which aim to collaborate together in activities for the community and in the creation of projects within the following themes:"
   },
   "missao_de":{
    "pt": "Missão Demências;",
    "en": "Mission Dementias;"
   },
   "missao_di":{
    "pt": "Missão Diabetes;",
    "en": "Mission Diabetes;"
   },
   "missao_avc":{
    "pt": "Missão AVC e FRCCV;",
    "en": "AVC Mission and FRCCV;"
   },
   "missao_docva":{
    "pt": "Missão Doenças Obstrutivas Crónicas das Vias Aéreas;",
    "en": "Mission Chronic Obstructive Airways Diseases;"
   },
   "missao_c":{
    "pt": "Missão Cancro;",
    "en": "Mission Cancer;"
   },
   "missao_prt":{
    "pt": "Missão Problemas Relacionados com Toxicofilias;",
    "en": "Mission Problems Related to Toxicophilia;"
   }, 
   "missoes_texto":{
    "pt": "As Missões são constituídas pelos seguintes profissionais:",
    "en": "The Missions are made up of the following professionals:"
   }, 
   "coordenadora":{
    "pt": "(Coordenadora)",
    "en": "(Coordinator)"
   },
   "coordenador":{
    "pt": "(Coordenador)",
    "en": "(Coordinator)"
   },
   "membro_conv":{
    "pt": "(Membro convidado)",
    "en": "(Invited Member)"
   },
   /*C2ICB*/
   "text1_c2icb":{
    "pt": "O Centro de Coordenação de Investigação Clínica das Beiras (C2ICB) em estreita articulação com o Centro Académico Clínico das Beiras, visa coordenar uma estrutura multipolar de investigação clínica cuja missão consiste em apoiar o desenvolvimento de medicamentos, dispositivos médicos e aspetos organizacionais.",
    "en":"The Beiras Clinical Research Coordination Centre (C2ICB), in close articulation with the Beiras Clinical Academic Centre, aims to coordinate a multi-polar clinical research structure whose mission is to support the development of medicines, medical devices and organisational aspects."
   },
   "text2_c2icb":{
    "pt": "A equipa multidisciplinar do C2ICB tem como finalidade estimular os profissionais para o desafio da investigação clínica através de ferramentas que facilitam o seu quotidiano:",
    "en": "The multidisciplinary team of C2ICB aims to stimulate professionals to the challenge of clinical research through tools that facilitate their daily lives:"
   },
   "coordenador_c2icb":{
    "pt": "Coordenador",
    "en": "Coordinator"
   },
   "cap_fin":{
    "pt": "Captação de Financiamento",
    "en": "Raising Financing"
  },
  "des_est":{
    "pt": "Desenho do estudo",
    "en": "Study design"
  }, 
  "sub_aut":{
    "pt": "Submissão às autoridades competentes",
    "en": "Submission to the competent authorities"
  },
  "imp_ec":{
    "pt": "Implementação de Ensaios Clínicos e estudos de iniciativa do investigador",
    "en": "Implementation of Clinical Trials and investigator-initiated studies"
  },
  "aco_av":{
    "pt": "Acompanhamento e avaliação dos resultados",
    "en": "Monitoring and evaluation of results"
  },
  "text3_c2icb":{
    "pt": "O C2ICB é um agente facilitador entre os Investigadores, os Promotores, as Entidades Competentes e as Instituições de Saúde. Integram a estrutura multipolar de Investigação Clínica do Interior:",
    "en": "C2ICB is a facilitating agent between Researchers, Promoters, Competent Authorities and Health Institutions. They are part of the multi-polar structure of Clinical Research in the Interior:"
  },
  "morada":{
    "pt": "Morada",
    "en": "Address"
  },
  /*ENSAIOS_CLÍNICOS*/
  "inscrever":{
    "pt": "Para participar num ensaio clínico, contacte-nos.",
    "en": "If you want to participate in a clinical trial, contact us."
  }
  };
  localStorage.setItem('language', lang);
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach((element) => {
    const key = element.getAttribute('data-translate');
    element.innerText = translations[key][lang];
  });
}

// set initial language based on local storage or default to Portuguese
const language = localStorage.getItem('language') || 'pt';
setLanguage(language);

// add event listeners to language links
const engButton = document.getElementById('lang-eng');
const ptButton = document.getElementById('lang-pt');
engButton.addEventListener('click', () => setLanguage('en'));
ptButton.addEventListener('click', () => setLanguage('pt'));




function formatarData(data) {
  const dataObj = new Date(data);
  const dia = dataObj.getDate();
  const mes = dataObj.getMonth() + 1;
  const ano = dataObj.getFullYear();
  return `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${ano}`;
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

