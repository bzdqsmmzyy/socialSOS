export default defineAppConfig({
  pages: [
    'pages/character/index',
    'pages/index/index',
    'pages/quiz/index',
    'pages/series/index',
    'pages/settings/index',
    'pages/favorites/index',
    'pages/cheatsheets/index',
    'pages/profile/index'
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
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
