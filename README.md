# Alter Ego

**Cycle between alternative token images with optional particle effects**

Transform your tokens on the fly! Switch between different forms, states, or appearances with a single click. Add visual effects to make transformations more dramatic.
Pay attention this WILL NOT change the size of the token!

---

## 📦 What Does This Module Do?

Alter Ego lets you configure **multiple images** for a single actor and **switch between them** during gameplay. Perfect for:

- **Transformations** (human ↔ werewolf, normal ↔ enraged)
- **Different states** (healthy ↔ bloodied ↔ unconscious)
- **Disguises** (real identity ↔ disguised form)
- **Elemental forms** (fire ↔ water ↔ earth ↔ air)
- **Mounted/unmounted** characters

You can also add **particle effects** (explosions, magic auras, etc.) that play when switching to an image.

---

## 🎯 Installation

### Method 1: Module Browser (Recommended)
1. In Foundry VTT, go to **Add-on Modules**
2. Click **Install Module**
3. Search for **"Alter Ego"**
4. Click **Install**
5. Enable it in your world

### Method 2: Manifest URL
1. Copy this URL: `[manifest URL will be added]`
2. In Foundry, go to **Add-on Modules → Install Module**
3. Paste the URL in **Manifest URL**
4. Click **Install**

---

## 🚀 How to Use

### Step 1: Open Actor Sheet
Open the character sheet of the actor you want to configure.

### Step 2: Click "Alter Ego" Button
Look for the **🕵️ Alter Ego** button in the top-right corner (next to Configure/Close buttons).

> **Note:** Only **Game Masters** can see and use this button.

### Step 3: Add Images
A configuration window opens with a table. Click **"+ Add Image"** to add a new row.

Each row has:
- **Token Image Path** - The image file for this form
- **Effect Path (optional)** - A visual effect that plays when switching to this image

### Step 4: Choose Images

**Option A - Browse:** Click the 📁 button → navigate to your files → select an image

**Option B - Type manually:** Write the path directly (e.g., `worlds/my-world/tokens/werewolf.png`)

> **Tip:** Images must be in your world's folder or in a shared location Foundry can access.

### Step 5: Add Effects (Optional)

You have **3 options** for effects:

#### Option 1: JB2A Effects
If you have the **JB2A** module installed:
1. Click the 🔍 button next to "Effect Path"
2. Search for an effect (e.g., type "explosion")
3. Click on the effect you like
4. The path is automatically filled in

#### Option 2: Custom Video Files
Use your own effect animations:
1. Click the 📁 button next to "Effect Path"
2. Select a `.webm` or `.mp4` file from your folders
3. The path is automatically filled in

#### Option 3: No Effect
Simply leave the "Effect Path" field empty.

### Step 6: Save
Click **"Save"** at the bottom of the window.

---

## 🎮 Changing Token Images During Play

Once configured, changing images is simple:

###  Token HUD Button
1. **Right-Click** the token on the map
2. A toolbar appears
3. Click the **🔄 green button** in the toolbar
4. The image changes to the next one in your list

> **Note:** The button only appears if the token has multiple images configured.

---

## 💡 Tips & Examples

### Example 1: Werewolf Transformation
1. Configure your actor with:
   - Image 1: `human.png` (no effect)
   - Image 2: `werewolf.png` with effect `jb2a.explosion.01.orange` or a custom effect `mycustomfile.explosion`
2. During combat, select the token and click 🔄
3. The token transforms with a dramatic explosion effect!


### Example 2: Health States
1. Configure three images:
   - Healthy: `character-normal.png`
   - Bloodied: `character-wounded.png`
   - Unconscious: `character-down.png`
2. Switch manually as the character takes damage

---

## ❓ Frequently Asked Questions

### Q: Can players see/use Alter Ego?
**A:** No, only Game Masters can configure token images. This is intentional to prevent players from accidentally breaking things.

