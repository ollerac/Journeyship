$.reject({
  reject: {
    all: false,
    msie5: true,
    msie6: true,
    msie7: true,
    msie8: true
  },
  display: ['chrome', 'firefox', 'safari', 'msie'],
  header: 'Did you know that your Internet Browser is out of date?',
  paragraph1: 'Your browser is out of date and is not compatible with '+
        'our website. A list of the most popular web browsers can be '+
        'found below.',
  paragraph2: 'Just click one of the icons to go to their download page.',
  close: false,
  browserInfo: {
    firefox: {
      text: 'Firefox 23'
    },
    chrome: {
      text: 'Chrome 29'
    },
    msie: {
      text: 'Internet Explorer 9 & 10'
    },
    safari: {
      text: 'Safari 6'
    }
  }
});