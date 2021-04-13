import { useContext, useEffect, useRef, useState } from "react";
import Lobby from "./lobby";
import { SocketContext } from "./socket";

interface RouteEntry {
    pageid: number,
    title: string,
}

interface WikiMediaParserOutput {
    title: string,
    [key: string]: any
}

interface GameInfo {
    article: [{
        id: number;
        ns: number;
        title: string;
        [key: string]: any;
    }],
    data: {
        parse: {
            pageid: number;
            text: string;
            title: string;
            [key: string]: any;
        }
    }
}

export default function Game(props: any) {

    const lobbyid: string = props.match.params.id;
    const training = props.training;

    const [wikipediaContent, setWikipediaContent] = useState('');
    const [route, setRoute] = useState<Array<RouteEntry>>([]);
    const [goal, setGoal] = useState<WikiMediaParserOutput>();

    const entryPoint = useRef<HTMLDivElement>(null);

    const io = useContext(SocketContext);

    useEffect(() => {
        if (entryPoint && entryPoint.current) {
            entryPoint.current.querySelectorAll('div#wikipediaEntry a').forEach(x => {
                x.addEventListener('click', (ev: any) => {
                    ev.preventDefault();
                    let rawLink: string;
                    if (ev.target.nodeName === 'A') {
                        rawLink = ev.target.attributes["href"].value;
                    } else {
                        rawLink = ev.path[1].attributes["href"].value
                    }
                    if (rawLink) {
                        getSite(extractLink(rawLink)).then(data => parse(data));
                    }

                })
            });
        }

    }, [wikipediaContent])


    useEffect(() => {
        io.on('gameInfo', (data: GameInfo) => {
            console.log(data);
            parse(data.data);
        })
    })

    async function getSite(pageName: string) {
        let step = decodeURIComponent(pageName);
        let page = encodeURI(step);
        let data = await fetch(`https://de.wikipedia.org/w/api.php?action=parse&format=json&page=${page}&prop=text&formatversion=2&origin=*`).then(response => response.json()).then(data => data);

        return data;
    }

    function extractLink(href: any) {
        if (!href.includes('/')) {
            scrollToView(href);
        } else {
            let parts = href.split('/');
            parts.splice(0, 2);
            let pageLinks = parts.join().split('#');
            if (pageLinks.length > 1) {
                pageLinks.splice(1, 1);
                parts = pageLinks;
            }
            parts.join();
            return parts;
        }
    }

    function parse(parserOutput: any) {
        console.log(parserOutput);

        let content = parserOutput.parse.text;

        setWikipediaContent(content);

        addToRoute({
            pageid: parserOutput.parse.pageid,
            title: parserOutput.parse.title,
        });

        scrollToTop();

        if (goal && parserOutput.parse.title === goal.title) {
            success();
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
        })
    }

    function addToRoute(routeEntry: RouteEntry) {
        setRoute([...route, routeEntry])
    }

    function scrollToView(link: string) {
        if (entryPoint && entryPoint.current) {
            entryPoint.current.querySelector(`span${link}`)?.scrollIntoView();
        }
    }

    function success() {
        alert('Congratulations! You are done');
        io.emit('finished', {
            /* Timekeeping at the Server */
            route,
        });
    }

    if (training === true) {
        return (
            <div>

            </div>
        )
    }

    return (
        <div id="gameScreen">
            <div id="wikipediaEntry" ref={entryPoint} dangerouslySetInnerHTML={{ __html: wikipediaContent }}></div>
            <div className="sidebarWrapper">
                <div>
                    <Lobby id={lobbyid} props={props} />
                    <Timer />
                </div>

            </div>
        </div>
    )
}

const Timer = () => {

    const [time, setTime] = useState(0);

    useEffect(() => {
        const Interval = setInterval(() => {
            setTime(() => time + 1);
        }, 1000)

        return () => {
            clearInterval(Interval);
        }
    })

    return (
        <h1>{time}</h1>
    )
}