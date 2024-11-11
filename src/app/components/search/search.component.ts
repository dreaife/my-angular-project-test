import { Component } from '@angular/core';
import { BgmService } from '../../services/bgm.service';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchQuery: string = 'island'; // 搜索关键词
  searchResults: any[] = []; // 存储搜索结果
  totalResults: number = 0; // 搜索结果总数
  isLoading: boolean = false; // 搜索加载状态
  errorMessage: string = ''; // 错误信息

  // 可选参数设置
  limit: number = 10;
  type: string = '';
  meta_tags: string = '';
  tag: string = '';
  air_date: string = '';
  rating: number | null = null;
  rank: number | null = null;
  nsfw: boolean | null = null;
  page: number = 1;

  constructor(private bgmService: BgmService, private router: Router) {}

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

  // 切换到上一页
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.onSearch();
    }
  }

  // 切换到下一页
  nextPage(): void {
    const totalPages = Math.ceil(this.totalResults / this.limit);
    if (this.page < totalPages) {
      this.page++;
      this.onSearch();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalResults / this.limit);
  }

  // 跳转到项目详情页
  navigateToItem(itemId: string): void {
    this.router.navigate(['/items', itemId]);
  }
}
