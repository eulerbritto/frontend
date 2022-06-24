import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { LeadService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    leads = null;

    constructor(private accountService: LeadService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(leads => this.leads = leads);
    }

    deleteUser(id: string) {
        const leads = this.leads.find(x => x.id === id);
        leads.isDeleting = true;
        this.leads.delete(id)
            .pipe(first())
            .subscribe(() => this.leads = this.leads.filter(x => x.id !== id));
    }
}