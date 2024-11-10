export const environment = {
    production: false,
    cognito: {
      userPoolId: 'ap-northeast-1_aKEXP7GNF',
      clientId: '31ugkii9cs8njgid5af01mias5',
      domain: 'https://bgm-angular-login.auth.ap-northeast-1.amazoncognito.com',
      redirectUri: 'http://localhost:4200/' // 开发时的回调 URL
    },
    bgm: {
      url: 'https://api.bgm.tv/v0',
      authToken: 'JgN7ng77MhFIPP1kCsTPMaql179ZNEVDIQtDKmOA',
      userAgent: 'dreaife/my-angular-project-test'
    }
  };
  