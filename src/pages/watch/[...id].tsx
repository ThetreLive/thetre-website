import AccountPage from '@/components/account';
import Chat from '@/components/chat';
import Loader from '@/components/loader';
import ThetaPlayer from '@/components/thetaPlayer';
import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { useWalletContext } from '@/context/walletContext';
import { getFileURL, startStream } from '@/utils/theta';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const WatchPage: React.FC = () => {
    const router = useRouter()

    const playerRef = useRef<HTMLVideoElement>(null);
    const [movie, setMovie] = useState<ProposalDetails | undefined>(undefined);
    const { proposalDetails, fetchProposals, setLoader, getVideo, buyTicket } = useThetreContext();
    const { access, signer } = useWalletContext()
    const [isAuth, setAuth] = useState<boolean>(false)
    const [details, setDetails] = useState<any>("")

    const onPlay = () => {
        playerRef.current?.play();
    }

    const onSeek = (time: number) => {
        if (playerRef.current) {
            playerRef.current.currentTime = time;
        }
    }

    const onPause = () => {
        playerRef.current?.pause();
    }

    useEffect(() => {
        if (router.isReady && (router.query.id)![0]) {
            if (proposalDetails.length > 0) {
                proposalDetails.map(async (proposal) => {
                    if (proposal.id === (router.query.id)![0]) {
                        if (proposal.data.isDRMEnabled) {
                            const videoId = await getVideo(proposal.data.title as string)
                            setMovie({...proposal, data: {...proposal.data, movieLink: videoId} })
                        } else setMovie(proposal)
                    }
                })
            } else {
                (async () => {
                    await setLoader(async () => {
                        await fetchProposals()
                        setMovie(await proposalDetails.map(async (proposal) => {
                            if (proposal.id === (router.query.id)![0]) {
                                if (proposal.data.isDRMEnabled) {
                                    const videoId = await getVideo(proposal.data.title as string)
                                    return {...proposal, data: {...proposal.data, movieLink: videoId} }
                                } else return proposal
                            }
                        })[0])
                    });
        
                })()
            }
        }
    }, [router.isReady, router.query.id, proposalDetails]);

    useEffect(() => {
        if (movie && signer) {
            console.log("here");
            (async () => {
                console.log(movie.proposer, await signer.getAddress())
                if (movie.proposer === await signer.getAddress()) {
                    setAuth(true)
                }
            })()
        }
    }, [movie, signer])
    if (!movie) {
        return <Loader />
    }

    return (
        <div className="h-screen flex lg:flex-row flex-col">
            <div className="w-full lg:h-screen lg:overflow-y-scroll flex-grow">
                {movie.data.isDRMEnabled ? (
                    <ThetaPlayer playerRef={playerRef} videoId={movie.data.movieLink as string} type="DRM" styles={`w-full h-96 lg:h-[70vh]`} />
                ) : (
                    <video controls className="w-full h-96 lg:h-[70vh] bg-black" ref={playerRef}>
                        <source src={getFileURL(JSON.parse(movie.data.movieLink as string).result.key, JSON.parse(movie.data.movieLink as string).result.relpath)} />
                    </video>
                )}
                {!signer && (    
                    <AccountPage isOpen={true} onClose={() => {}} login={false}/>
                )}
            </div>
            <div className="flex flex-col w-full p-2 lg:w-auto gap-2">
                <Chat room={(router.query.id)![1]} onPlay={onPlay} onSeek={onSeek} onPause={onPause} playerRef={playerRef} />
                <div className="p-4 lg:flex lg:flex-col gap-2 hidden lg:w-[550px] lg:border lg:border-gray-500/40 p-4 h-[500px] rounded-lg space-y-10">
                    <div>
                        <p className="text-white font-bold text-2xl underline decoration-thetre-blue decoration-4">{movie.data.title}</p>
                        <p className="font-bold text-white">Genre: {movie.data.genre}</p>
                        <p className="font-bold text-white">Starring: {movie.data.cast}</p>
                    </div>
                    <div className='flex flex-col gap-2'>

                        {(!access.includes(movie.data.title) && movie.data.isDRMEnabled) ? (
                            <button className="text-white bg-thetre-blue p-2 rounded-lg" onClick={() => buyTicket(movie.data.title)}>
                                Buy Pass for 10TFUEL
                            </button>
                        ) : (
                            <button className="text-white bg-green-500 p-2 rounded-lg">
                                You Have Access to this movie
                            </button>
                        )}
                        {isAuth && (
                            <div className='flex flex-col gap-2'>
                                <button className="text-white bg-thetre-blue p-2 rounded-lg" onClick={async() => setDetails(await startStream(movie.data.movieLink as string))}>
                                    Start Stream
                                </button>
                                <div className='text-white'>
                                    <p>Stream Server - {details["stream_server"]}</p>
                                    <p>Stream Key - {details["stream_key"]}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default WatchPage;