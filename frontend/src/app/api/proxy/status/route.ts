import {  NextResponse } from 'next/server'

// 获取目标API URL
const getTargetUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_TRPC_API_URL || 'https://web3-api.magickbase.com/api/trpc'
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

// 检查是否启用代理
const isProxyEnabled = () => {
  const proxyEnabled = process.env.NEXT_PUBLIC_ENABLE_PROXY
  return proxyEnabled === 'true' || proxyEnabled === '1'
}

// 检查是否启用缓存
const isCacheEnabled = () => {
  const cacheEnabled = process.env.NEXT_PUBLIC_ENABLE_CACHE
  return cacheEnabled === 'true' || cacheEnabled === '1'
}

// 获取缓存TTL（秒）
const getCacheTTL = () => {
  const ttl = process.env.NEXT_PUBLIC_CACHE_TTL
  return ttl ? parseInt(ttl) : 300 // 默认5分钟
}

export async function GET() {
  try {
    const targetUrl = getTargetUrl()
    const proxyEnabled = isProxyEnabled()
    
    // 获取当前环境变量
    const envVars = {
      NEXT_PUBLIC_ENABLE_PROXY: process.env.NEXT_PUBLIC_ENABLE_PROXY,
      NEXT_PUBLIC_TRPC_API_URL: process.env.NEXT_PUBLIC_TRPC_API_URL,
      NEXT_PUBLIC_ENABLE_CACHE: process.env.NEXT_PUBLIC_ENABLE_CACHE,
      NEXT_PUBLIC_CACHE_TTL: process.env.NEXT_PUBLIC_CACHE_TTL,
    }
    
    // 测试目标服务器连接
    let targetStatus = 'unknown'
    let targetResponse = null
    
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(3000), // 3秒超时
      })
      
      targetStatus = response.ok ? 'reachable' : 'unreachable'
      targetResponse = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      }
    } catch (error) {
      targetStatus = 'error'
      targetResponse = {
        error: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error && 'code' in error ? error.code : undefined
      }
    }
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      proxy: {
        enabled: proxyEnabled,
        endpoint: '/api/proxy',
        healthEndpoint: '/api/proxy/health',
        testEndpoint: '/api/proxy/test',
        cacheEndpoint: '/api/proxy/cache'
      },
      cache: {
        enabled: isCacheEnabled(),
        ttl: getCacheTTL(),
        endpoint: '/api/proxy/cache'
      },
      target: {
        url: targetUrl,
        status: targetStatus,
        response: targetResponse
      },
      environment: envVars,
      configuration: {
        currentMode: proxyEnabled ? 'proxy' : 'direct',
        description: proxyEnabled 
          ? 'Requests will be proxied through /api/proxy'
          : 'Requests will go directly to target URL',
        cacheMode: isCacheEnabled() ? 'enabled' : 'disabled',
        cacheDescription: isCacheEnabled() 
          ? `Cache enabled with ${getCacheTTL()}s TTL`
          : 'Cache disabled'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      proxy: {
        enabled: isProxyEnabled(),
        endpoint: '/api/proxy'
      },
      target: {
        url: getTargetUrl()
      }
    }, { status: 500 })
  }
} 