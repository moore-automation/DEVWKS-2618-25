# Pipeline-Driven NSO Service Development
---
After understanding the concept of a pipeline and its stages, we'll move on to modifying the NSO package service in the `nso_cicd/packages/loopback` directory. Our GitLab CI/CD pipeline will automate the verification process by compiling the package and performing a compatibility (smoke) test with the current NSO version.

The pipeline will also automate the deployment of the package service in the NSO development environment and run tests using Python and PyATS. Once all pipeline stages complete successfully, you can confidently deploy the changes to the production environment.

## Task 3: Create a Test Branch

??? info "**Reminder:** What is a branch?"
    
    In Git, a branch is a lightweight, movable pointer to a commit. Branches allow you to create separate lines of development within a repository, enabling you to work on different features, bug fixes, or experiments simultaneously without affecting the main codebase. Branches are central to most version control workflows, making parallel development and collaboration easy. Developers can experiment and innovate without disrupting stable code.
    
    **Key Concepts:**
    - **Default Branch:** The main line of development, usually called `main` or `master`.
    - **Feature Development:** Create new branches for each feature, bug fix, or task. This isolates changes from the main branch until they're ready to be merged.
    - **Branch Creation:** Use `git branch` or `git checkout -b` to create and switch to a new branch.
    - **Switching Branches:** Use `git checkout` to switch between branches.
    - **Merging:** Once work is complete and tested, merge the branch back into another branch (typically `main`) using `git merge`.
    - **Collaboration:** Multiple developers can work on their own branches and merge changes into shared branches as needed.

Creating a test branch allows you to make changes safely without impacting the production NSO service package stored in the main branch. By committing and pushing changes to this test branch in GitLab, the pipeline will automatically compile, test, and deploy the NSO package to the development environment and execute the test scripts. You can then review the pipeline's pass/fail status to ensure your changes are successful.

![Test Branch Creation](../../assets/create_test_branch.jpg)

You should now have a new branch called `package_dev_demo` and be working on that branch.

## Task 4: Update the NSO Loopback Template

??? info  "**Reminder:** What is a template, and how is it different from a model?"

    YANG models and templates together enable full lifecycle management of network services—from design and deployment to monitoring and troubleshooting. This combination allows network operators to define services once and deploy them consistently across diverse network environments, scaling operations efficiently. YANG models and templates are integral to NSO's automation capabilities, allowing for rapid deployment and modification of network services, and reducing the need for manual intervention.
    
    **Key Concepts:**
    - **Configuration Generation:** Templates in NSO generate device-specific configuration snippets from the abstract service definitions provided by YANG models.
    - **Device-Specific Customization:** While YANG models define the abstract structure, templates handle the nuances of various device types and vendors, allowing NSO to push the correct configurations to different devices.
    - **Separation of Concerns:** Templates separate service logic from device-specific syntax, making maintenance and updates easier.
    - **Reusable Components:** Templates can be reused across different services, promoting consistency and reducing duplication.

To complete the development of the Loopback service and ensure all tests pass, modify the file `loopback-template.xml` located in `/nso_cicd/packages/loopback/templates`. Include the XML configurations as specified below, making sure they match exactly:

!!! question "Question: Why do we need to define different interface templates for IOS and IOS XR?"

```xml
<config-template xmlns="http://tail-f.com/ns/config/1.0"
                 servicepoint="loopback">  
  <devices xmlns="http://tail-f.com/ns/ncs">  
    <!-- DEVICE -->
    <device>  
      <name>{/device}</name>  
      <config>  
        <!-- IOS -->
        <interface xmlns="urn:ios"> 
          <Loopback> 
            <name>{/loopback-intf}</name>
            <ip> 
              <address> 
                <primary> 
                  <address>{/ip-address}</address>
                  <mask>255.255.255.255</mask> 
                </primary> 
              </address> 
            </ip> 
          </Loopback> 
        </interface> 
        <!-- IOS-XR -->
        <interface xmlns="http://tail-f.com/ned/cisco-ios-xr"> 
          <Loopback> 
            <id>{/loopback-intf}</id>
            <ipv4> 
              <address> 
                <ip>{/ip-address}</ip>
                <mask>255.255.255.255</mask> 
              </address> 
            </ipv4> 
          </Loopback> 
        </interface>  
      </config> 
    </device> 
  </devices> 
</config-template>
```

## Task 5: Update the GitLab Pipeline

Now it's time to make our pipeline actually do something! For this workshop, we'll use a pipeline to package an NSO loopback service, perform validation, and apply the service to a device.

To enhance practicality and efficiency, you can replace your CI file with the pipeline below and commit the changes. Don't worry too much about the details of each task; if we have time at the end, we can revisit the functions.

!!! question "Question: Which stages will run when making changes in our test pipeline?"

