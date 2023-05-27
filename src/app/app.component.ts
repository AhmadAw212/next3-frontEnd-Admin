import { Component } from '@angular/core';
import { LoadingServiceService } from './services/loading-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tutorial';
  imgUrl = 'https://picsum.photos/id/237/200/300';
  isLoading: boolean = false;
  constructor(private loadingService: LoadingServiceService) {
    this.loadingService.loading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
  changeImage(e: KeyboardEvent) {
    this.imgUrl = (e.target as HTMLInputElement).value;
  }

  logImg(event: string) {
    console.log(event);
  }
}
