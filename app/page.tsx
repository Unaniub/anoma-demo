"use client";

import React, { useState } from "react";

const CHAIN_TOKENS: Record<string, string[]> = {
  Ethereum: ["ETH", "USDT", "DAI", "XAN"],
  Solana: ["SOL", "USDC"],
  Sui: ["SUI", "USDC"],
  TRON: ["TRX", "USDT"],
  Bitcoin: ["BTC"],
};

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

const INITIAL_BALANCES: Record<string, Record<string, number>> = {
  Ethereum: { ETH: 10, USDT: 100000, DAI: 100000, XAN: 100000 },
  Solana: { SOL: 100, USDC: 100000 },
  Sui: { SUI: 1000, USDC: 100000 },
  TRON: { TRX: 100000, USDT: 100000 },
  Bitcoin: { BTC: 1 },
};

const TOKEN_ICONS: Record<string, string> = {
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  DAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  TRX: "https://cryptologos.cc/logos/tron-trx-logo.png",
  SUI: "https://cryptologos.cc/logos/sui-sui-logo.png",
  XAN: "https://img.icons8.com/color/48/000000/experimental-coin.png",
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
  const [darkMode, setDarkMode] = useState(true); // <-- toggle state

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

      newBalances[fromChain][fromToken] -= amt;
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
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 bg-gray-700/70 dark:bg-gray-200 px-4 py-2 rounded-full shadow hover:scale-105 transition-all"
      >
        {darkMode ? "🌞 Light" : "🌙 Dark"}
      </button>

      <h1 className="text-3xl font-bold mb-8 tracking-wide">
        ⚡ Anoma Multichain Intents
      </h1>

      {/* Form */}
      <div
        className={`backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md border transition-colors duration-500 ${
          darkMode
            ? "bg-gray-900/40 border-gray-700"
            : "bg-white/70 border-gray-300"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Create Intent</h2>
        <div className="space-y-4">
          {/* From Chain */}
          <div>
            <label className="block text-sm mb-1">From Chain</label>
            <select
              value={fromChain}
              onChange={(e) => {
                setFromChain(e.target.value);
                setFromToken(CHAIN_TOKENS[e.target.value][0]);
              }}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Submit */}
          <button
            onClick={submitIntent}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Intent"}
          </button>

          {submitted && (
            <div className="text-green-500 text-sm mt-2">
              ✅ Intent submitted!
            </div>
          )}
        </div>
      </div>

      {/* Balances */}
      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Balances</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(balances).map((chain) =>
            Object.keys(balances[chain]).map((token) => (
              <div
                key={`${chain}-${token}`}
                className={`p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200 border backdrop-blur-md ${
                  darkMode
                    ? "bg-gray-900/60 border-gray-700"
                    : "bg-white/70 border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <img
                    src={TOKEN_ICONS[token]}
                    alt={token}
                    className="w-5 h-5 rounded-full"
                  />
                  {token}
                </div>
                <div className="font-bold mt-1">
                  {parseFloat(balances[chain][token].toFixed(4)).toString()}
                </div>
                <div className="text-xs opacity-70">{chain}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* History */}
      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">History</h2>
        {history.length === 0 && (
          <div className="opacity-70">No transactions yet</div>
        )}
        <div className="space-y-3">
          {history.map((i) => (
            <div
              key={i.id}
              className={`p-3 rounded-lg flex justify-between items-center hover:scale-[1.02] transition-transform duration-200 border backdrop-blur-md ${
                darkMode
                  ? "bg-gray-900/60 border-gray-700"
                  : "bg-white/70 border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={TOKEN_ICONS[i.fromToken]}
                  alt={i.fromToken}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm">
                  {i.amount} {i.fromToken} on {i.fromChain} →
                </span>
                <img
                  src={TOKEN_ICONS[i.toToken]}
                  alt={i.toToken}
                  className="w-5 h-5 rounded-full"
                />
                <strong>
                  {parseFloat(i.result.toFixed(4)).toString()} {i.toToken}
                </strong>
                <span className="text-sm">on {i.toChain}</span>
              </div>
              <div className="text-xs opacity-70">
                (≈ USD {i.usd.toFixed(2)})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
