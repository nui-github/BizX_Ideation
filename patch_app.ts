import fs from 'fs';

let appCode = fs.readFileSync('App.tsx', 'utf-8');

appCode = appCode.replace(
  "import { DocTypeMaster } from './components/DocTypeMaster';",
  "import { DocTypeMaster } from './components/DocTypeMaster';\nimport { JobPresetSettings } from './components/JobPresetSettings';"
);

appCode = appCode.replace(
  "import { Agent, AgentStatus, AgentType, AuditLog, UserRole, Language, TrackingItem, TrackingSource, ReviewStatus, SendStatus, Workflow, DocType } from './types';",
  "import { Agent, AgentStatus, AgentType, AuditLog, UserRole, Language, TrackingItem, TrackingSource, ReviewStatus, SendStatus, Workflow, DocType, JobPreset } from './types';"
);

appCode = appCode.replace(
  "const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);",
  "const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);\n  const [jobPresets, setJobPresets] = useState<JobPreset[]>([]);"
);

// Add the view rendering block
const renderBlock = `
        {currentView === 'SETTINGS_MASTER_DATA' && (
          <MasterDataSettings 
            language={language}
            onBack={() => {
              setCurrentView('TRACKING');
            }}
          />
        )}
`;

const replaceWithBlock = `
        {currentView === 'SETTINGS_MASTER_DATA' && (
          <MasterDataSettings 
            language={language}
            onBack={() => {
              setCurrentView('TRACKING');
            }}
          />
        )}

        {currentView === 'SETTINGS_JOB_PRESET' && (
          <JobPresetSettings 
            language={language}
            workflows={workflows}
            comparisonWorkflows={comparisonWorkflows}
            presets={jobPresets}
            onAddPreset={(preset) => setJobPresets([...jobPresets, preset])}
            onUpdatePreset={(preset) => setJobPresets(jobPresets.map(p => p.id === preset.id ? preset : p))}
            onDeletePreset={(id) => setJobPresets(jobPresets.filter(p => p.id !== id))}
            onBack={() => setCurrentView('TRACKING')}
          />
        )}
`;

appCode = appCode.replace(renderBlock, replaceWithBlock);

fs.writeFileSync('App.tsx', appCode);
console.log('App.tsx patched');
