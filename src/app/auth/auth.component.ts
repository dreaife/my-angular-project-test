import { Component } from '@angular/core';
import { signUp,signIn,SignUpOutput } from 'aws-amplify/auth';
import { FormsModule } from '@angular/forms';
import { AmplifyAuthenticatorModule,AuthenticatorService } from '@aws-amplify/ui-angular';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule,AmplifyAuthenticatorModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  password: string = '';
  email: string = '';
  mode: 'login' | 'register' = 'login'; // 控制登录或注册模式
  message: string = '';

  constructor(private authenticatorService: AuthenticatorService) {}

  // 注册用户
  async signUp() {
    try {
      const result: SignUpOutput = await signUp({
        username: this.email,
        password: this.password,
      });
      this.message = '注册成功！请登录。';
      this.mode = 'login';
    } catch (error : any) {
      this.message = `注册失败: ${error.message}`;
    }
  }

  // 登录用户
  async signIn() {
    try {
      const user = await signIn({username: this.email, password: this.password});
      this.message = `登录成功！欢迎, ${user.nextStep.signInStep}`;
    } catch (error : any) {
      this.message = `登录失败: ${error.message}`;
    }
  }

  // 切换模式
  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.message = '';
  }
}
