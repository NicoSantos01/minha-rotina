// ==========================================
// CARREGAR HÁBITOS
// ==========================================

let habitos =
    JSON.parse(localStorage.getItem("habitos")) || [];


// ==========================================
// ELEMENTOS
// ==========================================

const lista =
    document.getElementById("listaHabitos");

const modal =
    document.getElementById("modal");

const input =
    document.getElementById("nomeHabito");

const categoria =
    document.getElementById("categoriaHabito");

const telaHoje =
    document.getElementById("telaHoje");

const telaHistorico =
    document.getElementById("telaHistorico");

const diasCalendario =
    document.getElementById("diasCalendario");

const detalhesDia =
    document.getElementById("detalhesDia");

const resumoHabitosDashboard =
    document.getElementById("resumoHabitosDashboard");

const resumoAlimentacaoDashboard =
    document.getElementById("resumoAlimentacaoDashboard");

// ==========================================
// VARIÁVEL DE EDIÇÃO
// ==========================================

let habitoEditando = null;


// ==========================================
// DATA DE HOJE
// ==========================================

function dataHoje() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(hoje.getMonth() + 1)
        .padStart(2, "0");

    const dia =
        String(hoje.getDate())
        .padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// ==========================================
// CRIAR DATA
// ==========================================

function criarData(ano, mes, dia) {

    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

}


// ==========================================
// SALVAR
// ==========================================

function salvarHabitos() {

    localStorage.setItem(
        "habitos",
        JSON.stringify(habitos)
    );

}

// ==========================================
// SISTEMA DE DIAS
// ==========================================

let dias =
    JSON.parse(localStorage.getItem("dias")) || [];


// ==========================================
// SALVAR DIAS
// ==========================================

function salvarDias() {

    localStorage.setItem(
        "dias",
        JSON.stringify(dias)
    );

}


// ==========================================
// OBTER DIA
// ==========================================

function obterDia(data) {

    let dia =
        dias.find(
            item => item.data === data
        );

    if (!dia) {

        dia = {

            data: data,

            manha: {},

            tarde: {},

            noite: {}

        };

        dias.push(dia);

        salvarDias();

    }

    return dia;

}

// Cria o registro do dia atual
obterDia(dataHoje());

// ==========================================
// RESUMO DE HÁBITOS DO DIA
// ==========================================

function obterHabitosDoDia(data) {

  console.log("OBTER HÁBITOS FOI EXECUTADA");
  console.log("Data recebida:", data);
  console.log("Hábitos existentes:", habitos);

  // aqui vamos consultar "habitos"
  const habitosDoDia =
        habitos.filter(
            habito =>
                !habito.arquivado
        );

    const total =
        habitosDoDia.length;

    const concluidos =
        habitosDoDia.filter(
            habito =>
                habito.conclucoes &&
                habito.conclucoes[data]
        ).length;

    const percentual =
        total === 0
            ? 0
            : Math.round(
                (concluidos / total) * 100
            );

    return {

        total: total,

        concluidos: concluidos,

        percentual: percentual,

        lista: habitosDoDia

    };

}

// ==========================================
// RESUMO DE ALIMENTAÇÃO DO DIA
// ==========================================

function obterAlimentacaoDoDia(data) {

    const alimentacao =
        JSON.parse(
            localStorage.getItem("alimentacao")
        ) || {};

    const refeicoesHoje =
        alimentacao[data] || {};

    const refeicoesRegistradas =
        Object.keys(refeicoesHoje).filter(
            refeicao =>
                Array.isArray(refeicoesHoje[refeicao]) &&
                refeicoesHoje[refeicao].length > 0
        );

    const totalRefeicoes =
        refeicoesRegistradas.length;

    const totalItens =
        refeicoesRegistradas.reduce(
            (total, refeicao) =>
                total + refeicoesHoje[refeicao].length,
            0
        );

    return {
        registrada:
            totalRefeicoes > 0,

        refeicoes:
            totalRefeicoes,

        itens:
            totalItens,

        dados:
            refeicoesHoje
    };
}

// ==========================================
// RESUMO DE TREINO DO DIA
// ==========================================

function obterTreinoDoDia(data) {

    const treinoDoDia =
        treinos.find(
            item => item.data === data
        );

    if (!treinoDoDia) {

        return {
            registrado: false,
            dados: null
        };

    }

    return {
        registrado: true,
        dados: treinoDoDia
    };

}

// ==========================================
// RESUMO DE ESTUDOS DO DIA
// ==========================================

function obterEstudosDoDia(data) {

    const estudosDoDia =
        estudos.find(
            item => item.data === data
        );

    if (!estudosDoDia) {

        return {
            registrado: false,
            dados: null
        };

    }

    return {
        registrado: true,
        dados: estudosDoDia
    };

}

 // ==========================================
// RESUMO DE TRABALHO DO DIA
// ==========================================

function obterTrabalhoDoDia(data) {

    const trabalhosDoDia =
        trabalhos.filter(
            trabalho =>
                trabalho.data === data
        );

    return {

        registrado:
            trabalhosDoDia.length > 0,

        total:
            trabalhosDoDia.length,

        lista:
            trabalhosDoDia

    };

}

// ==========================================
// RESUMO DE FINANÇAS DO DIA
// ==========================================

function obterFinancasDoDia(data) {

    const transacoesDoDia =
        transacoes.filter(
            transacao =>
                transacao.data === data
        );

    const entradas =
        transacoesDoDia
            .filter(
                transacao =>
                    transacao.tipo === "entrada"
            )
            .reduce(
                (total, transacao) =>
                    total + Number(transacao.valor || 0),
                0
            );

    const saidas =
        transacoesDoDia
            .filter(
                transacao =>
                    transacao.tipo === "saida"
            )
            .reduce(
                (total, transacao) =>
                    total + Number(transacao.valor || 0),
                0
            );

    const saldo =
        entradas - saidas;

    return {

        registrado:
            transacoesDoDia.length > 0,

        total:
            transacoesDoDia.length,

        entradas:
            entradas,

        saidas:
            saidas,

        saldo:
            saldo,

        lista:
            transacoesDoDia

    };

}

// ==========================================
// RESUMO DE TEMPO DE TELA DO DIA
// ==========================================

function obterTempoDeTelaDoDia(data) {

    const dia =
        obterDia(data);

    const tempoDeTela =
        dia.tempoDeTela;

    if (!tempoDeTela) {

        return {
            registrado: false,
            dados: null
        };

    }

    return {
        registrado: true,
        dados: tempoDeTela
    };

}

// ==========================================
// RESUMO COMPLETO DO DIA
// ==========================================

function obterResumoDoDia(data) {

    return {

        data: data,

        habitos:
            obterHabitosDoDia(data),

        alimentacao:
            obterAlimentacaoDoDia(data),

        treino:
            obterTreinoDoDia(data),

        estudos:
            obterEstudosDoDia(data),

        trabalho:
            obterTrabalhoDoDia(data),

        financas:
            obterFinancasDoDia(data),

        tempoDeTela:
            obterTempoDeTelaDoDia(data)

    };

}

// ==========================================
// DASHBOARD — RESUMO DE HÁBITOS
// ==========================================
function atualizarHabitosDashboard() {

    const resumo =
        obterHabitosDoDia(dataHoje());

    resumoHabitosDashboard.innerHTML = `

        <strong>
            ${resumo.concluidos} de ${resumo.total} concluídos
        </strong>

        <p>
            ${resumo.percentual}%
        </p>

    `;

}

atualizarHabitosDashboard();

// ==========================================
// DASHBOARD — RESUMO DE ALIMENTAÇÃO
// ==========================================
function atualizarAlimentacaoDashboard() {

    const resumo =
        obterAlimentacaoDoDia(dataHoje());

    if (!resumo.registrada) {

        resumoAlimentacaoDashboard.innerHTML = `
            <p>Nenhuma alimentação registrada hoje.</p>
        `;

        return;

    }

    resumoAlimentacaoDashboard.innerHTML = `
        <strong>
            ${resumo.refeicoes} refeições registradas
        </strong>

        <p>
            ${resumo.itens} itens registrados
        </p>
    `;

}

atualizarAlimentacaoDashboard();


// ==========================================
// MOSTRAR DATA ATUAL
// ==========================================
function mostrarData() {

    const hoje =
        new Date();

    document.getElementById(
        "dataAtual"
    ).textContent =

        hoje.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

}

// ==========================================
// CALCULAR SEQUÊNCIA ATUAL
// ==========================================

function calcularSequenciaAtual(habito) {

    if (
        !habito.conclucoes ||
        Object.keys(habito.conclucoes).length === 0
    ) {

        return 0;

    }


    let sequencia = 0;

    const data =
        new Date();


    while (true) {

        const ano =
            data.getFullYear();

        const mes =
            String(data.getMonth() + 1)
            .padStart(2, "0");

        const dia =
            String(data.getDate())
            .padStart(2, "0");


        const dataFormatada =
            `${ano}-${mes}-${dia}`;


        if (
            habito.conclucoes[dataFormatada]
        ) {

            sequencia++;

            data.setDate(
                data.getDate() - 1
            );

        } else {

            break;

        }

    }


    return sequencia;

}


// ==========================================
// CALCULAR MAIOR SEQUÊNCIA
// ==========================================

function calcularMaiorSequencia(habito) {

    if (
        !habito.conclucoes
    ) {

        return 0;

    }


    const datas =
        Object.keys(
            habito.conclucoes
        )
        .filter(
            data =>
                habito.conclucoes[data]
        )
        .sort();


    if (datas.length === 0) {

        return 0;

    }


    let maior = 1;

    let atual = 1;


    for (
        let i = 1;
        i < datas.length;
        i++
    ) {

        const anterior =
            new Date(
                datas[i - 1]
            );

        const atualData =
            new Date(
                datas[i]
            );


        const diferenca =
            (
                atualData -
                anterior
            ) /
            (
                1000 *
                60 *
                60 *
                24
            );


        if (diferenca === 1) {

            atual++;

            if (atual > maior) {

                maior = atual;

            }

        } else {

            atual = 1;

        }

    }


    return maior;

}

// ==========================================
// DASHBOARD
// ==========================================

function atualizarDashboard() {

    atualizarSequenciaGeral();

    atualizarRecordeGeral();

    atualizarDiasCumpridos();

    atualizarAproveitamento();

}


// ==========================================
// SEQUÊNCIA GERAL
// ==========================================

function atualizarSequenciaGeral() {

    if (habitos.length === 0) {

        document.getElementById(
            "sequenciaGeral"
        ).textContent = 0;

        return;

    }


    let sequencia = 0;

    let data =
        new Date();


    while (true) {

        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                data.getDate()
            ).padStart(2, "0");


        const dataFormatada =
            `${ano}-${mes}-${dia}`;


        const algumHabito =
            habitos.some(
                habito =>
                    habito.conclucoes &&
                    habito.conclucoes[dataFormatada]
            );


        if (!algumHabito) {

            break;

        }


        sequencia++;


        data.setDate(
            data.getDate() - 1
        );

    }


    document.getElementById(
        "sequenciaGeral"
    ).textContent =
        sequencia;

}


// ==========================================
// RECORDE GERAL
// ==========================================

