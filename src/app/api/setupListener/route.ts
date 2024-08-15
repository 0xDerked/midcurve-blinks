import { NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL, ParsedTransactionWithMeta, LogsFilter } from '@solana/web3.js';

let listenerSetup = false;

export async function POST(req: Request) {
    const data = await req.json();
    const address  = data.address;
    
    console.log(address)

    if (!address) {
      return NextResponse.json({error: 'Address is required' }, {status: 500});
    }

    if (!listenerSetup) {
      await setupListener(address);
      listenerSetup = true;
      return NextResponse.json({ message: 'Listener setup successfully' }, {status: 200});
    } else {
      return NextResponse.json({ message: 'Listener already setup' }, {status: 200});
    }
}

async function setupListener(addressToMonitor: string) {
  const connection = new Connection(process.env.RPC_URL || 'https://api.devnet.solana.com', {commitment: 'confirmed', wsEndpoint: process.env.WS_URL});
  const publicKey = new PublicKey(addressToMonitor);

  console.log(`Monitoring incoming transfers for address: ${addressToMonitor}`);

  const logsFilter: LogsFilter = new PublicKey(addressToMonitor)

  connection.onLogs(
    logsFilter,
    async (logs) => {
      if (logs.err) return; // Skip failed transactions

      const signature = logs.signature;
      const transaction = await connection.getParsedTransaction(signature, 'confirmed');

      if (!transaction) return;

      const incomingTransfer = findIncomingTransfer(transaction, publicKey);
      if (incomingTransfer) {
        const { from, amount } = incomingTransfer;
        console.log(`Incoming transfer detected!`);
        console.log(`From: ${from.toBase58()}`);
        console.log(`Amount: ${amount / LAMPORTS_PER_SOL} SOL`);
        console.log(`Transaction signature: ${signature}`);
      }
    },
    'confirmed'
  );
}

function findIncomingTransfer(
  transaction: ParsedTransactionWithMeta,
  recipientAddress: PublicKey
): { from: PublicKey; amount: number } | null {
  for (const instruction of transaction.transaction.message.instructions) {
    try {
      const parsed = instruction as any;
      if (
        parsed.program === 'system' &&
        parsed.parsed.type === 'transfer' &&
        parsed.parsed.info.destination === recipientAddress.toBase58()
      ) {
        return {
          from: new PublicKey(parsed.parsed.info.source),
          amount: parsed.parsed.info.lamports,
        };
      }
    } catch (error) {
      // If accessing any property fails, just continue to the next instruction
      console.log('Skipping instruction due to unexpected format:', error);
      continue;
    }
  }
  return null;
}