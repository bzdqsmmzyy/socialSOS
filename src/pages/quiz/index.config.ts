export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '社恐测评' })
  : { navigationBarTitleText: '社恐测评' }
