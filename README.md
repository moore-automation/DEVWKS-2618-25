# Homepage


## Introduction to the Project
---
Don't worry - you are not expecting to come up with a project from the ground up. Instead, we'll be working on a small sample project already built into the sandbox.

In this project, you will get to know the real benefits of NetDevOps by knowing open testing automation tools and you will be building your own setup and seeing how it works. The goal will be to create a complete environment that demonstrates the following benefits across the whole network:

**Automation Tools** 

* Set up a detailed testbed using pyATS, defining network topology and device specifics for automation.
* Extract network state information with pyATS parsers to facilitate analysis and decision-making.
* Gather comprehensive device configurations and operational data using pyATS device parsers.
* Design and implement focused tests to verify network elements and their interactions.
* Use Robot Framework for creating basic automation scripts to handle repetitive, non-network tasks.
* Develop and run network-specific test scripts to ensure the reliability and performance of the network.
* Integrate Robot Framework for advanced testing capabilities on NSO and network devices.

**NSO CI/CD Pipelines** 

* Track the status of network configurations at any point in time
* Track who proposed and approved each specific configuration change
* Provide visibility on what are the differences of configurations at any point in time vs a previous situation
* Enable rollback to any previous moment
* Provide syntax-checking capabilities for network changes in your own local workstation
* Automate the deployment of any proposed change across different environments (eg. testing, staging, production)
* Model simulated virtual environments to test proposed changes before going to production
* Define and run the required tests set and passing criteria, both in testing and production, before accepting a change as successful
* Automatically rollback any proposed configuration that does not pass the tests set

---
These are the building blocks we will use to provide such a comprehensive demonstration

* [Gitlab](https://about.gitlab.com/): Version Control Server (VCS) with integration capabilities to provide automated pipelines.
* [Cisco Network Services Orchestrator](https://developer.cisco.com/site/nso/): Formerly Tail-f, it provides end-to-end automation to design and deliver services much faster.
* [pyATS](https://developer.cisco.com/pyats/): Automation tool to perform stateful validation of network devices operational status with reusable test cases.
* [CML](https://www.cisco.com/c/en/us/products/cloud-systems-management/modeling-labs/index.html): Formerly VIRL, provides a network modeling and simulation environment.
* [Robot](https://robotframework.org/): Open source automation framework for test automation and robotic process automation (RPA).



## Prerequisites
---
To follow this Workshop, you should have these things:

- VPN Client for connection to dCloud (Cisco Secure Client)

## The project
---

## Lab Topology 
---
Here's a brief outline of the dCloud setup we'll use for this lab:

- **Access:** You'll connect through a Cisco Secure Client VPN, with details provided by your breakout proctor.
- **Network Setup:** We have two Cisco Modeling Labs (CML) environments. One simulates the live network, and the other is for testing.
Production NSO: This is the primary NSO deployment that manages the network devices within the CML.
- **Developer Workstation (DevBox):** A Linux VM designated for developing new services, running tests, and initiating pipelines.
- **Developer Tools (DevTools):** Another Linux VM equipped with various tools needed for the lab activities.

![Lab Topology](assets/topology_lab.jpg)
