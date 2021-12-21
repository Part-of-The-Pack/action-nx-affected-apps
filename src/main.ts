import * as core from '@actions/core'
import {getNxAffectedApps} from './getNxAffectedApps'

export async function run(workspace: string = '.'): Promise<void> {
    try {
        const {GITHUB_WORKSPACE = workspace} = process.env
        const base = core.getInput('base')
        const head = core.getInput('head')

        // save base and head to env for later steps
        core.exportVariable('NX_BASE', base || 'HEAD~1')
        core.exportVariable('NX_HEAD', head || 'HEAD')

        core.info(`Getting diff from ${base} to ${head || 'HEAD'}...`)
        core.info(`using dir: ${GITHUB_WORKSPACE}`)

        const apps = getNxAffectedApps({
            base,
            head,
            workspace: GITHUB_WORKSPACE
        })

        core.setOutput('affected_apps', apps)
        core.exportVariable('NX_AFFECTED_APPS', apps)
        core.exportVariable(
            'NX_AFFECTED_APPS_WITH_IDENTIFIER',
            JSON.stringify(apps.map(app => `_${app}_`))
        )
        core.info(`Found these affected apps: \n ${apps}`)
    } catch (error) {
        core.setFailed((error as Error).message)
    }
}

run()
