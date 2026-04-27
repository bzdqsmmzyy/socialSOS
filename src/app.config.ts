export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/quiz-list/index',
    'pages/profile/index',
    'pages/quiz/index',
    'pages/result/index',
    'pages/category-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '社交急救包',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#8e8e93',
    selectedColor: '#FF6B6B',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/house.png',
        selectedIconPath: './assets/tabbar/house-active.png'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: './assets/tabbar/layout-grid.png',
        selectedIconPath: './assets/tabbar/layout-grid-active.png'
      },
      {
        pagePath: 'pages/quiz-list/index',
        text: '题库',
        iconPath: './assets/tabbar/book-open.png',
        selectedIconPath: './assets/tabbar/book-open-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
