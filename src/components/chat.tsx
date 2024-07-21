import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { dcutr } from "@libp2p/dcutr";
import { identify } from "@libp2p/identify";
import { webRTC } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { createLibp2p } from "libp2p";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { fromString, toString } from "uint8arrays";

interface Props {
  room: string | undefined;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  playerRef: React.RefObject<HTMLVideoElement>;
}

interface Message {
  data: {
    type: "text" | "play" | "pause" | "seek";
    message: string;
  };
  from: string;
}

const Chat: React.FC<Props> = (props: Props) => {
  const msgRef = useRef<HTMLDivElement>(null);
  const [libp2p, setLibp2p] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | undefined>(props.room);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currMessage, setCurr] = useState<string>("");
  const [defaultMa, setDefaultMa] = useState<Multiaddr | undefined>(undefined);
  const router = useRouter();
  const [fireEvent, setFireEvent] = useState(true);
  const [subscrbers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    if (libp2p) {
      const videoElement = props.playerRef.current;

      const handlePlay = async () => {
        await sendMessage("play", "");
      };

      const handlePause = async () => {
        await sendMessage("pause", "");
      };

      const handleSeeked = async () => {
        if (fireEvent) {
          await sendMessage("seek", videoElement!.currentTime.toString());
        }
        setFireEvent(true);
      };

      if (videoElement) {
        videoElement.addEventListener("play", handlePlay);
        videoElement.addEventListener("pause", handlePause);
        videoElement.addEventListener("seeked", handleSeeked);
      }

      return () => {
        if (videoElement) {
          videoElement.removeEventListener("play", handlePlay);
          videoElement.removeEventListener("pause", handlePause);
          videoElement.removeEventListener("seeked", handleSeeked);
        }
      };
    }
  }, [props.playerRef.current, libp2p]);

  useEffect(() => {
    (async () => {
      const m = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/multiAddress"
      );
      const addr = await m.json();
      console.log(
        addr.multiaddress[1]
          .replace("172.31.47.160", "13.200.213.161")
          .replace(/\/tcp\/\d+\/ws\//, "/tcp/443/wss/")
      );
      const ma = multiaddr(
        addr.multiaddress[1]
          .replace("172.31.47.160", "13.200.213.161")
          .replace(/\/tcp\/\d+\/ws\//, "/tcp/443/wss/")
      );
      setDefaultMa(ma);
    })();
  }, []);

  useEffect(() => {
    msgRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatRoom = async (multiAddr: Multiaddr) => {
    const p2p = await createLibp2p({
      addresses: {
        listen: ["/webrtc"],
      },
      transports: [
        webSockets({
          filter: filters.all,
        }),
        webRTC(),
        circuitRelayTransport({
          discoverRelays: 1,
        }),
      ],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      connectionGater: {
        denyDialMultiaddr: () => {
          return false;
        },
      },
      services: {
        identify: identify(),
        pubsub: gossipsub(),
        dcutr: dcutr(),
      },
      connectionManager: {
        minConnections: 0,
      },
    });
    window.libp2p = p2p;
    setLibp2p(p2p);
    console.log(`Dialing '${multiAddr}'`);
    await p2p.dial(multiAddr);
    console.log(`Connected to '${multiAddr}'`);
    p2p.services.pubsub.addEventListener(
      "subscription-change",
      (event: any) => {
        console.log(event);
        event.detail.subscriptions.map((sub: any) => {
          if (sub.topic === "thetre") {
            if (sub.subscribe === true) {
              setSubscribers((prev) => [
                ...prev,
                event.detail.peerId.publicKey.join(","),
              ]);
            } else {
              setSubscribers((prev) =>
                prev.filter(
                  (peer) => peer !== event.detail.peerId.publicKey.join(",")
                )
              );
            }
          }
        });
      }
    );
    p2p.addEventListener("peer:disconnect", (event: any) => {
      console.log(event);
      setSubscribers((prev) =>
        prev.filter((peer) => peer !== event.detail.publicKey.join(","))
      );
    });
    console.log(`Subscribing to thetre`);
    p2p.services.pubsub.subscribe("thetre");
    p2p.services.pubsub.addEventListener("message", (event: any) => {
      console.log(event);
      const topic = event.detail.topic;
      const message = toString(event.detail.data);
      console.log(event);
      const decodedString = event.detail.key.join(",");
      console.log(decodedString);
      console.log(`Message received on topic '${topic}'`);
      const data = JSON.parse(message) as Message["data"];
      if (data.type === "play") {
        props.onPlay();
      } else if (data.type === "pause") {
        props.onPause();
      } else if (data.type === "seek") {
        setFireEvent(false);
        props.onSeek(parseFloat(data.message));
      } else {
        setMessages((prev) => [...prev, { from: decodedString, data }]);
      }
    });
  };
  const host = async () => {
    await chatRoom(defaultMa!);
    await window.libp2p.addEventListener("self:peer:update", () => {
      (async () => {
        const multiaddrs = await window.libp2p
          .getMultiaddrs()
          .filter((ma: any) => {
            if (
              ma.toString().includes("webrtc") &&
              ma.toString().includes("13.200.213.161")
            ) {
              return ma.toString().replace(/\/tcp\/\d+\/ws\//, "/tcp/443/wss/");
            }
          });
        console.log(multiaddrs[0].toString());
        setRoomId(multiaddrs[0].toString().split("/")[11]);
      })();
    });
  };

  const joinRoom = async () => {
    const ma = multiaddr(
      defaultMa?.toString() + "/p2p-circuit/webrtc/p2p/" + props.room
    );
    await chatRoom(ma);
  };
  const sendMessage = async (
    type: Message["data"]["type"],
    message: string
  ) => {
    console.log(`Sending message '${message}'`);

    await window.libp2p.services.pubsub.publish(
      "thetre",
      fromString(
        JSON.stringify({
          type,
          message,
        })
      )
    );
    setMessages((prev) => [
      ...prev,
      {
        from: "me",
        data: {
          type,
          message,
        },
      },
    ]);
    setCurr("");
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(
      window.location.origin + router.asPath + "/" + roomId
    );
  };

  useEffect(() => {
    if (props.room && defaultMa) {
      joinRoom();
    }
  }, [props.room, defaultMa]);
  return (
    <div className="flex flex-col justify-between w-full lg:w-[550px] lg:border lg:border-gray-500/40 h-[600px] rounded-xl p-4">
      <div className="p-2 flex flex-col gap-2">
        <div className="flex items-center justify-between text-white text-xl">
          <p>In Room({subscrbers.length})</p>
          {subscrbers.length > 0 && (
            <div className="flex items-center space-x-[-10px]">
              {subscrbers.slice(0, 3).map((sub, i) => (
                <img
                  src={"https://avatars.jakerunzer.com/" + sub}
                  alt="avatar"
                  key={i}
                  className="w-10 h-10 rounded-full border-1/2"
                />
              ))}
              {subscrbers.length > 3 && (
                <div className="flex items-center justify-center w-10 h-10 bg-gray-400 text-black text-xs font-semibold rounded-full border-1/2">
                  {subscrbers.length - 3}+
                </div>
              )}
            </div>
          )}
        </div>

        {roomId ? (
          <button
            className="bg-black text-white w-full py-2 bg-thetre-blue rounded-full"
            onClick={copyCommand}
          >
            Copy Invite Link
          </button>
        ) : (
          <button
            className="bg-black text-white w-full py-2 bg-thetre-blue rounded-full"
            onClick={host}
            disabled={!defaultMa}
            title={!defaultMa ? "Fetching MultiAddress" : ""}
          >
            New Room
          </button>
        )}
      </div>
      <div className="overflow-y-scroll" ref={msgRef}>
        {messages
          .filter((msg) => msg.data.type === "text")
          .map((msg, i) => (
            <div
              key={i}
              className={`w-full gap-2 mb-1 items-center flex ${
                msg.from === "me" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {i === 0 || messages[i - 1].from !== msg.from ? (
                <img
                  src={"https://avatars.jakerunzer.com/" + msg.from}
                  alt="avatar"
                  className="w-5 h-5"
                />
              ) : (
                <div className="w-5 h-5"></div>
              )}
              <p className="text-white bg-gray-600 max-w-80 text-wrap break-words	 px-2 py-1 rounded-xl">
                {msg.data.message}
              </p>
            </div>
          ))}
      </div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Send Message"
          className="w-full p-2 pr-12 rounded-full bg-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currMessage}
          onChange={(e) => setCurr(e.target.value)}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
          onClick={async () => await sendMessage("text", currMessage)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
