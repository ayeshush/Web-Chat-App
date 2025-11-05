pipeline {
    agent any
    tools { nodejs 'NodeJS20' }

    environment {
        NODE_ENV = 'production'
        MONGODB_URI = credentials('MONGODB_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        CLOUDINARY_CLOUD_NAME = credentials('CLOUDINARY_CLOUD_NAME')
        CLOUDINARY_API_KEY = credentials('CLOUDINARY_API_KEY')
        CLOUDINARY_API_SECRET = credentials('CLOUDINARY_API_SECRET')
        PORT = '5001'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                script {
                    bat '''
                    if exist node_modules rmdir /s /q node_modules
                    if exist frontend\\node_modules rmdir /s /q frontend\\node_modules
                    if exist backend\\node_modules rmdir /s /q backend\\node_modules
                    '''

                    dir('frontend') {
                        bat 'npm install'
                        bat 'npm run build'
                    }

                    dir('backend') {
                        bat 'npm install'
                        bat 'node --check src/index.js'   // ✅ Syntax check instead of running server
                    }
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
        success {
            echo '✅ Build finished successfully!'
        }
        failure {
            echo '❌ Build failed. Check console output.'
        }
    }
}
