export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '分类详情', navigationStyle: 'custom' })
  : { navigationBarTitleText: '分类详情', navigationStyle: 'custom' }
