import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AnimeComponent } from './components/anime/anime.component';
import { authGuard } from './guards/auth.guard';
import { ItemComponent } from './components/item/item.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'anime', component: AnimeComponent },
    { path: 'items/:id', component: ItemComponent },
    { path: 'search', component: SearchComponent },
    { path: '**', redirectTo: '' } // 重定向到主页
];
