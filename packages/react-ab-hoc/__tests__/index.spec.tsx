import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AbContext, abHocGenerator, asyncComponent, withAbHoc } from '../src';

function sleep(time = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

describe.concurrent('react-ab-hoc', () => {
    const componentBase = (props: { name: string }) => <div>{`${props.name} Base`}</div>;
    const componentA = (props: { name: string }) => <div>{`${props.name} A`}</div>;
    const componentB = (props: { name: string }) => <div>{`${props.name} B`}</div>;

    describe.sequential.each([
        {
            fnName: 'withAbHoc',
            AbContext,
            hoc: withAbHoc,
        },
        {
            fnName: 'abHocGenerator',
            ...abHocGenerator(),
        },
    ])('$fnName', ({ fnName, hoc, AbContext }) => {
        const wrapIdInText = (text: string) => {
            return `${fnName} ${text}`;
        };

        const AB = hoc(componentBase, {
            s_user_a: componentA,
            s_user_b: asyncComponent(
                () =>
                    new Promise<typeof componentB>((resolve) => {
                        setTimeout(() => {
                            resolve(componentB);
                        }, 100);
                    }),
            ),
        });
        const App = () => {
            const [abKeys, setAbKeys] = React.useState<string[]>([]);

            return (
                <AbContext.Provider value={abKeys}>
                    <button onClick={() => setAbKeys(['s_user_a'])}>{`${fnName} toggle A`}</button>
                    <button onClick={() => setAbKeys(['s_user_b'])}>{`${fnName} toggle B`}</button>
                    <AB name={fnName} />
                </AbContext.Provider>
            );
        };

        render(<App />);

        it('should mount component Base', async () => {
            expect(screen.getByText(wrapIdInText('Base'))).toBeInTheDocument();
        });

        it('should mount component A', async () => {
            await userEvent.click(screen.getByText(wrapIdInText('toggle A')));
            expect(screen.getByText(wrapIdInText('A'))).toBeInTheDocument();
        });

        it.sequential('should mount component B after componentB request is resolved', async () => {
            await userEvent.click(screen.getByText(wrapIdInText('toggle B')));
            expect(screen.getByText(wrapIdInText('A'))).toBeInTheDocument();
            await sleep(100);
            expect(screen.getByText(wrapIdInText('B'))).toBeInTheDocument();
        });

        it.sequential('should mount component A when toggle component B and then toggle component A', async () => {
            await userEvent.click(screen.getByText(wrapIdInText('toggle A')));
            await userEvent.click(screen.getByText(wrapIdInText('toggle B')));
            await userEvent.click(screen.getByText(wrapIdInText('toggle A')));

            expect(screen.getByText(wrapIdInText('A')));
            await sleep(100);
            expect(screen.getByText(wrapIdInText('A'))).toBeInTheDocument();
        });
    });
});
