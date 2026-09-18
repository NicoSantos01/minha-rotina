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
    trabalho: document.getElementById("telaTrabalho")
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

const btnMenu = document.getElementById("btnMenu");
const menuModulos = document.getElementById("menuModulos");

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

function abrirFichaTreino(treino) {

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
                                    min="1">
                            </div>

                            <span>×</span>

                            <div>
                                <label>
                                    Repetições
                                </label>

                                <input
                                    type="text"
                                    value="${exercicio.repeticoes}">
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
                                        step="0.5">

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
