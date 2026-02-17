#!/usr/bin/env python3
import subprocess
import os
import sys

# Change to the project root directory
os.chdir('/vercel/share/v0-project')

try:
    print("[v0] Running npm install to sync package-lock.json...")
    result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
    
    if result.returncode == 0:
        print("[v0] Success! package-lock.json has been synced with package.json")
        print(result.stdout)
    else:
        print("[v0] Error running npm install:")
        print(result.stderr)
        sys.exit(1)
except Exception as e:
    print(f"[v0] Error: {str(e)}")
    sys.exit(1)
