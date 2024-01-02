import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { MegaMenuItem, MenuItem } from 'primeng/api';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() title?: string;
  @Input() showDataEntryButton: boolean = false;
  @Input() sendEmailButton: boolean = false;
  @Input() targetRoute?: string;
  @Input() showBackBtn: boolean = false;
  @Input() items: MenuItem[] = [];
  @Input() breadcrumbItems: MenuItem[] = [];
  navbarVisible: boolean = true;
  sidebarVisible: boolean = false;
  // @Input() viewPolicy: boolean = true;
  @Input() note: boolean = false;
  home!: MenuItem;
  title2?: string;
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute
  ) {
    // Subscribe to the NavigationEnd event to ensure the navigation has completed
  }
  ngOnInit(): void {
    this.showBackonChildComponents();
    this.home = { icon: 'pi pi-home', routerLink: '/profiles-main' };
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  showBackonChildComponents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showBackBtn = this.activatedRoute.snapshot.data['showBackButton'];
        // Get the first child route
        const firstChild = this.activatedRoute.firstChild;
        // Check if there is a first child and it has data
        if (firstChild && firstChild.snapshot.data) {
          // Access the data property of the first child route
          this.showBackBtn = firstChild.snapshot.data['showBackButton'];
          // console.log(this.showBackBtn);
        }
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/profiles-main']);
  }

  back(): void {
    this.location.back();
  }
  onMenuClick(item: MenuItem) {
    this.items.push(item);
    // update breadcrumb based on the item clicked
  }
  // back(): void {
  //   if (this.targetRoute) {
  //     this.router.navigate([this.targetRoute]);
  //   } else {
  //     this.router.navigate(['/']); // Fallback to the root route if no target route is specified.
  //   }
  // }
}
