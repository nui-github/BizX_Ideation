import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, ArrowRight, Check, AlertCircle, 
  Search, Download, Columns, ChevronLeft, ChevronRight,
  Plus, Trash2, ArrowLeftRight, FileSpreadsheet, File as FileIcon,
  CheckCircle2, XCircle, Info, Eye, EyeOff, Send, Filter, ListFilter, ArrowLeft, Save, RotateCcw,
  LayoutGrid, List, ScanEye, Bot, ChevronDown, Lock, Unlock, HelpCircle, X, Loader2, ShieldCheck, ArrowUpRight, ScanSearch, History, Edit3, UploadCloud, AlertTriangle,
  Printer, RotateCw, ZoomIn, ZoomOut, Menu, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, Tag, Badge, Empty, Button, message } from 'antd';
import { CreateJobModal } from './CreateJobModal';
import { Tooltip } from './Tooltip';
import { 
  Language, ComparisonFile, FieldMapping, TrackingItem, ReviewStatus,
  UserRole, ComparisonJob, JobStatus, ComparisonDocStatus, TrackingSource, SendStatus,
  AuditLog, Workflow
} from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Inbox, FileWarning, Clock, User, Calendar, Mail, UserPlus, UserMinus
} from 'lucide-react';

const LOCAL_T = {
  TH: {
    uploadManageTitle: "อัปโหลดและสะสมกลุ่มเอกสาร (Upload & Multi-File Grouping)",
    uploadManageSubtitle: "อัปโหลดไฟล์เอกสาร PDF/รูปภาพเพิ่มเติม และเลือกจับกลุ่มเพื่อเชื่อมข้อมูลเป็น 1 คอลัมน์สำหรับ OCR และเปรียบเทียบข้อมูลร่วมกัน",
    dropzonePlaceholder: "ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือกไฟล์",
    dropzoneSub: "รองรับ PDF, PNG, JPG, Excel, XML (เลือกหรือลากพร้อมกันได้หลายไฟล์)",
    newUploadedHeader: "ไฟล์ที่เพิ่งอัปโหลดใหม่ (%count% ไฟล์)",
    noFilesUploaded: "ยังไม่มีไฟล์ที่อัปโหลด ดรอปไฟล์ที่นี่เพื่อเริ่มใช้งาน",
    groupHeading: "การจัดกลุ่มเอกสารที่จะ Merge (Grouping Columns)",
    groupHelpText: "เลือกไฟล์ที่อัปโหลดใหม่ด้านซ้ายเพื่อจับกลุ่มเป็นคอลัมน์เดียวกันสำหรับ OCR",
    groupNamePlaceholder: "เช่น Invoice Group, BL Set",
    btnGroupSelected: "เชื่อมและจัดกลุ่มไฟล์ที่เลือก",
    activeGroupsLabel: "กลุ่มเอกสารที่พร้อมนำเข้า (%count% กลุ่ม)",
    individualFilesLabel: "ไฟล์เดี่ยวที่ไม่จัดกลุ่ม (%count% ไฟล์)",
    importToJob: "ยืนยันการบันทึกและนำเข้า Job",
    autoOCRLabel: "เริ่มกระบวนการสกัดข้อมูล (OCR) ทันทีหลังนำเข้าสำเร็จ",
    errorSelectFiles: "กรุณาเลือกไฟล์ที่ต้องการจะจัดกลุ่มอย่างน้อย 1 ไฟล์",
    errorGroupName: "กรุณากรอกชื่อกลุ่มเอกสาร",
    successGroupCreated: "สร้างกลุ่มเอกสารสำเร็จ",
    uploadedTooltip: "อัปโหลดแล้ว",
    ocrGroupedTip: "รวม %count% เอกสาร",
    btnOpenWorkspace: "อัปโหลด / จัดกลุ่มไฟล์",
    btnOpenWorkspaceDesc: "เพิ่มคอลัมน์ OCR ใหม่ผ่าน Drag & Drop",
    replaceModalTitle: "อัปโหลดไฟล์ทดแทน (Replace & Merge)",
    replaceModalSubtitle: "อัปโหลดไฟล์ใหม่เพื่อมาแทนที่หรือเพิ่มในคอลัมน์ \"%column%\" (จำนวนกี่ไฟล์ก็จะถูกรวมเป็นคอลัมน์นี้เพียง 1 คอลัมน์โดยอัตโนมัติอัตโนมัติ)",
    btnConfirmReplace: "ยืนยันการแทนที่และรอ OCR"
  },
  EN: {
    uploadManageTitle: "Upload & Multi-File Grouping Workspace",
    uploadManageSubtitle: "Upload additional PDF/Image source files and select to group them as a unified column for joint OCR and comparison.",
    dropzonePlaceholder: "Drag & drop files here, or click to browse",
    dropzoneSub: "Supports PDF, PNG, JPG, Excel, XML (multiple files allowed)",
    newUploadedHeader: "Newly Uploaded Files (%count% files)",
    noFilesUploaded: "No files uploaded yet. Drag & drop files here to begin.",
    groupHeading: "Document Grouping Option (Merge to Column)",
    groupHelpText: "Select uploaded files on the left to merge them into a single comparison column.",
    groupNamePlaceholder: "e.g., Invoice Group, BL Set",
    btnGroupSelected: "Group Selected Files Together",
    activeGroupsLabel: "Active Groups Ready to Import (%count% groups)",
    individualFilesLabel: "Individual Ungrouped Files (%count% files)",
    importToJob: "Confirm and Import to Job",
    autoOCRLabel: "Auto-run OCR extraction immediately after importing",
    errorSelectFiles: "Please select at least 1 file to group.",
    errorGroupName: "Please enter a group name.",
    successGroupCreated: "Successfully grouped files",
    uploadedTooltip: "Uploaded",
    ocrGroupedTip: "Merged %count% documents",
    btnOpenWorkspace: "Upload & Group Docs",
    btnOpenWorkspaceDesc: "Create new OCR columns via drag & drop",
    replaceModalTitle: "Replace Files (Merge to Column)",
    replaceModalSubtitle: "Upload new files to replace or merge into \"%column%\" (all files will be grouped).",
    btnConfirmReplace: "Confirm Replace & Wait for OCR"
  }
};

interface DataComparisonProps {
  language: Language;
  trackingItems: TrackingItem[];
  role?: UserRole;
}

export const AVAILABLE_DOC_TYPES = [
  'INVOICE',
  'PACKING LIST',
  'AIR WAYBILL',
  'BILL OF LADING',
  'CONTROL SHEET',
  'QUOTATION',
  'CUSTOMS DECLARATION',
  'INSURANCE',
  'IMPORT ENTRY',
  'HS CODE',
  'SHIPPING INSTRUCTIONS',
  'OTHER'
];

const formatDisplayDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      }
  }
  // format: '25 APR 2026 14:20:05' or '25 APR 2026'
  // to: '25/04/2026'
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const d = parts[0].padStart(2, '0');
    const months: Record<string, string> = {"JAN":"01", "FEB":"02", "MAR":"03", "APR":"04", "MAY":"05", "JUN":"06", "JUL":"07", "AUG":"08", "SEP":"09", "OCT":"10", "NOV":"11", "DEC":"12"};
    const m = months[parts[1].toUpperCase()] || '01';
    const y = parts[2];
    return `${d}/${m}/${y}`;
  }
  return dateStr;
};

const formatDisplayDateWithTime = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} | ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      }
  }
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const d = parts[0].padStart(2, '0');
    const months: Record<string, string> = {"JAN":"01", "FEB":"02", "MAR":"03", "APR":"04", "MAY":"05", "JUN":"06", "JUL":"07", "AUG":"08", "SEP":"09", "OCT":"10", "NOV":"11", "DEC":"12"};
    const m = months[parts[1].toUpperCase()] || '01';
    const y = parts[2];
    let time = '';
    if (parts.length > 3) {
        time = ` | ${parts[3]}`;
    }
    return `${d}/${m}/${y}${time}`;
  }
  return dateStr;
};

const parseDateValue = (dateStr: string | undefined): number => {
  if (!dateStr) return 0;
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const d = parts[0].padStart(2, '0');
    const months: Record<string, string> = {"JAN":"01", "FEB":"02", "MAR":"03", "APR":"04", "MAY":"05", "JUN":"06", "JUL":"07", "AUG":"08", "SEP":"09", "OCT":"10", "NOV":"11", "DEC":"12"};
    const m = months[parts[1].toUpperCase()] || '01';
    const y = parts[2];
    const t = parts[3] || '00:00:00';
    return new Date(`${y}-${m}-${d}T${t}`).getTime();
  }
  return new Date(dateStr).getTime() || 0;
};

