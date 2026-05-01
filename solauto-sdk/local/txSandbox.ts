import { Keypair, PublicKey } from "@solana/web3.js";
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import {
  buildSwbSubmitResponseTx,
  ClientTransactionsManager,
  consoleLog,
  fetchBank,
  getBatches,
  getClient,
  getPositionExBulk,
  getSolanaRpcConnection,
  getSolautoManagedPositions,
  JITO_SOL,
  LendingPlatform,
  LOCAL_IRONFORGE_API_URL,
  PriceType,
  PriorityFeeSetting,
  ProgramEnv,
  rebalance,
  safeFetchBank,
  safeFetchMarginfiAccount,
  sendSingleOptimizedTransaction,
  SOLAUTO_PROD_PROGRAM,
  SOLAUTO_TEST_PROGRAM,
  SolautoClient,
  TransactionItem,
} from "../src";
import { getSecretKey } from "./shared";

const payForTransaction = true;
const testProgram = false;
const lpEnv: ProgramEnv = "Prod";

let [, umi] = getSolanaRpcConnection(
  LOCAL_IRONFORGE_API_URL,
  testProgram ? SOLAUTO_TEST_PROGRAM : SOLAUTO_PROD_PROGRAM,
  lpEnv
);

const signer = createSignerFromKeypair(
  umi,
  fromWeb3JsKeypair(Keypair.fromSecretKey(getSecretKey("solauto-manager")))
);

export async function main() {
  const client = getClient(LendingPlatform.Marginfi, {
    signer,
    showLogs: true,
    rpcUrl: LOCAL_IRONFORGE_API_URL,
    programId: testProgram ? SOLAUTO_TEST_PROGRAM : SOLAUTO_PROD_PROGRAM,
    lpEnv,
  });

  await client.initializeExistingSolautoPosition({
    positionId: 1,
    authority: new PublicKey("61rtn5tzVkesapo6Cz83SPoShUfAePSxJsqniuF2wRKC"),
    // lpUserAccount: new PublicKey(
    //   "GEokw9jqbh6d1xUNA3qaeYFFetbSR5Y1nt7C3chwwgSz"
    // ),
  });

  const transactionItems = [rebalance(client)];

  const txManager = new ClientTransactionsManager({
    txHandler: client,
    txRunType: payForTransaction ? "normal" : "only-simulate",
    priorityFeeSetting: PriorityFeeSetting.Default,
    retryConfig: { totalRetries: 2 },
  });
  const statuses = await txManager.send(transactionItems);
  consoleLog(statuses);
}

async function refreshAll() {
  const allPositions = await getSolautoManagedPositions(umi);
  const positions = await getPositionExBulk(
    umi,
    allPositions.map((x) => new PublicKey(x.publicKey!))
  );

  let client: SolautoClient | undefined;
  const transactionItems: TransactionItem[] = [];
  for (const pos of positions) {
    client = getClient(pos.lendingPlatform, {
      signer,
      showLogs: true,
      rpcUrl: LOCAL_IRONFORGE_API_URL,
      programId: testProgram ? SOLAUTO_TEST_PROGRAM : SOLAUTO_PROD_PROGRAM,
      lpEnv,
    });

    await client!.initialize({
      positionId: pos.positionId,
      authority: pos.authority,
    });

    const ix = client!.refreshIx(PriceType.Realtime);
    transactionItems.push(
      new TransactionItem(
        async () => ({ tx: ix }),
        `refresh ${pos.authority} (${pos.positionId})`
      )
    );
  }

  const txBatches = getBatches(transactionItems, 15);

  for (const batch of txBatches) {
    const txManager = new ClientTransactionsManager({
      txHandler: client!,
      txRunType: payForTransaction ? "normal" : "only-simulate",
      priorityFeeSetting: PriorityFeeSetting.Default,
      retryConfig: { totalRetries: 2 },
    });
    const statuses = await txManager.send(batch);
    consoleLog(statuses);
  }
}

async function testSwbOracleUpdate() {
  (globalThis as any).SHOW_LOGS = true;

  let [conn, umiLocal] = getSolanaRpcConnection(
    LOCAL_IRONFORGE_API_URL,
    testProgram ? SOLAUTO_TEST_PROGRAM : SOLAUTO_PROD_PROGRAM,
    lpEnv
  );
  umiLocal = umiLocal.use(signerIdentity(signer));

  const mint = new PublicKey(JITO_SOL);
  console.log("Building SWB oracle update tx for JitoSOL...");

  const result = await buildSwbSubmitResponseTx(conn, signer, mint);
  if (!result) {
    console.log("No oracle update needed");
    return;
  }

  console.log("Instructions count:", result.tx.getInstructions().length);
  console.log("Lookup tables:", result.lookupTableAddresses);

  console.log("Sending transaction...");
  const sig = await sendSingleOptimizedTransaction(
    umiLocal,
    conn,
    result.tx,
    payForTransaction ? "normal" : "only-simulate",
    PriorityFeeSetting.Default
  );

  if (sig) {
    const bs58 = await import("bs58");
    console.log("Transaction signature:", bs58.default.encode(sig));
  } else {
    console.log("Transaction simulation complete (no sig returned)");
  }
}

// main();
// refreshAll();
testSwbOracleUpdate();
