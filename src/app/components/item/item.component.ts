import { Component, OnInit } from '@angular/core';
import { BgmService } from '../../services/bgm.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit{
  item: any;

  constructor(private bgmService: BgmService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bgmService.getSubject(id).subscribe(data => {
        this.item = data;
        // console.log(this.item);
      });
    }
  }

  // 辅助方法，用于判断是否为数组
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  // 辅助方法，用于获取官方网站链接
  getOfficialWebsite(): string | null {
    if (!this.item || !this.item.infobox) return null;
    const website = this.item.infobox.find((info: any) => info.key === '官方网站');
    return website ? website.value : null;
  }
}