function atualizarRecordeGeral() {

    let datas = new Set();


    habitos.forEach(
        habito => {

            if (!habito.conclucoes) {

                return;

            }


            Object.keys(
                habito.conclucoes
            ).forEach(
                data => {

                    if (
                        habito.conclucoes[data]
                    ) {

                        datas.add(data);

                    }

                }
            );

        }
    );


    const lista =
        Array.from(datas).sort();


    if (lista.length === 0) {

        document.getElementById(
            "recordeGeral"
        ).textContent = 0;

        return;

    }


    let maior = 1;

    let atual = 1;


    for (
        let i = 1;
        i < lista.length;
        i++
    ) {

        const anterior =
            new Date(
                lista[i - 1]
            );

        const atualData =
            new Date(
                lista[i]
            );


        const diferenca =
            (
                atualData -
                anterior
            ) /
            (
                1000 *
                60 *
                60 *
                24
            );


        if (diferenca === 1) {

            atual++;

            maior =
                Math.max(
                    maior,
                    atual
                );

        } else {

            atual = 1;

        }

    }


    document.getElementById(
        "recordeGeral"
    ).textContent =
        maior;

}


// ==========================================
// DIAS CUMPRIDOS
// ==========================================

function atualizarDiasCumpridos() {

    const datas = new Set();


    habitos.forEach(
        habito => {

            if (!habito.conclucoes) {

                return;

            }


            Object.keys(
                habito.conclucoes
            ).forEach(
                data => {

                    if (
                        habito.conclucoes[data]
                    ) {

                        datas.add(data);

                    }

                }
            );

        }
    );


    document.getElementById(
        "diasCumpridos"
    ).textContent =
        datas.size;

}


// ==========================================
// APROVEITAMENTO
// ==========================================

function atualizarAproveitamento() {

    if (habitos.length === 0) {

        document.getElementById(
            "aproveitamento"
        ).textContent = "0%";

        return;

    }


    const hoje =
        new Date();


    let totalPossivel = 0;

    let totalConcluido = 0;


    // Últimos 30 dias

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const data =
            new Date(hoje);


        data.setDate(
            hoje.getDate() - i
        );


        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                data.getDate()
            ).padStart(2, "0");


        const dataFormatada =
            `${ano}-${mes}-${dia}`;


        habitos.forEach(
            habito => {

                totalPossivel++;


                if (
                    habito.conclucoes &&
                    habito.conclucoes[
                        dataFormatada
                    ]
                ) {

                    totalConcluido++;

                }

            }
        );

    }


    const porcentagem =
        totalPossivel === 0
            ? 0
            : Math.round(
                (
                    totalConcluido /
                    totalPossivel
                ) * 100
            );


    document.getElementById(
        "aproveitamento"
    ).textContent =
        `${porcentagem}%`;

}


// ==========================================
// SEMANA ATUAL
// ==========================================

function atualizarSemana() {

    const container =
        document.getElementById(
            "semanaAtual"
        );


    container.innerHTML = "";


    const hoje =
        new Date();


    const domingo =
        new Date(hoje);


    domingo.setDate(
        hoje.getDate() -
        hoje.getDay()
    );


    const nomes =
        [
            "Dom",
            "Seg",
            "Ter",
            "Qua",
            "Qui",
            "Sex",
            "Sáb"
        ];


    let diasConcluidos = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const data =
            new Date(domingo);


        data.setDate(
            domingo.getDate() + i
        );


        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                data.getDate()
            ).padStart(2, "0");


        const dataFormatada =
            `${ano}-${mes}-${dia}`;


        const algumHabito =
            habitos.some(
                habito =>
                    habito.conclucoes &&
                    habito.conclucoes[
                        dataFormatada
                    ]
            );


        const elemento =
            document.createElement("div");


        elemento.className =
            "dia-semana-dashboard";


        if (algumHabito) {

            elemento.classList.add(
                "concluido"
            );

            diasConcluidos++;

        }


        if (
            dataFormatada === dataHoje()
        ) {

            elemento.classList.add(
                "hoje"
            );

        }


        elemento.innerHTML = `

            ${nomes[i]}

            <span class="numero">
                ${dia}
            </span>

        `;


        container.appendChild(
            elemento
        );

    }


    const percentual =
        Math.round(
            (
                diasConcluidos / 7
            ) * 100
        );


    document.getElementById(
        "progressoSemana"
    ).textContent =
        `${percentual}% da semana`;

}

// ==========================================
// RENDERIZAR HÁBITOS DE HOJE
// ==========================================

function renderizar() {

    lista.innerHTML = "";

    const hoje =
        dataHoje();

    habitos.forEach(
        (habito, index) => {

            if (habito.arquivado) {
                return;
            }

            const concluidoHoje =
                habito.conclucoes &&
                habito.conclucoes[hoje];


            const div =
                document.createElement("div");


            div.className =
                "habito";


            if (concluidoHoje) {

                div.classList.add(
                    "completed"
                );

            }

            const sequenciaAtual =
              calcularSequenciaAtual(habito);

            const maiorSequencia =
              calcularMaiorSequencia(habito);


            div.innerHTML = `
                <button
                    class="check ${
                        concluidoHoje
                            ? "completed"
                            : ""
                    }">
                </button>
            
                <div class="conteudo-habito">
            
                    <div class="nome">
                        ${habito.nome}
                    
                        <div class="categoria">
                            ${habito.categoria}
                        </div>
                    </div>
            
                    <div class="estatisticas-habito">
            
                        <span class="estatistica">
                            🔥 ${sequenciaAtual} dia${
                                sequenciaAtual !== 1
                                    ? "s"
                                    : ""
                            }
                        </span>
            
                        <span class="estatistica">
                            🏆 ${maiorSequencia} dia${
                                maiorSequencia !== 1
                                    ? "s"
                                    : ""
                            }
                        </span>
            
                    </div>
            
                </div>
            
                <div class="acoes-habito">

                    <button class="subir-habito">
                        ↑
                    </button>
                
                    <button class="descer-habito">
                        ↓
                    </button>

                    <button class="editar-habito">
                        ✏️
                    </button>
                
                    <button class="arquivar-habito">
                        📦
                    </button>
                
                    <button class="excluir-habito">
                        🗑️
                    </button>
                
                </div>
            `;

            div.querySelector(
                ".check"
            ).addEventListener(
                "click",
                () => {

                    if (!habito.conclucoes) {

                        habito.conclucoes = {};

                    }


                    if (
                        habito.conclucoes[hoje]
                    ) {

                        delete habito.conclucoes[hoje];

                    } else {

                        habito.conclucoes[hoje] =
                            true;

                    }


                    salvarHabitos();

                    renderizar();

                }
            );

          // EDITAR HÁBITO
          div.querySelector(
              ".editar-habito"
          ).addEventListener(
              "click",
              () => {
          
                  habitoEditando = habito;
          
                  input.value =
                      habito.nome || "";
          
                  categoria.value =
                      habito.categoria || "Pessoal";
          
                  document.getElementById(
                      "tituloModal"
                  ).textContent =
                      "Editar hábito";
          
                  modal.classList.add(
                      "ativo"
                  );
          
              }
          );

          // ARQUIVAR HÁBITO
          div.querySelector(
              ".arquivar-habito"
          ).addEventListener(
              "click",
              () => {
          
                  habito.arquivado = true;
          
                  salvarHabitos();
          
                  renderizar();
          
              }
          );

          // EXCLUIR HÁBITO
          div.querySelector(
              ".excluir-habito"
          ).addEventListener(
              "click",
              () => {
          
                  const confirmar =
                      confirm(
                          `Tem certeza que deseja excluir "${habito.nome}"?`
                      );
          
                  if (!confirmar) {
                      return;
                  }
          
                  habitos =
                      habitos.filter(
                          item =>
                              item.id !== habito.id
                      );
          
                  salvarHabitos();
          
                  renderizar();
          
                  renderizarCalendario();
          
              }
          );

          div.querySelector(
              ".subir-habito"
          ).addEventListener(
              "click",
              () => {
          
                  const indice =
                      habitos.indexOf(habito);
          
                  if (indice > 0) {
          
                      [
                          habitos[indice - 1],
                          habitos[indice]
                      ] = [
                          habitos[indice],
                          habitos[indice - 1]
                      ];
          
                      salvarHabitos();
          
                      renderizar();
          
                  }
          
              }
          );

          div.querySelector(
              ".descer-habito"
          ).addEventListener(
              "click",
              () => {
          
                  const indice =
                      habitos.indexOf(habito);
          
                  if (
                      indice <
                      habitos.length - 1
                  ) {
          
                      [
                          habitos[indice],
                          habitos[indice + 1]
                      ] = [
                          habitos[indice + 1],
                          habitos[indice]
                      ];
          
                      salvarHabitos();
          
                      renderizar();
          
                  }
          
              }
          );   
              
                lista.appendChild(div);
    
            }
        );

    atualizarDashboard();
    
    atualizarTreinoHoje();

}

function renderizarArquivados() {

    const listaArquivados =
        document.getElementById(
            "listaArquivados"
        );

    listaArquivados.innerHTML = "";

    habitos.forEach(
        (habito) => {

            if (!habito.arquivado) {
                return;
            }

            const div =
                document.createElement("div");

            div.className =
                "habito";

            div.innerHTML = `
                <div class="conteudo-habito">

                    <div class="nome">
                        ${habito.nome}
                    </div>

                </div>

                <div class="acoes-habito">

                    <button class="desarquivar-habito">
                        ↩️
                    </button>

                </div>
            `;

          div.querySelector(
              ".desarquivar-habito"
          ).addEventListener(
              "click",
              () => {
          
                  habito.arquivado = false;
          
                  salvarHabitos();
          
                  renderizar();
          
                  renderizarArquivados();
          
              }
          );

            listaArquivados.appendChild(div);

        }
    );
}

// ==========================================
// PROGRESSO
// ==========================================

function atualizarProgresso() {

    const hoje =
        dataHoje();


    const total =
        habitos.length;


    const concluidos =
        habitos.filter(
            habito =>
                habito.conclucoes &&
                habito.conclucoes[hoje]
        ).length;


    const porcentagem =
        total === 0
            ? 0
            : Math.round(
                (concluidos / total) * 100
            );


    document.getElementById(
        "progressText"
    ).textContent =
        `${porcentagem}%`;

    document.getElementById(
        "inicioProgresso"
    ).textContent =
        `${porcentagem}%`;

    document.getElementById(
        "progressBar"
    ).style.width =
        `${porcentagem}%`;

}


// ==========================================
// VARIÁVEL DO MÊS
// ==========================================

let mesVisualizado =
    new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );


// ==========================================
// DIA SELECIONADO
// ==========================================

let diaSelecionado =
    dataHoje();


// ==========================================
// RENDERIZAR CALENDÁRIO
// ==========================================

