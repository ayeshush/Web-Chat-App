pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'
    }

    environment {
        NODE_ENV = 'development'  // Ensures devDependencies like @vitejs/plugin-react install
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo '📥 Installing dependencies...'
                    // Clean old node_modules
                    bat '''
                    if exist node_modules rmdir /s /q node_modules
                    if exist frontend\\node_modules rmdir /s /q frontend\\node_modules
                    if exist backend\\node_modules rmdir /s /q backend\\node_modules
                    '''

                    // Install frontend & backend deps
                    dir('frontend') {
                        bat 'set NODE_ENV=development && npm install'
                    }
                    dir('backend') {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo '🏗 Building frontend...'
                    bat 'set NODE_ENV=development && npm run build'
                }
            }
        }

        stage('Run Backend') {
            steps {
                dir('backend') {
                    echo '🚀 Starting backend server...'
                    bat 'npm start'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed! Check Jenkins logs for details.'
        }
        cleanup {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
    }
}
