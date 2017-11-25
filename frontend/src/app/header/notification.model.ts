export class Notification {
	text: string;
	action: string

	constructor( jsonData: any )
    {
        for(let i in jsonData){
          this[i] = jsonData[i];
        }
    }
}