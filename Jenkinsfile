#!groovy

properties([
    [
        $class: 'GithubProjectProperty',
        projectUrlStr: 'https://github.com/hmcts/document-management-node-demo'
    ],
    pipelineTriggers([
        [$class: 'GitHubPushTrigger']
    ]),
    disableConcurrentBuilds()
])


@Library('Reform') _
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Artifactory
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger
import uk.gov.hmcts.Versioner

def channel = '#dm-pipeline'

def app = "document-management-node-demo"
def artifactorySourceRepo = "evidence-local"

def ansible = new Ansible(this, 'dm')
def artifactory = new Artifactory(this)
def packager = new Packager(this, 'evidence')
def versioner = new Versioner(this)

def rpmTagger
def rpmVersion
def version

node {
    try {
        stage('Checkout') {
            deleteDir()
            checkout scm
        }

        stage('Build') {
            sh "yarn install"
            sh "yarn setup"
        }

        stage('Lint') {
            sh 'yarn lint'
        }

        stage('Node security check') {
            try {
                sh 'yarn test:nsp'
            } catch (Throwable e) {
                def errors = sh(script: 'yarn test:nsp-warn', returnStdout: true)
                slackSend(
                    channel: channel,
                    color: 'warn',
                    message: "${env.JOB_NAME}:  <${env.BUILD_URL}console|Build ${env.BUILD_DISPLAY_NAME}> has vunerabilities: ${errors}"
                )
            } finally {
//                need to generate a nsp report somehow
            }
        }

        stage('Test') {
            try {
                sh "yarn test"
                sh "yarn test:coverage"
            } finally {
                publishHTML([
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : "report/",
                    reportFiles          : 'units.html',
                    reportName           : 'Unit Test Report'
                ])
                publishHTML([
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : "coverage/",
                    reportFiles          : 'index.html',
                    reportName           : 'Coverage Report'
                ])
            }
        }

        if ("master" == "${env.BRANCH_NAME}") {
            stage('Sonar') {
                sh "yarn sonar-scan -Dsonar.host.url=$SONARQUBE_URL"
            }
        }

        if ("master" == "${env.BRANCH_NAME}") {

            stage('Publish Docker') {
                dockerImage imageName: "evidence/${app}", pushToLatestOnMaster: true
            }

            stage('Package (RPM)') {
                rpmVersion = packager.nodeRPM(app)
                version = "{ app: ${app}, rpmversion: ${rpmVersion}}"
            }

            stage('Publish RPM') {
                packager.publishNodeRPM(app)
                rpmTagger = new RPMTagger(this, app, packager.rpmName(app, rpmVersion), artifactorySourceRepo)
            }

            stage ('Deploy on Dev') {
                ansible.run("{}", "dev", "install_show_web.yml")
                ansible.run("{}", "dev", "deploy_show_web.yml")
                rpmTagger.tagDeploymentSuccessfulOn('dev')
                rpmTagger.tagTestingPassedOn("dev")
            }

            stage ('Deploy on Test') {
                ansible.run("{}", "test", "install_show_web.yml")
                ansible.run("{}", "test", "deploy_show_web.yml")
                rpmTagger.tagDeploymentSuccessfulOn('test')
                rpmTagger.tagTestingPassedOn("test")
            }

            stage ('Deploy on Demo') {
                ansible.run("{}", "demo", "install_show_web.yml")
                ansible.run("{}", "demo", "deploy_show_web.yml")
                rpmTagger.tagDeploymentSuccessfulOn('demo')
                rpmTagger.tagTestingPassedOn("demo")
            }
        }
        notifyBuildFixed channel: channel
    }
    catch (e) {
        notifyBuildFailure channel: channel
        throw e
    }
}
