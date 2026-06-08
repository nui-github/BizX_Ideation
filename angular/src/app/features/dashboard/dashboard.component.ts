import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrackingService } from '../../core/services/tracking.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { ComparisonJob, TrackingItem, Language, JobStatus, ComparisonDocStatus } from '../../core/models/types.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  jobs: ComparisonJob[] = [];
  trackingItems: TrackingItem[] = [];
  selectedJob: ComparisonJob | null = null;
  
  // App parameters
  language: Language = 'TH';
  searchQuery: string = '';
  statusFilter: string = 'ALL';
  
  // UI States
  isDrawerOpen: boolean = false;
  isStatusGuideOpen: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private trackingService: TrackingService,
    private workflowService: WorkflowService
  ) {}

  ngOnInit(): void {
    // 1. Fetch Comparison Jobs through Service Bridge
    this.trackingService.getComparisonJobs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (jobs) => {
          this.jobs = jobs;
        }
      });

    // 2. Fetch Tracking Data Items
    this.trackingService.getTrackingItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.trackingItems = items;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Filter logic
  get filteredJobs(): ComparisonJob[] {
    return this.jobs.filter(job => {
      const matchesSearch = job.reference.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            (job.workflowName && job.workflowName.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesStatus = this.statusFilter === 'ALL' || job.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  // UI Event handlers
  selectJob(job: ComparisonJob): void {
    this.selectedJob = job;
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedJob = null;
  }

  toggleLanguage(): void {
    this.language = this.language === 'TH' ? 'EN' : 'TH';
  }

  openStatusGuide(): void {
    this.isStatusGuideOpen = true;
  }

  closeStatusGuide(): void {
    this.isStatusGuideOpen = false;
  }

  // Helper utility mappings for HTML indicators
  getDocStatusBadgeClass(status: ComparisonDocStatus): string {
    switch (status) {
      case ComparisonDocStatus.MATCHED:
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case ComparisonDocStatus.MISMATCHED:
        return 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse';
      case ComparisonDocStatus.RECEIVED:
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case ComparisonDocStatus.EXTRACTING:
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case ComparisonDocStatus.MISSING:
        return 'bg-slate-50 text-slate-400 border border-slate-200 border-dashed';
      case ComparisonDocStatus.ERROR:
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-slate-50 text-slate-500 border border-slate-200';
    }
  }

  getJobStatusBadgeClass(status: JobStatus): string {
    switch (status) {
      case JobStatus.NEW:
        return 'bg-sky-50 text-sky-600 border border-sky-200';
      case JobStatus.PENDING:
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case JobStatus.REVIEW:
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      case JobStatus.READY:
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case JobStatus.DONE:
        return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  }
}
