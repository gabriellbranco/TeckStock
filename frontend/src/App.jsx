import { useState, useEffect } from "react";
import "./App.css";
import { equipamentoApi } from "./services/api";

export function App() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [idEditando, setIdEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [status, setStatus] = useState("disponível");
  const [dataAquisicao, setDataAquisicao] = useState("");

  async function carregarTabela() {
    setCarregando(true);
    setErro("");
    try {
      const json = await equipamentoApi.listar(paginaAtual, 5);
      setEquipamentos(json.dados || []);
      setTotalPaginas(json.meta?.totalPaginas || 1);
    } catch {
      setErro("Erro ao conectar com o Back-end. Verifique se o servidor está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTabela();
  }, [paginaAtual]);

  async function handleSalvar(e) {
    e.preventDefault();
    setErro("");

    const dados = {
      nome,
      categoria,
      numero_serie: numeroSerie,
      status,
      data_aquisicao: dataAquisicao,
    };

    try {
      if (idEditando) {
        await equipamentoApi.atualizar(idEditando, dados);
      } else {
        await equipamentoApi.criar(dados);
      }
      limparFormulario();
      carregarTabela();
    } catch (err) {
      setErro(err.message);
    }
  }

  function editar(item) {
    setIdEditando(item.id);
    setNome(item.nome);
    setCategoria(item.categoria);
    setNumeroSerie(item.numero_serie);
    setStatus(item.status);
    setDataAquisicao(item.data_aquisicao.split("T")[0]);
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este equipamento?")) return;
    try {
      await equipamentoApi.deletar(id);
      carregarTabela();
    } catch (err) {
      setErro(err.message);
    }
  }

  function limparFormulario() {
    setIdEditando(null);
    setNome("");
    setCategoria("");
    setNumeroSerie("");
    setStatus("disponível");
    setDataAquisicao("");
  }

  return (
    <div>
      <h1>TechStock - Inventário</h1>

      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSalvar}>
        <input
          type="text"
          placeholder="Nome (ex: Notebook Dell)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoria (ex: Notebook)"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Número de Série"
          value={numeroSerie}
          onChange={(e) => setNumeroSerie(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="disponível">Disponível</option>
          <option value="emprestado">Emprestado</option>
          <option value="manutenção">Manutenção</option>
        </select>
        <input
          type="date"
          value={dataAquisicao}
          onChange={(e) => setDataAquisicao(e.target.value)}
          required
        />
        <button type="submit">
          {idEditando ? "Salvar Alterações" : "Cadastrar"}
        </button>
        {idEditando && (
          <button type="button" className="btn-cancelar" onClick={limparFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Nº Série</th>
              <th>Status</th>
              <th>Aquisição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos.length === 0 ? (
              <tr>
                <td colSpan="6">Nenhum equipamento cadastrado.</td>
              </tr>
            ) : (
              equipamentos.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.categoria}</td>
                  <td>{item.numero_serie}</td>
                  <td>{item.status}</td>
                  <td>{item.data_aquisicao.split("T")[0]}</td>
                  <td>
                    <button onClick={() => editar(item)}>Editar</button>
                    <button className="btn-excluir" onClick={() => excluir(item.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="paginacao">
        <button
          disabled={paginaAtual <= 1}
          onClick={() => setPaginaAtual(paginaAtual - 1)}
        >
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
          <button
            key={numero}
            className={paginaAtual === numero ? "pagina-ativa" : ""}
            onClick={() => setPaginaAtual(numero)}
          >
            {numero}
          </button>
        ))}

        <button
          disabled={paginaAtual >= totalPaginas}
          onClick={() => setPaginaAtual(paginaAtual + 1)}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default App;