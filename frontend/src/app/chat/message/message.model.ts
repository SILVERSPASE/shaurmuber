export class Message {
  id: number;
  text: string;
  date: string;
  sender: number;
  sender_first_name: string;
  sender_last_name: string;
  dialog: number;
  image: string;

  constructor(id: number, text: string, date: string, sender: number, sender_first_name: string, sender_last_name: string, dialog: number, image: string) {
    this.id = id;
    this.text = text;
    this.date = date;
    this.sender = sender;
    this.sender_first_name = sender_first_name;
    this.sender_last_name = sender_last_name;
    this.dialog = dialog;
    this.image = image;
  }
}

