---
hide:
  - navigation
---
# **Homepage** { style="text-align: center;" }

---
Welcome! You don't need to create a project from scratch for this workshop. Instead, we'll work with a sample repository from the updated NSO Sandbox.

In this project, you'll discover the real benefits of NetDevOps by exploring open-source testing and automation tools. You'll build your own setup and see how implementing CI/CD concepts can improve the quality and reliability of deployments through thorough testing and version control.

### **Section 1:** Introduction to CI/CD, Automation, and NSO Verification
In this section, we'll introduce key concepts such as Continuous Integration and Continuous Deployment (CI/CD), automation, and the basics of NSO (Network Services Orchestrator). We'll also discuss source version control, focusing on GitLab.

### **Section 2:** CI/CD Pipelines with NSO
Here, we'll dive into the concept of a CI/CD pipeline. You'll learn how to create, execute, and trigger automated processes, and see how CI/CD pipelines can be used for developing and deploying NSO service packages.

### **Section 3:** Automated Testing
This section covers the role of automated testing within the CI/CD pipeline. We'll demonstrate how to implement automated tests for NSO service packages using Robot Framework and basic pre-commit checks, ensuring they meet requirements and function correctly before deployment.


---
## **Lab Topology**  { style="text-align: center;" }
---
Here's a brief overview of the dCloud setup used in this lab:

- **Access:** Connect using Cisco Secure Client VPN. Details are provided on the access page.
- **Network Setup:** Two Cisco Modeling Labs (CML) environments are available—one simulates the live network, and the other is for testing.
- **Production NSO:** The main NSO deployment manages network devices within the CML.
- **Developer Workstation (DevBox):** A Linux VM for developing new services, running tests, and initiating pipelines.
- **Developer Tools (DevTools):** Another Linux VM equipped with various tools needed for lab activities.
- **NSO Instances:** Two NSO 6.4.4 instances serve as development and production environments.

![Lab Topology](assets/topology_lab.jpg)
