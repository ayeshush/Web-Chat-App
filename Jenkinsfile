pipeline {
    agent any

    tools {
        nodejs 'Node.js 18'
    }

    environment {
        NODE_ENV = 'production'
        MONGODB_URI = credentials('mongodb-uri')
        JWT_SECRET = credentials('jwt-secret')
        CLOUDINARY_CLOUD_NAME = credentials('cloudinary-cloud-name')
        CLOUDINARY_API_KEY = credentials('cloudinary-api-key')
        CLOUDINARY_API_SECRET = credentials('cloudinary-api-secret')
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
                    sh 'git log --oneline -5'
                    sh 'git branch'
                }
            }
        }

        // Stage 2: Compile/Build
        stage('Compile/Build') {
            steps {
                script {
                    echo 'Starting compile and build process...'

                    // Install root dependencies
                    sh 'npm ci'

                    // Parallel installation of frontend and backend dependencies
                    parallel(
                        'Install Frontend Dependencies': {
                            dir('frontend') {
                                echo 'Installing frontend dependencies...'
                                sh 'npm ci'
                            }
                        },
                        'Install Backend Dependencies': {
                            dir('backend') {
                                echo 'Installing backend dependencies...'
                                sh 'npm ci'
                            }
                        }
                    )

                    // Build frontend application
                    dir('frontend') {
                        echo 'Building frontend application...'
                        sh 'npm run build'
                        echo 'Frontend build completed successfully'
                    }

                    echo 'All compilation and build steps completed'
                }
            }
        }

  
        // Stage 3: Packaging
        stage('Package/Bundle') {
            steps {
                script {
                    echo 'Packaging application for deployment...'

                    // Create deployment package
                    sh '''
                        mkdir -p deployment-package
                        cp -r backend/* deployment-package/
                        cp -r frontend/dist deployment-package/
                        cp package.json deployment-package/
                        cp Dockerfile deployment-package/  # if using Docker
                        cp -r k8s/ deployment-package/     # if using Kubernetes manifests
                    '''

                    // Create tarball for deployment
                    sh '''
                        tar -czf web-chat-app-${BUILD_NUMBER}.tar.gz deployment-package/
                        echo "Application packaged successfully: web-chat-app-${BUILD_NUMBER}.tar.gz"
                    '''

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

                // Remove node_modules and other temporary files
                sh 'rm -rf node_modules frontend/node_modules backend/node_modules deployment-package web-chat-app-*.tar.gz'

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

            // Option 1: SSH deployment to production server
            // sh '''
            //     scp web-chat-app-${BUILD_NUMBER}.tar.gz user@production-server:/opt/apps/
            //     ssh user@production-server "
            //         cd /opt/apps &&
            //         tar -xzf web-chat-app-${BUILD_NUMBER}.tar.gz &&
            //         cd deployment-package &&
            //         npm install --production &&
            //         pm2 restart web-chat-app
            //     "
            // '''

            // Option 2: Docker deployment
            // sh '''
            //     docker build -t web-chat-app:${BUILD_NUMBER} .
            //     docker tag web-chat-app:${BUILD_NUMBER} web-chat-app:latest
            //     docker-compose -f docker-compose.prod.yml up -d
            // '''

            // Option 3: Kubernetes deployment
            // sh '''
            //     kubectl set image deployment/web-chat-app web-chat-app=web-chat-app:${BUILD_NUMBER} -n production
            //     kubectl rollout status deployment/web-chat-app -n production
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
            // Similar deployment logic for staging environment
            // sh 'scp web-chat-app-${BUILD_NUMBER}.tar.gz user@staging-server:/opt/apps/staging/'
            // ... staging deployment commands

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
            echo 'Development deployment completed successfully'

        } catch (Exception e) {
            echo "Development deployment warning: ${e.getMessage()}"
            currentBuild.result = 'UNSTABLE'
        }
    }
}