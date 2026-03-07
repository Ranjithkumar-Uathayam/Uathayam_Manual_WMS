import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
//import { RouterModule, Routes } from '@angular/router';
//import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartComponent } from './part/part.component';
import { StationComponent } from './station/station.component';
import { LocationComponent } from './location/location.component';
import { EquipmentdetailsComponent } from './equipmentdetails/equipmentdetails.component';
import { EquiperrorComponent } from './equiperror/equiperror.component';
import { EquipmentdetailsConveyorComponent } from './equipmentdetails-conveyor/equipmentdetails-conveyor.component';
import { EquipmentdetailsScannerComponent } from './equipmentdetails-scanner/equipmentdetails-scanner.component';
import { EquipmentdetailsPlcComponent } from './equipmentdetails-plc/equipmentdetails-plc.component';
import { UomComponent } from './uom/uom.component';
import { MaintenanceScheduleComponent } from './maintenance-schedule/maintenance-schedule.component';
import { PalletComponent } from './pallet/pallet.component';
import { PalletGroupComponent } from './pallet-group/pallet-group.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { ItemtransactionListComponent } from './itemtransaction-list/itemtransaction-list.component';
import { PalletrequestListComponent } from './palletrequest-list/palletrequest-list.component';
import { PalletListComponent } from './pallet-list/pallet-list.component';
import { LoadunloadHistoryComponent } from './loadunload-history/loadunload-history.component';
import { ErrorHistoryComponent } from './error-history/error-history.component';
import { RejectedpalletHistoryComponent } from './rejectedpallet-history/rejectedpallet-history.component';
import { MaintenancehistoryComponent } from './maintenancehistory/maintenancehistory.component';
import { UserlogComponent } from './userlog/userlog.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PalletRelocationComponent } from './pallet-relocation/pallet-relocation.component';
import { CraneStatusComponent } from './crane-status/crane-status.component';
import { EquipmentStatusComponent } from './equipment-status/equipment-status.component';
import { ViewCommandsComponent } from './view-commands/view-commands.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { EmergencyOperationsComponent } from './emergency-operations/emergency-operations.component';
import { LocationMaintenanceComponent } from './location-maintenance/location-maintenance.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ManualentryPalletComponent } from './manualentry-pallet/manualentry-pallet.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { ConveyorDetailsComponent } from './conveyor-details/conveyor-details.component';
import { PalletStorageComponent } from './pallet-storage/pallet-storage.component';
import { StorageDetailsComponent } from './storage-details/storage-details.component';
import { RetrieveIndividualpalletComponent } from './retrieve-individualpallet/retrieve-individualpallet.component';
import { RetrievePalletsComponent } from './retrieve-pallets/retrieve-pallets.component';
import { LocationStatusComponent } from './location-status/location-status.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { UserControlComponent } from './main/user-control/user-control.component';
import { ItemGroupComponent } from './main/item-group/item-group.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ItemComponent } from './item/item.component';
import { AlarmHistoryComponent } from './alarm-history/alarm-history.component';
import { StorageRetrievalHistoryComponent } from './storage-retrieval-history/storage-retrieval-history.component';
import { NgApexchartsModule, ApexOptions, ChartType } from "ng-apexcharts";
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopupComponent } from './components/popup/popup.component';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { TableConfigComponent } from './table-config/table-config.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgSelect2Module } from 'ng-select2';
import { ManualStoreinComponent } from './manual-storein/manual-storein.component';
import { PrebinningApprovalComponent } from './prebinning-approval/prebinning-approval.component';
import { ConsolidationBinComponent } from './consolidation-bin/consolidation-bin.component';
import { EmptyBinComponent } from './emptybin-inout/emptybin-inout.component';
import { PickingComponent } from './picking/picking.component';
import { StockVerificationsComponent } from './stockverifications/stockverifications.component';
import { ReasonMasterComponent } from './reason-master/reason-master.component';
import { OrderApprovalComponent } from './order-approval/order-approval.component';
import { EquipmentMonitorComponent } from './equipmentmonitor/equipmentmonitor.component';
import { PrebinningStatusComponent } from './prebinning-status/prebinning-status.component';
import { TvDisplayComponent } from './tv-display/tv-display.component';
import { LiveTrackingComponent } from './live-tracking/live-tracking.component';
import { ToteliftRequestComponent } from './totelift-request/totelift-request.component';
import { UserEntryLogComponent } from './user-entry-log/user-entry-log.component';
import { BinWiseOrderSummaryComponent } from './bin-wise-order-summary/bin-wise-order-summary.component';
import { StationConfigComponent } from './station-config/station-config.component';
import { HhtDeviceRightsComponent } from './hht-device-rights/hht-device-rights.component';
import { WcsAlarmComponent } from './wcs-alarm/wcs-alarm.component';
import { AutoPalletReadComponent } from './auto-pallet-read/auto-pallet-read.component';
import { LoadBufferComponent } from './load-buffer/load-buffer.component';
import { UnloadBufferComponent } from './unload-buffer/unload-buffer.component';
import { LiftReachedBinComponent } from './lift-reached-bin/lift-reached-bin.component';
import { LoadConveyorBufferComponent } from './load-conveyor-buffer/load-conveyor-buffer.component';
import { MlsSendComponent } from './mls-send/mls-send.component';
import { ToteLiftSendComponent } from './tote-lift-send/tote-lift-send.component';
import { RetrievalConfirmationComponent } from './retrieval-confirmation/retrieval-confirmation.component';
import { ConveyorAddressDetailsComponent } from './conveyor-address-details/conveyor-address-details.component';
import { GroundConveyorStatusComponent } from './ground-conveyor-status/ground-conveyor-status.component';
import { BinWiseRetrievalComponent } from './bin-wise-retrieval/bin-wise-retrieval.component';
import { MLSAutoCommandStoreComponent } from './mls-auto-command-store/mls-auto-command-store.component';
import { MLSErrorComponent } from './mls-error/mls-error.component';
import { TLAutoCommandStoreComponent } from './tl-auto-command-store/tl-auto-command-store.component';
import { TLErrorComponent } from './tl-error/tl-error.component';
import { MLSSemiAutoCommandComponent } from './mls-semi-auto-command/mls-semi-auto-command.component';
import { TLSemiAutoCommandComponent } from './tl-semi-auto-command/tl-semi-auto-command.component';
import { WCSSendModbusComponent } from './wcssend-modbus/wcssend-modbus.component';
import { EquipmentRequestDetailsComponent } from './equipment-request-details/equipment-request-details.component';
import { OeeTransactionComponent } from './oee-transaction/oee-transaction.component';
import { CraneMovementComponent } from './crane-movement/crane-movement.component';
import { OrderProcessingSummaryComponent } from './order-processing-summary/order-processing-summary.component';
import { OverallEquipmentStatusComponent } from './overall-equipment-status/overall-equipment-status.component';
import { PrebinningSummaryComponent } from './prebinning-summary/prebinning-summary.component';
import { RetrieveSummaryComponent } from './retrieve-summary/retrieve-summary.component';
import { ConveyorAddressDetailsOpcComponent } from './conveyor-address-details-opc/conveyor-address-details-opc.component';
import { EquipmentConfigComponent } from './equipment-config/equipment-config.component';
import { EquipmentIpConfigComponent } from './equipment-ip-config/equipment-ip-config.component';
import { EquipmentErrorUploadComponent } from './equipment-error-upload/equipment-error-upload.component';
import { EquipmentsIdleRunningTimeMonitoringComponent } from './equipments-idle-running-time-monitoring/equipments-idle-running-time-monitoring.component';
import { MlscurrentstatusComponent } from './mlscurrentstatus/mlscurrentstatus.component';
import { DownloadFormatterComponent } from './download-formatter/download-formatter.component';
import { BinwisePrebininningActionComponent } from './binwise-prebininning-action/binwise-prebininning-action.component';
import { StoreRetrieveDashboardComponent } from './store-retrieve-dashboard/store-retrieve-dashboard.component';
import { OrderReassignComponent } from './order-reassign/order-reassign.component';
import { StationManagementComponent } from './station-management/station-management.component';


