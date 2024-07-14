import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import { createLibp2p } from 'libp2p'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { fromString, toString } from 'uint8arrays'

interface Props {
    room: string | undefined;
}

interface Message {
    from: string;
    message: string;
}

const Chat: React.FC<Props> = (props: Props) => {
    const msgRef = useRef<HTMLDivElement>(null)
    const [libp2p, setLibp2p] = useState<any>(null)
    const [roomId, setRoomId] = useState<string | undefined>(props.room)
    const [messages, setMessages] = useState<Message[]>([])
    const [currMessage, setCurr] = useState<string>("")
    const [defaultMa, setDefaultMa] = useState<Multiaddr | undefined>(undefined)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const m = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/multiAddress");
            const addr = await m.json();
            console.log(addr.multiaddress[1].replace("172.31.47.160", "13.200.213.161").replace(/\/tcp\/\d+\/ws\//, '/tcp/443/wss/'))
            const ma = multiaddr(addr.multiaddress[1].replace("172.31.47.160", "13.200.213.161").replace(/\/tcp\/\d+\/ws\//, '/tcp/443/wss/'))
            setDefaultMa(ma)
        })()
    }, [])

    useEffect(() => {
        msgRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);

    const chatRoom = async (multiAddr: Multiaddr) => {
        const p2p = await createLibp2p({
            addresses: {
                listen: [
                    '/webrtc'
                ]
            },
            transports: [
                webSockets({
                    filter: filters.all
                }),
                webRTC(),
                circuitRelayTransport({
                    discoverRelays: 1
                })
            ],
            connectionEncryption: [noise()],
            streamMuxers: [yamux()],
            connectionGater: {
                denyDialMultiaddr: () => {
                    return false
                }
            },
            services: {
                identify: identify(),
                pubsub: gossipsub(),
                dcutr: dcutr()
            },
            connectionManager: {
                minConnections: 0
            }
        })
        window.libp2p = p2p;
        setLibp2p(p2p)
        console.log(`Dialing '${multiAddr}'`)
        await p2p.dial(multiAddr)
        console.log(`Connected to '${multiAddr}'`)
        console.log(`Subscribing to thetre`)
        p2p.services.pubsub.subscribe("thetre")
        p2p.services.pubsub.addEventListener('message', (event: any) => {
            const topic = event.detail.topic
            const message = toString(event.detail.data)
            console.log(event)
            const decodedString = event.detail.key.join(",");
            console.log(decodedString)
            console.log(`Message received on topic '${topic}'`)
            setMessages((prev) => [...prev, {from: decodedString, message: message}])
        })
            
    }
    const host = async () => {
        await chatRoom(defaultMa!)
        await window.libp2p.addEventListener('self:peer:update', () => {
            (async () => {
                const multiaddrs = await window.libp2p.getMultiaddrs().filter((ma: any) => {
                    if (ma.toString().includes('webrtc') && ma.toString().includes("13.200.213.161")) {
                        return ma.toString().replace(/\/tcp\/\d+\/ws\//, '/tcp/443/wss/')
                    }
                  })
                console.log(multiaddrs[0].toString())
                setRoomId(multiaddrs[0].toString().split("/")[11])
            })()
          })
    }

    const joinRoom = async () => {
        const ma = multiaddr(defaultMa?.toString() + "/p2p-circuit/webrtc/p2p/" + props.room)
        await chatRoom(ma)
    }
    const sendMessage = async () => {
        console.log(`Sending message '${(currMessage)}'`)

        await window.libp2p.services.pubsub.publish("thetre", fromString(currMessage))
        setMessages((prev) => [...prev, {from: "me", message: currMessage}])

    }

    const copyCommand = () => {
        navigator.clipboard.writeText(window.location.origin+ router.asPath +"/"+roomId);
      }

    useEffect(() => {
        if (props.room && defaultMa) {
            joinRoom()
        }
    }, [props.room, defaultMa])
    return (
        <div className='flex flex-col justify-between w-full lg:w-[550px] lg:h-screen h-[500px] px-2'>
            <div className='p-2'>
                {roomId ? (
                    <button className='bg-black text-white w-full py-2 bg-thetre-blue rounded-xl' onClick={copyCommand}>Copy Invite Link</button>
                ) : (
                    <button className='bg-black text-white w-full py-2 bg-thetre-blue rounded-xl' onClick={host}>New Room</button>
                )}
            </div>
            <div className='overflow-y-scroll' ref={msgRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`w-full gap-2 mb-1 items-center flex ${msg.from === "me" ? "flex-row-reverse" : "flex-row"}`}>
                        {(i === 0 || messages[i - 1].from !== msg.from) ? (
                            <img
                                src={"https://avatars.jakerunzer.com/" + msg.from}
                                alt="avatar"
                                className="w-5 h-5"
                            />
                        ) : (
                            <div className='w-5 h-5'></div>
                        )}
                        <p className="text-white bg-gray-600 max-w-80 text-wrap break-words	 px-2 py-1 rounded-xl">{msg.message}</p>
                    </div>
                ))}
                
            </div>
            <div className="relative w-full">
                <input type="text" placeholder="Message ChatGPT" className="w-full p-4 pr-12 rounded-full bg-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"  onChange={e => setCurr(e.target.value)}/>
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none" onClick={sendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>

                </button>
            </div>
        </div>
    )
}

export default Chat