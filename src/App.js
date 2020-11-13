import React, { useState, useEffect, useRef } from 'react';

import Form from './components/Form/Form';
import Numbers from './components/Numbers/Numbers';
import PickedNumbers from './components/PickedNumbers/PickedNumbers';
import Number from './components/Number/Number';

function getEmptyArray() {
  const array = Array.from({ length: 60 }).map((_, index) => {
    const id = index + 1;
    const description = id.toString().padStart(2, '0');

    return {
      id,
      description,
      value: id,
      count: 0,
    };
  });

  return array;
}

//Existe uma regra, que estas funções não geram 1
//por isso o + 1 é usado
//vai até o número 61
function generateNumber(min = 1, max = 60) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function App() {
  const [numbers, setNumbers] = useState(getEmptyArray());
  const [pickedNumbers, setPickedNumbers] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [limit, setLimit] = useState(1);

  const canRun = useRef(false);
  //let canRun = false;

  useEffect(() => {
    if (!canRun.current) {
      return;
    }
    // if (!canRun) {
    //   return;
    // }

    const interval = setTimeout(() => {
      if (pickedNumbers.length === 6) {
        setIsCalculating(false);

        /**
         * Retorno simples. O clearInterval
         * é feito ao final do useEffect
         */
        return;
      }

      //Faz cópia dos dois arrays gerados para trabalhar depois
      const newNumber = generateNumber();
      const newNumbers = [...numbers];
      const newPickedNumbers = [...pickedNumbers];

      //Se encontrar o item sorteado no array -> incrementa o contador dele
      const item = newNumbers.find((item) => item.value === newNumber);
      item.count++;

      //Se o contador chegou no limite colocado no input
      if (item.count === limit) {
        newPickedNumbers.push(item.value);
      }

      setNumbers(newNumbers);
      setPickedNumbers(newPickedNumbers);
    }, 4); // Valor mínimo

    /**
     * Retorno obrigatório de um setInterval
     * em useEffect. Perceba que o retorno é,
     * na verdade, uma arrow function. Isso
     * faz parte da sintaxe do useEffect
     */
    return () => {
      console.log('clearInterval');
      clearTimeout(interval);
    };
  }, [limit, numbers, pickedNumbers, isCalculating]);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleButtonClick = () => {
    canRun.current = true;
    //canRun = true;

    setNumbers(getEmptyArray());
    setPickedNumbers([]);
    setIsCalculating(true);
  };

  return (
    <div className="container">
      <h1 className="center">React Megasena</h1>

      <Form
        onButtonClick={handleButtonClick}
        onLimitChange={handleLimitChange}
        data={{ isCalculating, limit }}
      />

      <Numbers>
        {numbers.map((number) => {
          const { id, value } = number;
          const isPicked = pickedNumbers.some((item) => item === value);

          return (
            <div key={id}>
              <Number picked={isPicked}>{number}</Number>
            </div>
          );
        })}
      </Numbers>

      <PickedNumbers>{pickedNumbers}</PickedNumbers>
    </div>
  );
}
