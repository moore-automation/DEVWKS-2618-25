# Compliance Reporting 


An important step to gaining acceptance of newly automated processes is visibility and assurance of the processes success. NSO Compliance Reporting is a feature within Cisco NSO that helps network operators assess and ensure network device configurations adhere to predefined policies and standards. It enables automated auditing and reporting on compliance status across network elements, facilitating timely identification and remediation of configuration drift and inconsistencies.

Create a shell script in the ``nso_cicd/` folder named `compliance.sh` using the code provided below, then add the below line to the gitlab ci to be executed after the apply script in the apply_service job.
 

```bash
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
```

```yaml
sh nso_cicd/compliance.sh
```

Commit your changes and congratulations you've completed the workshop!