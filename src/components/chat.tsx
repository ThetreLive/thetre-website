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
import { useEffect, useState } from 'react'
import { fromString, toString } from 'uint8arrays'

const Chat: React.FC = () => {
    const [libp2p, setLibp2p] = useState<any>(null)
    const [currMa, setMa] = useState<string | null>(null)
    const [messages, setMessages] = useState<string[]>([])
    const [currMessage, setCurr] = useState<string>("")
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
            
            console.log(`Message received on topic '${topic}'`)
            setMessages((prev) => [...prev, message])
        })
            
    }
    const host = async () => {

        const m = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/multiAddress");
        const addr = await m.json();
        console.log(addr.multiaddress[1].replace("172.31.47.160", "13.200.213.161").replace(/\/tcp\/\d+\/ws\//, '/tcp/443/wss/'))
        const ma = multiaddr(addr.multiaddress[1].replace("172.31.47.160", "13.200.213.161").replace(/\/tcp\/\d+\/ws\//, '/tcp/443/wss/'))
        await chatRoom(ma)
        await window.libp2p.addEventListener('self:peer:update', () => {
            (async () => {
                const multiaddrs = await window.libp2p.getMultiaddrs().filter((ma: any) => {
                    if (ma.toString().includes('webrtc') && ma.toString().includes("13.200.213.161")) {
                        return ma.toString().replace(/\/tcp\/\d+\/ws\//, '/tcp/443/wss/')
                    }
                  })
                console.log(multiaddrs[0].toString())
            })()
          })
    }

    const joinRoom = async () => {
        await chatRoom(multiaddr(currMa))
    }
    const sendMessage = async () => {
        console.log(`Sending message '${(currMessage)}'`)

        await window.libp2p.services.pubsub.publish("thetre", fromString(currMessage))
    }
    return (
        <div>
            <button className='bg-black text-white' onClick={host}>New Room</button>
            <input type="text" id="input" placeholder='enter room ma' onChange={e => setMa(e.target.value)}/>
            <button className='bg-black text-white' onClick={joinRoom}>Join</button>
            <input type='text' id='message' placeholder='enter message' onChange={e => setCurr(e.target.value)}/>
            <button className='bg-black text-white' onClick={sendMessage}>Send</button>
            {messages.map((msg, i) => <p className='text-white' key={i}>{msg}</p>)}
        </div>
    )
}

export default Chat