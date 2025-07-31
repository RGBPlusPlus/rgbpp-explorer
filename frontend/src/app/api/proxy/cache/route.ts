import { NextRequest, NextResponse } from 'next/server'

// 简单的内存缓存（与代理路由共享）
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// 检查缓存是否有效
const isCacheValid = (cacheEntry: { data: any; timestamp: number; ttl: number }) => {
  const now = Date.now()
  return (now - cacheEntry.timestamp) < (cacheEntry.ttl * 1000)
}

// 清理过期缓存
const cleanupExpiredCache = () => {
  const now = Date.now()
  let cleanedCount = 0
  for (const [key, entry] of cache.entries()) {
    if (!isCacheValid(entry)) {
      cache.delete(key)
      cleanedCount += 1
    }
  }
  return cleanedCount
}

// 获取缓存统计信息
const getCacheStats = () => {
  cleanupExpiredCache()
  
  const totalEntries = cache.size
  let validEntries = 0
  let totalSize = 0
  
  for (const [key, entry] of cache.entries()) {
    if (isCacheValid(entry)) {
      validEntries += 1
      totalSize += JSON.stringify(entry.data).length
    }
  }
  
  return {
    totalEntries,
    validEntries,
    expiredEntries: totalEntries - validEntries,
    totalSizeBytes: totalSize,
    totalSizeKB: Math.round(totalSize / 1024 * 100) / 100
  }
}

export async function GET() {
  try {
    const stats = getCacheStats()
    const cacheEntries = Array.from(cache.entries()).map(([key, entry]) => ({
      key,
      timestamp: entry.timestamp,
      ttl: entry.ttl,
      isValid: isCacheValid(entry),
      age: Math.round((Date.now() - entry.timestamp) / 1000),
      size: JSON.stringify(entry.data).length
    }))
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      stats,
      entries: cacheEntries.slice(0, 50), // 只返回前50个条目
      totalEntries: cacheEntries.length
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const beforeCount = cache.size
    cache.clear()
    const afterCount = cache.size
    
    return NextResponse.json({
      status: 'success',
      message: 'Cache cleared successfully',
      clearedEntries: beforeCount - afterCount,
      remainingEntries: afterCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    switch (action) {
      case 'cleanup':
        const cleanedCount = cleanupExpiredCache()
        return NextResponse.json({
          status: 'success',
          message: 'Expired cache entries cleaned up',
          cleanedEntries: cleanedCount,
          remainingEntries: cache.size,
          timestamp: new Date().toISOString()
        })
        
      case 'stats':
        const stats = getCacheStats()
        return NextResponse.json({
          status: 'success',
          stats,
          timestamp: new Date().toISOString()
        })
        
      default:
        return NextResponse.json({
          status: 'error',
          error: 'Invalid action. Use "cleanup" or "stats"'
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 