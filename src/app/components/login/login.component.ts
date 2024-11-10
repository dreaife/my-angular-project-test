import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../serivces/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authMode: 'login' | 'register' | 'forgotPassword' | 'confirmSignUp' | 'resetPassword' = 'login';
  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  showNewPasswordModal: boolean = false;
  newPassword: string = '';
  cognitoUser: any;
  code: string = '';
  constructor(private authService: AuthService) {}

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

  onNewPasswordSubmit() {
    if (this.newPassword) {
      this.authService.completeNewPassword(this.cognitoUser, this.newPassword).then(session => {
        // 密码更新成功
        this.message = '密码已更新，请重新登录。';
        this.showNewPasswordModal = false;
      }).catch(err => {
        this.message = `密码更新失败：${err}`;
      });
    }
  }
}
