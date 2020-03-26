# README

* Ruby version
2.7.0

* System dependencies
Postgres should be installed locally. This app is not configured to use sqlite for development or test.

* Configuration
This application uses the `dotenv` gem for AWS configuration settings. 
You will need to create a .env file in the root directory and set the following environment variables within it.
The .env file is configured in .gitignore to be ignored.
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* S3_BUCKET
* AWS_REGION

* Database creation
`rails db:create`

* Database initialization
`rails db:migrate`

