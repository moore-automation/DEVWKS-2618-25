*** Settings ***
Documentation          This example demonstrates executing a command on multiple remote machines
...                    and getting their output.
...                    It also demonstrates saving the backup of multiple network devices.

Library                SSHLibrary
Library                OperatingSystem   
Suite Setup            Open Connections And Log In
Suite Teardown         Close All Connections

*** Variables ***
@{ROUTER_IPS}    10.10.20.177    10.10.20.178
${USERNAME}      cisco
${PASSWORD}      cisco
${COMMAND}       show ip interface brief
${BACKUP_DIR}    $PWD/backups

*** Test Cases ***
SSH Into Routers And Execute Command
    [Documentation]    Example test case to SSH into multiple routers and execute a command
    FOR    ${ROUTER_IP}    IN    @{ROUTER_IPS}
        ${output}=    Execute Command    ${COMMAND}
        Log    ${output}
    END

Network Configuration Backup
    [Documentation]  This test logs into multiple network devices, retrieves the configuration, and saves it to a file.
    [Tags]  complex
    ${BACKUP_DIR}=  Get Environment Variable  PWD
    ${BACKUP_DIR}=  Set Variable  ${BACKUP_DIR}/backups
    FOR    ${ROUTER_IP}    IN    @{ROUTER_IPS}
        ${config}  Execute Command  show running-config
        ${timestamp}  Get Time  epoch
        ${backup_file}  Set Variable  ${BACKUP_DIR}/config_${ROUTER_IP}_${timestamp}.txt
        Create File  ${backup_file}  ${config}
        OperatingSystem.File Should Exist  ${backup_file}
    END

*** Keywords ***
Open Connections And Log In
    FOR    ${ROUTER_IP}    IN    @{ROUTER_IPS}
        Open Connection     ${ROUTER_IP}
        Login               ${USERNAME}    ${PASSWORD}
    END