function renderizarCalendario() {

    diasCalendario.innerHTML = "";


    const ano =
        mesVisualizado.getFullYear();

    const mes =
        mesVisualizado.getMonth();


    const nomeMes =
        mesVisualizado.toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "mesAtual"
    ).textContent =
        nomeMes;


    // Primeiro dia do mês

    const primeiroDia =
        new Date(
            ano,
            mes,
            1
        ).getDay();


    // Último dia do mês

    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        ).getDate();


    // Espaços antes do primeiro dia

    for (
        let i = 0;
        i < primeiroDia;
        i++
    ) {

        const vazio =
            document.createElement("div");

        vazio.className =
            "dia vazio";

        diasCalendario.appendChild(
            vazio
        );

    }


    // Dias do mês

    for (
        let dia = 1;
        dia <= ultimoDia;
        dia++
    ) {

        const data =
            criarData(
                ano,
                mes,
                dia
            );


        const elemento =
            document.createElement("div");


        elemento.className =
            "dia";


        elemento.textContent =
            dia;


        // ==================================
        // VERIFICAR HÁBITOS DO DIA
        // ==================================

        const quantidade =
            habitos.filter(
                habito =>
                    habito.conclucoes &&
                    habito.conclucoes[data]
            ).length;


        if (quantidade > 0) {

            elemento.classList.add(
                "com-habitos"
            );

        }


        // ==================================
        // HOJE
        // ==================================

        if (data === dataHoje()) {

            elemento.classList.add(
                "hoje"
            );

        }


        // ==================================
        // SELECIONADO
        // ==================================

        if (data === diaSelecionado) {

            elemento.classList.add(
                "selecionado"
            );

        }


        // ==================================
        // CLICAR NO DIA
        // ==================================

        elemento.addEventListener(
            "click",
            () => {

                diaSelecionado =
                    data;

                renderizarCalendario();

                mostrarDetalhesDia();

            }
        );


        diasCalendario.appendChild(
            elemento
        );

    }


    mostrarDetalhesDia();

}


// ==========================================
// DETALHES DO DIA
// ==========================================

function mostrarDetalhesDia() {

    detalhesDia.innerHTML = "";


    const data =
        diaSelecionado;


    const [ano, mes, dia] =
        data.split("-");


    const dataFormatada =
        new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia)
        ).toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );


    const titulo =
        document.createElement("h3");


    titulo.textContent =
        dataFormatada;


    detalhesDia.appendChild(
        titulo
    );


    // ==================================
    // HÁBITOS CONCLUÍDOS
    // ==================================

    const concluidos =
        habitos.filter(
            habito =>
                habito.conclucoes &&
                habito.conclucoes[data]
        );


    // ==================================
    // NENHUM
    // ==================================

    if (concluidos.length === 0) {

        const mensagem =
            document.createElement("p");


        mensagem.className =
            "sem-habitos";


        mensagem.textContent =
            "Nenhum hábito concluído neste dia.";


        detalhesDia.appendChild(
            mensagem
        );


        return;

    }


    // ==================================
    // LISTA
    // ==================================

    concluidos.forEach(
        habito => {

            const div =
                document.createElement("div");


            div.className =
                "habito-historico concluido";


            div.textContent =
                `✓ ${habito.nome}`;


            detalhesDia.appendChild(
                div
            );

        }
    );

}


// ==========================================
// MUDAR MÊS - ANTERIOR
// ==========================================

document.getElementById(
    "mesAnterior"
).addEventListener(
    "click",
    () => {

        mesVisualizado =
            new Date(
                mesVisualizado.getFullYear(),
                mesVisualizado.getMonth() - 1,
                1
            );


        renderizarCalendario();

    }
);


// ==========================================
// MUDAR MÊS - PRÓXIMO
// ==========================================

document.getElementById(
    "mesProximo"
).addEventListener(
    "click",
    () => {

        mesVisualizado =
            new Date(
                mesVisualizado.getFullYear(),
                mesVisualizado.getMonth() + 1,
                1
            );


        renderizarCalendario();

    }
);

// ==========================================
// NOVO HÁBITO
// ==========================================

document.getElementById(
    "btnNovoHabito"
).addEventListener(
    "click",
    () => {

        // Garante que estamos criando
        // um hábito novo
        habitoEditando = null;

        // Limpa o campo
        input.value = "";

        // Volta a categoria para a primeira opção
        categoria.selectedIndex = 0;

        // Volta o título do modal
        document.getElementById(
            "tituloModal"
        ).textContent =
            "Novo hábito";

        // Abre o modal
        modal.classList.add(
            "ativo"
        );

        input.focus();

    }
);

// ==========================================
// CANCELAR NOVO HÁBITO
// ==========================================

document.getElementById(
    "cancelarHabito"
).addEventListener(
    "click",
    () => {

        input.value = "";

        modal.classList.remove(
            "ativo"
        );

        habitoEditando = null;

    }
);

modal.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target === modal
        ) {

            input.value = "";

            modal.classList.remove(
                "ativo"
            );

            habitoEditando = null;

        }

    }
);

// ==========================================
// ARQUIVADOS
// ==========================================

document.getElementById(
    "btnArquivados"
).addEventListener(
    "click",
    () => {

        const area =
            document.getElementById(
                "areaArquivados"
            );

        if (
            area.style.display === "none" ||
            area.style.display === ""
        ) {

            area.style.display =
                "block";

            renderizarArquivados();

        } else {

            area.style.display =
                "none";

        }

    }
);

// ==========================================
// SALVAR HÁBITO
// ==========================================

document.getElementById(
    "salvarHabito"
).addEventListener(
    "click",
    () => {

        const nome =
            input.value.trim();

        if (nome === "") {
            return;
        }

        // EDITANDO UM HÁBITO EXISTENTE
        if (habitoEditando) {

            habitoEditando.nome =
                nome;

            habitoEditando.categoria =
                categoria.value;

            habitoEditando =
                null;

        }

        // CRIANDO UM NOVO HÁBITO
        else {

            habitos.push({

                id:
                    Date.now(),

                nome:
                    nome,

                categoria:
                    categoria.value,

                arquivado:
                    false,

                conclucoes:
                    {}

            });

        }

        salvarHabitos();

        input.value = "";

        modal.classList.remove(
            "ativo"
        );

        document.getElementById(
            "tituloModal"
        ).textContent =
            "Novo hábito";

        renderizar();

        renderizarCalendario();

    }
);

// ==========================================
// INICIALIZAÇÃO
// ==========================================

mostrarData();

renderizar();

renderizarCalendario();

// ==========================================
// NAVEGAÇÃO — INÍCIO
// ==========================================

// ATIVA O BOTÃO SELECIONADO
document.querySelectorAll(
    ".item-navegacao"
).forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                document.querySelectorAll(
                    ".item-navegacao"
                ).forEach(
                    item => {
                        item.classList.remove(
                            "ativo"
                        );
                    }
                );

                botao.classList.add(
                    "ativo"
                );

            }
        );

    }
);

// DEFINE AS TELAS DOS MÓDULOS
const telasModulos = {
    inicio: document.getElementById("telaInicio"),
    habitos: document.getElementById("telaHabitos"),
    alimentacao: document.getElementById("telaAlimentacao"),
    financas: document.getElementById("telaFinancas"),
    treino: document.getElementById("telaTreino"),
    estudos: document.getElementById("telaEstudos"),
    trabalho: document.getElementById("telaTrabalho"),
    metas: document.getElementById("telaMetas"),
    saudeMental: document.getElementById("telaSaudeMental"),
    leitura: document.getElementById("telaLeitura")
};

// ESCONDE TODOS OS MÓDULOS
Object.values(
    telasModulos
).forEach(
    modulo => {
        modulo.style.display = "none";
    }
);

// ABRE O DASHBOARD AO INICIAR
telasModulos.inicio.style.display = "block";

// ELEMENTOS DO MENU
const btnMenu = document.getElementById("btnMenu");
const menuModulos = document.getElementById("menuModulos");

// TROCA ENTRE OS MÓDULOS
document.querySelectorAll(
    ".item-navegacao"
).forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                const tela =
                    botao.dataset.tela;

                Object.values(
                    telasModulos
                ).forEach(
                    modulo => {

                        modulo.style.display =
                            "none";

                    }
                );

                telasModulos[tela].style.display =
                    "block";

                // Fecha o menu lateral
                menuModulos.classList.remove("aberto");

                // Esconde o conteúdo exclusivo do Dashboard
                document.getElementById(
                    "cabecalhoDashboard"
                ).style.display = "none";

                // Esconde somente o texto DASHBOARD
                document.getElementById(
                    "tituloDashboard"
                ).style.display = "none";

            }
        );

    }
);

btnMenu.addEventListener("click", () => {
    menuModulos.classList.add("aberto");
});

const btnVoltarMenu = document.getElementById("btnVoltarMenu");

btnVoltarMenu.addEventListener("click", () => {
    menuModulos.classList.remove("aberto");
});

document.addEventListener("click", (evento) => {
    const clicouDentroDoMenu = menuModulos.contains(evento.target);
    const clicouNoBotaoMenu = btnMenu.contains(evento.target);

    if (
        menuModulos.classList.contains("aberto") &&
        !clicouDentroDoMenu &&
        !clicouNoBotaoMenu
    ) {
        menuModulos.classList.remove("aberto");
    }
});

// ==========================================
// GESTO DE ARRASTAR — MENU LATERAL
// ==========================================

let inicioToqueX = 0;
let inicioToqueY = 0;

const distanciaMinimaMenu = 60;

document.addEventListener("touchstart", (evento) => {

    const toque = evento.touches[0];

    inicioToqueX = toque.clientX;
    inicioToqueY = toque.clientY;

});


document.addEventListener("touchend", (evento) => {

    const toque = evento.changedTouches[0];

    const fimToqueX = toque.clientX;
    const fimToqueY = toque.clientY;

    const deslocamentoX =
        fimToqueX - inicioToqueX;

    const deslocamentoY =
        fimToqueY - inicioToqueY;


    // Ignora movimentos principalmente verticais
    if (
        Math.abs(deslocamentoX) <
        Math.abs(deslocamentoY)
    ) {
        return;
    }


    // ==========================================
    // ABRIR MENU
    // ==========================================

    if (
        deslocamentoX >= distanciaMinimaMenu &&
        inicioToqueX <= 40
    ) {

        menuModulos.classList.add("aberto");

    }


    // ==========================================
    // FECHAR MENU
    // ==========================================

    if (
        deslocamentoX <= -distanciaMinimaMenu &&
        menuModulos.classList.contains("aberto")
    ) {

        menuModulos.classList.remove("aberto");

    }

});

const btnDashboard =
    document.getElementById("btnDashboard");

btnDashboard.addEventListener("click", () => {
    Object.values(telasModulos).forEach(modulo => {
        modulo.style.display = "none";
    });

    telasModulos.inicio.style.display = "block";

    document.getElementById("cabecalhoDashboard").style.display = "block";
    document.getElementById("tituloDashboard").style.display = "inline";

    menuModulos.classList.remove("aberto");

    atualizarAlimentacaoDashboard();
});

// ==========================================
// DASHBOARD
// ==========================================
function atualizarInicio() {

    let maiorSequencia = 0;

    habitos.forEach(
        habito => {

            const sequencia =
                calcularSequenciaAtual(habito);

            if (sequencia > maiorSequencia) {

                maiorSequencia =
                    sequencia;

            }

        }
    );


    document.getElementById(
        "inicioSequencia"
    ).textContent =
        maiorSequencia;

}
function atualizarHabitosInicio() {

    const container =
        document.getElementById(
            "inicioHabitos"
        );

    container.innerHTML = "";

    habitos.forEach(
        habito => {

            if (habito.arquivado) {
                return;
            }

            const concluido =
                habito.conclucoes &&
                habito.conclucoes[dataHoje()];

            const item =
                document.createElement("div");

            item.className =
                "habito-inicio";

            if (concluido) {

                item.classList.add(
                    "concluido"
                );

            }

            item.innerHTML = `
                <span class="check-inicio">
                    ${concluido ? "✓" : "○"}
                </span>
            
                <div class="conteudo-inicio">
            
                    <span class="nome-inicio">
                        ${habito.nome}
                    </span>
            
                    <span class="categoria-inicio">
                        ${habito.categoria}
                    </span>
            
                </div>
            `;

            container.appendChild(item);

        }
    );

}

