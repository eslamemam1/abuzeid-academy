import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, PageHero],
  templateUrl: './not-found.html',
})
export class NotFound {}
