/** NSO CI/CD pipeline — aligned with developer/nso_cicd .gitlab-ci.yml */
export const nsoPipelineData = {
  stages: [
    { id: 'repository', name: 'GitLab', description: 'Source control and CI trigger', color: '#a855f7' },
    { id: 'build', name: 'Build', description: 'Compile and load packages on NSO dev', color: '#3b82f6' },
    { id: 'test', name: 'Test', description: 'pyATS validation via NSO', color: '#f59e0b' },
    { id: 'deliver', name: 'Deliver', description: 'Package artifact', color: '#8b5cf6' },
    { id: 'cleanup', name: 'Cleanup', description: 'Reset dev NSO', color: '#64748b' },
    { id: 'deploy_prod', name: 'Deploy Prod', description: 'Production NSO', color: '#10b981' },
  ],
  jobs: [
    {
      id: 'gitlab-repo',
      name: 'GitLab Push',
      stage: 'repository',
      description: 'Push to developer/nso_cicd triggers the pipeline.',
      scripts: [
        'http://devtools-gitlab.lab.devnetsandbox.local/developer/nso_cicd',
        'Feature branch → build, test, deliver',
        'main → deploy_prod',
      ],
      rules: ['Use workshop hostname for Web IDE — not localhost:2080'],
      repoInfo: {
        name: 'nso_cicd',
        description: 'NSO loopback CI/CD project',
        contents: ['.gitlab-ci.yml', 'packages/loopback/', 'tests/loopback-test/', 'pipeline_utils/'],
      },
    },
    {
      id: 'package-compilation',
      name: 'Compile Package',
      stage: 'build',
      description: 'Copy package to NSO Development (10.10.20.47) and run make.',
      scripts: ['scp packages/loopback → NSO dev', 'make clean && make'],
      dependencies: ['gitlab-repo'],
      rules: ['except: main'],
    },
    {
      id: 'package-load',
      name: 'Reload Packages',
      stage: 'build',
      description: 'Reload packages on NSO Development.',
      scripts: ["packages reload | ncs_cli -Cu admin"],
      dependencies: ['package-compilation'],
      rules: ['except: main'],
    },
    {
      id: 'test-loopback',
      name: 'Test Loopback',
      stage: 'test',
      description: 'pyATS tests against dev-core-rtr01 and dev-dist-rtr01.',
      scripts: [
        'python3 loopback-test.py --device dev-core-rtr01',
        'python3 loopback-test.py --device dev-dist-rtr01',
      ],
      dependencies: ['package-load'],
      rules: ['except: main'],
    },
    {
      id: 'release-publishing',
      name: 'Publish Artifact',
      stage: 'deliver',
      description: 'Tarball from dev NSO for production promotion.',
      scripts: ['tar nso-package_loopback_${CI_COMMIT_REF_NAME}.tar.gz'],
      dependencies: ['test-loopback'],
      rules: ['except: main'],
    },
    {
      id: 'deploy-production',
      name: 'Deploy Production',
      stage: 'deploy_prod',
      description: 'Deploy to NSO Production (10.10.20.48) on main only.',
      scripts: ['scp tarball → prod', 'extract, make, packages reload'],
      dependencies: ['gitlab-repo'],
      rules: ['only: main'],
    },
    {
      id: 'cleanup',
      name: 'Cleanup Dev',
      stage: 'cleanup',
      description: 'Remove package from NSO Development.',
      scripts: ['rm package on dev', 'packages reload force'],
      dependencies: ['deploy-production'],
      rules: ['when: always'],
    },
    {
      id: 'nso-platform',
      name: 'NSO',
      stage: 'deploy_prod',
      description: 'NSO Development (.47) and Production (.48).',
      isInfrastructure: true,
      scripts: [],
      dependencies: [],
    },
  ],
}

export const nsoNodePositions = {
  'gitlab-repo': { x: 0, y: 180 },
  'package-compilation': { x: 280, y: 60 },
  'package-load': { x: 530, y: 60 },
  'test-loopback': { x: 780, y: 60 },
  'release-publishing': { x: 1030, y: 60 },
  'deploy-production': { x: 530, y: 280 },
  'cleanup': { x: 780, y: 280 },
  'nso-platform': { x: 1030, y: 280 },
}

export const NSO_CICD_STAGES = ['build', 'test', 'deliver', 'deploy_prod', 'cleanup']
