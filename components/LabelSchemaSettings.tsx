import React, { useState } from 'react';
import { Modal, Select, Input, Empty, Button, Tooltip, Tag, Popconfirm, Checkbox, Switch, message, Drawer } from 'antd';
import { 
  FileText, Plus, Trash2, Edit3, AlertCircle, ArrowLeft, 
  Settings, Check, Search, Calendar, ChevronRight, Workflow as WorkflowIcon,
  Layers, Database, Clock, Info, HelpCircle, LayoutGrid, List, AlertTriangle, X,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, DocType, Workflow } from '../types';

export interface SchemaLabel {
  id: string;
  name: string;
  required: boolean; // default: true (Required)
  compare: boolean; // default: false (Compare node)
  type?: string; // e.g. string, number, boolean, date, array
  subLabels?: SchemaLabel[];
  section?: 'Header' | 'Description' | 'Footer';
}

export interface DocTypeSchemaConfig {
  docTypeId: string;
  labels: SchemaLabel[];
}

export interface LabelSchema {
  id: string;
  name: string;
  description: string;
  templateType?: string;
  aiPrompt?: string;
  docTypes: string[]; // docType IDs
  workflowIds: string[]; // workflow IDs
  updatedAt: string;
  configs: DocTypeSchemaConfig[];
}

interface LabelSchemaSettingsProps {
  language: Language;
  docTypes: DocType[];
  workflows: Workflow[];
  comparisonWorkflows: Workflow[];
  onBack?: () => void;
  setComparisonWorkflows?: React.Dispatch<React.SetStateAction<Workflow[]>>;
  hideHeader?: boolean;
}

export const DEFAULT_SCHEMAS: LabelSchema[] = [
  {
    id: 'ls-1',
    name: 'Import standard v2',
    description: 'Schema สำหรับเอกสารนำเข้าทั่วไป ตรวจสอบ Invoice, Packing List และ Bill of Lading ร่วมกันเพื่อเปรียบเทียบข้อมูลหลัก',
    templateType: 'import-standard',
    docTypes: ['INV', 'BL', 'PL'],
    workflowIds: ['cwf-1', 'wf-1'],
    updatedAt: '2026-05-26T17:30:00Z',
    configs: [
      {
        docTypeId: 'INV',
        labels: [
          { id: 'l-1', name: 'Invoice#', required: true, compare: true, section: 'Header', type: 'string' },
          { id: 'l-1-date', name: 'Invoice Date', required: true, compare: true, section: 'Header', type: 'date' },
          { id: 'l-1-cust', name: 'Customer Name', required: true, compare: false, section: 'Header', type: 'string' },
          { 
            id: 'l-3', 
            name: 'Line Items', 
            required: true, 
            compare: false, 
            section: 'Description', 
            type: 'array',
            subLabels: [
              { id: 'l-3-sub-1', name: 'Item Code', required: true, type: 'string', compare: false },
              { id: 'l-3-sub-2', name: 'Product Name', required: true, type: 'string', compare: false },
              { id: 'l-3-sub-3', name: 'Quantity', required: true, type: 'number', compare: false },
              { id: 'l-3-sub-4', name: 'Unit Price', required: true, type: 'number', compare: false }
            ]
          },
          { id: 'l-2', name: 'Total Value', required: true, compare: true, section: 'Footer', type: 'number' },
          { id: 'l-2-tax', name: 'VAT (7%)', required: false, compare: false, section: 'Footer', type: 'number' }
        ]
      },
      {
        docTypeId: 'BL',
        labels: [
          { id: 'l-4', name: 'B/L No', required: true, compare: true, section: 'Header', type: 'string' },
          { id: 'l-5', name: 'Shipper', required: true, compare: false, section: 'Header', type: 'string' },
          { id: 'l-6', name: 'Consignee', required: false, compare: false, section: 'Header', type: 'string' },
          { 
            id: 'l-bl-desc-items', 
            name: 'Containers', 
            required: true, 
            compare: false, 
            section: 'Description', 
            type: 'array',
            subLabels: [
              { id: 'l-bl-sub-1', name: 'Container No', required: true, type: 'string', compare: false },
              { id: 'l-bl-sub-2', name: 'Seal No', required: true, type: 'string', compare: false },
              { id: 'l-bl-sub-3', name: 'Weight (KGS)', required: true, type: 'number', compare: false }
            ]
          },
          { id: 'l-bl-footer-weight', name: 'Total Gross Weight', required: true, compare: true, section: 'Footer', type: 'number' }
        ]
      },
      {
        docTypeId: 'PL',
        labels: [
          { id: 'l-7', name: 'Packing#', required: true, compare: true, section: 'Header', type: 'string' },
          { id: 'l-pl-header-date', name: 'Packing List Date', required: true, compare: false, section: 'Header', type: 'date' },
          { 
            id: 'l-pl-desc-items', 
            name: 'Packed Goods List', 
            required: true, 
            compare: false, 
            section: 'Description', 
            type: 'array',
            subLabels: [
              { id: 'l-pl-sub-1', name: 'Package No', required: true, type: 'string', compare: false },
              { id: 'l-pl-sub-2', name: 'Description of Goods', required: true, type: 'string', compare: false },
              { id: 'l-pl-sub-3', name: 'Quantity Limit', required: true, type: 'number', compare: false }
            ]
          },
          { id: 'l-8', name: 'Weight', required: false, compare: false, section: 'Footer', type: 'number' },
          { id: 'l-pl-footer-packages', name: 'Total Packages', required: true, compare: true, section: 'Footer', type: 'number' }
        ]
      }
    ]
  },
  {
    id: 'ls-2',
    name: 'FTA HS Code Compliance',
    description: 'ตรวจสอบความถูกต้องของพิกัดอัตราศุลกากร (HS Code) และหนังสือรับรองถิ่นกำเนิดสินค้าเพื่อสิทธิประโยชน์ทางภาษี',
    templateType: 'fta-compliance',
    docTypes: ['PO', 'CO'],
    workflowIds: ['cwf-2'],
    updatedAt: '2026-05-27T08:15:00Z',
    configs: [
      {
        docTypeId: 'PO',
        labels: [
          { id: 'l-9', name: 'PO No', required: true, compare: true, section: 'Header', type: 'string' },
          { id: 'l-po-header-date', name: 'PO Date', required: true, compare: false, section: 'Header', type: 'date' },
          { 
            id: 'l-10', 
            name: 'HS Code Group', 
            required: true, 
            compare: true, 
            section: 'Description', 
            type: 'array',
            subLabels: [
              { id: 'l-po-sub-1', name: 'Harmonized Code', required: true, type: 'string', compare: false },
              { id: 'l-po-sub-2', name: 'Category Label', required: false, type: 'string', compare: false }
            ]
          }
        ]
      },
      {
        docTypeId: 'CO',
        labels: [
          { id: 'l-11', name: 'Certificate No', required: true, compare: true, section: 'Header', type: 'string' },
          { id: 'l-12', name: 'Origin Country', required: true, compare: true, section: 'Header', type: 'string' }
        ]
      }
    ]
  },
  {
    id: 'ls-3',
    name: 'Custom Import Schema (Premium)',
    description: 'Schema สำหรับเอกสารพรีเมียมและการตรวจสอบระดับละเอียดเพิ่มความรอบคอบ',
    templateType: 'import-premium',
    docTypes: ['INV', 'BL', 'PL'],
    workflowIds: [],
    updatedAt: '2026-05-28T10:00:00Z',
    configs: [
      {
        docTypeId: 'INV',
        labels: [
          { id: 'l-13', name: 'Premium Inv#', required: true, compare: true, section: 'Header', type: 'string' },
          { id: 'l-14', name: 'Discount Checked', required: false, compare: false, section: 'Description', type: 'boolean' },
          { id: 'l-15', name: 'VAT Total', required: true, compare: true, section: 'Footer', type: 'number' }
        ]
      },
      {
        docTypeId: 'BL',
        labels: [
          { id: 'l-16', name: 'Vessel Voyage', required: true, compare: true, section: 'Footer', type: 'string' },
          { id: 'l-17', name: 'BL Special No', required: true, compare: true, section: 'Header', type: 'string' }
        ]
      },
      {
        docTypeId: 'PL',
        labels: [
          { id: 'l-18', name: 'PL Package Count', required: true, compare: true, section: 'Description', type: 'number' },
          { id: 'l-19', name: 'Gross Weight CBM', required: false, compare: false, section: 'Footer', type: 'number' }
        ]
      }
    ]
  }
];

