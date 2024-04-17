job("[BE] Merge Request") {
    startOn {
        codeReviewOpened {
            branchToCheckout = CodeReviewBranch.MERGE_REQUEST_SOURCE
        }
        gitPush {
            anyRefMatching {
                +"refs/merge/*/head"
            }
        }
    }

    parallel {
        container(displayName = "build & test", image = "node:alpine") {
            shellScript {
                content = """
                    set -e
                    yarn install
                    yarn build
                    yarn test
                """
            }
        }

        container(displayName = "add reviewer", image = "node:alpine") {
            env["REVIEW_ID"] = "{{ run:review.id }}"
            env["PROJECT_ID"] = "{{ run:project.id }}"
            env["SPACE_AUTOMATION_AUTHORIZATION"] = "{{ project:SPACE_AUTOMATION_AUTHORIZATION }}"
            shellScript {
                content = """
                    set -e
                    yarn install
                    yarn reviewer
                """
            }
        }
    }
}

job("[BE] Deploy Develop") {
    startOn {
        gitPush {
            anyBranchMatching {
                +"develop"
            }
        }
    }

    git {
        refSpec {
            +"refs/heads/develop"
        }
        depth = UNLIMITED_DEPTH
    }

    container(displayName = "Push heroku remote", image = "alpine:3.18") {
        env["HEROKU_API_KEY"] = "{{ project:HEROKU_API_KEY }}"

        shellScript {
            content = """
                apk update
                apk add git
                echo "Git Version:"
                git --version

                git switch develop
                echo "Git Status:"
                git status

                git remote add heroku https://token:${'$'}HEROKU_API_KEY@git.heroku.com/bi-orbit.git
                git push heroku develop:main -f
            """
        }
    }
}
