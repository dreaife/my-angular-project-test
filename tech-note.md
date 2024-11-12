# 项目介绍

本项目为本人angular练习练手项目，是基于 Angular 的 Web 应用，用于展示和搜索 Bangumi 上的动画，使用 API 来自 [Bangumi API](https://bangumi.github.io/api/)。

本项目使用 [GitHub Actions](https://github.com/features/actions) 自动部署到 [GitHub Pages](https://dreaife.github.io/my-angular-project-test/)。

## 项目名称

my-angular-project-test

地址：[https://dreaife.github.io/my-angular-project-test/](https://dreaife.github.io/my-angular-project-test/)

## 项目目的

- 部署一个基于 Angular 的静态网站
- 练习 GitHub Actions 自动部署
- 调用API实现功能
- 使用Cognito进行用户认证
- 使用拦截器处理请求
- 使用守卫保护页面

## 项目技术栈

- Angular 16
- TypeScript
- HTML
- CSS
- GitHub Actions
- Cognito

# 环境准备

## 环境要求

- Node.js 版本 20 或更高
- Angular CLI

## 安装步骤

1. 安装 Node.js

    ```bash
    https://nodejs.org/en/download/
    ```

2. 安装 Angular CLI

    ```bash
    npm install -g @angular/cli
    ```

3. 安装项目

    ```bash
    git clone https://github.com/dreaife/my-angular-project-test.git
    cd my-angular-project-test
    npm install
    ```

# 项目结构

## 目录结构

本项目使用Angular CLI 创建，结构如下：

```text
my-angular-project-test/
├── src/
│   ├── app/
│   │   ├── environment/
│   │   │   ├── environment.ts
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── home/
│   │   │   ├── search/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── bgm.service.ts
│   │   ├── app.component.ts
│   ├── index.html
│   ├── main.ts
├── ...
```

其中：
-  `src/app` 
    目录为项目的主要目录，包含所有组件、服务、拦截器、守卫等。
-  `src/environments` 
    目录为环境配置文件，包含开发环境和生产环境配置。
-  `src/components` 
    目录为项目的主要组件，包含所有页面组件。
    -  `login` 组件为登录页面，调用cognito的sdk进行登录；
    -  `home` 组件为动画日历页面，通过调用`bgm.service.getCalendar`获取数据并展示；
    -  `search` 组件为搜索页面，通过调用`bgm.service.search`获取数据并展示。
-  `src/guards` 
    目录为项目的主要守卫，包含 `auth.guard.ts` 守卫，用于保护需要登录的页面, 如果未登录则重定向到登录页面。
-  `src/interceptors` 
    目录为项目的主要拦截器，包含 `auth.interceptor.ts` 拦截器，用于在请求中添加认证信息。
-  `src/services` 
    目录为项目的主要服务，包含 `auth.service.ts` 服务，用于处理登录、登出等操作；`bgm.service.ts` 服务，用于调用 Bangumi API。
-  `src/main.ts` 
    为项目的主入口文件，用于启动 Angular 应用。

# 关键功能实现

## 使用Cognito进行用户认证

在 `src/app/services/auth.service.ts` 中，使用Cognito的sdk进行用户认证。

在使用cognito之前，需要现在AWS Cognito中创建用户池，自定义Cognito验证域名，并创建应用客户端，获取客户端ID。

用获取到的ID在 `src/app/environment/environment.ts` 中，配置Cognito的配置信息。

### 登录

通过cognitoUser.authenticateUser方法进行登录，成功后将idToken或accessToken存储到sessionStorage中。

tips：

对于未验证的用户，需要先重写新密码。此时需要重写newPasswordRequired方法，通过设置resolve({ newPasswordRequired: true, cognitoUser })，在登录页面中切换展示内容，提示用户进行新密码设置。

代码实现：

```typescript
signIn(username: string, password: string): Promise<any> {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    const userData = {
      Username: username,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          // 获取 Tokens
          const idToken = result.getIdToken().getJwtToken();
          const accessToken = result.getAccessToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();

          // console.log('idToken', idToken);
          // console.log('accessToken', accessToken);
          // console.log('refreshToken', refreshToken); 
          
          // 将 idToken 或 accessToken 存储到 sessionStorage 作为 userToken
          sessionStorage.setItem('userToken', accessToken);

          // 保存 Tokens 或在需要的地方使用
          resolve({ idToken, accessToken, refreshToken });

          // 登录成功后重定向到主页
          this.router.navigate(['/']);
        },
        onFailure: (err) => {
          reject(err.message || JSON.stringify(err));
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // 触发新密码需求，提示前端进行新密码设置
          resolve({ newPasswordRequired: true, cognitoUser });
        }
      });
    });
  }
```

用户设置新密码时，调用completeNewPassword方法，通过cognitoUser.completeNewPasswordChallenge方法设置新密码。

```typescript
  // 设置新密码方法
  completeNewPassword(cognitoUser: CognitoUser, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (session) => resolve(session),
        onFailure: (err) => reject(err.message || JSON.stringify(err))
      });
    });
  }
```

### 注册

通过cognitoUser.signUp方法进行注册，成功后将用户名和密码存储到cognito中。将页面重定向到登录页面。

```typescript
  // 注册方法
  signUp(username: string, password: string, email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const attributeList : CognitoUserAttribute[] = [];
      attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: email }));

      this.userPool.signUp(username, password, attributeList, [], (err, result) => {
        if (err) {
          reject(err.message || JSON.stringify(err));
        } else {
          resolve(result?.user);
        }
      });
    });
  }
```

### 登出

通过cognitoUser.signOut方法进行登出，登出后删除sessionStorage中的userToken。

```typescript
  logout() {
    // 登出
    this.userPool.getCurrentUser()?.signOut();
    sessionStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }
```

## 登录页面

登录页面为 `src/app/components/login/login.component.ts`，使用cognito的sdk进行登录，成功后将idToken或accessToken存储到sessionStorage中。

页面通过authMode控制页面显示内容，authMode有以下几种：

- login：登录页面
- register：注册页面
- forgotPassword：忘记密码页面
- confirmSignUp：验证页面
- resetPassword：重置密码页面

当点击相应按钮时，调用authService的switchMode方法切换authMode，从而切换页面显示内容。

页面实现：

```typescript
switchMode(mode: 'login' | 'register' | 'forgotPassword' | 'confirmSignUp' | 'resetPassword') {
    this.authMode = mode;
    this.message = '';
}

  onSubmit() {
    if (this.authMode === 'login') {
      this.authService.signIn(this.username, this.password).then(
        (resp) => {
          if (resp.newPasswordRequired) {
            // 初次登录需要重置密码，显示浮窗
            this.showNewPasswordModal = true;
            this.cognitoUser = resp.cognitoUser;
          } else {
            // 登录成功
            this.message = '登录成功！';
          }
        }).catch(err => {
          this.message = `登录失败：${err}`;
        });
    } else if (this.authMode === 'register') {
      this.authService.signUp(this.username, this.password, this.email).then(
        () => {
          this.message = '注册成功！请检查邮箱并输入验证码。';
          this.authMode = 'confirmSignUp';
        },
        (err) => (this.message = `注册失败：${err}`)
      );
    } else if (this.authMode === 'forgotPassword') {
      this.authService.forgotPassword(this.username).then(
        () => {
          this.message = '验证码已发送，请检查邮箱并输入验证码和新密码。';
          this.authMode = 'resetPassword';
        },
        (err) => (this.message = `发送验证码失败：${err}`)
      );
    } else if (this.authMode === 'confirmSignUp') {
      this.authService.confirmSignUp(this.username, this.code).then(
        () => (this.message = '验证成功！请登录。'),
        (err) => (this.message = `验证失败：${err}`)
      );
    } else if (this.authMode === 'resetPassword') {
      this.authService.confirmPassword(this.username, this.code, this.newPassword).then(
        () => {
          this.message = '密码重置成功！请使用新密码登录。';
          this.authMode = 'login'; // 切换回登录页面
        },
        (err) => (this.message = `密码更新失败：${err}`)
      );
    }
  }
```

## 动画日历页面

动画日历页面为 `src/app/components/home/home.component.ts`，通过调用`bgm.service.getCalendar`获取数据并展示。

当页面初始化时，调用`ngOnInit`方法，获取数据并展示。

```typescript
  ngOnInit() : void {
    // this.bgmService.getCalendar().subscribe(data => console.log(data));
    // this.bgmService.getSubject('482850').subscribe(data => console.log(data));
    this.bgmService.getCalendar().subscribe((data:any[]) => {
      this.weeklyData = Array(7).fill(null).map((_, index) => ({
        day: this.daysOfWeek[index],
        items: data
          .find((d: any) => d.weekday.id === index + 1)
          ?.items.filter((item: any) => item.collection?.doing >= 100) || []
      }));
    });
  }

  navigateToItem(id: string) {
    this.router.navigate(['/items', id]);
  }

   // 显示浮窗并加载数据
   openModal(itemId: string): void {
    this.bgmService.getSubject(itemId).subscribe((data) => {
      this.selectedItem = data;
      this.showModal = true;
    });
  }
  // 关闭浮窗
  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
  }

  // 辅助方法：查找 infobox 中的官方网站 URL
  getOfficialWebsite(): string | null {
    if (!this.selectedItem || !this.selectedItem.infobox) return null;
    const website = this.selectedItem.infobox.find((info: any) => info.key === '官方网站');
    return website ? website.value : null;
  }
```

## 搜索页面

搜索页面为 `src/app/components/search/search.component.ts`，通过调用`bgm.service.search`获取数据并展示。

页面通过title接收搜索关键词，通过options控制页面显示内容，options有以下几种：

- limit：每页显示条数
- type：类型
- meta_tags：元标签
- tag：标签
- air_date：放送日期
- rating：评分
- rank：排名
- nsfw：是否包含成人内容
- page：页码

向API发送请求时，将title和options重构后发送。请求重构如下：

```typescript
// 搜索方法
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.errorMessage = '';

      // 配置搜索选项
      const options = {
        limit: this.limit,
        type: this.type,
        meta_tags: this.meta_tags,
        tag: this.tag,
        air_date: this.air_date,
        rating: this.rating,
        rank: this.rank,
        nsfw: this.nsfw,
        page: this.page
      };

      this.bgmService.searchSubject(this.searchQuery, options).subscribe(
        (response: any) => {
          this.searchResults = response.data; // 提取 data 数组
          this.totalResults = response.total; // 提取总数
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = '搜索失败，请重试。';
          this.isLoading = false;
        }
      );
    }
  }
```

## 拦截器添加认证信息

在 `src/app/interceptors/auth.interceptor.ts` 中，通过拦截器在请求中添加认证信息。

拦截器实现：

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = environment.bgm.authToken;

  if (req.url.startsWith('https://api.bgm.tv/v0')) { # 如果请求地址以https://api.bgm.tv/v0开头，则添加认证信息
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`, # 添加认证信息
      }
    });
    return next(authReq);
  }
  return next(req);
};
```

在使用拦截器时，需要在 app.config.ts 中配置拦截器。

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

## 守卫保护页面

在 `src/app/guards/auth.guard.ts` 中，通过守卫保护需要登录的页面，如果未登录则重定向到登录页面。

守卫实现：

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // 没有登录，重定向到 /login
    router.navigate(['/login']);
    return false;
  }
};
```

在使用守卫时，需要在路由配置中使用守卫。

```typescript
{ path: '', component: HomeComponent, canActivate: [authGuard] }, # 主页需要登录
```

# 项目启动

1. 启动项目

    ```bash
    ng serve
    ```

2. 访问地址
   
   访问地址：[http://localhost:4200/](http://localhost:4200/)

# 项目部署

- 本地构建项目

    ```bash
    ng build
    ```

- 自动化部署

    本项目使用 GitHub Actions 自动部署到 GitHub Pages，每次 push 代码到 GitHub 后，GitHub Actions 会检测到 push 事件并自动构建项目并部署到 GitHub Pages。

    编写配置文件`.github/workflows/main.yml`，用于配置 GitHub Actions 自动部署项目。

    内容如下：

    ```yaml
    # GitHub Actions 工作流，用于将项目部署到 GitHub Pages
    name: Deploy to GitHub Pages

    # 触发条件：当推送到 master 分支时触发
    on:
    push:
        branches:
        - master  # 或者你要监控的分支名称

    jobs:
    build-and-deploy:
        # 使用最新的 Ubuntu 作为运行环境
        runs-on: ubuntu-latest
        steps:
        # 第一步：检出代码
        - name: Checkout code
            uses: actions/checkout@v3

        # 第二步：设置 Node.js 环境
        - name: Setup Node.js
            uses: actions/setup-node@v3
            with:
            node-version: '20'  # 请根据项目需求修改 Node.js 版本

        # 第三步：安装项目依赖
        - name: Install dependencies
            run: npm install

        # 第四步：生成环境配置文件 environment.ts
        - name: Generate environment.ts
            run: |
            # 创建 src/app/environment 目录（如果不存在）
            mkdir -p src/app/environment
            
            # 生成 environment.ts 文件，包含 Cognito 和 Bangumi API 的配置信息
            echo "export const environment = {
                production: true,
                cognito: {
                    userPoolId: '$COGNITO_USER_POOL_ID',
                    clientId: '$COGNITO_CLIENT_ID',
                    domain: '$COGNITO_DOMAIN'
                },
                bgm: {
                url: 'https://api.bgm.tv/v0',
                authToken: '$BGM_AUTH_TOKEN',
                userAgent: 'dreaife/my-angular-project-test'
                }
            };" > src/app/environment/environment.ts # 生成环境配置文件

            # 列出生成的文件以确认
            ls src/app/environment

        # 第五步：构建项目
        - name: Build project
            run: npm run build -- --configuration production --base-href "/my-angular-project-test/" # 构建项目

        # 第六步：部署到 GitHub Pages
        - name: Deploy to GitHub Pages
            uses: JamesIves/github-pages-deploy-action@v4
            with:
            # browser 为构建输出的文件夹，内部文件包含 index.html
            folder: dist/my-angular-project/browser  # 请根据实际输出路径填写
            token: ${{ secrets.TOKEN }}

    # 环境变量配置，使用 GitHub Secrets 存储敏感信息
    env:
        COGNITO_USER_POOL_ID: ${{ secrets.COGNITO_USER_POOL_ID }}
        COGNITO_CLIENT_ID: ${{ secrets.COGNITO_CLIENT_ID }}
        COGNITO_DOMAIN: ${{ secrets.COGNITO_DOMAIN }}
        BGM_AUTH_TOKEN: ${{ secrets.BGM_AUTH_TOKEN }}
        GITHUB_TOKEN: ${{ secrets.TOKEN }}
    ```

# 许可证

本项目使用 MIT 许可证，详情请参阅 LICENSE 文件。

# 联系方式

如有问题或建议，请发送邮件至 [nghqs877261793@gmail.com](mailto:nghqs877261793@gmail.com)。
