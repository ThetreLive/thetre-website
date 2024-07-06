import Link from 'next/link';
import { FC } from 'react';

interface Proposal {
  id: number;
  author: string;
  status: string;
  title: string;
  description: string;
  votes: number;
  timeLeft: string;
}

interface ProposalCardProps {
  proposal: Proposal;
}

const ProposalCard: FC<ProposalCardProps> = ({ proposal }) => {
  return (
    <div className="shadow-md rounded-lg p-6 mb-4 bg-black/40 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img
            src={"https://avatars.jakerunzer.com/" + proposal.title}
            alt="avatar"
            className="w-8 h-8 mr-2"
          />
          <div>
            <p className="text-white">{proposal.author}</p>
            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {proposal.status}
            </span>
          </div>
        </div>
        <p className="text-white">Total Votes: {proposal.votes}</p>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{proposal.title}</h3>
      <p className="text-white mb-4">{proposal.description}</p>
      <div className="flex justify-between items-center">
        <p className="text-red-500">{proposal.timeLeft} left</p>
        <Link href={`/proposal/${proposal.id}`} className="text-[#4B4BFF] hover:underline">
            Read more
        </Link>
      </div>
    </div>
  );
};

export default ProposalCard;
