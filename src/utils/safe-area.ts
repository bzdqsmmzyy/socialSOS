import Taro from '@tarojs/taro'

/** 获取状态栏高度（px），兼容 H5 和小程序 */
export function getStatusBarHeight(): number {
  try {
    const systemInfo = Taro.getSystemInfoSync()
    return systemInfo.statusBarHeight || 0
  } catch {
    return 0
  }
}

/** 获取 Header 顶部 padding（statusBarHeight + 自定义间距） */
export function getHeaderPaddingTop(extra: number = 20): number {
  return getStatusBarHeight() + extra
}
