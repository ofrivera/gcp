"use client";
import Image from "next/image";
import { useState } from 'react';

const HOURS = {
  YEAR: 8760,    // 365 days
  QUARTER: 2190, // 91.25 days
  MONTH: 730,    // 30.417 days
  WEEK: 168,     // 7 days
  DAY: 24,
  HOUR: 1
};

export default function Home() {
  const [sla, setSla] = useState<number | ''>('');
  const [slo, setSlo] = useState<number | ''>('');
  const [bufferMargin, setBufferMargin] = useState<number>(0.2); // Default 0.2%

  const calculateDowntime = (availability: number, period: number) => {
    // period is in hours
    const totalHours = period;
    // Calculate downtime hours: total time * (100 - availability percentage) / 100
    const downtimeHours = totalHours * ((100 - availability) / 100);
    return downtimeHours * 3600; // Convert to seconds
  };

  const formatDowntime = (seconds: number) => {
    // Constants for time conversions
    const SECONDS_IN_DAY = 86400;    // 24 * 60 * 60
    const SECONDS_IN_HOUR = 3600;    // 60 * 60
    const SECONDS_IN_MINUTE = 60;

    // Convert to days if >= 24 hours
    if (seconds >= SECONDS_IN_DAY) {
      const days = seconds / SECONDS_IN_DAY;
      return `${days.toFixed(2)} days`;
    }

    // Convert to hours if >= 60 minutes
    if (seconds >= SECONDS_IN_HOUR) {
      const hours = seconds / SECONDS_IN_HOUR;
      return `${hours.toFixed(2)} hours`;
    }

    // Convert to minutes if >= 60 seconds
    if (seconds >= SECONDS_IN_MINUTE) {
      const minutes = seconds / SECONDS_IN_MINUTE;
      return `${minutes.toFixed(2)} minutes`;
    }

    // Show seconds for smaller values
    return `${seconds.toFixed(2)} seconds`;
  };

return (
  <main className="bg-black min-h-screen text-white p-4">
    <h1 className="text-2xl mb-4">Service Level Calculator</h1>

    {/* SLO Input */}
    <div className="flex items-center mb-2">
      <label htmlFor="slo" className="mr-2 w-32">Target SLO:</label>
      <input
        id="slo"
        type="number"
        step="0.001"
        className="text-black px-2 py-1 w-20"
        placeholder="Enter SLO"
        value={slo}
        onChange={(e) => {
          const value = e.target.value ? Number(e.target.value) : '';
          setSlo(value);
          if (value !== '') {
            // Calculate Error Budget as 100 - SLO
            const newErrorBudget = Number((100 - value).toFixed(3));
            // SLA = SLO + Buffer Margin
            setSla(Number((value + bufferMargin).toFixed(3)));
          } else {
            setSla('');
          }
        }}
      />
      <span className="ml-2">%</span>
    </div>

    {/* Error Budget Display */}
    <div className="flex items-center mb-2">
      <label className="mr-2 w-32">Error Budget:</label>
      <span className="px-2 py-1 w-20 bg-gray-700">
        {slo !== '' ? (100 - Number(slo)).toFixed(3).replace(/\.?0+$/, '') : '0.2'}%
      </span>
    </div>

    {/* Buffer Margin Input */}
    <div className="flex items-center mb-2">
      <label htmlFor="bufferMargin" className="mr-2 w-32">Buffer Margin:</label>
      <input
        id="bufferMargin"
        type="number"
        step="0.001"
        min="0"
        className="text-black px-2 py-1 w-20"
        placeholder="Buffer"
        value={bufferMargin}
        onChange={(e) => {
          const value = Math.max(0, Number(e.target.value));
          setBufferMargin(value);
          if (slo !== '') {
            setSla(Number((Number(slo) + value).toFixed(3)));
          }
        }}
      />
      <span className="ml-2">%</span>
    </div>

    {/* SLA Display */}
    <div className="flex items-center mb-2">
      <label htmlFor="sla" className="mr-2 w-32">Calculated SLA:</label>
      <input
        id="sla"
        type="number"
        step="0.001"
        className="text-black px-2 py-1 w-20 bg-gray-100"
        placeholder="SLA"
        value={typeof sla === 'number' ? sla.toString().replace(/\.?0+$/, '') : sla}
        readOnly
      />
      <span className="ml-2">%</span>
    </div>

    {sla !== '' && (
      <div className="mt-8">
        <h2 className="text-xl mb-4">Calculated Downtime Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-2 text-left">Availability level</th>
                <th className="p-2 text-left">Downtime per year</th>
                <th className="p-2 text-left">Downtime per quarter</th>
                <th className="p-2 text-left">Downtime per month</th>
                <th className="p-2 text-left">Downtime per week</th>
                <th className="p-2 text-left">Downtime per day</th>
                <th className="p-2 text-left">Downtime per hour</th>
              </tr>
            </thead>
            <tbody>
              {/* SLO Row */}
              <tr className="border-b border-gray-700">
                <td className="p-2">SLO {slo.toString().replace(/\.?0+$/, '')}%</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(slo), HOURS.YEAR))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(slo), HOURS.QUARTER))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(slo), HOURS.MONTH))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(slo), HOURS.WEEK))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(slo), HOURS.DAY))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(slo), HOURS.HOUR))}</td>
              </tr>
              {/* SLA Row */}
              <tr className="border-b border-gray-700">
                <td className="p-2">SLA {sla.toString().replace(/\.?0+$/, '')}%</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(sla), HOURS.YEAR))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(sla), HOURS.QUARTER))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(sla), HOURS.MONTH))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(sla), HOURS.WEEK))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(sla), HOURS.DAY))}</td>
                <td className="p-2">{formatDowntime(calculateDowntime(Number(sla), HOURS.HOUR))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )}

      <div className="mt-8">
        <h2 className="text-xl mb-4">Availability Cheat Sheet</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-2 text-left">Availability level</th>
                <th className="p-2 text-left">Downtime per year</th>
                <th className="p-2 text-left">Downtime per quarter</th>
                <th className="p-2 text-left">Downtime per month</th>
                <th className="p-2 text-left">Downtime per week</th>
                <th className="p-2 text-left">Downtime per day</th>
                <th className="p-2 text-left">Downtime per hour</th>
              </tr>
            </thead>
            <tbody>
              {[90.0, 95.0, 99.0, 99.50, 99.90, 99.95, 99.99, 99.999].map((level) => (
                <tr key={level} className="border-b border-gray-700">
                  <td className="p-2">{level.toString().replace(/\.?0+$/, '')}%</td>
                  <td className="p-2">{formatDowntime(calculateDowntime(level, HOURS.YEAR))}</td>
                  <td className="p-2">{formatDowntime(calculateDowntime(level, HOURS.QUARTER))}</td>
                  <td className="p-2">{formatDowntime(calculateDowntime(level, HOURS.MONTH))}</td>
                  <td className="p-2">{formatDowntime(calculateDowntime(level, HOURS.WEEK))}</td>
                  <td className="p-2">{formatDowntime(calculateDowntime(level, HOURS.DAY))}</td>
                  <td className="p-2">{formatDowntime(calculateDowntime(level, HOURS.HOUR))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
