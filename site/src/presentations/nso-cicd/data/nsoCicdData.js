/**
 * Workshop narrative aligned with the published guide:
 * https://moore-automation.github.io/DEVWKS-2618/
 */
import { NSO_GITLAB_CI } from './nsoGitlabCi.js';

const GUIDE = 'https://moore-automation.github.io/DEVWKS-2618/';
const GITLAB = 'http://devtools-gitlab.lab.devnetsandbox.local';
const GITLAB_SIGN_IN = `${GITLAB}/users/sign_in`;
const PROJECT = `${GITLAB}/developer/nso_cicd`;
const PIPELINES = `${PROJECT}/-/pipelines`;
const NSO_DEV = 'http://10.10.20.47:8080/login.html';
const NSO_PROD = 'http://10.10.20.48:8080/login.html';
const NSO_DEV_IP = '10.10.20.47';
const NSO_PROD_IP = '10.10.20.48';
const NSO_VERSION = '6.4.4';
const NSO_RC = `/opt/ncs/ncs-${NSO_VERSION}/ncsrc`;
const BRANCH = 'demo';
const LOOPBACK_TEMPLATE = 'packages/loopback/templates/loopback-template.xml';
const LOOPBACK_TEMPLATE_IDE = `${GITLAB}/-/ide/project/developer/nso_cicd/tree/${BRANCH}/-/${LOOPBACK_TEMPLATE}`;

const LOOPBACK_TEMPLATE_XML = `<config-template xmlns="http://tail-f.com/ns/config/1.0"
                 servicepoint="loopback">  
  <devices xmlns="http://tail-f.com/ns/ncs">  
    <!-- DEVICE -->
    <device>  
      <name>{/device}</name>  
      <config>  
        <!-- IOS -->
        <interface xmlns="urn:ios"> 
          <Loopback> 
            <name>{/loopback-intf}</name>
            <ip> 
              <address> 
                <primary> 
                  <address>{/ip-address}</address>
                  <mask>255.255.255.255</mask> 
                </primary> 
              </address> 
            </ip> 
          </Loopback> 
        </interface> 
        <!-- IOS-XR -->
        <interface xmlns="http://tail-f.com/ned/cisco-ios-xr"> 
          <Loopback> 
            <id>{/loopback-intf}</id>
            <ipv4> 
              <address> 
                <ip>{/ip-address}</ip>
                <mask>255.255.255.255</mask> 
              </address> 
            </ipv4> 
          </Loopback> 
        </interface>  
      </config> 
    </device> 
  </devices> 
</config-template>`;

const PRE_CHECK_ROBOT = `*** Settings ***
Documentation          This example demonstrates executing a command on multiple remote machines
...                    and getting their output.
...                    It also demonstrates saving the backup of multiple network devices.

Library                SSHLibrary
Library                OperatingSystem   
Suite Setup            Open Connections And Log In
Suite Teardown         Close All Connections

*** Variables ***
@{ROUTER_IPS}    10.10.20.177    10.10.20.178
\${USERNAME}      cisco
\${PASSWORD}      cisco
\${COMMAND}       show ip interface brief
\${BACKUP_DIR}    $PWD/backups

*** Test Cases ***
SSH Into Routers And Execute Command
    [Documentation]    Example test case to SSH into multiple routers and execute a command
    FOR    \${ROUTER_IP}    IN    @{ROUTER_IPS}
        \${output}=    Execute Command    \${COMMAND}
        Log    \${output}
    END

Network Configuration Backup
    [Documentation]  This test logs into multiple network devices, retrieves the configuration, and saves it to a file.
    [Tags]  complex
    \${BACKUP_DIR}=  Get Environment Variable  PWD
    \${BACKUP_DIR}=  Set Variable  \${BACKUP_DIR}/backups
    FOR    \${ROUTER_IP}    IN    @{ROUTER_IPS}
        \${config}  Execute Command  show running-config
        \${timestamp}  Get Time  epoch
        \${backup_file}  Set Variable  \${BACKUP_DIR}/config_\${ROUTER_IP}_\${timestamp}.txt
        Create File  \${backup_file}  \${config}
        OperatingSystem.File Should Exist  \${backup_file}
    END

*** Keywords ***
Open Connections And Log In
    FOR    \${ROUTER_IP}    IN    @{ROUTER_IPS}
        Open Connection     \${ROUTER_IP}
        Login               \${USERNAME}    \${PASSWORD}
    END`;

