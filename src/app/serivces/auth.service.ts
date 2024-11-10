import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(private router: Router) { 
    this.userPool = new CognitoUserPool({
      UserPoolId: environment.cognito.userPoolId,
      ClientId: environment.cognito.clientId
    });
  }

  // 登录方法
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

  forgotPassword(username: string): Promise<any> {
    const userData = { Username: username, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: () => resolve(true),
        onFailure: (err) => reject(err.message || JSON.stringify(err))
      });
    });
  }

  // 设置新密码方法
  completeNewPassword(cognitoUser: CognitoUser, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (session) => resolve(session),
        onFailure: (err) => reject(err.message || JSON.stringify(err))
      });
    });
  }

  confirmSignUp(username: string, code: string): Promise<any> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err.message || JSON.stringify(err));
        } else {
          resolve(result);
        }
      });
    });
  }

  // 重置密码，使用验证码和新密码
  confirmPassword(username: string, code: string, newPassword: string): Promise<any> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => resolve(true),
        onFailure: (err) => reject(err.message || JSON.stringify(err))
      });
    });
  }

  isLoggedIn(): boolean {
    const userToken = sessionStorage.getItem('userToken');
    return !!userToken;
  }

  logout() {
    sessionStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }
}
