export const platformOverrides = {
  aci: {
    'self-service-user': {
      yamlExample: `# Portal auto-generates:
# data/tenant_PROD.nac.yaml
---
apic:
  tenants:
    - name: PROD
      vrfs:
        - name: PROD_VRF
      bridge_domains:
        - name: BD_WEB
          vrf: PROD_VRF`,
    },
    'portal-api': {
      scripts: [
        'POST /api/aci/tenants → validate → generate YAML',
        '',
        'API commits generated YAML to GitLab repo',
      ],
    },
    'yaml-terraform': {
      scripts: [
        '# Edit ACI data files',
        'data/tenant_PROD.nac.yaml',
        'data/access_policies.nac.yaml',
        '',
        '# Git push triggers pipeline',
        'git push origin main',
      ],
    },
    'network-platform': {
      description: 'Cisco ACI APIC — the target fabric controller.',
    },
    'gitlab-repo': {
      repoInfo: {
        name: 'aci',
        description: 'ACI Network-as-Code Repository',
        contents: [
          'Terraform state and configuration',
          'NAC YAML files (data/ folder)',
          '.gitlab-ci.yml (CI/CD pipeline)',
          'ACI tenant, access, and fabric policies',
        ],
      },
    },
  },
  sdwan: {
    'self-service-user': {
      yamlExample: `# Portal auto-generates:
# data/sites/site_2101.yaml
---
site_id: 2101
site_name: Branch-NYC
template: branch_template
system_ip: 10.0.1.1
wan_interface: ge0/0
vpn_list: [10, 20, 30]`,
    },
    'portal-api': {
      scripts: [
        'POST /api/sdwan/sites → validate → generate YAML',
        '',
        'API commits generated YAML to GitLab repo',
      ],
    },
    'yaml-terraform': {
      scripts: [
        '# Edit SD-WAN data files',
        'data/sites/site_2101.yaml',
        'data/templates/branch_template.yaml',
        '',
        '# Git push triggers pipeline',
        'git push origin main',
      ],
    },
    'network-platform': {
      description: 'Cisco SD-WAN vManage — the target WAN controller.',
    },
    'gitlab-repo': {
      repoInfo: {
        name: 'sdwan',
        description: 'SD-WAN Network-as-Code Repository',
        contents: [
          'Terraform state and configuration',
          'NAC YAML files (data/ folder)',
          '.gitlab-ci.yml (CI/CD pipeline)',
          'SD-WAN templates, sites, and policies',
        ],
      },
    },
  },
  catalyst: {
    'self-service-user': {
      yamlExample: `# Portal auto-generates:
# data/buildings/Sunset_Tower.yaml
---
building_name: Sunset_Tower
address: 123 Sunset Blvd
floors:
  - name: Floor-1
    type: cubes-and-walled-offices
    height: 10`,
    },
    'portal-api': {
      scripts: [
        'POST /api/catalyst/buildings → validate → generate YAML',
        '',
        'API commits generated YAML to GitLab repo',
      ],
    },
    'yaml-terraform': {
      scripts: [
        '# Edit Catalyst data files',
        'data/buildings/Sunset_Tower.yaml',
        'data/network_profiles.nac.yaml',
        '',
        '# Git push triggers pipeline',
        'git push origin main',
      ],
    },
    'network-platform': {
      description: 'Cisco Catalyst Center (DNAC) — the target campus controller.',
    },
    'gitlab-repo': {
      repoInfo: {
        name: 'catalyst_center',
        description: 'Catalyst Center Network-as-Code Repository',
        contents: [
          'Terraform state and configuration',
          'NAC YAML files (data/ folder)',
          '.gitlab-ci.yml (CI/CD pipeline)',
          'Buildings, floors, and network profiles',
        ],
      },
    },
  },
};
