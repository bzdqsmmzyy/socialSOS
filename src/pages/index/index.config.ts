export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '社交急救包', navigationStyle: 'custom' })
  : { navigationBarTitleText: '社交急救包', navigationStyle: 'custom' }