document.querySelectorAll(
    ".card-modulo-inicio"
).forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const modulo =
                    card.dataset.modulo;


                const botao =
                    document.querySelector(
                        `.item-navegacao[data-tela="${modulo}"]`
                    );


                if (botao) {

                    botao.click();

                }

            }
        );

    }
);

let refeicaoAtual = null;

let alimentosRefeicao = [];

const formularioRefeicao = document.getElementById(
    "formularioRefeicao"
);

const modalRefeicao = document.getElementById(
    "modalRefeicao"
);

const botaoCancelarRefeicao =
    document.getElementById("cancelarRefeicao");

botaoCancelarRefeicao.addEventListener(
    "click",
    () => {

        modalRefeicao.style.display =
            "none";

    }
);

modalRefeicao.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target === modalRefeicao
        ) {

            modalRefeicao.style.display =
                "none";

        }

    }
);

console.log("Modal refeição:", modalRefeicao);

const tituloRefeicao = document.getElementById(
    "tituloRefeicao"
);

document.querySelectorAll(
    ".card-refeicao"
).forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const refeicao =
                    card.dataset.refeicao;

                refeicaoAtual = refeicao;

                const nomeRefeicao = {
                    cafe: "Café da manhã",
                    lanche: "Lanche da manhã",
                    almoco: "Almoço",
                    pre_treino: "Pré-treino",
                    jantar: "Jantar",
                    ceia: "Ceia"
                };

                tituloRefeicao.textContent =
                    nomeRefeicao[refeicao];

                modalRefeicao.style.display =
                    "flex";

            }
        );

    }
);

const botaoSalvarRefeicao = document.getElementById(
    "salvarRefeicao"
);

const campoComidaRefeicao = document.getElementById(
    "comidaRefeicao"
);

const botaoAdicionarAlimento = document.getElementById(
    "adicionarAlimento"
);

const listaAlimentosRefeicao = document.getElementById(
    "listaAlimentosRefeicao"
);

botaoAdicionarAlimento.addEventListener("click", () => {

    const alimento =
        campoComidaRefeicao.value.trim();

    if (alimento === "") {
        alert("Digite um alimento.");
        return;
    }

    alimentosRefeicao.push(alimento);

    campoComidaRefeicao.value = "";

    listaAlimentosRefeicao.innerHTML = "";

    alimentosRefeicao.forEach((alimento, indice) => {

        const item =
            document.createElement("div");
    
        item.className =
            "item-alimento";
    
        item.innerHTML = `
            <span>• ${alimento}</span>
    
            <span
                class="remover-alimento"
                data-indice="${indice}">
                ×
            </span>
        `;
    
        listaAlimentosRefeicao.appendChild(item);
    
    });

});

listaAlimentosRefeicao.addEventListener(
    "click",
    evento => {

        if (
            !evento.target.classList.contains(
                "remover-alimento"
            )
        ) {
            return;
        }

        const indice =
            Number(
                evento.target.dataset.indice
            );

        alimentosRefeicao.splice(
            indice,
            1
        );

        listaAlimentosRefeicao.innerHTML = "";

        alimentosRefeicao.forEach(
            (alimento, indice) => {

                const item =
                    document.createElement("div");

                item.className =
                    "item-alimento";

                item.innerHTML = `
                    <span>• ${alimento}</span>

                    <span
                        class="remover-alimento"
                        data-indice="${indice}">
                        ×
                    </span>
                `;

                listaAlimentosRefeicao.appendChild(
                    item
                );

            }
        );

    }
);

botaoSalvarRefeicao.addEventListener("click", () => {

    if (alimentosRefeicao.length === 0) {
        alert("Adicione pelo menos um alimento.");
        return;
    }

    const hoje = dataHoje();

    let alimentacao = JSON.parse(
        localStorage.getItem("alimentacao")
    ) || {};

    if (!alimentacao[hoje]) {
        alimentacao[hoje] = {};
    }

    alimentacao[hoje][refeicaoAtual] = alimentosRefeicao;

    localStorage.setItem(
        "alimentacao",
        JSON.stringify(alimentacao)
    );

    atualizarResumosAlimentacao();

    alert("Refeição salva!");

    alimentosRefeicao = [];

    campoComidaRefeicao.value = "";

    listaAlimentosRefeicao.innerHTML = "";

    modalRefeicao.style.display =
    "none";

});

const listasAlimentacao = {
    cafe: "listaCafe",
    lanche: "listaLanche",
    almoco: "listaAlmoco",
    pre_treino: "listaPreTreino",
    jantar: "listaJantar",
    ceia: "listaCeia"
};

function atualizarResumosAlimentacao() {

    const hoje = dataHoje();

    const alimentacao = JSON.parse(
        localStorage.getItem("alimentacao")
    ) || {};

    const refeicoesHoje =
        alimentacao[hoje] || {};

    const resumos = {
        cafe: "Comece o dia com uma boa refeição.",
        lanche: "Uma opção rápida para o meio da manhã.",
        almoco: "Registre sua principal refeição do dia.",
        pre_treino: "Energia para o seu treino.",
        jantar: "Registre sua refeição da noite.",
        ceia: "Uma opção antes de dormir, se necessário."
    };

    const elementos = {
        cafe: document.getElementById("resumoCafe"),
        lanche: document.getElementById("resumoLanche"),
        almoco: document.getElementById("resumoAlmoco"),
        pre_treino: document.getElementById("resumoPreTreino"),
        jantar: document.getElementById("resumoJantar"),
        ceia: document.getElementById("resumoCeia")
    };

    Object.keys(elementos).forEach(
        refeicao => {
    
            const alimentos =
                refeicoesHoje[refeicao];
    
            if (alimentos) {
    
                elementos[refeicao].textContent =
                    `✓ ${alimentos.length} ${
                        alimentos.length === 1
                            ? "item"
                            : "itens"
                    } registrado${alimentos.length === 1 ? "" : "s"}`
    
            } else {
    
                elementos[refeicao].textContent =
                    resumos[refeicao];
    
            }
    
        }
    );

Object.keys(listasAlimentacao).forEach(
    refeicao => {

        const lista =
            document.getElementById(
                listasAlimentacao[refeicao]
            );

        lista.innerHTML = "";

        const alimentos =
            refeicoesHoje[refeicao];
        
        if (!alimentos) {
            return;
        }
        
        const listaAlimentos =
            Array.isArray(alimentos)
                ? alimentos
                : [alimentos];
        
        listaAlimentos.forEach((alimento, indice) => {

            const item =
                document.createElement("div");
        
            item.className = "item-alimento";
        
            item.innerHTML = `
                <span>• ${alimento}</span>
        
                <span
                    class="remover-alimento"
                    data-indice="${indice}">
                    ×
                </span>
            `;
        
            lista.appendChild(item);
        
        });

    }
);

}

atualizarResumosAlimentacao();

document.querySelectorAll(
    ".lista-alimentos"
).forEach(
    lista => {

        lista.addEventListener(
            "click",
            evento => {

                if (
                    !evento.target.classList.contains(
                        "remover-alimento"
                    )
                ) {
                    return;
                }

                const indice =
                    Number(
                        evento.target.dataset.indice
                    );

                const refeicao =
                    Object.keys(
                        listasAlimentacao
                    ).find(
                        chave =>
                            listasAlimentacao[chave] ===
                            lista.id
                    );

                const hoje =
                    dataHoje();

                let alimentacao =
                    JSON.parse(
                        localStorage.getItem(
                            "alimentacao"
                        )
                    ) || {};

                const alimentosSalvos =
                    alimentacao[hoje][refeicao];
                
                const listaAlimentos =
                    Array.isArray(alimentosSalvos)
                        ? alimentosSalvos
                        : [alimentosSalvos];
                
                listaAlimentos.splice(
                    indice,
                    1
                );
                
                if (listaAlimentos.length === 0) {
                
                    delete alimentacao[hoje][refeicao];
                
                } else {
                
                    alimentacao[hoje][refeicao] =
                        listaAlimentos;
                
                }

                localStorage.setItem(
                    "alimentacao",
                    JSON.stringify(
                        alimentacao
                    )
                );

                atualizarResumosAlimentacao();

            }
        );

    }
);

// PARTE DE TREINO
function atualizarTreinoHoje() {

    const diaSemana =
        new Date().getDay();

    const treinosSemana = {

        1: {
            nome: "Push",
            descricao: "Peito, Ombros e Tríceps"
        },

        2: {
            nome: "Pull",
            descricao: "Costas e Bíceps"
        },

        3: {
            nome: "Lower A",
            descricao: "Quadríceps"
        },

        4: {
            nome: "Upper",
            descricao: "Parte superior completa"
        },

        5: {
            nome: "Lower B",
            descricao: "Posterior"
        }

    };

    const treino =
        treinosSemana[diaSemana];

    const container =
        document.getElementById(
            "treinoHojeInicio"
        );

    if (!treino) {

        container.innerHTML = `
            <p>😴 Hoje é dia de descanso.</p>
        `;

        return;

    }

    container.innerHTML = `
        <strong>${treino.nome}</strong>
        <p>${treino.descricao}</p>
    `;

}

document
    .getElementById("treinoHojeInicio")
    .addEventListener(
        "click",
        () => {

            const diaSemana =
                new Date().getDay();

            const treinosSemana = {

                1: "Push",
                2: "Pull",
                3: "Lower A",
                4: "Upper",
                5: "Lower B"

            };

            const treino =
                treinosSemana[diaSemana];

            if (!treino) {
                return;
            }

            document.getElementById(
                "modalNomeTreino"
            ).textContent =
                treino;

            document.getElementById(
                "modalTreino"
            ).style.display =
                "flex";

        }
    );

const modalTreino =
    document.getElementById("modalTreino");

document
  .getElementById("btnCancelarTreino")
  .addEventListener(
      "click",
      () => {

          modalTreino.style.display =
              "none";

      }
  );

document
  .getElementById("voltarListaTreinos")
  .addEventListener(
      "click",
      () => {

          document.getElementById(
              "fichaTreino"
          ).style.display = "none";

          document.getElementById(
              "modalTreino"
          ).style.display = "none";

          Object.values(telasModulos).forEach(
              modulo => {
                  modulo.style.display = "none";
              }
          );

          telasModulos.treino.style.display =
              "block";

      }
  );

modalTreino.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target === modalTreino
        ) {

            modalTreino.style.display =
                "none";

        }

    }
);

