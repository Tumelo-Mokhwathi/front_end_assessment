import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe } from '@angular/common';

declare var jQuery: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AccountInfoComponent implements OnInit, AfterViewInit {
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
    this.LoadUsers();
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

  buildCreateForm() {
    if (this.user) {
      this.createForm = this.formBuilder.group({
        friendlyName: [this.user.friendlyName],
        canLogin: [this.user.canLogin],
        contactNumber: [this.user.contactNumber],
        email: [this.user.email],
        dateOfBirth: [this.user.dateOfBirth],
        company: [this.user.company]
      });
    } else {
      this.createForm = this.formBuilder.group({
        friendlyName: [''],
        canLogin: [false],
        contactNumber: [''],
        email: [''],
        dateOfBirth: [''],
        company: ['']
      });
    }
  }

  statusFilter(isActive) {
    return isActive ? 'Yes' : 'No';
  }

  onChange(user) {
    this.user = user;
    this.buildCreateForm();
  }

  get g() { return this.updateForm.controls; }

  applyFilter(event) {
    if ((this.searchText !== null || this.searchText !== '') && event.length > 0) {
      this.results = this.results.filter(s => s.friendlyName.toLowerCase().includes(this.searchText.toLowerCase()));
    } else {
      this.results = this.data.result;
    }
  }

  createUser() {
    if (this.user) {
      const updatedUser = {
        'friendlyName': this.createForm.value.friendlyName,
        'email': this.createForm.value.email,
        'contactNumber': this.createForm.value.contactNumber,
        'dateOfBirth': this.formatDate(this.createForm.value.dateOfBirth),
        'company': this.createForm.value.company,
        'canLogin': this.createForm.value.canLogin,
      };
  
      this.http.put('https://localhost:44357/api/users/' + this.user.id, updatedUser).subscribe((response: Response) => {
        this.LoadUsers();
        this.resetCreateUser();
      });
    } else {
      const user = {
        'id': 0,
        'friendlyName': this.createForm.value.friendlyName,
        'email': this.createForm.value.email,
        'contactNumber': this.createForm.value.contactNumber,
        'dateOfBirth': this.formatDate(this.createForm.value.dateOfBirth),
        'company': this.createForm.value.company,
        'canLogin': this.createForm.value.canLogin,
      };
  
      this.http.post('https://localhost:44357/api/users', user).subscribe((response: Response) => {
        this.LoadUsers();
        this.resetCreateUser();
      });
    }
  }

  deleteUser(user) {
    this.http.delete('https://localhost:44357/api/users/' + user.id).subscribe((response: Response) => {
      this.LoadUsers();
    });
  }

  formatDate(date) {
    const formattedDate: DatePipe = new DatePipe('en-US');
    return formattedDate.transform(date, 'dd/MM/yyyy');
  }

  LoadUsers() {
    this.http.get('https://localhost:44357/api/users').subscribe((response: Response) => {
      this.data = response;
      this.results = this.data.result;
    });
  }

  resetCreateUser() {
    this.createForm.setValue({
      friendlyName: '',
      email: '',
      contactNumber: '',
      company: '',
      canLogin: false
    });
  }

  resetText() {
    this.searchForm.setValue({
      searchText: ''
    });
  }

  search() {
    return this.results.filter(s => {
      return s.friendlyName.toLowerCase().startsWith(
        this.searchText.toLowerCase()
      );
    });
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
