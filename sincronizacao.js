// ==========================================
// MINHA ROTINA — SINCRONIZAÇÃO
// ETAPA 1: IDENTIFICAR ALTERAÇÕES LOCAIS
// ==========================================
const CHAVES_SINCRONIZAVEIS = new Set([
  "sono",
  "rotinaManha",
  "habitos",
  "dias",
  "estudosTarde",
  "estudos",
  "minhaRotina_fichasTreino",
  "alimentacao",
  "registroAgua",
  "transacoes",
  "contas",
  "jornadasTrabalho",
  "jornadaTrabalho",
  "tarefasTrabalho",
  "livrosLeitura",
  "ultimaLeituraRotina",
  "metas"
]);

// ==========================================
// FILA DE SINCRONIZAÇÃO PENDENTE
// ==========================================
const CHAVE_FILA_SINCRONIZACAO =
  "minhaRotina_sincronizacaoPendente";

function registrarAlteracaoPendente(chave, tipo) {

  if (!CHAVES_SINCRONIZAVEIS.has(chave)) return;

  let fila;

  try {
    fila = JSON.parse(
      localStorage.getItem(CHAVE_FILA_SINCRONIZACAO) || "{}"
    );

    if (
      !fila ||
      typeof fila !== "object" ||
      Array.isArray(fila)
    ) {
      console.warn("Fila inválida. Registro não realizado.");
      return;
    }

  } catch (erro) {
    console.error("Erro ao ler a fila:", erro);
    return;
  }

  fila[chave] = {
    tipo: tipo,
    alteradoEm: new Date().toISOString()
  };

  localStorage.setItem(
    CHAVE_FILA_SINCRONIZACAO,
    JSON.stringify(fila)
  );

  console.log("Pendente de sincronização:", chave);
}

const salvarOriginal = Storage.prototype.setItem;

Storage.prototype.setItem = function(chave, valor) {

  const monitorar =
    this === localStorage &&
    CHAVES_SINCRONIZAVEIS.has(chave);

  const valorAnterior = monitorar
    ? this.getItem(chave)
    : null;

  // Mantém o salvamento original
  salvarOriginal.call(this, chave, valor);

  // Só identifica quando o conteúdo realmente mudou
  if (
    monitorar &&
    valorAnterior !== this.getItem(chave)
  ) {
    console.log(
      "Alteração real identificada:",
      chave
    );

    registrarAlteracaoPendente(chave, "salvar");
  }
};

console.log("Monitor de alterações iniciado.");

// ==========================================
// MONITORAMENTO DE EXCLUSÕES
// ==========================================
const removerOriginal = Storage.prototype.removeItem;

Storage.prototype.removeItem = function(chave) {

  const monitorar =
    this === localStorage &&
    CHAVES_SINCRONIZAVEIS.has(chave);

  const existia = monitorar &&
    this.getItem(chave) !== null;

  // Mantém a exclusão original
  removerOriginal.call(this, chave);

  if (existia) {
    console.log(
      "Exclusão local identificada:",
      chave
    );

    registrarAlteracaoPendente(chave, "excluir");
  }
};

// ==========================================
// CONSULTAR VERSÃO ATUAL DA NUVEM
// ==========================================

async function consultarVersaoSincronizacao() {
  try {
    const cliente = window.supabaseClient;

    if (!cliente) {
      console.error("Supabase não conectado.");
      return null;
    }

    const { data: autenticacao, error: erroAuth } =
      await cliente.auth.getUser();

    if (erroAuth || !autenticacao?.user) {
      console.warn("Usuário não autenticado.");
      return null;
    }

    const { data: registro, error: erroConsulta } =
      await cliente
        .from("dados_usuario")
        .select("updated_at")
        .eq("user_id", autenticacao.user.id)
        .maybeSingle();

    if (erroConsulta) {
      console.error("Erro ao consultar versão:", erroConsulta);
      return null;
    }

    if (!registro) {
      console.warn("Nenhum registro encontrado na nuvem.");
      return null;
    }

    console.log(
      "Versão atual da nuvem:",
      registro.updated_at
    );

    return registro.updated_at;

  } catch (erro) {
    console.error("Erro na consulta:", erro);
    return null;
  }
}

window.consultarVersaoSincronizacao =
  consultarVersaoSincronizacao;

  // ==========================================
// REGISTRAR VERSÃO-BASE DA NUVEM
// ==========================================

async function registrarVersaoBaseSincronizacao() {

  const fila = JSON.parse(
    localStorage.getItem(
      "minhaRotina_sincronizacaoPendente"
    ) || "{}"
  );

  if (Object.keys(fila).length > 0) {
    console.warn(
      "Existem alterações pendentes. Versão-base não registrada."
    );
    return;
  }

  const versao = await consultarVersaoSincronizacao();

  if (!versao) return;

  const { data: autenticacao, error } =
    await window.supabaseClient.auth.getUser();

  if (error || !autenticacao?.user) return;

  const chave =
    "minhaRotina_versaoBase_" + autenticacao.user.id;

  localStorage.setItem(chave, versao);

  console.log("Versão-base registrada:", versao);
}

window.registrarVersaoBaseSincronizacao =
  registrarVersaoBaseSincronizacao;
