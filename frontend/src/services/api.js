const API_URL = "http://localhost:3333/equipamentos";

export const equipamentoApi = {
  async listar(pagina = 1, limite = 5) {
    const resposta = await fetch(`${API_URL}?page=${pagina}&limit=${limite}`);
    if (!resposta.ok) throw new Error("Erro ao carregar equipamentos.");
    return resposta.json();
  },

  async criar(dados) {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const json = await resposta.json();
    if (!resposta.ok) throw new Error(json.erro || "Erro ao cadastrar.");
    return json;
  },

  async atualizar(id, dados) {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const json = await resposta.json();
    if (!resposta.ok) throw new Error(json.erro || "Erro ao atualizar.");
    return json;
  },

  async deletar(id) {
    const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error("Erro ao excluir.");
  },
};