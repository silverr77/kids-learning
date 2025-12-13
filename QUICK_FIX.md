# Quick Fix for Missing Assets

## Issue
The app is showing errors about missing icon assets. Here are two ways to fix it:

## Option 1: Create Placeholder Assets (Recommended)

Run the script to create placeholder images:
```bash
bash scripts/create-placeholder-assets.sh
```

Or manually create these files in the `assets/` directory:
- `icon.png` - 1024x1024 pixels
- `splash.png` - 1242x2436 pixels  
- `adaptive-icon.png` - 1024x1024 pixels
- `favicon.png` - 48x48 pixels

You can use any image editor or online tool like:
- https://www.photopea.com/ (free online editor)
- https://www.canva.com/
- Or any image editor on your computer

## Option 2: Temporarily Remove Asset References

If you just want to test the app quickly, you can temporarily comment out asset references in `app.json`:

```json
{
  "expo": {
    // "icon": "./assets/icon.png",  // Comment this out
    "splash": {
      // "image": "./assets/splash.png",  // Comment this out
      "backgroundColor": "#4A90E2"
    }
  }
}
```

**Note:** This will cause warnings but the app will still run.

## After Creating Assets

Once you have the assets, restart the Expo server:
```bash
npm start
```

The app should now work without asset errors!

