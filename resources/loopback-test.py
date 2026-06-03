from pyats import aetest
import requests
import json
import argparse
import base64
import sys
import urllib3

# Disable warnings for self-signed certificates
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

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

# Test state tracking
class TestState:
    """Shared state to track test failures across test cases"""
    failed = False

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
                TestState.failed = True
                step.failed(f'Failed to sync: {response.status_code} {response.text}')

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
                TestState.failed = True
                step.failed(f'Failed to apply service: {response.status_code} {response.text}')

class DeleteService(aetest.Testcase):
    @aetest.test
    def delete_service(self, steps):
        # Delete the loopback service configuration from the specified device
        with steps.start('Deleting service from device') as step:
            url = f'{NSO_URL}/restconf/data/tailf-ncs:services/loopback:loopback=loopback_service_1'
            # DELETE requests don't need a payload
            response = requests.delete(url, headers=HEADERS)
            if response.status_code in [200, 201, 204]:
                step.passed('Successfully deleted service from the device')
            else:
                TestState.failed = True
                step.failed(f'Failed to delete service: {response.status_code} {response.text}')

if __name__ == '__main__':
    aetest.main()
    # Check if any test failed and exit with a non-zero status
    if TestState.failed:
        print('\n❌ One or more tests failed')
        sys.exit(1)
    else:
        print('\n✅ All tests passed')
        sys.exit(0)