import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { ApiService } from '../service/api.service';
import { SwalService } from '../service/swal.service';

interface GrnPushingTab {
  key: 'Pending' | 'Retrieval Status';
  label: string;
}

@Component({
  selector: 'app-grn-pushing',
  templateUrl: './grn-pushing.component.html',
  styleUrls: ['./grn-pushing.component.css']
})
export class GrnPushingComponent implements OnInit {
  @ViewChild('tableBody') tableBody!: ElementRef;

  tabs: GrnPushingTab[] = [
    { key: 'Pending', label: 'Pending' },
    { key: 'Retrieval Status', label: 'Retrieval Status' }
  ];

  activeTab: 'Pending' | 'Retrieval Status' = 'Pending';
  p = 1;
  detailPage = 1;
  itemsPerPage = 10;
  detailItemsPerPage = 10;
  lastUpdatedDateTime: any = new Date().toLocaleString();
  filters: { [key: string]: string } = {};
  detailFilters: { [key: string]: string } = {};
  debounceTimer: any;

  listData: any[] = [];
  filteredData: any[] = [];
  detailData: any[] = [];
  filteredDetailData: any[] = [];

  selectedRow: any = null;
  showDetailModal = false;

  listSortKey = '';
  detailSortKey = '';
  isListAscending = true;
  isDetailAscending = true;

  constructor(
    private apiservice: ApiService,
    private swal: SwalService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.calculateItemsPerPageOnResize();
    this.loadListData();
  }

  calculateItemsPerPage(): number {
    if (!this.tableBody?.nativeElement) {
      return 10;
    }

    const tableElement = this.tableBody.nativeElement;
    const tableRowHeight = 52;
    const availableHeight = tableElement.clientHeight || 520;
    return Math.max(5, Math.floor(availableHeight / tableRowHeight));
  }

  calculateItemsPerPageOnResize() {
    window.addEventListener('resize', () => {
      this.itemsPerPage = this.calculateItemsPerPage();
    });
  }

  setActiveTab(tab: 'Pending' | 'Retrieval Status') {
    this.activeTab = tab;
    this.filters = {};
    this.selectedRow = null;
    this.listData = [];
    this.filteredData = [];

    if (tab === 'Pending') {
      this.loadListData();
    }
  }

  loadListData() {
    if (this.activeTab !== 'Pending') {
      return;
    }

    this.lastUpdatedDateTime = new Date().toLocaleString();
    const requestBody = {
      type: 'Binning'
    };

    this.appComponent.showLoading('GRN Pushing Data Loading...');
    this.apiservice.getGrnPushingList(requestBody).subscribe(
      (res: any) => {
        this.appComponent.hideLoading();

        if (res?.status === 1 || Array.isArray(res?.data) || Array.isArray(res)) {
          const rawData = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          this.listData = rawData.map((item: any, index: number) => ({
            ...item,
            sno: index + 1,
            selected: false
          }));
          this.filteredData = [...this.listData];
          this.itemsPerPage = this.calculateItemsPerPage();
          return;
        }

        this.listData = [];
        this.filteredData = [];
        this.swal.error('Error', res?.message || 'Unable to load GRN Pushing data.');
      },
      (error) => {
        this.appComponent.hideLoading();
        this.listData = [];
        this.filteredData = [];
        this.swal.error('Error', error?.message || 'Unable to load GRN Pushing data.');
      }
    );
  }

