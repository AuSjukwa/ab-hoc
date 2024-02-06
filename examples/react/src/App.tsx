import { Suspense, useState } from 'react';
import { type ABKey, AbContext } from 'react-ab-hoc';
import HelloWorld from './components/HelloWorld';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [abKeys, setAbKeys] = useState<ABKey[]>([]);

    return (
        <Suspense>
            <AbContext.Provider value={abKeys}>
                <div>
                    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                        <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noreferrer">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>

                <button onClick={() => setAbKeys(['s_base'])}>Group Base</button>
                <button style={{ marginLeft: '1em' }} onClick={() => setAbKeys(['s_a'])}>Group A</button>
                <button style={{ marginLeft: '1em' }} onClick={() => setAbKeys(['s_b'])}>Group B</button>
                <HelloWorld msg="Vite + React" />
            </AbContext.Provider>
        </Suspense>
    );
}

export default App;
