# App Store Connect Checklist - Remove "Kids" References

Apple is reviewing what's displayed in **App Store Connect**, not just your code. You must update these in App Store Connect:

## ✅ Code is Fixed (Already Done)
- ✅ All user-facing text updated
- ✅ No "kids", "children", or age-specific references in code
- ✅ App name in code: "tahadi learning" (internal only)

## ⚠️ MUST Update in App Store Connect

### 1. App Name (CRITICAL) 🔴
**Location:** App Store Connect → Your App → App Information → Name
- **Current:** Likely still says "Learn for Kids" or something with "Kids"
- **Change To:** "تحدي - درب عقلك" (or "Challenge - Train Your Mind" in English)
- **Action:** Go to App Information and change the name field

### 2. Subtitle (Check This) 🟡
**Location:** App Store Connect → Your App → App Information → Subtitle
- **Check:** Does it say anything about "kids", "children", or ages?
- **Action:** Remove any age-specific or "for kids" language
- **Example Good:** "Educational learning app" or leave empty

### 3. App Icon 🟡
**Location:** Check the actual icon image file (`assets/icon.png`)
- **Check:** Does the icon image itself contain text like "Kids" or "for Kids"?
- **Action:** If yes, you need to create a new icon without "Kids" text
- **Note:** We can't see the actual image content, only you can check this

### 4. Screenshots 🟡
**Location:** App Store Connect → Your App → App Store → Screenshots
- **Check:** Do your screenshots show text like "Kids", "for Kids", "for children"?
- **Action:** If yes, take new screenshots or edit existing ones to remove "Kids" text
- **Note:** Screenshots must not show any "kids" or "children" references

### 5. Promotional Text / Description 🟡
**Location:** App Store Connect → Your App → App Store → Description
- **Check:** Does the description mention "kids", "children", or age ranges like "ages 3-7"?
- **Action:** Rewrite to be general educational language
- **Example:** Change "for children" → "for learners" or just "educational app"

## How to Access App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click on "My Apps"
4. Select your app
5. Click on "App Information" tab for name/subtitle
6. Click on "App Store" tab for screenshots/description

## Quick Action Items

**Priority 1 (Required):**
- [ ] Update App Name in App Store Connect to "تحدي - درب عقلك"
- [ ] Check and update Subtitle (remove "kids" if present)

**Priority 2 (Highly Recommended):**
- [ ] Review all Screenshots - remove "Kids" text if visible
- [ ] Review Description/Promotional Text - remove "kids" references
- [ ] Check App Icon image - ensure no "Kids" text in the image itself

## After Making Changes

1. Save all changes in App Store Connect
2. Submit a new build (if needed)
3. Reply to Apple's message explaining you've updated the metadata
4. Wait for review

---

**Remember:** The code changes we made are correct, but Apple sees what's in App Store Connect metadata, not your code. The rejection is about what users see in the App Store listing, not what's in the app binary.

