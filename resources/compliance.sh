#!/bin/bash


# First curl command to create the compliance report
curl -u $NSO_DEV_USER:$NSO_DEV_PWD --location --insecure --request PATCH "http://$NSO_DEV_IP:8080/restconf/data/tailf-ncs:compliance/" \
    --header 'Content-Type: application/yang-data+xml' \
    --header 'Accept: application/yang-data+json' \
    --header 'Accept: application/yang-data+xml' \
    --data-raw "<compliance xmlns=\"http://tail-f.com/ns/ncs\">
                    <reports>
                        <report>
                        <name>Loopback_report</name>
                        <device-check>
                            <device>dev-dist-rtr01</device>
                        </device-check>
                        <service-check>
                            <select-services>/services/loopback:loopback</select-services>
                            <current-out-of-sync>true</current-out-of-sync>
                        </service-check>
                        </report>
                    </reports>
                    </compliance>"

curl -u $NSO_DEV_USER:$NSO_DEV_PWD --location --globoff "http://$NSO_DEV_IP:8080/restconf/data/tailf-ncs:compliance/reports/report=Loopback_report/run" \
--header 'Content-Type: application/yang-data+xml' \
--header 'Authorization: Basic YWRtaW46YWRtaW4=' \
--header 'Accept: application/yang-data+json' \
--data '<input>
    <outformat>html</outformat>
</input>'
