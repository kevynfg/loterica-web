import React, { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import Form from './components/Form/Form';
import Numbers from './components/Numbers/Numbers';
import PickedNumbers from './components/PickedNumbers/PickedNumbers';
import Number from './components/Number/Number';

function getEmptyArray() {
  const array = Array.from({ length: 25 }).map((_, index) => {
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
  const [pairLimit, setPairLimit] = useState(1);
  const [oddLimit, setOddLimit] = useState(1);
  const [firstForm, setFirstForm] = useState(false);
  const [probabilityCheck, setProbabilityCheck] = useState(true);
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
        let tempArray = [];
        const { listaDezenas } = data.data[0];
        for (let i = 0; i < listaDezenas.length; i++) {
          const newValue = listaDezenas[i].substring(1);
          tempArray.push(newValue);
          setGameNumbers(tempArray);
        }
        //setGameNumbers(listaDezenas);
        console.log('new value', gameNumbers);
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
        for (let i = 0; i <= listaDezenas.length - 1; i++) {
          const newValue = listaDezenas[i].substring(1);
          setGameNumbersBefore([...gameNumbersBefore, newValue]);
        }
        setBeforeActualLotoFacil(data.data);
        //setGameNumbersBefore(listaDezenas);
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
      console.log('Jogo Atual:', gameNumbers);
    }, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [gameNumbers, gameNumbersBefore]);

  /*Initial State */
  useEffect(() => {
    const interval = setTimeout(() => {
      if (pickedNumbers.length === 15) {
        setIsCalculating(false);
        return;
      }
      const newNumber = generateNumber();
      const newNumbers = [...numbers];
      const newPickedNumbers = [...pickedNumbers];

      const item = newNumbers.find((item) => item.value === newNumber);
      const FindSortedNumbers = (array) => {
        for (let i = 0; i <= array.length - 1; i++) {
          const itemFound = array[i];

          if (itemFound === item.description) {
            setSelectedGameNumbers(item.value);
            item.count++;
          }
        }
        return item;
      };
      FindSortedNumbers(gameNumbers);

      //Se o contador chegou no limite colocado no input
      if (item.count === limit) {
        newPickedNumbers.push(item.value);
      }
      setNumbers(newNumbers);
      setPickedNumbers(newPickedNumbers);
    }, 4); // Valor mínimo

    return () => {
      clearTimeout(interval);
    };
  });

  // useEffect(() => {
  //   if (!canRun.current) {
  //     return;
  //   }

  //   const interval = setTimeout(() => {
  //     if (pickedNumbers.length === 15) {
  //       setIsCalculating(false);
  //       return;
  //     }

  //     const newNumber = generateNumber();
  //     const newNumbers = [...numbers];
  //     const newPickedNumbers = [...pickedNumbers];

  //     const item = newNumbers.find((item) => item.value === newNumber);

  //     const FindSortedNumbers = (array) => {
  //       for (let i = 0; i <= array.length - 1; i++) {
  //         const itemFound = array[i];
  //         if (itemFound === item.value.toString().padStart(3, '0')) {
  //           setSelectedGameNumbers(item.value);
  //           item.count++;
  //         }
  //       }
  //       return item;
  //     };
  //     FindSortedNumbers(gameNumbers);

  //     /* Permutação/Probabilidade de números em jogos da loteria */
  //     const splicedNumbers = gameNumbersSorted.slice(0, 6);
  //     const permute = (nums, set = [], answers = []) => {
  //       if (!nums.length) answers.push([...set]);

  //       for (let i = 0; i < nums.length; i++) {
  //         const newNums = nums.filter((n, index) => index !== i);
  //         set.push(nums[i]);
  //         permute(newNums, set, answers);
  //         set.pop();
  //         console.log(newNums);
  //       }
  //       return answers;
  //     };
  //     console.log(permute(splicedNumbers));

  //     //Se o contador chegou no limite colocado no input
  //     if (item.count === limit) {
  //       newPickedNumbers.push(item.value);
  //     }
  //     setNumbers(newNumbers);
  //     setPickedNumbers(newPickedNumbers);
  //   }, 4); // Valor mínimo

  //   /**
  //    * Retorno obrigatório de um setInterval
  //    * em useEffect. Perceba que o retorno é,
  //    * na verdade, uma arrow function. Isso
  //    * faz parte da sintaxe do useEffect
  //    */
  //   return () => {
  //     clearTimeout(interval);
  //   };
  // }, [
  //   limit,
  //   numbers,
  //   pickedNumbers,
  //   isCalculating,
  //   gameNumbersSorted,
  //   selectedGameNumbers,
  //   gameNumbers,
  // ]);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };
  const handleProbabilityChange = (newLimit) => {
    setLimitProbability(newLimit);
  };

  const handlePairChange = (newLimit) => {
    setLimitProbability(newLimit);
  };

  const handleOddChange = (newLimit) => {
    setLimitProbability(newLimit);
  };

  const handleCheck = (event) => {
    setProbabilityCheck(event);
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
      <h1 className="center">Lotérica Web</h1>

      <Form
        onButtonClick={handleButtonClick}
        onLimitChange={handleLimitChange}
        onProbabilityChange={handleProbabilityChange}
        onPairChange={handlePairChange}
        onOddChange={handleOddChange}
        onChecked={handleCheck}
        data={{ isCalculating, limit, limitProbability, probabilityCheck }}
      />

      <Numbers>
        {numbers.map((number) => {
          const { id, value } = number;
          const isPicked = pickedNumbers.some((item) => item === value);
          return (
            <div key={id}>
              <Number picked={isPicked} onChecked={probabilityCheck}>
                {number}
              </Number>
            </div>
          );
        })}
      </Numbers>

      <PickedNumbers>{pickedNumbers}</PickedNumbers>
    </div>
  );
}
