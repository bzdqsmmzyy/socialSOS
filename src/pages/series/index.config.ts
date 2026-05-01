export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '微剧系列' })
  : { navigationBarTitleText: '微剧系列' }
