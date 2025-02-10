from ats import aetest
import requests
import json
import argparse
import base64
import sys

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

# Flag to indicate if any test failed
any_test_failed = False

class CommonSetup(aetest.CommonSetup):
    @aetest.subsection
    def connect_to_nso(self):
        # Connect to NSO and store the connection details
        self.nso_url = NSO_URL
        self.username = USERNAME
        self.password = PASSWORD

class SyncFromDevice(aetest.Testcase):
    @aetest.test
    def sync_from_device(self, steps):
        # Sync configuration from the specified device to NSO
        with steps.start('Syncing from device to NSO') as step:
            payload = ""
            url = f'{NSO_URL}/restconf/data/tailf-ncs:devices/device={DEVICE_NAME}/sync-from'
            response = requests.request("POST", url, headers=HEADERS, data=payload)
            if response.status_code == 200:
                step.passed('Successfully synced from device to NSO')
            else:
                step.failed(f'Failed to sync: {response.status_code} {response.text}')
                any_test_failed = True

class ApplyService(aetest.Testcase):
    @aetest.test
    def apply_service(self, steps):
        # Apply the loopback service configuration to the specified device
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
        with steps.start('Applying service to device') as step:
            url = f'{NSO_URL}/restconf/data/tailf-ncs:services/loopback:loopback'
            response = requests.request("PATCH", url, headers=HEADERS, data=payload)
            if response.status_code in [200, 201, 204]:
                step.passed('Successfully applied service to device')
                print(response.status_code)
            else:
                step.failed(f'Failed to apply service: {response.status_code} {response.text}')
                any_test_failed = True

class DeleteService(aetest.Testcase):
    @aetest.test
    def delete_service(self, steps):
        # Delete the loopback service configuration from the specified device
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
        with steps.start('Deleting service from device') as step:
            url = f'{NSO_URL}/restconf/data/tailf-ncs:services/loopback:loopback=loopback_service_1'
            response = requests.request("DELETE", url, headers=HEADERS, data=payload)
            if response.status_code in [200, 201, 204]:
                step.passed('Successfully deleted service from the device')
            else:
                step.failed(f'Failed to delete service: {response.status_code} {response.text}')
                any_test_failed = True

if __name__ == '__main__':
    aetest.main()
    # Check if any test failed and exit with a non-zero status
    if any_test_failed:
        sys.exit(1)
    else:
        sys.exit(0)