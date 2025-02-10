# Pre-commit Checks

There are many types of testing we can perform within our pipelines, in this section we're going to add some basic xml linting to catch any unwanted typos, check connectivity to our devices and perform a config backup. The actual function isn't too important here, more to make it clear the functions of the different tools and their associated benefits and drawbacks.

!!! note "**Reminder:** What are some common testing types?"

    **Semantic Testing**

    -  Semantic testing ensures that the network configurations and automation scripts achieve the intended network behavior and meet design specifications. This involves validating that the IaC scripts correctly configure network elements like routers, switches, and firewalls to deliver expected outcomes, such as correct routing, security policies, and connectivity. ***Example:*** Using **NSO Compliance Reporting** to check our services are correctly applied and our devices are in sync. 

    **Syntactical Testing**

    - Syntactical testing ensures that configuration scripts and templates conform to the syntax rules of the tools and avoid syntax errors such as incorrect indentation in YAML files or missing parameters in command-line interfaces. ***Example:*** Using **xmllint** to make sure our template xml's are free from typos.

    **Environmental Testing** - *(Out of scope of this workshop)*

    - Environmental testing verifies that the network configurations work correctly across different network environments and hardware platforms. Simulations or staging environments that mimic production are used to test configurations under various conditions, such as different network topologies, device models, and firmware versions. ***Example:*** Testing a deployment in a lab environment that replicates the production setup to ensure it will perform correctly when deployed live.


## Task 6: Add linting to pipeline

???note "**Reminder:*** What is xmllint"
    xmllint is a command-line XML tool used for parsing and validating XML documents, ensuring they are well-formed and adhere to their associated XML Schema Definition (XSD) or Document Type Definition (DTD). It also offers capabilities for formatting, querying, and extracting data from XML files, making it a versatile utility for XML manipulation and debugging.

Pre-commits are a handy feature where we can test aspects of our code before the commit is executed. We use this for adding sshpass to the runner as an additional tool to the standard build. The code below performs a syntax check of our loopback template without any output upon success. Add it to our existing .pre stage or create a new job to execute the command. 
```yml    
- xmllint --noout nso_cicd/packages/loopback/templates/loopback-template.xml
```

## Task 7: Create a Robot Framework test

Robot Framework is an open-source automation framework designed for acceptance testing and robotic process automation (RPA). It uses a keyword-driven approach to create readable and reusable test cases and supports various external libraries for testing different types of applications and systems. We're going to use it to run some show commands and perform a config backup. 


Create a robot file in the ``nso_cicd/` folder named `pre_check.robot` using the code provided below then add the below line to the gitlab ci to be executed after the linting step above


```robotframework

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
```


```yml
- python3 -m robot nso_cicd/pre_check.robot
```

!!!question "What was the outcome of the .pre stage.?"