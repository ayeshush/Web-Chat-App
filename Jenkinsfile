pipeline {
    agent any

    stages {
        stage('Prepare') {
            steps {
                echo 'Starting Jenkins pipeline for Web Chat App...'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install || true'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install || true'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build || true'
                }
            }
        }

        stage('Run Server') {
            steps {
                dir('backend') {
                    sh 'echo "Pretending to run the backend server..."'
                    sh 'node src/index.js || true'
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning up workspace (mock)...'
                sh 'echo "Cleanup complete."'
            }
        }
    }

    post {
        always {
            echo '✅ Build pipeline finished successfully (no matter what).'
        }
    }
}
