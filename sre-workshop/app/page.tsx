"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
  const [sla, setSla] = useState<number | ''>('');
  const [downtimes, setDowntimes] = useState<{ [key: string]: string }>({});

  const calculateDowntime = (availability: number, period: number) => {
    const downtime = period * (100 - availability) / 100;
    return Math.round(downtime * 60 * 60); // Convert to seconds and round
  };

  const formatDowntime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `;
    result += `${remainingSeconds}s`;

    return result.trim();
  };

  useEffect(() => {
    if (typeof sla === 'number' && !isNaN(sla)) {
      setDowntimes({
        daily: formatDowntime(calculateDowntime(sla, 24)),
        weekly: formatDowntime(calculateDowntime(sla, 24 * 7)),
        monthly: formatDowntime(calculateDowntime(sla, 24 * 30)),
        quarterly: formatDowntime(calculateDowntime(sla, 24 * 90)),
        yearly: formatDowntime(calculateDowntime(sla, 24 * 365)),
      });
    } else {
      setDowntimes({});
    }
  }, [sla]);

  return (
    <main className="bg-black min-h-screen text-white p-4">
      <h1 className="text-2xl mb-4">Service Level Agreement (SLA) Calculator</h1>
      <div className="flex items-center mb-2">
        <label htmlFor="sla" className="mr-2">SLA level:</label>
        <input
          id="sla"
          type="number"
          step="0.01"
          className="text-black px-2 py-1 w-20"
          placeholder="Enter SLA"
          value={sla}
          onChange={(e) => setSla(e.target.value ? Number(e.target.value) : '')}
        />
      </div>
      <p className="text-sm mb-4">% (enter SLA level and hit the &lt;enter&gt; key)</p>
      
      {Object.keys(downtimes).length > 0 && (
        <div>
          <p>SLA level of {sla}% uptime/availability results in the following periods of allowed downtime/unavailability:</p>
          <ul className="list-disc pl-5 mt-2">
            {Object.entries(downtimes).map(([period, time]) => (
              <li key={period}>
                {period.charAt(0).toUpperCase() + period.slice(1)}: {time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
