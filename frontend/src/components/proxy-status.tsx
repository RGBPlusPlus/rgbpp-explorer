'use client'

import { useEffect,useState } from 'react'

interface ProxyStatus {
  status: string
  timestamp: string
  proxy: {
    enabled: boolean
    endpoint: string
    healthEndpoint: string
    testEndpoint: string
    cacheEndpoint: string
  }
  cache: {
    enabled: boolean
    ttl: number
    endpoint: string
  }
  target: {
    url: string
    status: string
    response: any
  }
  environment: {
    NEXT_PUBLIC_ENABLE_PROXY?: string
    NEXT_PUBLIC_TRPC_API_URL?: string
    NEXT_PUBLIC_ENABLE_CACHE?: string
    NEXT_PUBLIC_CACHE_TTL?: string
  }
  configuration: {
    currentMode: string
    description: string
    cacheMode: string
    cacheDescription: string
  }
}

export function ProxyStatus() {
  const [status, setStatus] = useState<ProxyStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/proxy/status')
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
      case 'reachable':
        return 'text-green-600'
      case 'unhealthy':
      case 'unreachable':
      case 'error':
        return 'text-red-600'
      case 'proxy_disabled':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
      case 'reachable':
        return '✅'
      case 'unhealthy':
      case 'unreachable':
      case 'error':
        return '❌'
      case 'proxy_disabled':
        return '⚠️'
      default:
        return '❓'
    }
  }

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 border-red-200">
        <div className="text-red-600">Error: {error}</div>
        <button 
          onClick={fetchStatus}
          className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="text-gray-600">No status data available</div>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">代理状态</h3>
        <button 
          onClick={fetchStatus}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          刷新
        </button>
      </div>

      {/* 代理状态 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">代理模式:</span>
          <span className={`text-sm ${getStatusColor(status.configuration.currentMode)}`}>
            {getStatusIcon(status.configuration.currentMode)} {status.configuration.currentMode}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {status.configuration.description}
        </div>
        <div className="text-xs text-gray-500">
          代理开关: {status.proxy.enabled ? '启用' : '禁用'}
        </div>
      </div>

      {/* 缓存状态 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">缓存模式:</span>
          <span className={`text-sm ${getStatusColor(status.configuration.cacheMode)}`}>
            {getStatusIcon(status.configuration.cacheMode)} {status.configuration.cacheMode}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {status.configuration.cacheDescription}
        </div>
        <div className="text-xs text-gray-500">
          缓存开关: {status.cache.enabled ? '启用' : '禁用'} | TTL: {status.cache.ttl}秒
        </div>
      </div>

      {/* 目标服务器状态 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">目标服务器:</span>
          <span className={`text-sm ${getStatusColor(status.target.status)}`}>
            {getStatusIcon(status.target.status)} {status.target.status}
          </span>
        </div>
        <div className="text-xs text-gray-500 break-all">
          {status.target.url}
        </div>
      </div>

      {/* 环境变量 */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">环境变量:</div>
        <div className="text-xs space-y-1">
          <div>
            <span className="text-gray-600">NEXT_PUBLIC_ENABLE_PROXY:</span>
            <span className="ml-2 font-mono bg-gray-100 px-1 rounded">
              {status.environment.NEXT_PUBLIC_ENABLE_PROXY || 'undefined'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">NEXT_PUBLIC_TRPC_API_URL:</span>
            <span className="ml-2 font-mono bg-gray-100 px-1 rounded break-all">
              {status.environment.NEXT_PUBLIC_TRPC_API_URL || 'undefined'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">NEXT_PUBLIC_ENABLE_CACHE:</span>
            <span className="ml-2 font-mono bg-gray-100 px-1 rounded">
              {status.environment.NEXT_PUBLIC_ENABLE_CACHE || 'undefined'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">NEXT_PUBLIC_CACHE_TTL:</span>
            <span className="ml-2 font-mono bg-gray-100 px-1 rounded">
              {status.environment.NEXT_PUBLIC_CACHE_TTL || 'undefined'}
            </span>
          </div>
        </div>
      </div>

      {/* API端点 */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">API端点:</div>
        <div className="text-xs space-y-1">
          <div>
            <span className="text-gray-600">代理:</span>
            <span className="ml-2 font-mono bg-blue-100 px-1 rounded">
              {status.proxy.endpoint}
            </span>
          </div>
          <div>
            <span className="text-gray-600">健康检查:</span>
            <span className="ml-2 font-mono bg-green-100 px-1 rounded">
              {status.proxy.healthEndpoint}
            </span>
          </div>
          <div>
            <span className="text-gray-600">状态检查:</span>
            <span className="ml-2 font-mono bg-purple-100 px-1 rounded">
              /api/proxy/status
            </span>
          </div>
          <div>
            <span className="text-gray-600">缓存管理:</span>
            <span className="ml-2 font-mono bg-orange-100 px-1 rounded">
              {status.proxy.cacheEndpoint}
            </span>
          </div>
        </div>
      </div>

      {/* 时间戳 */}
      <div className="text-xs text-gray-400">
        最后更新: {new Date(status.timestamp).toLocaleString()}
      </div>
    </div>
  )
} 