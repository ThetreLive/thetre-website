import Chat from '@/components/chat';
import Loader from '@/components/loader';
import ThetaPlayer from '@/components/thetaPlayer';
import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const WatchPage: React.FC = () => {
    const router = useRouter()

    const playerRef = useRef<HTMLVideoElement>(null);
    const [movie, setMovie] = useState<ProposalDetails | undefined>(undefined);
    const { proposalDetails, fetchProposals, setLoader, castVote } = useThetreContext();

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
                proposalDetails.find((proposal) => {
                    return proposal.id === (router.query.id)![0] && setMovie(proposal)
                })
            } else {
                (async () => {
                    await setLoader(async () => {
                        await fetchProposals()
                        setMovie(proposalDetails.filter((proposal) => {
                            return proposal.id === (router.query.id)![0] && setMovie(proposal)
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
                    <p className='text-white font-bold text-2xl'>{movie.data.title}</p>
                    <p className="font-bold text-white">{movie.data.description}</p>
                    <p className="font-bold text-white">Genre: {movie.data.genre}</p>
                    <p className="font-bold text-white">Cast: {movie.data.cast}</p>
                    <p className="font-bold text-white">Directed By: {movie.data.director}</p>
                    <p className="font-bold text-white">Produced By: {movie.data.producer}</p>

                </div>
            </div>
            <Chat room={(router.query.id)![1]} onPlay={onPlay} onSeek={onSeek} onPause={onPause} playerRef={playerRef}/>
        </div>
    );
};

export default WatchPage;