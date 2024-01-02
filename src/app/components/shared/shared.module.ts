import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaugeComponentComponent } from './gauge-component/gauge-component.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginNavComponent } from '../login-nav/login-nav.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SendEmailComponent } from '../send-email/send-email.component';
import { SendEmailButtonComponent } from '../send-email-button/send-email-button.component';
import { NgxEditorModule } from 'ngx-editor';
import { ProfilesNavComponent } from '../common-components/profiles-nav/profiles-nav.component';
import { ViewNotesComponent } from '../view-notes/view-notes.component';
import { DataEntryButtonComponent } from '../data-entry-button/data-entry-button.component';
import { DataEntryComponent } from '../data-mgmt/data-entry/data-entry.component';
import { ViewNoteDialogComponent } from '../view-notes/view-note-dialog/view-note-dialog.component';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompaniesDropdownComponent } from '../companies-dropdown/companies-dropdown.component';
import { NgChartsModule } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import {
  NgxMatNativeDateModule,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { CompanySelectComponent } from '../company-select/company-select.component';
import { GoogleMapComponent } from '../call-center/google-map/google-map.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { BackButtonComponent } from '../back-button/back-button.component';
import { CreateNoDataDialogComponent } from '../call-center/new-hotline/create-no-data-dialog/create-no-data-dialog.component';
import { ChangePassDialogComponent } from '../administrator/change-pass-dialog/change-pass-dialog.component';
import { ViewPolicyComponent } from '../view-policy/view-policy.component';
import { ViewPolicyDialogComponent } from '../view-policy/view-policy-dialog/view-policy-dialog.component';
// import { GaugeComponentComponent } from './gauge-component/gauge-component.component';
// import { GaugeComponentComponent } from './gauge-component/gauge-component.component';
import { ButtonModule } from 'primeng/button';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  InputGroupAddon,
  InputGroupAddonModule,
} from 'primeng/inputgroupaddon';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    GaugeComponentComponent,
    PaginatorComponent,
    LoginNavComponent,
    SideMenuComponent,
    NavbarComponent,
    SendEmailComponent,
    SendEmailButtonComponent,
    ProfilesNavComponent,
    ViewNotesComponent,
    DataEntryButtonComponent,
    DataEntryComponent,
    ViewNoteDialogComponent,
    SpinnerComponent,

    // GoogleMapComponent,
    CompanySelectComponent,
    CompaniesDropdownComponent,
    BackButtonComponent,
    ChangePassDialogComponent,
    // CreateNoDataDialogComponent,
    ViewPolicyComponent,
    ViewPolicyDialogComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    MatTabsModule,
    Ng2GoogleChartsModule,
    MatPaginatorModule,
    InputTextModule,
    MegaMenuModule,
    DialogModule,
    PanelModule,
    BreadcrumbModule,
    NgSelectModule,
    InputGroupModule,
    PanelMenuModule,
    ConfirmDialogModule,
    BsDatepickerModule,
    AutoCompleteModule,
    MatTooltipModule,
    TabMenuModule,
    SidebarModule,
    InputGroupAddonModule,
    ToastModule,
    MenuModule,
    TieredMenuModule,
    CheckboxModule,
    MatIconModule,
    ToolbarModule,
    SplitterModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    ProgressSpinnerModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    NgxEditorModule,
    MatDialogModule,
    HttpClientModule,
    MatMenuModule,
    ButtonModule,
    RouterModule,
    SlideMenuModule,
    DropdownModule,
    NgChartsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [
    GaugeComponentComponent,

    CompaniesDropdownComponent,
    PaginatorComponent,
    MatPaginatorModule,
    MatTabsModule,
    ConfirmDialogModule,
    DialogModule,
    MegaMenuModule,
    MenuModule,
    NgChartsModule,
    InputTextModule,
    CheckboxModule,
    MatDialogModule,
    MatMenuModule,
    SidebarModule,
    ToolbarModule,
    MatCardModule,
    InputGroupModule,
    InputGroupAddonModule,
    PanelModule,
    ToastModule,
    TabMenuModule,
    ProgressSpinnerModule,
    TableModule,
    BreadcrumbModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
    SlideMenuModule,
    ButtonModule,
    MatInputModule,
    MatNativeDateModule,
    HttpClientModule,
    MatToolbarModule,
    TieredMenuModule,
    MatDatepickerModule,
    SplitterModule,
    AutoCompleteModule,
    MatSelectModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatSliderModule,
    Ng2GoogleChartsModule,
    NgSelectModule,
    BsDatepickerModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSidenavModule,
    NgxPaginationModule,
    FormsModule,
    MatListModule,
    NgxEditorModule,
    PanelMenuModule,
    DropdownModule,
    RouterModule,
    NgMultiSelectDropDownModule,
    LoginNavComponent,
    NavbarComponent,
    SideMenuComponent,
    CompanySelectComponent,
    // GoogleMapComponent,
    ProfilesNavComponent,
    ViewNotesComponent,
    DataEntryButtonComponent,
    DataEntryComponent,
    ViewNoteDialogComponent,
    BackButtonComponent,
    SpinnerComponent,
    ViewPolicyComponent,
    ViewPolicyDialogComponent,
    // CreateNoDataDialogComponent,
  ],
})
export class SharedModule {}
