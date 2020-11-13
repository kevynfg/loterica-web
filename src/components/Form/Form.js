import React from 'react';

export default function Form({ onLimitChange, onButtonClick, data }) {
  const handleLimitChange = ({ target }) => {
    //parseInt é mais seguro, com 10 -> decimal
    onLimitChange(parseInt(target.value, 10));
  };

  const { limit, isCalculating } = data;

  return (
    <form>
      <div styles={styles.flexRow}>
        <div
          className="input-field"
          style={{ width: '300px', marginRight: '10px' }}
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
        </div>

        <button
          type="submit"
          className="waves-effect waves-light btn"
          onClick={onButtonClick}
          disabled={isCalculating}
        >
          Calcular
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
