"use client";

import React, { useState, useEffect } from 'react';
// Mock interfaces for now
interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  failedLogins: number;
  suspiciousActivities: number;
  dataAccesses: number;
  topRiskyUsers: Array<{ userId: string; riskScore: number }>;
  timelineEvents: Array<{ hour: number; count: number }>;
}

interface SecurityDashboardProps {
  className?: string;
}

export default function SecurityDashboard({ className = '' }: SecurityDashboardProps) {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week'>('day');
  const [loading, setLoading] = useState(true);
  const [alertLevel, setAlertLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration - replace with real API call
        const data: SecurityMetrics = {
          totalEvents: Math.floor(Math.random() * 1000) + 500,
          criticalEvents: Math.floor(Math.random() * 5),
          failedLogins: Math.floor(Math.random() * 20),
          suspiciousActivities: Math.floor(Math.random() * 10),
          dataAccesses: Math.floor(Math.random() * 200) + 100,
          topRiskyUsers: [
            { userId: 'user_123', riskScore: 45 },
            { userId: 'user_456', riskScore: 32 },
            { userId: 'user_789', riskScore: 28 }
          ],
          timelineEvents: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: Math.floor(Math.random() * 50)
          }))
        };
        
        setMetrics(data);
        
        // Calcular nível de alerta baseado nas métricas
        const alertLvl = calculateAlertLevel(data);
        setAlertLevel(alertLvl);
      } catch (error) {
        console.error('Failed to fetch security metrics:', error);
      }
      setLoading(false);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Atualizar a cada 30s

    return () => clearInterval(interval);
  }, [timeframe]);

  const calculateAlertLevel = (data: SecurityMetrics): 'low' | 'medium' | 'high' | 'critical' => {
    if (data.criticalEvents > 0) return 'critical';
    if (data.failedLogins > 10 || data.suspiciousActivities > 5) return 'high';
    if (data.failedLogins > 5 || data.suspiciousActivities > 2) return 'medium';
    return 'low';
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-green-600 bg-green-100 border-green-300';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      default: return '✅';
    }
  };

  if (loading) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center ${className}`}>
        <p className="text-gray-400">Unable to load security metrics</p>
      </div>
    );
  }

  return (
    <div className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">🛡️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Security Dashboard</h2>
            <p className="text-gray-400 text-sm">Real-time threat monitoring</p>
          </div>
        </div>

        {/* Alert Level */}
        <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${getAlertColor(alertLevel)}`}>
          <span className="text-lg">{getAlertIcon(alertLevel)}</span>
          <span className="font-semibold uppercase text-sm">{alertLevel}</span>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-6">
        {(['hour', 'day', 'week'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeframe === tf
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Last {tf}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Events"
          value={metrics.totalEvents}
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Critical Events"
          value={metrics.criticalEvents}
          icon="🚨"
          color={metrics.criticalEvents > 0 ? "red" : "green"}
        />
        <MetricCard
          title="Failed Logins"
          value={metrics.failedLogins}
          icon="🔒"
          color={metrics.failedLogins > 10 ? "red" : metrics.failedLogins > 5 ? "orange" : "green"}
        />
        <MetricCard
          title="Suspicious Activity"
          value={metrics.suspiciousActivities}
          icon="👁️"
          color={metrics.suspiciousActivities > 5 ? "red" : metrics.suspiciousActivities > 2 ? "orange" : "green"}
        />
      </div>

      {/* Timeline Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Activity Timeline</h3>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-end gap-1 h-32">
            {metrics.timelineEvents.map((event, index) => {
              const maxCount = Math.max(...metrics.timelineEvents.map(e => e.count), 1);
              const height = (event.count / maxCount) * 100;
              
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                  title={`Hour ${event.hour}: ${event.count} events`}
                >
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t min-h-[4px] transition-all duration-300 hover:from-purple-500 hover:to-blue-400"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <span className="text-xs text-gray-400 mt-1">{event.hour}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Risky Users */}
      {metrics.topRiskyUsers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">High-Risk Users</h3>
          <div className="space-y-2">
            {metrics.topRiskyUsers.slice(0, 5).map((user, index) => (
              <div
                key={user.userId}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.userId}</p>
                    <p className="text-gray-400 text-sm">User ID</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-bold">{user.riskScore}</p>
                  <p className="text-gray-400 text-sm">Risk Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p>Banking-level security monitoring</p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    orange: 'from-orange-600 to-yellow-600',
    red: 'from-red-600 to-pink-600'
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <span className="text-lg">{icon}</span>
        </div>
        <span className={`text-2xl font-bold ${
          color === 'red' ? 'text-red-400' : 
          color === 'orange' ? 'text-orange-400' :
          color === 'green' ? 'text-green-400' : 'text-blue-400'
        }`}>
          {value}
        </span>
      </div>
      <p className="text-gray-300 text-sm font-medium">{title}</p>
    </div>
  );
}