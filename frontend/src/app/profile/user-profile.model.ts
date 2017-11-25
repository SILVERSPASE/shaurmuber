import { City } from '../cities/model/city';

export class User {
  first_name: string;
  last_name: string;
  email: string;
  uuid: string;
  deleted: boolean;
  purge_date: string;
  rating: number;

  constructor(jsonData: any) {
    for (let i in jsonData) {
      this[i] = jsonData[i];
    }
  }
}

export class Profile {
  image: any;
  rating: number;
  blocked_users: string[];
  phone_number: string;
  card_number: string;
  about_me: string;
  birth_date: string;
  number_of_people_who_vote: number;
  sum_of_rating: number;
  time_passed: any;
  city: any;
  uuid: string;
}

export class PublicUser {
  first_name: string;
  last_name: string;
  image: any;
  uuid: string;
  rating: number;
  email: string;
  phone: string;
  city: string;
  birth_date: string;
  about_me: string;
}
