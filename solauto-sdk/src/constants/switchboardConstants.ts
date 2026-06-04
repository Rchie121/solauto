import { NATIVE_MINT } from "@solana/spl-token";
import * as tokens from "./tokenConstants";

interface SwitchboardFeed {
  feedId: string;
  feedHash: string;
}

// https://beta.ondemand.switchboard.xyz/solana/mainnet
export const SWITCHBOARD_PRICE_FEED_IDS: { [key: string]: SwitchboardFeed } = {
  [NATIVE_MINT.toString()]: {
    feedId: "4Hmd6PdjVA9auCoScE12iaBogfwS4ZXQ6VZoBeqanwWW",
    feedHash: "0x1f42dfb21efb24828b99fbe70e6d139cd665aafcbb1706bccd8f2a9b12562db6",
  },
  [tokens.JUP_SOL]: {
    feedId: "HX5WM3qzogAfRCjBUWwnniLByMfFrjm1b5yo4KoWGR27",
    feedHash:
      "0xc02f22d47b20b43bafde474328ac027283dbd7bb443660f5ec414c93faec56dc",
  },
  [tokens.JITO_SOL]: {
    feedId: "5htZ4vPKPjAEg8EJv6JHcaCetMM4XehZo8znQvrp6Ur3",
    feedHash: "0x44f5a7676baf4c6e5eb26fdde2695e7e3e0971071b76ddc622fa71528092ca25"
  },
  [tokens.LST]: {
    feedId: "BWK8Wnybb7rPteNMqJs9uWoqdfYApNym6WgE59BwLe1v",
    feedHash: "0x74e140c452fe29cced80898a51961ed1410c1fe0efbdc970fe5aac986427419e"
  },
  [tokens.JTO]: {
    feedId: "A9RnpLxxtAS2TR3HtSMNJfsKpRPvkLbBkGZ6gKziSPLr",
    feedHash: "0xa5bc3b659791facc5edfd8e74942c79d7e8d59f0f913dcdd9bcfb33a2fceb575"
  },
  [tokens.H_SOL]: {
    feedId: "1snBjCaHejZqQsAqkELAKNaqUrDNNCr7zmNX6qaQCzg",
    feedHash:
      "0x59206aa3da593cd2312bde1930cf3368f6119a650229e147060be4fc2fcd1367",
  },
  [tokens.POPCAT]: {
    feedId: "FTcFqwCjAgv2VMaowQ9XSBcesVzFzZkaju25nKio6bki",
    feedHash:
      "0xeb4f9a43024f8f33786b7291404510af8e94a66e1acb44953a3137878ee7033f",
  },
  [tokens.RETARDIO]: {
    feedId: "EvPXnpMoyrj4B6P55LDP2VpSLkTBWom2SqL4486ToNhM",
    feedHash:
      "0x982d968a0608046986aec84d95ae884c4dc2140f0b3e14ed7b8161ada573d18b",
  },
  [tokens.BILLY]: {
    feedId: "uBe4er4VSMgYvBNwSbFctSShRXNPkCfaPh7zHMBFeBi",
    feedHash:
      "0xbbd0d393111ff1ad7cc1a2f15ce24b61d4d6b3e99e440aa77572bd7f1da9afbe",
  },
  [tokens.HMTR]: {
    feedId: "F2hKL67W4ZDe9k7ZrJKnp2LhWrgqg2JQTkJf2dgBggRD",
    feedHash:
      "0x61999c4f8a03208b5b5b50663323b1ef8d0acbb3642ec79053b33b5768605fb5",
  },
};
