#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JDK_DIR="$ROOT/.tools/jdk-17"

# 1. Use existing JAVA_HOME if valid
if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
  echo "Java ready: $("$JAVA_HOME/bin/java" -version 2>&1 | head -1)"
  exit 0
fi

# 2. Use macOS java_home (Corretto/Temurin installed via installer)
if [ -x /usr/libexec/java_home ]; then
  DETECTED="$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home 2>/dev/null || true)"
  if [ -n "$DETECTED" ] && [ -x "$DETECTED/bin/java" ]; then
    export JAVA_HOME="$DETECTED"
    echo "Java ready: $("$JAVA_HOME/bin/java" -version 2>&1 | head -1)"
    exit 0
  fi
fi

# 3. Use java from PATH
if command -v java >/dev/null 2>&1; then
  echo "Java ready: $(java -version 2>&1 | head -1)"
  exit 0
fi

# 4. Use previously downloaded bundled JDK
if [ -x "$JDK_DIR/Contents/Home/bin/java" ]; then
  export JAVA_HOME="$JDK_DIR/Contents/Home"
  echo "Java ready (bundled): $("$JAVA_HOME/bin/java" -version 2>&1 | head -1)"
  exit 0
fi

if [ -x "$JDK_DIR/bin/java" ]; then
  export JAVA_HOME="$JDK_DIR"
  echo "Java ready (bundled): $("$JAVA_HOME/bin/java" -version 2>&1 | head -1)"
  exit 0
fi

# 5. Download Temurin JDK 17 as last resort
echo "Java not found. Downloading Java 17 (this may take a minute)..."
mkdir -p "$ROOT/.tools"
TMP="$ROOT/.tools/jdk17.tar.gz"

curl -L "https://api.adoptium.net/v3/binary/latest/17/ga/mac/aarch64/jdk/hotspot/normal/eclipse?project=jdk" -o "$TMP"
tar -xzf "$TMP" -C "$ROOT/.tools"
rm "$TMP"

EXTRACTED="$(find "$ROOT/.tools" -maxdepth 1 -type d -name 'jdk-17*' ! -path "$JDK_DIR" | head -1)"
if [ -z "$EXTRACTED" ]; then
  echo "Failed to extract JDK"
  exit 1
fi

mv "$EXTRACTED" "$JDK_DIR"

if [ -x "$JDK_DIR/Contents/Home/bin/java" ]; then
  export JAVA_HOME="$JDK_DIR/Contents/Home"
else
  export JAVA_HOME="$JDK_DIR"
fi

echo "Java installed: $("$JAVA_HOME/bin/java" -version 2>&1 | head -1)"
