#!/usr/bin/env python
# -*- coding:utf-8 -*-

import requests
import json
import argparse
import base64

# Disable warnings for self-signed certificates
requests.packages.urllib3.disable_warnings()

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
    try:
        response = requests.patch(url, headers=headers, data=payload, verify=False, timeout=10)
        if response.status_code in [200, 201, 204]:
            print('Successfully applied service to device')
            print(f'Status code: {response.status_code}')
        else:
            print(f'Failed to apply service: {response.status_code} {response.text}')
            exit(1)
    except requests.RequestException as e:
        print(f'Error connecting to NSO: {e}')
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
