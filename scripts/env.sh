#!/bin/sh
# Source this file to set JAVA_HOME for the project:
#   source scripts/env.sh

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ -x /usr/libexec/java_home ]; then
  export JAVA_HOME="$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home 2>/dev/null)"
elif [ -x "$ROOT/.tools/jdk-17/Contents/Home/bin/java" ]; then
  export JAVA_HOME="$ROOT/.tools/jdk-17/Contents/Home"
elif [ -x "$ROOT/.tools/jdk-17/bin/java" ]; then
  export JAVA_HOME="$ROOT/.tools/jdk-17"
fi

if [ -n "$JAVA_HOME" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
  echo "JAVA_HOME=$JAVA_HOME"
fi