export const DataComparison: React.FC<DataComparisonProps> = ({ language, trackingItems, role = UserRole.USER }) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState(0); // 0 = Job Grid, 1 = Results
  const [selectedJob, setSelectedJob] = useState<ComparisonJob | null>(null);
  const [files, setFiles] = useState<ComparisonFile[]>([]);
  const [showOnlyDiff, setShowOnlyDiff] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('UPDATE_NEW');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showLockPrompt, setShowLockPrompt] = useState(false);
  const [showClaimPrompt, setShowClaimPrompt] = useState(false);
  const [showUnclaimPrompt, setShowUnclaimPrompt] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(true);
  const [overriddenValues, setOverriddenValues] = useState<Record<string, string>>({}); // field-tIdx -> value
  const [showStatusGuide, setShowStatusGuide] = useState(false);
  const [tempOCRData, setTempOCRData] = useState<Record<string, string>>({});
  const [originalOCRData, setOriginalOCRData] = useState<Record<string, string>>({});
  const [activePdfTab, setActivePdfTab] = useState<'EXTRACTED' | 'LOG'>('EXTRACTED');
  const [zoomLevel, setZoomLevel] = useState<number>(0.89);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [pdfCurrentPage, setPdfCurrentPage] = useState<number>(1);
  const [activeRightTab, setActiveRightTab] = useState<'excel' | 'json'>('excel');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [ocrLogs, setOcrLogs] = useState<{id: string, docName: string, timestamp: string, action: string, details: string, version: number, user: string}[]>([
    { id: 'log-1', docName: 'INVOICE', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'UPLOAD_NEW', details: 'อัปโหลดเอกสารเวอร์ชันเริ่มต้น', version: 1, user: 'System' },
    { id: 'log-2', docName: 'INVOICE', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'EDIT_DATA', details: 'แก้ไขข้อมูลฟิลด์: Consignee Name, Consignee Tax ID', version: 1, user: 'Kunawut W.' },
    { id: 'log-3', docName: 'INVOICE', timestamp: new Date().toISOString(), action: 'EDIT_DATA', details: 'แก้ไขข้อมูลฟิลด์: Port of Discharge', version: 1, user: 'Kunawut W.' },
    { id: 'log-4', docName: 'PACKING LIST', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'UPLOAD_NEW', details: 'อัปโหลดเอกสารเวอร์ชันเริ่มต้น', version: 1, user: 'System' },
    { id: 'log-5', docName: 'PACKING LIST', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'EDIT_DATA', details: 'แก้ไขข้อมูลฟิลด์: Invoice No., Date', version: 1, user: 'Kunawut W.' },
    { id: 'log-6', docName: 'PACKING LIST', timestamp: new Date().toISOString(), action: 'UPLOAD_NEW', details: 'อัปโหลดเวอร์ชันใหม่: rev2', version: 2, user: 'Kunawut W.' }
  ]);
  const [showPdfLogsModal, setShowPdfLogsModal] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeBoardTab, setActiveBoardTab] = useState('jobs');
  const [selectedPendingId, setSelectedPendingId] = useState<string | null>(null);
  const [readPendingIds, setReadPendingIds] = useState<Set<string>>(new Set());
  const [pendingDocTypeSelections, setPendingDocTypeSelections] = useState<Record<string, string>>({});
  const [showRejectPendingModal, setShowRejectPendingModal] = useState(false);
  const [rejectPendingId, setRejectPendingId] = useState<string | null>(null);
  const [showRejectFileModal, setShowRejectFileModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [rejectFileTargetDocName, setRejectFileTargetDocName] = useState<string | null>(null);
  const [pendingFilter, setPendingFilter] = useState('All');
  const [collapsedParts, setCollapsedParts] = useState<Record<string, boolean>>({
    Header: false,
    Description: false,
    Footer: false
  });
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [logFilter, setLogFilter] = useState<'ALL' | 'JOB' | 'PENDING'>('ALL');

  // --- Export Job Modal States ---
  const [showWorkflowWarning, setShowWorkflowWarning] = useState(false);
  const [exportJob, setExportJob] = useState<ComparisonJob | null>(null);
  const [exportOption, setExportOption] = useState<'workflow' | 'custom'>('workflow');
  const [selectedExportWorkflow, setSelectedExportWorkflow] = useState<string>('');
  const [selectedExportPlatform, setSelectedExportPlatform] = useState<string>('FTA');

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Invoice Processing',
    description: 'Processing invoices',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      { 
        id: 'node-create-job-1', 
        type: 'create_job', 
        position: { x: 0, y: 0 }, 
        data: { 
          jobName: 'Logistics ruleset invoice checking', 
          docTypes: ['Invoice', 'Purchase Order', 'Delivery Note'] 
        } 
      },
      {
        id: 'node-output-1',
        type: 'output',
        position: { x: 200, y: 0 },
        data: { label: 'Export Data' }
      }
    ],
    edges: [{ id: 'e1', source: 'node-create-job-1', target: 'node-output-1' }]
  },
  {
    id: 'wf-3',
    name: 'Australia Meat Import Control',
    description: 'Special control for importing Australian meat products',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-create-job-3',
        type: 'create_job',
        position: { x: 0, y: 0 },
        data: {
          jobName: 'Australia Meat Import Control',
          docTypes: ['Invoice', 'Health Cert', 'Import Permit']
        }
      }
    ],
    edges: []
  },
  {
    id: 'wf-4',
    name: 'Maritime Freight Checking',
    description: 'Verification of maritime shipping documentation and rules compliance',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-create-job-4',
        type: 'create_job',
        position: { x: 0, y: 0 },
        data: {
          jobName: 'Maritime Freight Checking',
          docTypes: ['Bill of Lading', 'Packing List', 'Commercial Invoice', 'Certificate of Origin']
        }
      },
      {
        id: 'node-output-4',
        type: 'output',
        position: { x: 200, y: 0 },
        data: { label: 'Export Data' }
      }
    ],
    edges: [{ id: 'e4', source: 'node-create-job-4', target: 'node-output-4' }]
  },
  {
    id: 'wf-5',
    name: 'Customs Declaration Matching',
    description: 'Direct verification of Customs Declaration with single import doc',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-create-job-5',
        type: 'create_job',
        position: { x: 0, y: 0 },
        data: {
          jobName: 'Customs Declaration Matching',
          docTypes: ['Import Entry']
        }
      }
    ],
    edges: []
  },
  {
    id: 'wf-6',
    name: 'Electronics Import Rules',
    description: 'Rules for electronics',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-create-job-6',
        type: 'create_job',
        position: { x: 0, y: 0 },
        data: {
          jobName: 'Electronics Import',
          docTypes: ['Invoice', 'Packing List']
        }
      },
      {
        id: 'node-output-6',
        type: 'output',
        position: { x: 200, y: 0 },
        data: { label: 'Export Data' }
      }
    ],
    edges: [{ id: 'e6', source: 'node-create-job-6', target: 'node-output-6' }]
  },
  {
    id: 'wf-7',
    name: 'ASEAN Trade Agreement',
    description: 'ASEAN trade rules',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-create-job-7',
        type: 'create_job',
        position: { x: 0, y: 0 },
        data: {
          jobName: 'ASEAN Trade',
          docTypes: ['Invoice', 'Packing List']
        }
      },
      {
        id: 'node-output-7',
        type: 'output',
        position: { x: 200, y: 0 },
        data: { label: 'Export Data' }
      }
    ],
    edges: [{ id: 'e7', source: 'node-create-job-7', target: 'node-output-7' }]
  },
  {
    id: 'wf-2',
    name: 'Empty Workflow',
    description: 'Workflow without Job creation node',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [],
    edges: []
  }
];

  const handleConfirmExport = (jobToExport: ComparisonJob) => {
    // Check if the workflow has an output node
    const selectedWorkflowName = selectedExportWorkflow || jobToExport.workflowName;
    const workflow = mockWorkflows.find(wf => wf.name === selectedWorkflowName);
    const hasExportNode = workflow?.nodes.some(node => node.type === 'output');

    if (exportOption === 'workflow' && !hasExportNode) {
       setShowWorkflowWarning(true);
       return;
    }

    // 1. Log export action
    const exportDetails = exportOption === 'workflow'
      ? `Exported using workflow: ${selectedExportWorkflow || jobToExport.workflowName || 'Default'}`
      : `Custom Export to Platform: ${selectedExportPlatform}`;

    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'APPROVE',
        user: 'nuifolio@gmail.com',
        timestamp: new Date().toISOString(),
        details: language === 'TH' 
          ? `ส่งออกข้อมูลรายการสำเร็จ (${exportDetails})` 
          : `Successfully exported job telemetry (${exportDetails})`,
        originalItem: jobToExport
      },
      ...prev
    ]);

    // 2. Transition status of the job in jobs state to DONE
    setJobs(prevJobs => 
      prevJobs.map(j => 
        j.id === jobToExport.id 
          ? { ...j, status: JobStatus.DONE } 
          : j
      )
    );

    // 3. If the exported job is currently selected (in details view), update selected job
    if (selectedJob && selectedJob.id === jobToExport.id) {
      setSelectedJob(prev => prev ? { ...prev, status: JobStatus.DONE } : null);
    }

    // 4. Reset modal state and show success message
    message.success(
      language === 'TH' 
        ? `ส่งออกข้อมูลรายการ "${jobToExport.reference}" ไปยัง "${exportOption === 'workflow' ? (selectedExportWorkflow || jobToExport.workflowName || 'Default') : selectedExportPlatform}" เรียบร้อยแล้ว!` 
        : `Exported "${jobToExport.reference}" to "${exportOption === 'workflow' ? (selectedExportWorkflow || jobToExport.workflowName || 'Default') : selectedExportPlatform}" successfully!`
    );
    setExportJob(null);
  };


  const [activityLogs, setActivityLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      action: 'APPROVE',
      user: 'nuifolio@gmail.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5m ago
      details: 'Approved Email Review: RE: Shipment docs April'
    },
    {
      id: 'log-2',
      action: 'LOCK_JOB',
      user: 'nuifolio@gmail.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15m ago
      details: 'Locked Job SG-TH-2025-00334 for export'
    },
    {
      id: 'log-3',
      action: 'REJECT',
      user: 'system@bizx.ai',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30m ago
      details: 'Rejected Email Review: Urgent Invoice - Missing Attachments',
      originalItem: {
        id: 'p-mock-reject',
        typeBadge: 'Email review',
        title: 'Urgent Invoice - Missing Attachments',
        sub: 'billing@vendor_a.com → finance@bizx.co',
        workflow: 'Finance Approval',
        time: '30m ago',
        status: 'pending',
        sender: 'billing@vendor_a.com',
        to: 'finance@bizx.co',
        subject: 'Urgent Invoice - Missing Attachments',
        body: 'Here is the urgent invoice for PO-8871.',
        attachments: ['INV-8871-mismatch.pdf'],
        aiConfidence: 75,
        aiReasoning: 'อีเมลนี้ถูกตรวจพบว่ามีข้อมูลเอกสารแนบไม่ครบถ้วนตามเงื่อนไข workflow',
        type: 'Email'
      }
    },
    {
      id: 'log-4',
      action: 'CREATE_JOB',
      user: 'import@company.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
      details: 'Created new Job LEO-2025-0045 from Manual Upload'
    },
    {
      id: 'log-5',
      action: 'OCR_DONE',
      user: 'AI Agent (Mail)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
      details: 'Completed data extraction for BL_APR2025.pdf (Accuracy: 98%)'
    },
    {
      id: 'log-6',
      action: 'MISMATCH_DETECTED',
      user: 'AI Agent (Compare)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
      details: 'Found 3 mismatches in Job LEO-2025-0041'
    }
  ]);

  const [pendingInboxItems, setPendingInboxItems] = useState([
    {
      id: 'p-1',
      typeBadge: 'Email review',
      title: 'RE: Shipment docs April',
      sub: 'supplier@co.th → import@company.com',
      workflow: 'LEO Billing',
      time: '2m ago',
      status: 'pending',
      sender: 'supplier@co.th',
      to: 'import@company.com',
      subject: 'RE: Shipment docs April',
      body: 'Please find attached the shipment documents for April batch. Kindly process at your earliest convenience.',
      attachments: ['Invoice_April_v2.pdf', 'BL_APR2025.pdf'],
      aiConfidence: 62,
      aiReasoning: 'email นี้มีความเป็นไปได้ที่จะเกี่ยวข้องกับเอกสารนำเข้า เนื่องจากมีคำว่า "shipment documents" และไฟล์แนบที่มีชื่อตรงกับ pattern แต่ sender ไม่ได้อยู่ใน allowlist จึงส่งมาให้ยืนยัน',
      type: 'Email'
    },
    {
      id: 'p-2',
      typeBadge: 'Doc type',
      title: 'Invoice_April_v2.pdf',
      sub: 'Job LEO-2025-0041',
      workflow: 'LEO Billing',
      time: '5m ago',
      status: 'pending',
      jobNo: 'LEO-2025-0041',
      fileSize: '1.2 MB',
      aiSuggestedType: 'INVOICE',
      aiConfidence: 95,
      aiReasoning: 'ตรวจพบว่าเป็น Invoice แน่นอน แต่อยู่ในขั้นตอนรอการตรวจสอบความถูกต้องของประเภทเอกสารโดยเจ้าหน้าที่',
      type: 'Doc type'
    },
    {
      id: 'p-5',
      typeBadge: 'Email review',
      title: 'FW: New Invoice for Order #9982',
      sub: 'accounts@global.com → invoices@bizx.co',
      workflow: 'Global Logistics',
      time: '45m ago',
      status: 'pending',
      sender: 'accounts@global.com',
      to: 'invoices@bizx.co',
      subject: 'FW: New Invoice for Order #9982',
      body: 'Forwarding the invoice for order #9982. Please verify.',
      attachments: ['INV_9982_GL.pdf'],
      aiConfidence: 89,
      aiReasoning: 'ตรวจพบคำว่า Invoice และหมายเลข Order ที่ถูกต้อง แต่เป็น Forwarded mail จึงต้องการการยืนยันตัวตนเจ้าของข้อมูล',
      type: 'Email'
    },
    {
      id: 'p-6',
      typeBadge: 'Email review',
      title: 'Incomplete KYC - Action Required',
      sub: 'compliance@bank.co → accounts@bizx.co',
      workflow: 'Compliance Check',
      time: '1h ago',
      status: 'pending',
      sender: 'compliance@bank.co',
      to: 'accounts@bizx.co',
      subject: 'Incomplete KYC - Action Required',
      body: 'We noticed some missing fields in your KYC submission. Please re-upload the valid documents.',
      attachments: ['KYC_Status.pdf'],
      aiConfidence: 55,
      aiReasoning: 'ตรวจพบคำสั่งให้แก้ไขเอกสาร (KYC) ซึ่งอาจต้องใช้การพิจารณาจากเจ้าหน้าที่ฝ่ายกฎหมายเพิ่มเติม',
      type: 'Email'
    },
    {
      id: 'p-7',
      typeBadge: 'Email review',
      title: 'Payment notification for PO-8871',
      sub: 'billing@vendor_a.com → finance@bizx.co',
      workflow: 'Finance Approval',
      time: '2h ago',
      status: 'pending',
      sender: 'billing@vendor_a.com',
      to: 'finance@bizx.co',
      subject: 'Payment notification for PO-8871',
      body: 'Attached is the payment receipt for PO-8871. Please confirm receipt.',
      attachments: ['Receipt_8871.pdf'],
      aiConfidence: 82,
      aiReasoning: 'พบความเชื่อมโยงกับ PO และใบเสร็จรับเงิน แต่ระบบต้องการการตรวจสอบความถูกต้องของยอดเงินก่อนอนุมัติ',
      type: 'Email'
    },
    {
      id: 'p-8',
      typeBadge: 'Email review',
      title: 'Missing Signature on Contract #552',
      sub: 'legal@partner.com → management@bizx.co',
      workflow: 'Legal Review',
      time: '3h ago',
      status: 'pending',
      sender: 'legal@partner.com',
      to: 'management@bizx.co',
      subject: 'Missing Signature on Contract #552',
      body: 'The contract #552 is returned as it lacks one of the required signatures. Please sign and return.',
      attachments: ['Contract_552_Draft.pdf'],
      aiConfidence: 70,
      aiReasoning: 'เอกสารสัญญาถูกส่งกลับเนื่องจากลายเซ็นไม่ครบถ้วน จำเป็นต้องตรวจสอบว่าลายเซ็นที่หายไปเป็นของใคร',
      type: 'Email'
    },
    {
      id: 'p-9',
      typeBadge: 'Email review',
      title: 'Refund Request - User ID 1209',
      sub: 'customer@service.com → support@bizx.co',
      workflow: 'Service Support',
      time: '5h ago',
      status: 'pending',
      sender: 'customer@service.com',
      to: 'support@bizx.co',
      subject: 'Refund Request - User ID 1209',
      body: 'I am requesting a refund for my last transaction. Here is the transaction log.',
      attachments: ['Txn_Log_1209.csv'],
      aiConfidence: 45,
      aiReasoning: 'เป็นคำร้องขอคืนเงิน ระบบไม่สามารถตัดสินใจเองได้เนื่องจากเรื่องนโยบายบริษัท',
      type: 'Email'
    },
    {
      id: 'p-10',
      typeBadge: 'Doc type',
      title: 'Quotation_Q1_2026.pdf',
      sub: 'Job LEO-2025-0042',
      workflow: 'LEO Billing',
      time: '1d ago',
      status: 'pending',
      jobNo: 'LEO-2025-0042',
      fileSize: '840 KB',
      aiSuggestedType: 'QUOTATION',
      aiConfidence: 92,
      aiReasoning: 'ตรวจพบว่าเป็น Quotation แต่อาจสับสนกับ Invoice ในบางส่วนของหัวกระดาษ',
      type: 'Doc type'
    },
    {
      id: 'p-11',
      typeBadge: 'Doc type',
      title: 'Packing_List_v4.pdf',
      sub: 'Job LEO-2025-0043',
      workflow: 'LEO Billing',
      time: '1d ago',
      status: 'pending',
      jobNo: 'LEO-2025-0043',
      fileSize: '450 KB',
      aiSuggestedType: 'PACKING LIST',
      aiConfidence: 88,
      aiReasoning: 'โครงสร้างไฟล์ตรงกับ Packing List แต่ชื่อไฟล์มี v4 ซึ่งอาจเป็นเวอร์ชันที่ไม่ล่าสุด',
      type: 'Doc type'
    },
    {
      id: 'p-12',
      typeBadge: 'Doc type',
      title: 'Customs_Declaration_Main.pdf',
      sub: 'Job LEO-2025-0044',
      workflow: 'LEO Billing',
      time: '2d ago',
      status: 'pending',
      jobNo: 'LEO-2025-0044',
      fileSize: '2.1 MB',
      aiSuggestedType: 'CUSTOMS DECLARATION',
      aiConfidence: 90,
      aiReasoning: 'พบเอกสารสำแดงศุลกากร แต่รหัสพิกัดศุลกากร (HS Code) บางส่วนอ่านได้ไม่ชัดเจน',
      type: 'Doc type'
    },
    {
      id: 'p-13',
      typeBadge: 'Doc type',
      title: 'Insurance_Certificate_Final.pdf',
      sub: 'Job LEO-2025-0045',
      workflow: 'LEO Billing',
      time: '2d ago',
      status: 'pending',
      jobNo: 'LEO-2025-0045',
      fileSize: '320 KB',
      aiSuggestedType: 'INSURANCE',
      aiConfidence: 94,
      aiReasoning: 'ใบรับรองประกันภัยมีความสมบูรณ์ แต่ระบบต้องการการตรวจสอบวันสิ้นสุดความคุ้มครอง',
      type: 'Doc type'
    },
    {
      id: 'p-14',
      typeBadge: 'Doc type',
      title: 'Shipping_Instructions_002.pdf',
      sub: 'Job LEO-2025-0046',
      workflow: 'LEO Billing',
      time: '3d ago',
      status: 'pending',
      jobNo: 'LEO-2025-0046',
      fileSize: '1.5 MB',
      aiSuggestedType: 'SHIPPING INSTRUCTIONS',
      aiConfidence: 85,
      aiReasoning: 'คำแนะนำการขนส่งมีรายละเอียดที่ซับซ้อนและมีสาขาปลายทางหลายแห่ง',
      type: 'Doc type'
    }
  ]);

  const handleApprovePending = (id: string) => {
    const item = pendingInboxItems.find(i => i.id === id);
    if (!item) return;

    let assignedType = '';
    if (item.type === 'Doc type') {
       assignedType = pendingDocTypeSelections[id] || item.aiSuggestedType || '';
    }

    message.success(
      language === 'TH' 
        ? `ยืนยันประเภทเอกสาร ${assignedType ? `(${assignedType}) ` : ''}เรียบร้อยแล้ว สำเร็จ` 
        : `Confirmed ${assignedType ? `(${assignedType}) ` : ''}successfully.`
    );
    
    // Add to activity logs
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      action: 'APPROVE',
      user: 'nuifolio@gmail.com',
      timestamp: new Date().toISOString(),
      details: assignedType 
         ? `Confirmed document type as ${assignedType} for ${item.title}` 
         : `Approved ${item.typeBadge}: ${item.title}`
    }, ...prev]);

    setPendingInboxItems(prev => prev.filter(item => item.id !== id));
    if (selectedPendingId === id) setSelectedPendingId(null);
  };

  const handleRejectPending = (id: string) => {
    setRejectPendingId(id);
    setShowRejectPendingModal(true);
  };

  const confirmRejectPending = () => {
    if (!rejectPendingId) return;
    const item = pendingInboxItems.find(i => i.id === rejectPendingId);
    message.error(language === 'TH' ? 'ปฏิเสธรายการและลบไฟล์เรียบร้อยแล้ว' : 'Item rejected and discarded.');
    
    // Add to activity logs
    if (item) {
      setActivityLogs(prev => [{
        id: `log-${Date.now()}`,
        action: 'REJECT',
        user: 'nuifolio@gmail.com',
        timestamp: new Date().toISOString(),
        details: `Rejected ${item.typeBadge}: ${item.title}`,
        originalItem: item
      }, ...prev]);
    }

    setPendingInboxItems(prev => prev.filter(item => item.id !== rejectPendingId));
    if (selectedPendingId === rejectPendingId) setSelectedPendingId(null);
    setShowRejectPendingModal(false);
    setRejectPendingId(null);
  };

  const handleRestorePending = (log: AuditLog) => {
    if (!log.originalItem) return;
    
    const alreadyExists = pendingInboxItems.some(item => item.id === log.originalItem.id);
    if (alreadyExists) {
      message.warning(language === 'TH' ? 'รายการนี้อยู่ใน Inbox เรียบร้อยแล้ว' : 'Item is already in the inbox.');
      return;
    }

    setPendingInboxItems(prev => [log.originalItem, ...prev]);
    
    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'RESTORE',
        user: 'nuifolio@gmail.com',
        timestamp: new Date().toISOString(),
        details: language === 'TH' ? `กู้คืนรายการ "${log.originalItem.title}" กลับสู่ Inbox` : `Restored "${log.originalItem.title}" back to Inbox`
      },
      ...prev
    ]);

    setActivityLogs(current => 
      current.map(item => 
        item.id === log.id 
          ? { ...item, originalItem: undefined } 
          : item
      )
    );

    message.success(language === 'TH' ? 'กู้คืนรายการกลับสู่ Inbox สำเร็จ' : 'Successfully restored item to Inbox.');
  };
  
  // --- Custom States for User File Upload & Grouping ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedLocalFiles, setUploadedLocalFiles] = useState<{
    id: string;
    name: string;
    size: number;
    type: string;
  }[]>([]);
  const [selectedLocalFiles, setSelectedLocalFiles] = useState<Set<string>>(new Set());
  const [groupNameInput, setGroupNameInput] = useState('');
  const [sessionGroups, setSessionGroups] = useState<{
    id: string;
    name: string;
    files: { id: string; name: string; size: number; type: string }[];
  }[]>([]);
  const [autoStartOCR, setAutoStartOCR] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // --- Custom States for Column Replace Feature ---
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceTargetColumn, setReplaceTargetColumn] = useState<string | null>(null);
  const [replaceUploadedFiles, setReplaceUploadedFiles] = useState<{
    id: string;
    name: string;
    size: number;
    type: string;
  }[]>([]);
  const [replaceIsDragging, setReplaceIsDragging] = useState(false);
  const [replaceAutoStartOCR, setReplaceAutoStartOCR] = useState(true);
  const [hiddenLockedDocs, setHiddenLockedDocs] = useState<string[]>([]);
  const [showDeleteColumnConfirmModal, setShowDeleteColumnConfirmModal] = useState(false);
  const [deleteColumnTargetDocName, setDeleteColumnTargetDocName] = useState<string | null>(null);

  // --- Custom Handlers for Column Replace Feature ---
  const handleReplaceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setReplaceIsDragging(true);
  };
  const handleReplaceDragLeave = () => {
    setReplaceIsDragging(false);
  };
  const handleReplaceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setReplaceIsDragging(false);
    if (e.dataTransfer.files) appendReplaceFiles(e.dataTransfer.files);
  };
  const handleReplaceFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) appendReplaceFiles(e.target.files);
  };
  const appendReplaceFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(f => ({
      id: `replace-file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/pdf'
    }));
    setReplaceUploadedFiles(prev => [...prev, ...newFiles]);
  };
  const handleRemoveReplaceFile = (fileId: string) => {
    setReplaceUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  const handleConfirmReplace = () => {
    if (!selectedJob || !replaceTargetColumn) return;
    if (replaceUploadedFiles.length === 0) {
      alert(language === 'TH' ? 'กรุณาอัปโหลดอย่างน้อย 1 ไฟล์' : 'Please upload at least 1 file.');
      return;
    }
    
    // Add activity log for new version
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      docName: replaceTargetColumn,
      timestamp: new Date().toISOString(),
      action: 'UPLOAD_NEW_VERSION',
      details: language === 'TH' ? `อัปโหลดไฟล์เวอร์ชันใหม่ (${replaceUploadedFiles.length} ไฟล์)` : `Uploaded new version (${replaceUploadedFiles.length} files)`,
      version: 2,
      user: 'Kunawut W.'
    };
    setOcrLogs(prev => [newLog, ...prev]);
    
    setJobs(prev => prev.map(job => {
      if (job.id === selectedJob.id) {
        const updatedDocsMap = { ...job.docs, [replaceTargetColumn]: ComparisonDocStatus.RECEIVED };
        const newUpdatedDocsList = job.updatedDocs ? [...job.updatedDocs] : [];
        if (!newUpdatedDocsList.includes(replaceTargetColumn)) {
           newUpdatedDocsList.push(replaceTargetColumn);
        }
        
        let nextStatus = job.status;
        if (job.status === JobStatus.READY) {
          nextStatus = JobStatus.NEW;
        }

        const finalJob = {
          ...job,
          docs: updatedDocsMap,
          updatedDocs: newUpdatedDocsList,
          status: nextStatus
        };
        setSelectedJob(finalJob);

        if (replaceAutoStartOCR) {
          setTimeout(() => {
            handleOCRFiles(job.id, [replaceTargetColumn]);
          }, 300);
        }

        return finalJob;
      }
      return job;
    }));

    setShowReplaceModal(false);
    setReplaceTargetColumn(null);
    setReplaceUploadedFiles([]);
  };

  // --- Custom Handlers for User File Upload & Grouping ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      appendFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      appendFiles(e.target.files);
    }
  };

  const appendFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(f => ({
      id: `local-file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/pdf'
    }));
    setUploadedLocalFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveLocalFile = (fileId: string) => {
    setUploadedLocalFiles(prev => prev.filter(f => f.id !== fileId));
    const nextSelection = new Set(selectedLocalFiles);
    nextSelection.delete(fileId);
    setSelectedLocalFiles(nextSelection);
  };

  const handleRemoveGroup = (groupId: string) => {
    const groupToRemove = sessionGroups.find(g => g.id === groupId);
    if (!groupToRemove) return;
    setUploadedLocalFiles(prev => [...prev, ...groupToRemove.files]);
    setSessionGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const handleImportUploadedDocs = () => {
    if (!selectedJob) return;

    const docsToAdd: Record<string, ComparisonDocStatus> = {};
    const newlyAddedDocNames: string[] = [];

    // 1. Add all groups
    sessionGroups.forEach(g => {
      docsToAdd[g.name] = ComparisonDocStatus.RECEIVED;
      newlyAddedDocNames.push(g.name);
    });

    // 2. Add all remaining ungrouped files
    uploadedLocalFiles.forEach(f => {
      docsToAdd[f.name] = ComparisonDocStatus.RECEIVED;
      newlyAddedDocNames.push(f.name);
    });

    if (newlyAddedDocNames.length === 0) {
      alert(language === 'TH' ? 'ไม่มีเอกสารใหม่สำหรับนำเข้า' : 'No new documents to import.');
      return;
    }

    // 3. Update jobs & selectedJob states
    setJobs(prev => prev.map(job => {
      if (job.id === selectedJob.id) {
        const updatedDocs = { ...job.docs, ...docsToAdd };
        
        let nextStatus = job.status;
        if (job.status === JobStatus.READY) {
          nextStatus = JobStatus.NEW;
        }

        const finalJob = {
          ...job,
          docs: updatedDocs,
          totalDocs: Object.keys(updatedDocs).length,
          status: nextStatus
        };
        setSelectedJob(finalJob);

        // Auto OCR trigger
        if (autoStartOCR) {
          setTimeout(() => {
            handleOCRFiles(job.id, newlyAddedDocNames);
          }, 300);
        }

        return finalJob;
      }
      return job;
    }));

    // Reset Modal states
    setShowUploadModal(false);
    setUploadedLocalFiles([]);
    setSessionGroups([]);
    setSelectedLocalFiles(new Set());
    setGroupNameInput('');
  };

  const PAGE_SIZE = 10;

  const togglePart = (part: string) => {
    setCollapsedParts(prev => ({ ...prev, [part]: !prev[part] }));
  };

  const toggleGroup = (e: React.MouseEvent, group: string) => {
    e.stopPropagation(); // prevent toggling the parent part
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const hasOCRChanges = React.useMemo(() => {
    return JSON.stringify(tempOCRData) !== JSON.stringify(originalOCRData);
  }, [tempOCRData, originalOCRData]);

  const handleSaveOCR = () => {
    if (!pdfPreviewUrl) return;
    const updates: Record<string, string> = { ...overriddenValues };
    
    // Check if any fields were actually changed to record a meaningful log
    const changedFields: string[] = [];
    Object.entries(tempOCRData).forEach(([field, value]) => {
      updates[`${pdfPreviewUrl}_${field}`] = value as string;
      if (originalOCRData[field] !== value) {
        changedFields.push(field);
      }
    });

    if (changedFields.length > 0) {
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        docName: pdfPreviewUrl,
        timestamp: new Date().toISOString(),
        action: 'EDIT_DATA',
        details: language === 'TH' ? `แก้ไขฟิลด์: ${changedFields.join(', ')}` : `Edited fields: ${changedFields.join(', ')}`,
        version: selectedJob?.updatedDocs?.includes(pdfPreviewUrl) ? 2 : 1,
        user: 'Kunawut W.'
      };
      setOcrLogs(prev => [newLog, ...prev]);
    }

    setOverriddenValues(updates);
    setOriginalOCRData({ ...tempOCRData });
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  useEffect(() => {
    if (pdfPreviewUrl && selectedJob) {
      const results = getMockComparisonResults(selectedJob);
      const initialData: Record<string, string> = {};
      results.forEach(res => {
        const target = res.targets.find(t => t.fileName === pdfPreviewUrl);
        if (target && target.status !== 'NA') {
          initialData[res.fieldName] = target.value;
        }
      });
      setTempOCRData(initialData);
      setOriginalOCRData({ ...initialData });
      setZoomLevel(0.89);
      setRotationAngle(0);
      setPdfCurrentPage(1);
      setActiveRightTab('excel');
      setCopiedJson(false);
    }
  }, [pdfPreviewUrl, selectedJob]);

  // Move jobs state to the top
  const [jobs, setJobs] = useState<ComparisonJob[]>([
    {
      id: 'job-001',
      reference: 'CN-TH-2026-00451',
      expiryDate: '25 APR 2026 14:20:05',
      createdAt: '20 APR 2026',
      workflowName: 'Import Logistics Ruleset A',
      assignee: 'Kunawut W.',
      isLocked: true,
      status: JobStatus.READY,
      totalFieldsCount: 363,
      accuracyScore: 100.0,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Packing List': ComparisonDocStatus.LOCKED,
        'FTA / CO': ComparisonDocStatus.LOCKED,
        'B / L': ComparisonDocStatus.LOCKED,
        'Customs Dec': ComparisonDocStatus.LOCKED,
        'Other': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 6,
      foundDocs: 6,
      matchedCount: 6,
      mismatchedCount: 0
    },
    {
      id: 'job-002',
      reference: 'VN-TH-2026-00912',
      expiryDate: '26 APR 2026 09:15:22',
      createdAt: '21 APR 2026',
      workflowName: 'Vietnam Road Freight Rules',
      assignee: 'Somchai T.',
      status: JobStatus.PROCESSING,
      totalFieldsCount: 45,
      accuracyScore: 0.0,
      docs: {
        'Invoice': ComparisonDocStatus.MATCHED,
        'Packing List': ComparisonDocStatus.MATCHED,
        'B / L': ComparisonDocStatus.MATCHED,
        'Road Waybill': ComparisonDocStatus.RECEIVED
      },
      progress: 50,
      totalDocs: 4,
      foundDocs: 3,
      matchedCount: 2,
      mismatchedCount: 0
    },
    {
      id: 'job-003',
      reference: 'JP-TH-2026-00223',
      expiryDate: '27 APR 2026 11:45:00',
      createdAt: '22 APR 2026',
      workflowName: 'Japan Air Freight High-Value',
      assignee: 'Kunawut W.',
      status: JobStatus.REVIEW,
      totalFieldsCount: 363,
      accuracyScore: 30.0,
      docs: {
        'INVOICE': ComparisonDocStatus.MISMATCHED,
        'PACKING LIST': ComparisonDocStatus.MISMATCHED,
        'AIR WAYBILL': ComparisonDocStatus.MATCHED,
        'CONTROL SHEET': ComparisonDocStatus.OCR_DONE,
        'DRAFT FORM E': ComparisonDocStatus.RECEIVED,
        'HBL': ComparisonDocStatus.RECEIVED,
        'FREIGHT INVOICE': ComparisonDocStatus.MISSING,
        'HS CODE': ComparisonDocStatus.MISSING,
        'IMPORT ENTRY': ComparisonDocStatus.MISSING,
        'INSURANCE': ComparisonDocStatus.MISSING
      },
      updatedDocs: ['PACKING LIST', 'INVOICE'],
      progress: 60,
      totalDocs: 10,
      foundDocs: 6,
      matchedCount: 1,
      mismatchedCount: 2
    },
    {
      id: 'job-004',
      reference: 'KR-TH-2026-00567',
      expiryDate: '30 APR 2026 16:30:22',
      createdAt: '23 APR 2026',
      workflowName: 'Korea Cosmetics Processing',
      assignee: 'Nui P.',
      status: JobStatus.PENDING,
      docs: {
        'Invoice': ComparisonDocStatus.MATCHED,
        'Packing List': ComparisonDocStatus.MATCHED,
        'CO': ComparisonDocStatus.MATCHED,
        'B / L': ComparisonDocStatus.RECEIVED,
        'Insurance': ComparisonDocStatus.RECEIVED
      },
      progress: 60,
      totalDocs: 5,
      foundDocs: 3,
      matchedCount: 1,
      mismatchedCount: 0
    },
    {
      id: 'job-005',
      reference: 'TH-DE-2026-00889',
      expiryDate: '01 MAY 2026 10:00:15',
      createdAt: '24 APR 2026',
      workflowName: 'Export Electronics Rules',
      assignee: 'Alice M.',
      status: JobStatus.READY,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Packing List': ComparisonDocStatus.LOCKED,
        'HS Code Cert': ComparisonDocStatus.LOCKED,
        'Form D': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 4,
      foundDocs: 4,
      matchedCount: 4,
      mismatchedCount: 0
    },
    {
      id: 'job-006',
      reference: 'SG-TH-2026-00334',
      expiryDate: '02 MAY 2026 13:40:44',
      createdAt: '24 APR 2026',
      workflowName: 'ASEAN Trade Agreement',
      assignee: 'Nui P.',
      status: JobStatus.READY,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Form D': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 2,
      foundDocs: 2,
      matchedCount: 2,
      mismatchedCount: 0
    },
    {
      id: 'job-007',
      reference: 'CN-TH-2026-00998',
      expiryDate: '05 MAY 2026 11:20:00',
      createdAt: '25 APR 2026',
      workflowName: 'Electronics Import Rules',
      assignee: 'Somchai T.',
      status: JobStatus.READY,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Packing List': ComparisonDocStatus.LOCKED,
        'FTA Cert': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 3,
      foundDocs: 3,
      matchedCount: 3,
      mismatchedCount: 0
    },
    {
      id: 'job-008',
      reference: 'MY-TH-2026-00678',
      expiryDate: '07 MAY 2026 08:20:11',
      createdAt: '25 APR 2026',
      workflowName: 'Malaysia Boundary Cross',
      assignee: 'Kunawut W.',
      status: JobStatus.DONE,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'B/L': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 2,
      foundDocs: 2,
      matchedCount: 2,
      mismatchedCount: 0
    },
    {
      id: 'job-009',
      reference: 'UK-TH-2026-00124',
      expiryDate: '10 MAY 2026 14:00:00',
      createdAt: '26 APR 2026',
      workflowName: 'UK High Value Air Cargo',
      assignee: 'Somchai T.',
      status: JobStatus.NEW,
      docs: {
        'Invoice': ComparisonDocStatus.RECEIVED,
        'Air Waybill': ComparisonDocStatus.RECEIVED
      },
      progress: 40,
      totalDocs: 5,
      foundDocs: 2,
      matchedCount: 0,
      mismatchedCount: 0
    },
    {
      id: 'job-010',
      reference: 'US-TH-2026-00445',
      expiryDate: '12 MAY 2026 09:45:30',
      createdAt: '27 APR 2026',
      workflowName: 'USA Tech Import Standards',
      status: JobStatus.REVIEW,
      docs: {
        'Commercial Invoice': ComparisonDocStatus.MISMATCHED,
        'Cert of Origin': ComparisonDocStatus.MATCHED,
        'Customs Bond': ComparisonDocStatus.MATCHED
      },
      progress: 100,
      totalDocs: 3,
      foundDocs: 3,
      matchedCount: 2,
      mismatchedCount: 1
    },
    {
      id: 'job-011',
      reference: 'AU-TH-2026-00223',
      expiryDate: '15 MAY 2026 11:30:00',
      createdAt: '28 APR 2026',
      workflowName: 'Australia Meat Import Control',
      status: JobStatus.NEW,
      docs: {
        'Invoice': ComparisonDocStatus.RECEIVED,
        'Health Cert': ComparisonDocStatus.MISSING,
        'Import Permit': ComparisonDocStatus.RECEIVED
      },
      progress: 66,
      totalDocs: 3,
      foundDocs: 2,
      matchedCount: 0,
      mismatchedCount: 0
    },
    {
      id: 'job-012',
      reference: 'EU-TH-2026-00778',
      expiryDate: '18 MAY 2026 16:15:00',
      createdAt: '29 APR 2026',
      workflowName: 'EU Fashion & Apparel Rules',
      status: JobStatus.NEW,
      docs: {
        'INVOICE': ComparisonDocStatus.RECEIVED,
        'PACKING LIST': ComparisonDocStatus.RECEIVED,
        'BILL OF LADING': ComparisonDocStatus.RECEIVED
      },
      progress: 30,
      totalDocs: 10,
      foundDocs: 3,
      matchedCount: 0,
      mismatchedCount: 0
    },
    {
      id: 'job-013',
      reference: 'IN-TH-2026-00456',
      expiryDate: '20 MAY 2026 10:20:00',
      createdAt: '30 APR 2026',
      workflowName: 'India Chemicals Processing',
      status: JobStatus.NEW,
      docs: {
        'Invoice': ComparisonDocStatus.OCR_DONE,
        'Packing List': ComparisonDocStatus.OCR_DONE,
        'MSDS': ComparisonDocStatus.RECEIVED,
        'E-SIGNATURE-REPORT': ComparisonDocStatus.RECEIVED,
        'TAXINVOICE_RECEIPT': ComparisonDocStatus.RECEIVED
      },
      progress: 60,
      totalDocs: 5,
      foundDocs: 5,
      matchedCount: 0,
      mismatchedCount: 0
    },
    {
      id: 'job-015',
      reference: 'IN-TH-2026-00999',
      expiryDate: '25 MAY 2026 14:20:05',
      createdAt: '25 MAY 2026',
      workflowName: 'Invoice Processing',
      assignee: 'Kunawut W.',
      status: JobStatus.DONE,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Purchase Order': ComparisonDocStatus.LOCKED,
        'Delivery Note': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 3,
      foundDocs: 3,
      matchedCount: 3,
      mismatchedCount: 0
    },
    {
      id: 'job-016',
      reference: 'CN-TH-2026-00998',
      expiryDate: '05 MAY 2026 11:20:00',
      createdAt: '25 APR 2026',
      workflowName: 'Electronics Import Rules',
      assignee: 'Somchai T.',
      status: JobStatus.DONE,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Packing List': ComparisonDocStatus.LOCKED,
        'Certificate': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 3,
      foundDocs: 3,
      matchedCount: 3,
      mismatchedCount: 0
    },
    {
      id: 'job-017',
      reference: 'SG-TH-2026-00334',
      expiryDate: '02 MAY 2026 13:40:44',
      createdAt: '24 APR 2026',
      workflowName: 'ASEAN Trade Agreement',
      assignee: 'Nui P.',
      status: JobStatus.DONE,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Packing List': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 2,
      foundDocs: 2,
      matchedCount: 2,
      mismatchedCount: 0
    },
    {
      id: 'job-018',
      reference: 'TH-DE-2026-00889',
      expiryDate: '01 MAY 2026 10:00:15',
      createdAt: '24 APR 2026',
      workflowName: 'Export Electronics Rules',
      assignee: 'Alice M.',
      status: JobStatus.DONE,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Packing List': ComparisonDocStatus.LOCKED,
        'Certificate': ComparisonDocStatus.LOCKED,
        'COO': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 4,
      foundDocs: 4,
      matchedCount: 4,
      mismatchedCount: 0
    },
    {
      id: 'job-019',
      reference: 'CN-TH-2026-00451',
      expiryDate: '25 APR 2026 14:20:05',
      createdAt: '20 APR 2026',
      workflowName: 'Import Logistics Ruleset A',
      assignee: 'Kunawut W.',
      status: JobStatus.DONE,
      isLocked: true,
      docs: {
        'Invoice': ComparisonDocStatus.LOCKED,
        'Packing List': ComparisonDocStatus.LOCKED,
        'Certificate': ComparisonDocStatus.LOCKED,
        'COO': ComparisonDocStatus.LOCKED,
        'PL': ComparisonDocStatus.LOCKED,
        'CI': ComparisonDocStatus.LOCKED
      },
      progress: 100,
      totalDocs: 6,
      foundDocs: 6,
      matchedCount: 6,
      mismatchedCount: 0
    }
  ]);


  // Sync selectedJob when jobs state updates (e.g. background processing completes)
  useEffect(() => {
    if (selectedJob) {
      const updated = jobs.find(j => j.id === selectedJob.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedJob)) {
        setSelectedJob(updated);
      }
    }
  }, [jobs, selectedJob]);

  // Reset hidden locked docs when switching jobs
  useEffect(() => {
    setHiddenLockedDocs([]);
  }, [selectedJob?.id]);

  const areAllFilesLocked = React.useMemo(() => {
    if (!selectedJob) return false;
    const docStatuses = Object.values(selectedJob.docs);
    return docStatuses.length > 0 && docStatuses.every(status => status === ComparisonDocStatus.LOCKED);
  }, [selectedJob]);

  const isUnassigned = React.useMemo(() => {
    if (!selectedJob) return true;
    return !selectedJob.assignee || selectedJob.assignee === 'Unassigned' || selectedJob.assignee === '';
  }, [selectedJob]);

  const handleStartComparison = (jobId: string) => {
    // Set to PROCESSING status first
    const markAsProcessing = (currentJobs: ComparisonJob[]) => {
      return currentJobs.map(job => {
        if (job.id === jobId) {
          return { ...job, status: JobStatus.PROCESSING };
        }
        return job;
      });
    };

    setJobs(prev => {
      const updated = markAsProcessing(prev);
      // Immediately sync selectedJob if it's the one being processed
      if (selectedJob && selectedJob.id === jobId) {
        const matching = updated.find(j => j.id === jobId);
        if (matching) setSelectedJob(matching);
      }
      return updated;
    });

    // Simulate delay
    const delay = 3000 + Math.random() * 2000; // 3-5 seconds
    
    setTimeout(() => {
      setJobs(prev => {
        const updated = prev.map(job => {
          if (job.id === jobId) {
            const updatedDocs = { ...job.docs };
            let found = 0;
            
            Object.keys(updatedDocs).forEach(key => {
              if (updatedDocs[key] === ComparisonDocStatus.RECEIVED || 
                  updatedDocs[key] === ComparisonDocStatus.EXTRACTING ||
                  updatedDocs[key] === ComparisonDocStatus.OCR_DONE) {
                const result = Math.random() > 0.3 ? ComparisonDocStatus.MATCHED : ComparisonDocStatus.MISMATCHED;
                updatedDocs[key] = result;
              }
              if (updatedDocs[key] !== ComparisonDocStatus.MISSING) {
                found++;
              }
            });

            // Calculate final counts based on doc statuses
            let matched = 0;
            let mismatched = 0;
            Object.values(updatedDocs).forEach(s => {
              if (s === ComparisonDocStatus.MATCHED || s === ComparisonDocStatus.LOCKED) matched++;
              if (s === ComparisonDocStatus.MISMATCHED) mismatched++;
            });
            
            const allDocsProcessed = Object.values(updatedDocs).every(s => s !== ComparisonDocStatus.EXTRACTING);
            let newStatus = job.status;
            
            if (allDocsProcessed) {
              if (mismatched > 0) {
                newStatus = JobStatus.REVIEW;
              } else {
                // Rule: NEW -> PENDING on first success
                newStatus = JobStatus.PENDING;
              }
            }

            // Trigger prompt if all good
            const results = getMockComparisonResults({ ...job, docs: updatedDocs });
            const allGood = results.every(r => r.targets.every(t => (t.status as string) === 'MATCH' || (t.status as string) === 'SYNONYM' || (t.status as string) === 'NA'));

            if (allGood && found === job.totalDocs && step === 1) {
              setShowLockPrompt(true);
            }

            const finalJob = { 
              ...job, 
              status: newStatus,
              docs: updatedDocs,
              foundDocs: found,
              matchedCount: matched,
              mismatchedCount: mismatched,
              progress: Math.round((found / job.totalDocs) * 100)
            };
            return finalJob;
          }
          return job;
        });

        // Sync selectedJob again after completion
        if (selectedJob && selectedJob.id === jobId) {
          const matching = updated.find(j => j.id === jobId);
          if (matching) setSelectedJob(matching);
        }
        
        return updated;
      });
    }, delay);
  };

  const handleOCRFiles = (jobId: string, docNames: string[]) => {
    // 1. Move specified docs to EXTRACTING
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updatedDocs = { ...job.docs };
        docNames.forEach(name => {
          if (updatedDocs[name] === ComparisonDocStatus.RECEIVED) {
            updatedDocs[name] = ComparisonDocStatus.EXTRACTING;
          }
        });
        const finalJob = { ...job, docs: updatedDocs };
        if (selectedJob?.id === jobId) setSelectedJob(finalJob);
        return finalJob;
      }
      return job;
    }));

    // 2. Wait 5 seconds
    setTimeout(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          const updatedDocs = { ...job.docs };
          docNames.forEach(name => {
            if (updatedDocs[name] === ComparisonDocStatus.EXTRACTING) {
              updatedDocs[name] = ComparisonDocStatus.OCR_DONE;
            }
          });
          const finalJob = { ...job, docs: updatedDocs };
          if (selectedJob?.id === jobId) setSelectedJob(finalJob);
          return finalJob;
        }
        return job;
      }));
    }, 5000); // 5 seconds
  };

  const handleForceLock = () => {
    if (!selectedJob) return;
    
    // Check if we are unlocking or locking
    const isCurrentlyReady = selectedJob.status === JobStatus.READY;

    setJobs(prev => prev.map(job => {
      if (job.id === selectedJob.id) {
        const updatedDocs = { ...job.docs };
        Object.keys(updatedDocs).forEach(k => {
           // Rule: If unlocking, return documents to MATCHED status
           // If locking, set everything to LOCKED.
           if (isCurrentlyReady) {
              if (updatedDocs[k] === ComparisonDocStatus.LOCKED) {
                 updatedDocs[k] = ComparisonDocStatus.MATCHED;
              }
           } else {
              updatedDocs[k] = ComparisonDocStatus.LOCKED;
           }
        });

        const newJobStatus = isCurrentlyReady ? JobStatus.PENDING : JobStatus.READY;
        
        const finalJob = {
           ...job,
           status: newJobStatus,
           docs: updatedDocs,
           isLocked: !isCurrentlyReady
        };

        // Add to activity logs
        setActivityLogs(prev => [{
          id: `log-${Date.now()}`,
          action: isCurrentlyReady ? 'UNLOCK_JOB' : 'LOCK_JOB',
          user: 'nuifolio@gmail.com',
          timestamp: new Date().toISOString(),
          details: `${isCurrentlyReady ? 'Unlocked' : 'Locked'} Job ${job.reference} for ${isCurrentlyReady ? 'review' : 'export'}`
        }, ...prev]);

        setSelectedJob(finalJob);
        return finalJob;
      }
      return job;
    }));
    setShowLockPrompt(false);
  };

  const handleClaimJob = () => {
    if (!selectedJob) return;
    const userEmail = 'nuifolio@gmail.com';
    
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === selectedJob.id) {
        const finalJob = {
          ...job,
          assignee: userEmail
        };
        setSelectedJob(finalJob);
        return finalJob;
      }
      return job;
    }));

    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'CLAIM_JOB',
        user: userEmail,
        timestamp: new Date().toISOString(),
        details: language === 'TH'
          ? `รับงานสำหรับรายการ: ${selectedJob.reference}`
          : `Claimed job: ${selectedJob.reference}`
      },
      ...prev
    ]);

    setShowClaimPrompt(false);
    message.success(
      language === 'TH'
        ? `รับงาน "${selectedJob.reference}" เรียบร้อยแล้ว!`
        : `Claimed job "${selectedJob.reference}" successfully!`
    );
  };

  const handleUnclaimJob = () => {
    if (!selectedJob) return;
    const userEmail = 'nuifolio@gmail.com';

    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === selectedJob.id) {
        const finalJob = {
          ...job,
          assignee: ''
        };
        setSelectedJob(finalJob);
        return finalJob;
      }
      return job;
    }));

    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'UNCLAIM_JOB',
        user: userEmail,
        timestamp: new Date().toISOString(),
        details: language === 'TH'
          ? `ยกเลิกรับงานสำหรับรายการ: ${selectedJob.reference}`
          : `Unclaimed job: ${selectedJob.reference}`
      },
      ...prev
    ]);

    setShowUnclaimPrompt(false);
    message.success(
      language === 'TH'
        ? `ยกเลิกรับงาน "${selectedJob.reference}" เรียบร้อยแล้ว!`
        : `Unclaimed job "${selectedJob.reference}" successfully!`
    );
  };

  const renderStatusGuide = () => {
    const guides = [
      {
        status: JobStatus.NEW,
        color: 'bg-slate-50 border-slate-200 text-slate-500',
        label: language === 'TH' ? 'รอไฟล์ครบ' : 'PENDING FILES',
        desc: language === 'TH' ? 'รายการใหม่ที่ดึงมาจาก Email หรืออัปโหลดเข้ามา (รวมถึงกรณีอัปโหลดและจัดกลุ่มเอกสารใหม่โดยผู้ใช้) และรอการกดยืนยันเพื่ออ่านไฟล์ (OCR)' : 'New jobs fetched from Email or uploaded (including newly grouped document columns uploaded by the user), waiting for manual OCR trigger',
        action: language === 'TH' ? 'กด "อ่านไฟล์" ที่การ์ดเอกสารในหน้า Detail เพื่อเริ่มกระบวนการสกัดข้อมูล' : 'Click "Read File" on doc card in Detail view to start extraction'
      },
      {
        status: 'PROCESSING_OCR',
        color: 'bg-amber-500 text-white',
        label: 'READING FILE',
        desc: language === 'TH' ? 'ระบบ AI กำลังดำเนินการอ่านข้อมูลและระบุประเภทเอกสาร (OCR & Classifier) เช่น Invoice, B/L, Packing List' : 'AI system is reading data and identifying document types (OCR & Classifier) e.g. Invoice, B/L, Packing List',
        action: language === 'TH' ? 'รอระบบทำงาน (ประมาณ 5 วินาทีต่อไฟล์) สถานะเอกสารจะเปลี่ยนเป็น OCR DONE โดยกรองประเภทที่ตรงตามการตั้งค่า' : 'Wait for system (approx. 5 seconds per file), doc status will change to OCR DONE, filtering types configured'
      },
      {
        status: JobStatus.PENDING,
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        label: language === 'TH' ? 'รอดำเนินการ' : 'PENDING',
        desc: language === 'TH' ? 'เปรียบเทียบข้อมูลผ่านแล้ว (Match ทั้งหมด) หรือรอให้ผู้ใช้กดเริ่มการเปรียบเทียบข้อมูล' : 'Comparison passed (All Matched) or waiting for user to start comparison process',
        action: language === 'TH' ? 'หากข้อมูลถูกต้องครบถ้วน ให้กด Lock เอกสารเพื่อเปลี่ยนสถานะเป็น READY' : 'If data is correct, click Lock on documents to change status to READY'
      },
      {
        status: JobStatus.PROCESSING,
        color: 'bg-blue-600 text-white',
        label: 'COMPARING',
        desc: language === 'TH' ? 'ระบบ AI กำลังดำเนินการเปรียบเทียบข้อมูลระหว่างเอกสารตามกฎที่ตั้งไว้' : 'AI system is comparing data between documents based on defined rules',
        action: language === 'TH' ? 'รอระบบทำงาน (อัปเดตสถานะอัตโนมัติเมื่อเสร็จสิ้น)' : 'Wait for system (auto-updates when finished)'
      },
      {
        status: JobStatus.REVIEW,
        color: 'bg-amber-50 border-amber-200 text-amber-700',
        label: 'REVIEW',
        desc: language === 'TH' ? 'พบจุดที่ข้อมูลไม่ตรงกัน (Mismatch) หรือความมั่นใจจำแนกประเภทเอกสารต่ำกว่าเกณฑ์ Auto-accept (%) โดยผ่านพอร์ต Pending Review' : 'Found data mismatch or document classifier confidence is below Auto-accept (%) entering Pending Review port',
        action: language === 'TH' ? 'ตรวจสอบ Matrix Grid, แก้ไขค่าที่ผิด หรือตรวจทานเอกสารใน Pending Review เสมอเพื่อเพิ่มความถูกต้อง' : 'Check Matrix Grid, fix errors, or review documents in Pending Review to ensure correctness'
      },
      {
        status: JobStatus.READY,
        color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        label: 'READY',
        desc: language === 'TH' ? 'เอกสารทั้งหมดในชุดนี้ได้รับการตรวจสอบและล็อก (Lock) เพื่อยืนยันความถูกต้องแล้ว' : 'All documents in this set have been verified and locked to confirm correctness',
        action: language === 'TH' ? 'ข้อมูลถูกล็อกป้องกันการแก้ไข และพร้อมสำหรับการส่งออก (Export/Send)' : 'Data is locked from editing and ready for Export/Send'
      },
      {
        status: 'DOC_UPDATED',
        color: 'bg-blue-50 border-blue-200 text-blue-600',
        label: 'UPDATED BADGE',
        desc: language === 'TH' ? 'ไฟล์มีการอัปเดตเวอร์ชันใหม่ และเตรียมเข้าสู่กระบวนการอ่านไฟล์ใหม่' : 'File version has been updated and is ready to enter the re-reading process',
        action: language === 'TH' ? 'แสดงคู่กับสถานะ "กำลังอ่านไฟล์" และจะหายไปเมื่อไฟล์ถูกลบออกจากคอลัมน์เปรียบเทียบ' : 'Displayed with "Reading File" and disappears when the file is deleted from the comparison column'
      },
      {
        status: JobStatus.DONE,
        color: 'bg-teal-50 border-teal-200 text-teal-700',
        label: language === 'TH' ? 'ส่งออกแล้ว (EXPORTED)' : 'EXPORTED',
        desc: language === 'TH' ? 'รายการตรวจสอบได้รับการส่งออกข้อมูลเรียบร้อยแล้ว' : 'Comparison task was successfully exported',
        action: language === 'TH' ? 'ข้อมูลจะคงอยู่บน Job board เพื่อความโปร่งใส โดยปุ่มทำงานต่างๆ จะถูกแสดงในรูปแบบอ่านอย่างเดียว (Read-only) เพื่อความปลอดภัยสูงสุด' : 'The job persists in the list for transparency while locking any action buttons to ensure data safety via a read-only layout.'
      }
    ];

    return (
      <AnimatePresence>
        {showStatusGuide && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusGuide(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[201] border-l border-slate-200 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <HelpCircle size={18} className="text-blue-600" />
                    Status Guide
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">คู่มือสถานะและการทำงาน</p>
                </div>
                <button 
                  onClick={() => setShowStatusGuide(false)}
                  className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {guides.map((g, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter shadow-sm border ${g.color}`}>
                        {g.label}
                      </span>
                      <div className="flex-1 h-px bg-slate-100"></div>
                    </div>
                    <div className="px-1">
                      <h4 className="text-sm font-black text-slate-800 leading-snug mb-3">{g.desc}</h4>
                      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed flex items-start gap-2">
                           <span className="text-blue-600 font-black uppercase tracking-wider text-[9px] shrink-0 mt-0.5">{language === 'TH' ? 'การดำเนินการ:' : 'Action:'}</span>
                           <span>{g.action}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">BIZX DATA COMPARISON SYSTEM</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  const handleToggleFileLock = (fileName: string) => {
    if (!selectedJob) return;
    setJobs(prev => prev.map(job => {
      if (job.id === selectedJob.id) {
        const currentStatus = job.docs[fileName];
        let newStatus: ComparisonDocStatus;
        
        if (currentStatus === ComparisonDocStatus.LOCKED) {
          // Rule: When unlocking, return to MATCHED status
          newStatus = ComparisonDocStatus.MATCHED;
          setHiddenLockedDocs(prev => prev.filter(name => name !== fileName));
        } else {
          // Rule: Cannot lock if there are mismatches
          if (mismatchedFileNames.has(fileName)) {
            return job;
          }
          newStatus = ComparisonDocStatus.LOCKED;
        }
        
        const updatedDocs = { ...job.docs, [fileName]: newStatus };
        
        // Rule: If ALL files in set are locked -> Auto READY
        const allLocked = Object.values(updatedDocs).every(s => s === ComparisonDocStatus.LOCKED);
        let newJobStatus = job.status;
        if (allLocked) {
          newJobStatus = JobStatus.READY;
        } else if (job.status === JobStatus.READY && !allLocked) {
          newJobStatus = JobStatus.PENDING;
        }

        const finalJob = {
          ...job,
          status: newJobStatus,
          docs: updatedDocs,
          isLocked: allLocked
        };
        if (selectedJob.id === job.id) setSelectedJob(finalJob);
        return finalJob;
      }
      return job;
    }));
  };

  const handleRejectFile = (fileName: string) => {
    if (!selectedJob) return;
    setJobs(prev => prev.map(job => {
      if (job.id === selectedJob.id) {
        const updatedDocs = { ...job.docs, [fileName]: ComparisonDocStatus.MISMATCHED };
        
        // Rule: Reject individual file -> Job becomes REVIEW immediately
        const finalJob = {
          ...job,
          status: JobStatus.REVIEW,
          docs: updatedDocs,
          mismatchedCount: job.mismatchedCount + 1
        };
        if (selectedJob.id === job.id) setSelectedJob(finalJob);
        return finalJob;
      }
      return job;
    }));
  };

  const handleDeleteDocColumn = (fileName: string) => {
    if (!selectedJob) return;
    setJobs(prev => prev.map(job => {
      if (job.id === selectedJob.id) {
        const updatedDocs = { ...job.docs };
        delete updatedDocs[fileName];
        
        // Check if any visible docs remain
        const remainingDocs = Object.keys(updatedDocs).filter(k => updatedDocs[k] !== ComparisonDocStatus.MISSING);
        let newStatus = job.status;
        if (remainingDocs.length === 0) {
          newStatus = JobStatus.NEW;
        }
        
        const finalJob = {
          ...job,
          status: newStatus,
          docs: updatedDocs
        };
        if (selectedJob.id === job.id) {
          setSelectedJob(finalJob);
          if (pdfPreviewUrl === fileName) {
            setPdfPreviewUrl(null);
          }
        }
        return finalJob;
      }
      return job;
    }));
  };

  // Mock data generator for comparison - Logistics specific fields
  const getMockComparisonResults = (job: ComparisonJob) => {
    // Generate realistic logistics data
    const headerFields = [
      { name: 'Consignee Name', source: 'BIZ-TRANS LOGISTICS CO., LTD.', type: 'string', part: 'Header' },
      { name: 'Consignee TAX ID', source: '0105562000000', type: 'string', part: 'Header' },
      { name: 'Incoterm', source: 'FOB', type: 'string', part: 'Header' },
      { name: 'Port of Loading', source: 'SHANGHAI, CHINA', type: 'string', part: 'Header' },
      { name: 'Port of Discharge', source: 'BANGKOK, THAILAND', type: 'string', part: 'Header' },
    ];
    
    // Simulate up to 50 items for demonstration of pagination
    const descriptionFields: any[] = [];
    const TOTAL_ITEMS = 50;
    for (let i = 1; i <= TOTAL_ITEMS; i++) {
       const groupId = `Item ${i}`;
       descriptionFields.push(
         { name: 'Product Description', source: `INDUSTRIAL AUTOMATION SENSOR V${i}`, type: 'string', part: 'Description', group: groupId },
         { name: 'Item No. / Model No. (SKU)', source: `SKU-${10000 + i}`, type: 'string', part: 'Description', group: groupId },
         { name: 'Q\'ty by line', source: `${(i * 12) % 150 || 5}`, type: 'number', part: 'Description', group: groupId },
         { name: 'UOM', source: 'PCS', type: 'string', part: 'Description', group: groupId },
         { name: 'Price / Unit', source: `${(i % 50) + 10}.00`, type: 'number', part: 'Description', group: groupId },
         { name: 'Invoice Amount', source: `${((i * 12) % 150 || 5) * ((i % 50) + 10)}.00`, type: 'number', part: 'Description', group: groupId },
         { name: 'HS Code', source: `8471.30.${(i * 10) % 99}`, type: 'string', part: 'Description', group: groupId }
       );
    }
    
    const footerFields = [
      { name: 'Total Quantity', source: '450', type: 'number', part: 'Footer' },
      { name: 'Total Volume (CBM)', source: '25.50', type: 'number', part: 'Footer' },
      { name: 'Total Net Weight (KGS)', source: '1,100.00', type: 'number', part: 'Footer' },
      { name: 'Total Gross Weight (KGS)', source: '1,250.00', type: 'number', part: 'Footer' },
      { name: 'Vessel / Flight', source: 'MSC ALICIA', type: 'string', part: 'Footer' },
      { name: 'Voyage No.', source: 'V.034S', type: 'string', part: 'Footer' },
      { name: 'Country of Origin', source: 'CHINA', type: 'string', part: 'Footer' },
      { name: 'Freight Charges', source: 'PREPAID', type: 'string', part: 'Footer' },
    ];
    
    const fields = [...headerFields, ...descriptionFields, ...footerFields];

    const synonymRules: Record<string, string[]> = {
      'BIZ-TRANS LOGISTICS CO., LTD.': ['BIZ-TRANS LOGISTICS', 'BIZ-TRANS LOGISTICS (THAILAND) CO., LTD.'],
      'SHANGHAI, CHINA': ['SHANGHAI PORT', 'CN SHA'],
      'BANGKOK, THAILAND': ['BANGKOK PORT', 'TH BKK'],
    };

    return fields.map(f => {
      const docNames = Object.keys(job.docs);
      
      const targets = docNames.map((docName, tIdx) => {
        const docStatus = job.docs[docName];
        
        let value = f.source;
        let status: 'MATCH' | 'MISMATCH' | 'SYNONYM' | 'NA' = 'MATCH';
        let ruleTitle = '';

        // Randomly simulate N/A for certain fields in certain docs
        if ((docName === 'FTA / CO' && f.name === 'Total Quantity')) {
          status = 'NA';
          value = '-';
        } 
        // If file is missing or error
        else if (docStatus === ComparisonDocStatus.MISSING || docStatus === ComparisonDocStatus.ERROR) {
          status = 'NA';
          value = language === 'TH' ? 'รอข้อมูล' : 'WAITING';
        }
        else {
          // Specific overrides for demonstration
          if (job.reference === 'JP-TH-2026-00223') {
             if (f.name === 'Consignee Name' && docName === 'PACKING LIST') {
                value = 'BIZ-TRANS LOGISTICS (THAILA ND) CO., LTD.';
                status = 'SYNONYM';
                ruleTitle = 'Synonym Rule: Entity Alias Mapping';
             } else if (f.name === 'Port of Loading' && docName === 'INVOICE') { // Changed to mismatch
                value = 'CN SHG';
                status = 'MISMATCH';
             } else if (f.name === 'Port of Discharge' && docName === 'PACKING LIST') {
                value = 'BANGKOK PORT';
                status = 'SYNONYM';
                ruleTitle = 'Geocode Mapping: BANGKOK -> PORT';
             } else if (f.name === 'Consignee TAX ID' && docName === 'PACKING LIST') {
                status = 'MISMATCH';
                value = '010556200000X';
             }
             
             // Move line-item specific mismatches to only specific items instead of globally for this job
             if (f.part === 'Description') {
                const groupIdx = parseInt((f.group || '').replace('Item ', ''));
                // Make precisely 8 items mismatch out of 50 to match user request (42 matched, 8 mismatched)
                const mismatchedItems = [3, 7, 12, 19, 24, 31, 42, 48];
                if (mismatchedItems.includes(groupIdx)) {
                   if (f.name === 'Q\'ty by line') {
                      if (docName === 'INVOICE') { value = `MIS_${f.source}`; status = 'MISMATCH'; }
                      if (docName === 'PACKING LIST') { value = `${parseInt(f.source) + 10}`; status = 'MISMATCH'; }
                   } else if (f.name === 'Price / Unit' && docName === 'PACKING LIST') {
                      value = `ERR_${f.source}`;
                      status = 'MISMATCH';
                   } else if (f.name === 'UOM' && groupIdx === 7 && docName === 'PACKING LIST') {
                      value = 'BOX';
                      status = 'MISMATCH';
                   }
                }
             }
          }
          
          if (f.part === 'Footer') {
             if (f.name === 'Total Gross Weight (KGS)' && docName.toUpperCase().includes('PACKING')) {
                value = '1,255.00';
                status = 'MISMATCH';
             } else if (f.name === 'Total Quantity' && (docName.toUpperCase().includes('FORM') || docName.toUpperCase().includes('PACKING') || docName.toUpperCase().includes('B / L'))) {
                value = '440';
                status = 'MISMATCH';
             } else if (f.name === 'Total Volume (CBM)' && (docName.toUpperCase().includes('INVOICE') || docName.toUpperCase().includes('PACKING'))) {
                value = '25.00';
                status = 'MISMATCH';
             } else if (f.name === 'Vessel / Flight' && (docName.toUpperCase().includes('FORM') || docName.toUpperCase().includes('B / L') || docName.toUpperCase().includes('WAYBILL'))) {
                value = 'MSC ALICIA V.2';
                status = 'SYNONYM';
                ruleTitle = 'Synonym Rule: Vessel Name Variation';
             } else if (f.name === 'Country of Origin' && (docName.toUpperCase().includes('FORM') || docName.toUpperCase().includes('CO') || docName.toUpperCase().includes('CERT') || docName.toUpperCase().includes('FTA') || docName.toUpperCase().includes('B / L'))) {
                value = 'PRC';
                status = 'SYNONYM';
                ruleTitle = 'Synonym Rule: Country Alias Mapping';
             } else if (f.name === 'Freight Charges' && docName.toUpperCase().includes('INVOICE')) {
                value = 'COLLECT';
                status = 'MISMATCH';
             }
          }

          if (job.reference === 'SG-TH-2025-00334') {
             if (f.name === 'Consignee Name' && docName === 'Form D') {
                value = 'BIZ-TRANS LOGISTICS';
                status = 'SYNONYM';
                ruleTitle = 'Synonym Rule: Entity Alias Mapping';
             } else if (f.name === 'Port of Loading' && docName === 'Form D') {
                value = 'CN SHA';
                status = 'SYNONYM';
                ruleTitle = 'Geocode Mapping: SHANGHAI -> SHA';
             } else if (f.name === 'Port of Discharge' && docName === 'Form D') {
                value = 'TH BKK';
                status = 'SYNONYM';
                ruleTitle = 'Geocode Mapping: BANGKOK -> BKK';
             }
          }

          // Simulate Synonym match for others if not already set by specific overrides
          if (status === 'MATCH') {
            Object.entries(synonymRules).forEach(([master, syns]) => {
              if (f.source === master && tIdx % 2 === 1) {
                value = syns[Math.floor(Math.random() * syns.length)];
                status = 'SYNONYM';
                ruleTitle = 'Synonym Rule: Geo-location Mapping';
              }
            });
          }

          // Fallback simulation for custom files if not already set by specific overrides
          if (status === 'MATCH') {
            const docUpper = docName.toUpperCase();
            if (docUpper.includes('INV') || docUpper.includes('INVOICE') || docUpper.includes('กลุ่ม')) {
              if (f.name === 'Incoterm' && tIdx % 2 === 1) {
                value = 'CIF';
                status = 'MISMATCH';
              } else if (f.name === 'Consignee Name' && tIdx % 2 === 1) {
                value = 'BIZ-TRANS LOGISTICS (THAILAND) CO., LTD.';
                status = 'SYNONYM';
                ruleTitle = 'Synonym Rule: Entity Alias Mapping';
              }
            } else if (docUpper.includes('BL') || docUpper.includes('B / L') || docUpper.includes('B/L') || docUpper.includes('LADING') || docUpper.includes('WAYBILL')) {
              if (f.name === 'Total Quantity') {
                value = '440';
                status = 'MISMATCH';
              } else if (f.name === 'Vessel / Flight' && tIdx % 2 === 1) {
                value = 'MSC ALICIA V.2';
                status = 'SYNONYM';
                ruleTitle = 'Synonym Rule: Vessel Name Variation';
              }
            }
          }

          // Force mismatch if doc status says so
          if (status === 'MATCH' && docStatus === ComparisonDocStatus.MISMATCHED && f.part !== 'Description') {
            // Only mismatch for first few fields to avoid overwhelming
            if (fields.indexOf(f) < 2) {
               value = `MIS_${f.source}`;
               status = 'MISMATCH';
            }
          }

          // Simulate Mismatch for rejected files
          if (status === 'MATCH' && !['Incoterm'].includes(f.name) && f.part !== 'Description' && f.part !== 'Footer' && (job.id === 'job-002' && f.name.includes('Weight') && docName === 'B / L')) {
            value = `ERR_${f.source}`;
            status = 'MISMATCH';
          }
        }

        // Apply manual overrides if any
        const overrideKey = `${docName}_${f.name}`;
        if (overriddenValues[overrideKey]) {
          value = overriddenValues[overrideKey];
          // Recalculate status based on manual entry vs master
          if (value === f.source) {
            status = 'MATCH';
          } else {
             // Check if it's a synonym
             const syns = synonymRules[f.source] || [];
             if (syns.includes(value)) {
               status = 'SYNONYM';
               ruleTitle = 'Synonym Rule: Manual Entry Accepted';
             } else {
               status = 'MISMATCH';
             }
          }
        }

        // Rule: If document is MATCHED or LOCKED, it should not show mismatches
        if ((docStatus === ComparisonDocStatus.MATCHED || docStatus === ComparisonDocStatus.LOCKED) && status === 'MISMATCH') {
          status = 'MATCH';
          value = f.source;
        }

        return {
          fileId: `target-${tIdx + 1}`,
          fileName: docName,
          value,
          status,
          ruleTitle
        };
      });

      return {
        fieldName: f.name,
        sourceValue: f.source,
        part: f.part,
        group: f.group,
        targets
      };
    });
  };

  const areAllFilesMatched = React.useMemo(() => {
    if (!selectedJob) return false;
    const results = getMockComparisonResults(selectedJob);
    return results.every(r => r.targets.every(t => (t.status as string) === 'MATCH' || (t.status as string) === 'SYNONYM' || (t.status as string) === 'NA'));
  }, [selectedJob]);

  const renderPendingInbox = () => {
    const filterItems = ['All', 'Email', 'Doc type'];
    
    // Sort logic (mocked sequence is already as per created_at)
    const filteredItems = pendingInboxItems.filter(item => 
      pendingFilter === 'All' || item.type === pendingFilter
    );

    const activeItem = filteredItems.find(i => i.id === selectedPendingId) || (selectedPendingId === null ? filteredItems[0] : null);

    return (
      <div className="flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[560px] animate-in fade-in duration-700 font-sans">
        {/* Left Panel: List */}
        <div className="w-[340px] border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-[#010136] tracking-tight flex items-center gap-2 font-sans">
                <Inbox size={18} className="text-[#0463EF]" />
                {language === 'TH' ? 'รายการรอรีวิว' : 'PENDING INBOX'} <span className="text-slate-500 font-bold ml-0.5 font-sans">({pendingInboxItems.length})</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-5">
              {(['All', 'Email', 'Doc type'] as const).map(f => (
                <button 
                  key={f}
                  className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all border font-sans ${
                    pendingFilter === f 
                      ? 'bg-[#0463EF] text-white border-[#0463EF] shadow-md shadow-blue-200' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-[#0463EF]'
                  }`}
                  onClick={() => setPendingFilter(f)}
                >
                  {f === 'Doc type' ? (language === 'TH' ? 'ประเภทเอกสาร' : 'Doc type') : f === 'Email' ? (language === 'TH' ? 'อีเมล' : 'Email') : (language === 'TH' ? 'ทั้งหมด' : 'All')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-1 space-y-2 pb-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className={`mx-3 px-5 py-[18px] cursor-pointer transition-all relative border-l-[3px] rounded-r-2xl ${
                    selectedPendingId === item.id || (!selectedPendingId && filteredItems[0]?.id === item.id)
                      ? 'bg-white border-[#0463EF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-10' 
                      : 'bg-transparent border-transparent hover:bg-white/60 hover:shadow-sm'
                  }`}
                  onClick={() => {
                    setSelectedPendingId(item.id);
                    setReadPendingIds(prev => new Set([...prev, item.id]));
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {!readPendingIds.has(item.id) && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0463EF] shadow-[0_0_8px_rgba(4,99,239,0.4)]"></div>
                    )}
                    <Tag 
                      variant="filled" 
                      className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md m-0 border-none font-sans ${
                        item.typeBadge === 'Email review' ? 'bg-blue-50 text-[#0463EF]' : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      {item.typeBadge}
                    </Tag>
                    <span className="text-[10px] text-slate-400 font-bold ml-auto font-sans">{item.time}</span>
                  </div>
                  <h3 className={`font-black text-[12px] tracking-tight mb-1 truncate font-sans ${
                    !readPendingIds.has(item.id) ? 'text-[#010136]' : 'text-slate-500 font-medium'
                  }`}>
                    {item.title}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-bold tracking-tight truncate font-sans uppercase">
                    {item.sub}
                  </div>
                </div>
              ))
            ) : (
                <div className="py-20 px-8 flex flex-col items-center justify-center text-center">
                    <Inbox className="text-slate-200 mb-4" size={40} />
                    <h4 className="font-black text-slate-800 tracking-tight mb-2 uppercase text-[10px]">ไม่มีงานค้าง</h4>
                </div>
            )}
          </div>
        </div>

        {/* Right Panel: Detail View */}
        <div className="flex-1 bg-white overflow-y-auto">
          {activeItem ? (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Header */}
              <div className="px-8 py-7 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag variant="filled" className="bg-[#0463EF] text-white font-black text-[9px] uppercase tracking-widest rounded-md border-none px-2 py-0.5 font-sans">
                      {activeItem.typeBadge}
                    </Tag>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] font-sans">{activeItem.workflow}</span>
                  </div>
                  <h2 className="text-xl font-black text-[#010136] tracking-tight truncate font-sans">
                    {activeItem.title}
                  </h2>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button 
                    className="h-10 px-6 font-black text-[11px] uppercase tracking-widest border border-rose-500 text-rose-500 bg-white rounded-[4px] hover:bg-[#ff4d4f] hover:text-white hover:border-[#ff4d4f] hover:scale-[1.05] hover:shadow-[0_4px_15px_rgba(255,77,79,0.35)] active:scale-[0.96] transition-all duration-300 font-sans cursor-pointer flex items-center justify-center"
                    onClick={() => handleRejectPending(activeItem.id)}
                  >
                    {language === 'TH' ? 'ปฏิเสธ' : 'REJECT'}
                  </button>
                  <button 
                    className="h-10 px-8 font-black text-[11px] uppercase tracking-widest bg-[#0ab16b] border-none text-white rounded-[4px] hover:bg-[#14d886] hover:text-white hover:scale-[1.05] hover:shadow-[0_4px_15px_rgba(20,216,134,0.45)] active:scale-[0.96] transition-all duration-300 font-sans cursor-pointer flex items-center justify-center"
                    onClick={() => handleApprovePending(activeItem.id)}
                  >
                    {language === 'TH' ? 'อนุมัติ' : 'APPROVE'}
                  </button>
                </div>
              </div>

              {/* Content Sections */}
              <div className="p-8 space-y-10">
                {activeItem.type === 'Email' ? (
                  <>
                {/* Details Section */}
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-7 border-b border-slate-100 pb-3 font-sans">
                    EMAIL DETAILS
                  </h3>
                  
                  <div className="space-y-6 px-4">
                        <div className="flex items-center">
                          <span className="w-32 text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans">FROM</span>
                          <span className="text-[13px] font-black text-[#010136] font-sans">{activeItem.sender}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-32 text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans">TO</span>
                          <span className="text-[13px] font-black text-[#010136] font-sans">{activeItem.to}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-32 text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans">SUBJECT</span>
                          <span className="text-[13px] font-black text-[#0463EF] font-sans">{activeItem.subject}</span>
                        </div>
                        <div className="flex items-start bg-slate-50/60 p-6 rounded-3xl mt-6 border border-slate-100">
                          <span className="w-32 text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1.5 font-sans shrink-0">BODY</span>
                          <p className="flex-1 text-[13px] font-medium text-slate-600 leading-relaxed italic font-sans max-w-2xl">
                            "{activeItem.body}"
                          </p>
                        </div>
                        <div className="flex pt-6 items-center">
                          <span className="w-32 text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans">ATTACHMENTS</span>
                          <div className="flex flex-wrap gap-2.5">
                            {activeItem.attachments?.map(file => (
                              <Tag 
                                key={file} 
                                variant="filled" 
                                onClick={() => {
                                  const matchedJob = jobs.find(j => j.reference === (activeItem.jobNo || 'LEO-2025-0041')) || {
                                    id: activeItem.jobNo || 'job-temp',
                                    reference: activeItem.jobNo || 'LEO-2025-0041',
                                    expiryDate: '10 JUN 2026 18:00:00',
                                    createdAt: '04 JUN 2026',
                                    workflowName: activeItem.workflow || 'LEO Billing',
                                    assignee: 'Kunawut W.',
                                    status: JobStatus.READY,
                                    docs: {
                                      [file]: ComparisonDocStatus.MATCHED,
                                      'Packing List': ComparisonDocStatus.MATCHED,
                                      'B / L': ComparisonDocStatus.MATCHED,
                                    },
                                    progress: 100,
                                    totalDocs: 3,
                                    foundDocs: 3,
                                    matchedCount: 3,
                                    mismatchedCount: 0
                                  };
                                  setSelectedJob(matchedJob);
                                  setPdfPreviewUrl(file);
                                }}
                                className="bg-white border border-slate-200 rounded-xl py-1.5 px-4 text-[11px] font-black text-[#0463EF] flex items-center gap-2.5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer font-sans"
                              >
                                <FileIcon size={16} className="text-slate-400" />
                                {file}
                              </Tag>
                            ))}
                          </div>
                        </div>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <div className="bg-[#f0f7ff] border border-blue-100 rounded-[32px] p-8 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] text-[#0463EF]">
                    <Bot size={140} />
                  </div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[10px] font-black text-[#0463EF] uppercase tracking-[0.25em] flex items-center gap-3 font-sans">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      AI ANALYSIS
                    </h3>
                    <div className="bg-white px-3 py-1 rounded-full text-[#0463EF] font-black text-[10px] tracking-widest shadow-sm font-sans border border-blue-50">
                      {activeItem.aiConfidence}% CONFIDENCE
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-700 leading-relaxed max-w-3xl relative z-10 font-sans">
                    {activeItem.aiReasoning}
                  </p>
                </div>
                  </>
                ) : (
                  <div className="space-y-10">
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col gap-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <FileSpreadsheet size={24} className="text-[#0463EF]" />
                             <h3 className="text-lg font-black text-[#010136] tracking-tight font-sans break-all">{activeItem.title}</h3>
                          </div>
                          <p className="text-[12px] font-bold text-slate-500 font-sans ml-9 flex items-center gap-2">
                            <span>{activeItem.fileSize || '1.2 MB'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{language === 'TH' ? 'ในรายการงาน:' : 'Job:'} {activeItem.jobNo}</span>
                          </p>
                        </div>
                        <Button 
                          type="default"
                          icon={<ScanEye size={15} className="text-[#0463EF]" />}
                          onClick={() => {
                            const matchedJob = jobs.find(j => j.reference === activeItem.jobNo) || {
                              id: activeItem.jobNo || 'job-temp',
                              reference: activeItem.jobNo || 'LEO-2025-0041',
                              expiryDate: '10 JUN 2026 18:00:00',
                              createdAt: '04 JUN 2026',
                              workflowName: activeItem.workflow || 'LEO Billing',
                              assignee: 'Kunawut W.',
                              status: JobStatus.READY,
                              docs: {
                                [activeItem.title]: ComparisonDocStatus.MATCHED,
                                'Packing List': ComparisonDocStatus.MATCHED,
                                'B / L': ComparisonDocStatus.MATCHED,
                              },
                              progress: 100,
                              totalDocs: 3,
                              foundDocs: 3,
                              matchedCount: 3,
                              mismatchedCount: 0
                            };
                            setSelectedJob(matchedJob);
                            setPdfPreviewUrl(activeItem.title);
                          }}
                          className="font-bold border-[#0463EF] text-[#0463EF] hover:bg-blue-50/50 shadow-2xs font-sans h-9"
                          style={{ borderRadius: '4px' }}
                        >
                          {language === 'TH' ? 'ดูไฟล์' : 'View File'}
                        </Button>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-4 border-l-[#0463EF]">
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2">
                             <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[#0463EF]">
                               <Bot size={14} />
                             </div>
                             <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 font-sans">
                               {language === 'TH' ? 'AI แนะนำประเภทเอกสาร:' : 'AI Suggests:'}
                               <span className="bg-[#0463EF] text-white px-2 py-0.5 rounded font-black text-[10px] tracking-wider ml-1">{activeItem.aiSuggestedType || 'UNKNOWN'}</span>
                             </span>
                           </div>
                           <Tag className="m-0 bg-blue-50 border-blue-100 text-[#0463EF] font-black text-[10px] px-3 py-1 flex items-center gap-1.5 font-sans">
                             {activeItem.aiConfidence}% {language === 'TH' ? 'มั่นใจ' : 'CONFIDENCE'}
                           </Tag>
                         </div>
                         <p className="text-[12px] text-slate-500 font-medium italic border-t border-slate-100 pt-3 mt-1 pl-1 font-sans">
                           "{activeItem.aiReasoning}"
                         </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 font-sans px-2 flex items-center justify-between">
                         {language === 'TH' ? 'ยืนยันหรือเลือกประเภทเอกสารที่ถูกต้อง' : 'Confirm or Select Correct Document Type'}
                         {pendingDocTypeSelections[activeItem.id] && (
                           <span className="text-[10px] text-slate-400 normal-case font-medium">{language === 'TH' ? 'กรุณากด Approve เพื่อยืนยัน' : 'Click Approve to confirm'}</span>
                         )}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                         {AVAILABLE_DOC_TYPES.map(type => {
                           const isAiSuggested = activeItem.aiSuggestedType === type;
                           const isSelected = pendingDocTypeSelections[activeItem.id] === type || (!pendingDocTypeSelections[activeItem.id] && isAiSuggested);
                           
                           return (
                             <button
                               key={type}
                               onClick={() => setPendingDocTypeSelections(prev => ({ ...prev, [activeItem.id]: type }))}
                               className={`p-4 rounded-xl border text-left flex flex-col items-start gap-2 transition-all font-sans relative overflow-hidden group ${
                                 isSelected 
                                 ? 'border-[#0463EF] bg-white shadow-[0_4px_12px_rgba(4,99,239,0.1)] ring-1 ring-[#0463EF]' 
                                 : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/50'
                               }`}
                             >
                               <div className="flex items-center justify-between w-full">
                                 <span className={`text-[12px] font-black uppercase tracking-widest line-clamp-1 ${isSelected ? 'text-[#0463EF]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                   {type}
                                 </span>
                                 {isSelected && (
                                   <CheckCircle2 size={16} className="text-[#0463EF] shrink-0" />
                                 )}
                               </div>
                               {isAiSuggested && !isSelected && (
                                 <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded leading-none">AI SUGGESTED</span>
                               )}
                               {isSelected && isAiSuggested && (
                                 <span className="text-[9px] font-black text-[#0463EF] bg-blue-50 px-1.5 py-0.5 rounded leading-none flex items-center gap-1"><Bot size={10} /> AI SUGGESTED</span>
                               )}
                             </button>
                           );
                         })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Select an item to review</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActivityLogs = () => {
    const filteredLogs = activityLogs.filter(log => {
      if (logFilter === 'ALL') return true;
      if (logFilter === 'JOB') return log.details.toLowerCase().includes('job');
      if (logFilter === 'PENDING') return log.details.toLowerCase().includes('email') || log.details.toLowerCase().includes('reject') || log.details.toLowerCase().includes('approve');
      return true;
    });

    return (
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[640px] flex flex-col animate-in fade-in duration-700 font-sans">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <h2 className="text-sm font-black text-[#010136] tracking-tight flex items-center gap-3">
            <Clock size={18} className="text-[#0463EF]" />
            {language === 'TH' ? 'บันทึกประวัติ' : 'ACTIVITY LOGS'}
          </h2>
          <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            {(['ALL', 'JOB', 'PENDING'] as const).map(f => (
              <button
                key={f}
                className={`px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[11px] transition-all font-sans ${
                  logFilter === f 
                    ? 'bg-[#0463EF] text-white shadow-md shadow-blue-200' 
                    : 'text-slate-500 hover:text-[#0463EF] hover:bg-blue-50/50'
                }`}
                onClick={() => setLogFilter(f)}
              >
                {f === 'ALL' ? (language === 'TH' ? 'ทั้งหมด' : 'ALL') :
                 f === 'JOB' ? (language === 'TH' ? 'รายการงาน' : 'JOB') :
                 (language === 'TH' ? 'รายการรอรีวิว' : 'PENDING')}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead className="sticky top-0 bg-white border-b border-slate-100 z-10">
              <tr>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-44">Timestamp</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-56">Actor</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-36">Action</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-8 py-5 align-top">
                    <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                      {new Date(log.timestamp).toLocaleString(language === 'TH' ? 'th-TH' : 'en-US', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </td>
                  <td className="px-8 py-5 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0463EF] flex items-center justify-center border border-blue-100">
                        <User size={14} />
                      </div>
                      <span className="text-[12px] font-black text-slate-700 truncate">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 align-top">
                    <Tag 
                      variant="filled" 
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg m-0 border-none ${
                        log.action.includes('REJECT') ? 'bg-rose-50 text-rose-600' :
                        log.action.includes('APPROVE') || log.action.includes('DONE') ? 'bg-emerald-50 text-emerald-600' :
                        'bg-blue-50 text-[#0463EF]'
                      }`}
                    >
                      {log.action}
                    </Tag>
                  </td>
                  <td className="px-8 py-5 align-top">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[12px] font-bold text-slate-600 leading-relaxed italic group-hover:text-[#010136] transition-colors">
                        "{log.details}"
                      </p>
                      {log.action === 'REJECT' && log.originalItem && (
                        <button
                          type="button"
                          onClick={() => handleRestorePending(log)}
                          className="shrink-0 px-3 py-1 bg-blue-50 hover:bg-[#0463EF] text-[#0463EF] hover:text-white border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer active:scale-95"
                          title={language === 'TH' ? 'กู้คืนรายการกลับสู่ Inbox' : 'Restore back to Inbox'}
                        >
                          <RotateCcw size={11} strokeWidth={3} />
                          {language === 'TH' ? 'กู้คืนสู่อินบ็อกซ์' : 'RESTORE TO INBOX'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    const jobStats = [
      { label: language === 'TH' ? 'งานทั้งหมด' : 'Total Jobs', count: 124, icon: <FileText size={18} />, color: 'bg-slate-50 text-slate-400' },
      { label: language === 'TH' ? 'รอดำเนินการ' : 'Pending', count: 18, icon: <Plus size={18} />, color: 'bg-amber-50 text-amber-500' },
      { label: language === 'TH' ? 'กำลังทำ' : 'In Progress', count: 42, icon: <ArrowLeftRight size={18} />, color: 'bg-blue-50 text-blue-500' },
      { label: language === 'TH' ? 'เสร็จสิ้น' : 'Completed', count: 64, icon: <CheckCircle2 size={18} />, color: 'bg-emerald-50 text-emerald-500' },
    ];

    const getDocIcon = (status: ComparisonDocStatus) => {
      switch (status) {
        case ComparisonDocStatus.MATCHED:
          return (
            <Tooltip content={t.ttMatched}>
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 hover:scale-110 transition-transform cursor-help shadow-sm">
                <Check size={12} strokeWidth={4} />
              </div>
            </Tooltip>
          );
        case ComparisonDocStatus.RECEIVED:
          return (
            <Tooltip content={t.ttProcessing}>
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-help border border-slate-200"></div>
            </Tooltip>
          );
        case ComparisonDocStatus.MISMATCHED:
          return (
            <Tooltip content={t.ttMismatched}>
              <XCircle size={18} className="text-red-500 hover:scale-110 transition-transform cursor-help mx-auto" />
            </Tooltip>
          );
        case ComparisonDocStatus.MISSING:
        default:
          return <div className="w-4 h-[2px] bg-slate-100 mx-auto"></div>;
      }
    };

    const getStatusBadge = (status: JobStatus) => {
      switch (status) {
        case JobStatus.READY:
          return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter inline-flex items-center gap-1.5 font-sans"><div className="w-1 h-1 rounded-full bg-emerald-500"></div>{language === 'TH' ? 'เสร็จสมบูรณ์' : 'READY'}</span>;
        case JobStatus.DONE:
          return <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter inline-flex items-center gap-1.5 font-sans"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>{language === 'TH' ? 'ส่งออกแล้ว' : 'EXPORTED'}</span>;
        case JobStatus.PENDING:
          return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter inline-flex items-center gap-1.5 font-sans"><div className="w-1 h-1 rounded-full bg-blue-500"></div>{language === 'TH' ? 'รอดำเนินการ' : 'PENDING'}</span>;
        case JobStatus.NEW:
          return <span className="bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter inline-flex items-center gap-1.5 font-sans"><div className="w-1 h-1 rounded-full bg-slate-400"></div>{language === 'TH' ? 'รอไฟล์ครบ' : 'PENDING FILES'}</span>;
        case JobStatus.PROCESSING:
          return (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter inline-flex items-center gap-1.5 w-fit font-sans">
              <Loader2 size={10} className="animate-spin" />
              {language === 'TH' ? 'กำลังเปรียบเทียบข้อมูล' : 'COMPARING'}
            </span>
          );
        case JobStatus.REVIEW:
          return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter inline-flex items-center gap-1.5 font-sans"><div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></div>{language === 'TH' ? 'รอตรวจสอบ' : 'REVIEW'}</span>;
        default:
          return null;
      }
    };

    const getProgressColor = (status: JobStatus) => {
      switch (status) {
        case JobStatus.READY: return 'bg-emerald-500';
        case JobStatus.DONE: return 'bg-teal-500';
        case JobStatus.PENDING: return 'bg-blue-500';
        case JobStatus.PROCESSING: return 'bg-blue-600 animate-pulse';
        case JobStatus.REVIEW: return 'bg-amber-500';
        default: return 'bg-slate-300';
      }
    };

    const filteredJobs = jobs
      .filter(job => statusFilter === 'ALL' || job.status === statusFilter)
      .filter(job => jobTypeFilter === 'ALL' || job.workflowName === jobTypeFilter)
      .filter(job => {
        if (assigneeFilter === 'ALL') return true;
        if (assigneeFilter === 'UNASSIGNED') return !job.assignee || job.assignee === 'Unassigned' || job.assignee === '';
        return job.assignee === assigneeFilter;
      })
      .filter(job => 
        job.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.workflowName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.assignee?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const sortedJobs = [...filteredJobs].sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return parseDateValue(b.createdAt) - parseDateValue(a.createdAt);
      } else if (sortBy === 'OLDEST') {
        return parseDateValue(a.createdAt) - parseDateValue(b.createdAt);
      } else if (sortBy === 'UPDATE_NEW') {
        return parseDateValue(b.expiryDate) - parseDateValue(a.expiryDate);
      } else if (sortBy === 'UPDATE_OLD') {
        return parseDateValue(a.expiryDate) - parseDateValue(b.expiryDate);
      }
      return 0;
    });

    const totalPages = Math.ceil(sortedJobs.length / PAGE_SIZE);
    const paginatedJobs = sortedJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Compact Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {jobStats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-lg p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all group cursor-pointer font-sans">
              <div className="flex flex-col">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-[#010136] tracking-tight">{stat.count}</h3>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,234,158,0.4)]"></div>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Actions Header */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 overflow-hidden font-sans">
          <div className="p-4 flex flex-wrap items-center gap-4 border-b border-slate-100 bg-slate-50/20">
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2 font-sans shrink-0">
              <span>สถานะงาน:</span>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl py-2 px-4 pr-10 focus:ring-4 focus:ring-blue-500/10 focus:border-[#0463EF] text-[11px] font-black uppercase tracking-tight appearance-none cursor-pointer outline-none shadow-sm font-sans transition-all"
                >
                  <option value="ALL">{language === 'TH' ? 'ทั้งหมด' : 'ALL'}</option>
                  <option value="NEW">{language === 'TH' ? 'รอไฟล์ครบ' : 'PENDING FILES'}</option>
                  <option value="PROCESSING">{language === 'TH' ? 'กำลังเปรียบเทียบข้อมูล' : 'COMPARING'}</option>
                  <option value="PENDING">{language === 'TH' ? 'รอดำเนินการ' : 'PENDING'}</option>
                  <option value="REVIEW">{language === 'TH' ? 'รอตรวจสอบ' : 'REVIEW'}</option>
                  <option value="READY">{language === 'TH' ? 'เสร็จสมบูรณ์' : 'READY'}</option>
                  <option value="DONE">{language === 'TH' ? 'ส่งออกแล้ว' : 'EXPORTED'}</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans shrink-0">
              <span>ประเภทงาน:</span>
              <div className="relative">
                <select 
                  value={jobTypeFilter}
                  onChange={(e) => {
                    setJobTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl py-2 px-4 pr-10 focus:ring-4 focus:ring-blue-500/10 focus:border-[#0463EF] text-[11px] font-black uppercase tracking-tight appearance-none cursor-pointer outline-none shadow-sm font-sans transition-all w-[180px] truncate"
                >
                  <option value="ALL">ประเภทงานทั้งหมด</option>
                  {Array.from(new Set(jobs.map(j => j.workflowName).filter(Boolean))).map(type => (
                    <option key={type as string} value={type as string}>{type as string}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans shrink-0">
              <span>ผู้รับผิดชอบ:</span>
              <div className="relative">
                <select 
                  value={assigneeFilter}
                  onChange={(e) => {
                    setAssigneeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl py-2 px-4 pr-10 focus:ring-4 focus:ring-blue-500/10 focus:border-[#0463EF] text-[11px] font-black uppercase tracking-tight appearance-none cursor-pointer outline-none shadow-sm font-sans transition-all w-[160px] truncate"
                >
                  <option value="ALL">{language === 'TH' ? 'ผู้รับผิดชอบทั้งหมด' : 'ALL ASSIGNEES'}</option>
                  <option value="UNASSIGNED">{language === 'TH' ? 'ยังไม่ได้มอบหมาย' : 'UNASSIGNED'}</option>
                  {Array.from(new Set(jobs.map(j => j.assignee).filter(Boolean))).map(assignee => (
                    <option key={assignee as string} value={assignee as string}>{assignee as string}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div className="flex-1"></div>
            
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans shrink-0">
              <span>จัดเรียงตาม:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-2 px-4 pr-10 focus:ring-4 focus:ring-blue-500/10 focus:border-[#0463EF] text-[11px] font-black uppercase tracking-tight appearance-none cursor-pointer outline-none shadow-sm font-sans transition-all w-[200px]"
                >
                  <option value="NEWEST">เรียงจากรายการใหม่ไปเก่า</option>
                  <option value="OLDEST">เรียงจากรายการเก่าไปใหม่</option>
                  <option value="UPDATE_NEW">ไฟล์อัปเดทล่าสุดไปเก่า</option>
                  <option value="UPDATE_OLD">ไฟล์อัปเดทเก่าไปล่าสุด</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>
          </div>

          {/* Business Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto font-sans">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-4">{t.jobNo}</th>
                  <th className="px-8 py-4">{language === 'TH' ? 'ประเภทงาน' : 'JOB TYPE'}</th>
                  <th className="px-8 py-4">{language === 'TH' ? 'ผู้รับผิดชอบ' : 'ASSIGNEE'}</th>
                  <th className="px-8 py-4">{language === 'TH' ? 'อัปเดตล่าสุด' : 'LAST UPDATE'}</th>
                  <th className="px-8 py-4 text-center">{language === 'TH' ? 'จำนวนไฟล์' : 'FILES'}</th>
                  <th className="px-8 py-4">{t.status}</th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedJobs.map((job) => {
                    const isProcessing = job.status === JobStatus.PROCESSING;
                    
                    // Logic for OCR counts
                    const docStatuses = Object.values(job.docs);
                    const ocrDoneCount = docStatuses.filter(s => 
                      s !== ComparisonDocStatus.MISSING && 
                      s !== ComparisonDocStatus.RECEIVED && 
                      s !== ComparisonDocStatus.EXTRACTING
                    ).length;
                    const extractingCount = docStatuses.filter(s => 
                      s === ComparisonDocStatus.EXTRACTING
                    ).length;
                    const hasOngoingOCR = docStatuses.some(s => 
                      s === ComparisonDocStatus.RECEIVED || 
                      s === ComparisonDocStatus.EXTRACTING
                    );

                    return (
                  <tr key={job.id} onClick={() => {
                    if (!isProcessing) {
                      setSelectedJob(job);
                      setStep(1);
                    }
                  }} className={`transition-all group ${isProcessing ? 'cursor-not-allowed opacity-80' : 'hover:bg-blue-50/20 cursor-pointer'}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                          job.status === JobStatus.READY ? 'bg-emerald-500 shadow-emerald-200' : 
                          job.status === JobStatus.DONE ? 'bg-teal-500 shadow-teal-200' : 
                          job.status === JobStatus.PENDING ? 'bg-[#0463EF] shadow-blue-200' : 
                          job.status === JobStatus.REVIEW ? 'bg-amber-500 shadow-amber-200' : 
                          job.status === JobStatus.PROCESSING ? 'bg-blue-600 animate-pulse' : 
                          'bg-slate-300'
                        }`}></div>
                        <div>
                          <p className="font-black text-[#010136] text-[13px] tracking-tight mb-0.5">{job.reference}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {language === 'TH' ? 'สร้างเมื่อ: ' : 'CREATED: '} <span className="text-slate-500">{job.createdAt ? formatDisplayDate(job.createdAt) : 'N/A'}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[13px] font-bold text-slate-600 font-sans">{job.workflowName || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[13px] font-bold text-slate-500 font-sans">{job.assignee || (language === 'TH' ? 'ยังไม่ได้มอบหมาย' : 'Unassigned')}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[13px] font-bold text-slate-600 font-sans">{job.expiryDate ? formatDisplayDateWithTime(job.expiryDate) : 'N/A'}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <p className="text-[13px] font-black text-slate-800 tabular-nums">{job.foundDocs ?? Object.values(job.docs).filter(s => s !== ComparisonDocStatus.MISSING).length} / {job.totalDocs}</p>
                    </td>
                    <td className="px-8 py-5">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip content={isProcessing ? t.ttComparing : (hasOngoingOCR ? t.statusReceived + '...' : t.ttStartComparison)}>
                          <button 
                            disabled={job.status === JobStatus.READY || job.status === JobStatus.DONE || isProcessing || hasOngoingOCR}
                            onClick={(e) => {
                              e.stopPropagation();
                              if(window.confirm(t.confirmStartComparison)) {
                                handleStartComparison(job.id);
                              }
                            }}
                            className={`p-2.5 rounded-xl transition-all ${job.status === JobStatus.READY || job.status === JobStatus.DONE || isProcessing || hasOngoingOCR ? 'text-slate-200 cursor-not-allowed' : 'text-[#0463EF] hover:bg-blue-50'}`}
                          >
                            <Bot size={20} className={isProcessing ? 'animate-bounce' : ''} />
                          </button>
                        </Tooltip>

                        <Tooltip content={t.ttViewCompare}>
                          <button 
                            disabled={isProcessing}
                            onClick={() => {
                              setSelectedJob(job);
                              setStep(1);
                            }}
                            className={`p-2.5 rounded-xl transition-all ${isProcessing ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-[#0463EF] hover:bg-blue-50'}`}
                          >
                            <Eye size={20} />
                          </button>
                        </Tooltip>


                        <Tooltip content={t.ttExportNotify}>
                          <button 
                            disabled={job.status !== JobStatus.READY || isProcessing}
                            onClick={() => {
                              const workflow = mockWorkflows.find(wf => wf.name === job.workflowName);
                              const hasExportNode = workflow?.nodes.some(node => node.type === 'output');
                              if (!hasExportNode) {
                                setShowWorkflowWarning(true);
                              } else {
                                setExportJob(job);
                                setExportOption('workflow');
                                setSelectedExportWorkflow(job.workflowName || '');
                                setSelectedExportPlatform('FTA');
                              }
                            }}
                            className={`p-2.5 transition-all rounded-xl ${job.status === JobStatus.READY && !isProcessing ? 'text-[#0463EF] hover:bg-blue-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed'}`}
                          >
                            <Send size={20} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between font-sans">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  {language === 'TH' ? 'แสดง' : 'Showing'} <span className="text-slate-800">{Math.min(sortedJobs.length, (currentPage - 1) * PAGE_SIZE + 1)}</span> {language === 'TH' ? 'ถึง' : 'to'} <span className="text-slate-800">{Math.min(sortedJobs.length, currentPage * PAGE_SIZE)}</span> {language === 'TH' ? 'จากทั้งหมด' : 'of'} <span className="text-slate-800">{sortedJobs.length}</span> {language === 'TH' ? 'รายการ' : 'items'}
                </div>
                <div className="flex items-center gap-5">
                  <button 
                    disabled={currentPage === 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPage(prev => Math.max(1, prev - 1));
                    }}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button 
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPage(i + 1);
                        }}
                        className={`w-10 h-10 rounded-lg font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-slate-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    }}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
        </div>

      </div>
    );
  };

  const visibleDocs = React.useMemo(() => {
    if (!selectedJob) return [];
    return Object.entries(selectedJob.docs).filter(([_, status]) => status !== ComparisonDocStatus.MISSING);
  }, [selectedJob]);

  const comparedDocs = React.useMemo(() => {
    if (!selectedJob) return [];
    // Show all visible docs as columns to avoid losing info when sidebar is collapsed, excluding hidden locked docs
    return Object.keys(selectedJob.docs).filter(docName => 
      selectedJob.docs[docName] !== ComparisonDocStatus.MISSING &&
      !hiddenLockedDocs.includes(docName)
    );
  }, [selectedJob, hiddenLockedDocs]);

  const unvalidatedDocs = React.useMemo(() => {
    if (!selectedJob) return new Set<string>();
    const unvalidated = new Set<string>();
    Object.entries(selectedJob.docs).forEach(([docName, status]) => {
      if (status === ComparisonDocStatus.RECEIVED || 
          status === ComparisonDocStatus.EXTRACTING ||
          status === ComparisonDocStatus.OCR_DONE) {
        unvalidated.add(docName);
      }
    });
    return unvalidated;
  }, [selectedJob]);

  const comparisonResults = React.useMemo(() => {
    if (!selectedJob) return [];
    const baseResults = getMockComparisonResults(selectedJob);
    
    // Filter targets to only include docs that are actually compared
    return baseResults.map(res => ({
      ...res,
      targets: res.targets.filter(t => comparedDocs.includes(t.fileName)).map(t => ({
        ...t,
        status: unvalidatedDocs.has(t.fileName) ? 'WAITING' as any : t.status
      }))
    }));
  }, [selectedJob, overriddenValues, comparedDocs, unvalidatedDocs]);

  const allComparisonResults = React.useMemo(() => {
    if (!selectedJob) return [];
    const baseResults = getMockComparisonResults(selectedJob);
    return baseResults.map(res => ({
      ...res,
      targets: res.targets.map(t => ({
        ...t,
        status: unvalidatedDocs.has(t.fileName) ? 'WAITING' as any : t.status
      }))
    }));
  }, [selectedJob, overriddenValues, unvalidatedDocs]);

  const mismatchedFileNames = React.useMemo(() => {
    const set = new Set<string>();
    allComparisonResults.forEach(res => {
      res.targets.forEach(t => {
        if (t.status === 'MISMATCH') {
          set.add(t.fileName);
        }
      });
    });
    return set;
  }, [allComparisonResults]);

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
      {renderStatusGuide()}

      {/* Upload and Multi-File Grouping Modal Panel */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-100 font-sans">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                  <Upload size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 tracking-tight text-lg leading-tight antialiased">
                    {LOCAL_T[language].uploadManageTitle}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 max-w-xl">
                    {LOCAL_T[language].uploadManageSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedLocalFiles([]);
                  setSessionGroups([]);
                  setSelectedLocalFiles(new Set());
                  setGroupNameInput('');
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                id="close-upload-modal-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Split Grid */}
            <div className="flex-1 overflow-hidden flex divide-x divide-slate-100 bg-slate-50/20">
              {/* Left Pane - Upload files */}
              <div className="w-1/2 p-6 flex flex-col overflow-auto">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('local-file-uploader')?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99] shadow-inner shadow-indigo-100' 
                      : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/10'
                  }`}
                  id="dropzone-container"
                >
                  <input
                    type="file"
                    id="local-file-uploader"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.xml"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 shadow-sm border border-indigo-100">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {LOCAL_T[language].dropzonePlaceholder}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    {LOCAL_T[language].dropzoneSub}
                  </p>
                </div>

                {/* Uploaded Files Section */}
                <div className="mt-6 flex-1 flex flex-col overflow-hidden">
                  <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-3 flex items-center justify-between">
                    <span>
                      {LOCAL_T[language].newUploadedHeader.replace('%count%', String(uploadedLocalFiles.length))}
                    </span>
                    {uploadedLocalFiles.length > 0 && (
                      <span className="text-[9px] text-indigo-500 lowercase font-bold tracking-tight bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.5 rounded-full">
                        {language === 'TH' ? 'คลิกเลือกไฟล์เพื่อนำไปจัดกลุ่ม' : 'Select files to group'}
                      </span>
                    )}
                  </h4>
                  {uploadedLocalFiles.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200/60 rounded-2xl p-8 bg-white/50 text-slate-400">
                      <FileIcon size={32} className="opacity-25 mb-2.5" />
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-center">
                        {LOCAL_T[language].noFilesUploaded}
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-auto pr-1 flex flex-col gap-2">
                      {uploadedLocalFiles.map(file => {
                        const isSelected = selectedLocalFiles.has(file.id);
                        return (
                          <div
                            key={file.id}
                            onClick={() => {
                              const next = new Set(selectedLocalFiles);
                              if (next.has(file.id)) {
                                next.delete(file.id);
                              } else {
                                next.add(file.id);
                              }
                              setSelectedLocalFiles(next);
                            }}
                            className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between group/file cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-200 shadow-sm shadow-indigo-100/50'
                                : 'bg-white border-slate-150 hover:bg-slate-50 hover:border-slate-250 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Checkbox */}
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white group-hover/file:border-indigo-400'
                              }`}>
                                {isSelected && <Check size={10} strokeWidth={4} />}
                              </div>
                              {/* File icon */}
                              <div className={`p-2 rounded-xl border ${isSelected ? 'bg-indigo-100/50 text-indigo-600 border-indigo-200/50' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                <FileIcon size={14} />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className={`text-[11px] font-bold truncate max-w-[200px] leading-tight ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                  {file.name}
                                </span>
                                <span className="text-[8px] font-mono text-slate-400 leading-none mt-0.5 font-bold">
                                  {(file.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLocalFile(file.id);
                              }}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover/file:opacity-100 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Pane - Column Grouping Tool */}
              <div className="w-1/2 p-6 flex flex-col justify-between overflow-auto bg-slate-50/30">
                <div className="flex flex-col gap-6">
                  {/* Group Form */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-left">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2 mb-1.5 antialiased">
                      <Columns size={12} className="text-indigo-500 shrink-0" />
                      {LOCAL_T[language].groupHeading}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 leading-relaxed">
                      {LOCAL_T[language].groupHelpText}
                    </p>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col text-left">
                        <label className="text-[8px] font-black tracking-widest uppercase text-slate-400 mb-1">
                          {language === 'TH' ? 'ชื่อกลุ่ม (Column Group Name)' : 'Group name'}
                        </label>
                        <input
                          type="text"
                          placeholder={LOCAL_T[language].groupNamePlaceholder}
                          value={groupNameInput}
                          onChange={(e) => setGroupNameInput(e.target.value)}
                          className="w-full text-xs font-bold border border-slate-200 outline-none p-3.5 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all bg-slate-50/50"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const filesToGroup = uploadedLocalFiles.filter(f => selectedLocalFiles.has(f.id));
                          if (filesToGroup.length === 0) {
                            alert(LOCAL_T[language].errorSelectFiles);
                            return;
                          }
                          const name = groupNameInput.trim() || (language === 'TH' ? `กลุ่ม Invoice ${sessionGroups.length + 1}` : `Invoice Group ${sessionGroups.length + 1}`);
                          
                          const newGroup = {
                            id: `group-${Date.now()}`,
                            name: `${name} (${filesToGroup.length} files)`,
                            files: filesToGroup
                          };
                          
                          setSessionGroups(prev => [...prev, newGroup]);
                          setUploadedLocalFiles(prev => prev.filter(f => !selectedLocalFiles.has(f.id)));
                          setSelectedLocalFiles(new Set());
                          setGroupNameInput('');
                        }}
                        disabled={selectedLocalFiles.size === 0}
                        className="w-full py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all text-white bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-md shadow-indigo-100/50 cursor-pointer"
                      >
                        <Plus size={14} />
                        {LOCAL_T[language].btnGroupSelected}
                      </button>
                    </div>
                  </div>

                  {/* Active Groups Ready for Column Import */}
                  <div className="flex flex-col text-left">
                    <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-3 text-left">
                      {LOCAL_T[language].activeGroupsLabel.replace('%count%', String(sessionGroups.length))}
                    </h4>
                    {sessionGroups.length === 0 ? (
                      <div className="p-5 border border-dashed border-slate-200/70 rounded-2xl bg-white text-center text-slate-400">
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                          {language === 'TH' ? 'ยังไม่ได้จัดกลุ่ม (ไฟล์เดี่ยวจะถูกนำเข้าแยกปกติ)' : 'No groups created yet. (Ungrouped files will import individually)'}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-[200px] overflow-auto pr-1">
                        {sessionGroups.map(group => (
                          <div
                            key={group.id}
                            className="p-4 bg-white border border-indigo-100 rounded-2xl flex items-start justify-between shadow-sm animate-in zoom-in-95 duration-200 text-left"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50 mt-0.5">
                                <Columns size={12} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-[12px] font-black text-slate-800 tracking-tight leading-snug">
                                  {group.name}
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                  {group.files.map(gf => (
                                    <span key={gf.id} className="text-[7.5px] font-black uppercase text-indigo-700 bg-indigo-50/50 border border-indigo-100/50 px-1.5 py-0.5 rounded-md flex items-center gap-1 leading-none">
                                      <FileIcon size={8} />
                                      {gf.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveGroup(group.id)}
                              className="p-1 px-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors text-[9px] font-black uppercase tracking-wider shrink-0 cursor-pointer"
                            >
                              {language === 'TH' ? 'ยกเลิก' : 'Ungroup'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Individual Ungrouped Files List */}
                  {uploadedLocalFiles.length > 0 && (
                    <div className="flex flex-col text-left border-t border-slate-100/80 pt-4">
                      <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">
                        {LOCAL_T[language].individualFilesLabel.replace('%count%', String(uploadedLocalFiles.length))}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-auto">
                        {uploadedLocalFiles.map(file => (
                          <span key={file.id} className="text-[8px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm leading-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Import Bottom Row */}
                <div className="border-t border-slate-100 pt-5 mt-6 flex flex-col gap-4">
                  {/* Auto OCR Option Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer self-start p-1.5 hover:bg-slate-100/50 rounded-lg group select-none transition-colors">
                    <input
                      type="checkbox"
                      checked={autoStartOCR}
                      onChange={(e) => setAutoStartOCR(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-100 shrink-0 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide group-hover:text-slate-800 leading-none">
                      {LOCAL_T[language].autoOCRLabel}
                    </span>
                  </label>

                  <button
                    onClick={handleImportUploadedDocs}
                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    id="submit-upload-import-btn"
                  >
                    {LOCAL_T[language].importToJob}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replace Column File Modal */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-100 font-sans">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                  <ArrowLeftRight size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 tracking-tight text-lg leading-tight antialiased">
                    {LOCAL_T[language].replaceModalTitle}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {LOCAL_T[language].replaceModalSubtitle.replace('%column%', replaceTargetColumn || '')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReplaceModal(false);
                  setReplaceTargetColumn(null);
                  setReplaceUploadedFiles([]);
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                id="close-replace-modal-btn"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 bg-slate-50/30 flex flex-col gap-6">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleReplaceDragOver}
                onDragLeave={handleReplaceDragLeave}
                onDrop={handleReplaceDrop}
                onClick={() => document.getElementById('replace-file-uploader')?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  replaceIsDragging 
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99] shadow-inner shadow-indigo-100' 
                    : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/10'
                }`}
                id="replace-dropzone-container"
              >
                <input
                  type="file"
                  id="replace-file-uploader"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.xml"
                  className="hidden"
                  onChange={handleReplaceFileInputChange}
                />
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 shadow-sm border border-indigo-100">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {LOCAL_T[language].dropzonePlaceholder}
                </p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  {LOCAL_T[language].dropzoneSub}
                </p>
              </div>

              {/* Uploaded Files Section */}
              {replaceUploadedFiles.length > 0 && (
                <div className="flex flex-col gap-2 max-h-[180px] overflow-auto border border-slate-150 rounded-xl p-3 bg-white shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">
                    {LOCAL_T[language].newUploadedHeader.replace('%count%', String(replaceUploadedFiles.length))}
                  </h4>
                  {replaceUploadedFiles.map(file => (
                    <div key={file.id} className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-center justify-between group/replaceFile">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white text-indigo-500 border border-indigo-100 shadow-sm">
                          <FileIcon size={12} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-indigo-900 truncate max-w-[300px] leading-tight">
                            {file.name}
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 leading-none mt-0.5 font-bold">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveReplaceFile(file.id);
                        }}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="text-[9px] font-bold text-amber-600 bg-amber-50 p-2 rounded-lg flex items-center gap-2 mt-2">
                    <Info size={12} />
                    {language === 'TH' ? 'ไฟล์ทั้งหมดด้านบนนี้จะถูกคลุกรวม (Merge) ให้อยู่ในคอลัมน์เดียว' : 'All files above will be merged into this single column'}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-2">
                <label className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-100/50 rounded-lg group select-none transition-colors w-fit">
                  <input
                    type="checkbox"
                    checked={replaceAutoStartOCR}
                    onChange={(e) => setReplaceAutoStartOCR(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-100 shrink-0 cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide group-hover:text-slate-800 leading-none">
                    {LOCAL_T[language].autoOCRLabel}
                  </span>
                </label>
                <button
                  onClick={handleConfirmReplace}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                  disabled={replaceUploadedFiles.length === 0}
                  id="submit-replace-import-btn"
                >
                  {LOCAL_T[language].btnConfirmReplace}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF View Overlay Side-by-side */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-[96vw] max-w-7xl h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
            
            {/* Topbar matching original with title, status, save indicator, activity logs, and close */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 tracking-tight text-lg leading-tight">{pdfPreviewUrl}</h3>
                    {activeBoardTab !== 'pending' && selectedJob?.docs[pdfPreviewUrl] && (() => {
                      const docStatus = selectedJob.docs[pdfPreviewUrl];
                      const isMismatched = mismatchedFileNames.has(pdfPreviewUrl);
                      const displayStatus = (docStatus === ComparisonDocStatus.MATCHED) && isMismatched
                        ? ComparisonDocStatus.MISMATCHED
                        : docStatus;
                      
                      const isMatchedOrLocked = displayStatus === ComparisonDocStatus.MATCHED || displayStatus === ComparisonDocStatus.LOCKED;
                      const isAmber = displayStatus === ComparisonDocStatus.RECEIVED || 
                                      displayStatus === ComparisonDocStatus.EXTRACTING || 
                                      displayStatus === ComparisonDocStatus.OCR_DONE;
                      const isRose = displayStatus === ComparisonDocStatus.ERROR || displayStatus === ComparisonDocStatus.MISMATCHED;

                      return (
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
                          isMatchedOrLocked ? 'bg-emerald-50 border-emerald-100' :
                          isAmber ? 'bg-amber-50 border-amber-100' :
                          isRose ? 'bg-rose-50 border-rose-100' :
                          'bg-slate-50 border-slate-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isMatchedOrLocked ? 'bg-emerald-500' :
                            displayStatus === ComparisonDocStatus.EXTRACTING ? 'bg-amber-500 animate-pulse' :
                            isAmber ? 'bg-amber-500' :
                            isRose ? 'bg-rose-500' :
                            'bg-slate-300'
                          }`}></div>
                          <span className={`text-[9px] font-black uppercase tracking-wider ${
                            isMatchedOrLocked ? 'text-emerald-500' :
                            isAmber ? 'text-amber-500' :
                            isRose ? 'text-rose-500' :
                            'text-slate-400'
                          }`}>
                            {
                              displayStatus === ComparisonDocStatus.LOCKED ? t.statusLocked : 
                              (displayStatus === ComparisonDocStatus.RECEIVED || displayStatus === ComparisonDocStatus.EXTRACTING) ? t.statusReceived : 
                              displayStatus === ComparisonDocStatus.OCR_DONE ? t.statusOcrDone :
                              displayStatus
                            }
                          </span>
                        </div>
                      );
                    })()}
                    {activeBoardTab !== 'pending' && selectedJob?.updatedDocs?.includes(pdfPreviewUrl) && (
                      <span className="shrink-0 bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1.5 uppercase tracking-wider">
                        <Save size={10} />
                        Updated file
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {activeBoardTab !== 'pending' && (
                  <button
                    onClick={() => setShowPdfLogsModal(true)}
                    className="px-4 h-10 rounded-full font-bold text-xs uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <History size={16} />
                     {language === 'TH' ? 'ประวัติ (Log)' : 'Activity Log'}
                  </button>
                )}
                <button 
                  onClick={() => setPdfPreviewUrl(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Side-by-side Dual Panels */}
            <div className="flex-1 bg-slate-100 flex overflow-hidden min-h-0">
               
               {/* Left Pane: PDF Preview in grey canvas container */}
               <div className={`${activeBoardTab === 'pending' ? 'w-full' : 'w-1/2'} flex flex-col border-[#eaecf0] bg-white ${activeBoardTab === 'pending' ? '' : 'border-r'}`}>
                  
                  {/* PDF Simulator Cool Dark Chrome Toolbar */}
                  <div className="bg-[#323639] h-11 text-white flex items-center justify-between px-4 select-none shrink-0 border-b border-[#212325]">
                    
                    {/* Left: Hamburger menu & Title */}
                    <div className="flex items-center gap-3 text-[#010136]">
                      <button className="p-1 rounded hover:bg-slate-700/60 transition-colors text-slate-200 cursor-pointer">
                        <Menu size={16} />
                      </button>
                      <span className="text-[11px] font-mono font-bold tracking-tight text-slate-300 max-w-[150px] truncate">
                        {pdfPreviewUrl.toUpperCase().replace(/\s/g, '_')}.pdf
                      </span>
                    </div>

                    {/* Middle: Page Switcher */}
                    <div className="flex items-center gap-2 text-[#010136]">
                      <button 
                        disabled={pdfCurrentPage === 1}
                        onClick={() => setPdfCurrentPage(prev => Math.max(1, prev - 1))}
                        className={`w-7 h-7 flex items-center justify-center rounded transition-all ${
                          pdfCurrentPage === 1 ? 'text-slate-600 cursor-not-allowed' : 'bg-slate-700/60 hover:bg-slate-600 hover:text-white text-slate-300 cursor-pointer'
                        }`}
                        title={language === 'TH' ? 'หน้าก่อนหน้า' : 'Previous page'}
                      >
                        <ChevronLeft size={14} className="text-white" />
                      </button>
                      <span className="text-xs font-mono font-bold px-1 select-none text-slate-300">
                        {pdfCurrentPage} <span className="text-slate-500 font-normal">/</span> 3
                      </span>
                      <button 
                        disabled={pdfCurrentPage === 3}
                        onClick={() => setPdfCurrentPage(prev => Math.min(3, prev + 1))}
                        className={`w-7 h-7 flex items-center justify-center rounded transition-all ${
                          pdfCurrentPage === 3 ? 'text-slate-600 cursor-not-allowed' : 'bg-slate-700/60 hover:bg-slate-600 hover:text-white text-slate-300 cursor-pointer'
                        }`}
                        title={language === 'TH' ? 'หน้าถัดไป' : 'Next page'}
                      >
                        <ChevronRight size={14} className="text-white" />
                      </button>

                      <div className="w-px h-5 bg-slate-700/80 mx-2"></div>

                      {/* Zoom Controls */}
                      <button 
                        onClick={() => setZoomLevel(prev => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
                        className="w-7 h-7 flex items-center justify-center rounded bg-slate-700/60 hover:bg-slate-600 hover:text-white transition-all text-slate-300 cursor-pointer"
                        title={language === 'TH' ? 'ย่อ (Zoom out)' : 'Zoom out'}
                      >
                        <ZoomOut size={14} className="text-white" />
                      </button>
                      <span className="text-xs font-semibold text-slate-300 w-12 text-center select-none font-mono">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <button 
                        onClick={() => setZoomLevel(prev => Math.min(1.6, Number((prev + 0.1).toFixed(2))))}
                        className="w-7 h-7 flex items-center justify-center rounded bg-slate-700/60 hover:bg-slate-600 hover:text-white transition-all text-slate-300 cursor-pointer"
                        title={language === 'TH' ? 'ขยาย (Zoom in)' : 'Zoom in'}
                      >
                        <ZoomIn size={14} className="text-white" />
                      </button>
                    </div>

                    {/* Right: Quick Tools */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-slate-700/60 hover:bg-slate-600 hover:text-white transition-all text-slate-300 cursor-pointer"
                        title={language === 'TH' ? 'หมุนหน้า (Rotate)' : 'Rotate'}
                      >
                        <RotateCw size={14} className="text-white" />
                      </button>
                      <button 
                        onClick={() => window.print()}
                        className="w-7 h-7 flex items-center justify-center rounded bg-slate-700/60 hover:bg-slate-600 hover:text-white transition-all text-slate-300 cursor-pointer"
                        title={language === 'TH' ? 'พิมพ์ (Print)' : 'Print Document'}
                      >
                        <Printer size={14} className="text-white" />
                      </button>
                      <button 
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob(["Simulated Local PDF Download"], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${pdfPreviewUrl.toLowerCase().replace(/\s/g, '_')}.pdf`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded bg-slate-700/60 hover:bg-slate-600 hover:text-white transition-all text-slate-300 cursor-pointer"
                        title={language === 'TH' ? 'ดาวน์โหลดเอกสาร' : 'Download Document'}
                      >
                        <Download size={14} className="text-white" />
                      </button>
                    </div>

                  </div>

                  {/* Gray PDF Canvas and Layout View */}
                  <div className="flex-1 bg-[#525659] overflow-auto flex items-start justify-center p-8 min-h-0 relative">
                    <div 
                      className="bg-white text-slate-800 shadow-2xl relative transition-all duration-300 origin-top"
                      style={{ 
                        transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`, 
                        marginTop: '0px'
                      }}
                    >
                      {/* Document render page based on filename */}
                      {(() => {
                        const docUpper = pdfPreviewUrl?.toUpperCase() || '';
                        
                        // Watermark block
                        const renderWatermark = (text: string) => (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1] overflow-hidden">
                            <div className="text-[120px] font-black uppercase text-slate-200/25 tracking-widest border-8 border-slate-200/20 px-10 py-4 rounded-3xl -rotate-12 font-sans">
                              {text}
                            </div>
                          </div>
                        );

                        if (docUpper.includes('LADING') || docUpper.includes('B / L') || docUpper.includes('B/L') || docUpper.includes('WAYBILL')) {
                          return (
                            <div className="p-8 min-h-[900px] w-[680px] flex flex-col gap-6 relative bg-white font-sans text-slate-800" style={{ contentVisibility: 'auto' }}>
                              {renderWatermark('ORIGINAL')}
                              
                              {/* Header */}
                              <div className="flex justify-between items-start border-b border-slate-800 pb-3 z-10">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-[15px]">★</div>
                                  <span className="text-[#00243d] font-black tracking-widest text-xl font-sans">MAERSK LINE</span>
                                </div>
                                <div className="text-right">
                                  <h2 className="text-xs font-black text-slate-400 tracking-wider font-sans">BILL OF LADING FOR OCEAN TRANSPORT</h2>
                                  <p className="font-mono text-xs font-bold text-slate-700">B/L No. 953074879</p>
                                </div>
                              </div>

                              {/* Core Info Grid */}
                              <div className="grid grid-cols-2 border border-slate-800 text-[10px] z-10 font-sans">
                                <div className="border-r border-b border-slate-800 p-3 space-y-1">
                                  <span className="font-black text-[9px] uppercase text-slate-400">Shipper</span>
                                  <p className="font-bold text-slate-800">TME CORP CO., LTD.</p>
                                  <p className="text-slate-500">40 DEVILS TOWER ROAD, P.O.BOX 176,</p>
                                  <p className="text-slate-500">GIBRALTAR</p>
                                </div>
                                <div className="border-b border-slate-800 p-3 space-y-1">
                                  <span className="font-black text-[9px] uppercase text-slate-400">Booking No. / References</span>
                                  <p className="font-bold font-mono text-slate-800">953074879</p>
                                  <span className="block font-black text-[9px] uppercase text-slate-400 mt-2">Export References</span>
                                  <p className="font-bold font-mono text-slate-800">131660-3/5</p>
                                </div>
                                <div className="border-r border-slate-800 p-3 space-y-1">
                                  <span className="font-black text-[9px] uppercase text-slate-400">Consignee</span>
                                  <p className="font-bold text-slate-800">UNDP - TANZANIA</p>
                                  <p className="text-slate-500">6TH FLOOR INTERNATIONAL HOUSE,</p>
                                  <p className="text-slate-500">SHAABAN ROBERT ST. GARDEN AVENUE, DAR ES SALAAM</p>
                                </div>
                                <div className="p-3 space-y-1">
                                  <span className="font-black text-[9px] uppercase text-slate-400">Notify Party</span>
                                  <p className="font-bold text-slate-800">SAME AS CONSIGNEE</p>
                                  <p className="text-slate-500">TEL: (+255) 22-211-2576</p>
                                  <p className="text-slate-500">EMAIL: YONAH.SAMO@UNDP.ORG</p>
                                </div>
                              </div>

                              {/* Transport details */}
                              <div className="grid grid-cols-4 border border-t-0 border-slate-800 text-[9px] z-10">
                                <div className="border-r p-2">
                                  <span className="block font-black text-[8px] text-slate-400 uppercase">Pre-Carriage By</span>
                                  <p className="font-bold text-slate-700">VESSEL MAERSK WISCONSIN</p>
                                </div>
                                <div className="border-r p-2">
                                  <span className="block font-black text-[8px] text-slate-400 uppercase">Place of Receipt</span>
                                  <p className="font-bold text-slate-700">ALGECIRAS</p>
                                </div>
                                <div className="border-r p-2">
                                  <span className="block font-black text-[8px] text-slate-400 uppercase">Port of Loading</span>
                                  <p className="font-bold text-slate-700">ALGECIRAS</p>
                                </div>
                                <div className="p-2">
                                  <span className="block font-black text-[8px] text-slate-400 uppercase">Port of Discharge</span>
                                  <p className="font-bold text-slate-700 font-sans">DAR ES SALAAM</p>
                                </div>
                              </div>

                              {/* Table Particulars */}
                              <div className="border border-t-0 border-slate-800 z-10 flex-1 flex flex-col font-sans">
                                <div className="bg-slate-50 border-b border-slate-800 text-center font-black py-1.5 text-[9px] uppercase tracking-wider text-slate-600">
                                  Particulars Furnished by Shipper
                                </div>
                                <div className="grid grid-cols-12 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800 p-2">
                                  <div className="col-span-8 font-sans">Description of Packages and Goods</div>
                                  <div className="col-span-2 text-right">Gross Weight</div>
                                  <div className="col-span-2 text-right font-sans">Measurement</div>
                                </div>
                                <div className="flex-1 p-4 space-y-4 font-mono text-[10px]">
                                  {pdfCurrentPage === 1 ? (
                                    <div className="grid grid-cols-12 text-[11px]">
                                      <div className="col-span-8 space-y-1">
                                        <p className="font-black text-slate-800">1 CONTAINER SAID TO CONTAIN 2 VEHICLES</p>
                                        <p className="text-slate-500">VEHICLE REF AND TYPE 270743 TOYOTA LAND CRISER 200 STATION WAGON GX V8 TW</p>
                                        <p className="text-slate-500">IN TD 8 SEATS AUTOMATIC (ALARM, CLIMATE CTRL, COOL BOX, R. RAIL)</p>
                                        <p className="text-slate-500">CHASSIS NO. JTMHV09J-X04160007</p>
                                        <p className="text-slate-500">YEAR OF MANUF. 2014</p>
                                        <p className="text-slate-500 font-mono">ENGINE NO. 1VD-0273330</p>
                                      </div>
                                      <div className="col-span-2 text-right font-bold text-slate-700">5,336.140 KGS</div>
                                      <div className="col-span-2 text-right font-bold text-slate-700 font-mono">38.600 CBM</div>
                                    </div>
                                  ) : pdfCurrentPage === 2 ? (
                                    <div className="grid grid-cols-12 text-[11px]">
                                      <div className="col-span-8 space-y-1">
                                        <p className="font-black text-slate-800">SECOND ROW DETAILS - PARTS AND ACCESSORIES</p>
                                        <p className="text-slate-500">SPARE TYRES, JACK KIT WITH LEVER, TOOL BAG, MANUAL BOOKLET</p>
                                        <p className="text-slate-500">CONTAINER NO: MSKU 6537219, SHIPPER SEAL NO: 270743</p>
                                        <p className="text-slate-500">HS COMPLIANT CARGO OF HIGHEST DEGREE VALIDATION</p>
                                      </div>
                                      <div className="col-span-2 text-right font-bold text-slate-700 font-mono">Included</div>
                                      <div className="col-span-2 text-right font-bold text-slate-700">-</div>
                                    </div>
                                  ) : (
                                    <div className="space-y-4 font-sans text-slate-400 p-8 text-center text-xs">
                                      <p className="font-bold border-b pb-2 uppercase tracking-widest text-[#010136]">Terms & Carrier Conditions</p>
                                      <p className="leading-relaxed">This carriage is subject to the terms and rules of the Ocean Association Carriage Act. Carrier standard limitation of liabilities apply as ruled in international commerce regulations. The shipper warrants the accuracy of all packages description.</p>
                                    </div>
                                  )}
                                </div>
                                <div className="border-t border-slate-300 p-3 bg-slate-50 text-[8px] text-slate-400 leading-normal font-sans">
                                  SHIPPED ON BOARD, DATE: 27 FEB 2015, SIGNED BY MASTER / AGENT FOR MAERSK LINE OCEAN SHIPPERS. ALL LIABILITIES SUBJECT TO CARRIER TERMS AND REGULATIONS AS SPECIFIED.
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (docUpper.includes('INV') || docUpper.includes('INVOICE') || docUpper.includes('ชุดข้อมูล')) {
                          return (
                            <div className="p-8 min-h-[900px] w-[680px] flex flex-col gap-6 relative bg-white font-sans text-slate-800" style={{ contentVisibility: 'auto' }}>
                              {renderWatermark('INVOICE')}

                              {/* Invoice Header */}
                              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 z-10">
                                <div>
                                  <span className="text-xs font-black tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-sm uppercase">Commercial Invoice</span>
                                  <h1 className="text-2xl font-black tracking-tighter text-slate-800 mt-2 font-sans">GLOBAL TRADING INC.</h1>
                                  <p className="text-[11px] text-slate-400 mt-1 font-sans">123 Logistics St, Shanghai, China | exports@globaltrading.com</p>
                                </div>
                                <div className="text-right">
                                  <h2 className="text-lg font-black text-slate-800 tracking-tighter"># INV-2026-045</h2>
                                  <p className="text-[11px] text-slate-400 font-mono">DATE: 20 APR 2026</p>
                                </div>
                              </div>

                              {/* Client Info Grid */}
                              <div className="grid grid-cols-2 gap-8 text-[11px] z-10 font-sans">
                                <div className="bg-slate-50 p-4 rounded-xl space-y-1 font-sans">
                                  <span className="font-black text-[9px] uppercase tracking-wider text-slate-400">Exporter (Shipper)</span>
                                  <p className="font-extrabold text-slate-800 text-xs">GLOBAL TRADING INC.</p>
                                  <p className="text-slate-500">Shanghai Logistics Zone, Bldg A</p>
                                  <p className="text-slate-500">Contact: Exports Department</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl space-y-1 font-sans">
                                  <span className="font-black text-[9px] uppercase tracking-wider text-slate-400 font-sans">Sold To (Consignee)</span>
                                  <p className="font-extrabold text-[#010136] text-xs font-sans font-black">BIZ-TRANS LOGISTICS CO., LTD.</p>
                                  <p className="text-slate-500 font-sans font-bold">45/2 Rama 9, Huai Khwang, Bangkok, Thailand</p>
                                  <p className="text-slate-500 font-mono">TAX ID: 0105562000000</p>
                                </div>
                              </div>

                              {/* Delivery & Terms Panel */}
                              <div className="grid grid-cols-3 gap-4 border border-slate-100 rounded-xl p-3 text-[10px] bg-slate-50/50 z-10 font-sans">
                                <div>
                                  <span className="block text-[8px] font-black text-slate-400 uppercase">Incoterms</span>
                                  <p className="font-bold text-slate-700">FOB SHANGHAI, CHINA</p>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-black text-slate-400 uppercase">Port of Loading</span>
                                  <p className="font-bold text-slate-700">SHANGHAI, CHINA</p>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-black text-slate-400 uppercase font-sans">Port of Discharge</span>
                                  <p className="font-bold text-slate-700 font-sans font-black">BANGKOK, THAILAND</p>
                                </div>
                              </div>

                              {/* Itemized Table */}
                              <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden z-10 font-sans">
                                <table className="w-full text-left text-xs font-sans">
                                  <thead>
                                    <tr className="bg-slate-900 text-white font-black uppercase tracking-wider text-[9px]">
                                      <th className="p-3">Description of Goods</th>
                                      <th className="p-3 font-mono text-center">HS Code</th>
                                      <th className="p-3 text-center">Qty / UOM</th>
                                      <th className="p-3 text-right">Price/Unit (USD)</th>
                                      <th className="p-3 text-right">Total (USD)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-[11px] font-sans">
                                    {pdfCurrentPage === 1 ? (
                                      Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                          <td className="p-3 max-w-[240px]">
                                            <p className="font-bold text-slate-800 font-sans">INDUSTRIAL AUTOMATION SENSOR V{i+1}</p>
                                            <p className="text-[9px] text-slate-400 font-sans">Item No: SKU-{10001 + i}</p>
                                          </td>
                                          <td className="p-3 font-mono text-center text-slate-500">8471.30.{15 * i + 10}</td>
                                          <td className="p-3 text-center font-bold text-slate-700 font-mono">{(i + 1) * 12} PCS</td>
                                          <td className="p-3 text-right font-mono text-slate-600">${15 * i + 120}.00</td>
                                          <td className="p-3 text-right font-mono font-bold text-slate-800">${((i + 1) * 12) * (15 * i + 120)}.00</td>
                                        </tr>
                                      ))
                                    ) : pdfCurrentPage === 2 ? (
                                      Array.from({ length: 4 }).map((_, i) => {
                                        const idx = i + 4;
                                        return (
                                          <tr key={idx} className="hover:bg-slate-50/50 font-sans">
                                            <td className="p-3 max-w-[240px]">
                                              <p className="font-bold text-slate-800 font-sans">INDUSTRIAL AUTOMATION ACCESSORY MOD{idx+1}</p>
                                              <p className="text-[9px] text-slate-400 font-sans">Item No: SKU-{10001 + idx}</p>
                                            </td>
                                            <td className="p-3 font-mono text-center text-slate-500">8471.30.{10 * idx + 10}</td>
                                            <td className="p-3 text-center font-bold text-slate-700 font-mono">{(idx + 1) * 5} PCS</td>
                                            <td className="p-3 text-right font-mono text-slate-600">${10 * idx + 8}.00</td>
                                            <td className="p-3 text-right font-mono font-bold text-slate-800">${((idx + 1) * 5) * (10 * idx + 8)}.00</td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400 font-sans leading-relaxed text-xs">
                                          <p className="font-bold text-slate-800 mb-2 uppercase tracking-wide">End of Commercial Statement</p>
                                          <p>This document constitutes a full legal sales invoice statement. All quantities and unit prices are final as packed.</p>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {/* Bill Summary */}
                              <div className="flex justify-end mt-4 z-10 w-full font-sans">
                                <div className="w-64 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                                  <div className="flex justify-between font-medium text-slate-400 text-[10px] uppercase">
                                    <span>Subtotal:</span>
                                    <span className="font-mono">$7,520.00</span>
                                  </div>
                                  <div className="flex justify-between font-medium text-slate-400 text-[10px] uppercase">
                                    <span>Shipping & Handling:</span>
                                    <span className="font-mono">PREPAID</span>
                                  </div>
                                  <div className="flex justify-between font-black border-t border-slate-200 pt-2 text-[#010136]">
                                    <span>TOTAL AMOUNT:</span>
                                    <span className="font-mono text-indigo-600 text-[13px]">$7,520.00</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (docUpper.includes('PACKING') || docUpper.includes('LIST')) {
                          return (
                            <div className="p-8 min-h-[900px] w-[680px] flex flex-col gap-6 relative bg-white font-sans text-slate-800" style={{ contentVisibility: 'auto' }}>
                              {renderWatermark('PACKING LIST')}

                              {/* Packing List Header */}
                              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 z-10">
                                <div>
                                  <span className="text-xs font-black tracking-widest text-[#16EA9E] bg-[#16EA9E]/10 border border-[#16EA9E]/20 px-2.5 py-1 rounded-sm uppercase text-[#12a16d]">Packing list</span>
                                  <h1 className="text-2xl font-black tracking-tighter text-slate-800 mt-2 font-sans font-black">GLOBAL TRADING INC.</h1>
                                  <p className="text-[11px] text-slate-400 mt-1 font-sans">123 Logistics St, Shanghai, China | logistics@globaltrading.com</p>
                                </div>
                                <div className="text-right font-sans">
                                  <h2 className="text-lg font-black text-slate-800 tracking-tighter font-sans">REF# PK-2026-045</h2>
                                  <p className="text-[11px] text-slate-400 font-mono">DATE: 20 APR 2026</p>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="grid grid-cols-2 gap-8 text-[11px] z-10 font-sans">
                                <div className="bg-slate-50 p-4 rounded-xl space-y-1 font-sans">
                                  <span className="font-black text-[9px] uppercase tracking-wider text-slate-400">Shipper / Exporter</span>
                                  <p className="font-extrabold text-slate-800 text-xs">GLOBAL TRADING INC.</p>
                                  <p className="text-slate-500">Contact: Packing & Logistics</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl space-y-1 font-sans">
                                  <span className="font-black text-[9px] uppercase tracking-wider text-slate-400">Consignee</span>
                                  <p className="font-extrabold text-[#010136] text-xs font-black">BIZ-TRANS LOGISTICS CO., LTD.</p>
                                  <p className="text-slate-500">Bangkok, Thailand | Contact: Kunawut W.</p>
                                </div>
                              </div>

                              {/* Packages details table */}
                              <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden z-10 font-sans">
                                <table className="w-full text-left text-xs font-sans">
                                  <thead>
                                    <tr className="bg-slate-900 text-white font-black uppercase tracking-wider text-[9px]">
                                      <th className="p-3">Box / Marks</th>
                                      <th className="p-3 font-sans">Description of Goods</th>
                                      <th className="p-3 text-center">Qty / Unit</th>
                                      <th className="p-3 text-right">Net Weight</th>
                                      <th className="p-3 text-right text-sans">Gross Weight</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-[11px] font-sans">
                                    {pdfCurrentPage === 1 ? (
                                      Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                          <td className="p-3 font-mono font-bold text-slate-600">BOX {i+1}/4</td>
                                          <td className="p-3 font-sans">
                                            <p className="font-bold text-slate-800 font-sans">INDUSTRIAL AUTOMATION SENSOR V{i+1}</p>
                                            <p className="text-[9px] text-slate-400 font-sans">MODEL# SKU-{10001 + i}</p>
                                          </td>
                                          <td className="p-3 text-center font-bold text-slate-700 font-mono">{(i + 1) * 12} PCS</td>
                                          <td className="p-3 text-right font-mono text-slate-500">{(i + 1) * 4.5} KG</td>
                                          <td className="p-3 text-right font-mono text-slate-500">{(i + 1) * 5.2} KG</td>
                                        </tr>
                                      ))
                                    ) : pdfCurrentPage === 2 ? (
                                      Array.from({ length: 3 }).map((_, i) => {
                                        const idx = i + 4;
                                        return (
                                          <tr key={idx} className="hover:bg-slate-50/50 font-sans">
                                            <td className="p-3 font-mono font-bold text-slate-600 font-mono">BOX {idx+1}/7</td>
                                            <td className="p-3 font-sans">
                                              <p className="font-bold text-slate-800 font-sans">AUTOMATION SENSOR BRACKET TYPE {idx+1}</p>
                                              <p className="text-[9px] text-slate-400 font-sans">MODEL# SKU-{10001 + idx}</p>
                                            </td>
                                            <td className="p-3 text-center font-bold text-slate-700 font-mono">{(idx + 1) * 2} PCS</td>
                                            <td className="p-3 text-right font-mono text-slate-500">{(idx + 1) * 1.5} KG</td>
                                            <td className="p-3 text-right font-mono text-slate-500">{(idx + 1) * 1.8} KG</td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400 font-sans leading-relaxed text-xs">
                                          <p className="font-bold text-slate-800 mb-2 uppercase tracking-wide">End of Packaging Statement</p>
                                          <p>All containers and boxes are packed according to international shipping rules. Weights verified before container dispatch.</p>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {/* Summary */}
                              <div className="grid grid-cols-3 border border-slate-200 bg-slate-50 rounded-xl p-4 text-[10px] font-sans h-20 items-center z-10 mt-auto">
                                <div className="text-center border-r border-slate-200">
                                  <span className="block font-black text-slate-400 uppercase text-[8px]">TOTAL PACKAGES</span>
                                  <p className="font-black text-slate-800 text-[13px] mt-0.5">4 CARTONS (BOXES)</p>
                                </div>
                                <div className="text-center border-r border-slate-200 animate-pulse">
                                  <span className="block font-black text-slate-400 uppercase text-[8px]">TOTAL NET WEIGHT</span>
                                  <p className="font-black text-[#010136] text-[13px] mt-0.5">45.00 KGS</p>
                                </div>
                                <div className="text-center">
                                  <span className="block font-black text-slate-400 uppercase text-[8px]">TOTAL GROSS WEIGHT</span>
                                  <p className="font-black text-[#010136] text-[13px] mt-0.5">52.00 KGS</p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        {/* Default Fallback Document Style */}
                        return (
                          <div className="p-8 min-h-[900px] w-[680px] flex flex-col gap-6 relative bg-white font-sans text-slate-800" style={{ contentVisibility: 'auto' }}>
                            {renderWatermark('DOCUMENT APPROVED')}

                            <div className="flex justify-between items-start border-b border-slate-300 pb-4 z-10 font-sans">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><FileIcon size={14} /></div>
                                <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight font-sans">{pdfPreviewUrl}</h1>
                              </div>
                              <p className="text-[10px] font-mono text-slate-400 font-mono">DOC VERSION {selectedJob?.updatedDocs?.includes(pdfPreviewUrl) ? '2.0' : '1.0'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border border-dashed border-slate-200 rounded-xl p-4 text-[11px] bg-slate-50/40 z-10 font-sans">
                              <div>
                                <span className="font-black text-slate-400 uppercase tracking-wider text-[8px]">SOURCE DATA NAME</span>
                                <p className="font-bold text-slate-700 mt-0.5 font-sans">{pdfPreviewUrl}</p>
                              </div>
                              <div>
                                <span className="font-black text-slate-400 uppercase tracking-wider text-[8px]">ASSOCIATED WORKFLOW</span>
                                <p className="font-bold text-slate-700 mt-0.5 font-sans">{selectedJob?.workflowName}</p>
                              </div>
                            </div>

                            <div className="z-10 mt-4 flex-1 flex flex-col gap-4 font-sans">
                              {pdfCurrentPage === 1 ? (
                                <>
                                  <h3 className="font-black text-[10px] uppercase text-slate-400 tracking-wider">DOC CONTENT SUMMARY (PAGE 1)</h3>
                                  <div className="border border-slate-200 rounded-xl p-4 flex-1 font-mono text-slate-500 font-bold text-[11px] space-y-2 whitespace-pre leading-relaxed bg-slate-50/50">
                                    {Object.entries(tempOCRData).slice(0, 10).map(([field, value]) => (
                                      <div key={field} className="flex justify-between border-b border-slate-100 py-1.5 font-sans text-xs">
                                        <span className="text-[#0463EF] font-bold font-sans">{field}:</span>
                                        <span className="text-[#010136] font-semibold font-sans">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : pdfCurrentPage === 2 ? (
                                <>
                                  <h3 className="font-black text-[10px] uppercase text-slate-400 tracking-wider font-sans">DOC CONTENT SUMMARY (PAGE 2)</h3>
                                  <div className="border border-slate-200 rounded-xl p-4 flex-1 font-mono text-slate-500 font-bold text-[11px] space-y-2 whitespace-pre leading-relaxed bg-slate-50/50 font-sans">
                                    {Object.entries(tempOCRData).slice(10, 20).map(([field, value]) => (
                                      <div key={field} className="flex justify-between border-b border-slate-100 py-1.5 font-sans text-xs">
                                        <span className="text-[#0463EF] font-bold font-sans">{field}:</span>
                                        <span className="text-[#010136] font-semibold font-sans">{value}</span>
                                      </div>
                                    ))}
                                    {Object.entries(tempOCRData).length <= 10 && (
                                      <p className="text-center text-slate-400 font-sans py-12 text-xs">No additional fields on Page 2</p>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="p-8 text-center text-slate-400 font-sans h-full flex flex-col justify-center items-center">
                                  <p className="font-bold text-[#010136] mb-2 uppercase tracking-wide">Page 3 Signature Section & Metadata</p>
                                  <p className="text-xs max-w-sm mb-4">Official document certification and blockchain transaction logs are appended for compliance.</p>
                                  <div className="w-1/2 border-t-2 border-slate-300 font-bold text-[9px] pt-2 text-slate-500 font-sans">AUTHORIZED STAMP SIGNATURE</div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

               </div>

               {/* Right Pane: Multi Tab view of either Editable Excel layout or Raw JSON with Copy Code */}
               {activeBoardTab !== 'pending' && (
                 <div className="w-1/2 flex flex-col bg-white overflow-hidden min-h-0">
                  
                  {/* Right Tab Headers matching reference image */}
                  <div className="bg-slate-50/50 border-b border-[#eaecf0] flex px-4 shrink-0 h-12">
                    <button 
                      onClick={() => setActiveRightTab('excel')}
                      className={`px-5 py-3 border-b-2 text-xs font-black uppercase tracking-wider transition-all leading-none ${
                        activeRightTab === 'excel' 
                          ? 'border-[#0463EF] text-[#0463EF]' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Excel Preview
                    </button>
                    <button 
                      onClick={() => setActiveRightTab('json')}
                      className={`px-5 py-3 border-b-2 text-xs font-black uppercase tracking-wider transition-all leading-none ${
                        activeRightTab === 'json' 
                          ? 'border-[#0463EF] text-[#0463EF]' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      JSON
                    </button>
                  </div>

                  {/* Right Tab Content */}
                  {activeRightTab === 'excel' ? (
                    <div className="flex-1 overflow-hidden flex flex-col bg-white min-h-0">
                      
                      {/* Excel Header row indicators */}
                      <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-200 bg-slate-50 text-[10px] font-black tracking-wider uppercase text-[#0463EF] shrink-0 font-sans">
                        <div className="col-span-5 font-sans">{language === 'TH' ? 'ชื่อฟิลด์' : 'FIELD'}</div>
                        <div className="col-span-7 pl-4 font-sans">{language === 'TH' ? 'ข้อมูลที่สกัด' : 'VALUE'}</div>
                      </div>

                      {/* Excel rows with clean editing cell styling */}
                      <div className="flex-1 overflow-auto divide-y divide-slate-100 px-4 custom-scrollbar">
                        {allComparisonResults.filter(res => {
                          const target = res.targets.find(t => t.fileName === pdfPreviewUrl);
                          return target && target.status !== 'NA';
                        }).length === 0 ? (
                          <div className="p-8 text-center text-slate-400 font-sans text-xs">
                             {language === 'TH' ? 'ไม่มีฟิลด์ข้อมูลเสริมที่เกี่ยวข้อง' : 'No relevant comparison fields found for this document.'}
                          </div>
                        ) : (
                          allComparisonResults.map((res, i) => {
                            const target = res.targets.find(t => t.fileName === pdfPreviewUrl);
                            if (!target || target.status === 'NA') return null;
                            return (
                              <div key={i} className="grid grid-cols-12 hover:bg-slate-50/40 py-1 items-center transition-all">
                                <div className="col-span-5 text-[#0463EF] font-bold text-[12px] capitalize font-sans leading-relaxed tracking-tight px-2 break-words">
                                  {res.fieldName}
                                </div>
                                <div className="col-span-7 pl-2">
                                  <input 
                                    type="text"
                                    value={tempOCRData[res.fieldName] || ''}
                                    disabled={isUnassigned || selectedJob?.status === JobStatus.DONE}
                                    onChange={(e) => setTempOCRData(prev => ({ ...prev, [res.fieldName]: e.target.value }))}
                                    className={`w-full p-2.5 rounded-lg text-[#010136] text-[13px] font-bold font-sans transition-all outline-none border border-transparent hover:border-slate-200 hover:bg-slate-50 focus:bg-white focus:border-[#0463EF] focus:ring-4 focus:ring-blue-500/10 ${
                                      selectedJob?.status === JobStatus.DONE 
                                        ? 'bg-transparent text-slate-400 cursor-not-allowed shadow-none font-semibold hover:border-transparent hover:bg-transparent' 
                                        : 'bg-transparent'
                                    }`}
                                    placeholder="Enter extracted value"
                                  />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                    </div>
                  ) : (
                    /* High fidelity syntax highlighted raw JSON Tab code block view */
                    <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 min-h-0 select-text p-5">
                      <div className="flex justify-between items-center mb-3.5 select-none shrink-0 font-sans">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none font-sans">
                          {language === 'TH' ? 'รหัสโครงสร้างข้อมูลที่สกัด' : 'EXTRACTED DATA STRUCTURE'}
                        </span>
                        
                        {/* Copy button with check anim feedback */}
                        <button
                          onClick={() => {
                            const jsonText = JSON.stringify(tempOCRData, null, 2);
                            navigator.clipboard.writeText(jsonText).then(() => {
                              setCopiedJson(true);
                              message.success(language === 'TH' ? 'คัดลอกรหัส JSON แล้ว!' : 'JSON Code Copied!');
                              setTimeout(() => setCopiedJson(false), 2000);
                            }).catch(() => {
                              const textarea = document.createElement('textarea');
                              textarea.value = jsonText;
                              document.body.appendChild(textarea);
                              textarea.select();
                              try {
                                document.execCommand('copy');
                                setCopiedJson(true);
                                message.success(language === 'TH' ? 'คัดลอกรหัส JSON แล้ว!' : 'JSON Code Copied!');
                                setTimeout(() => setCopiedJson(false), 2000);
                              } catch (err) {
                                console.error('Copy failed', err);
                              }
                              document.body.removeChild(textarea);
                            });
                          }}
                          className="px-3.5 py-2 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-all flex items-center gap-2 shadow-sm font-sans cursor-pointer active:scale-95"
                        >
                          {copiedJson ? (
                            <>
                              <Check size={12} className="text-emerald-500" strokeWidth={3} />
                              <span className="text-emerald-600 font-sans">{language === 'TH' ? 'คัดลอกเรียบร้อย!' : 'COPIED!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} strokeWidth={2.5} />
                              <span className="font-sans">{language === 'TH' ? 'คัดลอกโค้ด' : 'COPY CODE'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display field code */}
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-5 flex flex-col relative min-h-0 font-mono">
                        <textarea
                          readOnly
                          value={JSON.stringify(tempOCRData, null, 2)}
                          className="flex-1 w-full bg-transparent border-none text-[12px] font-bold text-emerald-400 font-mono focus:ring-0 outline-none resize-none cursor-text select-all overflow-auto whitespace-pre leading-relaxed custom-scrollbar"
                          id="json-code-textarea"
                          style={{ scrollBehavior: 'smooth' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Save buttons footer at the bottom of the right panel */}
                  <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                    <button 
                      onClick={handleSaveOCR}
                      disabled={isUnassigned || !hasOCRChanges || selectedJob?.status === JobStatus.DONE}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group cursor-pointer ${
                        (!isUnassigned && hasOCRChanges) && selectedJob?.status !== JobStatus.DONE
                          ? 'bg-[#0463EF] text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70 border border-slate-200/50 shadow-none'
                      }`}
                    >
                      <Save size={16} className={hasOCRChanges ? "group-hover:scale-110 transition-transform" : ""} />
                      {language === 'TH' ? 'บันทึกข้อมูลแก้ไข' : 'Save Changes'}
                    </button>
                  </div>

               </div>
               )}

            </div>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {showSaveToast && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-3 border border-slate-700"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">
                  {language === 'TH' ? 'บันทึกข้อมูลเรียบร้อยแล้ว' : 'OCR DATA SAVED SUCCESSFULLY'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activity Logs Modal */}
          <AnimatePresence>
            {showPdfLogsModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <History size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 tracking-tight text-lg leading-tight uppercase">
                          {language === 'TH' ? 'ประวัติการแก้ไขข้อมูล' : 'Activity Logs'}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 tracking-tight leading-none mt-0.5 uppercase">{pdfPreviewUrl}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPdfLogsModal(false)}
                      className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
                    {ocrLogs.filter(log => log.docName.toUpperCase() === pdfPreviewUrl?.toUpperCase()).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 opacity-60 bg-white border border-slate-200 border-dashed rounded-xl m-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <History size={24} className="text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{language === 'TH' ? 'ยังไม่มีประวัติ' : 'No logs found'}</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'TH' ? 'วัน/เวลา' : 'Date/Time'}</th>
                              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'TH' ? 'การกระทำ' : 'Action'}</th>
                              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'TH' ? 'เวอร์ชันเอกสาร' : 'Doc Version'}</th>
                              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'TH' ? 'ผู้ใช้งาน' : 'User'}</th>
                              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">{language === 'TH' ? 'รายละเอียด' : 'Details'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[...ocrLogs]
                              .filter(log => log.docName.toUpperCase() === pdfPreviewUrl?.toUpperCase())
                              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                              .map(log => (
                              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 whitespace-nowrap">
                                  <span className="text-xs font-bold text-slate-600 block">
                                    {new Date(log.timestamp).toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                                    {new Date(log.timestamp).toLocaleTimeString(language === 'TH' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    {log.action === 'EDIT_DATA' ? <Edit3 size={14} className="text-blue-500" /> : <UploadCloud size={14} className="text-emerald-500" />}
                                    <span className="text-xs font-bold text-slate-700">
                                      {log.action === 'EDIT_DATA' ? (language === 'TH' ? 'แก้ไขข้อมูล OCR' : 'Edited OCR Data') : (language === 'TH' ? 'อัปโหลดเวอร์ชันใหม่' : 'Uploaded New Version')}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${log.version > 1 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    v{log.version}
                                  </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase">
                                      {log.user.slice(0, 2)}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600">{log.user}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
                                    {log.action === 'EDIT_DATA' && language === 'TH' ? <span className="font-semibold text-slate-700">มีการแก้ไขข้อมูลในฟิลด์: </span> : ''}
                                    {log.action === 'EDIT_DATA' && language === 'EN' ? <span className="font-semibold text-slate-700">Fields updated: </span> : ''}
                                    {log.details.replace('แก้ไขฟิลด์: ', '').replace('Edited fields: ', '')}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* Reject Pending Modal */}
      {showRejectPendingModal && rejectPendingId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 font-sans">
           <div className="bg-white p-10 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border-4 border-rose-100 mb-2">
                 <AlertCircle size={48} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#010136] tracking-tight mb-3 font-sans">
                   {language === 'TH' ? 'ยืนยันการปฏิเสธไฟล์นี้' : 'Confirm Reject File'}
                </h3>
                <p className="text-slate-500 font-medium text-[13px] leading-relaxed font-sans max-w-sm mx-auto">
                   {language === 'TH' 
                     ? 'คุณต้องการปฏิเสธและลบไฟล์นี้ออกจาก Inbox ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้' 
                     : 'Are you sure you want to reject and discard this file from the inbox? This action cannot be undone.'}
                </p>
              </div>
              <div className="flex gap-4 w-full mt-4">
                 <Button 
                   size="large" 
                   className="flex-1 rounded-[4px] h-14 font-black uppercase tracking-widest text-[11px] border-slate-200 text-slate-600 hover:bg-slate-50 font-sans"
                   onClick={() => {
                     setShowRejectPendingModal(false);
                     setRejectPendingId(null);
                   }}
                 >
                   {language === 'TH' ? 'ยกเลิก' : 'CANCEL'}
                 </Button>
                 <Button 
                   type="primary" 
                   size="large" 
                   className="flex-1 rounded-[4px] h-14 font-black uppercase tracking-widest text-[11px] bg-rose-500 border-none shadow-lg shadow-rose-500/20 hover:bg-rose-600 font-sans"
                   onClick={confirmRejectPending}
                 >
                   {language === 'TH' ? 'ปฏิเสธไฟล์' : 'REJECT FILE'}
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* Delete Document Column Confirm Modal */}
      {showDeleteColumnConfirmModal && deleteColumnTargetDocName && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 font-sans">
          <div className="bg-white p-10 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border-4 border-rose-100 mb-2">
              <AlertCircle size={48} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#010136] tracking-tight mb-3 font-sans">
                {language === 'TH' ? 'ยืนยันการลบคอลัมน์เอกสาร' : 'Confirm Delete Column'}
              </h3>
              <p className="text-slate-500 font-medium text-[13px] leading-relaxed font-sans max-w-sm mx-auto">
                {language === 'TH' 
                  ? `คุณต้องการลบคอลัมน์เอกสาร "${deleteColumnTargetDocName}" ใช่หรือไม่? ไฟล์จะหายไปจากตารางเปรียบเทียบและการกระทำนี้ไม่สามารถย้อนกลับได้` 
                  : `Are you sure you want to delete the document column "${deleteColumnTargetDocName}"? The file will disappear from the comparison table and this action cannot be undone.`}
              </p>
            </div>
            <div className="flex gap-4 w-full mt-4">
              <Button 
                size="large" 
                className="flex-1 rounded-[4px] h-14 font-black uppercase tracking-widest text-[11px] border-slate-200 text-slate-600 hover:bg-slate-50 font-sans"
                onClick={() => {
                  setShowDeleteColumnConfirmModal(false);
                  setDeleteColumnTargetDocName(null);
                }}
              >
                {language === 'TH' ? 'ยกเลิก' : 'CANCEL'}
              </Button>
              <Button 
                type="primary" 
                size="large" 
                className="flex-1 rounded-[4px] h-14 font-black uppercase tracking-widest text-[11px] bg-rose-500 border-none shadow-lg shadow-rose-500/20 hover:bg-rose-600 font-sans"
                onClick={() => {
                  const targetDoc = deleteColumnTargetDocName;
                  handleDeleteDocColumn(targetDoc);
                  setShowDeleteColumnConfirmModal(false);
                  setDeleteColumnTargetDocName(null);
                  if (targetDoc) {
                    message.success(language === 'TH' ? `ลบคอลัมน์เอกสาร "${targetDoc}" เรียบร้อยแล้ว` : `Document column "${targetDoc}" has been deleted.`);
                  }
                }}
              >
                {language === 'TH' ? 'ลบคอลัมน์' : 'DELETE COLUMN'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Warning Modal */}
      {showWorkflowWarning && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white p-10 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border-4 border-amber-50">
                 <AlertCircle size={48} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">
                  {language === 'TH' ? 'ยังไม่ได้ตั้งค่า Export Node' : 'Export Node Not Set'}
                </h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">
                  {language === 'TH' 
                    ? 'รายการนี้ยังไม่มีการตั้งค่าจุดส่งออกข้อมูล (Export node) ในเวิร์กโฟลว์ กรุณาตั้งค่าก่อนดำเนินการต่อ' 
                    : 'This job does not have an export node configured in its workflow. Please configure it before proceeding.'}
                </p>
              </div>
              <div className="flex flex-col w-full gap-3 mt-4">
                 <button 
                  onClick={() => {
                    setShowWorkflowWarning(false);
                    // Navigation logic would go here
                  }}
                  className="w-full py-4 bg-[#0463EF] text-white rounded-[4px] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 border-none"
                 >
                   {language === 'TH' ? 'ไปที่ตั้งค่าเวิร์กโฟลว์' : 'Go to Set Workflow'}
                 </button>
                 <button 
                  onClick={() => setShowWorkflowWarning(false)}
                  className="w-full py-2 bg-transparent hover:bg-transparent text-slate-400 hover:text-slate-500 font-bold text-sm transition-all cursor-pointer border-none"
                 >
                   {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Export Job Modal Dialog */}
      {exportJob && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col gap-6 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            
            {/* Header section with export tag & title */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0463EF] flex items-center justify-center border border-blue-100">
                  <Send size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#010136] tracking-tight mb-0.5">
                    {language === 'TH' ? 'ส่งออกข้อมูลรายการ' : 'Export Job Data'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {language === 'TH' ? 'อ้างอิง:' : 'REFERENCE:'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/50">
                      {exportJob.reference}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setExportJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                id="close-export-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Selection Area */}
            <div className="flex flex-col gap-4">
              <label className="text-[11px] font-black text-[#010136] uppercase tracking-wider">
                {language === 'TH' ? 'เลือกตัวเลือกในการส่งออก' : 'Choose Export Option'}
              </label>

                            {/* Export Workflow Section */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-slate-700">
                    {language === 'TH' ? 'ส่งออกโดยใช้ Workflow (ตามระบบ)' : 'Export using Workflow (Default)'}
                  </span>
                  {exportJob.workflowName && (
                    <span className="text-[9px] font-black text-[#0463EF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                      {language === 'TH' ? 'มีเวิร์กโฟลว์อยู่แล้ว' : 'Workflow Bound'}
                    </span>
                  )}
                </div>

                {/* Workflow Dropdown picker */}
                <div onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <select
                      disabled={!!exportJob.workflowName}
                      value={exportJob.workflowName || selectedExportWorkflow}
                      onChange={(e) => setSelectedExportWorkflow(e.target.value)}
                      className="w-full bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200/80 border border-slate-200/80 rounded-xl py-2.5 px-4 pr-10 focus:ring-4 focus:ring-blue-500/10 focus:border-[#0463EF] text-xs font-black uppercase tracking-tight appearance-none cursor-pointer disabled:cursor-not-allowed outline-none shadow-sm font-sans transition-all"
                    >
                      <option value="">-- {language === 'TH' ? 'เลือกเวิร์กโฟลว์' : 'SELECT WORKFLOW'} --</option>
                      {mockWorkflows.map(wf => (
                        <option key={wf.id} value={wf.name}>{wf.name}</option>
                      ))}
                      {exportJob.workflowName && !mockWorkflows.find(wf => wf.name === exportJob.workflowName) && (
                        <option value={exportJob.workflowName}>{exportJob.workflowName}</option>
                      )}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                  {exportJob.workflowName && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                      <span>
                        {language === 'TH' 
                          ? `เวิร์กโฟลว์ถูกบังคับเลือกเป็น "${exportJob.workflowName}"`
                          : `Enforced by original workflow "${exportJob.workflowName}"`}
                      </span>
                    </div>
                  )}
                </div>
              </div>


            </div>

            {/* Double Button Actions */}
            <div className="flex gap-4 w-full mt-2">
              <Button 
                size="large" 
                className="flex-1 rounded-[4px] h-12 font-black uppercase tracking-widest text-[11px] border-slate-200 text-slate-600 hover:bg-slate-50 font-sans"
                onClick={() => setExportJob(null)}
              >
                {language === 'TH' ? 'ยกเลิก' : 'CANCEL'}
              </Button>
              <Button 
                type="primary" 
                size="large" 
                disabled={exportOption === 'workflow' && !exportJob.workflowName && !selectedExportWorkflow}
                className="flex-1 rounded-[4px] h-12 font-black uppercase tracking-widest text-[11px] bg-[#0463EF] hover:bg-[#0352c7] border-none shadow-lg shadow-blue-500/20 font-sans disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => handleConfirmExport(exportJob)}
              >
                {language === 'TH' ? 'ส่งออกข้อมูล' : 'EXPORT DATA'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Locking Prompt Modal */}
      {showLockPrompt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white p-10 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-emerald-50">
                 <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">{t.validationPassed}</h3>
                <p className="text-slate-500 font-bold">{t.validationPassedDesc}</p>
              </div>
              <div className="flex flex-col w-full gap-3 mt-4">
                 <button 
                  onClick={handleForceLock}
                  className="w-full py-4 bg-slate-900 text-white rounded-[4px] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border-none"
                 >
                   <Lock size={18} /> {t.yesLockProceed}
                 </button>
                 <button 
                  onClick={() => setShowLockPrompt(false)}
                  className="w-full py-2 bg-transparent hover:bg-transparent text-slate-400 hover:text-slate-500 font-bold text-sm transition-all cursor-pointer border-none"
                 >
                   {t.illCheckAgain}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Claim Job confirmation modal */}
      {showClaimPrompt && selectedJob && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white p-10 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300 animate-out fade-out duration-200">
              <div className="w-24 h-24 rounded-full bg-blue-50 text-[#0463EF] flex items-center justify-center border-4 border-blue-100/50">
                 <UserPlus size={44} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#010136] tracking-tighter mb-2 leading-tight">
                  {language === 'TH' ? 'ยืนยันการรับงาน' : 'Confirm job claim'}
                </h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed px-2">
                  {language === 'TH' 
                    ? `คุณต้องการรับผิดชอบตรวจสอบข้อมูลรายการ ${selectedJob.reference} ใช่หรือไม่?` 
                    : `Are you sure you want to claim responsibility for job ${selectedJob.reference}?`}
                </p>
              </div>
              <div className="flex flex-col w-full gap-2.5 mt-2">
                  <button 
                    onClick={handleClaimJob}
                    className="w-full py-3.5 bg-[#0463EF] hover:bg-blue-600 text-white rounded-[4px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 border-none"
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>{language === 'TH' ? 'ใช่, ยืนยันรับงาน' : 'YES, CLAIM JOB'}</span>
                  </button>
                  <button 
                    onClick={() => setShowClaimPrompt(false)}
                    className="w-full py-2 bg-transparent hover:bg-transparent text-slate-400 hover:text-slate-500 font-bold text-sm transition-all cursor-pointer border-none"
                  >
                    {language === 'TH' ? 'ยกเลิก' : 'CANCEL'}
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* Reject Data confirmation modal */}
        {showCreateJobModal && (
        <CreateJobModal
          visible={showCreateJobModal}
          onClose={() => setShowCreateJobModal(false)}
          onCreate={(newJob) => setJobs(prev => [newJob, ...prev])}
          workflows={mockWorkflows}
          language={language}
        />
      )}

      {/* Reject Data confirmation modal */}
       {showRejectFileModal && rejectFileTargetDocName && (
         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white p-10 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border-4 border-rose-50">
                  <AlertTriangle size={48} strokeWidth={3} />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">
                     {language === 'TH' ? 'ยืนยันปฏิเสธข้อมูล' : 'Confirm Reject Data'}
                  </h3>
                  <p className="text-slate-500 font-bold">
                     {language === 'TH' 
                       ? 'ระบบจะส่งข้อมูลนี้กลับไปแจ้งที่ต้นทาง' 
                       : 'The system will send a notification back to the source.'}
                  </p>
               </div>
               <div className="flex flex-col w-full gap-3 mt-4">
                  <button 
                   onClick={() => {
                     handleRejectFile(rejectFileTargetDocName);
                     message.success(language === 'TH' ? 'ปฏิเสธข้อมูลเรียบร้อยแล้ว' : 'Data rejected successfully.');
                     setShowRejectFileModal(false);
                     setRejectFileTargetDocName(null);
                   }}
                   className="w-full py-4 bg-rose-500 text-white rounded-[4px] font-black text-sm uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2 border-none"
                  >
                    {language === 'TH' ? 'ยืนยันปฏิเสธ' : 'Confirm Reject'}
                  </button>
                  <button 
                   onClick={() => {
                     setShowRejectFileModal(false);
                     setRejectFileTargetDocName(null);
                   }}
                   className="w-full py-2 bg-transparent hover:bg-transparent text-slate-400 hover:text-slate-500 font-bold text-sm transition-all cursor-pointer border-none"
                  >
                    {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                  </button>
               </div>
            </div>
         </div>
       )}

      {/* Unclaim Job confirmation modal */}
      {showUnclaimPrompt && selectedJob && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white p-10 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300 animate-out fade-out duration-200">
              <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border-4 border-rose-100/50">
                 <UserMinus size={44} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#010136] tracking-tighter mb-2 leading-tight">
                  {language === 'TH' ? 'ยืนยันการยกเลิกรับงาน' : 'Confirm unclaim'}
                </h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed px-2">
                  {language === 'TH' 
                    ? `คุณต้องการยกเลิกการรับผิดชอบ และคืนรายการ ${selectedJob.reference} กลับสู่ระบบใช่หรือไม่?` 
                    : `Are you sure you want to unclaim and return job ${selectedJob.reference} to unassigned state?`}
                </p>
              </div>
              <div className="flex flex-col w-full gap-2.5 mt-2">
                  <button 
                    onClick={handleUnclaimJob}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[4px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-500/10 hover:shadow-rose-500/25 border-none"
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>{language === 'TH' ? 'ใช่, ยกเลิกรับงาน' : 'YES, UNCLAIM JOB'}</span>
                  </button>
                  <button 
                    onClick={() => setShowUnclaimPrompt(false)}
                    className="w-full py-2 bg-transparent hover:bg-transparent text-slate-400 hover:text-slate-500 font-bold text-sm transition-all cursor-pointer border-none"
                  >
                    {language === 'TH' ? 'ยกเลิก' : 'CANCEL'}
                  </button>
              </div>
           </div>
        </div>
      )}

      {step === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 animate-in fade-in duration-500" id="job-board-wrapper">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-1 flex items-center gap-3 animate-in slide-in-from-left duration-300">
                {t.jobList}
              </h2>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-slate-500 font-bold text-xs md:text-sm">{t.jobListDesc}</p>
                <button
                  onClick={() => setShowStatusGuide(true)}
                  className="inline-flex items-center justify-center p-1 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer group"
                  title="STATUS GUIDE"
                  id="status-guide-icon-btn"
                >
                  <HelpCircle size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateJobModal(true)}
              className="px-4 py-2 bg-[#0463EF] text-white rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
              id="create-new-job-btn"
            >
              <Plus size={16} />
              สร้างรายการใหม่
            </button>
          </div>
          
          <Tabs 
            activeKey={activeBoardTab} 
            onChange={setActiveBoardTab}
            className="custom-job-tabs mb-6"
            items={[
              {
                key: 'jobs',
                label: (
                  <div className="flex items-center gap-2 px-1 py-2 group">
                    <List size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-black uppercase tracking-[0.05em] text-[13px] text-slate-500 font-sans group-hover:text-slate-800 transition-colors">
                      {t.tabJobList}
                    </span>
                  </div>
                ),
                children: renderGrid()
              },
              {
                key: 'pending',
                label: (
                  <div className="flex items-center gap-2 px-1 py-2 group">
                    <Inbox size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-black uppercase tracking-[0.05em] text-[13px] text-slate-500 font-sans group-hover:text-slate-800 transition-colors">
                      {t.tabPendingInbox}
                    </span>
                    <Badge 
                      count={pendingInboxItems.filter(item => !readPendingIds.has(item.id)).length} 
                      size="small" 
                      className="ml-1"
                      styles={{ count: { fontSize: '10px', fontWeight: 900, backgroundColor: '#DC2626', color: '#ffffff', minWidth: '18px', height: '18px', lineHeight: '18px', border: 'none', boxShadow: 'none', opacity: 1 } }}
                    />
                  </div>
                ),
                children: renderPendingInbox()
              },
              {
                key: 'logs',
                label: (
                  <div className="flex items-center gap-2 px-1 py-2 group">
                    <Clock size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-black uppercase tracking-[0.05em] text-[13px] text-slate-500 font-sans group-hover:text-slate-800 transition-colors">
                      {t.tabActivityLogs}
                    </span>
                  </div>
                ),
                children: renderActivityLogs()
              }
            ]}
          />
          
          <style>{`
            .custom-job-tabs .ant-tabs-nav { margin: 0 0 10px 0 !important; }
            .custom-job-tabs .ant-tabs-nav::before { border-bottom: 2px solid #f1f5f9; }
            .custom-job-tabs .ant-tabs-tab { padding: 4px 12px !important; margin: 0 24px 0 0 !important; }
            .custom-job-tabs .ant-tabs-tab-active .ant-tabs-tab-btn > div > span:first-of-type { color: #010136 !important; }
            .custom-job-tabs .ant-tabs-tab-active svg { color: #0463EF !important; }
            .custom-job-tabs .ant-tabs-ink-bar { background: #0463EF !important; height: 3px !important; border-radius: 3px 3px 0 0; }
            .custom-job-tabs .ant-badge .ant-scroll-number-only-unit { color: white !important; }
          `}</style>
        </div>
      )}

      {step === 1 && selectedJob && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50">
          {/* Compact Header Section */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between z-30 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                  onClick={() => {
                    setStep(0);
                    setSelectedJob(null);
                  }}
                  className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="flex items-center gap-3">
                   <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-xl font-black text-slate-800 tracking-tighter leading-none uppercase">
                          {selectedJob.reference}
                        </h2>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider group/status cursor-help relative border ${
                           selectedJob.status === JobStatus.READY ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                           selectedJob.status === JobStatus.DONE ? 'bg-teal-50 border-teal-200 text-teal-700' : 
                           selectedJob.status === JobStatus.PENDING ? 'bg-blue-50 border-blue-200 text-blue-700' :
                           selectedJob.status === JobStatus.NEW ? 'bg-slate-50 border-slate-200 text-slate-500' :
                           selectedJob.status === JobStatus.REVIEW ? 'bg-amber-50 border-amber-200 text-amber-600' :
                           selectedJob.status === JobStatus.PROCESSING ? 'bg-blue-600 border-blue-700 text-white animate-pulse' :
                           'bg-slate-50 border-slate-200 text-slate-500'
                         }`}
                         onClick={() => setShowStatusGuide(true)}
                         >
                           {(selectedJob.status === JobStatus.PROCESSING || selectedJob.status === JobStatus.REVIEW) && (
                             <div className={`w-1.5 h-1.5 rounded-full ${selectedJob.status === JobStatus.PROCESSING ? 'bg-white' : 'bg-amber-500'} animate-pulse`}></div>
                           )}
                           {selectedJob.status === JobStatus.READY 
                               ? (language === 'TH' ? 'เสร็จสมบูรณ์' : 'READY') 
                               : selectedJob.status === JobStatus.DONE 
                               ? (language === 'TH' ? 'ส่งออกแล้ว' : 'EXPORTED') 
                               : selectedJob.status === JobStatus.PENDING 
                               ? (language === 'TH' ? 'รอดำเนินการ' : 'PENDING') 
                               : selectedJob.status === JobStatus.NEW 
                               ? (language === 'TH' ? 'รอไฟล์ครบ' : 'PENDING FILES') 
                               : selectedJob.status === JobStatus.PROCESSING 
                               ? (language === 'TH' ? 'กำลังเปรียบเทียบข้อมูล' : 'COMPARING') 
                               : selectedJob.status === JobStatus.REVIEW 
                               ? (language === 'TH' ? 'รอตรวจสอบ' : 'REVIEW') 
                               : selectedJob.status}
                           <HelpCircle size={10} className="ml-1 opacity-40 group-hover/status:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedJob.workflowName}</p>
                         <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedJob.createdAt ? formatDisplayDate(selectedJob.createdAt) : 'N/A'}</p>
                         <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-1.5 py-0.5 shadow-sm">
                           <User size={9} className="text-[#0463EF]" />
                           <span className="text-slate-400 text-[8px]">{language === 'TH' ? 'ผู้รับผิดชอบ:' : 'USER:'}</span>
                           <span className="text-[#010136] font-extrabold font-mono text-[9px]">
                             {selectedJob.assignee || (language === 'TH' ? 'ยังไม่ได้มอบหมาย' : 'Unassigned')}
                           </span>
                         </p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl shadow-sm">
                  {/* Claim / Unclaim Action Controls */}
                  {selectedJob.status !== JobStatus.READY && selectedJob.status !== JobStatus.DONE && (
                    <>
                      {(!selectedJob.assignee || selectedJob.assignee === 'Unassigned' || selectedJob.assignee === '') ? (
                        <Tooltip content={language === 'TH' ? 'รับงานนี้เพื่อเป็นผู้รับผิดชอบงาน' : 'Claim responsibility for this task'}>
                          <button 
                            type="button"
                            onClick={() => setShowClaimPrompt(true)}
                            className="px-3.5 py-2.5 bg-[#0463EF] hover:bg-[#0463EF]/90 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer h-10 select-none border-none shrink-0"
                            id="claim-job-btn"
                          >
                            <UserPlus size={13} strokeWidth={3} />
                            <span>{language === 'TH' ? 'รับงาน' : 'CLAIM JOB'}</span>
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip content={language === 'TH' ? 'ยกเลิกรับงานนี้เพื่อคืนงานกลับเข้าระบบ' : 'Unclaim responsibility and return job to unassigned'}>
                          <button 
                            type="button"
                            onClick={() => setShowUnclaimPrompt(true)}
                            className="px-3.5 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-black text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer h-10 select-none shrink-0"
                            id="unclaim-job-btn"
                          >
                            <UserMinus size={13} strokeWidth={3} />
                            <span>{language === 'TH' ? 'ยกเลิกรับงาน' : 'UNCLAIM JOB'}</span>
                          </button>
                        </Tooltip>
                      )}
                      <div className="w-px h-6 bg-slate-200 mx-1 shrink-0"></div>
                    </>
                  )}

                  {/* 1. Show only differences Filter */}
                  <Tooltip content={showOnlyDiff ? (language === 'TH' ? 'แสดงทั้งหมด' : 'Show All') : (language === 'TH' ? 'ดูเฉพาะที่ต่าง' : 'Show Only Differences')}>
                    <button 
                      disabled={isUnassigned}
                      onClick={() => setShowOnlyDiff(!showOnlyDiff)}
                      className={`p-2.5 rounded-xl transition-all border flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${
                        showOnlyDiff 
                          ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 shadow-[0_2px_8px_rgba(244,63,94,0.15)]' 
                          : 'bg-white text-slate-500 border-slate-200/60 hover:bg-slate-50'
                      }`}
                    >
                      <ListFilter size={15} strokeWidth={2.5} className={showOnlyDiff ? 'text-rose-500' : 'text-slate-400'} />
                    </button>
                  </Tooltip>

                  {hiddenLockedDocs.length > 0 && (
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-sm">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                        <EyeOff size={11} className="text-slate-400" />
                        {language === 'TH' ? 'ซ่อนคอลัมน์อยู่:' : 'Hidden:'}
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {hiddenLockedDocs.map(name => (
                          <span 
                            key={name}
                            className="bg-slate-50 border border-slate-200/50 pl-2 pr-1.5 py-0.5 rounded-lg text-[9px] font-black text-slate-700 flex items-center gap-1 hover:border-slate-300 transition-colors shadow-sm"
                          >
                            <span className="max-w-[70px] truncate uppercase">{name}</span>
                            <button
                              onClick={() => setHiddenLockedDocs(prev => prev.filter(x => x !== name))}
                              disabled={isUnassigned}
                              className="p-0.5 hover:bg-slate-200 rounded text-blue-600 transform active:scale-95 transition-all cursor-pointer flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
                              title={language === 'TH' ? 'แสดงคอลัมน์นี้' : 'Unhide column'}
                            >
                              <Eye size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="w-px h-6 bg-slate-200 mx-0.5"></div>

                  {/* 2. Upload/Group Files Workspace */}
                  <Tooltip content={language === 'TH' ? 'อัปโหลดและจัดกลุ่มไฟล์' : LOCAL_T[language].btnOpenWorkspace}>
                    <button
                      disabled={isUnassigned || selectedJob.status === JobStatus.DONE}
                      onClick={() => setShowUploadModal(true)}
                      className={`p-2.5 rounded-xl transition-all flex items-center justify-center border cursor-pointer ${
                        selectedJob.status === JobStatus.DONE 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 border-indigo-700/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-indigo-500/10'
                      }`}
                      id="trigger-upload-modal-btn"
                    >
                      <Upload size={15} strokeWidth={2.5} className="shrink-0" />
                    </button>
                  </Tooltip>

                  {/* 3. Bulk OCR - Read All files (only visible conditionally) */}
                  {selectedJob.status !== JobStatus.DONE && Object.values(selectedJob.docs).some(s => s === ComparisonDocStatus.RECEIVED) && (
                    <Tooltip content={t.btnBulkOCR}>
                      <button 
                        disabled={isUnassigned}
                        onClick={() => {
                          const newDocs = Object.entries(selectedJob.docs)
                            .filter(([_, status]) => status === ComparisonDocStatus.RECEIVED)
                            .map(([name]) => name);
                          handleOCRFiles(selectedJob.id, newDocs);
                        }}
                        className="p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700/20 shadow-emerald-500/10 cursor-pointer animate-pulse disabled:opacity-30 disabled:cursor-not-allowed disabled:animate-none"
                      >
                        <ScanSearch size={15} strokeWidth={2.5} />
                      </button>
                    </Tooltip>
                  )}

                  {/* 4. Compare / Validation Button */}
                  <Tooltip content={selectedJob.status === JobStatus.PROCESSING ? t.validating : t.runValidation}>
                    <button 
                      disabled={
                        isUnassigned || 
                        selectedJob.status === JobStatus.READY || 
                        selectedJob.status === JobStatus.DONE || 
                        selectedJob.status === JobStatus.PROCESSING ||
                        Object.values(selectedJob.docs).some(s => s === ComparisonDocStatus.RECEIVED || s === ComparisonDocStatus.EXTRACTING) ||
                        (selectedJob.status === JobStatus.NEW && 
                          Object.values(selectedJob.docs).filter(s => 
                             s !== ComparisonDocStatus.MISSING && 
                             s !== ComparisonDocStatus.RECEIVED && 
                             s !== ComparisonDocStatus.EXTRACTING
                          ).length < 2)
                      }
                      onClick={() => {
                        if(window.confirm(t.confirmRunValidation)) {
                           handleStartComparison(selectedJob.id);
                        }
                      }}
                      className={`p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center border disabled:opacity-30 disabled:cursor-not-allowed ${
                        selectedJob.status === JobStatus.PROCESSING 
                          ? 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse' 
                          : 'bg-blue-600 text-white border-blue-700/20 hover:bg-blue-700 shadow-blue-500/10'
                      }`}
                    >
                      <Bot size={15} strokeWidth={2.5} className={selectedJob.status === JobStatus.PROCESSING ? 'animate-spin' : ''} /> 
                    </button>
                  </Tooltip>

                  {/* 5. Lock / Unlock Item */}
                  <Tooltip content={selectedJob.status === JobStatus.READY ? t.unlockJob : t.lockJob}>
                    <button 
                       disabled={isUnassigned || (!areAllFilesLocked && selectedJob.status !== JobStatus.READY) || selectedJob.status === JobStatus.DONE}
                       onClick={handleForceLock}
                       className={`p-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed ${
                         selectedJob.status === JobStatus.READY 
                         ? 'bg-rose-50 text-rose-500 border-rose-200/60 hover:bg-rose-100 hover:text-rose-600 shadow-rose-100' 
                         : 'bg-white text-slate-400 border-slate-200/60 enabled:bg-emerald-50 enabled:text-emerald-600 enabled:border-emerald-200/60 enabled:hover:bg-emerald-600 enabled:hover:text-white'
                       }`}
                    >
                      {selectedJob.status === JobStatus.READY ? <Unlock size={15} strokeWidth={2.5} /> : <Lock size={15} strokeWidth={2.5} />}
                    </button>
                  </Tooltip>

                  {/* 6. Export Data Button */}
                  <Tooltip content={t.exportData}>
                    <button 
                      disabled={isUnassigned || selectedJob.status !== JobStatus.READY}
                      onClick={() => {
                        setExportJob(selectedJob);
                        setExportOption('workflow');
                        setSelectedExportWorkflow(selectedJob.workflowName || '');
                        setSelectedExportPlatform('FTA');
                      }}
                      className={`p-2.5 rounded-xl transition-all flex items-center justify-center border disabled:opacity-30 disabled:cursor-not-allowed ${
                        selectedJob.status === JobStatus.READY 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700/20 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/10' 
                          : 'bg-white border-slate-200/60 text-slate-400 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Send size={15} strokeWidth={2.5} />
                    </button>
                  </Tooltip>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
               {/* Main Content Area: Comparison Matrix Grid */}
               <div className="flex-1 overflow-hidden flex flex-col bg-white">
                  <div className="flex-1 overflow-auto custom-scrollbar relative">
                     <table className="w-full border-separate border-spacing-0 sticky top-0 z-40 bg-white" style={{ tableLayout: 'fixed' }}>
                        <colgroup>
                           <col className="w-[180px]" style={{ minWidth: '180px' }} />
                           {comparedDocs.map(docName => (
                              <col key={`col-${docName}`} className="w-[180px]" style={{ minWidth: '180px' }} />
                           ))}
                        </colgroup>
                        <thead>
                           <tr>
                              <th className="bg-blue-600 border-b border-r border-blue-700 px-4 py-1.5 min-w-[180px] flex items-center justify-center uppercase tracking-tighter shadow-[2px_0_5px_rgba(0,0,0,0.02)] h-[82px] sticky left-0 z-40">
                                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none text-center">{t.masterVsDocs}</h3>
                              </th>

                              {comparedDocs.map(docName => {
                                 const docStatus = selectedJob.docs[docName];
                                 const isMismatched = mismatchedFileNames.has(docName);
                                 const isReady = docStatus !== ComparisonDocStatus.RECEIVED && docStatus !== ComparisonDocStatus.EXTRACTING;
                                 
                                 // Derived status for display - override MATCHED if there are actual mismatches in data
                                 const displayStatus = (docStatus === ComparisonDocStatus.MATCHED) && isMismatched
                                   ? ComparisonDocStatus.MISMATCHED
                                   : docStatus;
                                 
                                 return (
                                   <th key={docName} className="bg-slate-50 border-b border-slate-200 px-2 py-1.5 min-w-[180px] text-center group cursor-pointer hover:bg-slate-100 transition-all border-r border-slate-100 h-[82px] z-30 relative" onClick={() => isReady && setPdfPreviewUrl(docName)}>
                                       {docStatus === ComparisonDocStatus.RECEIVED && (
                                         <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-[1px] flex flex-col items-center justify-between p-1.5 border-x border-slate-100 shadow-inner">
                                            <div className="flex items-center justify-between w-full gap-1 px-1 py-0.5">
                                              <span className="text-[10px] font-black text-[#010136] uppercase tracking-widest leading-none truncate max-w-[100px]" title={docName}>
                                                {docName.length > 11 ? (
                                                  <Tooltip content={docName}>
                                                    <span className="cursor-help hover:text-[#0463EF] transition-colors">{docName.slice(0, 11) + '...'}</span>
                                                  </Tooltip>
                                                ) : (
                                                  docName
                                                )}
                                              </span>
                                              <div className="flex items-center gap-1 shrink-0 bg-white/40 p-0.5 rounded shadow-sm border border-slate-100/50">
                                                <Tooltip content={language === 'TH' ? 'แทนที่ไฟล์ (Replace)' : 'Replace Files'}>
                                                  <button disabled={isUnassigned || selectedJob.status === JobStatus.DONE} onClick={(e) => { e.stopPropagation(); setReplaceTargetColumn(docName); setShowReplaceModal(true); }} className="p-0.5 rounded bg-white hover:bg-slate-100 text-[#0463EF] hover:text-[#0463EF] cursor-pointer flex items-center justify-center h-[18px] w-[18px] border border-slate-200/55 shadow-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <ArrowLeftRight size={8} strokeWidth={2.5} />
                                                  </button>
                                                </Tooltip>
                                                <Tooltip content={language === 'TH' ? 'ลบไฟล์คอลัมออก (Delete Column)' : 'Delete Column'}>
                                                  <button
                                                    disabled={isUnassigned || selectedJob.status === JobStatus.DONE}
                                                    onClick={(e) => { 
                                                      e.stopPropagation(); 
                                                      setDeleteColumnTargetDocName(docName);
                                                      setShowDeleteColumnConfirmModal(true);
                                                    }} 
                                                    className="p-0.5 rounded bg-white hover:bg-rose-50 text-rose-500 cursor-pointer flex items-center justify-center h-[18px] w-[18px] border border-slate-200/55 shadow-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                  >
                                                    <Trash2 size={8} strokeWidth={2.5} />
                                                  </button>
                                                </Tooltip>
                                              </div>
                                            </div>
                                            <button
                                             disabled={isUnassigned || selectedJob.status === JobStatus.DONE}
                                             onClick={(e) => {
                                               e.stopPropagation();
                                               handleOCRFiles(selectedJob.id, [docName]);
                                             }}
                                             className="w-full h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all transform active:scale-95 border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:active:scale-100 disabled:hover:bg-emerald-600"
                                           >
                                             <FileText size={10} strokeWidth={2.5} />
                                             <span className="text-[9px] font-black uppercase tracking-widest">{t.btnReadFile}</span>
                                           </button>
                                         </div>
                                       )}
                                       {docStatus === ComparisonDocStatus.EXTRACTING && (
                                         <div className="absolute inset-0 z-50 bg-blue-50/95 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 border-x border-blue-100">
                                            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest leading-none mb-2.5">
                                             {docName.length > 15 ? (
                                               <Tooltip content={docName}>
                                                 <span className="cursor-help hover:text-indigo-600 transition-colors">{docName.slice(0, 15) + '...'}</span>
                                               </Tooltip>
                                             ) : (
                                               docName
                                             )}
                                            </span>
                                            <div className="flex flex-col items-center gap-1.5 translate-y-[-2px]">
                                              <Loader2 size={22} className="text-blue-600 animate-spin" />
                                              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest animate-pulse">{t.msgOcrInProgress}</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-[5000ms] w-full origin-left ease-linear" style={{ animation: 'progress 5s linear forwards' }}></div>
                                            <style>{`
                                              @keyframes progress {
                                                from { width: 0%; }
                                                to { width: 100%; }
                                              }
                                            `}</style>
                                         </div>
                                       )}
                                      <div className="flex flex-col gap-0.5 items-center">
                                         {/* Status and Action Buttons */}
                                         <div className="flex items-center justify-between w-full px-1">
                                            <div className="flex items-center gap-1 scale-95 origin-left">
                                               <div className={`w-1 h-1 rounded-full ${
                                                 displayStatus === ComparisonDocStatus.MATCHED || displayStatus === ComparisonDocStatus.LOCKED ? 'bg-emerald-500' :
                                                 displayStatus === ComparisonDocStatus.OCR_DONE ? 'bg-amber-500' :
                                                 displayStatus === ComparisonDocStatus.EXTRACTING || displayStatus === ComparisonDocStatus.RECEIVED ? 'bg-amber-500 animate-pulse' :
                                                 displayStatus === ComparisonDocStatus.ERROR || displayStatus === ComparisonDocStatus.MISMATCHED ? 'bg-rose-500' :
                                                 'bg-slate-300'
                                               }`}></div>
                                               <span className={`text-[7px] font-black uppercase tracking-wider ${
                                                 displayStatus === ComparisonDocStatus.MATCHED || displayStatus === ComparisonDocStatus.LOCKED ? 'text-emerald-500' :
                                                 displayStatus === ComparisonDocStatus.OCR_DONE ? 'text-amber-500' :
                                                 displayStatus === ComparisonDocStatus.EXTRACTING || displayStatus === ComparisonDocStatus.RECEIVED ? 'text-amber-500' :
                                                 displayStatus === ComparisonDocStatus.ERROR || displayStatus === ComparisonDocStatus.MISMATCHED ? 'text-rose-500' :
                                                 'text-slate-400'
                                               }`}>
                                                   {
                                                     displayStatus === ComparisonDocStatus.LOCKED ? t.statusLocked : 
                                                     (displayStatus === ComparisonDocStatus.RECEIVED || displayStatus === ComparisonDocStatus.EXTRACTING) ? t.statusReceived : 
                                                     displayStatus === ComparisonDocStatus.OCR_DONE ? t.statusOcrDone :
                                                     displayStatus
                                                   }
                                               </span>
                                            </div>

                                            
                                             <div className="flex items-center gap-1 scale-90">
                                                {docStatus === ComparisonDocStatus.MISMATCHED || docStatus === ComparisonDocStatus.OCR_DONE ? (
                                                  <>
                                                    {/* Replace File Button */}
                                                    <Tooltip content={language === 'TH' ? 'แทนที่ไฟล์ (Replace)' : 'Replace Files'}>
                                                      <button
                                                        disabled={isUnassigned || selectedJob.status === JobStatus.DONE}
                                                        title={language === 'TH' ? 'แทนที่ไฟล์' : 'Replace Files'}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setReplaceTargetColumn(docName);
                                                          setShowReplaceModal(true);
                                                        }}
                                                        className={`p-1 rounded-lg bg-white border border-slate-200 transition-all ${
                                                          (isUnassigned || selectedJob.status === JobStatus.DONE)
                                                          ? 'text-slate-200 cursor-not-allowed opacity-50'
                                                          : 'text-indigo-400 hover:bg-slate-500 hover:text-white hover:border-indigo-500 hover:shadow-lg shadow-sm cursor-pointer'
                                                        }`}
                                                      >
                                                        <ArrowLeftRight size={10} strokeWidth={2.5} />
                                                      </button>
                                                    </Tooltip>


                                                    {/* Delete File Column (ลบไฟล์คอลัมออก) */}
                                                    <Tooltip content={language === 'TH' ? 'ลบไฟล์คอลัมออก (Delete Column)' : 'Delete Column'}>
                                                      <button
                                                        disabled={isUnassigned || selectedJob.status === JobStatus.DONE}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setDeleteColumnTargetDocName(docName);
                                                          setShowDeleteColumnConfirmModal(true);
                                                        }}
                                                        className={`p-1 rounded-lg bg-white border border-slate-200 transition-all ${
                                                          (isUnassigned || selectedJob.status === JobStatus.DONE)
                                                          ? 'text-slate-200 cursor-not-allowed opacity-50'
                                                          : 'text-rose-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer flex items-center justify-center border border-slate-200/55 hover:shadow-lg shadow-sm'
                                                        }`}
                                                      >
                                                        <Trash2 size={10} strokeWidth={2.5} />
                                                      </button>
                                                    </Tooltip>
                                                  </>
                                                ) : docStatus === ComparisonDocStatus.MATCHED ? (
                                                   <>
                                                     <Tooltip content={language === 'TH' ? 'แทนที่ไฟล์ (Replace)' : 'Replace Files'}>
                                                       <button
                                                         disabled={isUnassigned || docStatus === ComparisonDocStatus.EXTRACTING || docStatus === ComparisonDocStatus.LOCKED || selectedJob.status === JobStatus.DONE}
                                                         title={language === 'TH' ? 'แทนที่ไฟล์' : 'Replace Files'}
                                                         onClick={(e) => {
                                                           e.stopPropagation();
                                                           if (docStatus === ComparisonDocStatus.LOCKED) return;
                                                           setReplaceTargetColumn(docName);
                                                           setShowReplaceModal(true);
                                                         }}
                                                         className={`p-1 rounded-lg bg-white border border-slate-200 transition-all ${
                                                           (isUnassigned || docStatus === ComparisonDocStatus.EXTRACTING || docStatus === ComparisonDocStatus.LOCKED || selectedJob.status === JobStatus.DONE)
                                                           ? 'text-slate-200 cursor-not-allowed opacity-50'
                                                           : 'text-indigo-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 hover:shadow-lg shadow-sm'
                                                         }`}
                                                       >
                                                         <ArrowLeftRight size={10} strokeWidth={2.5} />
                                                       </button>
                                                     </Tooltip>
                                                     <Tooltip content={docStatus === ComparisonDocStatus.LOCKED ? (language === 'TH' ? 'ปลดล็อค' : 'Unlock') : (language === 'TH' ? 'ล็อคไฟล์นี้ (ไม่รวมในการตรวจสอบ)' : 'Lock File')}>
                                                       <button 
                                                         disabled={
                                                           isUnassigned || 
                                                           docStatus === ComparisonDocStatus.RECEIVED || 
                                                           docStatus === ComparisonDocStatus.EXTRACTING ||
                                                           (docStatus !== ComparisonDocStatus.LOCKED && isMismatched) ||
                                                           selectedJob.status === JobStatus.DONE
                                                         }
                                                         onClick={(e) => {
                                                           e.stopPropagation();
                                                           handleToggleFileLock(docName);
                                                         }}
                                                         className={`p-1 rounded-lg bg-white border border-slate-200 transition-all ${
                                                           docStatus === ComparisonDocStatus.LOCKED 
                                                           ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.35)]' 
                                                           : (isUnassigned || docStatus === ComparisonDocStatus.RECEIVED || docStatus === ComparisonDocStatus.EXTRACTING || (docStatus !== ComparisonDocStatus.LOCKED && isMismatched) || selectedJob.status === JobStatus.DONE)
                                                           ? 'text-slate-200 cursor-not-allowed opacity-50'
                                                           : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-800 shadow-sm'
                                                         }`}
                                                       >
                                                         {docStatus === ComparisonDocStatus.LOCKED ? <Lock size={10} strokeWidth={3} /> : <Unlock size={10} strokeWidth={2.5} />}
                                                       </button>
                                                     </Tooltip>
                                                   </>
                                                 ) : (
                                                  <>
                                                    <Tooltip content={language === 'TH' ? 'แทนที่ไฟล์ (Replace)' : 'Replace Files'}>
                                                      <button
                                                        disabled={isUnassigned || docStatus === ComparisonDocStatus.EXTRACTING || docStatus === ComparisonDocStatus.LOCKED || selectedJob.status === JobStatus.DONE}
                                                        title={language === 'TH' ? 'แทนที่ไฟล์' : 'Replace Files'}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          if (docStatus === ComparisonDocStatus.LOCKED) return;
                                                          setReplaceTargetColumn(docName);
                                                          setShowReplaceModal(true);
                                                        }}
                                                        className={`p-1 rounded-lg bg-white border border-slate-200 transition-all ${
                                                          (isUnassigned || docStatus === ComparisonDocStatus.EXTRACTING || docStatus === ComparisonDocStatus.LOCKED || selectedJob.status === JobStatus.DONE)
                                                          ? 'text-slate-200 cursor-not-allowed opacity-50'
                                                          : 'text-indigo-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 hover:shadow-lg shadow-sm'
                                                        }`}
                                                      >
                                                        <ArrowLeftRight size={10} strokeWidth={2.5} />
                                                      </button>
                                                    </Tooltip>
                                                    <Tooltip content={docStatus === ComparisonDocStatus.LOCKED ? (language === 'TH' ? 'ปลดล็อค' : 'Unlock') : (language === 'TH' ? 'ล็อคไฟล์นี้ (ไม่รวมในการตรวจสอบ)' : 'Lock File')}>
                                                      <button 
                                                        disabled={
                                                          isUnassigned || 
                                                          docStatus === ComparisonDocStatus.RECEIVED || 
                                                          docStatus === ComparisonDocStatus.EXTRACTING ||
                                                          (docStatus !== ComparisonDocStatus.LOCKED && isMismatched) ||
                                                          selectedJob.status === JobStatus.DONE
                                                        }
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleToggleFileLock(docName);
                                                        }}
                                                        className={`p-1 rounded-lg bg-white border border-slate-200 transition-all ${
                                                          docStatus === ComparisonDocStatus.LOCKED 
                                                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.35)]' 
                                                          : (isUnassigned || docStatus === ComparisonDocStatus.RECEIVED || docStatus === ComparisonDocStatus.EXTRACTING || (docStatus !== ComparisonDocStatus.LOCKED && isMismatched) || selectedJob.status === JobStatus.DONE)
                                                          ? 'text-slate-200 cursor-not-allowed opacity-50'
                                                          : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-800 shadow-sm'
                                                        }`}
                                                      >
                                                        {docStatus === ComparisonDocStatus.LOCKED ? <Lock size={10} strokeWidth={3} /> : <Unlock size={10} strokeWidth={2.5} />}
                                                      </button>
                                                    </Tooltip>
                                                    {docStatus === ComparisonDocStatus.LOCKED && (
                                                      <Tooltip content={language === 'TH' ? 'ซ่อนคอลัมน์นี้' : 'Hide Column'}>
                                                        <button 
                                                          disabled={isUnassigned}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            setHiddenLockedDocs(prev => [...prev, docName]);
                                                          }}
                                                          className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-800 hover:text-white hover:border-emerald-500 hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                          <EyeOff size={10} strokeWidth={2.5} />
                                                        </button>
                                                      </Tooltip>
                                                    )}
                                                  </>
                                                )}
                                             </div>
                                         </div>

                                         <div className="flex flex-col items-center gap-0">
                                            <span className={`text-[11px] font-black tracking-tight flex items-center gap-1 uppercase ${displayStatus === ComparisonDocStatus.MISMATCHED ? 'text-rose-500' : 'text-slate-800'}`}>
                                               {docName.length > 14 ? (
                                                 <Tooltip content={docName}>
                                                   <span className="cursor-help hover:text-indigo-600 transition-colors">{docName.slice(0, 14) + '...'}</span>
                                                 </Tooltip>
                                               ) : (
                                                 docName
                                               )}
                                               {isReady && <Eye size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </span>
                                         </div>

                                         {false && selectedJob.updatedDocs?.includes(docName) && (
                                           <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-sm border border-blue-100 flex items-center gap-1 mt-1 transition-all animate-in fade-in zoom-in duration-300">
                                             <RotateCcw size={8} strokeWidth={3} />
                                             Updated
                                           </span>
                                         )}
                                      </div>
                                   </th>
                                 );
                              })}
                           </tr>
                        </thead>
                     </table>
                           {['Header', 'Description', 'Footer'].map(part => {
                              const originalPartResults = comparisonResults.filter(res => (res as any).part === part);
                              const partResults = originalPartResults
                                .filter(res => !showOnlyDiff || res.targets.some((t: any) => t.status === 'MISMATCH'));
                              
                              if (partResults.length === 0) return null;

                              let displayMatchCount = 0;
                              let displaySynonymCount = 0;
                              let displayMismatchCount = 0;
                              let totalLabel = originalPartResults.length;

                              if (part === 'Description') {
                                const groups = Array.from(new Set(originalPartResults.map(r => r.group || 'no-group'))).filter(g => g !== 'no-group');
                                totalLabel = groups.length;
                                
                                groups.forEach(groupName => {
                                  const groupFields = originalPartResults.filter(r => r.group === groupName);
                                  const hasMismatch = groupFields.some(r => r.targets.some(t => t.status === 'MISMATCH'));
                                  const hasSynonym = !hasMismatch && groupFields.some(r => r.targets.some(t => t.status === 'SYNONYM'));
                                  
                                  if (hasMismatch) displayMismatchCount++;
                                  else if (hasSynonym) displaySynonymCount++;
                                  else displayMatchCount++;
                                });
                              } else {
                                displayMismatchCount = originalPartResults.filter(r => r.targets.some((t: any) => t.status === 'MISMATCH')).length;
                                displaySynonymCount = originalPartResults.filter(r => !r.targets.some((t: any) => t.status === 'MISMATCH') && r.targets.some((t: any) => t.status === 'SYNONYM')).length;
                                displayMatchCount = originalPartResults.length - displayMismatchCount - displaySynonymCount;
                              }

                              return (
                                <table key={part} className="w-full border-separate border-spacing-0" style={{ tableLayout: 'fixed' }}>
                                   <colgroup>
                                      <col className="w-[180px]" style={{ minWidth: '180px' }} />
                                      {comparedDocs.map(docName => (
                                         <col key={`col-${docName}`} className="w-[180px]" style={{ minWidth: '180px' }} />
                                      ))}
                                   </colgroup>
                                   <thead className="sticky top-[82px] z-[25] bg-slate-50 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
                                     <tr className="group cursor-pointer hover:bg-slate-100 transition-all" onClick={() => togglePart(part)}>
                                       <th 
                                         colSpan={comparedDocs.length + 1} 
                                         className="p-0 border-y border-slate-200/80 font-normal text-left"
                                       >
                                         <div className="sticky left-0 px-6 py-1.5 flex items-center justify-between w-fit gap-10 whitespace-nowrap z-30">
                                           <div className="flex items-center gap-4">
                                             <div className="flex items-center gap-3">
                                               <div className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors scale-90">
                                                 {collapsedParts[part] ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                                               </div>
                                               <div className="flex items-center gap-2">
                                                 <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-800 group-hover:text-blue-600 transition-colors uppercase">{part}</span>
                                                 <span className="text-[10px] font-black text-slate-400">:</span>
                                                 <span className="text-[10px] font-black text-slate-600">
                                                   {totalLabel} {part === 'Description' ? t.itemsList : t.itemsDataset}
                                                 </span>
                                               </div>
                                             </div>
                                             
                                             <div className="flex items-center gap-1.5 translate-y-[1px]">
                                              <Tooltip content={part === 'Description' ? t.ttMatchedCountDesc : t.ttMatchedCount}><div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-black tracking-tight ${showOnlyDiff ? 'bg-slate-50 text-slate-400 border-slate-200 shadow-none opacity-60' : (displayMatchCount > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50 shadow-sm' : 'bg-slate-50 text-slate-300 border-slate-100')}`}>
                                                <Check size={9} strokeWidth={4} />
                                                <span>{displayMatchCount}</span>
                                              </div>
                                              </Tooltip>
                                               {displaySynonymCount > 0 && (
                                                <Tooltip content={t.ttSynonymCount}><div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-black tracking-tight ${showOnlyDiff ? 'bg-slate-50 text-slate-400 border-slate-200 shadow-none opacity-60' : 'bg-amber-50 text-amber-600 border-amber-100/50 shadow-sm'}`}>
                                                  <CheckCircle2 size={9} strokeWidth={2.5} />
                                                  <span>{displaySynonymCount}</span>
                                                </div>
                                              </Tooltip>
                                            )}
                                               {displayMismatchCount > 0 && (
                                                 <Tooltip content={part === 'Description' ? t.ttMismatchedCountDesc : t.ttMismatchedCount}><div className="flex items-center gap-1 px-1.5 py-0.5 rounded border bg-rose-50 text-rose-600 border-rose-100/50 shadow-sm text-[9px] font-black tracking-tight">
                                                   <AlertCircle size={9} strokeWidth={2.5} />
                                                   <span>{displayMismatchCount}</span>
                                                 </div>
                                                 </Tooltip>
                                               )}
                                             </div>
                                           </div>
                                         </div>
                                       </th>
                                     </tr>
                                   </thead>
                                   {!collapsedParts[part] && (() => {
                                       const groupsInPart = Array.from(new Set(partResults.map(r => r.group || 'no-group')));
                                       return groupsInPart.map((group, groupIdx) => {
                                         const groupFields = partResults.filter(r => (r.group || 'no-group') === group);
                                         
                                         return (
                                           <tbody key={group} className="divide-y divide-slate-100">
                                             {group !== 'no-group' && (
                                                <tr className="bg-slate-50 group/itemheader hover:bg-slate-100 cursor-pointer transition-colors" onClick={(e) => toggleGroup(e, group as string)}>
                                                   <td colSpan={comparedDocs.length + 1} className="sticky top-[114px] z-[24] p-0 border-y border-slate-200/50 bg-slate-50 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                                                      <div className="flex items-center gap-2 sticky left-0 pl-10 pr-6 py-2 z-[26] w-fit">
                                                         <div className="w-4 h-4 rounded flex items-center justify-center text-slate-400 group-hover/itemheader:text-blue-600 transition-colors">
                                                            {collapsedGroups[group] ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                                                         </div>
                                                         <span className="font-bold text-[11px] text-slate-700 uppercase tracking-widest">{group}</span>
                                                         <div className="flex items-center gap-1.5 ml-1">
                                                            {(() => {
                                                              const groupFields = originalPartResults.filter(r => (r.group || 'no-group') === group);
                                                              const mismatchF = groupFields.filter(r => r.targets.some(t => t.status === 'MISMATCH')).length;
                                                              const synonymF = groupFields.filter(r => !r.targets.some(t => t.status === 'MISMATCH') && r.targets.some(t => t.status === 'SYNONYM')).length;
                                                              const matchF = groupFields.length - mismatchF - synonymF;
                                                              
                                                              return (
                                                                <>
                                                                  {matchF > 0 && (
                                                                    <Tooltip content={part === 'Description' ? t.ttMatchedCountDesc : t.ttMatchedCount}>
                                                                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full border border-emerald-100/50 text-[8px] font-black leading-none"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{matchF}</div>
                                                                    </Tooltip>
                                                                  )}
                                                                  {synonymF > 0 && (
                                                                    <Tooltip content={t.ttSynonymCount}>
                                                                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full border border-amber-100/50 text-[8px] font-black leading-none"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>{synonymF}</div>
                                                                    </Tooltip>
                                                                  )}
                                                                  {mismatchF > 0 && (
                                                                    <Tooltip content={part === 'Description' ? t.ttMismatchedCountDesc : t.ttMismatchedCount}>
                                                                      <div className="flex items-center gap-1 bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full border border-rose-100/50 text-[8px] font-black leading-none"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>{mismatchF}</div>
                                                                    </Tooltip>
                                                                  )}
                                                                </>
                                                              );
                                                            })()}
                                                         </div>
                                                      </div>
                                                   </td>
                                                </tr>
                                             )}
                                             {!collapsedGroups[group] && groupFields.map((res, i) => (
                                              <tr key={res.fieldName} className="hover:bg-slate-50/10 transition-colors group">
                                                 <td className="sticky left-0 z-20 bg-white border-r border-slate-100 p-4 font-black text-slate-700 group-hover:text-blue-600 shadow-[2px_0_10px_rgba(0,0,0,0.02)] transition-colors">
                                                  <div className="flex flex-col">
                                                     <span className="text-xs tracking-tight">{res.fieldName}</span>
                                                     {res.targets.some((t: any) => t.status === 'MISMATCH') && <span className="text-[10px] font-bold text-rose-500 mt-0.5 uppercase leading-none tracking-tighter">ต้องตรวจสอบ</span>}
                                                  </div>
                                               </td>

                                 {comparedDocs.map(docName => {
                                    const target = res.targets.find(t => t.fileName === docName);
                                    if (!target) {
                                      return (
                                        <td key={docName} className="p-0 border-r border-slate-100 bg-slate-50/5">
                                          <div className="px-4 py-4 text-[10px] font-black text-slate-300 text-center flex items-center justify-center gap-1.5 min-h-full">
                                             <Loader2 size={10} className="animate-spin opacity-40" />
                                             <span className="uppercase tracking-widest opacity-40">WAITING</span>
                                          </div>
                                        </td>
                                      );
                                    }
                                    return (
                                      <td key={docName} className={`p-0 border-r border-slate-100 transition-all ${
                                         target.status === 'MATCH' ? 'bg-white' :
                                         target.status === 'WAITING' ? 'bg-white' :
                                         target.status === 'MISMATCH' ? 'bg-rose-50/30' :
                                         target.status === 'SYNONYM' ? 'bg-amber-50/30' :
                                         'bg-slate-50/10 opacity-50'
                                      }`}>
                                         <div className={`px-4 py-4 text-[11px] font-black text-center min-h-full flex flex-col items-center justify-center gap-1.5 group/cell relative overflow-visible ${
                                            target.status === 'MATCH' ? 'text-slate-600' :
                                            target.status === 'WAITING' ? 'text-slate-500' :
                                            target.status === 'MISMATCH' ? 'text-rose-600' :
                                            target.status === 'SYNONYM' ? 'text-slate-600' :
                                            'text-slate-300'
                                         }`}>
                                            <div className="flex items-center gap-2">
                                               <span className="break-all">{target.value}</span>
                                               {target.status === 'MATCH' && (
                                                  <Tooltip content="ตรงกัน">
                                                    <Check size={12} className="text-emerald-500 shrink-0 cursor-help" strokeWidth={4} />
                                                  </Tooltip>
                                                )}
                                               {target.status === 'MISMATCH' && (
                                                  <Tooltip content={language === 'TH' ? 'AI แนะนำ: คาดว่าควรจะเป็นค่าจาก Master' : 'AI Suggestion: Value should match Master'}>
                                                    <div className="flex flex-col items-center gap-1 group/suggestion cursor-help">
                                                       <AlertCircle size={14} className="text-rose-500 shrink-0" />
                                                       <div className="px-1.5 py-0.5 rounded-2xl bg-orange-50 text-orange-600 text-[8px] font-black border border-orange-200 animate-bounce-subtle">
                                                          {language === 'TH' ? 'AI แนะนำ' : 'AI SUGGEST'}
                                                       </div>
                                                    </div>
                                                  </Tooltip>
                                                )}
                                               {target.status === 'SYNONYM' && (
                                                  <Tooltip content="ข้อมูลตามเงื่อนไข">
                                                    <CheckCircle2 size={14} className="text-amber-500 shrink-0 cursor-help" />
                                                  </Tooltip>
                                                )}
                                            </div>

                                            {target.status === 'MISMATCH' && (
                                              <div className="mt-0.5 text-[8px] font-black text-rose-400 uppercase tracking-tighter shrink-0">
                                                {language === 'TH' ? 'ค่ามาตรฐาน:' : t.master + ':'} {res.sourceValue}
                                              </div>
                                            )}
                                            
                                            {target.status === 'SYNONYM' && target.ruleTitle && (
                                              <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold rounded-2xl pointer-events-none opacity-0 group-hover/cell:opacity-100 transition-all z-50 whitespace-nowrap shadow-2xl border border-slate-700 pointer-events-none -translate-y-8 group-hover/cell:-translate-y-12">
                                                <div className="flex items-center gap-2">
                                                  <ArrowUpRight size={12} className="text-amber-400" />
                                                  {target.ruleTitle}
                                                </div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                              </div>
                                            )}
                                         </div>
                                      </td>
                                    );
                                 })}
                              </tr>
                                             ))}
                                           </tbody>
                                         );
                                      });
                                   })()}
                                </table>
                              );
                           })}
                  </div>

                  {/* Matrix Footer / Summary Bar */}
                  <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2 group">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">ตรงกัน</span>
                         </div>
                         <div className="flex items-center gap-2 group">
                            <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">ข้อมูลตามเงื่อนไข</span>
                         </div>
                         <div className="flex items-center gap-2 group">
                            <div className="w-2 h-2 rounded-full bg-rose-500 group-hover:scale-125 transition-transform"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">ไม่ตรงกัน</span>
                         </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end leading-none">
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-70 italic shadow-sm">Audit Summary</span>
                           <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">ฟิลด์ทั้งหมดที่ตรวจสอบ:</span>
                             <span className="text-xs font-mono font-black text-slate-800">{selectedJob.totalFieldsCount || comparisonResults.length}</span>
                           </div>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

                        {(() => {
                           const accuracyValue = selectedJob.accuracyScore !== undefined 
                             ? selectedJob.accuracyScore 
                             : Number(((comparisonResults.filter(r => r.targets.every(t => t.status === 'MATCH' || t.status === 'SYNONYM' || t.status === 'NA')).length / comparisonResults.length) * 100).toFixed(1));
                           
                           return (
                             <div className="flex items-center gap-3 bg-white pl-1 pr-3 py-1 rounded-full border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 group cursor-default">
                                <div className="relative w-8 h-8 flex items-center justify-center">
                                   <svg className="w-full h-full -rotate-90 transform scale-95" viewBox="0 0 36 36">
                                      <circle cx="18" cy="18" r="15" fill="none" className="stroke-slate-100" strokeWidth="4" />
                                      <motion.circle 
                                        cx="18" cy="18" r="15" 
                                        fill="none" 
                                        className={accuracyValue > 80 ? "stroke-emerald-500" : accuracyValue > 50 ? "stroke-amber-500" : "stroke-rose-500"}
                                        strokeWidth="4" 
                                        strokeDasharray="94.2"
                                        initial={{ strokeDashoffset: 94.2 }}
                                        animate={{ strokeDashoffset: 94.2 - (94.2 * accuracyValue / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                      />
                                   </svg>
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <div className={`w-1 h-1 rounded-full ${accuracyValue > 80 ? 'bg-emerald-500' : accuracyValue > 50 ? 'bg-amber-400' : 'bg-rose-500'} animate-pulse`}></div>
                                   </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                   <span className="text-[7px] font-black text-slate-400 leading-none uppercase tracking-widest mb-0.5 opacity-60">Accuracy Score</span>
                                   <div className="flex items-baseline gap-1.5 leading-none">
                                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">ระดับความถูกต้อง</span>
                                      <span className={`text-[16px] font-mono font-black tabular-nums transition-colors duration-500 ${accuracyValue > 80 ? 'text-emerald-600' : accuracyValue > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                                        {accuracyValue.toFixed(1)}<span className="text-[10px] ml-0.5 opacity-40">%</span>
                                      </span>
                                   </div>
                                </div>
                             </div>
                           );
                         })()}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };
