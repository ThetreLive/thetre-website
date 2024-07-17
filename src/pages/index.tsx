
import Loader from "@/components/loader";
import MovieCard from "@/components/movieCard";
import MovieSlider from "@/components/movieSlider";
import { ProposalState, useThetreContext } from "@/context/thetreContext";
import { useEffect } from "react";

export default function Home() {
  const { proposalDetails, fetchProposals, setLoader, loading } = useThetreContext()
  useEffect(() => {
    (async () => {
      await setLoader(fetchProposals)
    })()
  }, [])
  
  if (loading) {
    return <Loader />
  }
  return (
    <div>
      <main className="h-screen" id="slider">
        <MovieSlider proposalDetails={proposalDetails.filter(proposal => [ProposalState.Succeeded, ProposalState.Executed, ProposalState.Queued].includes(Number(proposal.proposalState)))}/>
      </main>
      <div className="flex h-screen" id="movies">
        <div>
          <MovieCard />
          <MovieCard />
        </div>
        <div>
          <MovieCard />
          <MovieCard />
        </div>
      </div>
    </div>
  );
}
