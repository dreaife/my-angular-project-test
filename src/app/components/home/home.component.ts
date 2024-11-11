import { Component, OnInit } from '@angular/core';
import { BgmService } from '../../services/bgm.service';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  weeklyData: any[] = [];
  daysOfWeek: string[] = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  currentDate: Date = new Date();
  currentWeekday: number = this.currentDate.getDay() ? this.currentDate.getDay() : 7;
  selectedItem: any = null; // 存储选中的项数据
  showModal: boolean = false; // 控制浮窗显示

  constructor(private bgmService: BgmService,private router: Router) { }

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
}
