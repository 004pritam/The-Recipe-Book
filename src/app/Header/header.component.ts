import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthServiceService } from '../auth/auth-service.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    private userSub: Subscription;
    isAuthenticated = false;
    constructor(private dataService: DataStorageService,
                private authService: AuthServiceService) { }
    ngOnInit() {
        this.userSub = this.authService.userSub.subscribe(user => {
            this.isAuthenticated = !!user;
            console.log(user);
            console.log(!user);
            console.log(!!user);
            // if (user) { // if user got it is true
            //     this.isAuthenticated = true;
            // }
        });
    }
    ngOnDestroy(){
        this.userSub.unsubscribe();
    }
    onSaveData() {
        this.dataService.storeRecipes();
    }
    onLogout() {
        this.authService.logout();
    }
    onFetchData() {
        this.dataService.fetchRecipes().subscribe();
    }
}
