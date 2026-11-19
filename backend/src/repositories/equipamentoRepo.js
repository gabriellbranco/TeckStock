import { db } from "../config/db.js";

export const equipamentoRepo = {
  async listar(page, limit) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      "SELECT * FROM equipamentos ORDER BY nome ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) as total FROM equipamentos"
    );
    return {
      dados: rows,
      meta: {
        totalItens: total,
        paginaAtual: page,
        totalPaginas: Math.ceil(total / limit) || 1,
      },
    };
  },

  async buscarPorId(id) {
    const [rows] = await db.query("SELECT * FROM equipamentos WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  async criar(item) {
    const { id, nome, categoria, numero_serie, status, data_aquisicao } = item;

    await db.query(
      `INSERT INTO equipamentos (id, nome, categoria, numero_serie, status, data_aquisicao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, nome, categoria, numero_serie, status, data_aquisicao]
    );
    return item;
  },

  async atualizar(id, item) {
    const { nome, categoria, numero_serie, status, data_aquisicao } = item;
    const [result] = await db.query(
      `UPDATE equipamentos
       SET nome = ?, categoria = ?, numero_serie = ?, status = ?, data_aquisicao = ?
       WHERE id = ?`,
      [nome, categoria, numero_serie, status, data_aquisicao, id]
    );
    return result.affectedRows > 0;
  },

  async deletar(id) {
    const [result] = await db.query("DELETE FROM equipamentos WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};
