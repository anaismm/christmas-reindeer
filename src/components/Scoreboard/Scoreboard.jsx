import useStore from "../../utils/store";
import s from "./Scoreboard.module.scss";

const Scoreboard = () => {
  const { results } = useStore();

  return (
    <div>
      <h1 className={s.title}>Christmas  <span class="special-letter">&#xE018;</span>eindeer</h1>
      <div className={s.scoreboard}>
        <span className={s.score_title}><img src="/trophy.svg" width="25rem" height="25rem" alt=""/><h2>Scoreboard</h2></span>
        <div className={s.results}>
          <div className={s.header}>
            <span>Name</span>
            <span className={s.score}>Score</span>
            <span>Deaths</span>
          </div>

          {results.map((result, i) => (
            <div className={s.result} key={result.name + i}>
              <span>{result.name}</span>
              <span>{result.score}</span>
              <span>{result.death}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