  applyFilters() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.filteredData = this.listData.filter((record) =>
        Object.keys(this.filters).every((key) => {
          const filterValue = (this.filters[key] || '').trim().toLowerCase();
          if (!filterValue) {
            return true;
          }

          const recordValue = String(record[key] ?? '').toLowerCase();
          return recordValue.includes(filterValue);
        })
      );
      this.p = 1;
    }, 300);
  }

  applyDetailFilters() {
    this.filteredDetailData = this.detailData.filter((record) =>
      Object.keys(this.detailFilters).every((key) => {
        const filterValue = (this.detailFilters[key] || '').trim().toLowerCase();
        if (!filterValue) {
          return true;
        }

        const recordValue = String(record[key] ?? '').toLowerCase();
        return recordValue.includes(filterValue);
      })
    );
    this.detailPage = 1;
  }

  onRowSelect(item: any) {
    this.listData.forEach((row) => {
      row.selected = row === item;
    });
    this.filteredData.forEach((row) => {
      row.selected = row === item;
    });
    this.selectedRow = item;
  }

  openOrderDetails() {
    if (!this.selectedRow) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select a row to view order details.',
        icon: 'info'
      });
      return;
    }

    const requestBody = {
      type: 'Binning',
      process: this.selectedRow.DocType || this.selectedRow.docType || this.selectedRow.Process || 'GRPO',
      status: this.selectedRow.Status || this.selectedRow.status || 'Pending',
      docEntry: this.selectedRow.DocEntry || this.selectedRow.docEntry
    };

    this.appComponent.showLoading('Order Details Loading...');
    this.apiservice.getGrnPushingDetails(requestBody).subscribe(
      (res: any) => {
        this.appComponent.hideLoading();

        if (res?.status === 1 || Array.isArray(res?.data) || Array.isArray(res)) {
          const rawData = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          this.detailData = rawData.map((item: any, index: number) => ({
            ...item,
            sno: index + 1,
            selected: true
          }));
          this.filteredDetailData = [...this.detailData];
          this.detailFilters = {};
          this.showDetailModal = true;
          return;
        }

        this.detailData = [];
        this.filteredDetailData = [];
        this.swal.error('Error', res?.message || 'Unable to load order details.');
      },
      (error) => {
        this.appComponent.hideLoading();
        this.detailData = [];
        this.filteredDetailData = [];
        this.swal.error('Error', error?.message || 'Unable to load order details.');
      }
    );
  }

  closeOrderDetails() {
    this.showDetailModal = false;
  }

  submitRequest() {
    if (!this.selectedRow) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select a row to submit the request.',
        icon: 'info'
      });
      return;
    }

    const requestBody = {
      type: 'Binning',
      docEntry: this.selectedRow.DocEntry || this.selectedRow.docEntry,
      docNum: this.selectedRow.DocNum || this.selectedRow.docNum,
      process: this.selectedRow.DocType || this.selectedRow.docType || 'GRPO'
    };

    Swal.fire({
      title: 'Are you sure to push the selected GRN?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.appComponent.showLoading('Submitting GRN Pushing Request...');
      this.apiservice.submitGrnPushingRequest(requestBody).subscribe(
        (res: any) => {
          this.appComponent.hideLoading();

          if (res?.status === 1) {
            Swal.fire({
              title: 'Success',
              text: res?.message || 'GRN Pushing request submitted successfully.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1200,
              timerProgressBar: true
            });
            this.selectedRow = null;
            this.loadListData();
            return;
          }

          this.swal.error('Error', res?.message || 'Unable to submit GRN Pushing request.');
        },
        (error) => {
          this.appComponent.hideLoading();
          this.swal.error('Error', error?.message || 'Unable to submit GRN Pushing request.');
        }
      );
    });
  }

  sortArrayByKey(data: any[], key: string, type: string): any[] {
    return data.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (type === 'number') {
        return Number(aValue || 0) - Number(bValue || 0);
      }

      if (type === 'date') {
        return new Date(aValue).getTime() - new Date(bValue).getTime();
      }

      return String(aValue || '').localeCompare(String(bValue || ''));
    });
  }

  onSort(key: string, type: string) {
    if (this.listSortKey === key) {
      this.isListAscending = !this.isListAscending;
    } else {
      this.listSortKey = key;
      this.isListAscending = true;
    }

    this.filteredData = this.sortArrayByKey(this.filteredData, key, type);
    if (!this.isListAscending) {
      this.filteredData.reverse();
    }
  }

  onDetailSort(key: string, type: string) {
    if (this.detailSortKey === key) {
      this.isDetailAscending = !this.isDetailAscending;
    } else {
      this.detailSortKey = key;
      this.isDetailAscending = true;
    }

    this.filteredDetailData = this.sortArrayByKey(this.filteredDetailData, key, type);
    if (!this.isDetailAscending) {
      this.filteredDetailData.reverse();
    }
  }

  getListValue(item: any, keys: string[], fallback = '-') {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }

    return fallback;
  }
}
