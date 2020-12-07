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
  const [limitProbability, setLimitProbability] = useState(1);
  const [dataLotoFacil, setDataLotoFacil] = useState([]);
  const [gameNumbers, setGameNumbers] = useState([]);
  const [gameNumbersBefore, setGameNumbersBefore] = useState([]);
  const [gameNumbersSorted, setGameNumbersSorted] = useState([]);
  const [selectedGameNumbers, setSelectedGameNumbers] = useState([]);
  const [dataBeforeActualLotoFacil, setBeforeActualLotoFacil] = useState([]);
  const [firstForm, setFirstForm] = useState(false);
  const canRun = useRef(false);

  const getGameBefore = (gameDate) => {
    const { concurso } = gameDate;
    return concurso - 1;
  };

  useEffect(() => {
    async function getDataLotoFacil() {
      try {
        const { data } = await axios.get(
          `https://lotericas.io/api/v1/jogos/lotofacil/lasted`
        );

        console.log('Jogo Atual', data.data[0]);

        const { listaDezenas } = data.data[0];
        setGameNumbers(listaDezenas);
        setDataLotoFacil(data.data[0]);
      } catch (error) {
        alert('ocorreu um erro ao buscar os items');
      }
    }

    canRun.current = true;
    getDataLotoFacil();
  }, []);

  useEffect(() => {
    const getBeforeActualLotoFacil = async () => {
      try {
        if (canRun.current) {
          return;
        }

        const { data } = await axios.get(
          `https://lotericas.io/api/v1/jogos/lotofacil/${getGameBefore(
            dataLotoFacil
          )}`
        );

        console.log('Jogo Anterior', data.data);
        const { listaDezenas } = data.data;

        setBeforeActualLotoFacil(data.data);
        setGameNumbersBefore(listaDezenas);
      } catch (err) {
        console.log(err);
      }
    };
    getBeforeActualLotoFacil();
    canRun.current = false;
  }, [dataLotoFacil]);

  useEffect(() => {
    const interval = setTimeout(() => {
      let sorteados = [];
      gameNumbers.forEach((numero) => {
        gameNumbersBefore.forEach((item) => {
          const numeroSorteado = numero;
          if (numeroSorteado === item) {
            sorteados.push(parseInt(numeroSorteado));
          }
        });
      });

      setGameNumbersSorted(sorteados);
      console.log('Repetidos:', sorteados);
    }, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [gameNumbers, gameNumbersBefore]);

  useEffect(() => {
    if (!canRun.current) {
      return;
    }

    const interval = setTimeout(() => {
      if (pickedNumbers.length === 1) {
        setIsCalculating(false);
        return;
      }

      const newNumber = generateNumber();
      const newNumbers = [...numbers];
      const newPickedNumbers = [...pickedNumbers];

      const item = newNumbers.find((item) => item.value === newNumber);
      item.count++;

      /*
      ESTE BLOCO CONTEM CÓDIGO DE PERMUTAÇÃO EM TESTE
      */

      // let permArr = [],
      //   usedChars = [];
      // function permute(input) {
      //   let i, ch;
      //   for (i = 0; i < input.length; i++) {
      //     ch = input.splice(i, 1)[0];
      //     usedChars.push(ch);
      //     if (input.length === 0) {
      //       permArr.push(usedChars.slice());
      //     }
      //     permute(input);
      //     input.splice(i, 0, ch);
      //     usedChars.pop();
      //   }
      //   return permArr;
      // }

      const moreGamesArray = (number, count = 0) => {
        let RandomizedArray = [];
        if (number) {
          RandomizedArray = gameNumbersSorted.sort(() => {
            return 0.5 - Math.random();
          });
        }
        const item = RandomizedArray.slice(gameNumbersSorted, number).sort(
          (a, b) => a - b
        );

        // if (item) {
        //   setSelectedGameNumbers([...selectedGameNumbers, item]);
        // }
        //prettier-ignore
        if (selectedGameNumbers.includes(item)) {
          let idx = selectedGameNumbers.indexOf(item);
          setSelectedGameNumbers(selectedGameNumbers.splice(idx, 1, item));
        } else {
          setSelectedGameNumbers([...selectedGameNumbers, item]);
        }
        console.log('Item', item);
        return item;
      };

      console.log('Randomized', moreGamesArray(4));

      //Se o contador chegou no limite colocado no input
      if (item.count === limit) {
        newPickedNumbers.push(item.value);
      }
      setNumbers(newNumbers);
      setPickedNumbers(newPickedNumbers);

      // console.log('Heap Array', permute(gameNumbersSorted));

      const organizedArray = selectedGameNumbers.sort((a, b) => a - b);
      console.log(
        'numero selecionado:',
        organizedArray.filter(
          (value, index, array) => array.indexOf(value) === index
        )
      );
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
  }, [
    limit,
    numbers,
    pickedNumbers,
    isCalculating,
    gameNumbersSorted,
    selectedGameNumbers,
    gameNumbers,
  ]);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };
  const handleProbabilityChange = (newLimit) => {
    setLimitProbability(newLimit);
  };

  const handleButtonClick = () => {
    if (!limit) {
      return;
    }
    canRun.current = true;

    setNumbers(getEmptyArray());
    setPickedNumbers([]);
    setIsCalculating(true);
  };

  return (
    <div className="container">
      <h1 className="center">React Megasena</h1>

      {!firstForm && (
        <Form
          onButtonClick={handleButtonClick}
          onLimitChange={handleLimitChange}
          onProbabilityChange={handleProbabilityChange}
          data={{ isCalculating, limit, limitProbability }}
        />
      )}
      {!firstForm && (
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
      )}
      {!firstForm && <PickedNumbers>{pickedNumbers}</PickedNumbers>}
    </div>
  );
}
