import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons  } from "ionicons";
import { homeOutline, searchSharp, bookOutline, peopleOutline, star, personCircle  } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab-bar',
    templateUrl: './tab-bar.html',
    styleUrls: ['tab-bar.scss'],
    standalone: true,
    imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon] 
})
export class TabBar {
    constructor(private router: Router) {
        addIcons({ homeOutline,searchSharp, bookOutline, peopleOutline, star, personCircle });
    }
    
    redirect(route: string) {
        this.router.navigateByUrl(`/${route}`);
    }
}