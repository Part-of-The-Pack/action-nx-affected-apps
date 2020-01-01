import {execSync} from 'child_process'

export function getNxAffectedApps({base, head, workspace}: Props): string[] {
  const result = execSync(
    `npx nx affected:apps --base=${base} --head=${head}`,
    {
      cwd: workspace
    }
  ).toString()

  if (!result.includes('Affected apps:')) {
    throw Error('NX Command Failed')
  }

  const apps = result
    .split('Affected apps:')[1]
    .trim()
    .split('- ')
    .map(x => x.trim())
    .filter(x => x.length > 0)

  return apps || []
}

interface Props {
  base: string
  head: string
  workspace: string
}
