import React from 'react';

export default function PickedNumbers({ children: numbers }) {
  numbers.sort((a, b) => a - b);

  if (numbers.length > 0) {
    const formattedNumbers = numbers
      .map((number) => number.toString().padStart(2, '0'))
      .join(', ');

    return (
      <p style={{ fontSize: '1.5rem' }}>
        Números sorteados: <strong>{formattedNumbers}</strong>
      </p>
    );
  }
  return null;
}
