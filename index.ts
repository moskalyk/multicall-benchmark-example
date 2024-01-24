import { providers } from "@0xsequence/multicall";
import { ethers, providers as ethersProviders } from "ethers";

const providerUrl = 'https://nodes.sequence.app/mainnet/<access_key>'

const main = async () => {
  async function getBalances(address: string) {
    // Initialize a provider
      const ethersProvider = new ethersProviders.StaticJsonRpcProvider(providerUrl);
      const provider = new providers.MulticallProvider(ethersProvider);

      const abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function totalSupply() view returns (uint256)",
        "function symbol() view returns (string)",
      ];

      const uni = new ethers.Contract(
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        abi,
        provider
      );

      const dai = new ethers.Contract(
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        abi,
        provider
      );
      
      const default_: any = [
        dai.totalSupply,
        // dai.balanceOf(address),
        dai.symbol,
        uni.totalSupply,
        uni.symbol
      ]

      let start;
      let end;

      let unresolved = []
      let loops = 10
      let iterations = 8

      for(let j = 0; j < iterations; j++){
        start = Date.now()

        for(let i = 0; i < loops; i++){
          unresolved.push(...default_)
        }
        console.log(loops+' batched')

        const result = await Promise.all(unresolved.map((func: any) => func()))
        end = Date.now()
        loops *= 5
        console.log(end-start + 'ms')
        unresolved = []
      }
      return '' 
  }

  getBalances("<wallet_address>").then(blob => {
      // console.log(blob)
  }).catch(error => {
      console.error("Error fetching balance:", error);
  });
};

main();