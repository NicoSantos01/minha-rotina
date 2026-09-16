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

    atualizarSemana();

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
          
            lista.appendChild(div);

        }
    );

    atualizarProgresso();

    atualizarDashboard();

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
// BOTÃO HOJE
// ==========================================

document.getElementById(
    "btnHoje"
).addEventListener(
    "click",
    () => {

        telaHoje.style.display =
            "block";

        telaHistorico.style.display =
            "none";

    }
);


// ==========================================
// BOTÃO HISTÓRICO
// ==========================================

document.getElementById(
    "btnHistorico"
).addEventListener(
    "click",
    () => {

        telaHoje.style.display =
            "none";

        telaHistorico.style.display =
            "block";


        mesVisualizado =
            new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
            );


        diaSelecionado =
            dataHoje();


        renderizarCalendario();

    }
);


// ==========================================
// VARIÁVEL DE EDIÇÃO
// ==========================================

let habitoEditando = null;


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