const RUNNER_PRE_REQS_CHECKS = `    - xmllint --noout packages/loopback/templates/loopback-template.xml
    - robot pre_check.robot`;

const COMPLIANCE_PY = `#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import requests
import base64
import os
import sys
import logging
import argparse
import urllib3
from typing import Optional

# Disable warnings for self-signed certificates
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)

def create_compliance_report(nso_url: str, user: str, pwd: str, device: str = "dev-dist-rtr01", report_name: str = "Loopback_report") -> Optional[requests.Response]:
    url = f"{nso_url}/restconf/data/tailf-ncs:compliance/"
    headers = {
        'Content-Type': 'application/yang-data+xml',
        'Accept': 'application/yang-data+json, application/yang-data+xml',
    }
    xml_data = f'''<compliance xmlns="http://tail-f.com/ns/ncs">
    <reports>
        <report>
            <name>{report_name}</name>
            <device-check>
                <device>{device}</device>
            </device-check>
            <service-check>
                <select-services>/services/loopback:loopback</select-services>
                <current-out-of-sync>true</current-out-of-sync>
            </service-check>
        </report>
    </reports>
</compliance>'''
    try:
        resp = requests.patch(
            url,
            headers=headers,
            data=xml_data,
            auth=(user, pwd),
            verify=False,
            timeout=15
        )
        if resp.ok:
            logging.info(f"[PATCH] Compliance report created: {resp.status_code}")
        else:
            logging.error(f"[PATCH] Failed to create compliance report: {resp.status_code}\\n{resp.text}")
            sys.exit(1)
        return resp
    except requests.RequestException as e:
        logging.error(f"[PATCH] Exception: {e}")
        sys.exit(1)

def run_compliance_report(nso_url: str, user: str, pwd: str, report_name: str = "Loopback_report", outformat: str = "html") -> Optional[requests.Response]:
    url = f"{nso_url}/restconf/data/tailf-ncs:compliance/reports/report={report_name}/run"
    headers = {
        'Content-Type': 'application/yang-data+xml',
        'Accept': 'application/yang-data+json',
    }
    run_data = f'''<input>\\n    <outformat>{outformat}</outformat>\\n</input>'''
    try:
        resp = requests.post(
            url,
            headers=headers,
            data=run_data,
            auth=(user, pwd),
            verify=False,
            timeout=15
        )
        if resp.ok:
            logging.info(f"[POST] Compliance report run: {resp.status_code}")
            print("\\n--- Compliance Report Output ---\\n")
            print(resp.text)
        else:
            logging.error(f"[POST] Failed to run compliance report: {resp.status_code}\\n{resp.text}")
            sys.exit(1)
        return resp
    except requests.RequestException as e:
        logging.error(f"[POST] Exception: {e}")
        sys.exit(1)

def parse_args():
    parser = argparse.ArgumentParser(description='NSO Compliance Report Utility')
    parser.add_argument('--nso_url', type=str, default=os.environ.get('NSO_DEV_IP', 'http://localhost:8080'), help='NSO server URL (e.g. http://10.10.20.47:8080)')
    parser.add_argument('--username', type=str, default=os.environ.get('NSO_DEV_USER', 'developer'), help='NSO username')
    parser.add_argument('--password', type=str, default=os.environ.get('NSO_DEV_PWD', 'C1sco12345'), help='NSO password')
    parser.add_argument('--device', type=str, default='dev-dist-rtr01', help='Device name for compliance check')
    parser.add_argument('--report_name', type=str, default='Loopback_report', help='Compliance report name')
    parser.add_argument('--outformat', type=str, default='html', help='Output format for compliance report')
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    logging.info("Starting NSO Compliance Report Utility...")
    create_compliance_report(
        nso_url=args.nso_url,
        user=args.username,
        pwd=args.password,
        device=args.device,
        report_name=args.report_name
    )
    run_compliance_report(
        nso_url=args.nso_url,
        user=args.username,
        pwd=args.password,
        report_name=args.report_name,
        outformat=args.outformat
    )
    logging.info("Compliance report process completed.")`;

