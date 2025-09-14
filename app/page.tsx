"use client";

import React, { useState } from "react";

// ---------------------
// Chain → Token mapping
// ---------------------
const CHAIN_TOKENS: Record<string, string[]> = {
  Ethereum: ["ETH", "USDT", "DAI", "XAN"],
  Solana: ["SOL", "USDC"],
  Sui: ["SUI", "USDC"],
  TRON: ["TRX", "USDT"],
  Bitcoin: ["BTC"],
};

// ---------------------
// Harga kasar (USD)
// ---------------------
const PRICES: Record<string, number> = {
  USD: 1,
  USDT: 1,
  USDC: 1,
  DAI: 1,
  ETH: 4500,
  BTC: 115000,
  SOL: 240,
  SUI: 3.5,
  TRX: 0.1,
  XAN: 1,
};

// ---------------------
// Balance awal per chain
// ---------------------
const INITIAL_BALANCES: Record<string, Record<string, number>> = {
  Ethereum: { ETH: 10, USDT: 100000, DAI: 100000, XAN: 100000 },
  Solana: { SOL: 100, USDC: 100000 },
  Sui: { SUI: 1000, USDC: 100000 },
  TRON: { TRX: 100000, USDT: 100000 },
  Bitcoin: { BTC: 1 },
};

const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

type Intent = {
  id: string;
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: number;
  result: number;
  usd: number;
};

// ---------------------
// Logo mapping
// ---------------------
const ICONS: Record<string, string> = {
  ETH: "/icons/eth.png",
  USDT: "/icons/usdt.png",
  DAI: "/icons/dai.png",
  SOL: "/icons/sol.png",
  SUI: "/icons/sui.png",
  TRX: "/icons/tron.png",
  BTC: "/icons/btc.png",
  USDC: "/icons/usdc.png",
  XAN: "/icons/anoma.png",
  Ethereum: "/icons/eth.png",
  Solana: "/icons/sol.png",
  Sui: "/icons/sui.png",
  TRON: "/icons/tron.png",
  Bitcoin: "/icons/btc.png",
};

const getIcon = (symbol: string) => ICONS[symbol] || "/icons/eth.png";

export default function Home() {
  const [fromChain, setFromChain] = useState("Ethereum");
  const [toChain, setToChain] = useState("Solana");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("SOL");
  const [amount, setAmount] = useState<string>("");
  const [balances, setBalances] = useState<Record<string, Record<string, number>>>(
    JSON.parse(JSON.stringify(INITIAL_BALANCES))
  );
  const [history, setHistory] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Submit intent
  const submitIntent = () => {
    const amt = parseFloat(amount);

    if (!amount || isNaN(amt) || amt <= 0) return;

    if (!balances[fromChain] || (balances[fromChain][fromToken] ?? 0) < amt) {
      alert("Insufficient balance!");
      return;
    }

    setLoading(true);
    setSubmitted(false);

    setTimeout(() => {
      const usdValue = amt * (PRICES[fromToken] ?? 1);
      const converted = usdValue / (PRICES[toToken] ?? 1);

      const newBalances = { ...balances };
      newBalances[fromChain] = { ...newBalances[fromChain] };
      newBalances[toChain] = { ...newBalances[toChain] };

      newBalances[fromChain][fromToken] =
        (newBalances[fromChain][fromToken] ?? 0) - amt;
      newBalances[toChain][toToken] =
        (newBalances[toChain][toToken] ?? 0) + converted;

      setBalances(newBalances);

      const newIntent: Intent = {
        id: uid("intent"),
        fromChain,
        toChain,
        fromToken,
        toToken,
        amount: amt,
        result: converted,
        usd: usdValue,
      };
      setHistory((prev) => [newIntent, ...prev]);

      setAmount("");
      setLoading(false);
      setSubmitted(true);

      setTimeout(() => setSubmitted(false), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Anoma Multichain Intents</h1>

      {/* Form */}
      <div className="bg-white text-black p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create Intent</h2>
        <div className="space-y-3">
          {/* From Chain */}
          <div>
            <label className="block text-sm mb-1">From Chain</label>
            <select
              value={fromChain}
              onChange={(e) => {
                setFromChain(e.target.value);
                setFromToken(CHAIN_TOKENS[e.target.value][0]);
              }}
              className="w-full border p-2 rounded text-black"
            >
              {Object.keys(CHAIN_TOKENS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* From Token */}
          <div>
            <label className="block text-sm mb-1">From Token</label>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="w-full border p-2 rounded text-black"
            >
              {CHAIN_TOKENS[fromChain].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* To Chain */}
          <div>
            <label className="block text-sm mb-1">To Chain</label>
            <select
              value={toChain}
              onChange={(e) => {
                setToChain(e.target.value);
                setToToken(CHAIN_TOKENS[e.target.value][0]);
              }}
              className="w-full border p-2 rounded text-black"
            >
              {Object.keys(CHAIN_TOKENS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* To Token */}
          <div>
            <label className="block text-sm mb-1">To Token</label>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="w-full border p-2 rounded text-black"
            >
              {CHAIN_TOKENS[toChain].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter amount"
            />
          </div>

          {/* Submit */}
          <button
            onClick={submitIntent}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Submit Intent"}
          </button>

          {submitted && (
            <div className="text-green-600 text-sm mt-2">Intent submitted!</div>
          )}
        </div>
      </div>

      {/* Balances */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Balances</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(balances).map((chain) =>
            Object.keys(balances[chain]).map((token) => (
              <div
                key={`${chain}-${token}`}
                className="bg-gray-900 p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <img src={getIcon(token)} alt={token} className="w-5 h-5" />
                  <span className="text-sm text-gray-400">{token}</span>
                </div>
                <div className="font-bold">
                  {parseFloat(balances[chain][token].toFixed(4)).toString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* History */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">History</h2>
        {history.length === 0 && (
          <div className="text-gray-500">No transactions yet</div>
        )}
        <div className="space-y-2">
          {history.map((i) => (
            <div
              key={i.id}
              className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="text-sm flex items-center gap-2">
                  <img
                    src={getIcon(i.fromToken)}
                    alt={i.fromToken}
                    className="w-4 h-4"
                  />
                  {i.amount} {i.fromToken} on {i.fromChain} →{" "}
                  <strong className="flex items-center gap-2">
                    <img
                      src={getIcon(i.toToken)}
                      alt={i.toToken}
                      className="w-4 h-4"
                    />
                    {parseFloat(i.result.toFixed(4)).toString()} {i.toToken}
                  </strong>{" "}
                  on <strong>{i.toChain}</strong>
                </div>
                <div className="text-xs text-gray-400">
                  (≈ USD {i.usd.toFixed(2)})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
