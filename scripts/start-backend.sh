#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Ensure Java is available
. "$ROOT/scripts/setup-java.sh"

if [ -n "$JAVA_HOME" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi

chmod +x "$ROOT/backend/mvnw"

echo "Starting Spring Boot backend (local mode, no Firebase needed)..."
cd "$ROOT/backend"
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