const APPLY_PY = `#!/usr/bin/env python
# -*- coding:utf-8 -*-

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import json
import argparse
import base64
import urllib3

# Disable warnings for self-signed certificates
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def create_session_with_retries():
    """Create a requests session with automatic retry logic"""
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS", "POST", "PATCH", "PUT", "DELETE"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

def get_auth_header(username, password):
    auth_str = f'{username}:{password}'
    auth_bytes = auth_str.encode('ascii')
    auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
    return {
        'Content-Type': 'application/yang-data+json',
        'Authorization': f'Basic {auth_base64}',
        'Accept': 'application/yang-data+json'
    }

def apply_service(nso_url, device_name, username, password, loopback_intf=1166, ip_address="10.100.66.1"):
    payload = json.dumps({
        "loopback:loopback": [
            {
                "name": "loopback_service_1",
                "device": device_name,
                "loopback-intf": loopback_intf,
                "ip-address": ip_address
            }
        ]
    })
    url = f'{nso_url}/restconf/data/tailf-ncs:services/loopback:loopback'
    headers = get_auth_header(username, password)

    # Use session with retry logic for better reliability
    session = create_session_with_retries()

    try:
        response = session.patch(url, headers=headers, data=payload, verify=False, timeout=10)
        if response.status_code in [200, 201, 204]:
            print(f'✅ Successfully applied service to {device_name}')
            print(f'   Loopback{loopback_intf}: {ip_address}')
            print(f'   Status code: {response.status_code}')
        else:
            print(f'❌ Failed to apply service: {response.status_code}')
            print(f'   Response: {response.text}')
            exit(1)
    except requests.RequestException as e:
        print(f'❌ Error connecting to NSO: {e}')
        exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='NSO service management script')
    parser.add_argument('--nso_url', type=str, default='http://localhost:8080', help='NSO server URL')
    parser.add_argument('--device', type=str, default='ios-0', help='Device name')
    parser.add_argument('--username', type=str, default='developer', help='NSO username')
    parser.add_argument('--password', type=str, default='C1sco12345', help='NSO password')
    parser.add_argument('--loopback_intf', type=int, default=1166, help='Loopback interface number')
    parser.add_argument('--ip_address', type=str, default='10.100.66.1', help='Loopback IP address')
    args = parser.parse_args()

    apply_service(
        nso_url=args.nso_url,
        device_name=args.device,
        username=args.username,
        password=args.password,
        loopback_intf=args.loopback_intf,
        ip_address=args.ip_address
    )`;

const APPLY_SERVICE_CI = `apply-service:
  stage: deploy_feat
  extends: .base_job
  rules:
    - if: $CI_COMMIT_BRANCH != "main"
      when: manual
      allow_failure: true
  needs: [test-loopback-service]
  script:
    - echo "Apply IOS"
    - '"$PYATS_PYTHON" apply.py --nso_url "http://$NSO_DEV_IP:8080" --device "dev-dist-rtr01" --username "$NSO_DEV_USER" --password "$NSO_DEV_PWD"'
    - '"$PYATS_PYTHON" compliance.py --nso_url "http://$NSO_DEV_IP:8080" --username "$NSO_DEV_USER" --password "$NSO_DEV_PWD"'`;

const DUMMY_GITLAB_CI = `# Run pipelines on every branch and trigger (workshop lab)
workflow:
  rules:
    - when: always

# Define the stages of the pipeline
stages:
  - build
  - test
  - deploy_prod

# Pre-requisite checks — runs before all stages
runner pre-reqs:
  stage: .pre
  when: on_success
  script:
    - echo "(Pre-reqs) Checking the environment"

# Step to compile the package in the development NSO environment
package-compilation:
  stage: build
  when: on_success
  except:
    - main
  script:
    - echo "(Build) Loading and compiling packages in the NSO dev container"

# Step to load the compiled package into the testing NSO environment
package-load:
  stage: build
  when: on_success
  except:
    - main
  script:
    - echo "(Build) Loading compiled packages to testing env NSO"
  dependencies:
    - package-compilation

# Step to test the loopback service in the NSO testing environment
test-loopback-service:
  stage: test
  when: on_success
  except:
    - main
  script:
    - echo "(Test) Deploying service in the NSO test env"
  dependencies:
    - package-load

# Step to clean up the development environment
cleanup:
  stage: .post
  only:
    - main
  allow_failure: true
  script:
    - echo "(Cleanup) Removing files from NSO Dev"

# Step to load the package tarball onto production NSO
load-production:
  stage: deploy_prod
  when: on_success
  only:
    - main
  script:
    - echo "(Load) Copying tarball to production NSO"

# Step to deploy the package on the production NSO environment
deploy-production:
  stage: deploy_prod
  when: on_success
  only:
    - main
  script:
    - echo "(Deploy) Deploying package on production NSO"
  dependencies:
    - load-production`;

