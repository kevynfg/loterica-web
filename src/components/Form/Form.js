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
      <div className="col s12">
        <div className="row">
          <div className="input-field col s6">
            <div styles={styles.flexRow}>
              <div
                className="input-field col s6"
                style={{ width: '200px', marginRight: '10px' }}
              >
                <input
                  id="inputLimit"
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={limit}
                  onChange={handleLimitChange}
                  disabled={isCalculating}
                />
                <label htmlFor="inputLimit" className="active">
                  Quantidade de sorteios:
                </label>
                <button
                  type="submit"
                  className="waves-effect waves-light btn"
                  onClick={onButtonClick}
                  disabled={isCalculating}
                >
                  Calcular
                </button>
              </div>
              <div
                className="input-field col s6"
                style={{ width: '200px', marginRight: '10px' }}
              >
                <input
                  id="inputProbability"
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  value={limitProbability}
                  onChange={handleProbabilityChange}
                  disabled={isCalculating}
                />
                <label htmlFor="inputProbability" className="active">
                  Probabilidades:
                </label>
                <button
                  type="submit"
                  className="waves-effect waves-light btn"
                  onClick={onButtonClick}
                  disabled={isCalculating}
                >
                  Probabilidades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
