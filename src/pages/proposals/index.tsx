import Sidebar from '@/components/daoSidebar';
import ProposalCard from '@/components/proposalCard';
import Modal from '@/components/proposalModal';
import { useThetreContext } from '@/context/thetreContext';
import { NextPage } from 'next';
import { useState } from 'react';

const Home: NextPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {proposalDetails} = useThetreContext()

  return (
    <div className="min-h-screen w-full">
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
              <span className="text-green-500">Passed 50</span>
              <span className="text-red-500 ml-4">Failed 32</span>
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
  );
};

export default Home;
