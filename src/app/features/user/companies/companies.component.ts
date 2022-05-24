import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit , AfterViewInit {
  dtOptions: DataTables.Settings = {};
  data: any;
  user: any;
  searchText: string = '';
  results: any;
  searchForm: FormGroup;
  createForm: FormGroup;
  updateForm: FormGroup;
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.buildForm();
    this.buildCreateForm();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.LoadCompanies();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      searchText: [''],
    });
  }

  statusFilter(isActive) {
    return isActive ? 'Yes' : 'No';
  }

  buildCreateForm() {
    if (this.user) {
      this.createForm = this.formBuilder.group({
        name: [this.user.name],
        contactNumber: [this.user.contactNumber],
        registrationNumber: [this.user.registrationNumber],
        active: [this.user.active]
      });
    } else {
      this.createForm = this.formBuilder.group({
        name: [''],
        active: [false],
        contactNumber: [''],
        registrationNumber: ['']
      });
    }
  }

  onChange(user) {
    this.user = user;
    this.buildCreateForm();
  }

  get g() { return this.updateForm.controls; }

  applyFilter(event) {
    if ((this.searchText !== null || this.searchText !== '') && event.length > 0) {
      this.results = this.results.filter(s => s.name.toLowerCase().includes(this.searchText.toLowerCase()));
    } else {
      this.results = this.data.result;
    }
  }

  createCompany() {
    if (this.user) {
      const updatedUser = {
        'name': this.createForm.value.name,
        'active': this.createForm.value.active,
        'contactNumber': this.createForm.value.contactNumber,
        'registrationNumber': this.createForm.value.registrationNumber
      };
  
      this.http.put('https://localhost:44357/api/companies/' + this.user.id, updatedUser).subscribe((response: Response) => {
        this.LoadCompanies();
        this.resetCreateCompany();
      });
    } else {
      const user = {
        'id': 0,
        'name': this.createForm.value.name,
        'active': this.createForm.value.active,
        'contactNumber': this.createForm.value.contactNumber,
        'registrationNumber': this.createForm.value.registrationNumber
      };
  
      this.http.post('https://localhost:44357/api/companies', user).subscribe((response: Response) => {
        this.LoadCompanies();
        this.resetCreateCompany();
      });
    }
  }

  deleteCompany(user) {
    this.http.delete('https://localhost:44357/api/companies/' + user.id).subscribe((response: Response) => {
      this.LoadCompanies();
    });
  }

  formatDate(date) {
    const formattedDate: DatePipe = new DatePipe('en-US');
    return formattedDate.transform(date, 'dd/MM/yyyy');
  }

  LoadCompanies() {
    this.http.get('https://localhost:44357/api/companies').subscribe((response: Response) => {
      this.data = response;
      this.results = this.data.result;
    });
  }

  resetCreateCompany() {
    this.createForm.setValue({
      name: '',
      active: '',
      contactNumber: '',
      registrationNumber: ''
    });
  }

  resetText() {
    this.searchForm.setValue({
      searchText: ''
    });
  }

  search() {
    return this.results.filter(s => s.name.toLowerCase().includes(this.searchText.toLowerCase()))
  }

  exportToCsv() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'File',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.results);
  }
}


