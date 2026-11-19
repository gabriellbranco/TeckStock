import { equipamentoCtrl } from "../controllers/equipamentoCtrl.js";

export async function equipamentoRoutes(fastify) {
  fastify.get("/equipamentos", equipamentoCtrl.listar);
  fastify.get("/equipamentos/:id", equipamentoCtrl.buscarPorId);
  fastify.post("/equipamentos", equipamentoCtrl.criar);
  fastify.put("/equipamentos/:id", equipamentoCtrl.atualizar);
  fastify.delete("/equipamentos/:id", equipamentoCtrl.deletar);
}