const fichasTreino = {

    push: {
        nome: "Push",
        descricao: "Peito, Ombros e Tríceps",

        grupos: {

            "PEITO": [
                {
                    nome: "Supino reto com halter",
                    series: 4,
                    repeticoes: "6-8"
                },
                {
                    nome: "Supino inclinado com halteres",
                    series: 3,
                    repeticoes: "8-10"
                },
                {
                    nome: "Crucifixo unilateral na polia",
                    series: 3,
                    repeticoes: "12-15"
                }
            ],

            "OMBROS": [
                {
                    nome: "Desenvolvimento com halteres",
                    series: 3,
                    repeticoes: "8-10"
                },
                {
                    nome: "Elevação lateral",
                    series: 4,
                    repeticoes: "12-15"
                }
            ],

            "TRÍCEPS": [
                {
                    nome: "Tríceps corda",
                    series: 3,
                    repeticoes: "10-12"
                },
                {
                    nome: "Tríceps francês",
                    series: 2,
                    repeticoes: "12-15"
                }
            ]
        }
    },

    pull: {
        nome: "Pull",
        descricao: "Costas e Bíceps",

        grupos: {

            "COSTAS": [
                {
                    nome: "Puxada alta",
                    series: 4,
                    repeticoes: "8-10"
                },
                {
                    nome: "Remada curvada",
                    series: 4,
                    repeticoes: "8-10"
                },
                {
                    nome: "Remada baixa",
                    series: 3,
                    repeticoes: "10-12"
                },
                {
                    nome: "Pulldown com braços retos",
                    series: 3,
                    repeticoes: "12-15"
                }
            ],

            "OMBRO POSTERIOR": [
                {
                    nome: "Face pull",
                    series: 3,
                    repeticoes: "15"
                }
            ],

            "BÍCEPS": [
                {
                    nome: "Rosca direta",
                    series: 3,
                    repeticoes: "8-10"
                },
                {
                    nome: "Rosca martelo",
                    series: 3,
                    repeticoes: "10-12"
                }
            ]
        }
    },

    lowerA: {
        nome: "Lower A",
        descricao: "Quadríceps",

        grupos: {

            "PERNAS": [
                {
                    nome: "Agachamento livre",
                    series: 4,
                    repeticoes: "6-8"
                },
                {
                    nome: "Stiff",
                    series: 4,
                    repeticoes: "8-10"
                },
                {
                    nome: "Leg Press",
                    series: 4,
                    repeticoes: "10"
                },
                {
                    nome: "Afundo com halteres ou no Smith",
                    series: 3,
                    repeticoes: "10 por perna"
                },
                {
                    nome: "Panturrilha em pé",
                    series: 5,
                    repeticoes: "15"
                }
            ],

            "ABDÔMEN": [
                {
                    nome: "Prancha",
                    series: 3,
                    repeticoes: "30-60 segundos"
                }
            ]
        }
    },

    upper: {
        nome: "Upper",
        descricao: "Parte superior completa",

        grupos: {

            "PEITO": [
                {
                    nome: "Supino inclinado",
                    series: 3,
                    repeticoes: "8-10"
                }
            ],

            "COSTAS": [
                {
                    nome: "Barra fixa ou puxada alta",
                    series: 3,
                    repeticoes: "8-10"
                },
                {
                    nome: "Remada unilateral",
                    series: 3,
                    repeticoes: "10"
                }
            ],

            "OMBROS": [
                {
                    nome: "Desenvolvimento com halteres",
                    series: 3,
                    repeticoes: "10"
                },
                {
                    nome: "Elevação lateral",
                    series: 3,
                    repeticoes: "15"
                }
            ],

            "BRAÇOS": [
                {
                    nome: "Rosca direta",
                    series: 3,
                    repeticoes: "10"
                },
                {
                    nome: "Tríceps corda",
                    series: 3,
                    repeticoes: "10"
                }
            ]
        }
    },

    lowerB: {
        nome: "Lower B",
        descricao: "Posterior",

        grupos: {

            "PERNAS": [
                {
                    nome: "Afundo no Smith",
                    series: 3,
                    repeticoes: "10-12 por perna"
                },
                {
                    nome: "Flexora sentada",
                    series: 4,
                    repeticoes: "10-12"
                },
                {
                    nome: "Cadeira extensora",
                    series: 3,
                    repeticoes: "12"
                },
                {
                    nome: "Panturrilha sentada",
                    series: 5,
                    repeticoes: "15"
                }
            ],

            "ABDÔMEN": [
                {
                    nome: "Abdômen na polia",
                    series: 3,
                    repeticoes: "15"
                }
            ]
        }
    }

};


function abrirFichaTreino(treino, modoEdicao = false) {

    const ficha =
        fichasTreino[treino];

    if (!ficha || !ficha.grupos) {
        console.error(
            "Ficha de treino inválida:",
            treino,
            ficha
        );
        return;
    }

    document.getElementById(
        "nomeFichaTreino"
    ).textContent =
        ficha.nome;

    document.getElementById(
        "descricaoFichaTreino"
    ).textContent =
        ficha.descricao;

    const container =
        document.getElementById(
            "conteudoFichaTreino"
        );

    container.innerHTML = "";

    Object.entries(
        ficha.grupos
    ).forEach(
        ([grupo, exercicios]) => {

            const grupoElemento =
                document.createElement("div");

            grupoElemento.className =
                "grupo-muscular";

            grupoElemento.innerHTML = `
                <h3>
                    ${grupo}
                </h3>
            `;

            exercicios.forEach(
                exercicio => {

                    const exercicioElemento =
                        document.createElement("div");

                    exercicioElemento.className =
                        "exercicio-ficha";

                    exercicioElemento.innerHTML = `
                        <strong>
                            ${exercicio.nome}
                        </strong>

                        <div class="campos-ficha">

                            <div>
                                <label>
                                    Séries
                                </label>

                                <input
                                    type="number"
                                    value="${exercicio.series}"
                                    min="1"
                                    ${modoEdicao ? "" : "disabled"}>
                            </div>

                            <span>×</span>

                            <div>
                                <label>
                                    Repetições
                                </label>

                                <input
                                    type="text"
                                    value="${exercicio.repeticoes}"
                                    ${modoEdicao ? "" : "disabled"}>
                            </div>

                            <div>
                                <label>
                                    Carga
                                </label>

                                <div class="campo-carga">

                                    <input
                                        type="number"
                                        value="0"
                                        min="0"
                                        step="0.5"
                                        ${modoEdicao ? "" : "disabled"}>

                                    <span>kg</span>

                                </div>

                            </div>

                        </div>
                    `;

                    grupoElemento.appendChild(
                        exercicioElemento
                    );

                }
            );

            container.appendChild(
                grupoElemento
            );

        }
    );

    document.getElementById(
        "fichaTreino"
    ).style.display = "flex";
}


document.querySelectorAll(
    ".card-treino"
).forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const treino =
                    card.dataset.treino;

                abrirFichaTreino(treino);

            }
        );

    }
);

document
    .getElementById("btnVisualizarFicha")
    .addEventListener(
        "click",
        () => {

            const diaSemana =
                new Date().getDay();

            const treinosSemana = {

                1: "push",
                2: "pull",
                3: "lowerA",
                4: "upper",
                5: "lowerB"

            };

            const treino =
                treinosSemana[diaSemana];

            if (!treino) {
                return;
            }

            document.getElementById(
                "modalTreino"
            ).style.display = "none";

            abrirFichaTreino(
                treino
            );

        }
    );

document
    .getElementById("btnEditarFicha")
    .addEventListener(
        "click",
        () => {

            const diaSemana =
                new Date().getDay();

            const treinosSemana = {

                1: "push",
                2: "pull",
                3: "lowerA",
                4: "upper",
                5: "lowerB"

            };

            const treino =
                treinosSemana[diaSemana];

            if (!treino) {
                return;
            }

            document.getElementById(
                "modalTreino"
            ).style.display = "none";

            abrirFichaTreino(
                treino,
                true
            );

        }
    );

// ========================================
// MÓDULO ESTUDOS — MODAL
// ========================================

console.log("ESTUDOS FOI CARREGADO");

const btnNovoEstudo = document.getElementById("btnNovoEstudo");
const modalEstudo = document.getElementById("modalEstudo");
const cancelarEstudo = document.getElementById("cancelarEstudo");
const tipoEstudo = document.getElementById("tipoEstudo");
const camposFaculdade = document.getElementById("camposFaculdade");

// Abrir modal
btnNovoEstudo.addEventListener("click", () => {
    modalEstudo.classList.add("ativo");
});

// Fechar modal pelo botão Cancelar
cancelarEstudo.addEventListener("click", () => {
    modalEstudo.classList.remove("ativo");
});

// Fechar clicando fora da caixa
modalEstudo.addEventListener("click", (evento) => {

    if (evento.target === modalEstudo) {
        modalEstudo.classList.remove("ativo");
    }

});

// Mostrar/esconder campos específicos da faculdade
tipoEstudo.addEventListener("change", () => {

    if (tipoEstudo.value === "faculdade") {

        camposFaculdade.style.display = "block";

    } else {

        camposFaculdade.style.display = "none";

    }

});

// ========================================
// MÓDULO ESTUDOS — SALVAR ESTUDO
// ========================================

const salvarEstudo = document.getElementById("salvarEstudo");
const nomeEstudo = document.getElementById("nomeEstudo");
const cursoFaculdade = document.getElementById("cursoFaculdade");
const semestreFaculdade = document.getElementById("semestreFaculdade");
const listaEstudos = document.getElementById("listaEstudos");

// Carregar estudos salvos
let estudos = JSON.parse(localStorage.getItem("estudos")) || [];


// Mostrar estudos na tela
function renderizarEstudos() {

    listaEstudos.innerHTML = "";

    if (estudos.length === 0) {

        listaEstudos.innerHTML = `
            <p class="estado-vazio-estudos">
                Você ainda não cadastrou nenhum estudo.
            </p>
        `;

        return;
    }

    estudos.forEach((estudo) => {
        const card = document.createElement("div");
        card.className = "card-estudo";
    
        card.addEventListener("click", () => {
            abrirDetalheEstudo(estudo.id);
        });

        let icone = "📚";

        if (estudo.tipo === "faculdade") {
            icone = "🎓";
        }

        if (estudo.tipo === "curso") {
            icone = "💻";
        }

        if (estudo.tipo === "certificacao") {
            icone = "🏆";
        }

        if (estudo.tipo === "pessoal") {
            icone = "🧠";
        }

        card.innerHTML = `
            <div class="card-estudo-cabecalho">

                <span class="icone-estudo">
                    ${icone}
                </span>

                <div>

                    <h3>
                        ${estudo.nome}
                    </h3>

                    ${
                        estudo.tipo === "faculdade"
                        ? `
                            <p>
                                ${estudo.curso}
                            </p>

                            <small>
                                ${estudo.semestre}
                            </small>
                          `
                        : `
                            <p>
                                ${estudo.tipo}
                            </p>
                          `
                    }

                </div>

            </div>

            <div class="progresso-estudo">

                <div class="barra-progresso-estudo">
                    <div
                        style="width: ${estudo.progresso}%">
                    </div>
                </div>

                <span>
                    ${estudo.progresso}%
                </span>

            </div>
        `;

        listaEstudos.appendChild(card);

    });
}

// ========================================
// MÓDULO ESTUDOS — DETALHE DO ESTUDO
// ========================================

const detalheEstudo = document.getElementById("detalheEstudo");
const conteudoDetalheEstudo = document.getElementById("conteudoDetalheEstudo");
const btnVoltarEstudos = document.getElementById("btnVoltarEstudos");
const modalMateria =
document.getElementById("modalMateria");
const nomeMateria =
document.getElementById("nomeMateria");
const salvarMateria =
document.getElementById("salvarMateria");
const cancelarMateria =
document.getElementById("cancelarMateria");
const modalConteudo =
document.getElementById("modalConteudo");
const nomeConteudo =
document.getElementById("nomeConteudo");
const statusConteudo =
document.getElementById("statusConteudo");
const salvarConteudo =
document.getElementById("salvarConteudo");
const cancelarConteudo =
document.getElementById("cancelarConteudo");
const excluirConteudo =
document.getElementById("excluirConteudo");
const modalAtividade =
document.getElementById("modalAtividade");
const nomeAtividade =
document.getElementById("nomeAtividade");
const dataAtividade =
document.getElementById("dataAtividade");
const statusAtividade =
document.getElementById("statusAtividade");
const dashboardAtividade =
document.getElementById("dashboardAtividade");
const salvarAtividade =
document.getElementById("salvarAtividade");
const cancelarAtividade =
document.getElementById("cancelarAtividade");
const excluirAtividade =
document.getElementById("excluirAtividade");

