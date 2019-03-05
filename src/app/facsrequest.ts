export class FacsRequest {
    constructor(
        public RequestorName: string,
        public RequestorPhone: string,
        public RequestorEmail: string,
        public Notify: string,
        public Department: string,
        public Building: string,
        public Floor: string,
        public Room: string,
        public AccountNum: string,
        public isEvent: string,
        public EventName: string,
        public eventStart: string,
        public eventEnd: string,
        public Tables: string,
        public TableSize: string,
        public Chairs: string,
        public TrashBins: string,
        public RecycleBins: string,
        public SpclSchedAC: string,
        public SprinklersOff: string,
        public BldgAttendant: string,
        public removeBollards: string,
        public bollardLocs: string,
        public UnlockDoors: string,
        public RequestText: string
    ) { }
}