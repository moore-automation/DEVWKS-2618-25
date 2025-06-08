# Applying Our Service

Now that we've added some basic tests, let's move straight into deploying our service!

## Task 6: Apply the NSO Service

??? note "**Reminder:** RESTCONF"
    Cisco NSO uses RESTCONF to provide a standardized, RESTful API interface for interacting with network configurations and services.
    
    - RESTCONF is a RESTful protocol for accessing and manipulating network configuration data defined in YANG models.
    - It provides a standardized HTTP-based interface for retrieving, configuring, and monitoring network settings.
    - Utilizes standard HTTP methods (GET, POST, PUT, DELETE) for operations and supports JSON or XML for data representation.
    - Aims to simplify network management with consistent interaction across diverse network elements.

Below is a basic Python script to apply the service to the device `dev-dist-rtr01`. Please create a file named `apply.py` within the `nso_cicd` directory and copy the following contents into it. This script authenticates with the NSO development instance and applies the loopback service with a statically defined address of `10.100.66.1`. (Note: In a real-world scenario, using a static address like this could cause conflicts!)

```python
#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import requests
import json
import argparse
import base64

# Disable warnings for self-signed certificates
requests.packages.urllib3.disable_warnings()

# Argument parser setup
parser = argparse.ArgumentParser(description='NSO service management script')
parser.add_argument('--nso_url', type=str, default='http://localhost:8080', help='NSO server URL')
parser.add_argument('--device', type=str, default='ios-0', help='Device name')
parser.add_argument('--username', type=str, default='developer', help='NSO username')
parser.add_argument('--password', type=str, default='C1sco12345', help='NSO password')
args = parser.parse_args()

NSO_URL = args.nso_url
DEVICE_NAME = args.device
USERNAME = args.username
PASSWORD = args.password

# Encode username and password for the authorization header
auth_str = f'{USERNAME}:{PASSWORD}'
auth_bytes = auth_str.encode('ascii')
auth_base64 = base64.b64encode(auth_bytes).decode('ascii')

HEADERS = {
    'Content-Type': 'application/yang-data+json',
    'Authorization': f'Basic {auth_base64}',
    'Accept': 'application/yang-data+json'
}

# Define the service payload
def apply_service():
    payload = json.dumps({
        "loopback:loopback": [
            {
                "name": "loopback_service_1",
                "device": DEVICE_NAME,
                "loopback-intf": 1166,
                "ip-address": "10.100.66.1"
            }
        ]
    })
    url = f'{NSO_URL}/restconf/data/tailf-ncs:services/loopback:loopback'
    response = requests.request("PATCH", url, headers=HEADERS, data=payload)
    if response.status_code in [200, 201, 204]:
        print('Successfully applied service to device')
        print(response.status_code)
    else:
        print(f'Failed to apply service: {response.status_code} {response.text}')

if __name__ == "__main__":
    apply_service()
```

## Task 7: Update the Pipeline to Apply the Service

Next, let's add a task to the pipeline to apply the service to `dev-dist-rtr01`. Update your pipeline as shown below:

```yaml
apply_service-📦:
  stage: deliver
  when: on_success
  script:
    - echo "Apply IOS"
    - python3 nso_cicd/apply.py --nso_url "http://$NSO_DEV_IP:8080" --device "dev-dist-rtr01" --username $NSO_DEV_USER --password $NSO_DEV_PWD
```

!!! question "Has the configuration been applied to the device correctly?"