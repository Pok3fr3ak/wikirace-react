import { useContext, useEffect, useState } from 'react';
import { UsernameContext } from '../main';
import { SocketContext } from './socket';

export default function Lobby(props: any) {
    
    const id: string = props.id;

    console.log(props);
    

    const [playerState, setPlayerState] = useState<Array<String>>();
    const [ready, setReady] = useState(false);

    const {username, setUsername} = useContext(UsernameContext);
    const io = useContext(SocketContext);

    useEffect(() => {
        io.emit('checkLobbyID', id);
        io.emit('lobbyInfo', { id, username })

        io.on('checkedLobbyID', (data: boolean) => {
            if (data === false) {
                props.props.history.push('/');
            }
        })

        io.on('usernames', (data: any) => {
            setPlayerState(data);
        })

        return () => {
            io.off('checkedLobbyID');
            io.off('usernames');
        }
    }, [])

    console.log(id, props);

    const playerList = playerState?.map((x, i) => {
        console.log(x);

        return <li key={i}>{x}</li>
    });

    return (
        <div>
            <div>
                <p className="lobbyCode">The Lobby Code is {id ? <span className="lobbyID">{id}</span> : "Nothing Here"}</p>
            </div>
            <h2>Players in Lobby:</h2>
            <ul>
                {playerList}
            </ul>
            <button
            onClick={()=>{
                setReady(true);
                io.emit('ready', id);
            }}
            disabled={ready === true ? true : false}
            >
                Ready
            </button>
        </div>
    )

}