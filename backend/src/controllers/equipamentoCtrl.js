import { v4 as uuidv4 } from "uuid";
import { equipamentoRepo } from "../repositories/equipamentoRepo.js";

export const equipamentoCtrl = {
  async listar(request, reply) {
    try {
      const page = Number(request.query.page) || 1;
      const limit = Number(request.query.limit) || 100;
      const resultado = await equipamentoRepo.listar(page, limit);
      return reply.status(200).send(resultado);
    } catch (error) {
      console.error("Erro ao listar equipamentos:", error);
      return reply.status(500).send({ erro: "Erro ao listar equipamentos." });
    }
  },

  async buscarPorId(request, reply) {
    try {
      const item = await equipamentoRepo.buscarPorId(request.params.id);
      if (!item) {
        return reply.status(404).send({ erro: "Equipamento não encontrado." });
      }
      return reply.status(200).send(item);
    } catch (error) {
      console.error("Erro ao buscar equipamento:", error);
      return reply.status(500).send({ erro: "Erro ao buscar equipamento." });
    }
  },

  async criar(request, reply) {
    try {
      const { nome, categoria, numero_serie, status, data_aquisicao } =
        request.body;
      if (!nome || !categoria || !numero_serie || !data_aquisicao) {
        return reply.status(400).send({ erro: "Preencha todos os campos." });
      }
      const novoItem = {
        id: uuidv4(),
        nome,
        categoria,
        numero_serie,
        status: status || "disponível",
        data_aquisicao,
      };
      await equipamentoRepo.criar(novoItem);
      return reply.status(201).send(novoItem);
    } catch (error) {
      console.error("Erro ao cadastrar equipamento:", error);
      if (error.code === "ER_DUP_ENTRY") {
        return reply
          .status(400)
          .send({ erro: "Número de série já cadastrado." });
      }
      return reply.status(500).send({ erro: "Erro ao cadastrar." });
    }
  },

  async atualizar(request, reply) {
    try {
      const { nome, categoria, numero_serie, status, data_aquisicao } =
        request.body;
      if (!nome || !categoria || !numero_serie || !data_aquisicao) {
        return reply.status(400).send({ erro: "Preencha todos os campos." });
      }

      const dadosAtualizados = {
        nome,
        categoria,
        numero_serie,
        status: status || "disponível",
        data_aquisicao: data_aquisicao.split("T")[0],
      };

      const ok = await equipamentoRepo.atualizar(
        request.params.id,
        dadosAtualizados
      );
      if (!ok) {
        return reply.status(404).send({ erro: "Equipamento não encontrado." });
      }
      return reply.status(200).send({ mensagem: "Atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar equipamento:", error);
      if (error.code === "ER_DUP_ENTRY") {
        return reply
          .status(400)
          .send({ erro: "Número de série já cadastrado." });
      }
      return reply.status(500).send({ erro: "Erro ao atualizar." });
    }
  },

  async deletar(request, reply) {
    try {
      const ok = await equipamentoRepo.deletar(request.params.id);
      if (!ok) {
        return reply.status(404).send({ erro: "Equipamento não encontrado." });
      }
      return reply.status(200).send({ mensagem: "Excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      return reply.status(500).send({ erro: "Erro ao excluir." });
    }
  },
};
