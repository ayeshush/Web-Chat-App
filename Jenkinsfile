pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'
    }

    environment {
        PORT = '5000'
        NODE_ENV = 'production'
        MONGO_URI = credentials('MONGO_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        CLOUDINARY_CLOUD_NAME = credentials('CLOUDINARY_CLOUD_NAME')
        CLOUDINARY_API_KEY = credentials('CLOUDINARY_API_KEY')
        CLOUDINARY_API_SECRET = credentials('CLOUDINARY_API_SECRET')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ayeshush/Web-Chat-App.git'
            }
        }

        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace...'
                bat '''
                if exist node_modules rmdir /s /q node_modules
                if exist frontend\\node_modules rmdir /s /q frontend\\node_modules
                if exist backend\\node_modules rmdir /s /q backend\\node_modules
                if exist frontend\\.vite rmdir /s /q frontend\\.vite
                if exist frontend\\.vite-temp rmdir /s /q frontend\\.vite-temp
                npm cache clean --force
                '''
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat '''
                    echo Installing frontend dependencies...
                    npm ci || npm install
                    npm install @vitejs/plugin-react --save-dev
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat '''
                    echo Building frontend...
                    npm run build
                    '''
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat '''
                    echo Installing backend dependencies...
                    npm ci || npm install
                    '''
                }
            }
        }

        stage('Start Backend Server') {
            steps {
                dir('backend') {
                    bat '''
                    echo Starting backend server...
                    node src/index.js
                    '''
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up temporary files...'
            bat '''
            if exist frontend\\.vite-temp rmdir /s /q frontend\\.vite-temp
            if exist frontend\\.vite rmdir /s /q frontend\\.vite
            '''
        }
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed. Please check logs.'
        }
    }
}
