import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { LeadService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    leads = null;

    constructor(private leadService: LeadService) {}

    ngOnInit() {
        this.leadService.getAll()
            .pipe(first())
            .subscribe(leads => this.leads = leads);
    }

    deleteLead(id: number) {
        const leads = this.leads.find(x => x.id === id);
        leads.isDeleting = true;
        this.leadService.deleteLead(id)
            .pipe(first())
            .subscribe(() => this.leads = this.leads.filter(x => x.id !== id));
    }
}