export const LabelSchemaSettings: React.FC<LabelSchemaSettingsProps> = ({
  language,
  docTypes,
  workflows = [],
  comparisonWorkflows = [],
  onBack,
  setComparisonWorkflows,
  hideHeader = false
}) => {
  const [schemas, setSchemas] = useState<LabelSchema[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('bizx_label_schemas_v3') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved schemas', e);
      }
    }
    return DEFAULT_SCHEMAS;
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bizx_label_schemas_v3', JSON.stringify(schemas));
    }
  }, [schemas]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSchema, setEditingSchema] = useState<LabelSchema | null>(null);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTemplateType, setFormTemplateType] = useState('');
  const [formAiPrompt, setFormAiPrompt] = useState('');
  const [formDocTypes, setFormDocTypes] = useState<string[]>([]);
  const [formWorkflows, setFormWorkflows] = useState<string[]>([]);
  const [formConfigs, setFormConfigs] = useState<DocTypeSchemaConfig[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Warning state for docType without labels
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingSavePayload, setPendingSavePayload] = useState<LabelSchema | null>(null);

  // Delete schema state
  const [schemaToDelete, setSchemaToDelete] = useState<LabelSchema | null>(null);

  // Selector state for adding docTypes one by one
  const [selectedDocTypeToAdd, setSelectedDocTypeToAdd] = useState<string | undefined>(undefined);

  // Collapsible accordion state for DocTypes
  const [expandedDocTypes, setExpandedDocTypes] = useState<Record<string, boolean>>({});

  const isTh = language === 'TH';

  // Get active workflows count and names
  const getAllWorkflows = () => {
    return [
      ...workflows.map(w => ({ id: w.id, name: w.name, type: 'Standard' })),
      ...comparisonWorkflows.map(cw => ({ id: cw.id, name: cw.name, type: 'Comparison' }))
    ];
  };

  const getWorkflowNames = (ids: string[]) => {
    const allWfs = getAllWorkflows();
    return ids
      .map(id => allWfs.find(w => w.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  const getDocTypeNames = (ids: string[]) => {
    return ids
      .map(id => docTypes.find(d => d.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  const handleOpenCreate = () => {
    setEditingSchema(null);
    setFormName('');
    setFormDesc('');
    setFormTemplateType('');
    setFormAiPrompt('');
    setFormDocTypes([]);
    setFormWorkflows([]);
    setFormConfigs([]);
    setSelectedDocTypeToAdd(undefined);
    setExpandedDocTypes({});
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (schema: LabelSchema) => {
    setEditingSchema(schema);
    setFormName(schema.name);
    setFormDesc(schema.description);
    setFormTemplateType(schema.templateType || '');
    setFormAiPrompt(schema.aiPrompt || '');
    setFormDocTypes(schema.docTypes);
    setFormWorkflows(schema.workflowIds);
    setFormConfigs(schema.configs ? JSON.parse(JSON.stringify(schema.configs)) : schema.docTypes.map(id => ({ docTypeId: id, labels: [] })));
    setSelectedDocTypeToAdd(undefined);
    setExpandedDocTypes({});
    setErrorMsg('');
    setShowModal(true);
  };

  const handleDeleteSchema = (id: string) => {
    const schemaToDelete = schemas.find(s => s.id === id);
    if (schemaToDelete && schemaToDelete.workflowIds.length > 0 && setComparisonWorkflows) {
      setComparisonWorkflows(prevWorkflows => 
        prevWorkflows.map(wf => {
          if (schemaToDelete.workflowIds.includes(wf.id)) {
            return {
              ...wf,
              nodes: wf.nodes.map(node => {
                if (node.type === 'extract') {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      isConfigured: false
                    }
                  };
                }
                return node;
              })
            };
          }
          return wf;
        })
      );
    }
    
    setSchemas(prev => prev.filter(s => s.id !== id));
  };

  // Add a docType configuration block
  const handleAddDocTypeConfig = (docTypeId: string) => {
    if (!docTypeId) return;
    if (!formDocTypes.includes(docTypeId)) {
      setFormDocTypes([...formDocTypes, docTypeId]);
      setFormConfigs([...formConfigs, { docTypeId, labels: [] }]);
      setExpandedDocTypes(prev => ({ ...prev, [docTypeId]: true }));
    }
  };

  const handleAddNewDocTypeClick = () => {
    if (selectedDocTypeToAdd) {
      handleAddDocTypeConfig(selectedDocTypeToAdd);
      setSelectedDocTypeToAdd(undefined);
    }
  };

  // Remove a docType configuration block
  const handleRemoveDocTypeConfig = (docTypeId: string) => {
    setFormDocTypes(formDocTypes.filter(id => id !== docTypeId));
    setFormConfigs(formConfigs.filter(cfg => cfg.docTypeId !== docTypeId));
  };

  // Add Label to a specific docType configuration table
  const handleAddLabelRow = (docTypeId: string, section?: 'Header' | 'Description' | 'Footer') => {
    setFormConfigs(prevConfigs => 
      prevConfigs.map(cfg => {
        if (cfg.docTypeId === docTypeId) {
          return {
            ...cfg,
            labels: [
              ...cfg.labels,
              {
                id: `l-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                name: '',
                required: true,
                type: 'string',
                section: section || 'Header',
                compare: false
              }
            ]
          };
        }
        return cfg;
      })
    );
  };

  // Update specific field inside a label row
  const handleUpdateLabelRow = (docTypeId: string, labelId: string, updates: Partial<SchemaLabel>) => {
    setFormConfigs(prevConfigs => 
      prevConfigs.map(cfg => {
        if (cfg.docTypeId === docTypeId) {
          return {
            ...cfg,
            labels: cfg.labels.map(lbl => {
              if (lbl.id === labelId) {
                return { ...lbl, ...updates };
              }
              return lbl;
            })
          };
        }
        return cfg;
      })
    );
  };

  // Remove a label row
  const handleRemoveLabelRow = (docTypeId: string, labelId: string) => {
    setFormConfigs(prevConfigs => 
      prevConfigs.map(cfg => {
        if (cfg.docTypeId === docTypeId) {
          return {
            ...cfg,
            labels: cfg.labels.filter(lbl => lbl.id !== labelId)
          };
        }
        return cfg;
      })
    );
  };

  // Add sub-label to an array field row in a specific docType configuration table
  const handleAddSubLabelRow = (docTypeId: string, parentLabelId: string) => {
    setFormConfigs(prevConfigs => 
      prevConfigs.map(cfg => {
        if (cfg.docTypeId === docTypeId) {
          return {
            ...cfg,
            labels: cfg.labels.map(lbl => {
              if (lbl.id === parentLabelId) {
                const subLabels = lbl.subLabels || [];
                return {
                  ...lbl,
                  subLabels: [
                    ...subLabels,
                    {
                      id: `l-sub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                      name: '',
                      required: true,
                      type: 'string',
                      compare: false
                    }
                  ]
                };
              }
              return lbl;
            })
          };
        }
        return cfg;
      })
    );
  };

  // Update specific sub-field inside a parent's label row
  const handleUpdateSubLabelRow = (docTypeId: string, parentLabelId: string, subLabelId: string, updates: Partial<SchemaLabel>) => {
    setFormConfigs(prevConfigs => 
      prevConfigs.map(cfg => {
        if (cfg.docTypeId === docTypeId) {
          return {
            ...cfg,
            labels: cfg.labels.map(lbl => {
              if (lbl.id === parentLabelId) {
                const subLabels = lbl.subLabels || [];
                return {
                  ...lbl,
                  subLabels: subLabels.map(subLbl => {
                    if (subLbl.id === subLabelId) {
                      return { ...subLbl, ...updates };
                    }
                    return subLbl;
                  })
                };
              }
              return lbl;
            })
          };
        }
        return cfg;
      })
    );
  };

  // Remove a sub-field row inside a parent label row
  const handleRemoveSubLabelRow = (docTypeId: string, parentLabelId: string, subLabelId: string) => {
    setFormConfigs(prevConfigs => 
      prevConfigs.map(cfg => {
        if (cfg.docTypeId === docTypeId) {
          return {
            ...cfg,
            labels: cfg.labels.map(lbl => {
              if (lbl.id === parentLabelId) {
                const subLabels = lbl.subLabels || [];
                return {
                  ...lbl,
                  subLabels: subLabels.filter(subLbl => subLbl.id !== subLabelId)
                };
              }
              return lbl;
            })
          };
        }
        return cfg;
      })
    );
  };

  const handleSave = () => {
    // 1. Schema name validation
    if (!formName.trim()) {
      setErrorMsg(isTh ? 'กรุณากรอกชื่อ Schema' : 'Please fill in Schema Name');
      return;
    }

    // Duplicate name validation
    const nameExists = schemas.some(s => 
      s.name.trim().toLowerCase() === formName.trim().toLowerCase() && 
      (!editingSchema || s.id !== editingSchema.id)
    );
    if (nameExists) {
      setErrorMsg(isTh ? 'ชื่อ Schema นี้มีอยู่แล้วในระบบ กรุณาใช้ชื่ออื่น' : 'Schema name already exists. Please choose another name.');
      return;
    }

    // 2. Doc Type validation (Required at least 1)
    if (formDocTypes.length === 0) {
      setErrorMsg(isTh ? 'กรุณาเลือกประเภทเอกสารอย่างน้อย 1 ประเภท' : 'Please select at least 1 document type');
      return;
    }

    // 3. Labels validation inside active doc types (Label name is required if rows exist)
    let hasEmptyLabelName = false;
    formConfigs.forEach(cfg => {
      cfg.labels.forEach(lbl => {
        if (!lbl.name.trim()) {
          hasEmptyLabelName = true;
        }
      });
    });

    if (hasEmptyLabelName) {
      setErrorMsg(isTh ? 'กรุณากรอกชื่อ Label ในทุกแถวที่ระบุ' : 'Please fill in the Label name for all entries.');
      return;
    }

    const timestamp = new Date().toISOString();
    const payload: LabelSchema = {
      id: editingSchema ? editingSchema.id : `ls-${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim(),
      templateType: formTemplateType.trim(),
      aiPrompt: formAiPrompt.trim(),
      docTypes: formDocTypes,
      workflowIds: formWorkflows,
      updatedAt: timestamp,
      configs: formConfigs
    };

    // 4. Warning validation: Doc type with zero labels
    const emptyDocTypesList = formConfigs
      .filter(cfg => cfg.labels.length === 0)
      .map(cfg => cfg.docTypeId);

    if (emptyDocTypesList.length > 0) {
      // Show warning modal and store payload
      setPendingSavePayload(payload);
      setShowWarningModal(true);
      return;
    }

    // Save normally if no warning triggered
    submitSave(payload);
  };

  const submitSave = (payload: LabelSchema) => {
    const updatedSchemas = [...schemas];
    if (editingSchema) {
      const index = updatedSchemas.findIndex(s => s.id === editingSchema.id);
      if (index !== -1) {
        updatedSchemas[index] = payload;
      }
    } else {
      updatedSchemas.unshift(payload);
    }
    setSchemas(updatedSchemas);
    message.success(isTh ? 'บันทึกข้อมูลเรียบร้อยแล้ว' : 'Saved successfully');
    setShowModal(false);
    setShowWarningModal(false);
    setPendingSavePayload(null);
  };

  const filteredSchemas = schemas.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${mins}`;
  };

  return (
    <div className={hideHeader ? "space-y-6" : "bg-white border border-slate-200/80 rounded-[16px] p-6 shadow-sm space-y-6"} id="label-schema-settings-wrapper">
      {/* Header breadcrumb */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-[4px] text-slate-600 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <span>{isTh ? 'การตั้งค่าระบบ' : 'SYSTEM SETTINGS'}</span>
                <ChevronRight size={12} className="text-slate-300" />
                <span className="text-[#0463EF]">{isTh ? 'สคีมาป้ายระบุ' : 'LABEL SCHEMA'}</span>
              </div>
              <h1 className="text-2xl font-black text-[#010136] tracking-tight">
                {isTh ? 'ตั้งค่า Label schema' : 'Label Schema Settings'}
              </h1>
            </div>
          </div>

          {schemas.length > 0 && (
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-[#0463EF] hover:bg-[#0352cc] text-white font-black text-sm uppercase tracking-wider rounded-[4px] shadow-md shadow-blue-500/15 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>{isTh ? 'สร้างสคีมาใหม่' : 'Create Schema'}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Box */}
      {schemas.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={hideHeader ? "p-12 text-center flex flex-col items-center justify-center min-h-[400px]" : "bg-white border border-slate-200/80 rounded-[16px] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]"}
        >
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <Layers size={36} />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">
            {isTh ? 'ยังไม่มี Label schema ในระบบ' : 'No Label Schemas Found'}
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {isTh 
              ? 'ระบบยังไม่มีการตั้งค่า Schema ข้อมูลป้ายระบุ (Label) สำหรับการประมวลผลและการจับคู่เอกสาร เริ่มสร้าง Schema แรกของคุณเพื่อใช้งานร่วมกับเวิร์กโฟลว์'
              : 'There are currently no Label Schemas. Create your first schema to map fields across different document types in your workflows.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-6 py-3 bg-[#0463EF] hover:bg-[#0352cc] text-white font-black text-sm uppercase tracking-wider rounded-[4px] shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>{isTh ? 'สร้าง Label schema' : 'Create Label Schema'}</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Search / Filter Utility Bar */}
          <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/35 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder={isTh ? 'ค้นหาสคีมาด้วยชื่อ หรือคำอธิบาย...' : 'Search schema by name, description...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0463EF]/20 focus:border-[#0463EF] text-sm font-semibold h-[42px] transition-all"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-3xs">
                <Info size={14} className="text-[#0463EF]" />
                <span>
                  {isTh 
                    ? `ค้นพบทั้งหมด ${filteredSchemas.length} รายการ`
                    : `Total ${filteredSchemas.length} schemas found`}
                </span>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('GRID')}
                  className={`p-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                    viewMode === 'GRID'
                      ? 'bg-[#0463EF] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  title={isTh ? 'แสดงแบบตารางการ์ด' : 'Grid View'}
                >
                  <LayoutGrid size={13} />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('LIST')}
                  className={`p-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                    viewMode === 'LIST'
                      ? 'bg-[#0463EF] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  title={isTh ? 'แสดงแบบรายการเรียง' : 'List View'}
                >
                  <List size={13} />
                  <span>List</span>
                </button>
              </div>

              {hideHeader && (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="px-4 py-2 bg-[#0463EF] hover:bg-[#0352cc] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/15 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ml-1"
                >
                  <Plus size={14} />
                  <span>{isTh ? 'สร้างสคีมาใหม่' : 'Create Schema'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Schemas display */}
          {viewMode === 'LIST' ? (
            <div className="overflow-x-auto border border-slate-150/50 rounded-[16px] bg-white shadow-xs">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/75">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                      {isTh ? 'ชื่อสคีมา / รายละเอียด' : 'Schema Name / Description'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                      {isTh ? 'ประเภทเอกสารเเละจำนวน Label' : 'Document Types & Labels'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                      {isTh ? 'จำนวนเวิร์กโฟลว์' : 'Workflows'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                      {isTh ? 'เวลาแก้ไขล่าสุด' : 'Updated At'}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider pr-8">
                      {isTh ? 'จัดการ' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <AnimatePresence mode="popLayout">
                    {filteredSchemas.map((schema, idx) => {
                      const schemaDocTypes = getDocTypeNames(schema.docTypes);
                      const schemaWorkflows = getWorkflowNames(schema.workflowIds);

                      return (
                        <motion.tr
                          key={schema.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15, delay: idx * 0.02 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          {/* Name & Desc */}
                          <td className="px-6 py-4 max-w-sm">
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-blue-50/70 text-[#0463EF] rounded-[4px] shrink-0 mt-0.5">
                                <Layers size={15} />
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-sm font-black text-[#010136]">
                                  {schema.name}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                  {schema.description || (isTh ? '(ไม่มีคำอธิบาย)' : '(No description)')}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Doc types with detailed labels */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <span className="font-bold text-xs text-[#010136] block">
                                {isTh ? `${schema.docTypes.length} ประเภทเอกสาร` : `${schema.docTypes.length} Doc Types`}
                              </span>
                              {schema.docTypes.length > 0 ? (
                                <div className="flex flex-col gap-1.5 max-w-md">
                                  {schema.docTypes.map((dtId, dtIdx) => {
                                    const dtName = docTypes.find(d => d.id === dtId)?.name || dtId;
                                    const configForDt = schema.configs?.find(c => c.docTypeId === dtId);
                                    const labelNames = configForDt?.labels.map(l => l.name) || [];

                                    return (
                                      <div key={dtIdx} className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-150/45 flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-black text-[#010136]">{dtName}</span>
                                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                            {isTh ? `${labelNames.length} คีย์` : `${labelNames.length} Keys`}
                                          </span>
                                        </div>
                                        {labelNames.length > 0 ? (
                                          <div className="flex flex-wrap gap-1">
                                            {labelNames.map((name, nIdx) => (
                                              <span 
                                                key={nIdx} 
                                                className="px-1.5 py-0.5 text-[9px] font-medium bg-white text-slate-600 border border-slate-205 rounded-sm shadow-3xs"
                                              >
                                                {name}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 italic font-medium">No labels custom configured</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">-</span>
                              )}
                            </div>
                          </td>

                          {/* Connected Workflows */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <span className="font-bold text-xs text-[#010136] block">
                                {isTh ? `${schema.workflowIds.length} เวิร์กโฟลว์` : `${schema.workflowIds.length} Workflows`}
                              </span>
                              {schemaWorkflows.length > 0 ? (
                                Math.min(schemaWorkflows.length, 1) > 0 && (
                                  <div className="flex flex-col gap-0.5 max-w-xs">
                                    {schemaWorkflows.map((wfName, idx) => (
                                      <div key={idx} className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0"></span>
                                        <span className="truncate text-slate-600" title={wfName}>{wfName}</span>
                                      </div>
                                    ))}
                                  </div>
                                )
                              ) : (
                                <div className="text-[11px] text-slate-400 italic flex items-center gap-1 bg-amber-50/50 p-1.5 border border-amber-100/50 rounded-[4px] max-w-[125px]">
                                  <AlertCircle size={10} className="text-amber-500" />
                                  <span>{isTh ? 'ไม่ได้ใช้ฟลว์ใด' : 'Not used'}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Updated At */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                              <Clock size={12} className="text-slate-400" />
                              <span>{formatDate(schema.updatedAt)}</span>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6 py-4 whitespace-nowrap text-right pr-8">
                            <div className="flex items-center justify-end gap-1.5">
                              <Tooltip title={isTh ? 'แก้ไขสคีมา' : 'Edit Schema'}>
                                <button
                                  onClick={() => handleOpenEdit(schema)}
                                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-[#0463EF] bg-white border border-slate-150 rounded-xl transition-all cursor-pointer"
                                >
                                  <Edit3 size={14} />
                                </button>
                              </Tooltip>

                              <button
                                onClick={() => setSchemaToDelete(schema)}
                                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 bg-white border border-slate-150 rounded-xl transition-all cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSchemas.map((schema, idx) => {
                  const schemaDocTypes = getDocTypeNames(schema.docTypes);
                  const schemaWorkflows = getWorkflowNames(schema.workflowIds);

                  return (
                    <motion.div
                      key={schema.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.04 }}
                      className="bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-100 rounded-[8px] p-6 transition-all duration-300 flex flex-col h-full relative group"
                    >
                      {/* Schema card header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-3 bg-blue-50/40 text-[#0463EF] rounded-[4px] group-hover:bg-[#0463EF] group-hover:text-white transition-all duration-300">
                          <Layers size={18} />
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          <Tooltip title={isTh ? 'แก้ไขสคีมา' : 'Edit Schema'}>
                            <button
                              onClick={() => handleOpenEdit(schema)}
                              className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 bg-white border border-slate-105 rounded-xl transition-all cursor-pointer"
                            >
                              <Edit3 size={15} />
                            </button>
                          </Tooltip>

                          <button
                            onClick={() => setSchemaToDelete(schema)}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 bg-white border border-slate-105 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Meta Names */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="text-base font-black text-[#010136] tracking-tight group-hover:text-[#0463EF] transition-colors leading-snug">
                            {schema.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                            {schema.description || (isTh ? '(ไม่มีคำอธิบายคีย์เพิ่มเติม)' : '(No description provided)')}
                          </p>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Doc types section with counts */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <FileText size={12} className="text-slate-400" />
                            <span>{isTh ? `ประเภทเอกสาร (${schema.docTypes.length})` : `Doc Types (${schema.docTypes.length})`}</span>
                          </div>
                          {schema.docTypes.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {schema.docTypes.map((dtId, dtIdx) => {
                                const dtName = docTypes.find(d => d.id === dtId)?.name || dtId;
                                const configForDt = schema.configs?.find(c => c.docTypeId === dtId);
                                const labelCount = configForDt?.labels.length || 0;

                                return (
                                  <div key={dtIdx} className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-150/45">
                                    <span className="font-bold text-[#010136] truncate max-w-[140px]">{dtName}</span>
                                    <span className="text-[10px] font-black text-[#0463EF] bg-indigo-50 px-1.5 py-0.5 rounded">
                                      {labelCount} {isTh ? 'Labels' : 'Labels'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">None</span>
                          )}
                        </div>

                        {/* Workflows mapping */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <WorkflowIcon size={12} className="text-slate-400" />
                            <span>{isTh ? `ผูกเวิร์กโฟลว์ (${schema.workflowIds.length})` : `Connected Workflows (${schema.workflowIds.length})`}</span>
                          </div>
                          {schemaWorkflows.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {schemaWorkflows.map((wfName, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0"></span>
                                  <span className="truncate" title={wfName}>{wfName}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic flex items-center gap-1 bg-amber-50/50 p-2 border border-amber-100/50 rounded-xl">
                              <AlertCircle size={12} className="text-amber-500" />
                              <span>{isTh ? 'ยังไม่ได้เชื่อมต่อกับ Flow ใดๆ' : 'Not used in any workflows'}</span>
                            </div>
                          )}
                        </div>

                        {/* AI Prompt template Indicator */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <span className="text-blue-500">✨</span>
                            <span>{isTh ? 'AI PROMPT' : 'AI PROMPT'}</span>
                          </div>
                          {schema.aiPrompt ? (
                            <div className="text-xs bg-blue-50/40 p-2 border border-blue-100/50 rounded-xl font-medium text-slate-600 truncate leading-relaxed" title={schema.aiPrompt}>
                              {schema.aiPrompt}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic bg-slate-50 p-2 border border-dashed border-slate-200 rounded-xl flex items-center gap-1 whitespace-nowrap overflow-hidden">
                              <span>{isTh ? 'ใช้รูปแบบมาตรฐานเริ่มต้น' : 'Using default standard prompt'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer card metrics */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{formatDate(schema.updatedAt)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Setup Schema Modal with width=820 for tabular label lists */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50/60 text-[#0463EF] rounded-xl">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {editingSchema ? (isTh ? 'แก้ไขสคีมา' : 'EDIT SCHEMA') : (isTh ? 'เพิ่มสคีมาใหม่' : 'CREATE SCHEMA')}
              </span>
              <h2 className="text-base font-black text-[#010136] tracking-tight">
                {editingSchema ? (isTh ? 'ตั้งค่า Label schema ของคุณ' : 'Configure Your Label Schema') : (isTh ? 'สร้างสคีมาใหม่ในระบบ' : 'Create New Label Schema')}
              </h2>
            </div>
          </div>
        }
        open={showModal}
        onClose={() => setShowModal(false)}
        size="large"
        placement="right"
        styles={{ body: { paddingBottom: 80 } }}
        footer={
          <div className="flex justify-end gap-3 px-2 py-1">
            <Button 
              onClick={() => setShowModal(false)} 
              className="text-slate-500 font-bold hover:bg-slate-50 px-6 py-2.5 rounded-xl border border-slate-200 cursor-pointer text-xs uppercase tracking-wider h-[40px]"
            >
              {isTh ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              type="primary" 
              className="bg-[#0463EF] hover:bg-[#0352cc] text-white font-black px-6 py-2.5 rounded-xl border-none shadow-md shadow-blue-500/10 cursor-pointer text-xs uppercase tracking-wider h-[40px]"
            >
              {isTh ? 'บันทึกข้อมูล' : 'Save Schema'}
            </Button>
          </div>
        }
      >
        <div className="py-4 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100 shadow-3xs animate-shake">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Basic section */}
          <div className="space-y-4">
            {/* Schema Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#010136] uppercase tracking-wider flex items-center gap-1">
                <span>{isTh ? 'ชื่อ SCHEMA' : 'SCHEMA NAME'}</span>
                <span className="text-rose-500">*</span>
              </label>
              <Input 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)}
                placeholder={isTh ? 'เช่น Import standard v2' : 'e.g. Import standard v2'} 
                className="py-2.5 rounded-xl border-slate-200 font-semibold text-slate-800 hover:border-blue-300 focus:border-[#0463EF] focus:shadow-sm shadow-2xs placeholder-slate-400"
              />
            </div>

            {/* Schema Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#010136] uppercase tracking-wider">
                {isTh ? 'คำอธิบายสคีมา' : 'DESCRIPTION'}
              </label>
              <Input.TextArea 
                value={formDesc} 
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder={isTh ? 'สรุปรายละเอียดหรือจุดประสงค์ในการใช้สคีมานี้...' : 'Detail the use case or objective of this schema...'}
                rows={2}
                className="rounded-xl border-slate-200 font-semibold text-slate-800 hover:border-blue-300 focus:border-[#0463EF] focus:shadow-sm shadow-2xs placeholder-slate-400"
              />
            </div>


            {/* AI Prompt Input (Prompt AI) */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-black text-[#010136] uppercase tracking-wider flex items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <span className="text-blue-600">✨</span>
                  <span>{isTh ? 'Prompt AI สำหรับการสกัดข้อมูลเอกสาร' : 'Document Extraction AI Prompt'}</span>
                </span>
                <Tooltip title={isTh ? 'ระบุคำสั่ง (Prompt) ที่ใช้สั่งการ AI ในการสกัดและวิเคราะห์ข้อมููลอย่างละเอียดแบบเฉพาะเจาะจง' : 'Specify custom AI system prompt instructions to guide the extraction behavior.'}>
                  <HelpCircle size={14} className="text-[#010136]/40 cursor-help" />
                </Tooltip>
              </label>
              <Input.TextArea 
                value={formAiPrompt} 
                onChange={(e) => setFormAiPrompt(e.target.value)}
                placeholder={isTh ? 
`คุณคือผู้เชี่ยวชาญด้านการประมวลผลและสกัดข้อมูลจากเอกสารสากล (Global OCR Helper) 
หน้าที่ของคุณคือตรวจสอบและถอดคีย์ค่าข้อมูลต่าง ๆ จากเอกสารที่อัปโหลด เช่น เลขที่เอกสาร, วันที่, จำนวนเงิน, รายการสินค้า หรืออื่น ๆ ที่ระบุตามโครงสร้างฟิลด์อย่างเคร่งครัด
- ตรวจสอบความถูกต้องและสอดคล้องของเอกสารทั้งหมด
- ห้ามทำการคาดเดา เขียนข้อมูลขึ้นมาเอง (No hallucination) หรือเพิ่มเติมข้อมูลที่ไม่อยู่ในภาพ/เอกสารจริง
- หากไม่มีฟิลด์ดังกล่าวในเอกสาร ให้ส่งค่ากลับเป็น null เสมอ` : 
`You are an expert global OCR and document parsing assistant. 
Your task is to highly accurately extract structured elements from the uploaded documents according to the labels defined. 
- Ensure high fidelity extraction with zero hallucination.
- If a specific field or key is not explicitly mentioned or found in the text, return null instead of fabricating data.`}
                rows={5}
                style={{ borderRadius: 4 }}
                className="border-slate-200 font-semibold text-slate-800 hover:border-blue-300 focus:border-[#0463EF] focus:shadow-sm shadow-2xs placeholder-slate-450 text-xs leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 font-bold leading-normal">
                {isTh ? '* จะทำหน้าที่เป็นคำสั่งพื้นฐาน (System Instruction) ตลอดกระบวนการสกัดหรือประมวลผลเอกสารสคีมานี้' : '* Serves as the base System Instruction during standard extraction for this schema.'}
              </p>
              <p className="text-[10px] text-blue-500 font-bold leading-normal bg-blue-50/50 p-2 border border-blue-100 rounded-sm mt-1">
                {isTh 
                  ? '* คำแนะนำ: หากระบุเงื่อนไขสำหรับฟิลด์ใดใน Prompt ชุดนี้ กรุณาใช้ชื่อฟิลด์ให้ตรงเป๊ะกับชื่อฟิลด์ (Schema Field Name) ที่กำหนดด้านล่างนี้ เพื่อช่วยให้ AI ค้นพบและจับคู่ได้อย่างแม่นยำสูงสุด' 
                  : '* Hint: If you write prompt guidelines for specific fields, please use the exact field names (Schema Field Name) declared in your schema below to help the AI detect and match them with maximum accuracy.'}
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Connect & Add Doc Types and its Labels */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/40">
              <div className="space-y-1">
                <span className="text-xs font-black text-[#010136] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={15} className="text-[#0463EF]" />
                  <span>{isTh ? 'จัดการประเภทเอกสาร' : 'Document Types Management'}</span>
                  <span className="text-rose-500">*</span>
                </span>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {isTh ? 'เลือกประเภทเอกสารเข้ามาเพื่อกำหนดตารางและชื่อป้ายระบุ (Label) ตัวกลั่นกรองฟิลด์' : 'Add document types used in operations to specify metadata labels.'}
                </p>
              </div>

              {/* Selector to custom add docType with button click */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  className="w-48 sm:w-64 ant-select-custom font-semibold text-xs"
                  placeholder={isTh ? 'เลือกประเภทเอกสาร' : 'Select Document Type'}
                  value={selectedDocTypeToAdd}
                  onChange={(val) => setSelectedDocTypeToAdd(val)}
                  options={docTypes
                    .filter(d => !formDocTypes.includes(d.id))
                    .map(d => ({ label: `[${d.id}] ${d.name}`, value: d.id }))}
                  styles={{ popup: { root: { zIndex: 9999 } } }}
                />
                <Button
                  type="primary"
                  onClick={handleAddNewDocTypeClick}
                  disabled={!selectedDocTypeToAdd}
                  className="bg-[#0463EF] hover:bg-[#0352cc] hover:shadow-xs text-white font-bold h-[32px] rounded-lg border-none flex items-center px-3.5 text-xs shadow-3xs transition-all duration-200"
                >
                  <Plus size={13} className="mr-1" />
                  <span>{isTh ? 'เพิ่ม' : 'Add'}</span>
                </Button>
              </div>
            </div>

            {/* Tables for each selected DocType */}
            {formConfigs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center">
                <FileText size={24} className="text-slate-300 mb-2" />
                <span className="text-xs text-slate-400 font-bold">
                  {isTh ? 'ยังไม่มีการเลือกประเภทเอกสารในสคีมานี้' : 'No document types added to this schema yet.'}
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {formConfigs.map((config) => {
                  const docTypeObj = docTypes.find(d => d.id === config.docTypeId);
                  const docTypeName = docTypeObj ? docTypeObj.name : config.docTypeId;
                  const isExpanded = expandedDocTypes[config.docTypeId] !== false;

                  return (
                    <motion.div 
                      key={config.docTypeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs"
                    >
                      {/* DocType Header - Clickable Accordion Header */}
                      <div 
                        onClick={() => {
                          setExpandedDocTypes(prev => ({
                            ...prev,
                            [config.docTypeId]: isExpanded ? false : true
                          }));
                        }}
                        className="px-5 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 select-none transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <ChevronDown 
                            size={16} 
                            className={`text-[#010136]/50 transition-transform duration-250 ease-out-back ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
                          />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0463EF]" />
                          <span className="text-sm font-black text-[#010136] tracking-tight">{docTypeName}</span>
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#0463EF]/10 text-[#0463EF] rounded-md tracking-wider">
                            {config.docTypeId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent accordion toggle when deleting
                            handleRemoveDocTypeConfig(config.docTypeId);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <X size={12} />
                          <span>{isTh ? 'ลบออก' : 'Remove'}</span>
                        </button>
                      </div>

                      {/* Collapsible Section Area */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={{
                              open: { opacity: 1, height: "auto" },
                              collapsed: { opacity: 0, height: 0 }
                            }}
                            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            {/* 3 Sections (Header, Description, Footer) */}
                            <div className="p-4 pt-2 space-y-6">
                              {[
                                {
                                  key: 'Header' as const,
                                  titleTh: 'ส่วนหัว (Header)',
                                  titleEn: 'Header',
                                  color: 'bg-blue-600',
                                  textColor: 'text-blue-700'
                                },
                                {
                                  key: 'Description' as const,
                                  titleTh: 'คำอธิบาย (Description)',
                                  titleEn: 'Description',
                                  color: 'bg-emerald-500',
                                  textColor: 'text-emerald-700'
                                },
                                {
                                  key: 'Footer' as const,
                                  titleTh: 'ส่วนท้าย (Footer)',
                                  titleEn: 'Footer',
                                  color: 'bg-purple-600',
                                  textColor: 'text-purple-700'
                                }
                              ].map((sect) => {
                                const sectionLabels = config.labels.filter(label => (label.section || 'Header') === sect.key);
                                return (
                                  <div key={sect.key} className="border border-slate-200 rounded-2xl p-4 bg-white space-y-4 shadow-3xs">
                                    {/* Section Sub-Header */}
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                      <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${sect.color}`} />
                                        <h5 className="text-xs font-black text-slate-800 tracking-tight uppercase mb-0">
                                          {isTh ? sect.titleTh : sect.titleEn}
                                        </h5>
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-md">
                                          {sectionLabels.length} {isTh ? 'ฟิลด์' : 'fields'}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleAddLabelRow(config.docTypeId, sect.key)}
                                        className="px-3 py-1.5 border border-dashed border-[#0463EF]/40 hover:border-[#0463EF]/70 hover:bg-[#0463EF]/5 hover:text-[#0463EF] text-[#0463EF]/80 font-black text-xs rounded-lg transition-all flex items-center gap-1 bg-white cursor-pointer active:scale-98"
                                      >
                                        <Plus size={12} className="text-[#0463EF]" />
                                        <span>{isTh ? '+ เพิ่ม Field' : '+ Add Field'}</span>
                                      </button>
                                    </div>

                                    {/* Fields List */}
                                    <div className="space-y-3.5">
                                      {sectionLabels.length === 0 ? (
                                        <div className="py-6 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-100 rounded-xl bg-slate-50/20">
                                          {isTh ? 'ยังไม่มีฟิลด์ในส่วนนี้' : 'No fields defined. Click "+ เพิ่ม Field" to begin.'}
                                        </div>
                                      ) : (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                          {sectionLabels.map((label) => (
                                            <div key={label.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/50 space-y-3.5 transition-all">
                                              {/* Main Row */}
                                              <div className="flex gap-4 items-center w-full">
                                                {/* Field Name Input */}
                                                <div className="flex-1 min-w-0">
                                                  <input 
                                                    type="text"
                                                    value={label.name}
                                                    onChange={(e) => handleUpdateLabelRow(config.docTypeId, label.id, { name: e.target.value })}
                                                    placeholder={isTh ? 'ชื่อ field' : 'field name'}
                                                    className="w-full px-3.5 py-2 font-mono bg-white text-slate-800 font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0463EF]/10 text-sm h-[40px] transition-all border-slate-200 hover:border-slate-300 focus:border-[#0463EF]"
                                                  />
                                                </div>

                                                {/* Select Field Type */}
                                                <div className="relative w-36">
                                                  <select
                                                    value={label.type || 'string'}
                                                    onChange={(e) => {
                                                      const newType = e.target.value;
                                                      if (newType === 'array' && !label.subLabels) {
                                                        handleUpdateLabelRow(config.docTypeId, label.id, { type: newType, subLabels: [] });
                                                      } else {
                                                        handleUpdateLabelRow(config.docTypeId, label.id, { type: newType });
                                                      }
                                                    }}
                                                    className="w-full pl-3.5 pr-8 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0463EF]/10 text-sm font-semibold h-[40px] appearance-none cursor-pointer"
                                                  >
                                                    <option value="string">string</option>
                                                    <option value="number">number</option>
                                                    <option value="boolean">boolean</option>
                                                    <option value="date">date</option>
                                                    <option value="array">array</option>
                                                  </select>
                                                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                                    <ChevronDown size={14} />
                                                  </div>
                                                </div>

                                                {/* Required Checkbox */}
                                                <div className="flex items-center min-w-[100px]">
                                                  <label className="flex items-center gap-2 select-none cursor-pointer text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                                                    <input 
                                                      type="checkbox"
                                                      checked={label.required}
                                                      onChange={(e) => handleUpdateLabelRow(config.docTypeId, label.id, { required: e.target.checked })}
                                                      className="w-4.5 h-4.5 rounded border-slate-300 text-[#0463EF] focus:ring-[#0463EF]/20 cursor-pointer"
                                                    />
                                                    <span>Required</span>
                                                  </label>
                                                </div>

                                                {/* Dangerously delete label field */}
                                                <button
                                                  type="button"
                                                  onClick={() => handleRemoveLabelRow(config.docTypeId, label.id)}
                                                  className="p-2 text-rose-500 hover:text-rose-750 hover:bg-rose-50 active:scale-95 border border-transparent rounded-lg transition-all cursor-pointer flex items-center justify-center h-[40px] w-[40px]"
                                                  title={isTh ? 'ลบ Field' : 'Delete field'}
                                                >
                                                  <Trash2 size={16} />
                                                </button>
                                              </div>

                                              {/* Sub-fields block for array type */}
                                              {label.type === 'array' && (
                                                <div className="pl-6 border-l-2 border-dashed border-[#0463EF]/40 space-y-3 pt-1">
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-black text-[#010136]/75 uppercase tracking-wider flex items-center gap-1.5 label-section-title">
                                                      <span className="w-1.5 h-1.5 rounded-full bg-[#16EA9E]" />
                                                      {isTh ? `ฟิลด์ย่อย (Array Items: ${label.name || '?'})` : `Sub-Fields for Array Items: ${label.name || '?'}`}
                                                    </span>
                                                    <Button
                                                      type="dashed"
                                                      onClick={() => handleAddSubLabelRow(config.docTypeId, label.id)}
                                                      className="border-dashed border-[#0463EF]/50 text-[#0463EF] hover:text-[#0352cc] hover:border-[#0352cc] text-[11px] h-[26px] py-0 px-2.5 rounded-md flex items-center font-bold"
                                                    >
                                                      <Plus size={12} className="mr-1" />
                                                      {isTh ? 'เพิ่ม Field ย่อย' : 'Add Sub Field'}
                                                    </Button>
                                                  </div>

                                                  {/* Sub-fields list */}
                                                  {(!label.subLabels || label.subLabels.length === 0) ? (
                                                    <div className="p-4 text-center text-slate-400 text-xs font-semibold bg-white/70 border border-dashed border-slate-200/80 rounded-xl">
                                                      {isTh ? 'ยังไม่มีฟิลด์ย่อย กดปุ่ม "เพิ่ม Field ย่อย" เพื่อเริ่มกำหนดค่า' : 'No nested fields yet. Click "Add Sub Field" to begin.'}
                                                    </div>
                                                  ) : (
                                                    <div className="space-y-2.5">
                                                      {label.subLabels.map((subLabel) => (
                                                        <div key={subLabel.id} className="flex gap-3 items-center w-full bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-3xs hover:shadow-2xs transition-all animate-in slide-in-from-top-1 duration-150">
                                                          {/* Sub-Field Name Input */}
                                                          <div className="flex-1 min-w-0">
                                                            <input 
                                                              type="text"
                                                              value={subLabel.name}
                                                              onChange={(e) => handleUpdateSubLabelRow(config.docTypeId, label.id, subLabel.id, { name: e.target.value })}
                                                              placeholder={isTh ? 'ชื่อ field ย่อย' : 'sub-field name'}
                                                              className="w-full px-3 py-1.5 font-mono bg-white text-slate-800 font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0463EF]/10 text-xs h-[36px] transition-all hover:border-slate-300 focus:border-[#0463EF]"
                                                            />
                                                          </div>

                                                          {/* Sub-Field Type Selector */}
                                                          <div className="relative w-32">
                                                            <select
                                                              value={subLabel.type || 'string'}
                                                              onChange={(e) => handleUpdateSubLabelRow(config.docTypeId, label.id, subLabel.id, { type: e.target.value })}
                                                              className="w-full pl-3 pr-8 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0463EF]/10 text-xs font-semibold h-[36px] appearance-none cursor-pointer"
                                                            >
                                                              <option value="string">string</option>
                                                              <option value="number">number</option>
                                                              <option value="boolean">boolean</option>
                                                              <option value="date">date</option>
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-2 w-4 flex items-center text-slate-400">
                                                              <ChevronDown size={12} />
                                                            </div>
                                                          </div>

                                                          {/* Sub-Field Required */}
                                                          <div className="flex items-center min-w-[90px] pl-1">
                                                            <label className="flex items-center gap-1.5 select-none cursor-pointer text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
                                                              <input 
                                                                type="checkbox"
                                                                checked={subLabel.required}
                                                                onChange={(e) => handleUpdateSubLabelRow(config.docTypeId, label.id, subLabel.id, { required: e.target.checked })}
                                                                className="w-3.5 h-3.5 rounded border-slate-300 text-[#0463EF] focus:ring-[#0463EF]/20 cursor-pointer"
                                                              />
                                                              <span>Required</span>
                                                            </label>
                                                          </div>

                                                          {/* Delete Sub-Field */}
                                                          <button
                                                            type="button"
                                                            onClick={() => handleRemoveSubLabelRow(config.docTypeId, label.id, subLabel.id)}
                                                            className="p-1.5 text-rose-500 hover:text-rose-750 hover:bg-rose-50 active:scale-95 border border-transparent rounded-lg transition-all cursor-pointer flex items-center justify-center h-[32px] w-[32px]"
                                                            title={isTh ? 'ลบ field ย่อย' : 'Delete sub-field'}
                                                          >
                                                            <Trash2 size={13} />
                                                          </button>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                              {/* JSON PREVIEW card matching layout of reference image */}
                              <div className="mt-6 pt-4 border-t border-slate-100">
                                <div className="text-xs font-black text-[#010136]/60 uppercase tracking-wider mb-2.5">
                                  {isTh ? 'JSON Preview' : 'JSON Preview'}
                                </div>
                                <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-4 font-mono text-[13px] text-slate-700 max-h-[220px] overflow-y-auto shadow-2xs leading-relaxed">
                                  <pre className="whitespace-pre-wrap font-mono text-[13px]">
                                    {(() => {
                                      const serializeLabelRec = (l: SchemaLabel): any => {
                                        const res: any = {
                                          name: l.name,
                                          type: l.type || 'string'
                                        };
                                        if (l.type === 'array') {
                                          res.items = (l.subLabels || []).map(serializeLabelRec);
                                        }
                                        return res;
                                      };
                                      return JSON.stringify(
                                        config.labels.map(serializeLabelRec), 
                                        null, 
                                        2
                                      );
                                    })()}
                                  </pre>
                                </div>
                              </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Warning confirmation modal for docTypes without labels */}
      <Modal
        open={showWarningModal}
        onCancel={() => {
          setShowWarningModal(false);
          setPendingSavePayload(null);
        }}
        footer={null}
        width={420}
        centered
        closable={false}
        className="rounded-3xl overflow-hidden"
      >
        <div className="p-4 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 border border-amber-200 rounded-full flex items-center justify-center mx-auto shadow-2xs">
            <AlertTriangle size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-black text-[#010136] tracking-tight">
              {isTh ? 'doc type นี้ยังไม่มี label' : 'This doc type has no labels yet'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {isTh 
                ? 'ต้องการบันทึกต่อไปหรือไม่' 
                : 'Do you want to continue saving anyway?'}
            </p>
          </div>

          {/* List of warning types */}
          {pendingSavePayload && (
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col gap-1 text-left">
              <span className="text-[10px] font-bold text-amber-600 block uppercase tracking-wider">
                {isTh ? 'ประเภทเอกสารที่ไม่มี Label' : 'Zero labels configured on:'}
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formConfigs
                  .filter(cfg => cfg.labels.length === 0)
                  .map(cfg => {
                    const name = docTypes.find(d => d.id === cfg.docTypeId)?.name || cfg.docTypeId;
                    return (
                      <span key={cfg.docTypeId} className="px-2 py-0.5 text-[9px] font-extrabold bg-white text-slate-600 rounded-md border border-amber-250">
                        {name}
                      </span>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setShowWarningModal(false);
                setPendingSavePayload(null);
              }}
              className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer h-[40px]"
            >
              {isTh ? 'กลับไปแก้ไข' : 'Go back to edit'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (pendingSavePayload) {
                  submitSave(pendingSavePayload);
                }
              }}
              className="px-4 py-2.5 bg-[#0463EF] text-white hover:bg-[#0352cc] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer h-[40px]"
            >
              {isTh ? 'ต้องการบันทึกต่อไป' : 'Continue Saving'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Schema Modal */}
      <Modal
        open={!!schemaToDelete}
        onCancel={() => setSchemaToDelete(null)}
        footer={null}
        width={420}
        centered
        closable={false}
        className="rounded-3xl overflow-hidden"
      >
        {schemaToDelete && (
          <div className="p-4 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 border border-rose-200 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 size={28} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-[#010136] tracking-tight hover:text-rose-600 transition-colors">
                {isTh ? `ต้องการลบ ${schemaToDelete.name} ใช่หรือไม่` : `Delete ${schemaToDelete.name}?`}
              </h3>
              
              {(() => {
                const schemaWorkflows = getWorkflowNames(schemaToDelete.workflowIds);
                if (schemaWorkflows.length > 0) {
                  return (
                    <div className="text-left mt-4 text-xs font-semibold leading-relaxed text-slate-500 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-amber-600 font-bold">
                          {isTh ? `schema นี้ถูกใช้ใน ${schemaToDelete.workflowIds.length} workflow` : `This schema is used in ${schemaToDelete.workflowIds.length} workflows`}
                        </span>
                      </div>
                      <p className="mb-2 text-slate-600 font-medium">
                        {isTh ? 'ได้แก่:' : 'Including:'}
                      </p>
                      <ul className="list-disc pl-5 space-y-1 mb-2 text-slate-600 font-medium opacity-90">
                        {schemaWorkflows.map((wf, idx) => (
                          <li key={idx}>{wf}</li>
                        ))}
                      </ul>
                      <p className="text-rose-500 mt-3 font-bold bg-rose-50 p-2 rounded-lg text-center">
                        {isTh ? 'การลบจะกระทบ workflow เหล่านั้น Extract node จะแสดง incomplete' : 'Deleting this will affect these workflows. Their Extract nodes will become incomplete.'}
                      </p>
                    </div>
                  );
                }
                return (
                  <p className="text-xs text-rose-500 mt-2 font-bold px-2 py-1.5 bg-rose-50 rounded-lg inline-block">
                    {isTh ? 'การลบนี้ไม่สามารถกู้คืนได้' : 'This action cannot be undone.'}
                  </p>
                );
              })()}
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSchemaToDelete(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer h-[40px]"
              >
                {isTh ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteSchema(schemaToDelete.id);
                  setSchemaToDelete(null);
                }}
                className="px-4 py-2.5 bg-rose-500 text-white hover:bg-rose-600 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-500/10 cursor-pointer h-[40px]"
              >
                {isTh ? 'ลบทันที' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
