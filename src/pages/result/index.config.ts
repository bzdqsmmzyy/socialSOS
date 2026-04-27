export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '答案解析', navigationStyle: 'custom' })
  : { navigationBarTitleText: '答案解析', navigationStyle: 'custom' }
