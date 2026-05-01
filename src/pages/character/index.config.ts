export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '选择角色', navigationStyle: 'custom' })
  : { navigationBarTitleText: '选择角色', navigationStyle: 'custom' }
