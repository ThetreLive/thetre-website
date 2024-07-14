import Loader from '@/components/loader';
import ThetaPlayer from '@/components/thetaPlayer';
import { ProposalDetails, useThetreContext } from '@/context/thetreContext';
import { getFileURL } from '@/utils/theta';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Proposal: React.FC = () => {
    const router = useRouter()
    const [proposal, setProposal] = useState<ProposalDetails | undefined>(undefined);
    const { proposalDetails, fetchProposals, setLoader } = useThetreContext();

    useEffect(() => {
        if (router.isReady && router.query.id) {
            if (proposalDetails.length > 0) {
                proposalDetails.find((proposal) => {
                    return proposal.id === router.query.id && setProposal(proposal)
                })
            } else {
                (async () => {
                    await setLoader(async () => {
                        await fetchProposals()
                        setProposal(proposalDetails.filter((proposal) => {
                            return proposal.id === router.query.id && setProposal(proposal)
                        })[0])
                    });
        
                })()
            }
        }
    }, [router.isReady, router.query.id, proposalDetails]);
    if (!proposal) {
        return <Loader />
    }

    return (
        <div>

            <p className='text-center text-white font-bold text-2xl'>Movie Name - {proposal.data.title}</p>
            <div className="w-full h-full grid gap-4 p-4" style={{
                gridTemplateColumns: "1fr repeat(6, minmax(auto, 10em)) 1fr",
                gridTemplateRows: "minmax(1em, auto) 1fr auto minmax(1em, auto)"
            }}>
                <div className='w-full h-full col-start-0 col-span-5'>
                    <ThetaPlayer videoId={"video_mg3tvfr4hzutanrfrru714kw0u"} type="FREE" styles="w-full h-96" />
                </div>
                <div className='col-start-6 col-span-3 flex flex-col gap-16'>
                    <div className='flex flex-col gap-2'>
                        <p className="font-bold text-white">{proposal.data.description}</p>
                        <p className="font-bold text-white">Genre: {proposal.data.genre}</p>
                        <p className="font-bold text-white">Cast: {proposal.data.cast}</p>
                        <p className="font-bold text-white">Directed By: {proposal.data.director}</p>
                        <p className="font-bold text-white">Produced By: {proposal.data.producer}</p>
                        <p className="font-bold text-white">Available On: {proposal.data.platforms}</p>

                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                            Approve
                        </button>
                        <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                            Reject
                        </button>
                    </div>
                </div>
                <div className='col-start-0 col-span-4 row-start-3 h-full'>
                    <h2 className="text-xl font-bold text-white">Trailer</h2>

                    <video controls className='w-full h-full'>
                        <source src={getFileURL(JSON.parse(proposal.data.trailerLink).result.key, JSON.parse(proposal.data.trailerLink).result.relpath)} />
                    </video>
                </div>
                <div className='col-start-5 col-span-4 row-start-3'>
                    <h2 className="text-xl font-bold text-white">Cover Image</h2>
                <div className='h-full flex flex-row justify-center items-center bg-gray-700/20'>
                    <img className="h-80" src={getFileURL(JSON.parse(proposal.data.coverLink).result.key, JSON.parse(proposal.data.coverLink).result.relpath)} alt="Cover Page" />
                </div>

                </div>
            </div>
        </div>

    );
};

export default Proposal;