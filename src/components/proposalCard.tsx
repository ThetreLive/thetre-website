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

  return (
    <div className="shadow-md rounded-lg p-6 mb-4 bg-black/40 backdrop-blur-xl w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img
            src={"https://avatars.jakerunzer.com/" + proposal.data.title}
            alt="avatar"
            className="w-8 h-8 mr-2"
          />
          <div>
            <p className="text-white">{proposal.data.producer}</p>
            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
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
          <Link href={`/proposal/${proposal.id}`} className="text-[#4B4BFF] hover:underline">
            Vote now
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