let estudoSelecionadoId = null;
let materiaSelecionadaId = null;
let conteudoSelecionadoId = null;
let atividadeSelecionadaId = null;

// CANCELAR CONTEÚDO

cancelarConteudo.addEventListener("click", () => {

    modalConteudo.classList.remove("ativo");

});

// CANCELAR ATIVIDADE

cancelarAtividade.addEventListener("click", () => {

    modalAtividade.classList.remove("ativo");

});


// FECHAR CLICANDO FORA

modalConteudo.addEventListener("click", (evento) => {

    if (evento.target === modalConteudo) {

        modalConteudo.classList.remove("ativo");

    }

});

// FECHAR ATIVIDADE CLICANDO FORA

modalAtividade.addEventListener("click", (evento) => {

    if (evento.target === modalAtividade) {

        modalAtividade.classList.remove("ativo");

    }

});

function abrirDetalheEstudo(id) {

    const estudo = estudos.find((item) => item.id === id);

    if (!estudo) {
        return;
    }

    estudoSelecionadoId = id;

    conteudoDetalheEstudo.innerHTML = `
        <div class="cabecalho-detalhe-estudo">

            <h2>
                ${estudo.tipo === "faculdade" ? "🎓" : "📚"}
                ${estudo.nome}
            </h2>

            ${
                estudo.tipo === "faculdade"
                ? `
                    <p>${estudo.curso}</p>
                    <small>${estudo.semestre}</small>
                `
                : `
                    <p>${estudo.tipo}</p>
                `
            }

        </div>

        <div class="progresso-detalhe-estudo">

            <strong>📊 Progresso geral</strong>

            <div class="progresso-estudo">

                <div class="barra-progresso-estudo">
                    <div style="width: ${estudo.progresso}%"></div>
                </div>

                <span>${estudo.progresso}%</span>

            </div>

        </div>

        ${
            estudo.tipo === "faculdade"
            ? `
                <div class="bloco-estudos">
        
                    <div class="titulo-bloco-estudos">
                        <h3>📚 Matérias</h3>
                    </div>
        
                    ${
                        estudo.materias.length === 0
                        ? `
                            <p class="estado-vazio-estudos">
                                Nenhuma matéria cadastrada.
                            </p>
                          `
                        : `
                            <div class="lista-materias-estudo">
        
                                ${estudo.materias.map((materia) => `
                                    
                                  <div
      class="card-materia-estudo"
      onclick="abrirDetalheMateria(${materia.id})"
  >
  
      <div>
          <strong>📚 ${materia.nome}</strong>
  
          <small>
              Progresso: ${materia.progresso}%
          </small>
      </div>
  
      <div class="progresso-estudo">
  
          <div class="barra-progresso-estudo">
              <div style="width: ${materia.progresso}%"></div>
          </div>
  
          <span>${materia.progresso}%</span>
  
      </div>
  
  </div>
        
                                `).join("")}
        
                            </div>
                          `
                    }
        
                    <button id="btnNovaMateria">
                        + Adicionar matéria
                    </button>
        
                </div>
            `
            : ""
        }
    `;

  

    // Mostra o detalhe
    detalheEstudo.classList.add("ativo");

  const btnNovaMateria = document.getElementById("btnNovaMateria");
  
    if (btnNovaMateria) {
    
        btnNovaMateria.addEventListener("click", () => {
    
            nomeMateria.value = "";
    
            modalMateria.classList.add("ativo");
    
        });
    
    }
}

// ========================================
// MÓDULO ESTUDOS — DETALHE DA MATÉRIA
// ========================================

function abrirDetalheMateria(id) {

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {
        return;
    }

    const materia = estudo.materias.find(
        (item) => item.id === id
    );

    if (!materia) {
        return;
    }

    materiaSelecionadaId = id;

    conteudoDetalheEstudo.innerHTML = `

        <div class="cabecalho-detalhe-estudo">

            <h2>📚 ${materia.nome}</h2>

            <p>${estudo.nome}</p>

        </div>

        <div class="progresso-detalhe-estudo">

            <strong>📊 Progresso da matéria</strong>

            <div class="progresso-estudo">

                <div class="barra-progresso-estudo">

                    <div style="width: ${materia.progresso}%"></div>

                </div>

                <span>
                    ${materia.progresso}%
                </span>

            </div>

        </div>

        <div class="bloco-estudos">

          <div class="titulo-bloco-estudos">
            <h3>📖 Conteúdos</h3>
          </div>
        
            ${
              materia.conteudos.length === 0
              ? `
                <p class="estado-vazio-estudos">
                    Nenhum conteúdo cadastrado.
                </p>
                  `
                : `
                  <div class="lista-conteudos-estudo">
      
                    ${materia.conteudos.map((conteudo) => `
    
                      <div 
                        class="card-conteudo-estudo"
                        onclick="abrirEdicaoConteudo(${conteudo.id})"
                        >
  
                        <strong>
                            📖 ${conteudo.nome}
                        </strong>

                        <small>
                          ${
                              conteudo.status === "nao_iniciado"
                              ? "⚪ Não iniciado"
                              : conteudo.status === "em_andamento"
                              ? "🟡 Em andamento"
                              : "🟢 Concluído"
                          }
                        </small>
  
                      </div>
    
                    `).join("")}
      
                  </div>
                `
            }
        
          <button id="btnNovoConteudo">
            + Adicionar conteúdo
          </button>
        
        </div>

        <div class="bloco-estudos">

          <div class="titulo-bloco-estudos">
            <h3>📝 Atividades</h3>
          </div>
      
          ${
            materia.atividades.length === 0
            ? `
              <p class="estado-vazio-estudos">
                Nenhuma atividade cadastrada.
              </p>
            `
            : `
                <div class="lista-atividades-estudo">
          
                  ${materia.atividades.map((atividade) => `
          
                  <div
                    class="card-conteudo-estudo"
                    onclick="abrirEdicaoAtividade(${atividade.id})"
                  >
          
                    <strong>
                        📝 ${atividade.nome}
                    </strong>

                    <small>
                        📅 ${
                            atividade.data.split("-").reverse().join("/")
                        }
                    </small>

                    <small>
                        ${
                            atividade.status === "pendente"
                            ? "🟡 Pendente"
                            : "🟢 Concluída"
                        }
                    </small>
          
                  </div>
          
                      `).join("")}
          
                </div>
              `
          }
      
          <button id="btnNovaAtividade">
            + Adicionar atividade
          </button>
        
        </div>

    `;

  const btnNovoConteudo =
    document.getElementById("btnNovoConteudo");

  if (btnNovoConteudo) {
    
    btnNovoConteudo.addEventListener("click", () => {

      conteudoSelecionadoId = null;

      nomeConteudo.value = "";

      statusConteudo.value = "nao_iniciado";

      excluirConteudo.style.display = "none";

      modalConteudo.classList.add("ativo");

    });
    
  }

  const btnNovaAtividade =
    document.getElementById("btnNovaAtividade");

  if (btnNovaAtividade) {
  
    btnNovaAtividade.addEventListener("click", () => {

        nomeAtividade.value = "";

        dataAtividade.value = "";

        statusAtividade.value = "pendente";

        dashboardAtividade.value = "sim";

        excluirAtividade.style.display = "none";

        modalAtividade.classList.add("ativo");

    });

  }
}

// ========================================
// EDITAR ATIVIDADE
// ========================================

function abrirEdicaoAtividade(id) {

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {
        return;
    }

    const materia = estudo.materias.find(
        (item) => item.id === materiaSelecionadaId
    );

    if (!materia) {
        return;
    }

    const atividade = materia.atividades.find(
        (item) => item.id === id
    );

    if (!atividade) {
        return;
    }

    atividadeSelecionadaId = id;

    excluirAtividade.style.display = "block";

    nomeAtividade.value = atividade.nome;

    dataAtividade.value = atividade.data;

    statusAtividade.value = atividade.status;

    dashboardAtividade.value =
        atividade.mostrarDashboard
        ? "sim"
        : "nao";

    modalAtividade.classList.add("ativo");

}

// ========================================
// CHECAGEM
// ========================================

console.log("CHEGUEI NAS PRÓXIMAS ATIVIDADES");

// ========================================
// BUSCAR PRÓXIMAS ATIVIDADES
// ========================================

function obterProximasAtividades() {

    const atividades = [];

    console.log("ESTUDOS SALVOS:", estudos);

    estudos.forEach((estudo) => {

        estudo.materias.forEach((materia) => {

            materia.atividades.forEach((atividade) => {

                if (atividade.status !== "concluida") {

                    atividades.push({

                        ...atividade,

                        estudoNome: estudo.nome,

                        materiaNome: materia.nome

                    });

                }

            });

        });

    });

    atividades.sort((a, b) => {

        return a.data.localeCompare(b.data);

    });

    return atividades;

}

// ========================================
// RENDERIZAR PRÓXIMAS ATIVIDADES
// ========================================

function renderizarProximasAtividades() {

    console.log("ENTREI NA FUNÇÃO RENDERIZAR");

    const container =
        document.getElementById("proximasAtividadesEstudos");

    console.log("CONTAINER:", container);

    if (!container) {
        return;
    }

    const atividades = obterProximasAtividades();

    console.log("ATIVIDADES ENCONTRADAS:", atividades);

    if (atividades.length === 0) {

        container.innerHTML = `
            <p class="estado-vazio-estudos">
                Nenhuma atividade próxima.
            </p>
        `;

        return;
    }

    container.innerHTML = atividades.map((atividade) => `

        <div class="card-conteudo-estudo">

            <strong>
                📝 ${atividade.nome}
            </strong>

            <small>
                📚 ${atividade.materiaNome}
            </small>

            <small>
                📅 ${
                    atividade.data
                    .split("-")
                    .reverse()
                    .join("/")
                }
            </small>

        </div>

    `).join("");

}



// ========================================
// EDITAR CONTEÚDO
// ========================================

function abrirEdicaoConteudo(id) {

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {
        return;
    }

    const materia = estudo.materias.find(
        (item) => item.id === materiaSelecionadaId
    );

    if (!materia) {
        return;
    }

    const conteudo = materia.conteudos.find(
        (item) => item.id === id
    );

    if (!conteudo) {
        return;
    }

    conteudoSelecionadoId = id;

    nomeConteudo.value = conteudo.nome;

    statusConteudo.value = conteudo.status;

    excluirConteudo.style.display = "block";

    modalConteudo.classList.add("ativo");

}

// VOLTAR PARA MEUS ESTUDOS

btnVoltarEstudos.addEventListener("click", () => {

    if (materiaSelecionadaId !== null) {

        materiaSelecionadaId = null;

        abrirDetalheEstudo(estudoSelecionadoId);

        return;
    }

    detalheEstudo.classList.remove("ativo");

});


