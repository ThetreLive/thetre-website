import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { getFileURL } from '@/utils/theta';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    proposal: ProposalDetails,
    access: string[]
}

const MovieCard: React.FC<Props> = ({proposal, access}) => {
    const {buyTicket} = useThetreContext();
    return (
        <div className="bg-bg-blue border border-gray-400/40 text-white rounded-lg shadow-lg p-4 flex-1">
            <div className='w-full h-48 relative'>
                <Image
                    className="rounded-t-lg"
                    src={getFileURL(JSON.parse(proposal.data.coverLink as string).result.key, JSON.parse(proposal.data.coverLink as string).result.relpath)} 
                    alt={proposal.data.title}
                    objectFit='cover'
                    objectPosition='top'
                    fill
                />

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
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1">
                        Trailer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;