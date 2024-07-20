import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

interface Props {
    proposal: ProposalDetails,
    access: string[]
}

const MovieCard: React.FC<Props> = ({ proposal, access }) => {
    const { buyTicket } = useThetreContext();
    const [isHovered, setIsHovered] = useState(false);
    const [isHoverDelayPassed, setIsHoverDelayPassed] = useState(false);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const coverURL = getFileURL(
        JSON.parse(proposal.data.coverLink as string).result.key,
        JSON.parse(proposal.data.coverLink as string).result.relpath
    );

    const trailerURL = getFileURL(
        JSON.parse(proposal.data.trailerLink as string).result.key,
        JSON.parse(proposal.data.trailerLink as string).result.relpath
    );

    useEffect(() => {
        if (isHovered) {
            hoverTimeoutRef.current = setTimeout(() => {
                setIsHoverDelayPassed(true);
            }, 3000);
        } else {
            setIsHoverDelayPassed(false);
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }
        }
    }, [isHovered]);

    const handleTrailerClick = () => {
        setIsTrailerPlaying(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleVideoEnd = () => {
        setIsTrailerPlaying(false);
    };

    return (
        <div className="bg-bg-blue border border-gray-400/40 text-white rounded-lg shadow-lg p-4 flex-1">
            <div 
                className='w-full h-48 relative overflow-hidden rounded-t-lg'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {(isHoverDelayPassed || isTrailerPlaying) ? (
                    <video
                        ref={videoRef}
                        src={trailerURL}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        autoPlay
                        controls
                        onEnded={handleVideoEnd}
                    />
                ) : (
                    <Image
                        src={coverURL}
                        alt={proposal.data.title}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        fill
                    />
                )}
            </div>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{proposal.data.title}</h2>
                <p className="text-gray-200">Genre - {proposal.data.genre}</p>
                <p className="text-gray-200">{proposal.data.description.slice(0, 100)}...</p>
                <div className="flex justify-between items-center mt-4 gap-2">
                    {access.includes(proposal.data.title) || !proposal.data.isDRMEnabled ? (
                        <Link href={`/watch/${proposal.id}`} className="bg-custom-radial px-6 py-3 font-bold rounded-xl">Watch Now</Link>
                    ) : (
                        <button onClick={() => buyTicket(proposal.data.title)} className="bg-custom-radial px-6 py-3 font-bold rounded-xl">Buy Pass for 10TFUEL</button>
                    )}
                    <button 
                        onClick={handleTrailerClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
                    >
                        Trailer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
