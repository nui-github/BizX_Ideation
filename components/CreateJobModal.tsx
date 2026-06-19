import React, { useState } from 'react';
import { Modal, Select, message } from 'antd';
import { ComparisonJob, JobStatus, Workflow, ComparisonDocStatus } from '../types';

interface CreateJobModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (job: ComparisonJob) => void;
  workflows: Workflow[];
  language?: string;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ visible, onClose, onCreate, workflows, language }) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>('unassigned');
  const [suffixValue, setSuffixValue] = useState<string>('');

  const isTh = language === 'TH';
  const modalTitle = isTh ? 'สร้างรายการใหม่' : 'Create New Job';
  const labelWorkflow = isTh ? 'เลือก Workflow' : 'Select Workflow';
  const placeholderWorkflow = isTh ? 'เลือก Workflow' : 'Select Workflow';
  const labelAssignee = isTh ? 'Assignee (เลือกได้)' : 'Assignee (Optional)';
  const placeholderAssignee = isTh ? 'เลือก Assignee หรือทิ้งไว้' : 'Select Assignee or leave unassigned';
  const okTextValue = isTh ? 'สร้าง Job' : 'Create Job';
  const cancelTextValue = isTh ? 'ยกเลิก' : 'Cancel';

  const getPrefix = (format: string) => {
    if (!format) return 'JOB-';
    const bracketIdx = format.indexOf('{');
    if (bracketIdx !== -1) {
      return format.substring(0, bracketIdx);
    }
    return format;
  };

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId);
  const createJobNode = selectedWorkflow?.nodes.find(node => node.type === 'create_job');
  const hasJobCreationNode = !!createJobNode;
  const namingFormat = createJobNode?.data?.namingFormat || '';
  const extractedPrefix = namingFormat ? getPrefix(namingFormat) : 'JOB-';

  const handleWorkflowChange = (val: string) => {
    setSelectedWorkflowId(val);
    const wf = workflows.find(w => w.id === val);
    const node = wf?.nodes.find(n => n.type === 'create_job');
    if (node) {
      // pre-fill a 4-digit random number to offer an immediate valid input
      setSuffixValue(String(Math.floor(1000 + Math.random() * 9000)));
    } else {
      setSuffixValue('');
    }
  };

  const handleCreate = () => {
    if (!selectedWorkflowId) {
      message.error(isTh ? 'กรุณาเลือก Workflow' : 'Please select a workflow');
      return;
    }

    const workflow = workflows.find(w => w.id === selectedWorkflowId);
    if (!workflow) return;

    // "ดึงข้อมูลจาก node: Job creation มาสร้าง ขื่อ job, จำนวน doctype, doctype อะไรบ้าง"
    const createJobNode = workflow.nodes.find(node => node.type === 'create_job');
    
    // "ถ้าใน workflow นั้น ไม่มีการกำหนด node. ที่มีมี doctype อยู่ ให้ขึ้น error ไม่สามารถสร้างได้เพราะอะไร"
    if (!createJobNode || !createJobNode.data || !createJobNode.data.docTypes || createJobNode.data.docTypes.length === 0) {
      message.error(isTh 
        ? `ไม่สามารถสร้าง Job ได้: Workflow "${workflow.name}" ไม่มี Node "Job creation" ที่มีการกำหนด DocType`
        : `Cannot create job: Workflow "${workflow.name}" has no "Job creation" node with DocTypes specified.`
      );
      return;
    }

    if (hasJobCreationNode && !suffixValue.trim()) {
      message.error(isTh ? 'กรุณาระบุรหัสต่อท้ายรูปแบบของ job' : 'Please specify a suffix for the job format');
      return;
    }

    const docTypes: string[] = createJobNode.data.docTypes;
    const jobName: string = createJobNode.data.jobName || workflow.name;

    const assigneeValue = selectedAssignee === 'unassigned' ? undefined : selectedAssignee;

    const referenceValue = hasJobCreationNode 
      ? `${extractedPrefix}${suffixValue.trim()}`
      : `JOB-${Math.floor(Math.random() * 10000)}`;

    // Create new job
    const newJob: ComparisonJob = {
      id: `job-${Date.now()}`,
      reference: referenceValue,
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: JobStatus.NEW,
      docs: docTypes.reduce((acc, type) => {
        acc[type] = ComparisonDocStatus.MISSING;
        return acc;
      }, {} as Record<string, any>),
      assignee: assigneeValue || undefined,
      workflowName: jobName,
      progress: 0,
      totalDocs: docTypes.length,
      foundDocs: 0
    };

    onCreate(newJob);
    onClose();
    setSelectedWorkflowId(null);
    setSelectedAssignee('unassigned');
    setSuffixValue('');
    message.success(isTh ? 'สร้าง Job สำเร็จ' : 'Job created successfully');
  };

  return (
    <Modal
      title={<div className="font-sans text-lg font-bold">{modalTitle}</div>}
      open={visible}
      onCancel={onClose}
      onOk={handleCreate}
      okText={okTextValue}
      cancelText={cancelTextValue}
      className="font-sans"
      okButtonProps={{ className: 'bg-[#0463EF] font-sans hover:bg-blue-600' }}
      cancelButtonProps={{ className: 'font-sans' }}
    >
      <div className="space-y-4 py-4 font-sans">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{labelWorkflow}</label>
          <Select 
            className="w-full font-sans"
            placeholder={placeholderWorkflow}
            value={selectedWorkflowId}
            onChange={handleWorkflowChange}
            options={workflows.map(w => ({ label: w.name, value: w.id }))}
          />
        </div>

        {hasJobCreationNode && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {isTh ? 'รูปแบบของ job' : 'Job Format'} <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0463EF]/20 focus-within:border-[#0463EF] transition-all">
              <span className="inline-flex items-center px-3 bg-slate-50 border-r border-[#e2e8f0] text-slate-500 text-sm font-mono font-bold select-none">
                {extractedPrefix}
              </span>
              <input
                type="text"
                value={suffixValue}
                onChange={(e) => setSuffixValue(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 text-sm font-semibold font-mono text-slate-800 bg-white placeholder-slate-400 focus:outline-none"
                placeholder={isTh ? 'ระบุรหัสของ job...' : 'Enter suffix...'}
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">
              {isTh ? 'เลขที่จะถูกบันทึกเป็น: ' : 'Saved as: '}
              <span className="font-mono text-[#010136] font-extrabold">{extractedPrefix}{suffixValue || '...'}</span>
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{labelAssignee}</label>
          <Select 
            className="w-full font-sans"
            placeholder={placeholderAssignee}
            value={selectedAssignee}
            allowClear
            onChange={setSelectedAssignee}
            options={[
              { label: isTh ? 'ไม่ได้มอบหมาย' : 'Unassigned', value: 'unassigned' },
              { label: 'Kunawut W.', value: 'Kunawut W.' },
              { label: 'System', value: 'System' }
            ]}
          />
        </div>
      </div>
    </Modal>
  );
};
