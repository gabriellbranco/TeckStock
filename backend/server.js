import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { equipamentoRoutes } from "./src/routes/equipamentoRoutes.js";

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

await fastify.register(equipamentoRoutes);

const port = Number(process.env.PORT) || 3333;

try {
  await fastify.listen({ port, host: "0.0.0.0" });
  console.log(`Servidor rodando em http://localhost:${port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
