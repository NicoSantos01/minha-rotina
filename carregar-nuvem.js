// ==========================================
// MINHA ROTINA — CARREGAMENTO DA NUVEM
// ==========================================

// Aguarda o aplicativo disponibilizar
// a conexão compartilhada com o Supabase.

async function consultarBackupNaNuvem() {

    const cliente = window.supabaseClient;

    if (!cliente) {
        console.error("Conexão com Supabase não encontrada.");
        return;
    }

    const { data: autenticacao, error: erroAuth } =
        await cliente.auth.getUser();

    if (erroAuth || !autenticacao.user) {
        console.log("Aguardando autenticação.");
        return;
    }

    const { data: registro, error: erroConsulta } =
        await cliente
        .from("dados_usuario")
        .select("dados, updated_at")
        .eq("user_id", autenticacao.user.id)
        .maybeSingle();

    if (erroConsulta) {
        console.error("Erro ao consultar backup:", erroConsulta);
        return;
    }

    if (!registro) {
        console.log("Nenhum backup encontrado na nuvem.");
        return;
    }

    console.log(
        "☁️ Carregador conectado! Chaves disponíveis:",
        Object.keys(registro.dados || {}).length
    );

    // ==========================================
    // INFORMAÇÕES DA VERSÃO NA NUVEM
    // ==========================================
    console.log(
        "☁️ Última atualização na nuvem:",
        registro.updated_at || "Não informada"
    );

    console.log(
        "☁️ Chaves armazenadas:",
        Object.keys(registro.dados || {})
    );

    console.log(
        "Nenhum dado local foi alterado."
    );
}

// Disponibiliza a função para testes.
window.consultarBackupNaNuvem = consultarBackupNaNuvem;

// ==========================================
// RESTAURAÇÃO MANUAL DOS DADOS DA NUVEM
// ==========================================
async function restaurarDadosDaNuvem() {
  try {
    const cliente = window.supabaseClient;

    const { data: usuario, error: erroUsuario } =
      await cliente.auth.getUser();

    if (erroUsuario || !usuario.user) {
      alert("Faça login antes de restaurar os dados.");
      return;
    }

    const { data: registro, error: erroConsulta } =
      await cliente
        .from("dados_usuario")
        .select("dados")
        .eq("user_id", usuario.user.id)
        .maybeSingle();

    if (erroConsulta || !registro?.dados) {
      alert("Não foi possível localizar o backup na nuvem.");
      return;
    }

    const dados = registro.dados;
    const chaves = Object.keys(dados);

    // Valida todos os registros antes de alterar o PC
    for (const chave of chaves) {
      if (
        chave.startsWith("sb-") ||
        chave.toLowerCase().includes("auth-token") ||
        typeof dados[chave] !== "string"
      ) {
        throw new Error("Chave inválida: " + chave);
      }

      JSON.parse(dados[chave]);
    }

    if (chaves.length !== 11) {
      throw new Error(
        "Esperávamos 11 chaves, mas encontramos " +
        chaves.length
      );
    }

    const confirmar = confirm(
      "Restaurar as 11 chaves do iPhone neste PC?\n\n" +
      "Os registros locais correspondentes serão substituídos. " +
      "O backup na nuvem não será alterado."
    );

    if (!confirmar) return;

    // Guarda os valores atuais para permitir reversão
    const anteriores = {};

    for (const chave of chaves) {
      anteriores[chave] = localStorage.getItem(chave);
    }

    try {
      for (const chave of chaves) {
        localStorage.setItem(chave, dados[chave]);
      }
    } catch (erroGravacao) {
      for (const chave of chaves) {
        if (anteriores[chave] === null) {
          localStorage.removeItem(chave);
        } else {
          localStorage.setItem(chave, anteriores[chave]);
        }
      }

      throw erroGravacao;
    }

    alert(
      "Dados restaurados com sucesso! " +
      "O aplicativo será atualizado."
    );

    location.reload();

  } catch (erro) {
    console.error("Erro na restauração:", erro);
    alert("Restauração interrompida. Confira o console.");
  }
}

window.restaurarDadosDaNuvem = restaurarDadosDaNuvem;
