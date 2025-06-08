# Conclusion

In this demo, we explored how NSO can be integrated into a CI/CD pipeline to manage network services efficiently.

* We began by updating the pipeline configuration and pushing changes to trigger automated testing and validation of the NSO service under development.
* Once we confirmed that our service behaved as expected, we merged the changes from our testing branch into the main branch.
* This merge triggered an automatic deployment of the service to the NSO production environment, demonstrating a seamless transition from development to production.
* To improve visibility and reduce semantic and syntactical errors, we incorporated Robot Framework tests, lint checks, and pyATS validation.

This process demonstrates the complete lifecycle of developing, testing, and deploying network service changes within a CI/CD framework, ensuring both reliability and efficiency in managing network infrastructure.

We hope you now feel comfortable with the role these tools play in modern network automation and CI/CD workflows. Thank you for participating!