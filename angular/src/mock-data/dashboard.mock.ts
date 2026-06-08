import { ComparisonJob, TrackingItem, JobStatus, ComparisonDocStatus, TrackingSource, ReviewStatus, SendStatus } from '../app/core/models/types.model';

export const MOCK_DASHBOARD_JOBS: ComparisonJob[] = [
  {
    id: 'JOB-2026-0001',
    reference: 'LEO-2025-0001',
    expiryDate: '2026-06-15',
    createdAt: '2026-06-08T01:00:00Z',
    workflowName: 'LEO Billing',
    assignee: 'Operation Team A',
    status: JobStatus.REVIEW,
    docs: {
      'Commercial Invoice': ComparisonDocStatus.MATCHED,
      'Packing List': ComparisonDocStatus.MATCHED,
      'Bill of Lading': ComparisonDocStatus.MISMATCHED,
      'Customs Declaration': ComparisonDocStatus.RECEIVED
    },
    progress: 75,
    totalDocs: 4,
    foundDocs: 3,
    matchedCount: 2,
    mismatchedCount: 1,
    totalFieldsCount: 32,
    accuracyScore: 88.5,
    tags: ['LEO Billing', 'High Priority']
  },
  {
    id: 'JOB-2026-0002',
    reference: 'JP-TH-2026-00992',
    expiryDate: '2026-06-20',
    createdAt: '2026-06-07T12:00:00Z',
    workflowName: 'FTA HS Code Compliance',
    assignee: 'Operation Team B',
    status: JobStatus.READY,
    docs: {
      'Commercial Invoice': ComparisonDocStatus.MATCHED,
      'Certificate of Origin': ComparisonDocStatus.MATCHED,
      'Packing List': ComparisonDocStatus.MATCHED
    },
    progress: 100,
    totalDocs: 3,
    foundDocs: 3,
    matchedCount: 3,
    mismatchedCount: 0,
    totalFieldsCount: 18,
    accuracyScore: 100,
    tags: ['Japan', 'Form E']
  }
];

export const MOCK_TRACKING_ITEMS: TrackingItem[] = [
  { id: 't-1', fileName: 'INV-CN-2026-00451.pdf', date: '2026-04-25', performer: 'Mail Agent', source: TrackingSource.EMAIL, reviewStatus: ReviewStatus.REVIEWED, sendStatus: SendStatus.SENT, docType: 'Commercial Invoice', ref: 'LEO-2025-0001' },
  { id: 't-2', fileName: 'PKL-CN-2026-00451.xlsx', date: '2026-04-25', performer: 'Mail Agent', source: TrackingSource.EMAIL, reviewStatus: ReviewStatus.REVIEWED, sendStatus: SendStatus.SENT, docType: 'Packing List', ref: 'LEO-2025-0001' },
];
