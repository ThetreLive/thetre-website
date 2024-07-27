import { ProposalDetails, ProposalState } from '@/context/thetreContext';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

interface ProposalCardProps {
  proposal: ProposalDetails;
}

const calculateTimeLeft = (voteEnd: number) => {
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = voteEnd - now;

  if (timeLeft <= 0) return "00:00:00";

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const ProposalCard: FC<ProposalCardProps> = ({ proposal }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(Number(proposal.voteEnd)));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(Number(proposal.voteEnd)));
    }, 1);

    return () => clearInterval(interval);
  }, [proposal.voteEnd]);

  const getProposalStateClasses = (state: ProposalState) => {
    switch (state) {
      case ProposalState.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case ProposalState.Active:
        return 'bg-blue-100 text-blue-800';
      case ProposalState.Canceled:
        return 'bg-red-100 text-red-800';
      case ProposalState.Defeated:
        return 'bg-gray-100 text-gray-800';
      case ProposalState.Succeeded:
        return 'bg-green-100 text-green-800';
      case ProposalState.Queued:
        return 'bg-purple-100 text-purple-800';
      case ProposalState.Expired:
        return 'bg-orange-100 text-orange-800';
      case ProposalState.Executed:
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="shadow-md rounded-lg p-6 mb-4 bg-black/40 backdrop-blur-xl w-full border border-1 border-gray-300/50">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img
            src={"https://avatars.jakerunzer.com/" + proposal.data.title}
            alt="avatar"
            className="w-8 h-8 mr-2"
          />
          <div>
            <p className="text-white">{proposal.data.producer}</p>
            <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${getProposalStateClasses(Number(proposal.proposalState))}`}>
              {ProposalState[Number(proposal.proposalState)]}
            </span>
          </div>
        </div>
        <div>
          <p className="text-green-300">For: {proposal.votes.forProp}</p>
          <p className="text-red-500">Against: {proposal.votes.against}</p>

        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{proposal.data.title}</h3>
      <p className="text-white mb-4">{proposal.data.description}</p>
      <div className="flex justify-between items-center">
        <p className="text-red-500">{timeLeft} left</p>
        {!([ProposalState.Succeeded, ProposalState.Executed, ProposalState.Defeated, ProposalState.Canceled, ProposalState.Expired].includes(Number(proposal.proposalState))) && (
          <Link href={`/proposals/${proposal.id}`} className="text-[#4B4BFF] hover:underline">
            Vote now
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
