export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '答题', navigationStyle: 'custom' })
  : { navigationBarTitleText: '答题', navigationStyle: 'custom' }
