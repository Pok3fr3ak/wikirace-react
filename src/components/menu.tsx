import React, { useContext, useEffect, useState } from 'react';
import { Link, Route, Router } from 'react-router-dom';
import { LobbyContext, UsernameContext } from '../main';
import { SocketContext } from './socket';


enum menuState {
    start, addUsername
}

export default function Menu(props: any) {

    const socket = useContext(SocketContext);

    const [menuState, setMenuState] = useState(0);
    const [friendsState, setFriendsState] = useState(0);
    const [lobbyInput, setLobbyInput] = useState('');

    const io = useContext(SocketContext);
    const { lobbyID, setLobbyID } = useContext(LobbyContext);
    const { username, setUsername } = useContext(UsernameContext);

    useEffect(() => {
        io.on('lobbyID', (data: any) => {
            console.log(data);

            setLobbyID(data);
            props.history.push(`/lobby/${data}`)
        })

        return () => {
            io.off('lobbyID');
        }
    }, [])

    return (
        <div className="Menu">
            { menuState === 1 ?
                <div>
                    <button onClick={() => setMenuState(0)}>BACK</button>
                    <button onClick={() => setFriendsState(1)}>
                        Lobby erstellen
                    </button>
                    <button onClick={() => setFriendsState(2)}>
                        Einer bestehenden Lobby joinen
                    </button>
                    {
                        friendsState === 1 || friendsState === 2 ?
                            <div>
                                <label htmlFor="username">Username: </label>
                                <input onChange={event => setUsername(event.target.value)} type="text" name="username" id="username" required />
                                {
                                    friendsState === 1 ?
                                        <div>
                                            <button id="confirmUsername" onClick={() => {
                                                socket.emit('requestLobby', username);
                                            }}>Les Play</button>
                                        </div>
                                        :
                                        <div>
                                            <input onChange={event => setLobbyInput(event.target.value)} type="text" name="username" id="username" required />
                                            <Link to={`/lobby/${lobbyInput}`}>Go To Lobby Scree</Link>
                                        </div>
                                }
                            </div>
                            :
                            <div></div>
                    }

                </div>
                :
                <div>
                    <button>Training</button>
                    <button onClick={() => setMenuState(1)}>Spiel doch mit Freunden</button>
                </div>
            }
        </div>
    )

}