import React, { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import Form from './components/Form/Form';
import Numbers from './components/Numbers/Numbers';
import PickedNumbers from './components/PickedNumbers/PickedNumbers';
import Number from './components/Number/Number';

function getEmptyArray() {
  const array = Array.from({ length: 25 }).map((_, index) => {
    const id = index + 1;
    const description = id.toString().padStart(3, '0');

    return {
      id,
      description,
      value: id,
      count: 0,
    };
  });

  return array;
}

const JOGOS_LOTOFACIL = [];

//Existe uma regra, que estas funções não geram 1
//por isso o + 1 é usado
//vai até o número 61
function generateNumber(min = 1, max = 25) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function App() {
  const [numbers, setNumbers] = useState(getEmptyArray());
  const [pickedNumbers, setPickedNumbers] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [limit, setLimit] = useState(1);
  const [dataLotoFacil, setDataLotoFacil] = useState([]);
  const [gameNumbers, setGameNumbers] = useState([]);
  const [gameNumbersBefore, setGameNumbersBefore] = useState([]);
  const [dataBeforeActualLotoFacil, setBeforeActualLotoFacil] = useState([]);
  const canRun = useRef(false);
  //let canRun = false;
  const idGameBefore = useRef('');

  useEffect(() => {
    async function getDataLotoFacil() {
      try {
        const { data } = await axios.get(
          `https://lotericas.io/api/v1/jogos/lotofacil/lasted`
        );

        const { listaDezenas } = data.data[0];
        setGameNumbers(listaDezenas);
        setDataLotoFacil(data.data[0]);
        // const dataGameBefore = await axios.get(
        //   `https://lotericas.io/api/v1/jogos/lotofacil/${concurso - 1}`
        // );

        // setBeforeActualLotoFacil(dataGameBefore.data);
        // setGameNumbersBefore();
      } catch (error) {
        alert('ocorreu um erro ao buscar os items');
      }
    }

    async function getBeforeActualLotoFacil() {
      try {
        const dataFetch = await axios.get(
          `https://lotericas.io/api/v1/jogos/lotofacil/lasted`
        );

        const { concurso } = dataFetch.data.data[0];
        const { data } = await axios.get(
          `https://lotericas.io/api/v1/jogos/lotofacil/${concurso - 1}`
        );

        console.log('data 1', data.data);
        const { listaDezenas } = data.data;
        setGameNumbersBefore(listaDezenas);
        setBeforeActualLotoFacil(data.data);
      } catch (error) {
        alert('ocorreu um erro ao buscar os dados');
      }
    }

    getBeforeActualLotoFacil();
    getDataLotoFacil();
  }, []);

  const getGameBefore = (gameDate) => {
    const { concurso } = gameDate;
    return concurso - 1;
  };

  idGameBefore.current = getGameBefore(dataLotoFacil);

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

      const newNumber = generateNumber();
      const newNumbers = [...numbers];
      const newPickedNumbers = [...pickedNumbers];

      //console.log(numeroConcursoAnterior);

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

  console.log('Números atuais', gameNumbers);
  console.log('Números de ontem', gameNumbersBefore);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleButtonClick = () => {
    if (!limit) {
      return;
    }
    JOGOS_LOTOFACIL.splice(0, JOGOS_LOTOFACIL.length);

    JOGOS_LOTOFACIL.push(
      { Today: gameNumbers },
      { Yesterday: gameNumbersBefore }
    );

    canRun.current = true;

    setNumbers(getEmptyArray());
    setPickedNumbers([]);
    setIsCalculating(true);
  };

  console.log('Jogos', JOGOS_LOTOFACIL);

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
