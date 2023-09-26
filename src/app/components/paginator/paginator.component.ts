import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalPages!: number;
  @Input() pageSizeOptions: number[] = [10, 50, 100];

  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
