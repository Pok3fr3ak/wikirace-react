import { createContext, useContext, useEffect, useState } from 'react';
import Menu from './components/menu';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Game from './components/game';
import { SocketContext } from './components/socket';
import { Training } from './components/test';

export const LobbyContext = createContext({
    lobbyID: 0,
    setLobbyID: (num: number) => { }
});

export const UsernameContext = createContext({
    username: 'TestPlayer',
    setUsername: (str: string) => { },
})

export default function Main() {

    const io = useContext(SocketContext);

    const [lobbyID, setLobbyID] = useState(0);
    const [username, setUsername] = useState('TestPlayer');

    const lobbyVal = { lobbyID, setLobbyID }
    const usernameVal = { username, setUsername };

    useEffect(() => {

    }, [])

    return (
        <main>
            <LobbyContext.Provider value={lobbyVal}>
                <UsernameContext.Provider value={usernameVal}>
                    <Router>
                        <Route exact path="/" component={Menu} />
                        <Route path="/lobby/:id?" component={Game} />
                        <Route path="/testing" component={Training} />
                    </Router>
                </UsernameContext.Provider>
            </LobbyContext.Provider>
        </main>
    )
}