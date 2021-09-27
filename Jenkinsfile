pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Build') { 
            steps {
                sh 'docker build --pull --rm -f "Dockerfile" -t front-end/store-management:preview "."' 
                sh 'docker rm --force store-management.preview || true'
                sh 'docker run -d --restart=always --name store-management.preview -p 10015:80/tcp front-end/store-management:preview' 
            }
        }
    }
}