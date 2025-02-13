import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.Module';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../store/actions/user.actions'
import { IUser } from '../../models/userModel';
import { Observable, Subject } from 'rxjs';
import { selectUserProfile } from '../../../store/selectors/user.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  user$: Observable<IUser | null>;
  private unsubscribe$ = new Subject<void>();

  constructor(public store: Store) {
    this.user$ = this.store.select(selectUserProfile);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.getProfile());
    this.user$.subscribe(user => {
      if (user?.isAdmin) {
        this.isAdmin = true;
      }
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
