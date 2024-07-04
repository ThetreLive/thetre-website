import Sidebar from '@/components/daoSidebar';
import ProposalCard from '@/components/proposalCard';
import { NextPage } from 'next';

const proposals = [
  {
    id: 113,
    author: 'Movie 1 by 0xDe2...9AaC',
    status: 'Active',
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas minima iste odit nisi odio voluptates temporibus delectus. Sed nobis quae, sunt, perferendis quidem rem totam ipsa porro recusandae itaque natus?",
    votes: 32489,
    timeLeft: '4 hours',
  },
  {
    id: 126,
    author: 'Movie by thetre.tns',
    status: 'Active',
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores corrupti quos placeat esse labore, vitae non dolore incidunt voluptatem nihil similique consequuntur facere illum, enim nesciunt repudiandae earum dicta libero.",
    votes: 32489,
    timeLeft: '6 hours',
  },
  {
    id: 721,
    author: 'Movie 3 by 0xDe2...9AaC',
    status: 'Active',
    title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae, nisi eaque molestias corrupti nihil atque quos porro praesentium quasi! Dignissimos nulla eligendi neque numquam officiis reiciendis praesentium nisi. Saepe, cum.",
    votes: 32489,
    timeLeft: '4 hours',
  },
  {
    id: 721,
    author: 'Movie 3 by 0xDe2...9AaC',
    status: 'Active',
    title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae, nisi eaque molestias corrupti nihil atque quos porro praesentium quasi! Dignissimos nulla eligendi neque numquam officiis reiciendis praesentium nisi. Saepe, cum.",
    votes: 32489,
    timeLeft: '4 hours',
  },
];

const Home: NextPage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="shadow rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-white font-bold">Proposals</h2>
            <div>
              <span className="text-green-500">Passed 50</span>
              <span className="text-red-500 ml-4">Failed 32</span>
            </div>
          </div>
        </div>
        <div className='flex-grow overflow-y-auto w-50 lg:flex gap-10'>
            <Sidebar/>
            <div className='max-h-[900px] overflow-y-scroll'>
                {proposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
