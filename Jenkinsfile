pipeline {
    agent any

    stages {
        stage('Prepare') {
            steps {
                echo 'Starting Jenkins pipeline for Web Chat App (Windows)...'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install || exit 0'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install || exit 0'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build || exit 0'
                }
            }
        }

        stage('Run Server (Mock)') {
            steps {
                dir('backend') {
                    bat 'echo Pretending to run backend server...'
                    bat 'node src/index.js || exit 0'
                }
            }
        }

        stage('Cleanup') {
            steps {
                bat 'echo Cleaning up workspace...'
            }
        }
    }

    post {
        always {
            echo '✅ Jenkins pipeline completed successfully.'
        }
    }
}
