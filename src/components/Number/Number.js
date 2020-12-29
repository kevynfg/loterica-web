import React from 'react';

export default function Number({ children: number, picked, onChecked, data }) {
  const { description, count } = number;
  const { randomCheck } = data;

  //console.log(onChecked);

  const pickedStyle = picked ? { backgroundColor: '#81ecec' } : {};
  return (
    <div style={{ ...styles.uncheckedContainer, ...pickedStyle }}>
      <span style={styles.number}>{description}</span>

      {onChecked ? (
        <div style={(styles.badgeContainer, styles.isHidden)}></div>
      ) : (
        <div style={styles.badgeContainer}>
          <span style={styles.badge}>{count}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    border: '1px solid lightgray',
    borderRadius: '4px',
    padding: '5px',
    margin: '5px',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '80px',
    flexWrap: 'wrap',
  },

  isHidden: {
    visible: 'hidden',
  },

  uncheckedContainer: {
    border: '1px solid lightgray',
    borderRadius: '4px',
    padding: '5px',
    margin: '5px',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    flexWrap: 'wrap',
  },

  number: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginRight: '10px',
  },

  badgeContainer: {
    minWidth: '30px',
    minHeight: '30px',
    border: '1px solid transparent',
    borderRadius: '50%',
    backgroundColor: '#c0392b',

    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: 'white',
  },
};
