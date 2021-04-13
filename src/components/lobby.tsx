import { useContext, useEffect, useState } from 'react';
import { LobbyContext } from '../main';
import { SocketContext } from './socket';

interface Players{
    username: string;
}

export default function Lobby(){

    const io = useContext(SocketContext);
    let lobbyCode = useContext(LobbyContext);
    const [playerState, setPlayerState] = useState<Array<Players>>();
    
    io.on('lobbyID', (data: any) => {
        lobbyCode = data;
    })

    useEffect(()=>{

    },[])

    console.log(lobbyCode);
    

    const playerList = playerState?.map((x, i) => {
        console.log(x);
        
        return <li key={i}>{x.username}</li>
    });  

    return(
        <div>
            <div>
                <p className="lobbyCode">The Lobby Code is {lobbyCode ? <span className="lobbyID">{lobbyCode}</span> : "Nothing Here"}</p>
            </div>
            <h2>Players in Lobby:</h2>
            <ul>
                {playerList}
            </ul>
        </div>
    )

}