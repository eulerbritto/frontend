import { Component } from '@angular/core';

import { Lead, User } from '@app/_models';
import { AccountService, LeadService } from '@app/_services';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent {
    title = 'Bytes';
    activeTab : string = 'Invited';
    onTabClick(tab){
        this.activeTab = tab;
        console.log(tab);
        this.status = tab;
        this.get(this.status);

    }
    user: User;
    leads: Lead[];
    status: string = 'Invited';
    ngOnInit() {
        this.get(this.status);
        //this.leadService.getAllByStatus(this.status).subscribe(leads => this.leads = leads);
    }
    constructor(private accountService: AccountService, private leadService: LeadService) {
        this.user = this.accountService.userValue;
    }

private get(status){
    this.leadService.getAllByStatus(this.status).subscribe(leads => this.leads = leads);
}

    private acceptLead(id){
        this.leadService.acceptLead(id).subscribe();
        this.get(this.status);
    }

    private declineLead(id){
        this.leadService.declineLead(id).subscribe();
        this.get(this.status);
    }
}