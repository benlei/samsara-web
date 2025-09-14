import React from 'react';
import { render, screen } from '@testing-library/react';
import { TypeContext, Type } from '@/components/context';

describe('TypeContext', () => {
  it('provides default context values', () => {
    const TestComponent = () => {
      const context = React.useContext(TypeContext);
      return (
        <div>
          <span data-testid="character-type">{context.characterType}</span>
          <span data-testid="characters-text">{context.charactersText}</span>
          <span data-testid="weapon-type">{context.weaponType}</span>
          <span data-testid="weapons-text">{context.weaponsText}</span>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('character-type')).toHaveTextContent('characters');
    expect(screen.getByTestId('characters-text')).toHaveTextContent('Characters');
    expect(screen.getByTestId('weapon-type')).toHaveTextContent('weapons');
    expect(screen.getByTestId('weapons-text')).toHaveTextContent('Weapons');
  });

  it('can be overridden with custom values', () => {
    const customValue: Type = {
      characterType: 'hsr-characters',
      charactersText: 'HSR Characters',
      weaponType: 'lightcones',
      weaponsText: 'Light Cones',
    };

    const TestComponent = () => {
      const context = React.useContext(TypeContext);
      return (
        <div>
          <span data-testid="character-type">{context.characterType}</span>
          <span data-testid="characters-text">{context.charactersText}</span>
          <span data-testid="weapon-type">{context.weaponType}</span>
          <span data-testid="weapons-text">{context.weaponsText}</span>
        </div>
      );
    };

    render(
      <TypeContext.Provider value={customValue}>
        <TestComponent />
      </TypeContext.Provider>
    );

    expect(screen.getByTestId('character-type')).toHaveTextContent('hsr-characters');
    expect(screen.getByTestId('characters-text')).toHaveTextContent('HSR Characters');
    expect(screen.getByTestId('weapon-type')).toHaveTextContent('lightcones');
    expect(screen.getByTestId('weapons-text')).toHaveTextContent('Light Cones');
  });

  it('supports multiple consumers', () => {
    const Consumer1 = () => {
      const { characterType } = React.useContext(TypeContext);
      return <span data-testid="consumer-1">{characterType}</span>;
    };

    const Consumer2 = () => {
      const { weaponType } = React.useContext(TypeContext);
      return <span data-testid="consumer-2">{weaponType}</span>;
    };

    render(
      <div>
        <Consumer1 />
        <Consumer2 />
      </div>
    );

    expect(screen.getByTestId('consumer-1')).toHaveTextContent('characters');
    expect(screen.getByTestId('consumer-2')).toHaveTextContent('weapons');
  });
});