@NgModule({
  declarations: [SidenavComponent,
    AppComponent,
    LoginComponent,
    HomeComponent,
    AboutComponent,
    HeaderComponent,
    NavComponent,
    PartComponent,
    StationComponent,
    LocationComponent,
    EquipmentdetailsComponent,
    EquiperrorComponent,
    EquipmentdetailsConveyorComponent,
    EquipmentdetailsScannerComponent,
    EquipmentdetailsPlcComponent,
    UomComponent,
    MaintenanceScheduleComponent,
    PalletComponent,
    PalletGroupComponent,
    InventoryListComponent,PrebinningApprovalComponent,ConsolidationBinComponent,
    ItemtransactionListComponent,
    PalletrequestListComponent,
    PalletListComponent,
    LoadunloadHistoryComponent,
    ErrorHistoryComponent,
    RejectedpalletHistoryComponent,
    MaintenancehistoryComponent,
    UserlogComponent,
    ShortcutsComponent,
    ChangePasswordComponent,
    PalletRelocationComponent,
    CraneStatusComponent,
    EquipmentStatusComponent,
    ViewCommandsComponent,
    SidenavComponent,
    EquipmentMonitorComponent,
    EmergencyOperationsComponent,
    LocationMaintenanceComponent,
    UserManagementComponent,
    ManualentryPalletComponent,
    StockAdjustmentComponent,
    ConveyorDetailsComponent,
    PalletStorageComponent,
    StorageDetailsComponent,
    RetrieveIndividualpalletComponent,
    RetrievePalletsComponent,
    LocationStatusComponent,
    MainpageComponent,
    UserControlComponent,
    ItemGroupComponent,
    ScheduleComponent,
    ItemComponent,
    AlarmHistoryComponent,
    StorageRetrievalHistoryComponent,
    PopupComponent,
    ExportModalComponent,
    DynamicTableComponent,
    TableConfigComponent,
    ManualStoreinComponent,
    EmptyBinComponent,
    PickingComponent,
    StockVerificationsComponent,
    ReasonMasterComponent,
    OrderApprovalComponent,
    PrebinningStatusComponent,
    TvDisplayComponent,
    LiveTrackingComponent,
    ToteliftRequestComponent,
    UserEntryLogComponent,
    BinWiseOrderSummaryComponent,
    StationConfigComponent,
    HhtDeviceRightsComponent,
    WcsAlarmComponent,
    AutoPalletReadComponent,
    LoadBufferComponent,
    UnloadBufferComponent,
    LiftReachedBinComponent,
    LoadConveyorBufferComponent,
    MlsSendComponent,
    ToteLiftSendComponent,
    RetrievalConfirmationComponent,
    ConveyorAddressDetailsComponent,
    GroundConveyorStatusComponent,
    BinWiseRetrievalComponent,
    MLSAutoCommandStoreComponent,
    MLSErrorComponent,
    TLAutoCommandStoreComponent,
    TLErrorComponent,
    MLSSemiAutoCommandComponent,
    TLSemiAutoCommandComponent,
    WCSSendModbusComponent,
    EquipmentRequestDetailsComponent,
    OeeTransactionComponent,
    CraneMovementComponent,
    OrderProcessingSummaryComponent,
    OverallEquipmentStatusComponent,
    PrebinningSummaryComponent,
    RetrieveSummaryComponent,
    ConveyorAddressDetailsOpcComponent,
    EquipmentConfigComponent,
    EquipmentIpConfigComponent,
    EquipmentErrorUploadComponent,
    EquipmentsIdleRunningTimeMonitoringComponent,
    MlscurrentstatusComponent,
    DownloadFormatterComponent,
    BinwisePrebininningActionComponent,
    StoreRetrieveDashboardComponent,
    OrderReassignComponent,
    StationManagementComponent

    // RouterModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  imports: [
    NgbPaginationModule, NgbAlertModule,
    FormsModule, NgbDropdownModule,
    BrowserModule, NgxPaginationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule, NgbModule,NgSelect2Module,
    MatSidenavModule,
    MatListModule, AutocompleteLibModule,
    MatButtonModule, HttpClientModule,DragDropModule,
    MatIconModule, NgApexchartsModule, DecimalPipe, AsyncPipe, ReactiveFormsModule,FormsModule
    // RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
