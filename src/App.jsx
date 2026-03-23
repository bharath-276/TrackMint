import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function App() {
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState({});
  const [currentDate, setCurrentDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tracker")) || {};
    setData(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("tracker", JSON.stringify(data));
  }, [data]);

  const dayData = data[currentDate] || {
    openingBalance: "",
    transactions: [],
  };

  const detectCategory = (text) => {
    const t = text.toLowerCase();
    if (t.includes("food")) return "🍔 Food";
    if (t.includes("rent")) return "🏠 Rent";
    if (t.includes("travel")) return "🚗 Travel";
    return "📦 Other";
  };

  const totalCredit = dayData.transactions
    .filter((t) => t.type === "credit")
    .reduce((a, t) => a + t.amount, 0);

  const totalDebit = dayData.transactions
    .filter((t) => t.type === "debit")
    .reduce((a, t) => a + t.amount, 0);

  const balance =
    Number(dayData.openingBalance || 0) + totalCredit - totalDebit;

  const addTransaction = (type) => {
    if (!amount) return;

    const newTx = {
      amount: Number(amount),
      type,
      note,
      category: detectCategory(note),
      time: new Date().toLocaleTimeString(),
      date: currentDate,
    };

    setData((prev) => ({
      ...prev,
      [currentDate]: {
        ...dayData,
        transactions: [newTx, ...dayData.transactions],
      },
    }));

    setAmount("");
    setNote("");
  };

  // 🔥 FIXED CHART DATA
  const chartData = dayData.transactions.map((t, i) => ({
    name: i + 1,
    amount: t.type === "credit" ? t.amount : -t.amount,
    type: t.type,
  }));

  return (
    <div className="outer">
      <div className="container">
        <div className="header">
          <h2>🌿 TrackMint</h2>
          <p>{currentDate}</p>
        </div>

        <input
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          className="input"
        />

        <div className="balance">
          <h1>₹{balance}</h1>
          <p>Balance</p>
        </div>

        <div className="card">
          <input
            type="number"
            placeholder="Opening Balance"
            value={dayData.openingBalance || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                [currentDate]: {
                  ...dayData,
                  openingBalance:
                    e.target.value === "" ? "" : Number(e.target.value),
                },
              }))
            }
            className="input"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />

          <input
            type="text"
            placeholder="Reason"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input"
          />

          <div className="btnRow">
            <button onClick={() => addTransaction("credit")} className="credit">
              <FaPlus /> Credit
            </button>

            <button onClick={() => addTransaction("debit")} className="debit">
              <FaMinus /> Debit
            </button>
          </div>
        </div>

        {/* 🔥 CHART WITH COLORS */}
        <div className="card">
          <h3>📊 Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount">
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.type === "credit" ? "#22c55e" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TRANSACTIONS */}
        <div className="card">
          <h3>Transactions</h3>
          {dayData.transactions.map((t, i) => (
            <div key={i} className="tx">
              <div>
                <b>{t.category}</b>
                <p>{t.note}</p>
                <small>
                  {t.date} • {t.time}
                </small>
              </div>

              <h4 className={t.type === "credit" ? "green" : "red"}>
                {t.type === "credit" ? "+" : "-"}₹{t.amount}
              </h4>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: Arial;
          background: #e5e7eb;
        }

        .outer {
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 420px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .header {
          background: #16a34a;
          color: white;
          padding: 16px;
          border-radius: 16px;
          text-align: center;
        }

        .balance {
          background: white;
          padding: 20px;
          border-radius: 16px;
          text-align: center;
        }

        .card {
          background: white;
          padding: 16px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }

        .btnRow {
          display: flex;
          gap: 12px;
        }

        .credit, .debit {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: none;
          color: white;
        }

        .credit { background: #22c55e; }
        .debit { background: #ef4444; }

        .tx {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
          padding: 12px;
          border-radius: 10px;
        }

        .green { color: #16a34a; }
        .red { color: #ef4444; }
      `}</style>
    </div>
  );
}