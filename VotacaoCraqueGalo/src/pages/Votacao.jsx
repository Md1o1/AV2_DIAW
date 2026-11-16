import { useState } from 'react';
import { Link } from 'react-router-dom';
import JogadorCard from '../components/JogadorCard';
import {
  listarPorSituacao,
  obterSuspenso,
  registrarVoto,
} from '../services/votacaoService';

function Votacao() {
  const indicados = listarPorSituacao('indicado');
  const noElenco = listarPorSituacao('elenco');
  const jogadoresDaSemana = obterSuspenso();

  // Participante escolhido, mas que ainda não teve o voto confirmado
  const [selecionado, setSelecionado] = useState(null);
  // Nomes de quem o usuário salvou desde que abriu a página (na ordem dos votos)
  const [historico, setHistorico] = useState([]);

  function handleConfirmar() {
    registrarVoto(selecionado.id);
    setHistorico([...historico, selecionado.nome]);
    setSelecionado(null);
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Quem foi o craque da semana?</h1>
        <p>Selecione um jogador e confirme o voto para ele ser premiado.</p>
      </header>

      <section className="grade-jogadores">
        {indicados.map((p) => (
          <JogadorCard
            key={p.id}
            participante={p}
            selecionado={selecionado?.id === p.id}
            onSelecionar={setSelecionado}
          />
        ))}
      </section>

      <div className="confirmacao">
        <p>
          {selecionado
            ? <>Seu voto vai para <strong>{selecionado.nome}</strong> ganhar.</>
            : 'Nenhum peão selecionado.'}
        </p>
        <button
          type="button"
          className="botao botao-principal"
          disabled={!selecionado}
          onClick={handleConfirmar}
        >
          Confirmar voto
        </button>
      </div>

      {historico.length > 0 && (
        <section className="historico" aria-live="polite">
          <h2>
            Seus votos nesta sessão: {historico.length} {historico.length === 1 ? 'voto' : 'votos'}
          </h2>
          <ol className="historico-lista">
            {historico.map((nome, indice) => (
              <li key={indice}>{nome}</li>
            ))}
          </ol>
          <Link to="/resultado">Ver parcial</Link>
        </section>
      )}

      {jogadoresDaSemana && (
        <section className="demais">
          <h2>Fazendeiro da semana</h2>
          <p className="demais-legenda">não pode receber votos.</p>
          <div className="grade-participantes">
            <JogadorCard participante={jogadoresDaSemana} />
          </div>
        </section>
      )}

      <section className="demais">
        <h2>Outros jogadores</h2>
        <p className="demais-legenda">Não podem receber votos.</p>
        <div className="grade-participantes">
          {noElenco.map((p) => (
            <JogadorCard key={p.id} participante={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Votacao;
