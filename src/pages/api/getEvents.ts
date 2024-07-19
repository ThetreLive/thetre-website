import { ProposalDetails } from '@/context/thetreContext';
import redis from '../../lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { contracts } from '@/utils/constants';
import { governerABI } from '@/utils/abis/governerABI';
import { thetreABI } from '@/utils/abis/thetreABI';
import { getFromEdgeStore } from '@/utils/theta';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const provider = new ethers.JsonRpcProvider("https://eth-rpc-api-testnet.thetatoken.org/rpc");

    try {
        let startBlock = 27166848;
        const endBlock = await provider.getBlockNumber();
        const blockRange = 5000;
        let proposals: ProposalDetails[] = [];
        const keys = await redis.keys('*');
        if (keys.length !== 0) {
          const latestKey = keys.sort().reverse()[0];
          const latestData = await redis.get(latestKey);
          proposals = JSON.parse(latestData!);
          startBlock = Number(latestKey?.split(":")[1])
        }
        
        const ranges: { fromBlock: number; toBlock: number }[] = [];
        
        for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock += blockRange) {
            ranges.push({
                fromBlock: currentBlock,
                toBlock: Math.min(currentBlock + blockRange - 1, endBlock),
            });
        }
        const govEthers = new ethers.Contract(contracts.LISTING_GOVERNER, governerABI, provider);
        const thetreEthers = new ethers.Contract(contracts.THETRE, thetreABI, provider);
        for (const range of ranges) {

            let logs;
            const filter = {
                address: contracts.LISTING_GOVERNER,
                topics: [
                    ethers.id("ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)")
                ],
                fromBlock: range.fromBlock,
                toBlock: range.toBlock
            };
            logs = await provider.getLogs(filter);
            console.log(logs)
            const parsedLogs = logs.map((log: any) => govEthers.interface.parseLog(log));
            
            const proposalDetailsPromises = parsedLogs.map(async (log: any) => {
                const proposalDetails: ProposalDetails[] = await Promise.all(log.args.calldatas.map(async (calldata: any) => {
                    const listingData = thetreEthers.interface.decodeFunctionData("listMovie", calldata);
                    const data = JSON.parse(await getFromEdgeStore(listingData[1]));
                    let isDRMEnabled = true;
                    let screeningType = "Recorded";
                    let livestreamData = undefined;
                    if (data.isDRMEnabled !== undefined) {
                        isDRMEnabled = data.isDRMEnabled;
                        screeningType = data.screeningType;
                        if (screeningType === "Live Screening") {
                            livestreamData = data.livestreamData;
                        }
                    }
                    const state = await govEthers.state(log.args.proposalId);
                    const voteEnd = Number(log.args.voteEnd);
                    const votes = await govEthers.proposalVotes(log.args.proposalId);
                    return {
                        data: {
                            ...data,
                            isDRMEnabled,
                            screeningType,
                            livestreamData: JSON.stringify(livestreamData)
                        },
                        voteEnd,
                        proposalState: Number(state),
                        id: log.args.proposalId.toString(),
                        votes: {
                            forProp: ethers.formatEther(votes[1]),
                            against: ethers.formatEther(votes[0])
                        },
                        proposer: log.args.proposer
                    };
                }));
                return proposalDetails;
            });

            const proposalsInChunks = await Promise.all(proposalDetailsPromises);
            proposals = proposals.concat(proposalsInChunks.flat());
        }
        await redis.flushdb();
        const cacheKey = `logs:${endBlock}`;
        await redis.set(cacheKey, JSON.stringify(proposals))
        console.log("done")
        res.status(200).json({ proposals });
    } catch (error) {
      console.log(error)
        res.status(500).json({ error: 'Error connecting to Redis' });
    }
}
