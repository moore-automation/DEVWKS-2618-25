# Conclusion
In this demo, we explored how NSO can be integrated into a CI/CD pipeline to manage network services effectively.


* We started by updating the pipeline configuration and pushing changes to trigger automated testing and validation of the NSO service under development.

* Confident that our service behaved as expected, we merged the changes from our testing branch into the main branch.

* This merge initiated an automatic deployment of the service to the NSO production environment, demonstrating the seamless transition from development to production.

* To improve visibility of issues and reduce semantic and syntactical erorrs we added Robot Framework tests, lint checks and pyATS validation. 

This process showcases the complete lifecycle of developing, testing, and deploying network service changes within a CI/CD framework, ensuring reliability and efficiency in managing network infrastructure.

We hope you are now comfortable with the role these tools play in when 