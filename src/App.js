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
  const [isProbability, setIsProbability] = useState(false);
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
  const [randomCheck, setRandomCheck] = useState(false);
  const canRun = useRef(false);
  const canCalculate = useRef(false);
  const canCalculateProbability = useRef(false);

  //Pega os dados do jogo anterior da Lotofácil
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
        let newArray = [];
        for (let i = 0; i <= listaDezenas.length - 1; i++) {
          const newValue = listaDezenas[i].substring(1);
          newArray.push(newValue);
          setGameNumbersBefore(newArray);
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
    //Anula o efeito deste effect, para que o cálculo de numeros aleatórios aconteça
    if (canCalculate.current) {
      return;
    }
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

  /*Calcular números aleatórios */
  useEffect(() => {
    if (!canCalculate.current) {
      return;
    }
    const interval = setTimeout(() => {
      if (pickedNumbers.length === 15) {
        setIsProbability(false);
        setIsCalculating(false);
        console.log('Arrays de Probabilidades: ', gameNumbersSorted);
        return;
      }
      const newNumber = generateNumber();
      const newNumbers = [...numbers];
      const newPickedNumbers = [...pickedNumbers];

      const item = newNumbers.find((item) => item.value === newNumber);
      item.count++;

      //Se o contador chegou no limite colocado no input
      if (item.count === limit) {
        newPickedNumbers.push(item.value);
      }
      setGameNumbersSorted(permute(gameNumbers));
      setNumbers(newNumbers);
      setPickedNumbers(newPickedNumbers);
    }, 4); // Valor mínimo

    return () => {
      clearTimeout(interval);
    };
  }, [limit, numbers, pickedNumbers, isCalculating, limitProbability]);

  /* Permutação/Probabilidade de números em jogos da loteria */
  const permute = (nums, set = [], answers = []) => {
    const splicedNumbers = nums.slice(0, 4);
    if (!splicedNumbers.length) answers.push([...set]);

    for (let i = 0; i < splicedNumbers.length; i++) {
      const newNums = splicedNumbers.filter((n, index) => index !== i);
      set.push(splicedNumbers[i]);
      permute(newNums, set, answers);
      set.pop();
    }
    return answers;
  };

  /*Controlar botão para calcular probabilidades */
  useEffect(() => {
    if (!canCalculateProbability.current) {
      return;
    }

    const interval = setTimeout(() => {
      if (pickedNumbers.length === 15) {
        setIsProbability(false);
        setIsCalculating(false);
        return;
      }

      const newNumber = generateNumber();
      const newNumbers = [...numbers];
      const newPickedNumbers = [...pickedNumbers];

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
      clearTimeout(interval);
    };
  }, [
    limitProbability,
    numbers,
    pickedNumbers,
    isProbability,
    probabilityCheck,
  ]);

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
    setRandomCheck(false);
  };
  const handleCheckRandom = (event) => {
    setRandomCheck(event);
    setProbabilityCheck(false);
  };

  const handleButtonClick = () => {
    if (!limit) {
      return;
    }
    canCalculate.current = true;
    canCalculateProbability.current = false;
    canRun.current = true;
    setNumbers(getEmptyArray());
    setPickedNumbers([]);
    setIsCalculating(true);
    setIsProbability(true);
    setProbabilityCheck(false);
    setRandomCheck(true);
  };
  const handleProbClick = () => {
    if (!limitProbability) {
      return;
    }
    canCalculate.current = false;
    canCalculateProbability.current = true;
    canRun.current = true;
    setNumbers(getEmptyArray());
    setPickedNumbers([]);
    setIsProbability(true);
    setIsCalculating(true);
    setProbabilityCheck(true);
    setRandomCheck(false);
  };

  return (
    <div className="container">
      <h1 className="center">Lotérica Web</h1>

      <Form
        onButtonClick={handleButtonClick}
        onProbClick={handleProbClick}
        onProbabilityClick={handleProbabilityChange}
        onProbabilityChange={handleProbabilityChange}
        onLimitChange={handleLimitChange}
        onPairChange={handlePairChange}
        onOddChange={handleOddChange}
        onChecked={handleCheck}
        onRandomChecked={handleCheckRandom}
        data={{
          isCalculating,
          limit,
          limitProbability,
          probabilityCheck,
          randomCheck,
          isProbability,
        }}
      />

      {randomCheck && (
        <Numbers>
          {numbers.map((number) => {
            const { id, value } = number;
            const isPicked = pickedNumbers.some((item) => item === value);
            return (
              <div key={id}>
                <Number
                  picked={isPicked}
                  onChecked={probabilityCheck}
                  data={{ randomCheck }}
                >
                  {number}
                </Number>
              </div>
            );
          })}
        </Numbers>
      )}

      {probabilityCheck && (
        <Numbers>
          {numbers.map((number) => {
            const { id, value } = number;
            const isPicked = pickedNumbers.some((item) => item === value);
            return (
              <div key={id}>
                <Number
                  picked={isPicked}
                  onChecked={probabilityCheck}
                  data={{ randomCheck }}
                >
                  {number}
                </Number>
              </div>
            );
          })}
        </Numbers>
      )}

      <PickedNumbers>{pickedNumbers}</PickedNumbers>
    </div>
  );
}
