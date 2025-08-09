// src/pages/Dashboard.jsx
import {
    MdTrendingUp,
    MdLocalGasStation,
    MdPercent,
    MdAttachMoney,
    MdWarningAmber,
    MdSchedule,
    MdInventory2
  } from "react-icons/md";
  
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  import { Bar } from "react-chartjs-2";
  
  // Register chart.js components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  // Chart Data
  const chartData = {
    labels: [
      "Aug 1",
      "Aug 2",
      "Aug 3",
      "Aug 4",
      "Aug 5",
      "Aug 6",
      "Aug 7"
    ],
    datasets: [
      {
        label: "Revenue",
        data: [125000, 132000, 118000, 140000, 150000, 138000, 142000],
        backgroundColor: "rgba(31, 59, 115, 0.6)", // Navy Blue
        borderRadius: 4
      },
      {
        label: "Liters Sold",
        data: [180, 190, 170, 200, 210, 195, 205],
        backgroundColor: "rgba(0, 191, 165, 0.6)", // Teal
        borderRadius: 4
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333333" }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: "#333333" },
        grid: { color: "rgba(224, 224, 224, 0.5)" }
      },
      y: {
        ticks: { color: "#333333" },
        grid: { color: "rgba(224, 224, 224, 0.5)" }
      }
    }
  };
  
  export default function Dashboard() {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-textmain">Date range</label>
            <input
              type="date"
              className="border border-bordercol rounded px-2 py-1 bg-surface text-textmain"
            />
            <span className="text-textmain">—</span>
            <input
              type="date"
              className="border border-bordercol rounded px-2 py-1 bg-surface text-textmain"
            />
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {["Today", "Last 7 Days", "Last 30 Days"].map((t) => (
              <button
                key={t}
                className="px-3 py-1.5 text-sm rounded border border-bordercol bg-surface hover:bg-background"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
  
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            icon={<MdAttachMoney />}
            label="Revenue (Today)"
            value="₨ 128,500"
            delta="+12.4%"
            bgColor="rgba(31, 59, 115, 0.08)"
          />
          <StatsCard
            icon={<MdTrendingUp />}
            label="Profit (Today)"
            value="₨ 34,200"
            delta="+5.1%"
            bgColor="rgba(0, 191, 165, 0.12)"
          />
          <StatsCard
            icon={<MdLocalGasStation />}
            label="Liters Sold (Today)"
            value="184.75 L"
            delta="+8.3%"
            bgColor="rgba(242, 157, 53, 0.15)"
          />
          <StatsCard
            icon={<MdPercent />}
            label="Avg. Discount"
            value="4.2%"
            delta="-0.6%"
            bgColor="rgba(208, 52, 44, 0.12)"
          />
        </section>
  
        {/* Chart + Low Stock */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SectionCard className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-textmain">Sales (Last 7 Days)</h3>
              <div className="text-xs text-textmain">Revenue • Liters</div>
            </div>
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </SectionCard>
  
          <SectionCard>
            <div className="flex items-center gap-2 mb-3">
              <MdWarningAmber />
              <h3 className="font-semibold text-textmain">Low Stock Alerts</h3>
            </div>
            <div className="overflow-x-auto -mx-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-textmain">
                    <th className="px-2 py-2">Product</th>
                    <th className="px-2 py-2">On Hand</th>
                    <th className="px-2 py-2">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bordercol/60">
                  {[
                    { name: "Shell Helix 5W-30", on: 6.5, th: 10 },
                    { name: "Total Quartz 10W-40", on: 9.2, th: 12 },
                    { name: "ZIC 0W-20", on: 3.0, th: 8 }
                  ].map((r) => (
                    <tr key={r.name}>
                      <td className="px-2 py-2">{r.name}</td>
                      <td className="px-2 py-2">{r.on} L</td>
                      <td className="px-2 py-2">{r.th} L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </section>
  
        {/* Reminders + Top Products */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard>
            <div className="flex items-center gap-2 mb-3">
              <MdSchedule />
              <h3 className="font-semibold text-textmain">Upcoming Reminders</h3>
            </div>
            <ul className="divide-y divide-bordercol/60 text-sm">
              {[
                {
                  plate: "AEL-123",
                  when: "in 2 days",
                  msg: "Oil change due (5,000 km)"
                },
                {
                  plate: "ABC-321",
                  when: "tomorrow",
                  msg: "Service follow-up"
                },
                {
                  plate: "LEA-909",
                  when: "today",
                  msg: "Due now"
                }
              ].map((r) => (
                <li
                  key={r.plate}
                  className="py-2 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-textmain">{r.plate}</div>
                    <div className="text-xs text-textmain/70">{r.msg}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-background border border-bordercol">
                    {r.when}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
  
          <SectionCard>
            <div className="flex items-center gap-2 mb-3">
              <MdInventory2 />
              <h3 className="font-semibold text-textmain">
                Top Products (7 Days)
              </h3>
            </div>
            <ul className="divide-y divide-bordercol/60 text-sm">
              {[
                {
                  name: "Shell Helix 5W-30",
                  liters: 92.5,
                  revenue: "₨ 182,000"
                },
                {
                  name: "ZIC 0W-20",
                  liters: 64.0,
                  revenue: "₨ 128,700"
                },
                {
                  name: "Total Quartz 10W-40",
                  liters: 51.2,
                  revenue: "₨ 96,900"
                }
              ].map((p) => (
                <li
                  key={p.name}
                  className="py-2 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-textmain">{p.name}</div>
                    <div className="text-xs text-textmain/70">{p.liters} L</div>
                  </div>
                  <span className="text-sm">{p.revenue}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </section>
      </div>
    );
  }
  
  /* Reusable bits */
  function SectionCard({ children, className = "" }) {
    return (
      <div className={`bg-surface border border-bordercol rounded-lg p-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  function StatsCard({ icon, label, value, delta, bgColor }) {
    const isNeg = String(delta).trim().startsWith("-");
    return (
      <div
        className={`border border-bordercol rounded-lg p-4 flex items-start gap-3`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="text-accent text-xl shrink-0">{icon}</div>
        <div className="flex-1">
          <div className="text-sm text-textmain/80">{label}</div>
          <div className="text-2xl font-semibold text-textmain mt-1">{value}</div>
        </div>
        <div
          className={`text-xs px-2 py-1 rounded self-start ${
            isNeg ? "bg-error/10 text-error" : "bg-success/10 text-success"
          }`}
        >
          {delta}
        </div>
      </div>
    );
  }
  