# Applying our Service

Now we've added some simple tests we're going to go straight into deploying our Service!

## Task 6: Apply NSO Service 

!!!note "**Reminder:** RESTCONF"
    Cisco NSO uses RESTCONF to provide a standardized, RESTful API interface for interacting with network configurations and services.
    
	  -	RESTCONF is a RESTful protocol for accessing and manipulating network configuration data defined in YANG models.
	  -	It provides a standardized HTTP-based interface for retrieving, configuring, and monitoring network settings.
	  -	Utilizes standard HTTP methods (GET, POST, PUT, DELETE) for operations and supports JSON or XML for data representation.
	  -	Aims to simplify network management with consistent interaction across diverse network elements.

Below we've provided a basic python script to apply the service to our chosen device 'dev-dist-rtr01' - please create a file `apply.py` within the `nso_cicd` directory with the below contents. In the below file we're authenticating with the NSO development instance and applying the loopback service with a statically defined address of 10.100.66.1 - this will of course cause us some issues in the real-world!

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
def apply_service( ):
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

## Task 7: Update Pipeline to apply 

Next we're going to add the task of applying the service to `dev-dist-rtr01' - update the pipelin to apply the service as below:


```yml
apply_service-📦:
  stage: deliver
  when: on_success
  script:
    - echo "Apply IOS"
    - python3 nso_cicd/apply.py --nso_url "http://$NSO_DEV_IP:8080" --device "dev-dist-rtr01" --username $NSO_DEV_USER --password $NSO_DEV_PWD
```

!!!question "Has the configuration been applied to the device correctly?"