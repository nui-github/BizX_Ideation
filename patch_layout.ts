import fs from 'fs';

let code = fs.readFileSync('components/Layout.tsx', 'utf-8');

const targetMenuHtml = `
                  <button 
                    onClick={() => {
                      onNavigate('SETTINGS_DOC_TYPE_MASTER');
                      setActiveMenu('settings_doc_type');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings size={16} className="text-slate-400" /> 
                    <span>{language === 'TH' ? 'ตั้งค่า Doc Type' : 'Doc Type Settings'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      onNavigate('SETTINGS_LABEL_SCHEMA');
                      setActiveMenu('settings_label_schema');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings size={16} className="text-slate-400" /> 
                    <span>{language === 'TH' ? 'ตั้งค่า Label schema' : 'Label Schema Settings'}</span>
                  </button>
`;

const replaceWithMenuHtml = targetMenuHtml + `
                  <button 
                    onClick={() => {
                      onNavigate('SETTINGS_JOB_PRESET');
                      setActiveMenu('settings_job_preset');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings size={16} className="text-slate-400" /> 
                    <span>{language === 'TH' ? 'ตั้งค่าพรีเซ็ตงานเริ่มต้น' : 'Job Preset Settings'}</span>
                  </button>
`;

code = code.replace(targetMenuHtml, replaceWithMenuHtml);

const targetTitleHtml = `
                       : activeMenu === 'settings_label_schema'
                       ? (language === 'TH' ? 'ตั้งค่า Label schema' : 'Label Schema Settings')
                       : (language === 'TH' ? 'ตั้งค่า Master data' : 'Master Data Settings')}
`;

const replaceWithTitleHtml = `
                       : activeMenu === 'settings_label_schema'
                       ? (language === 'TH' ? 'ตั้งค่า Label schema' : 'Label Schema Settings')
                       : activeMenu === 'settings_job_preset'
                       ? (language === 'TH' ? 'ตั้งค่าพรีเซ็ตงานเริ่มต้น' : 'Job Preset Settings')
                       : (language === 'TH' ? 'ตั้งค่า Master data' : 'Master Data Settings')}
`;

code = code.replace(targetTitleHtml, replaceWithTitleHtml);

fs.writeFileSync('components/Layout.tsx', code);
console.log('Layout.tsx patched');
