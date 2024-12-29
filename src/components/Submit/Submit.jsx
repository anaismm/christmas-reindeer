import { useEffect } from "react";
import { useState } from "react";
import useStore from "../../utils/store";
import s from "./Submit.module.scss";

const Submit = ({ score, death, setHasEnteredResults }) => {
  const [name, setName] = useState("");
  const { setResults } = useStore();
  const [error, setError] = useState("");

  useEffect(() => {
    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    if (results) {
      setResults(results);
    }
  }, []);

  const onSubmit = (e) => {
    //empêcher la page de reload
    e.preventDefault();

    if (name.trim() === "") {
      setError("Please enter your name"); 
      return; 
    }

    setError("");

    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    if (results === null) {
      // jamais personne qui a push son score
      results = [
        {
          name: name,
          score: score,
          death: death,
        },
      ];
      setResults(results);
      localStorage.setItem("results", JSON.stringify(results));
    } else {
      results.push({
        name: name,
        score: score,
        death: death,
      });

      localStorage.setItem("results", JSON.stringify(results));
      setResults(results);
    }

    setHasEnteredResults(true);
  };

  return (
    <div>
      <h2 className={s.title}>Add your success in the scoreboard ! </h2>
      
      <div className={s.score}>
        <img src="/cadeau.svg" alt="" />
        <p className={s.subtitle}>Your score: {score}</p>
      </div>  
      
      
       <form className={s.form} onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
           {error && <p className={s.error}>{error}</p>}
          <input type="submit" value="Add your score" /> 
      </form>
    </div>
   
  );
};

export default Submit;
