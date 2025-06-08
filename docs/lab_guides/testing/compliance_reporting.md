# Compliance Reporting

An important step in gaining acceptance of newly automated processes is providing visibility and assurance of their success. NSO Compliance Reporting is a feature within Cisco NSO that helps network operators assess and ensure that network device configurations adhere to predefined policies and standards. It enables automated auditing and reporting on compliance status across network elements, making it easier to identify and remediate configuration drift and inconsistencies in a timely manner.

To get started, create a Python script in the `nso_cicd/` folder named `compliance.py` using the code provided below. Then, add the following line to your GitLab CI pipeline to execute the script after the apply script in the `apply_service` job.

```python
#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import requests
import base64
import os
import sys
import logging
import argparse
from typing import Optional

# Disable warnings for self-signed certificates
requests.packages.urllib3.disable_warnings()

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
            logging.error(f"[PATCH] Failed to create compliance report: {resp.status_code}\n{resp.text}")
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
    run_data = f'''<input>\n    <outformat>{outformat}</outformat>\n</input>'''
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
            print("\n--- Compliance Report Output ---\n")
            print(resp.text)
        else:
            logging.error(f"[POST] Failed to run compliance report: {resp.status_code}\n{resp.text}")
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
    logging.info("Compliance report process completed.")
```

Add the following line to your `.gitlab-ci.yml` file to run the compliance check after applying the service:

```yaml
- python nso_cicd/compliance.py --nso_url "http://$NSO_DEV_IP:8080" --username $NSO_DEV_USER --password $NSO_DEV_PWD
```

Commit your changes. Congratulations—you've completed the workshop!