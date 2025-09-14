"use client";

import React, { useState } from "react";

// ---------------------
// Chain → Token mapping
// ---------------------
const CHAIN_TOKENS = {
  Ethereum: ["ETH", "USDT", "DAI"],
  Solana: ["SOL", "USDC"],
  Sui: ["SUI", "USDC"],
  TRON: ["TRX", "USDT"],
  Bitcoin: ["BTC"],
};

// ---------------------
// Harga kasar (USD)
// ---------------------
const PRICES = {
  USD: 1,
  USDT: 1,
  DAI: 1,
  ETH: 3000,
  BTC: 60000,
  SOL: 150,
  SUI: 1,
  TRX: 0.1,
  USDC: 1,
};

// ---------------------
// Balance awal per chain
// ---------------------
const INITIAL_BALANCES = {
  Ethereum: { ETH: 10, USDT: 100000, DAI: 100000 },
  Solana: { SOL: 100, USDC: 100000 },
  Sui: { SUI: 1000, USDC: 100000 },
  TRON: { TRX: 100000, USDT: 100000 },
  Bitcoin: { BTC: 1 },
};

const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export default function Home() {
  const [fromChain, setFromChain] = useState("Ethereum");
  const [toChain, setToChain] = useState("Solana");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("SOL");
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState(JSON.parse(JSON.stringify(INITIAL_BALANCES)));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Submit intent
  const submitIntent = () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    const amt = parseFloat(amount);

    // cek balance cukup
    if (!balances[fromChain] || balances[fromChain][fromToken] < amt) {
      alert("Insufficient balance!");
      return;
    }

    setLoading(true);
    setSubmitted(false);

    setTimeout(() => {
      // hitung konversi
      const usdValue = amt * (PRICES[fromToken] || 1);
      const converted = usdValue / (PRICES[toToken] || 1);

      // update balances
      const newBalances = { ...balances };
      newBalances[fromChain] = { ...newBalances[fromChain] };
      newBalances[toChain] = { ...newBalances[toChain] };

      newBalances[fromChain][fromToken] -= amt;
      newBalances[toChain][toToken] = (newBalances[toChain][toToken] || 0) + converted;

      setBalances(newBalances);

      // simpan history
      const newIntent = {
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
          <div>
            <label className="block text-sm mb-1">From Chain</label>
            <select
              value={fromChain}
              onChange={(e) => {
                setFromChain(e.target.value);
                setFromToken(CHAIN_TOKENS[e.target.value][0]);
              }}
              className="w-full border p-2 rounded"
            >
              {Object.keys(CHAIN_TOKENS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">From Token</label>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {CHAIN_TOKENS[fromChain].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">To Chain</label>
            <select
              value={toChain}
              onChange={(e) => {
                setToChain(e.target.value);
                setToToken(CHAIN_TOKENS[e.target.value][0]);
              }}
              className="w-full border p-2 rounded"
            >
              {Object.keys(CHAIN_TOKENS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">To Token</label>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {CHAIN_TOKENS[toChain].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="0.00"
            />
          </div>

          <button
            onClick={submitIntent}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {loading ? "Submitting..." : "Submit Intent"}
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">Balances</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(balances).map((chain) => (
            <div key={chain} className="bg-white text-black p-3 rounded-lg shadow">
              <strong>{chain}</strong>
              <ul className="text-sm mt-1">
                {Object.entries(balances[chain]).map(([token, bal]) => (
                  <li key={token}>
                    {token}: {bal.toFixed(4)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
        <div className="space-y-2">
          {history.map((i) => (
            <div key={i.id} className="bg-white text-black p-3 rounded-lg shadow">
              <div>
                Sent <strong>{i.amount} {i.fromToken}</strong> from <strong>{i.fromChain}</strong>
                <br />
                Received <strong>{i.result.toFixed(4)} {i.toToken}</strong> on <strong>{i.toChain}</strong>
              </div>
              <div className="text-xs text-gray-600">
                (≈ USD {i.usd.toFixed(2)})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      {(loading || submitted) && (
        <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow">
          {loading && "Submitting..."}
          {submitted && "✅ Intent Done / Submitted"}
        </div>
      )}
    </div>
  );
}
