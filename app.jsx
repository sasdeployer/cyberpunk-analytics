import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MousePointer, DollarSign, Activity, Zap, Eye, Target } from 'lucide-react';

export default function CyberpunkDashboard() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 8000);
    return () => {
      clearInterval(timer);
      clearInterval(glitchTimer);
    };
  }, []);

  const userGrowthData = [
    { month: 'Jan', users: 2400, revenue: 4800 },
    { month: 'Feb', users: 3200, revenue: 6100 },
    { month: 'Mar', users: 4100, revenue: 8200 },
    { month: 'Apr', users: 5300, revenue: 10500 },
    { month: 'May', users: 6800, revenue: 13200 },
    { month: 'Jun', users: 8500, revenue: 16800 },
  ];

  const engagementData = [
    { name: 'Active', value: 6800, color: '#00ff41' },
    { name: 'Idle', value: 2200, color: '#ff00ff' },
    { name: 'Churned', value: 800, color: '#ff0080' },
  ];

  const eventData = [
    { event: 'Page View', count: 45200 },
    { event: 'Button Click', count: 32100 },
    { event: 'Form Submit', count: 18400 },
    { event: 'Video Play', count: 12800 },
    { event: 'Purchase', count: 8500 },
  ];

  const metrics = [
    { icon: Users, label: 'Total Users', value: '12.4K', change: '+18.2%', color: '#00ff41' },
    { icon: MousePointer, label: 'Active Sessions', value: '3.2K', change: '+12.5%', color: '#00d4ff' },
    { icon: DollarSign, label: 'Revenue', value: '$64.8K', change: '+24.1%', color: '#ff00ff' },
    { icon: Activity, label: 'Engagement', value: '84.2%', change: '+5.3%', color: '#ffff00' },
  ];

  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="relative bg-black border-2 border-cyan-500 p-4 overflow-hidden group hover:border-pink-500 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-6 h-6" style={{ color }} />
          <span className="text-xs font-mono text-green-400">{change}</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1 font-mono">{value}</div>
        <div className="text-xs text-cyan-300 uppercase tracking-wider font-mono">{label}</div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 border-l-2 border-b-2 border-pink-500/30" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#4c1d95] text-white p-6 font-mono" style={{
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,255,0.03) 0px, transparent 1px, transparent 2px, rgba(0,255,255,0.03) 3px)',
    }}>
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Header */}
      <div className="mb-8 border-b-2 border-cyan-500 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${glitchActive ? 'glitch' : ''}`}
              style={{
                textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
                color: '#00ff41'
              }}>
              <Zap className="inline-block mr-2 w-8 h-8" />
              NEXUS ANALYTICS
            </h1>
            <p className="text-cyan-300 text-sm">Real-time product intelligence system</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-500">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-xs text-cyan-300">
              {time.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, idx) => (
          <StatCard key={idx} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-black border-2 border-cyan-500 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-cyan-500 animate-pulse" />
          <h2 className="text-xl font-bold mb-4 text-cyan-300 flex items-center">
            <TrendingUp className="mr-2 w-5 h-5" />
            USER GROWTH TRAJECTORY
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00ffff22" />
              <XAxis dataKey="month" stroke="#00d4ff" />
              <YAxis stroke="#00d4ff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff41', fontFamily: 'monospace' }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#00ff41" strokeWidth={2} dot={{ fill: '#00ff41', r: 4 }} />
              <Line type="monotone" dataKey="revenue" stroke="#ff00ff" strokeWidth={2} dot={{ fill: '#ff00ff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-black border-2 border-pink-500 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500 animate-pulse" />
          <h2 className="text-xl font-bold mb-4 text-pink-300 flex items-center">
            <Target className="mr-2 w-5 h-5" />
            ENGAGEMENT MATRIX
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #ff00ff', fontFamily: 'monospace' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event Analytics */}
      <div className="bg-black border-2 border-yellow-500 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-green-500 to-yellow-500 animate-pulse" />
        <h2 className="text-xl font-bold mb-4 text-yellow-300 flex items-center">
          <Eye className="mr-2 w-5 h-5" />
          EVENT STREAM ANALYSIS
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffff0022" />
            <XAxis dataKey="event" stroke="#ffff00" angle={-15} textAnchor="end" height={80} />
            <YAxis stroke="#ffff00" />
            <Tooltip
              contentStyle={{ backgroundColor: '#000', border: '1px solid #ffff00', fontFamily: 'monospace' }}
            />
            <Bar dataKey="count" fill="#00ff41" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-cyan-500 border-t-2 border-cyan-500 pt-4">
        <p>SYSTEM STATUS: <span className="text-green-400 animate-pulse">● ONLINE</span></p>
        <p className="mt-1">NEXLAYER DEPLOYMENT ACTIVE</p>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        .glitch {
          animation: glitch 0.3s infinite;
        }
      `}</style>
    </div>
  );
}