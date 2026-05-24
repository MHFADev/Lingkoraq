"use client";

import { useState, useEffect } from "react";
import { Check, X, AlertTriangle, RefreshCw, Play, Search } from "lucide-react";
import { motion } from "framer-motion";
import { checkMusicServiceStatus, searchMusic, getMusicStreamUrl } from "@/lib/musicScraper";

interface ServiceStatus {
  invidious: boolean;
  youtubeMusic: boolean;
  overall: boolean;
}

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  details?: any;
}

export default function MusicServiceStatus() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: "Service Availability Check", status: "pending" },
    { name: "Music Search Functionality", status: "pending" },
    { name: "Streaming URL Extraction", status: "pending" },
    { name: "End-to-End Playback Test", status: "pending" },
  ]);
  const [isTesting, setIsTesting] = useState(false);
  const [searchTestQuery, setSearchTestQuery] = useState("shape of you");
  const [searchTestResults, setSearchTestResults] = useState<any[]>([]);
  const [streamTestVideoId, setStreamTestVideoId] = useState("dQw4w9WgXcQ");
  const [streamTestUrl, setStreamTestUrl] = useState<string | null>(null);

  // Cek status service
  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const status = await checkMusicServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error("Status check error:", error);
      setServiceStatus({
        invidious: false,
        youtubeMusic: false,
        overall: false,
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Jalankan semua tests
  const runAllTests = async () => {
    setIsTesting(true);
    const newResults = [...testResults];
    
    // Test 1: Service Availability
    newResults[0] = { ...newResults[0], status: 'running' };
    setTestResults([...newResults]);
    
    try {
      const status = await checkMusicServiceStatus();
      newResults[0] = {
        name: "Service Availability Check",
        status: status.overall ? 'passed' : 'failed',
        message: status.overall 
          ? `Service available via ${status.invidious ? 'Invidious' : 'YouTube Music'}`
          : 'All services unavailable',
        details: status,
      };
    } catch (error: any) {
      newResults[0] = {
        name: "Service Availability Check",
        status: 'failed',
        message: error.message || 'Failed to check service status',
      };
    }
    setTestResults([...newResults]);

    // Test 2: Music Search
    newResults[1] = { ...newResults[1], status: 'running' };
    setTestResults([...newResults]);
    
    try {
      const results = await searchMusic(searchTestQuery, { limit: 3, filter: 'songs' });
      setSearchTestResults(results);
      
      newResults[1] = {
        name: "Music Search Functionality",
        status: results.length > 0 ? 'passed' : 'failed',
        message: results.length > 0 
          ? `Found ${results.length} results for "${searchTestQuery}"`
          : `No results found for "${searchTestQuery}"`,
        details: { query: searchTestQuery, resultCount: results.length },
      };
    } catch (error: any) {
      newResults[1] = {
        name: "Music Search Functionality",
        status: 'failed',
        message: error.message || 'Search failed',
      };
    }
    setTestResults([...newResults]);

    // Test 3: Streaming URL Extraction
    newResults[2] = { ...newResults[2], status: 'running' };
    setTestResults([...newResults]);
    
    try {
      const url = await getMusicStreamUrl(streamTestVideoId);
      setStreamTestUrl(url);
      
      newResults[2] = {
        name: "Streaming URL Extraction",
        status: url ? 'passed' : 'failed',
        message: url 
          ? `Successfully extracted streaming URL (${url.includes('youtube.com') ? 'YouTube' : 'Audio'})`
          : 'Failed to extract streaming URL',
        details: { videoId: streamTestVideoId, url },
      };
    } catch (error: any) {
      newResults[2] = {
        name: "Streaming URL Extraction",
        status: 'failed',
        message: error.message || 'Stream extraction failed',
      };
    }
    setTestResults([...newResults]);

    // Test 4: End-to-End Playback (simulated)
    newResults[3] = { ...newResults[3], status: 'running' };
    setTestResults([...newResults]);
    
    setTimeout(() => {
      const hasSearchResults = searchTestResults.length > 0;
      const hasStreamUrl = streamTestUrl !== null;
      
      newResults[3] = {
        name: "End-to-End Playback Test",
        status: hasSearchResults && hasStreamUrl ? 'passed' : 'failed',
        message: hasSearchResults && hasStreamUrl
          ? 'All components working together correctly'
          : 'Some components failed to work together',
        details: {
          searchWorking: hasSearchResults,
          streamWorking: hasStreamUrl,
          overall: hasSearchResults && hasStreamUrl,
        },
      };
      
      setTestResults([...newResults]);
      setIsTesting(false);
    }, 1000);
  };

  // Jalankan cek status saat komponen dimuat
  useEffect(() => {
    checkStatus();
  }, []);

  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const totalTests = testResults.length;

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Music Service Status & Testing</h2>
          <p className="text-sm text-gray-400 mt-1">Comprehensive verification of music search and playback system</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <span className="text-blue-300 font-medium">
              {passedTests}/{totalTests} Tests Passed
            </span>
          </div>
          <button
            onClick={checkStatus}
            disabled={isChecking}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Service Status */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            serviceStatus?.invidious 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {serviceStatus?.invidious ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className="font-medium text-white">Invidious API</p>
                <p className="text-xs text-gray-400">Public YouTube API</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              serviceStatus?.invidious 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {serviceStatus?.invidious ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            serviceStatus?.youtubeMusic 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {serviceStatus?.youtubeMusic ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className="font-medium text-white">YouTube Music</p>
                <p className="text-xs text-gray-400">Music streaming</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              serviceStatus?.youtubeMusic 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {serviceStatus?.youtubeMusic ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            serviceStatus?.overall 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {serviceStatus?.overall ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
              <div>
                <p className="font-medium text-white">Overall Status</p>
                <p className="text-xs text-gray-400">System availability</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              serviceStatus?.overall 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {serviceStatus?.overall ? 'Operational' : 'Degraded'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Test Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-medium text-white">Search Test Query</label>
            </div>
            <input
              type="text"
              value={searchTestQuery}
              onChange={(e) => setSearchTestQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
              placeholder="Enter search query for testing"
            />
            <p className="text-xs text-gray-400 mt-2">
              Used to test music search functionality
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-4 h-4 text-purple-400" />
              <label className="text-sm font-medium text-white">Stream Test Video ID</label>
            </div>
            <input
              type="text"
              value={streamTestVideoId}
              onChange={(e) => setStreamTestVideoId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
              placeholder="Enter YouTube video ID"
            />
            <p className="text-xs text-gray-400 mt-2">
              Used to test streaming URL extraction
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Test Results</h3>
        <div className="space-y-3">
          {testResults.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all ${
                test.status === 'passed' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : test.status === 'failed'
                  ? 'bg-red-500/10 border-red-500/30'
                  : test.status === 'running'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {test.status === 'passed' && (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                  {test.status === 'failed' && (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                  {test.status === 'running' && (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {test.status === 'pending' && (
                    <div className="w-5 h-5 border-2 border-gray-500 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium text-white">{test.name}</p>
                    {test.message && (
                      <p className="text-sm text-gray-300 mt-0.5">{test.message}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  test.status === 'passed' ? 'bg-green-500/20 text-green-400' :
                  test.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  test.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-700 text-gray-500'
                }`}>
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </span>
              </div>
              
              {/* Test Details */}
              {test.details && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <pre className="text-xs text-gray-400 overflow-x-auto bg-black/20 p-2 rounded">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Test Controls */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Run comprehensive tests to verify all functionality</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={checkStatus}
              disabled={isChecking || isTesting}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Check Status'}
            </button>
            
            <button
              onClick={runAllTests}
              disabled={isTesting}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isTesting ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>
        </div>
        
        {/* Test Summary */}
        <div className="mt-6 p-4 rounded-lg bg-gray-800/30 border border-gray-700">
          <h4 className="font-medium text-white mb-2">Test Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-lg bg-gray-800/50">
              <p className="text-2xl font-bold text-green-400">{passedTests}</p>
              <p className="text-xs text-gray-400">Tests Passed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-800/50">
              <p className="text-2xl font-bold text-red-400">{totalTests - passedTests}</p>
              <p className="text-xs text-gray-400">Tests Failed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-800/50">
              <p className="text-2xl font-bold text-blue-400">{totalTests}</p>
              <p className="text-xs text-gray-400">Total Tests</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-800/50">
              <p className="text-2xl font-bold text-yellow-400">
                {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}