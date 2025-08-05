import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default function NotFound() {
  const headersList = headers()
  
  // 获取Accept-Language头
  const acceptLanguage = headersList.get('accept-language') || ''
  
  // 检测用户首选语言
  let defaultLang = 'en'
  
  if (acceptLanguage.includes('zh') || acceptLanguage.includes('zh-CN') || acceptLanguage.includes('zh-TW')) {
    defaultLang = 'zh'
  }
  
  // 重定向到默认语言路径
  redirect(`/${defaultLang}`)
}

// 确保页面是动态的
export const dynamic = 'force-dynamic' 