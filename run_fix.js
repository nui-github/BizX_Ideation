const fs = require('fs');
const path = require('path');

const filePath = path.resolve('components/DataComparison.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // 1. Show only diff (Doesn't have disabled currently)
  {
    target: `onClick={() => setShowOnlyDiff(!showOnlyDiff)}`,
    replacement: `disabled={isUnassigned}\n                      onClick={() => setShowOnlyDiff(!showOnlyDiff)}`
  },
  // 2. Upload/Group Files
  {
    target: `disabled={selectedJob.status === JobStatus.DONE}`,
    replacement: `disabled={isUnassigned || selectedJob.status === JobStatus.DONE}`
  },
  // 3. Bulk OCR (Doesn't have disabled currently)
  {
    target: `onClick={() => {\n                          const newDocs = Object.entries(selectedJob.docs)`,
    replacement: `disabled={isUnassigned}\n                        onClick={() => {\n                          const newDocs = Object.entries(selectedJob.docs)`
  },
  // 4. Compare / Validation Button
  {
    target: `disabled={\n                        selectedJob.status === JobStatus.READY ||`,
    replacement: `disabled={\n                        isUnassigned || \n                        selectedJob.status === JobStatus.READY ||`
  },
  // 5. Lock / Unlock Item
  {
    target: `disabled={(!areAllFilesLocked && selectedJob.status !== JobStatus.READY) || selectedJob.status === JobStatus.DONE}`,
    replacement: `disabled={isUnassigned || (!areAllFilesLocked && selectedJob.status !== JobStatus.READY) || selectedJob.status === JobStatus.DONE}`
  },
  // 6. Export Data
  {
    target: `disabled={selectedJob.status !== JobStatus.READY}`,
    replacement: `disabled={isUnassigned || selectedJob.status !== JobStatus.READY}`
  },
  // 7. Hide Column buttons inside the tooltip
  {
    target: `onClick={() => setHiddenLockedDocs(prev => prev.filter(x => x !== name))}`,
    replacement: `onClick={() => setHiddenLockedDocs(prev => prev.filter(x => x !== name))}\n                              disabled={isUnassigned}`
  },
  {
    target: `onClick={(e) => {\n                                                            e.stopPropagation();\n                                                            setHiddenLockedDocs(prev => [...prev, docName]);\n                                                          }}`,
    replacement: `disabled={isUnassigned}\n                                                          onClick={(e) => {\n                                                            e.stopPropagation();\n                                                            setHiddenLockedDocs(prev => [...prev, docName]);\n                                                          }}`
  },
  // 8. Doc Column buttons (Replace)
  {
    target: `disabled={docStatus === ComparisonDocStatus.EXTRACTING || docStatus === ComparisonDocStatus.LOCKED || selectedJob.status === JobStatus.DONE}`,
    replacement: `disabled={isUnassigned || docStatus === ComparisonDocStatus.EXTRACTING || docStatus === ComparisonDocStatus.LOCKED || selectedJob.status === JobStatus.DONE}`
  },
  // 9. Doc Column buttons (Lock)
  {
    target: `disabled={\n                                                           docStatus === ComparisonDocStatus.REJECTED || \n                                                           docStatus === ComparisonDocStatus.RECEIVED || `,
    replacement: `disabled={\n                                                           isUnassigned || \n                                                           docStatus === ComparisonDocStatus.REJECTED || \n                                                           docStatus === ComparisonDocStatus.RECEIVED || `
  },
  {
    target: `disabled={\n                                                          docStatus === ComparisonDocStatus.REJECTED || \n                                                          docStatus === ComparisonDocStatus.RECEIVED || `,
    replacement: `disabled={\n                                                          isUnassigned || \n                                                          docStatus === ComparisonDocStatus.REJECTED || \n                                                          docStatus === ComparisonDocStatus.RECEIVED || `
  },
  // 10. Doc Column buttons (Reject)
  {
    target: `disabled={docStatus === ComparisonDocStatus.REJECTED || docStatus === ComparisonDocStatus.LOCKED || docStatus === ComparisonDocStatus.EXTRACTING || selectedJob.status === JobStatus.DONE}`,
    replacement: `disabled={isUnassigned || docStatus === ComparisonDocStatus.REJECTED || docStatus === ComparisonDocStatus.LOCKED || docStatus === ComparisonDocStatus.EXTRACTING || selectedJob.status === JobStatus.DONE}`
  },
];

for (const { target, replacement } of replacements) {
  // Do a global replacement if there are multiple occurrences (like inside map for the docs)
  content = content.split(target).join(replacement);
}

// 11. Now, let's fix the tailwind classes of elements that didn't have a disabled state class before but now have 'disabled={isUnassigned}'
const classFixes = [
  {
    target: `className="p-0.5 hover:bg-slate-200 rounded text-blue-600 transform active:scale-95 transition-all cursor-pointer flex items-center"`,
    replacement: `className="p-0.5 hover:bg-slate-200 rounded text-blue-600 transform active:scale-95 transition-all cursor-pointer flex items-center disabled:opacity-30 disabled:cursor-not-allowed"`
  },
  {
    target: `className="p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700/20 shadow-emerald-500/10 cursor-pointer animate-pulse"`,
    replacement: `className="p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700/20 shadow-emerald-500/10 cursor-pointer animate-pulse disabled:opacity-30 disabled:cursor-not-allowed disabled:animate-none"`
  },
  {
    target: `className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-800 hover:text-white hover:border-emerald-500 hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center"`,
    replacement: `className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-800 hover:text-white hover:border-emerald-500 hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"`
  }
];

for (const { target, replacement } of classFixes) {
  content = content.split(target).join(replacement);
}

// Finally for 'showOnlyDiff' button which uses a string template for its className
const diffClassTarget = 'className={`p-2.5 rounded-xl transition-all border flex items-center justify-center cursor-pointer shadow-sm ${';
const diffClassReplacement = 'className={`p-2.5 rounded-xl transition-all border flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${';
content = content.split(diffClassTarget).join(diffClassReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully replaced buttons with disabled properties!");
