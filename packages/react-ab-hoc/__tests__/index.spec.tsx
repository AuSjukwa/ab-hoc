import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import React from 'react';
import { AbContext, abHocGenerator, withAbHoc } from '../src';

describe('react-ab-hoc', () => {
    const componentBase = () => <div>Base</div>;
    const componentA = () => <div>A</div>;
    const componentB = () => <div>B</div>;

    describe('withAbHoc', () => {
        const AB = withAbHoc(componentBase, {
            s_user_a: componentA,
            s_user_b: componentB,
        });
        const App = () => {
            const [abKeys, setAbKeys] = React.useState<string[]>([]);

            return (
                <AbContext.Provider value={abKeys}>
                    <button onClick={() => setAbKeys(['s_user_a'])}>toggle A</button>
                    <AB />
                </AbContext.Provider>
            );
        };
        const component = render(<App />);

        it('should mount component Base', () => {
            const abComponentText = component.container.querySelector('div')?.textContent ?? '';
            expect(abComponentText).toBe('Base');
        });

        it('should mount component A', async () => {
            await userEvent.click(screen.getByText('toggle A'));
            const abComponentText = component.container.querySelector('div')?.textContent ?? '';
            expect(abComponentText).toBe('A');
        });
    });

    describe('abHocGenerator', () => {
        const { AbContext, hoc } = abHocGenerator();

        const AB = hoc(componentBase, {
            s_user_a: componentA,
            s_user_b: componentB,
        });

        const App = () => {
            const [abKeys, setAbKeys] = React.useState<string[]>([]);

            return (
                <AbContext.Provider value={abKeys}>
                    <button onClick={() => setAbKeys(['s_user_b'])}>toggle B</button>
                    <AB />
                </AbContext.Provider>
            );
        };
        const component = render(<App />);

        it('should mount component Base', () => {
            const abComponentText = component.container.querySelector('div')?.textContent ?? '';
            expect(abComponentText).toBe('Base');
        });

        it('should mount component B', async () => {
            await userEvent.click(screen.getByText('toggle B'));
            const abComponentText = component.container.querySelector('div')?.textContent ?? '';
            expect(abComponentText).toBe('B');
        });
    });
});
