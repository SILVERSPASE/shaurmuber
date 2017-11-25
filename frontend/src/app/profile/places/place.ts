export class Place {
  constructor(
    public id: number,
    public type: string,
    public user: number,
    public title: string,
    public coordinates: any
  ) { }
}

export class CreatePlace {
  constructor(
    public type: string,
    public user: number,
    public title: string,
    public coordinates: any
  ) { }
}
