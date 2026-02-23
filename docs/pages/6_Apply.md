# Applying Our Service

Now that we've added some basic tests, let's move straight into deploying our service!

## Task 8: Apply the NSO Service

??? note "**Reminder:** RESTCONF"
    Cisco NSO uses RESTCONF to provide a standardized, RESTful API interface for interacting with network configurations and services.

    `<div class="card" markdown>`

    - RESTCONF is a RESTful protocol for accessing and manipulating network configuration data defined in YANG models.
    - It provides a standardized HTTP-based interface for retrieving, configuring, and monitoring network settings.
    - Utilizes standard HTTP methods (GET, POST, PUT, DELETE) for operations and supports JSON or XML for data representation.
    - Aims to simplify network management with consistent interaction across diverse network elements.

    `</div>`

Below is a basic Python script to apply the service to the device `dev-dist-rtr01`.

Please create a file named `apply.py` within the `nso_cicd` directory and copy the following contents into it.
{: .instruction }

 This script authenticates with the NSO development instance and applies the loopback service with a statically defined address of `10.100.66.1`. (Note: In a real-world scenario, using a static address like this could cause conflicts!)

```python
#!/usr/bin/env python
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
    )

```

## Task 9: Update the Pipeline to Apply the Service

<div class="instruction" markdown>

Next, let's add a task to the pipeline to apply the service to `dev-dist-rtr01`. Update your pipeline as shown below:

</div>

```yaml
apply-service:
  stage: deploy_feat
  when: on_success
  rules:
    - if: $CI_COMMIT_BRANCH != "main"
      when: manual
      allow_failure: true
  script:
    - echo "Apply IOS"
    - python nso_cicd/apply.py --nso_url "http://$NSO_DEV_IP:8080" --device "dev-dist-rtr01" --username $NSO_DEV_USER --password $NSO_DEV_PWD
  needs: [test-loopback-service]
```

!!! question "Has the configuration been applied to the device correctly?"

---
