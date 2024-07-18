import Chat from '@/components/chat';
import Loader from '@/components/loader';
import ThetaPlayer from '@/components/thetaPlayer';
import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { useWalletContext } from '@/context/walletContext';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const WatchPage: React.FC = () => {
    const router = useRouter()

    const playerRef = useRef<HTMLVideoElement>(null);
    const [movie, setMovie] = useState<ProposalDetails | undefined>(undefined);
    const { proposalDetails, fetchProposals, setLoader, getVideo, buyTicket } = useThetreContext();
    const { access } = useWalletContext()

    const onPlay = () => {
        playerRef.current?.play();
    }

    const onSeek = (time: number) => {
        playerRef.current?.play();
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
                        const videoId = await getVideo(proposal.data.title as string)
                        setMovie({...proposal, data: {...proposal.data, movieLink: videoId} })
                    }
                })
            } else {
                (async () => {
                    await setLoader(async () => {
                        await fetchProposals()
                        setMovie(await proposalDetails.map(async (proposal) => {
                            if (proposal.id === (router.query.id)![0]) {
                                console.log()
                                const videoId = await getVideo(proposal.data.title as string)
                                return {...proposal, data: {...proposal.data, movieLink: videoId} }
                            }
                        })[0])
                    });
        
                })()
            }
        }
    }, [router.isReady, router.query.id, proposalDetails]);
    if (!movie) {
        return <Loader />
    }

    return (
        <div className='h-screen flex lg:flex-row flex-col'>
            <div className='w-full lg:h-screen lg:overflow-y-scroll'>
                <ThetaPlayer playerRef={playerRef} videoId={movie.data.movieLink as string} type='DRM' styles="w-full h-96 lg:h-[70vh]"/>
                <div className='p-4 flex flex-col gap-2 hidden lg:block'>
                    <div className='flex flex-row gap-2 items-center'>
                        <p className='text-white font-bold text-2xl underline decoration-thetre-blue decoration-4'>{movie.data.title}</p>

                        {!access.includes(movie.data.title) && (
                            <button className='text-white bg-thetre-blue p-2 rounded-lg' onClick={() => buyTicket(movie.data.title)}>Buy Pass for 10TFUEL</button>
                        )}
                    </div>
                    <p className="font-bold text-white">Genre: {movie.data.genre}</p>
                    <p className="font-bold text-white">Starring: {movie.data.cast}</p>

                </div>
            </div>
            <Chat room={(router.query.id)![1]} onPlay={onPlay} onSeek={onSeek} onPause={onPause} playerRef={playerRef}/>
        </div>
    );
};

export default WatchPage;