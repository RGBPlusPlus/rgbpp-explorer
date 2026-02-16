import { ProxyStatus } from '@/components/proxy-status'

export default function ProxyDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">代理系统演示</h1>
        
        <div className="grid gap-6">
          {/* 代理状态 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">代理状态</h2>
            <ProxyStatus />
          </div>

          {/* 使用说明 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">使用说明</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-blue-800">环境变量配置</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-white p-3 rounded border">
                    <code className="text-blue-600">
                      NEXT_PUBLIC_ENABLE_PROXY=true
                    </code>
                    <p className="text-gray-600 mt-1">启用代理模式</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <code className="text-blue-600">
                      NEXT_PUBLIC_ENABLE_PROXY=false
                    </code>
                    <p className="text-gray-600 mt-1">禁用代理，直接访问目标服务器</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-blue-800">API端点</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-white p-3 rounded border">
                    <code className="text-blue-600">/api/proxy/status</code>
                    <p className="text-gray-600 mt-1">查看代理状态和配置</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <code className="text-blue-600">/api/proxy/health</code>
                    <p className="text-gray-600 mt-1">健康检查</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <code className="text-blue-600">/api/proxy/test</code>
                    <p className="text-gray-600 mt-1">测试代理功能</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-blue-800">tRPC请求</h3>
                <div className="mt-2">
                  <div className="bg-white p-3 rounded border">
                    <code className="text-blue-600">/api/proxy/rgbpp.marketCap</code>
                    <p className="text-gray-600 mt-1">代理tRPC请求示例</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 测试链接 */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">快速测试</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/api/proxy/status" 
                target="_blank"
                className="block p-4 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">状态检查</div>
                <div className="text-sm text-gray-600">查看详细配置</div>
              </a>
              
              <a 
                href="/api/proxy/health" 
                target="_blank"
                className="block p-4 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">健康检查</div>
                <div className="text-sm text-gray-600">测试连接状态</div>
              </a>
              
              <a 
                href="/api/proxy/test" 
                target="_blank"
                className="block p-4 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">功能测试</div>
                <div className="text-sm text-gray-600">完整系统测试</div>
              </a>
              
              <a 
                href="/api/proxy/rgbpp.marketCap" 
                target="_blank"
                className="block p-4 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">tRPC测试</div>
                <div className="text-sm text-gray-600">代理请求示例</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 