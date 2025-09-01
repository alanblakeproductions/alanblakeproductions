import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shot } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';

declare var UIkit: any;

@Component({
  selector: 'app-shotmaker-shot-detail-pane',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './shotmaker-shot-detail-pane.component.html',
  styleUrl: './shotmaker-shot-detail-pane.component.less'
})
export class ShotmakerShotDetailPane implements OnInit {

  @Input() shot$: Subject<Shot> = new Subject();
  shot: Shot | undefined = undefined;

  projectId: string = "";
  status: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private browserStorageService: BrowserStorageService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? "";

    this.shot$.subscribe(shot => {
      if (shot) {
        this.shot = shot;
        this.status = this.browserStorageService.getShotStatus(this.projectId, shot.id);
      }
    });
  }

  moveTo(fromStatus: string, toStatus: string): void {
    if (this.shot) {
      this.browserStorageService.setShotStatus(this.projectId, this.shot.id, toStatus);
      //this.browserStorageService.setShotOrder(this.projectId, toStatus, this.shot.id, 0);
      this.router.navigate(['shotmaker', this.projectId, 'shotlist', fromStatus]);
    }
  }
}