### Q: Do I need JB2A to use this module?
**A:** No! JB2A is **optional**. You can:
- Use Alter Ego without any effects
- Use your own custom video files (.webm, .mp4)

### Q: Can I use this with any actor?
**A:** Yes! Works with all actor types in all game systems.

### Q: What image formats are supported?
**A:** Standard web formats: `.png`, `.jpg`, `.webp`

### Q: What effect formats are supported?
**A:** Video formats: `.webm`, `.mp4`

### Q: The FilePicker doesn't work / nothing happens when I click 📁
**A:** Make sure you **select** the file in the picker (not just click once). Some systems require a double-click or pressing a "Select" button.

### Q: Effects don't play
**A:** Check that:
- Sequencer module is installed and enabled
- JB2A module is installed (if using JB2A effects)
- The effect path is correct (use the 🔍 search to find valid effects)
- Your custom video file exists in the specified location

### Q: How do I remove an image?
**A:** Click the ✖ button at the end of the row in the configuration table.

### Q: Can I reorder images?
**A:** Not directly, but you can remove and re-add them in the desired order.

---

## 🔧 Troubleshooting

### Token HUD button doesn't appear
- Make sure the token has **at least 2 images** configured
- Try reloading (F5)

### Images don't switch
- Verify the image paths are correct
- Make sure the files exist in your world folder
- Check browser console (F12) for errors

### Effects show "Invalid Asset" error
- The effect name is incorrect or doesn't exist
- Use the 🔍 search to find valid JB2A effects
- For custom effects, verify the video file exists

---

## 🌍 Language Support

Alter Ego is fully localized in:
- **English** (default)
- **Italiano**

---

## 🎨 Compatibility

- **Foundry VTT Version:** v13+
- **Game Systems:** All systems supported
- **Dependencies:** None (Sequencer + JB2A optional for effects)

### About Effect Integration

This module **integrates with** but **does not include** two optional modules for effects:

#### Sequencer
A framework for playing visual effects in Foundry VTT.
- **License:** MIT License
- **Module:** https://foundryvtt.com/packages/sequencer
- **Required for effects:** Yes (if you want to use effects)
- **Credit:** Sequencer team for the excellent effects framework

#### JB2A (Jules&Ben's Animated Assets)
A library of 1600+ free animated effects.
- **License:** CC BY-NC-SA 4.0
- **Module:** https://foundryvtt.com/packages/JB2A_DnD5e
- **Required for JB2A effects:** Yes (optional - you can use custom files)
- **Credit:** JB2A team for the amazing free animated assets

**Alter Ego works without both modules** - they're only needed if you want particle effects. You can use:
- No effects at all (just image switching)
- Your own custom effect files (You need only Sequencer and custom effect files in the format .webm, .mp4)
- JB2A effects (if both Sequencer and JB2A are installed)

All credits for effects go to the respective teams. Alter Ego provides an interface to search and use them.

---

## 🤝 Support and Contributions

If you like this module and would like to support my work, you can:

- [Buy me a coffee on Ko-fi](https://ko-fi.com/dinoapicella)☕
- Suggest new features or improvements
- Report any bugs you encounter

Feel free to reach out with ideas for new modules or functionality that might help the Foundry community. While I can't promise quick updates due to time constraints, I appreciate all feedback and suggestions.

---

## 📄 License

[MIT License](LICENSE)


---

## 🙏 Credits

- **Created by:** Dino Apicella
- **JB2A Team:** For the amazing animated assets library
- **Sequencer Team:** For the excellent effects framework

---

### About JB2A Integration

This module integrates with but does not include JB2A.
JB2A is a separate, optional module.

- JB2A License: CC BY-NC-SA 4.0
- JB2A Module: [[link](https://github.com/Jules-Bens-Aa/JB2A_DnD5e)]
- Alter Ego works with or without JB2A

All credit for JB2A effects goes to the JB2A team.

**Need help?** Check the **💡 Help & Instructions** section inside the configuration dialog for quick reference!