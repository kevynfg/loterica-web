import React from 'react';

export default function Numbers({ children: numbers }) {
  return <div style={styles.flexRow}>{numbers}</div>;
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
};
