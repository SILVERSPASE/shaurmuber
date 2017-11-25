import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { Profile, PublicUser } from '../profile/user-profile.model';
import { CityService } from '../cities/service/city.service';
import { CommentsComponent } from '../comments/comments.component';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.less']
})
export class PublicProfileComponent implements OnInit {

  private uuid: string;
  private user: PublicUser;
  private profile: Profile;
  private profilePic: string;
  private city: string;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private profileService: ProfileService,
              private cityService: CityService,
              config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');

    this.profileService
      .getPublicUser(this.uuid)
      .then(user => {
        this.user = user;
      })
      .catch(error => {
        return this.router.navigate(['404']);
      })
      .then(profile => {
        this.profileService
          .getUserProfile(this.uuid)
          .then(userProfile => {
            this.profile = userProfile;
            this.profilePic = userProfile.image;
          })
          .then(profileCity => {
            this.cityService
              .getCity(this.profile.city)
              .then(city => {
                this.city = city[0].city_name;
              });
          });
      });

  }

}
