#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CREDS="$ROOT/backend/src/main/resources/firebase-service-account.json"

if [ ! -f "$CREDS" ]; then
  echo ""
  echo "Firebase credentials not found!"
  echo ""
  echo "Do this once:"
  echo "  1. Open: https://console.firebase.google.com/project/school-management-system-79732/settings/serviceaccounts/adminsdk"
  echo "  2. Click 'Generate new private key' → Download JSON"
  echo "  3. Save the file as:"
  echo "     backend/src/main/resources/firebase-service-account.json"
  echo ""
  exit 1
fi

. "$ROOT/scripts/setup-java.sh"

if [ -n "$JAVA_HOME" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi

chmod +x "$ROOT/backend/mvnw"

echo "Starting Spring Boot backend (Firebase Realtime Database)..."
cd "$ROOT/backend"
./mvnw spring-boot:run -Dspring-boot.run.profiles=firebase