export const demoTasks = [
  {
    id: 'connectivity',
    title: 'Connectivity',
    order: 1,
    description:
      'Your proctor may already have you connected. If your VPN drops, use Access at the bottom of this page to reconnect.',
    whatWellDo: [
      'Scroll to Cisco Live US 2026 - Access at the bottom of this page',
      'Expand the section and copy the OpenConnect command for your assigned seat',
      'On your Ubuntu host, log in as devnet, paste into a terminal, and leave the session running while you work',
      {
        text: 'Confirm you can reach ',
        link: { label: 'GitLab', href: PROJECT },
        textAfter: ' in your browser before the next step',
      },
      'Lost connection? Expand Access again, copy your seat command, and reconnect',
    ],
    value: [
      'GitLab, NSO, and lab devices are only reachable over VPN (10.10.20.x)',
      'Access at the bottom of this page is your reconnect path for the whole workshop',
    ],
    goldenRules: [
      {
        text: 'Do not start later steps until ',
        link: { label: 'GitLab', href: PROJECT },
        textAfter: ' loads in your browser',
      },
      'If the tunnel drops, reconnect from Access before continuing; do not work offline',
    ],
    icon: 'network',
    color: 'cyan',
    expectedOutputImage: 'assets/gitlab-sign-in.png',
    expectedOutputImageAlt: 'GitLab Enterprise Edition sign-in page — confirms VPN and lab DNS are working',
  },
  {
    id: 'nso-verify',
    title: 'Sandbox Access & NSO',
    order: 2,
    description: 'Log into the NSO Development instance and connect all lab devices from the Devices tab.',
    tasksOrdered: true,
    whatWellDo: [
      {
        text: 'Log into the Network Service Orchestrator (NSO) ',
        link: { label: 'Development Instance', href: NSO_DEV },
        subItems: ['Username: developer', 'Password: C1sco12345'],
      },
      {
        text: 'Navigate to the Devices tab to view the devices.',
        subItems: [
          'Ensure all devices are operational and correctly onboarded to NSO: select each device and run the Connect action.',
        ],
      },
    ],
    icon: 'server',
    color: 'emerald',
    expectedOutputImage: 'assets/nso-devices.jpg',
    expectedOutputImageAlt: 'NSO Development Devices tab — all devices connected and operational',
  },
  {
    id: 'gitlab-bootstrap',
    title: 'Getting Started with Gitlab CI',
    order: 3,
    description:
      "Let's start by creating a dummy pipeline to get used to the GitLab interface.",
    tasksOrdered: true,
    whatWellDo: [
      {
        text: 'Log into the ',
        link: { label: 'GitLab Instance', href: GITLAB_SIGN_IN },
        subItems: ['Username: developer', 'Password: C1sco12345'],
      },
      {
        text: 'Create a new Project',
        subItems: [
          'Select Project from left navigation',
          'Create a Blank Project',
          {
            image: {
              src: 'assets/gitlab-projects-pane.png',
              alt: 'GitLab Projects pane — open Projects and click New project',
            },
          },
          'Create a project under the developer namespace',
          {
            image: {
              src: 'assets/gitlab-create-blank-project.png',
              alt: 'Create blank project — example under the developer namespace',
            },
          },
        ],
      },
      {
        text: 'Create a new test branch before opening the Web IDE',
        subItems: [
          'Open your project repository (Code → Repository)',
          'Click + and choose New branch under This repository',
          'Name your branch (for example Example) — main is protected in this lab',
        ],
        images: [
          {
            src: 'assets/gitlab-new-branch.png',
            alt: 'GitLab repository — + menu with New branch under This repository',
          },
        ],
      },
      'Enter the Web IDE by pressing ( . )',
      {
        text: 'Create a new file called .gitlab-ci.yml',
        images: [
          {
            src: 'assets/gitlab-webide-gitlab-ci.png',
            alt: 'Web IDE Explorer — .gitlab-ci.yml in the project',
          },
        ],
      },
    ],
    copyBlock: {
      intro: 'Copy the pre-made dummy pipeline into the text file:',
      buttonLabel: 'Copy dummy pipeline',
      content: DUMMY_GITLAB_CI,
    },
    afterCopyBlocks: [
      {
        text: 'Save and commit changes with an example commit message on your test branch.',
        image: {
          src: 'assets/gitlab-commit-push.png',
          alt: 'GitLab Web IDE — commit .gitlab-ci.yml with an example commit message',
        },
      },
      {
        text: 'Close the Web IDE tab and open the Pipelines pane from left navigation.',
        image: {
          src: 'assets/gitlab-pipelines-list.png',
          alt: 'GitLab Pipelines list — Passed pipeline on the example branch',
        },
      },
      {
        text: 'Select the status icon and inspect the pipeline jobs.',
        image: {
          src: 'assets/gitlab-pipeline-detail.png',
          alt: 'GitLab pipeline detail — pre, build, and test stages with passed jobs',
        },
      },
      {
        text: "Let's create a Merge Request by selecting the Repository pane from the left navigation.",
        subItems: [
          "Select Create Merge Request, review the options we have when creating a merge request and when happy hit 'Create Merge Request' at the bottom.",
          'On the merge request page, select Merge.',
        ],
        image: {
          src: 'assets/gitlab-create-merge-request.png',
          alt: 'GitLab Repository — Create merge request banner after pushing the example branch',
        },
      },
    ],
    icon: 'git-branch',
    color: 'indigo',
    expectedOutputText:
      "We've created our example project with a functioning pipeline and merged our changes into the main branch.",
    expectedOutputImage: 'assets/gitlab-mr-pipelines.png',
    expectedOutputImageAlt:
      'GitLab merge request — Pipelines tab showing passed branch and merge request pipelines',
  },
  {
    id: 'build-nso-pipeline',
    title: "Let's Build a Pipeline for NSO",
    order: 4,
    description:
      'Branch from nso_cicd, open the Web IDE, and update the loopback service template for IOS and IOS-XR.',
    tasksOrdered: true,
    whatWellDo: [
      {
        text: 'Open the ',
        link: { label: 'nso_cicd project', href: PROJECT },
      },
      'Create a new branch called demo',
      'Open the Web IDE by pressing ( . ) on the repository page',
      {
        text: 'Update ',
        link: { label: `/${LOOPBACK_TEMPLATE}`, href: LOOPBACK_TEMPLATE_IDE },
        textAfter: ' with the configuration below',
      },
    ],
    copyBlock: {
      intro: 'Paste into the template file (replace all existing contents):',
      buttonLabel: 'Copy loopback template',
      content: LOOPBACK_TEMPLATE_XML,
    },
    beforeLabel: 'Question',
    goldenRules: [
      'Why do we define different interface templates for IOS-XR and IOS-XE?',
    ],
    icon: 'git-branch',
    color: 'blue',
  },
  {
    id: 'update-pipeline',
    title: 'Update and Run the Feature Pipeline',
    order: 5,
    description:
      'Replace .gitlab-ci.yml with the full NSO pipeline, commit and push, then verify compile, reload, and pyATS loopback tests against NSO dev.',
    tasksOrdered: true,
    whatWellDo: [
      'Open .gitlab-ci.yml in the Web IDE on your demo branch',
      'Replace the entire file with the pipeline below',
    ],
    copyBlock: {
      buttonLabel: 'Copy NSO pipeline',
      content: NSO_GITLAB_CI,
    },
    afterCopyBlocks: [
      { text: 'Save, commit, and push to trigger the feature pipeline' },
      {
        text: {
          text: 'Check ',
          link: { label: 'Pipeline status', href: PIPELINES },
        },
      },
      { text: 'Confirm runner pre-reqs, package-compilation, package-load, test-loopback-service pass' },
      { text: 'Review test-xr.log and test-ios.log artifacts' },
    ],
    beforeLabel: 'Question',
    goldenRules: [
      'What was the outcome of the testing phase?',
      'Is the loopback service available in the development NSO instance?',
    ],
    icon: 'workflow',
    color: 'purple',
    expectedOutputText:
      'test-loopback-service passes with 4/4 pyATS tests and uploads test-xr.log and test-ios.log artifacts.',
    expectedOutputImage: 'assets/gitlab-test-loopback-pass.png',
    expectedOutputImageAlt:
      'GitLab job log — test-loopback-service passed with 100% pyATS success rate',
  },
  {
    id: 'pre-checks',
    title: 'Add Pre-Checks',
    order: 6,
    description:
      'Validate loopback XML with xmllint and back up router configs with Robot Framework in runner pre-reqs.',
    tasksOrdered: true,
    whatWellDo: ['Create pre_check.robot at the repo root :'],
    copyBlock: {
      buttonLabel: 'Copy pre_check.robot',
      content: PRE_CHECK_ROBOT,
    },
    afterCopyBlocks: [
      {
        text: "Add the below to 'runner pre-reqs'",
        copyBlock: {
          buttonLabel: 'Copy pre-check lines',
          content: RUNNER_PRE_REQS_CHECKS,
        },
      },
      {
        text: `Commit, push to ${BRANCH}, and re-run the pipeline`,
      },
    ],
    value: [
      'Catch invalid XML before any package reaches NSO',
      'Back up live router config with Robot Framework pre-checks',
    ],
    icon: 'shield',
    color: 'amber',
    expectedOutputText:
      'runner pre-reqs passes xmllint and robot pre_check.robot (2 tests, 2 passed).',
    expectedOutputImage: 'assets/gitlab-pre-checks-pass.png',
    expectedOutputImageAlt:
      'GitLab job log — runner pre-reqs passed with xmllint and Robot Framework pre-checks',
  },
  {
    id: 'apply-service',
    title: 'Apply the Service',
    order: 7,
    description:
      'Add apply.py and the apply-service job in deploy_feat (includes apply and compliance script steps).',
    tasksOrdered: true,
    whatWellDo: ['Create apply.py at the repo root:'],
    copyBlock: {
      buttonLabel: 'Copy apply.py',
      content: APPLY_PY,
    },
    afterCopyBlocks: [
      {
        text: 'Append the apply-service job below to .gitlab-ci.yml',
        copyBlock: {
          intro: 'Append to .gitlab-ci.yml:',
          buttonLabel: 'Copy apply-service job',
          content: APPLY_SERVICE_CI,
        },
      },
      { text: 'Save .gitlab-ci.yml in the Web IDE' },
    ],
    value: [
      'Move from “tests pass” to a service running on a real device',
      'Drive NSO via RESTCONF from a manual CI job when you are ready',
    ],
    icon: 'rocket',
    color: 'cyan',
  },
  {
    id: 'compliance',
    title: 'Compliance Reporting',
    order: 8,
    description:
      'Create compliance.py, then commit and push and run the manual apply-service job.',
    tasksOrdered: true,
    whatWellDo: ['Create compliance.py at the repo root:'],
    copyBlock: {
      buttonLabel: 'Copy compliance.py',
      content: COMPLIANCE_PY,
    },
    afterCopyBlocks: [
      {
        text: 'Save, commit, and push, then run apply-service (manual) after test-loopback-service passes',
      },
    ],
    value: [
      'Run NSO compliance reports as part of your deploy workflow',
      'Compare intended service config against what is on the device',
    ],
    icon: 'check-square',
    color: 'purple',
    expectedOutputText:
      'apply-service applies the loopback service, then compliance.py reports no-violation.',
    expectedOutputImage: 'assets/gitlab-compliance-pass.png',
    expectedOutputImageAlt:
      'GitLab job log — apply-service passed with compliance report no-violation',
  },
  {
    id: 'production-deploy',
    title: 'Deploy to Production',
    order: 9,
    description:
      'Merge to main after the feature pipeline passes; deliver artifact, manual deploy, verify on prod.',
    whatWellDo: [
      `Merge ${BRANCH} → main (only after feature pipeline is green)`,
      'On main: prepare-production-artifact fetches nso-package_loopback.tar.gz from dev',
      'Manually play deploy-to-production, then verify-production-deployment',
      {
        text: 'Confirm loopback package available on ',
        link: { label: 'NSO Production Instance', href: NSO_PROD },
      },
    ],
    value: [
      'Promote a tested tarball from NSO dev to NSO prod on main',
      'Use manual jobs as your production change-control gate',
    ],
    icon: 'server',
    color: 'purple',
    expectedOutputText:
      'main pipeline passes: pre-reqs, deliver, deploy-to-production, and verify-production-deployment.',
    expectedOutputImage: 'assets/gitlab-production-pipeline-pass.png',
    expectedOutputImageAlt:
      'GitLab pipeline — main branch passed with production deploy and verify stages',
  },
];

export const demoSteps = [
  ...demoTasks.map((t) => ({ type: 'task', taskId: t.id })),
  {
    type: 'outro',
    title: 'Workshop Complete',
    subtitle:
      'You built a GitLab NSO pipeline (pre-checks, build, test, apply, compliance) and promoted to production on main — per the published workshop guide.',
  },
];
