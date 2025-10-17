"use client";

import React, { useState } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import SecurityDashboard from '../../components/security/SecurityDashboard';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guidelines' | 'tools'>('dashboard');

  return (
    <PublicLayout
      title="Security & Protection"
      description="Banking-level security features and cyber protection information"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🛡️ Security & Cyber Protection
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your data is protected with banking-level security. Learn about our security measures and best practices.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-2 flex gap-2">
            {[
              { key: 'dashboard', label: '📊 Security Dashboard', desc: 'Real-time monitoring' },
              { key: 'guidelines', label: '📋 Security Guide', desc: 'Best practices' },
              { key: 'tools', label: '🔧 Security Tools', desc: 'Protection features' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <SecurityDashboard className="mb-8" />
        )}

        {activeTab === 'guidelines' && (
          <SecurityGuidelines />
        )}

        {activeTab === 'tools' && (
          <SecurityTools />
        )}
      </div>
    </PublicLayout>
  );
}

function SecurityGuidelines() {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'JWT Authentication',
      description: 'Secure token-based authentication with refresh tokens and session management.',
      features: ['15-minute access tokens', 'Secure refresh mechanism', 'Session hijacking protection']
    },
    {
      icon: '🛡️',
      title: 'Input Validation',
      description: 'Comprehensive input sanitization and validation to prevent injection attacks.',
      features: ['SQL injection prevention', 'XSS protection', 'CSRF token validation']
    },
    {
      icon: '🚫',
      title: 'Rate Limiting',
      description: 'Advanced rate limiting to prevent abuse and DDoS attacks.',
      features: ['5 login attempts per 5min', '100 API calls per 15min', 'IP-based blocking']
    },
    {
      icon: '🔒',
      title: 'Data Encryption',
      description: 'End-to-end encryption for sensitive data storage and transmission.',
      features: ['AES-256-GCM encryption', 'Secure key management', 'HTTPS everywhere']
    },
    {
      icon: '👁️',
      title: 'Security Monitoring',
      description: 'Real-time monitoring and alerting for security incidents.',
      features: ['Attack pattern detection', 'Audit logging', 'Incident response']
    },
    {
      icon: '🏗️',
      title: 'Secure Headers',
      description: 'Banking-level HTTP security headers and content policies.',
      features: ['Strict CSP', 'HSTS enforcement', 'XSS protection']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.features.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Best Practices */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">📚</span>
          Security Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🔑</span> For Users
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Use strong, unique passwords with at least 12 characters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Enable two-factor authentication when available</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Keep your browser and operating system updated</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Avoid public Wi-Fi for sensitive activities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Log out when finished, especially on shared devices</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🏢</span> For Organizations
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Implement role-based access controls</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Regular security training for all team members</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Conduct regular security audits and penetration testing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Maintain incident response and data breach procedures</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Keep all software dependencies updated and patched</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTools() {
  const tools = [
    {
      icon: '🔍',
      title: 'Security Scanner',
      description: 'Scan your CV and letters for potential security issues',
      action: 'Run Scan',
      status: 'Available'
    },
    {
      icon: '🔐',
      title: 'Password Strength Checker',
      description: 'Test the strength of your passwords',
      action: 'Check Password',
      status: 'Available'
    },
    {
      icon: '📋',
      title: 'Security Audit Report',
      description: 'Generate a comprehensive security report',
      action: 'Generate Report',
      status: 'Pro Feature'
    },
    {
      icon: '🚫',
      title: 'Data Privacy Settings',
      description: 'Manage your data privacy and retention settings',
      action: 'Configure',
      status: 'Available'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{tool.icon}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                tool.status === 'Available' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {tool.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
            <p className="text-gray-300 mb-4">{tool.description}</p>
            
            <button 
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                tool.status === 'Available'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              disabled={tool.status !== 'Available'}
            >
              {tool.action}
            </button>
          </div>
        ))}
      </div>

      {/* Security Checklist */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">✅</span>
          Security Checklist
        </h2>

        <div className="space-y-4">
          {[
            { task: 'Strong password set', completed: true },
            { task: 'Two-factor authentication enabled', completed: false },
            { task: 'Recovery email verified', completed: true },
            { task: 'Privacy settings configured', completed: false },
            { task: 'Recent activity reviewed', completed: true }
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-orange-500/20 border-2 border-orange-500'
                }`}>
                  {item.completed && '✓'}
                </div>
                <span className={item.completed ? 'text-white' : 'text-gray-300'}>
                  {item.task}
                </span>
              </div>
              
              {!item.completed && (
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3 text-green-400">
            <span className="text-xl">🔒</span>
            <div>
              <h3 className="font-semibold">Security Score: 85%</h3>
              <p className="text-sm text-green-300">Your account has good security. Complete remaining items for maximum protection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}