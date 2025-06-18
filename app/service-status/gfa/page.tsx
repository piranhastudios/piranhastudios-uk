"use client"
import React, { useState, useRef } from "react";
import { Activity, Play, Square, Zap, AlertCircle, CheckCircle2 } from "lucide-react";

const ENDPOINT = "https://gfamonorepo.onrender.com/health"; // Change to your endpoint

export default function StatusChecker() {
  const [status, setStatus] = useState<string | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch(ENDPOINT);
      const data = await res.json();
      setStatus(data.status);
    } catch {
      setStatus("error");
    }
  };

  const startMonitoring = () => {
    setMonitoring(true);
    checkStatus();
    intervalRef.current = setInterval(checkStatus, 5000);
  };

  const stopMonitoring = () => {
    setMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "ok":
      case "healthy":
        return "text-emerald-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "ok":
      case "healthy":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "ok":
      case "healthy":
        return "bg-emerald-500/20 border-emerald-500/30 text-emerald-300";
      case "error":
        return "bg-red-500/20 border-red-500/30 text-red-300";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-900 rounded-2xl mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Service Monitor
            </h1>
            <p className="text-gray-400 text-sm">
              Real-time health monitoring
            </p>
          </div>

          {/* Status Display */}
          <div className="mb-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 font-medium">Status</span>
                {monitoring && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm">Live</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <span className={`text-lg font-semibold capitalize ${getStatusColor()}`}>
                  {status || "Unknown"}
                </span>
              </div>
              
              {status && (
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge()}`}>
                    {status === "error" ? "Service Unavailable" : "Service Operational"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={checkStatus}
              disabled={monitoring}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              Check Once
            </button>

            {!monitoring ? (
              <button
                onClick={startMonitoring}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4" />
                Start Monitoring
              </button>
            ) : (
              <button
                onClick={stopMonitoring}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <Square className="w-4 h-4" />
                Stop Monitoring
              </button>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Auto-refresh: 5s</span>
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                Endpoint Health
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}