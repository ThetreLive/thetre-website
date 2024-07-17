import Sidebar from '@/components/daoSidebar';
import Loader from '@/components/loader';
import ProposalCard from '@/components/proposalCard';
import Modal from '@/components/proposalModal';
import { ProposalState, useThetreContext } from '@/context/thetreContext';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {proposalDetails, fetchProposals, loading, setLoader} = useThetreContext()
  useEffect(() => {
    (async () => {
      await setLoader(fetchProposals)
    })()
  }, [])
  return (
    <>
      {loading && <Loader />}
      <div className={`min-h-screen w-full ${loading ? 'blur-xs pointer-events-none' : ''}`}>
        <div className="container mx-auto p-6">
          <div className="shadow rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className='flex gap-4 items-center'>
                  <h2 className="text-xl text-white font-bold">Proposals</h2>
                  <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#4B4BFF] text-white rounded">
                      New Proposal
                  </button>

              </div>
              <div>
                <span className="text-green-500">Passed {proposalDetails.filter(prop => prop.proposalState == ProposalState.Succeeded).length}</span>
                <span className="text-red-500 ml-4">Failed {proposalDetails.filter(prop => prop.proposalState == ProposalState.Defeated || prop.proposalState == ProposalState.Expired).length}</span>
              </div>
            </div>
          </div>
          <div className='flex-grow overflow-y-auto w-50 lg:flex gap-10'>
              <Sidebar/>
              <div className='max-h-[900px] w-full overflow-y-scroll'>
                  {proposalDetails.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                  ))}
              </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>

  );
};

export default Home;
