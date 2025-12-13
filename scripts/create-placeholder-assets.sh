#!/bin/bash

# Create placeholder assets for the app
# This script creates simple colored PNG files as placeholders

echo "Creating placeholder assets..."

# Create assets directory if it doesn't exist
mkdir -p assets

# Colors
ICON_COLOR="#4A90E2"
SPLASH_COLOR="#4A90E2"

# Create a simple script to generate images using ImageMagick or sips (macOS)
if command -v sips &> /dev/null; then
    # macOS - using sips
    echo "Using macOS sips to create placeholder images..."
    
    # Create a temporary colored image
    sips -c 1024 1024 --setProperty format png /System/Library/CoreServices/DefaultDesktop.heic --out assets/icon.png 2>/dev/null || \
    echo "Note: Could not create icon.png automatically. Please create a 1024x1024 PNG manually."
    
    sips -c 1242 2436 --setProperty format png /System/Library/CoreServices/DefaultDesktop.heic --out assets/splash.png 2>/dev/null || \
    echo "Note: Could not create splash.png automatically. Please create a 1242x2436 PNG manually."
    
    sips -c 1024 1024 --setProperty format png /System/Library/CoreServices/DefaultDesktop.heic --out assets/adaptive-icon.png 2>/dev/null || \
    echo "Note: Could not create adaptive-icon.png automatically. Please create a 1024x1024 PNG manually."
    
    sips -c 48 48 --setProperty format png /System/Library/CoreServices/DefaultDesktop.heic --out assets/favicon.png 2>/dev/null || \
    echo "Note: Could not create favicon.png automatically. Please create a 48x48 PNG manually."
    
elif command -v convert &> /dev/null; then
    # ImageMagick
    echo "Using ImageMagick to create placeholder images..."
    convert -size 1024x1024 xc:"$ICON_COLOR" assets/icon.png
    convert -size 1242x2436 xc:"$SPLASH_COLOR" assets/splash.png
    convert -size 1024x1024 xc:"$ICON_COLOR" assets/adaptive-icon.png
    convert -size 48x48 xc:"$ICON_COLOR" assets/favicon.png
else
    echo "Neither sips nor ImageMagick found."
    echo "Please create these files manually:"
    echo "  - assets/icon.png (1024x1024)"
    echo "  - assets/splash.png (1242x2436)"
    echo "  - assets/adaptive-icon.png (1024x1024)"
    echo "  - assets/favicon.png (48x48)"
    echo ""
    echo "Or use an online tool like: https://www.photopea.com/"
fi

echo "Done! Check the assets/ directory."

