pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'
    }

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
        // Stage 1: Git Code Checkout
        stage('Git Code Checkout') {
            steps {
                script {
                    echo 'Checking out code from SCM repository...'
                    checkout scm
                    echo 'Repository checked out successfully'

                    // Display git information
                    bat 'git log --oneline -5'
                    bat 'git branch'
                }
            }
        }

        // Stage 2: Compile/Build
        stage('Compile/Build') {
            steps {
                script {
                    echo 'Starting compile and build process...'

                    // Clean previous installations
                    bat 'if exist node_modules rmdir /s /q node_modules'
                    bat 'if exist frontend\\node_modules rmdir /s /q frontend\\node_modules'
                    bat 'if exist backend\\node_modules rmdir /s /q backend\\node_modules'

                    // Install root dependencies
                    bat 'npm install'

                    // Parallel installation of frontend and backend dependencies
                    parallel(
                        'Install Frontend Dependencies': {
                            dir('frontend') {
                                echo 'Installing frontend dependencies...'
                                bat 'npm install'
                            }
                        },
                        'Install Backend Dependencies': {
                            dir('backend') {
                                echo 'Installing backend dependencies...'
                                bat 'npm install'
                            }
                        }
                    )

                    // Build frontend application
                    dir('frontend') {
                        echo 'Building frontend application...'
                        bat 'npm run build --verbose'
                        echo 'Frontend build completed successfully'
                    }

                    echo 'All compilation and build steps completed'
                }
            }
        }

        // Stage 3: Package/Bundle
        stage('Package/Bundle') {
            steps {
                script {
                    echo 'Packaging application for deployment...'

                    // Clean previous deployment package
                    bat 'if exist deployment-package rmdir /s /q deployment-package'
                    bat 'if exist web-chat-app-.tar.gz del /q web-chat-app-.tar.gz'

                    // Create deployment package
                    bat 'mkdir deployment-package'
                    bat 'xcopy /e /i /y backend\\* deployment-package\\'
                    bat 'xcopy /e /i /y frontend\\dist deployment-package\\dist'
                    bat 'copy /y package.json deployment-package\\'

                    // Copy additional files if they exist
                    bat 'if exist Dockerfile copy /y Dockerfile deployment-package\\'
                    bat 'if exist k8s\\* xcopy /e /i /y k8s\\* deployment-package\\k8s\\'

                    // Create tarball for deployment (requires tar to be installed)
                    bat 'tar -czf web-chat-app-%BUILD_NUMBER%.tar.gz deployment-package\\'
                    echo "Application packaged successfully: web-chat-app-%BUILD_NUMBER%.tar.gz"

                    echo 'Application packaging completed'
                }
            }
        }

        // Stage 4: Deployment
        stage('Deploying on Server') {
            steps {
                script {
                    echo 'Starting deployment process...'

                    // Choose deployment strategy based on branch
                    if (env.BRANCH_NAME == 'main') {
                        // Production deployment
                        input message: 'Deploy to PRODUCTION environment?', ok: 'Deploy to Production'
                        deployToProduction()
                    } else if (env.BRANCH_NAME == 'develop') {
                        // Staging deployment
                        deployToStaging()
                    } else {
                        // Development deployment
                        deployToDevelopment()
                    }
                }
            }
        }
    }

    // Post-build actions
    post {
        success {
            script {
                echo '✅ Pipeline completed successfully!'

                // Archive build artifacts
                archiveArtifacts artifacts: 'web-chat-app-*.tar.gz', allowEmptyArchive: true
                archiveArtifacts artifacts: 'frontend/dist//*', allowEmptyArchive: true

                echo 'Build artifacts archived successfully'
            }
        }

        failure {
            script {
                echo '❌ Pipeline failed!'
                echo 'Check console output for details'
            }
        }

        unstable {
            script {
                echo '⚠ Pipeline completed with warnings!'
            }
        }

        cleanup {
            script {
                echo '🧹 Cleaning up workspace...'
                cleanWs()

                // Clean up Windows-specific files
                bat '''
                if exist node_modules rmdir /s /q node_modules
                if exist frontend\\node_modules rmdir /s /q frontend\\node_modules
                if exist backend\\node_modules rmdir /s /q backend\\node_modules
                if exist deployment-package rmdir /s /q deployment-package
                if exist web-chat-app-.tar.gz del /q web-chat-app-.tar.gz
                '''

                echo 'Workspace cleaned successfully'
            }
        }
    }
}

// Helper functions for deployment
def deployToProduction() {
    echo '🚀 Deploying to PRODUCTION environment...'

    script {
        try {
            // Example deployment commands - customize based on your infrastructure

            // Option 1: PowerShell-based deployment to production server
            powershell '''
                $packagePath = "web-chat-app-$env:BUILD_NUMBER.tar.gz"
                $server = "production-server"
                $remotePath = "/opt/apps/"

                # Copy package to production server
                scp $packagePath "user@$server`:$remotePath"

                # Extract and deploy on remote server
                ssh "user@$server" @"
                    cd $remotePath
                    tar -xzf $packagePath
                    cd deployment-package
                    npm install --production
                    pm2 restart web-chat-app
"@
            '''

            // Option 2: Windows-based deployment using Robocopy
            // bat '''
            //     robocopy deployment-package \\\\production-server\\opt\\apps\\web-chat-app /E /MIR
            //     psexec \\\\production-server -u user -p password "cd /opt/apps/web-chat-app && npm install --production && pm2 restart web-chat-app"
            // '''

            echo 'Production deployment completed successfully'

        } catch (Exception e) {
            error "Production deployment failed: ${e.getMessage()}"
        }
    }
}

def deployToStaging() {
    echo '🧪 Deploying to STAGING environment...'

    script {
        try {
            // Staging deployment commands
            bat '''
                echo "Deploying to staging environment..."
                :: Add your staging deployment commands here
                :: robocopy deployment-package \\\\staging-server\\opt\\apps\\staging /E
            '''

            echo 'Staging deployment completed successfully'

        } catch (Exception e) {
            error "Staging deployment failed: ${e.getMessage()}"
        }
    }
}

def deployToDevelopment() {
    echo '🛠 Deploying to DEVELOPMENT environment...'

    script {
        try {
            // Development environment deployment (less strict)
            bat '''
                echo "Deploying to development environment..."
                :: Local development deployment
                if exist "C:\\dev\\web-chat-app" rmdir /s /q "C:\\dev\\web-chat-app"
                xcopy /e /i /y deployment-package "C:\\dev\\web-chat-app"
                cd /d "C:\\dev\\web-chat-app"
                npm install --production
            '''

            echo 'Development deployment completed successfully'

        } catch (Exception e) {
            echo "Development deployment warning: ${e.getMessage()}"
            currentBuild.result = 'UNSTABLE'
        }
    }
}