```yaml linenums="1" title="Gitlab runner .gitlab-ci.yml"
include:
  - '/nso_cicd/pipeline_utils/environments.yml'

# Define the stages of the pipeline
stages:
  - build
  - test
  - deliver
  - deploy_prod

runner pre-reqs:
  stage: .pre
  when: on_success
  script:
    - echo "(Pre-reqs) Checking the environment"
    - python --version
    - pipx install robotframework-sshlibrary --include-deps --force
    - sshpass -p "$NSO_DEV_PWD" ssh -o StrictHostKeyChecking=no $NSO_DEV_USER@$NSO_DEV_IP "echo 'NSO Dev Environment Accessible'"
    - sshpass -p "$NSO_PROD_PWD" ssh -o StrictHostKeyChecking=no $NSO_DEV_USER@$NSO_PROD_IP "echo 'NSO Prod Environment Accessible'"

# Step to compile the package in the development NSO environment
package-compilation-🔨:
  stage: build
  when: on_success
  except:
    - main
  script:
    - echo "(Build 🔨) Loading and compiling packages in the NSO dev container"
    - sshpass -p "$NSO_DEV_PWD" scp -o StrictHostKeyChecking=no -r nso_cicd/packages/$PACKAGE $NSO_DEV_USER@$NSO_DEV_IP:/home/developer/$PACKAGE
    - sshpass -p "$NSO_DEV_PWD" ssh -o StrictHostKeyChecking=no $NSO_DEV_USER@$NSO_DEV_IP "
        cd /home/developer/ &&
        cp -r $PACKAGE /nso/run/packages &&
        source /opt/ncs/ncs-6.4.4/ncsrc &&
        cd /nso/run/packages/$PACKAGE/src &&
        make clean &&
        make &&
        cd /nso/run/packages &&
        tar -czvf /home/developer/nso-package_$PACKAGE.tar.gz $PACKAGE"

# Step to load the compiled package into the testing NSO environment
package-load-📥:
  stage: build
  when: on_success
  except:
    - main
  script:
    - echo "(Build 📥) Loading compiled packages to testing env NSO"
    # SSH into the NSO development environment and reload the package
    - sshpass -p "$NSO_DEV_PWD" ssh -o StrictHostKeyChecking=no $NSO_DEV_USER@$NSO_DEV_IP "
      source /opt/ncs/ncs-6.4.4/ncsrc &&
      echo 'packages reload' | ncs_cli -Cu admin"
  dependencies:
    - package-compilation-🔨

# Step to test the loopback service in the NSO testing environment
test-loopback-service-🕵🏽:
  stage: test
  when: on_success
  except:
    - main
  script:
    - echo "(Test 🕵🏽) Deploying service in the NSO test env"
    # Test the service on an IOS-XR device
    - echo "Test IOS-XR"
    - cd nso_cicd/tests/loopback-test && python loopback-test.py --nso_url "http://$NSO_DEV_IP:8080" --device "dev-core-rtr01" --username $NSO_DEV_USER --password $NSO_DEV_PWD
    # Test the service on an IOS device
    - echo "Test IOS"
    - python loopback-test.py --nso_url "http://$NSO_DEV_IP:8080" --device "dev-dist-rtr01" --username $NSO_DEV_USER --password $NSO_DEV_PWD
  dependencies:
    - package-load-📥

# Step to clean up the development environment
cleanup-🗑️:
  stage: .post
  only:
    - main
  allow_failure: true
  script:
    - echo "(Cleanup 🗑️) Removing files from NSO Dev"
    # SSH into the NSO development environment and remove the package files
    - sshpass -p "$NSO_DEV_PWD" ssh -o StrictHostKeyChecking=no $NSO_DEV_USER@$NSO_DEV_IP "
      rm -rf $PACKAGE &&
      rm -rf cd /nso/run/packages/$PACKAGE &&
      source /opt/ncs/ncs-6.4.4/ncsrc && echo 'packages reload force' | ncs_cli -Cu admin"

# Step to load the package tarball onto the production NSO environment
load-production-📦:
  stage: deploy_prod
  when: on_success
  only:
    - main
  script:
    - echo "(Load📦) Copying tarball to production NSO."
    - sshpass -p "$NSO_DEV_PWD" scp -o StrictHostKeyChecking=no $NSO_DEV_USER@$NSO_DEV_IP:/home/developer/nso-package_$PACKAGE.tar.gz .
    - sshpass -p "$NSO_PROD_PWD" scp -o StrictHostKeyChecking=no nso-package_$PACKAGE.tar.gz $NSO_DEV_USER@$NSO_PROD_IP:/home/developer/

# Step to deploy the package on the production NSO environment
deploy-production-📬:
  stage: deploy_prod
  when: on_success
  only:
    - main
  script:
    - echo "(Deploy📬) Deploying package on production NSO."
    - sshpass -p "$NSO_PROD_PWD" ssh -o StrictHostKeyChecking=no $NSO_DEV_USER@$NSO_PROD_IP "
        cd /home/developer/ &&
        tar -xvf nso-package_$PACKAGE.tar.gz &&
        rm -rf nso-package_$PACKAGE.tar.gz &&
        cp -r $PACKAGE /nso/run/packages/loopback &&
        source /opt/ncs/ncs-6.4.4/ncsrc &&
        cd /nso/run/packages/$PACKAGE/src &&
        make clean &&
        make &&
        echo 'packages reload' | ncs_cli -Cu admin"
  dependencies:
    - load-production-📦

retry: 2
```
> **Note:** For more details on the pipeline configuration, see the GitLab [documentation](https://docs.gitlab.com/ee/ci/yaml/).

Navigate to [http://devtools-gitlab.lab.devnetsandbox.local/developer/nso_cicd/-/pipelines](http://devtools-gitlab.lab.devnetsandbox.local/developer/nso_cicd/-/pipelines) in your web browser to view the status of the pipeline.

This process may take a few minutes to complete. While the stages are running, review the completed ones to see what is happening.

!!! question "What was the outcome of the testing phase?"

!!! question "Is the loopback service available in the development NSO instance?"

<!-- todo: add picture of the stage and show the message why it fail -->
![Results pipeline NSO](../../assets/04_Gitlab-pipeline-fail.png)


