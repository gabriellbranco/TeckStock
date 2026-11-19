const pool = require('../config/db');

const EquipamentoModel = {
  // Paginação real no MySQL usando LIMIT e OFFSET
  async listarPaginado(page, limit) {
    const offset = (page - 1) * limit;

    const queryDados = `
      SELECT id, nome, categoria, numero_serie, status,
             DATE_FORMAT(data_aquisicao, '%Y-%m-%d') AS data_aquisicao
      FROM equipamentos
      ORDER BY id DESC
      LIMIT ? OFFSET ?;
    `;

    const queryTotal = `SELECT COUNT(*) AS total FROM equipamentos;`;

    const [[rowsDados], [rowsTotal]] = await Promise.all([
      pool.query(queryDados, [Number(limit), Number(offset)]),
      pool.query(queryTotal),
    ]);

    const totalItems = rowsTotal[0].total;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data: rowsDados,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
      },
    };
  },

  async buscarPorId(id) {
    const query = `
      SELECT id, nome, categoria, numero_serie, status,
             DATE_FORMAT(data_aquisicao, '%Y-%m-%d') AS data_aquisicao
      FROM equipamentos
      WHERE id = ?;
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  },

  async criar({ nome, categoria, numero_serie, status, data_aquisicao }) {
    const query = `
      INSERT INTO equipamentos (nome, categoria, numero_serie, status, data_aquisicao)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [nome, categoria, numero_serie, status || 'disponivel', data_aquisicao];
    const [result] = await pool.execute(query, values);

    return this.buscarPorId(result.insertId);
  },

  async atualizar(id, { nome, categoria, numero_serie, status, data_aquisicao }) {
    const query = `
      UPDATE equipamentos
      SET nome = ?,
          categoria = ?,
          numero_serie = ?,
          status = ?,
          data_aquisicao = ?
      WHERE id = ?;
    `;
    const values = [nome, categoria, numero_serie, status, data_aquisicao, id];
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) return null;
    return this.buscarPorId(id);
  },

  async excluir(id) {
    const query = `DELETE FROM equipamentos WHERE id = ?;`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = EquipamentoModel;