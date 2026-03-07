import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { SwalService } from '../service/swal.service';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { ExcelExportService } from '../service/excel-export.service';
import { PdfExportService } from '../service/pdf-export.service';
import { CsvExportService } from '../service/csv-export.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css']
})
export class UomComponent implements OnInit, AfterViewInit {

  formFields: any = [];
  tableSearchFields: any = [];
  // masterForm!: FormGroup;
  submitted = false;
  tableHeader: any = [];
  tableData: any = [];
  activatedPage: any = '';

  title: any = '';
  @ViewChild('fileInput') fileInput: ElementRef;
  excelDataOriginal: any[] = [];
  excelDataArray: any[] = [];
  initialTotalDataCount: number = 0;
  baseURL = environment.baseURL;
  showModal = true;
  myModal: boolean;
  primaryId: any = '';
  filteredArray: any = [];
  itemGroupData: string[] = [];
  filters: { [key: string]: string } = {};
  p: number = 1;
  pageSize: number = 9; // Items per page
  data: any[] = [];
  itemsPerPage: any = 12;
  routerSubscription: Subscription;
  btnRights: any = {};
  isShowNewBtn: boolean = false;
  flagset: boolean = false
  flagset1: boolean = false
  itemForm: any;
  debounceTimer: any;
  @ViewChild('fabGroup') fabGroup: ElementRef;
  @ViewChild('mainBtn') mainBtn: ElementRef;
  constructor(private formBuilder: FormBuilder, private _route: ActivatedRoute, private router: Router, private apiservice: ApiService, private swal: SwalService, private appComponent: AppComponent, private excelExportService: ExcelExportService, private csvExportService: CsvExportService,
    private pdfExportService: PdfExportService,) {
    //this.activatedPage = this.route.snapshot.paramMap.get('page');
    this._route.paramMap.subscribe((params: any) => {
      this.activatedPage = params.params.page; 
      if (this.activatedPage == 'masterBin') { 
        this.title = 'Bin';
        this.formFields = [
          { type: 'text', formControlName: 'BinID', id: 'BinID', bindKey: 'BinID', fieldValue: '', label: 'Bin ID', placeholder: '', required: true },
          { type: 'binselect', formControlName: 'BinStatus', id: 'BinStatus', bindKey: 'BinStatus', fieldValue: '', label: 'Bin Status', placeholder: '', required: true },
        ];
        this.tableSearchFields = [
          { type: 'text', id: 'PalletId', bindKey: 'PalletId', fieldValue: '', placeholder: 'search', 'isShow': true },
        ];
      }
      else if (this.activatedPage == 'MasterReason') { 
        this.title = 'Remarks';
        this.formFields = [
          { type: 'text', formControlName: 'ReasonID', id: 'ReasonID', bindKey: 'ReasonID', fieldValue: '', label: 'Reason ID', placeholder: '', required: true },
          { type: 'text', formControlName: 'ReasonDescription', id: 'ReasonDescription', bindKey: 'ReasonDescription', fieldValue: '', label: 'Reason Description', placeholder: '', required: true },
        ];
        this.tableSearchFields = [
          { type: 'text', id: 'PalletId', bindKey: 'PalletId', fieldValue: '', placeholder: 'search', 'isShow': true },
        ];
      }
      else if (this.activatedPage == 'masterpallet') {
        this.title = 'Pallet';
        this.formFields = [
          { type: 'text', formControlName: 'PalletId', id: 'PalletId', bindKey: 'PalletId', fieldValue: '', label: 'Pallet Id', placeholder: '', required: true },
          { type: 'textarea', formControlName: 'Description', id: 'Description', bindKey: 'Description', fieldValue: '', label: 'Description', placeholder: '', required: false },
        ];
        this.tableSearchFields = [
          { type: 'text', id: 'PalletId', bindKey: 'PalletId', fieldValue: '', placeholder: 'search', 'isShow': true },
        ];
      }
      this.getTableData();
    });

    let user_rights: any = localStorage.getItem('WMS-Rights');
    if (user_rights != null) {
      const data = JSON.parse(user_rights);

      const resultss = data.map(key => ({ [key]: true }))
        .reduce((acc, obj) => ({ ...acc, ...obj }), {});

      this.btnRights = {
        master_itemgroup_modifies: (data.some(right => right.includes('master_itemgroup_modifies'))) ? true : false,
        master_itemgroup_deletes: (data.some(right => right.includes('master_itemgroup_deletes'))) ? true : false,
        master_uom_modifies: (data.some(right => right.includes('master_uom_modifies'))) ? true : false,
        master_uom_deletes: (data.some(right => right.includes('master_uom_deletes'))) ? true : false,
        master_pallet_modifies: (data.some(right => right.includes('master_pallet_modifies'))) ? true : false,
        master_pallet_deletes: (data.some(right => right.includes('master_pallet_deletes'))) ? true : false,
        ...resultss
      };
    }
  }

  ngOnInit(): void {

    this.itemForm = this.formBuilder.group({
      BinID: ['', Validators.required],
      Status: ['0', Validators.required],  // Set default value to '0'
      Description: ['']
    });
    this.primaryId = '';
    // this.masterForm = this.formBuilder.group({});
    // this.formFields.forEach((field: any) => {
    //   this.masterForm.addControl(field.name, this.formBuilder.control('', Validators.required));
    // });
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Reset pagination on navigation start
        this.p = 1;
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from router events to prevent memory leaks
    this.routerSubscription.unsubscribe();
  }

  getColumnWidth(header: string): string {
    // Adjust the width calculation as needed
    return `${Math.max(100, header.length * 10)}px`;
  }

  // export(data: any) {
  //   window.open(this.baseURL + 'masterPartLoad' + '?exportFormat=' + data, '_blank');
  // }

  export(data: any) {
    if (this.activatedPage == 'masterBin') {
      window.open(this.baseURL + 'masterExport/MasterBin/' + data, '_blank');
    }
    else if (this.activatedPage == 'MasterReason') {
      window.open(this.baseURL + 'masterExport/MasterReason/' + data, '_blank');
    }
  }

  getTableData() {
    const filterValue = Object.keys(this.filters).filter(key => {
        const value = this.filters[key];
        return value != null && value !== undefined && value.trim() !== '';
    })

    let ReqObj = {}
    this.tableHeader.forEach((headerData: any) => {
        if(headerData.search == true)
        {
            ReqObj[headerData.data] = filterValue.includes(headerData.data) ? this.filters[headerData.data] : '';
        }
    })

    this.tableHeader = [];
    this.tableData = [];
    this.filteredArray = [];
    if (this.activatedPage == 'masterBin') 
    {
        this.appComponent.showLoading('Bin Master Data is Loading')
        this.apiservice.getMasterTableData('master/MasterBin', ReqObj).subscribe((res: any) => {
            if (res.status == 1) {
            this.appComponent.hideLoading()
            
            this.tableHeader = JSON.parse(res.headers);
            this.tableData = res.data;
            this.filteredArray = res.data;
            let currentPage = 1;
            let start: any = (currentPage * 10) - 9;
            if (this.filteredArray) {
                this.filteredArray.forEach((element: any) => {
                element.sno = start;
                start++;
                })
            }
            

            }
            else if (res.status == 0) {
                this.appComponent.hideLoading()
                this.swal.error('Error', res.message);
            }
            (err: any) => {
                this.appComponent.hideLoading()
                this.swal.error('Error', err.message);
            }

        })
    }
    else if (this.activatedPage == 'MasterReason') {
      this.appComponent.showLoading('Master Reason is Loading')
      this.apiservice.getMasterTableData('master/MasterReason', ReqObj).subscribe((res: any) => {
        if (res.status == 1) {
          this.appComponent.hideLoading()
          this.tableHeader = JSON.parse(res.headers);
          this.tableData = res.data;
          this.filteredArray = res.data;
          let currentPage = 1;
          let start: any = (currentPage * 10) - 9;
          if (this.filteredArray) {
            this.filteredArray.forEach((element: any) => {
              element.sno = start;
              start++;
            })
          }
        }
        else if (res.status == 0) {
          this.appComponent.hideLoading()
          this.appComponent.hideLoading()
          this.swal.error('Error', res.message);
        }
        (err: any) => {
          this.appComponent.hideLoading()
          this.swal.error('Error', err.message);
        }

      }),
        (err: any) => {
          this.appComponent.hideLoading()
          this.swal.error('Error', err.message);
        }
    }
  }

  ngAfterViewInit(): void {
    this.setupEventListeners();
    if (this.mainBtn) {
      this.mainBtn.nativeElement.addEventListener('click', () => {
        this.fabGroup.nativeElement.classList.toggle('active');
      });
    }
    // this.mainBtn.nativeElement.addEventListener('click', () => {
    //   this.fabGroup.nativeElement.classList.toggle('active');
    // });
  }

  // openModal() {
  //   this.submitted = false;
  //   const sidebar = document.querySelector<HTMLElement>('.sidebar');
  //   const sidebarBtn = document.querySelector<HTMLElement>('.open-modal');
  // }


  // openEditModal(item: any) {
  //   const sidebar = document.getElementById('myModal');
  //   if (sidebar) {
  //     sidebar.classList.add('show');
  //     sidebar.style.display = 'block';
  //   }
  // }

  // new sorting code

currentSortKey: string = '';  
isAscending: boolean = true;  

sortArrayByKey(data: any[], key: string, type: string): any[] { 
  return data.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (type === 'text') {
      return aValue.localeCompare(bValue);
    } else if (type == 'Integer') {
      return Number(aValue) - Number(bValue);
    } else if (type === 'date') {
      return new Date(aValue).getTime() - new Date(bValue).getTime();
    } else {
      return 0; // Fallback case for unknown types
    }
  });
}

sortData(key: string, type: string): void {
  if (this.currentSortKey === key) { 
    this.isAscending = !this.isAscending;
  } else { 
    this.currentSortKey = key;
    this.isAscending = true;
  }
  
  this.filteredArray = this.sortArrayByKey(this.filteredArray, key, type);
  
  if (!this.isAscending) {
    this.filteredArray.reverse();
  }
 
}

onSort(key: string, type: string): void {
  this.sortData(key, type);
}


// new sorting code

  deleteData(data: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let mydata = 'master/' + this.activatedPage + '/' + data.Id;
        this.appComponent.showLoading('Data is Deleting')
        this.apiservice.deleteMasterData(mydata).subscribe((res: any) => {
          if (res.status == 1) {
            this.appComponent.hideLoading()
            this.tableHeader = [];
            this.tableData = [];
            this.filteredArray = [];
            this.swal.success_ok('Success', res.message, true);
            this.tableHeader = JSON.parse(res.headers);
            this.tableData = res.data;
            this.filteredArray = res.data;
            let currentPage = 1;
            let start: any = (currentPage * 10) - 9;
            if (this.filteredArray) {
              this.filteredArray.forEach((element: any) => {
                element.sno = start;
                start++;
              })
            }
          } else {
            this.appComponent.hideLoading()
            this.swal.error('Error', res.message);
          }
        }, (err => {
          this.appComponent.hideLoading()
          this.swal.error('Error', err.message);
        }));
      }
    });
  }

  closeModal() {
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    this.flagset1 = false

    sidebar.classList.toggle('close');
  }

  falseSet() {
    this.flagset = false
    this.dropdownOpen = false
    this.fabGroup.nativeElement.classList.remove('active');

  }

  falseSet1() {
    // this.dropdownOpen = false
    this.closeModal()
  }

  clearFields() {
    this.formFields.forEach(field => field.fieldValue = '');
    this.submittedFlag = false;
  }

  close() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  }

  open(data: any, activatedPage: string) { 
    if (data.Status == 1) {
      this.openSidebar(data);
    } else {
      if (activatedPage == 'masterBin') {
        this.swal.error('Error', 'Selected MasterBin is Inactivated');
      }
      else if(activatedPage == 'masterReason') {
        this.openSidebar(data);
      }
    }
  }



  openSidebar(data: any) {
    this.flagset1 = true
    this.submitted = false;
    if (data == '') {
      this.primaryId = '';
      this.formFields.forEach(element => {
        element.fieldValue = '';
      })
    }
    else {
      if (this.activatedPage == 'masterBin') {
        this.primaryId = data.AliasBinID ?? data.AliasBinID;
      }
      else {
        this.primaryId = data.Id ?? data.id;
      }

      this.formFields.forEach(element => {
        element.fieldValue = data[element.bindKey];
      });
    }
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    sidebar?.classList.toggle('close');
  }


  private setupEventListeners(): void {
    const arrows = document.querySelectorAll<HTMLElement>('.arrow');

    arrows.forEach((arrow) => {
      arrow.addEventListener('click', (e) => {
        const arrowParent = (e.target as HTMLElement).parentElement?.parentElement; // selecting main parent of arrow
        if (arrowParent) {
          arrowParent.classList.toggle('showMenu');
        }
      });
    });

    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    const sidebarBtn = document.querySelector<HTMLElement>('.open-modal');
 

    if (sidebarBtn) {
      sidebarBtn.addEventListener('click', () => {
        if (sidebar) {
          sidebar.classList.toggle('close');
        }
      });
    }
  }
  // get f(): { [key: string]: AbstractControl } {
  //   return this.masterForm.controls;
  // }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  submit() {
    this.submitted = true;
    // if (this.masterForm.invalid) {
    //   //this.markFormGroupTouched(this.masterForm);
    //   //this.swal.error('Error', 'Please fill all required fields');
    //   return;
    // }
    let data: any = {};
    this.formFields.forEach((element: any) => {
      if(element.fieldValue == ' ') {
        this.swal.error('Error', 'Please fill all required fields');
        return;
      }
      const obj = {
        [element.id]: element.fieldValue
      };
      data = { ...data, ...obj };
    });

    data = { ...data, "UserName": "testing" };

    if (this.primaryId == '') {
      this.appComponent.showLoading('Submitting...');
      this.apiservice.postMasterData(data, 'master/' + (this.activatedPage === 'masterBin' ? 'MasterBin' : (this.activatedPage === 'MasterReason' ? 'MasterReason' : '')) + '/' + this.primaryId).subscribe((res: any) => {
        if (res.status == 1) {
          this.appComponent.hideLoading();
          this.submitted = false;
          this.tableHeader = JSON.parse(res.headers);
          this.tableData = res.data;
          this.filteredArray = res.data;
          let currentPage = 1;
          let start: any = (currentPage * 10) - 9;
          if (this.filteredArray) {
            this.filteredArray.forEach((element: any) => {
              element.sno = start;
              start++;
            })
          }
          // this.masterForm.reset();
          this.closeModal();
          this.swal.success_ok('Success', res.message, true);
        }
        else {
          this.appComponent.hideLoading();
          this.swal.error('Error', res.message);
        }
      }), (err: any) => {
        this.appComponent.hideLoading();
        this.swal.error('Error', err.message);
      };
    }
    else {
      this.appComponent.showLoading('Updating...');
      this.apiservice.updateMasterData('master/' + (this.activatedPage === 'masterBin' ? 'MasterBin' : (this.activatedPage === 'MasterReason' ? 'MasterReason' : '')) + '/' + this.primaryId, data).subscribe((res: any) => {
        if (res.status == 1) {
          this.appComponent.hideLoading();
          this.submitted = false;
          this.tableHeader = JSON.parse(res.headers);
          this.tableData = res.data;
          this.filteredArray = res.data;
          // this.masterForm.reset();
          let currentPage = 1;
          let start: any = (currentPage * 10) - 9;
          if (this.filteredArray) {
            this.filteredArray.forEach((element: any) => {
              element.sno = start;
              start++;
            })
          }
          this.closeModal();
          this.swal.success_ok('Success', res.message, true);
        }
        else {
          this.appComponent.hideLoading();
          this.swal.error('Error', res.message);
        }
      }), (err: any) => {
        this.appComponent.hideLoading();
        this.swal.error('Error', err.message);
      };
    }
  }
  submittedFlag: boolean = false;
  submitToServer() {
    this.submittedFlag = true;
    let isValid = true;

    for (let field of this.formFields) {
      if (field.required && !field.fieldValue) {
        isValid = false;
      }
    }

    if (isValid) { 
      this.submit();
      this.submittedFlag = false;
    } else {
      this.swal.error('Error', 'Please fill all required fields');
    }
  }


  filterByPattern(key, pattern) {
    this.filteredArray = [];
    const regex = new RegExp(pattern, 'i'); // 'i' for case-insensitive matching
    this.filteredArray = this.tableData.filter(item => regex.test(item[key]));
  }
  applyFilters() {
    // this.filteredArray = this.tableData.filter(record => {
    //   return Object.keys(this.filters).every(key => {
    //     if (this.filters[key] === null || this.filters[key] === undefined || this.filters[key] === '') {
    //       return true; // Don't apply filter if it's empty
    //     }
    //     const filterValue = String(this.filters[key]).toLowerCase();
    //     const recordValue = String(record[key]).toLowerCase();
    //     if (this.tableHeader.find(header => header.data === key)?.search) {
    //       return recordValue.includes(filterValue);
    //     } else {
    //       // If the column is not searchable, just return true to include the record
    //       return true;
    //     }
    //   });
    // });

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
        this.getTableData()
    },500) 
  }

  activeInactive(data: any, status: any) {
    let msg = '';
    let confirm = '';
    let newStatus: number;
    let id = ''
    if (this.activatedPage == 'masterBin') {
      id = data.AliasBinID ?? data.AliasBinID;
    }
    else {
      id = data.Id ?? data.id;
    }
 
    if (status == 1) {
      msg = 'Are you sure you want to Deactivate it?';
      confirm = 'Yes, Deactivate it!';
      // newStatus = 0; // Deactivate
    } else {
      msg = 'Are you sure you want to Activate it?';
      confirm = 'Yes, Activate it!';
      // newStatus = 1; // Activate
    }

    Swal.fire({
      title: msg,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirm
    }).then((result) => {
      if (result.isConfirmed) {
        let url = 'master/UserGroup/';
        let obj: any = {
          Id: id,
          isDelete: status // Update status
        };
        this.appComponent.showLoading('Updating...');
        this.apiservice.masterStatusUpdate(obj, 'master/' + (this.activatedPage === 'masterBin' ? 'MasterBin' : this.activatedPage) + '/' + id).subscribe((res: any) => {
          if (res.status == 1) {
            this.appComponent.hideLoading();
            this.tableHeader = [];
            this.tableData = [];
            this.filteredArray = [];
            this.tableHeader = JSON.parse(res.headers);
            this.tableData = res.data;
            this.filteredArray = res.data;
            let currentPage = 1;
            let start: any = (currentPage * 10) - 9;
            if (this.filteredArray) {
              this.filteredArray.forEach((element: any) => {
                element.sno = start;
                start++;
              });
            }
            let successMsg = status ? 'Deactivated' : 'Activated';
            this.swal.success_ok('Success', `Item ${successMsg} successfully`, true);
          } else {
            this.appComponent.hideLoading();
            this.swal.error('Error', res.message);
          }
        }, (err => {
          this.appComponent.hideLoading();
          this.swal.error('Error', err.message);
        }));
      }
      else {
        const checkbox = document.getElementById('cbx' + id) as HTMLInputElement;
        checkbox.checked = !checkbox.checked;
      }
    });
  }

  importExcel(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.readExcel(file);
    }
  }

  readExcel(file: File) {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);

      this.excelDataOriginal = excelData;
      this.excelDataArray = this.excelDataOriginal;

      // Set the initial total count
      this.initialTotalDataCount = this.excelDataArray.length; 

      const modal = document.getElementById('myModal');
      modal.style.display = 'block';
    };

    reader.readAsBinaryString(file);

  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('exportdata');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'mandatory.xlsx');
    this.excelDataArray = [];
  }

  exportFile() {
    this.flagset = !this.flagset 
  }

  // export(data: any) {
  //   window.open(this.baseURL + 'masterExport/MasterPart/' + data, '_blank');
  // }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;


  }

}