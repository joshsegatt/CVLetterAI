/**
 * AI System Status Dashboard - Simplified Version
 * Shows status of local, hybrid, and external AI services
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Brain, 
  Globe, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Zap
} from 'lucide-react';

interface AIServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'error';
  responseTime: number;
  model: string;
  type: 'local' | 'external' | 'hybrid';
  capabilities: string[];
  lastChecked: Date;
}

export default function AISystemDashboard() {
  const [services, setServices] = useState<AIServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    checkAllServices();
    const interval = setInterval(checkAllServices, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAllServices = async () => {
    setIsLoading(true);
    // Simulate API call - replace with actual API
    setTimeout(() => {
      setServices(mockServices);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'local': return <Brain className="h-4 w-4" />;
      case 'external': return <Globe className="h-4 w-4" />;
      case 'hybrid': return <Search className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const mockServices: AIServiceStatus[] = [
    {
      name: 'Local GGUF (Ollama)',
      status: 'online',
      responseTime: 150,
      model: 'llama3.2:latest',
      type: 'local',
      capabilities: ['Offline', 'Privacy', 'Fast', 'CV Analysis'],
      lastChecked: new Date()
    },
    {
      name: 'Hybrid Web Search',
      status: 'online',
      responseTime: 800,
      model: 'DuckDuckGo + Local',
      type: 'hybrid',
      capabilities: ['Current Info', 'Market Data', 'Salary Research', 'Company Info'],
      lastChecked: new Date()
    },
    {
      name: 'Groq Llama 3.1',
      status: 'online',
      responseTime: 300,
      model: 'llama-3.1-70b-versatile',
      type: 'external',
      capabilities: ['High Quality', 'Free Tier', 'Fast', '6000 tokens/min'],
      lastChecked: new Date()
    },
    {
      name: 'Hugging Face',
      status: 'online',
      responseTime: 1200,
      model: 'Meta-Llama-3.1-8B',
      type: 'external',
      capabilities: ['Open Source', 'Free', '1000 req/hour'],
      lastChecked: new Date()
    },
    {
      name: 'Cohere Command-R',
      status: 'online',
      responseTime: 900,
      model: 'command-r',
      type: 'external',
      capabilities: ['Conversation', 'Free Tier', '1000 calls/month'],
      lastChecked: new Date()
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🤖 AI System Status</h2>
          <p className="text-gray-600">
            Monitor local, hybrid, and external AI services
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button 
            onClick={checkAllServices} 
            disabled={isLoading}
            className="px-4 py-2"
          >
            {isLoading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Local AI</div>
              <div className="text-xs text-gray-500">
                {services.filter(s => s.type === 'local' && s.status === 'online').length} online
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium">Hybrid</div>
              <div className="text-xs text-gray-500">
                {services.filter(s => s.type === 'hybrid' && s.status === 'online').length} active
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-sm font-medium">External APIs</div>
              <div className="text-xs text-gray-500">
                {services.filter(s => s.type === 'external' && s.status === 'online').length} available
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium">Total Services</div>
              <div className="text-xs text-gray-500">
                {services.filter(s => s.status === 'online').length}/{services.length} online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white border rounded-lg p-6">
            {/* Service Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(service.type)}
                <h3 className="text-lg font-semibold">{service.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  service.status === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Model Info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Model:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {service.model}
                </span>
              </div>

              {/* Response Time */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Response Time:</span>
                <span className={`font-medium ${
                  service.responseTime < 500 ? 'text-green-600' : 
                  service.responseTime < 1000 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {service.responseTime}ms
                </span>
              </div>

              {/* Capabilities */}
              <div>
                <div className="text-sm text-gray-500 mb-2">Capabilities:</div>
                <div className="flex flex-wrap gap-1">
                  {service.capabilities.map((capability, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                {service.status === 'online' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                Last checked: {service.lastChecked.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Configuration */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🔧 System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium">AI Selection Strategy</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span><strong>Offline queries:</strong> Use local GGUF model</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span><strong>Current info needed:</strong> Activate web search + local</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span><strong>Fallback:</strong> External APIs (Groq, HF, Cohere)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Web Search Triggers</h4>
            <div className="text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-2">
                <span>• "current", "2025"</span>
                <span>• "salary", "market"</span>
                <span>• "recent", "latest"</span>
                <span>• Company names</span>
                <span>• "hiring", "jobs"</span>
                <span>• Location queries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Setup */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">🚀 Quick Setup</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="space-y-2">
              <div><strong>1. Install Ollama:</strong> <code className="bg-gray-200 px-2 py-1 rounded">winget install Ollama.Ollama</code></div>
              <div><strong>2. Download Model:</strong> <code className="bg-gray-200 px-2 py-1 rounded">ollama pull llama3.2:latest</code></div>
              <div><strong>3. Test:</strong> Visit <a href="/chat" className="text-blue-600 hover:underline">/chat</a> and ask something</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}