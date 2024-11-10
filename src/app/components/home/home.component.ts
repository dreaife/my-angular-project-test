import { Component, OnInit } from '@angular/core';
import { BgmService } from '../../services/bgm.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  weeklyData: any[] = [];
  daysOfWeek: string[] = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  constructor(private bgmService: BgmService) { }

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
}
