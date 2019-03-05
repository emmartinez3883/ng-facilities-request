import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { appService } from './app.service';
import { FacsRequest } from './facsrequest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [appService]
})
export class AppComponent implements OnInit {
  facsRequest: FormGroup;
  mask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  depts = [];
  bldgs = [];
  floors = [];
  rooms = [];
  minStart = new Date(Date.now());
  bldgName: string;
  isEvent: string;
  showProg: boolean;
  requestID: string;
  error: string;

  constructor(private _fb: FormBuilder, private _service: appService) {
    this.facsRequest = _fb.group(
      {
        requestorName: [null, Validators.required],
        requestorPhone: [null, Validators.required],
        requestorEmail: [null, Validators.compose([Validators.required, Validators.email])],
        notify: ['true'],
        department: [null, Validators.required],
        building: [null, Validators.required],
        floor: [null, Validators.required],
        room: [],
        accountNum: [],
        isEvent: [null, Validators.required],
        eventName: [],
        eventStart: [],
        eventEnd: [],
        tables: [null, Validators.max(10)],
        tableSize: [],
        chairs: [null, Validators.max(50)],
        trashBins: [],
        recycleBins: [],
        spclSchedAC: [],
        sprinklersOff: [],
        bldgAttendant: [],
        removeBollards: [],
        bollardLocs: [],
        unlockDoors: [],
        requestText: [null, Validators.required]
      }
    )
  }

  ngOnInit(): void {
    this._service.getDepartments()
      .subscribe(data => { this.depts = data },
        err => { this.error = 'Could not get departments: ' + err }
      );

    this._service.getBuildings()
      .subscribe(data => { this.bldgs = data },
        err => { this.error = 'Could not get buildings: ' + err }
      );
  }

  onBldgSelect(event) {
    this.floors = [];
    this.rooms = [];
    const bldg = event.value.split(';');
    this.toggleMaxValidators(bldg[0]);

    this._service.getFloors(bldg[0])
      .subscribe(data => { this.floors = data },
        err => { this.error = 'Could not get floors: ' + err }
      );

    this.bldgName = bldg[1];
    this.facsRequest.controls['floor'].reset();
  }

  onFloorSelect(event) {
    this.rooms = [];
    const floor = event.value;

    this._service.getRooms(floor)
      .subscribe(data => { this.rooms = data },
        err => { this.error = 'Could not get rooms: ' + err }
      );

    this.facsRequest.controls['room'].reset();
  }

  onRoomSelect(event) {
    const room = event.value;
    this.toggleMaxValidators(room);
  }

  clearEventDetails(event) {
    this.isEvent = event.value;
    if (this.isEvent == 'No') {
      //clear any event details
      this.facsRequest.controls['eventName'].reset();
      this.facsRequest.controls['eventStart'].reset();
      this.facsRequest.controls['eventEnd'].reset();
      this.facsRequest.controls['tables'].reset();
      this.facsRequest.controls['tableSize'].reset();
      this.facsRequest.controls['chairs'].reset();
      this.facsRequest.controls['trashBins'].reset();
      this.facsRequest.controls['recycleBins'].reset();
      this.facsRequest.controls['spclSchedAC'].reset();
      this.facsRequest.controls['sprinklersOff'].reset();
      this.facsRequest.controls['bldgAttendant'].reset();
      this.facsRequest.controls['removeBollards'].reset();
      this.facsRequest.controls['bollardLocs'].reset();
      this.facsRequest.controls['unlockDoors'].reset();
      //disable required fields
      this.facsRequest.controls['eventName'].clearValidators();
      this.facsRequest.controls['eventStart'].clearValidators();
      this.facsRequest.controls['eventEnd'].clearValidators();
    }
    else {
      //enable required fields
      this.facsRequest.controls['eventName'].setValidators(Validators.required);
      this.facsRequest.controls['eventStart'].setValidators(Validators.required);
      this.facsRequest.controls['eventEnd'].setValidators(Validators.required);
    }

    this.facsRequest.controls['eventName'].updateValueAndValidity();
    this.facsRequest.controls['eventStart'].updateValueAndValidity();
    this.facsRequest.controls['eventEnd'].updateValueAndValidity();
  }

  toggleMaxValidators(location: string) {
    //check if the location is exempt from max qty of tables & chairs
    if (location.substring(0, 4) == 'SVRH' || location == 'SCC-155') {
      this.facsRequest.controls['tables'].clearValidators();
      this.facsRequest.controls['chairs'].clearValidators();
    }
    else {
      this.facsRequest.controls['tables'].setValidators(Validators.max(10));
      this.facsRequest.controls['chairs'].setValidators(Validators.max(50));
    }

    this.facsRequest.controls['tables'].updateValueAndValidity();
    this.facsRequest.controls['chairs'].updateValueAndValidity();
  }

  postRequest(facsRequest: FacsRequest) {
    this.requestID = undefined;
    this.showProg = true;
    facsRequest.Building = this.bldgName;

    if (this.isEvent == 'Yes') {
      facsRequest.eventStart = facsRequest.eventStart.toLocaleString().replace(/[^ -~]/g, '');
      facsRequest.eventEnd = facsRequest.eventEnd.toLocaleString().replace(/[^ -~]/g, '');
    }
    this._service.createiRequest(facsRequest)
      .subscribe(resp => {
        this.requestID = resp.NewDataSet.i_WebTMA_Requests[0].ILOG_NUMBER,
          this.facsRequest.reset(),
          this.facsRequest.controls['notify'].setValue(true);
      },
        err => { this.error = 'The request has failed: ' + err },
        () => this.showProg = false
      );
  }
}
