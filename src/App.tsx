import React from 'react';
import './App.css';
import Main from './main';
import { SocketContext, socket } from './components/socket';

function App() {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        {/*       <header className="App-header">
        <h1>Wikirace</h1>
      </header> */}
        <Main />
      </SocketContext.Provider>
    </div>
  );
}

export default App;
