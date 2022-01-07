#!/bin/bash

# Usage: ./docker-build.sh <repo name (local or remote)> <version> <env> [push]
# Example: ./docker-build.sh inatrace-be 2.4.0
# Needed docker command.
# The target environment can be specified as the third parameter. The supported values are TEST and PROD
#
# If "push" is provided, the image will be pushed to the specified repo with the prepended version and env.

set -e

repoName=$1
version=$2
env=$3
push=$4

if [ "$repoName" == "" ] || [ "$version" == "" ] || [ "$env" == "" ] || [[ "$env" != "TEST" && "$env" != "PROD" ]]; then
  echo "Usage: $0 <repo name (local or remote)> <version> <env = TEST | PROD>"
  exit 1
fi

tag=$version-$env

if [ "$env" == "TEST" ]; then
  docker build -t $repoName:$tag -f Dockerfile-test .
else
  docker build -t $repoName:$tag -f Dockerfile-prod .
fi

if [ "$push" == "push" ]; then
  docker push $repoName:$tag
fi
