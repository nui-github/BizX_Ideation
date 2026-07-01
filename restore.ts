import { execSync } from 'child_process';

try {
  console.log('Restoring DataComparison.tsx using git...');
  const output = execSync('git checkout ./components/DataComparison.tsx', { encoding: 'utf-8' });
  console.log('Git output:', output);
} catch (err: any) {
  console.error('Failed to restore:', err.message);
}
