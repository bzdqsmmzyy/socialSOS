export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '场景分类', navigationStyle: 'custom' })
  : { navigationBarTitleText: '场景分类', navigationStyle: 'custom' }
