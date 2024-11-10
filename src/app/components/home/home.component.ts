import { Component } from '@angular/core';
import { BgmService } from '../../services/bgm.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private bgmService: BgmService) { }

  ngOnInit() {
    this.bgmService.getCalendar().subscribe(data => console.log(data));
    // this.bgmService.getSubject('398557').subscribe(data => console.log(data));
  }
}
