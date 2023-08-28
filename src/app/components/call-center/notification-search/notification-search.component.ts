import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { DicoServiceService } from 'src/app/services/dico-service.service';
interface NotificationType {
  code: string;
  description: string;
}
@Component({
  selector: 'app-notification-search',
  templateUrl: './notification-search.component.html',
  styleUrls: ['./notification-search.component.css'],
})
export class NotificationSearchComponent {
  constructor(
    private router: Router,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {}
}