// Criar novo estudo
salvarEstudo.addEventListener("click", () => {

    const nome = nomeEstudo.value.trim();

    if (!nome) {

        alert("Digite o nome do estudo.");

        return;
    }


    if (
        tipoEstudo.value === "faculdade" &&
        !cursoFaculdade.value.trim()
    ) {

        alert("Digite o nome do curso.");

        return;
    }


    if (
        tipoEstudo.value === "faculdade" &&
        !semestreFaculdade.value.trim()
    ) {

        alert("Digite o semestre.");

        return;
    }


    const novoEstudo = {

        id: Date.now(),

        nome: nome,

        tipo: tipoEstudo.value,

        curso:
            tipoEstudo.value === "faculdade"
            ? cursoFaculdade.value.trim()
            : "",

        semestre:
            tipoEstudo.value === "faculdade"
            ? semestreFaculdade.value.trim()
            : "",

        progresso: 0,

        materias: [],

        atividades: []

    };


    estudos.push(novoEstudo);


    localStorage.setItem(
        "estudos",
        JSON.stringify(estudos)
    );


    renderizarEstudos();


    // Fechar modal
    modalEstudo.classList.remove("ativo");


    // Limpar formulário
    nomeEstudo.value = "";
    cursoFaculdade.value = "";
    semestreFaculdade.value = "";

});


// Renderizar ao carregar
renderizarEstudos();


// CANCELAR MATÉRIA

cancelarMateria.addEventListener("click", () => {

    modalMateria.classList.remove("ativo");

});

// FECHAR CLICANDO FORA

modalMateria.addEventListener("click", (evento) => {

    if (evento.target === modalMateria) {

        modalMateria.classList.remove("ativo");

    }

});

// SALVAR MATÉRIA
salvarMateria.addEventListener("click", () => {

    const nome = nomeMateria.value.trim();

    if (!nome) {

        alert("Digite o nome da matéria.");

        return;

    }

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {

        return;

    }

    const novaMateria = {

        id: Date.now(),

        nome: nome,

        progresso: 0,

        conteudos: [],

        atividades: []

    };

    estudo.materias.push(novaMateria);

    localStorage.setItem(
        "estudos",
        JSON.stringify(estudos)
    );

    modalMateria.classList.remove("ativo");

    abrirDetalheEstudo(estudoSelecionadoId);

});

// ========================================
// SALVAR CONTEÚDO
// ========================================

salvarConteudo.addEventListener("click", () => {

    const nome = nomeConteudo.value.trim();

    if (!nome) {
        alert("Digite o nome do conteúdo.");
        return;
    }

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {
        return;
    }

    const materia = estudo.materias.find(
        (item) => item.id === materiaSelecionadaId
    );

    if (!materia) {
        return;
    }

    // EDITANDO CONTEÚDO EXISTENTE
    if (conteudoSelecionadoId !== null) {

        const conteudo = materia.conteudos.find(
            (item) => item.id === conteudoSelecionadoId
        );

        if (!conteudo) {
            return;
        }

        conteudo.nome = nome;
        conteudo.status = statusConteudo.value;

    }

    // CRIANDO NOVO CONTEÚDO
    else {

        const novoConteudo = {
            id: Date.now(),
            nome: nome,
            status: statusConteudo.value
        };

        materia.conteudos.push(novoConteudo);

    }

    localStorage.setItem(
        "estudos",
        JSON.stringify(estudos)
    );

    modalConteudo.classList.remove("ativo");

    conteudoSelecionadoId = null;

    abrirDetalheMateria(materiaSelecionadaId);

});

// ========================================
// SALVAR ATIVIDADE
// ========================================

salvarAtividade.addEventListener("click", () => {

    const nome = nomeAtividade.value.trim();
    const data = dataAtividade.value;

    if (!nome) {

        alert("Digite o nome da atividade.");

        return;

    }

    if (!data) {

        alert("Informe a data da atividade.");

        return;

    }

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {
        return;
    }

    const materia = estudo.materias.find(
        (item) => item.id === materiaSelecionadaId
    );

    if (!materia) {
        return;
    }

    // EDITANDO ATIVIDADE EXISTENTE

    if (atividadeSelecionadaId !== null) {

        const atividade = materia.atividades.find(
            (item) => item.id === atividadeSelecionadaId
        );

        if (!atividade) {
            return;
        }

        atividade.nome = nome;

        atividade.data = data;

        atividade.status = statusAtividade.value;

        atividade.mostrarDashboard =
            dashboardAtividade.value === "sim";

    }

    // CRIANDO NOVA ATIVIDADE

    else {

        const novaAtividade = {

            id: Date.now(),

            nome: nome,

            data: data,

            status: statusAtividade.value,

            mostrarDashboard:
                dashboardAtividade.value === "sim"

        };

        materia.atividades.push(novaAtividade);

    }

    localStorage.setItem(
        "estudos",
        JSON.stringify(estudos)
    );

    renderizarProximasAtividades();

    modalAtividade.classList.remove("ativo");

    atividadeSelecionadaId = null;

    abrirDetalheMateria(materiaSelecionadaId);

});

// ========================================
// EXCLUIR ATIVIDADE
// ========================================

excluirAtividade.addEventListener("click", () => {

    if (atividadeSelecionadaId === null) {
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir esta atividade?"
    );

    if (!confirmar) {
        return;
    }

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {
        return;
    }

    const materia = estudo.materias.find(
        (item) => item.id === materiaSelecionadaId
    );

    if (!materia) {
        return;
    }

    materia.atividades = materia.atividades.filter(
        (item) => item.id !== atividadeSelecionadaId
    );

    localStorage.setItem(
        "estudos",
        JSON.stringify(estudos)
    );

    renderizarProximasAtividades();

    modalAtividade.classList.remove("ativo");

    atividadeSelecionadaId = null;

    abrirDetalheMateria(materiaSelecionadaId);

});

// ========================================
// EXCLUIR CONTEÚDO
// ========================================

excluirConteudo.addEventListener("click", () => {

    if (conteudoSelecionadoId === null) {
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir este conteúdo?"
    );

    if (!confirmar) {
        return;
    }

    const estudo = estudos.find(
        (item) => item.id === estudoSelecionadoId
    );

    if (!estudo) {
        return;
    }

    const materia = estudo.materias.find(
        (item) => item.id === materiaSelecionadaId
    );

    if (!materia) {
        return;
    }

    materia.conteudos = materia.conteudos.filter(
        (item) => item.id !== conteudoSelecionadoId
    );

    localStorage.setItem(
        "estudos",
        JSON.stringify(estudos)
    );

    modalConteudo.classList.remove("ativo");

    conteudoSelecionadoId = null;

    abrirDetalheMateria(materiaSelecionadaId);

});

// ========================================
// TESTE — PRÓXIMAS ATIVIDADES
// ========================================

console.log("TESTE PRÓXIMAS ATIVIDADES");

renderizarProximasAtividades();




// ==========================================
// FINANÇAS
// ==========================================

let transacoes =
    JSON.parse(localStorage.getItem("transacoes")) || [];

let transacaoEditando = null;

const btnNovaTransacao =
document.getElementById("btnNovaTransacao");
const modalTransacao =
document.getElementById("modalTransacao");
const salvarTransacao =
document.getElementById("salvarTransacao");
const cancelarTransacao =
document.getElementById("cancelarTransacao");
const tipoTransacao =
document.getElementById("tipoTransacao");
const descricaoTransacao =
document.getElementById("descricaoTransacao");
const valorTransacao =
document.getElementById("valorTransacao");
const categoriaTransacao =
document.getElementById("categoriaTransacao");
const dataTransacao =
document.getElementById("dataTransacao");
const listaTransacoes =
document.getElementById("listaTransacoes");

btnNovaTransacao.addEventListener("click", () => {

    modalTransacao.classList.add("ativo");

});


cancelarTransacao.addEventListener("click", () => {

    modalTransacao.classList.remove("ativo");

    transacaoEditando = null;

});

// ==========================================
// SALVAR TRANSAÇÃO
// ==========================================

salvarTransacao.addEventListener("click", () => {

    const tipo = tipoTransacao.value;
    const descricao = descricaoTransacao.value.trim();
    const valor = Number(valorTransacao.value);
    const categoria = categoriaTransacao.value;
    const data = dataTransacao.value;

  if (transacaoEditando !== null) {

    const transacao =
        transacoes.find(
            item => item.id === transacaoEditando
        );


    if (transacao) {

        transacao.tipo = tipo;
        transacao.descricao = descricao;
        transacao.valor = valor;
        transacao.categoria = categoria;
        transacao.data = data;

    }


    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );


    transacaoEditando = null;


    modalTransacao.classList.remove("ativo");


    descricaoTransacao.value = "";
    valorTransacao.value = "";
    dataTransacao.value = "";


    renderizarTransacoes();
    atualizarResumoFinanceiro();

    return;
}

    // Verificar campos obrigatórios
    if (!descricao || !valor || !data) {

        alert("Preencha todos os campos.");

        return;

    }


    const novaTransacao = {

        id: Date.now(),

        tipo: tipo,

        descricao: descricao,

        valor: valor,

        categoria: categoria,

        data: data

    };


    transacoes.push(novaTransacao);


    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );


    modalTransacao.classList.remove("ativo");


    // Limpar formulário

    descricaoTransacao.value = "";

    valorTransacao.value = "";

    dataTransacao.value = "";

  
    renderizarTransacoes();
    atualizarResumoFinanceiro();

});

// ==========================================
// RENDERIZAR TRANSAÇÕES
// ==========================================

function renderizarTransacoes() {

    listaTransacoes.innerHTML = "";


    if (transacoes.length === 0) {

        listaTransacoes.innerHTML = `
            <p class="estado-vazio-financeiro">
                Nenhuma movimentação registrada.
            </p>
        `;

        return;

    }


    transacoes.forEach(transacao => {

        const item = document.createElement("div");

        item.className =
            `transacao ${transacao.tipo}`;


        item.innerHTML = `

            <div class="transacao-info">

                <span class="transacao-descricao">
                    ${transacao.descricao}
                </span>

                <span class="transacao-categoria">
                    ${transacao.categoria}
                </span>

                <span class="transacao-data">
                    ${transacao.data}
                </span>

            </div>


            <span class="transacao-valor">

                ${transacao.tipo === "entrada" ? "+" : "-"}
                R$ ${transacao.valor.toFixed(2).replace(".", ",")}

            </span>


            <div class="acoes-transacao">

              <button
                  class="btn-editar-transacao"
                  data-id="${transacao.id}"
                  title="Editar">
          
                  ✏️
          
              </button>
          
          
              <button
                  class="btn-excluir-transacao"
                  data-id="${transacao.id}"
                  title="Excluir">
          
                  🗑️
          
              </button>
            
            </div>

        `;


        listaTransacoes.appendChild(item);

    });

    document
      .querySelectorAll(".btn-editar-transacao")
      .forEach(botao => {
  
          botao.addEventListener("click", () => {
  
              const id =
                  Number(botao.dataset.id);
  
  
              const transacao =
                  transacoes.find(
                      item => item.id === id
                  );
  
  
              if (!transacao) {
                  return;
              }
  
  
              transacaoEditando = id;
  
  
              tipoTransacao.value =
                  transacao.tipo;
  
              descricaoTransacao.value =
                  transacao.descricao;
  
              valorTransacao.value =
                  transacao.valor;
  
              categoriaTransacao.value =
                  transacao.categoria;
  
              dataTransacao.value =
                  transacao.data;
  
  
              modalTransacao.classList.add("ativo");
  
          });
  
      });
    
    document
      .querySelectorAll(".btn-excluir-transacao")
      .forEach(botao => {

          botao.addEventListener("click", () => {

              const id =
                  Number(botao.dataset.id);


              transacoes =
                  transacoes.filter(
                      transacao =>
                          transacao.id !== id
                  );


              localStorage.setItem(
                  "transacoes",
                  JSON.stringify(transacoes)
              );


              renderizarTransacoes();

              atualizarResumoFinanceiro();

          });

      });

}

