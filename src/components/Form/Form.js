import React from 'react';

export default function Form({
  onLimitChange,
  onButtonClick,
  onProbabilityChange,
  data,
}) {
  const handleLimitChange = ({ target }) => {
    //parseInt é mais seguro, com 10 -> decimal
    onLimitChange(parseInt(target.value, 10));
  };
  const handleProbabilityChange = ({ target }) => {
    //parseInt é mais seguro, com 10 -> decimal
    onProbabilityChange(parseInt(target.value, 10));
  };
  const { limit, isCalculating, limitProbability } = data;

  return (
    <form>
      <div styles={styles.flexRow}>
        <div
          className="input-field"
          style={{ width: '200px', marginRight: '10px' }}
        >
          <input
            id="inputLimit"
            type="number"
            min="1"
            max="999"
            step="1"
            value={limit}
            onChange={handleLimitChange}
            disabled={isCalculating}
          />
          <label htmlFor="inputLimit" className="active">
            Quantidade máxima de sorteios:
          </label>
          <div
            className="input-field"
            style={{ width: '200px', marginRight: '10px' }}
          >
            <input
              id="inputProbability"
              type="number"
              min="1"
              max="999"
              step="1"
              value={limitProbability}
              onChange={handleProbabilityChange}
              disabled={isCalculating}
            />
            <label htmlFor="inputProbability" className="active">
              Probabilidades:
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="waves-effect waves-light btn"
          onClick={onButtonClick}
          disabled={isCalculating}
        >
          Calcular
        </button>
        <button
          style={{ margin: '10px' }}
          type="submit"
          className="waves-effect waves-light btn"
          onClick={onButtonClick}
          disabled={isCalculating}
        >
          Probabilidades
        </button>
      </div>
    </form>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
