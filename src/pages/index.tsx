
import Sidebar from "@/components/sidebar";
import Loader from "@/components/loader";
import MovieCard from "@/components/movieCard";
import MovieSlider from "@/components/movieSlider";
import { ProposalState, useThetreContext } from "@/context/thetreContext";
import { useWalletContext } from "@/context/walletContext";
import { useEffect } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const { proposalDetails, fetchProposals, setLoader, loading } = useThetreContext()
  const { access } = useWalletContext()
  useEffect(() => {
    (async () => {
      await setLoader(fetchProposals)
    })()
  }, [])
  if (loading) {
    return <Loader />
  }
  return (
    <div className="flex gap-2">
      <Sidebar/>
      <div className="h-screen overflow-y-scroll">
      <Navbar />
      <main className="h-[50vh]" id="slider">
        <MovieSlider access={access} proposalDetails={proposalDetails.filter(proposal => [ProposalState.Succeeded, ProposalState.Executed, ProposalState.Queued].includes(Number(proposal.proposalState)))}/>
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

    </div>
  );
}
