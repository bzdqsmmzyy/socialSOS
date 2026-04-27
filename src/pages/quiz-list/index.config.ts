export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '全部题库', navigationStyle: 'custom' })
  : { navigationBarTitleText: '全部题库', navigationStyle: 'custom' }
