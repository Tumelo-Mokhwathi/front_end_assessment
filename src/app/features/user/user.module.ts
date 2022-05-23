import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AccountInfoComponent } from './users/users.component';
import { CompaniesComponent } from './companies/companies.component';
import { MatNativeDateModule, } from '@angular/material/core';

export const routes = [
    { path: '', pathMatch: 'full', redirectTo: 'account-info' },
    { path: 'users', component: AccountInfoComponent },
    { path: 'companies', component: CompaniesComponent }
];


@NgModule({
    declarations: [
        AccountInfoComponent,
        CompaniesComponent
    ],
  imports: [
      CommonModule,
      DataTablesModule,
      FlexLayoutModule,
      MatIconModule,
      MatInputModule,
      MatButtonModule,
      MatTableModule,
      ReactiveFormsModule,
      FormsModule,
      MatDatepickerModule,
      MatNativeDateModule,
      RouterModule.forChild(routes)
  ]
})
export class UserModule { }
