import useStore from "../../utils/store";
import s from "./Snake.module.scss";

const Snake = ({ data, isInvisible  }) => {
    
  const getStyle = (dot, i) => {
    let background = null;

    // La tete du serpent c'est une image et le reste c'est des carrés marron
    if (data[data.length - 1] === dot) {
      background = `url('/renne4.svg')`;

    } else {
      background = "#94653A";
    }

    const style = {
      transform: `translate(${dot[0]}px, ${dot[1]}px)`,
      background: background,
      backgroundSize: "cover",
      opacity: isInvisible ? 0 : 1,
    };


    return style;
  };

 
  return (
    <>
      {data.map((dot, i) => (
        <div key={i} className={s.snakeDot} style={getStyle(dot, i)}></div>
      ))}
    </>
  );
};

export default Snake;