// ==========================================
// ATUALIZAR RESUMO FINANCEIRO
// ==========================================

function atualizarResumoFinanceiro() {

    let totalEntradas = 0;
    let totalSaidas = 0;


    transacoes.forEach(transacao => {

        if (transacao.tipo === "entrada") {

            totalEntradas += transacao.valor;

        }


        if (transacao.tipo === "saida") {

            totalSaidas += transacao.valor;

        }

    });


    const saldo = totalEntradas - totalSaidas;


    document.getElementById("totalEntradas").textContent =
        `R$ ${totalEntradas.toFixed(2).replace(".", ",")}`;


    document.getElementById("totalSaidas").textContent =
        `R$ ${totalSaidas.toFixed(2).replace(".", ",")}`;


    document.getElementById("saldoFinanceiro").textContent =
        `R$ ${saldo.toFixed(2).replace(".", ",")}`;

}

renderizarTransacoes();
atualizarResumoFinanceiro();

// ==========================================
// CONTAS
// ==========================================

let contas =
JSON.parse(localStorage.getItem("contas")) || [];
let contaEditando = null;

const btnNovaConta =
document.getElementById("btnNovaConta");
const modalConta =
document.getElementById("modalConta");
const salvarConta =
document.getElementById("salvarConta");
const cancelarConta =
document.getElementById("cancelarConta");
const descricaoConta =
document.getElementById("descricaoConta");
const valorConta =
document.getElementById("valorConta");
const categoriaConta =
document.getElementById("categoriaConta");
const vencimentoConta =
document.getElementById("vencimentoConta");
const pagaConta =
document.getElementById("pagaConta");
const listaContas =
document.getElementById("listaContas");


// ==========================================
// ABRIR MODAL
// ==========================================

btnNovaConta.addEventListener("click", () => {

    modalConta.classList.add("ativo");

});


// ==========================================
// CANCELAR
// ==========================================

cancelarConta.addEventListener("click", () => {

    modalConta.classList.remove("ativo");

    contaEditando = null;

});


// ==========================================
// SALVAR CONTA
// ==========================================

salvarConta.addEventListener("click", () => {

    const descricao =
        descricaoConta.value.trim();

    const valor =
        Number(valorConta.value);

    const categoria =
        categoriaConta.value;

    const vencimento =
        vencimentoConta.value;

    const paga =
        pagaConta.checked;


    // Verificar campos obrigatórios

    if (!descricao || !valor || !vencimento) {

        alert("Preencha todos os campos.");

        return;

    }

    if (contaEditando !== null) {

        const conta =
            contas.find(
                item => item.id === contaEditando
            );
    
        if (conta) {
    
            conta.descricao = descricao;
            conta.valor = valor;
            conta.categoria = categoria;
            conta.vencimento = vencimento;
            conta.paga = paga;
    
        }
    
        localStorage.setItem(
            "contas",
            JSON.stringify(contas)
        );
    
        contaEditando = null;
    
        modalConta.classList.remove("ativo");
    
        descricaoConta.value = "";
        valorConta.value = "";
        vencimentoConta.value = "";
        pagaConta.checked = false;
    
        renderizarContas();
        atualizarResumoContas();
    
        return;
    }


    const novaConta = {

        id: Date.now(),

        descricao: descricao,

        valor: valor,

        categoria: categoria,

        vencimento: vencimento,

        paga: paga

    };


    contas.push(novaConta);


    localStorage.setItem(
        "contas",
        JSON.stringify(contas)
    );


    modalConta.classList.remove("ativo");


    // Limpar formulário

    descricaoConta.value = "";

    valorConta.value = "";

    vencimentoConta.value = "";

    pagaConta.checked = false;


    renderizarContas();

});

// ==========================================
// RENDERIZAR CONTAS
// ==========================================

function renderizarContas() {

    listaContas.innerHTML = "";


    if (contas.length === 0) {

        listaContas.innerHTML = `

            <p class="estado-vazio-financeiro">
                Nenhuma conta cadastrada.
            </p>

        `;

        return;

    }

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);
  
    contas.forEach(conta => {

        let statusTexto;
        let classeStatus;
    
    
        if (conta.paga) {
    
            statusTexto = "🟢 Paga";
            classeStatus = "paga";
    
        } else {
    
            const vencimento =
                new Date(conta.vencimento + "T00:00:00");
    
    
            if (vencimento < hoje) {
    
                statusTexto = "🔴 Atrasada";
                classeStatus = "atrasada";
    
            } else {
    
                statusTexto = "🟡 Pendente";
                classeStatus = "pendente";
    
            }
    
        }


        const item =
            document.createElement("div");


        item.className =
            "conta";


        item.innerHTML = `

            <div class="conta-info">

                <span class="conta-descricao">
                    ${conta.descricao}
                </span>

                <span class="conta-detalhes">
                    ${conta.categoria}
                    •
                    R$ ${conta.valor.toFixed(2).replace(".", ",")}
                    •
                    Vencimento: ${conta.vencimento}
                </span>

            </div>

              <div class="acoes-conta">

                  <span class="status-conta ${classeStatus}">
                      ${statusTexto}
                  </span>
              
                  <label class="checkbox-pagar-conta">
              
                      <input
                          type="checkbox"
                          class="checkbox-conta-paga"
                          data-id="${conta.id}"
                          ${conta.paga ? "checked" : ""}
                      >
              
                      Pago
              
                  </label>
              
                  <button
                      class="btn-editar-conta"
                      data-id="${conta.id}"
                      title="Editar">
                      ✏️
                  </button>
              
                  <button
                      class="btn-excluir-conta"
                      data-id="${conta.id}"
                      title="Excluir">
                      🗑️
                  </button>
              
              </div>

        `;


        listaContas.appendChild(item);

    });

        // listener do checkbox
        document
            .querySelectorAll(".checkbox-conta-paga")
            .forEach(checkbox => {
    
                checkbox.addEventListener("change", () => {
    
                    const id =
                        Number(checkbox.dataset.id);
    
    
                    const conta =
                        contas.find(
                            item => item.id === id
                        );
    
    
                    if (!conta) {
                        return;
                    }
    
    
                    conta.paga =
                        checkbox.checked;
    
    
                    localStorage.setItem(
                        "contas",
                        JSON.stringify(contas)
                    );
    
    
                    renderizarContas();
                    atualizarResumoContas();
    
                });
    
            });

        // listener do editar
        document
            .querySelectorAll(".btn-editar-conta")
            .forEach(botao => {
        
                botao.addEventListener("click", () => {
        
                    const id =
                        Number(botao.dataset.id);
        
                    const conta =
                        contas.find(
                            item => item.id === id
                        );
        
                    if (!conta) {
                        return;
                    }
        
                    contaEditando = id;
        
                    descricaoConta.value =
                        conta.descricao;
        
                    valorConta.value =
                        conta.valor;
        
                    categoriaConta.value =
                        conta.categoria;
        
                    vencimentoConta.value =
                        conta.vencimento;
        
                    pagaConta.checked =
                        conta.paga;
        
                    modalConta.classList.add("ativo");
        
                });
        
            });

        // listener do excluir
        document
            .querySelectorAll(".btn-excluir-conta")
            .forEach(botao => {
          
                botao.addEventListener("click", () => {
          
                    const id =
                        Number(botao.dataset.id);
          
                    const confirmar =
                        confirm("Deseja excluir esta conta?");
          
                    if (!confirmar) {
                        return;
                    }
          
                    contas =
                        contas.filter(
                            conta => conta.id !== id
                        );
          
                    localStorage.setItem(
                        "contas",
                        JSON.stringify(contas)
                    );
          
                    renderizarContas();
                    atualizarResumoContas();
          
                });
          
            });
  

}

renderizarContas();
atualizarResumoContas();

// ==========================================
// ATUALIZAR RESUMO DAS CONTAS
// ==========================================

function atualizarResumoContas() {

    let atrasadas = 0;
    let pendentes = 0;
    let pagas = 0;


    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);


    contas.forEach(conta => {

        if (conta.paga) {

            pagas++;

            return;

        }


        const vencimento =
            new Date(conta.vencimento + "T00:00:00");


        if (vencimento < hoje) {

            atrasadas++;

        } else {

            pendentes++;

        }

    });


    document.getElementById("contasAtrasadas").textContent =
        `🔴 ${atrasadas} atrasadas`;


    document.getElementById("contasPendentes").textContent =
        `🟡 ${pendentes} pendentes`;


    document.getElementById("contasPagas").textContent =
        `🟢 ${pagas} pagas`;

}




// ==========================================
// TRABALHO - JORNADA
// ==========================================

let jornadaTrabalho =
    JSON.parse(localStorage.getItem("jornadaTrabalho")) || {};

const entradaTrabalho =
    document.getElementById("entradaTrabalho");

const saidaTrabalho =
    document.getElementById("saidaTrabalho");

const statusTrabalho =
    document.getElementById("statusTrabalho");

const btnIniciarJornada =
    document.getElementById("btnIniciarJornada");

const btnFinalizarJornada =
    document.getElementById("btnFinalizarJornada");


// ==========================================
// DATA DE HOJE
// ==========================================

function obterDataHoje() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes =
        String(hoje.getMonth() + 1).padStart(2, "0");

    const dia =
        String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// ==========================================
// FORMATAR HORÁRIO
// ==========================================

function formatarHorario(data) {

    if (!data) {
        return "—";
    }

    const horario =
        new Date(data);

    return horario.toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// INICIAR JORNADA
// ==========================================

btnIniciarJornada.addEventListener("click", () => {

    const hoje = obterDataHoje();

    if (jornadaTrabalho.data === hoje &&
        jornadaTrabalho.entrada) {

        return;
    }

    jornadaTrabalho = {

        data: hoje,

        entrada: new Date().toISOString(),

        saida: null

    };

    localStorage.setItem(
        "jornadaTrabalho",
        JSON.stringify(jornadaTrabalho)
    );

    renderizarJornada();

});


// ==========================================
// FINALIZAR JORNADA
// ==========================================

btnFinalizarJornada.addEventListener("click", () => {

    const hoje = obterDataHoje();

    if (jornadaTrabalho.data !== hoje ||
        !jornadaTrabalho.entrada) {

        alert("Inicie a jornada primeiro.");

        return;
    }

    if (jornadaTrabalho.saida) {
        return;
    }

    jornadaTrabalho.saida =
        new Date().toISOString();

    localStorage.setItem(
        "jornadaTrabalho",
        JSON.stringify(jornadaTrabalho)
    );

    renderizarJornada();

});


// ==========================================
// RENDERIZAR JORNADA
// ==========================================

function renderizarJornada() {

    const hoje = obterDataHoje();

    if (jornadaTrabalho.data !== hoje) {

        entradaTrabalho.textContent = "—";
        saidaTrabalho.textContent = "—";
        statusTrabalho.textContent =
            "⚪ Não iniciada";

        return;
    }

    entradaTrabalho.textContent =
        formatarHorario(
            jornadaTrabalho.entrada
        );

    saidaTrabalho.textContent =
        formatarHorario(
            jornadaTrabalho.saida
        );

    if (!jornadaTrabalho.entrada) {

        statusTrabalho.textContent =
            "⚪ Não iniciada";

    } else if (!jornadaTrabalho.saida) {

        statusTrabalho.textContent =
            "🟡 Em andamento";

    } else {

        statusTrabalho.textContent =
            "🟢 Finalizada";

    }

}


// ==========================================
// CARREGAR JORNADA
// ==========================================

renderizarJornada();
