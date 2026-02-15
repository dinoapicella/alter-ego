# Alter Ego
<div align="center">
  <img src="https://img.shields.io/github/downloads/dinoapicella/alter-ego/total?color=2b82fc&label=Downloads&style=for-the-badge" alt="Total Downloads">
  <img src="https://img.shields.io/github/v/release/dinoapicella/alter-ego?color=2b82fc&label=Latest%20Release&style=for-the-badge" alt="Latest Release">
  <a href="https://ko-fi.com/dinoapicella">
    <img src="https://img.shields.io/badge/Ko--fi-Support%20Development-%23FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Support on Ko-fi">
  </a>
</div>


**Cycle between alternative token images with optional particle effects and automatic token resizing**

Transform your tokens on the fly! Switch between different forms, states, or appearances with a single click. Add visual effects. The module can also automatically resize tokens when switching between images.

---

## 📦 What Does This Module Do?

Alter Ego lets you configure **multiple images** for a single actor and **switch between them** during gameplay. Perfect for:

- **Transformations** (human ↔ werewolf, normal ↔ enraged)
- **Different states** (healthy ↔ bloodied ↔ unconscious)
- **Disguises** (real identity ↔ disguised form)
- **Elemental forms** (fire ↔ water ↔ earth ↔ air)
- **Mounted/unmounted** characters
- **Size changes** (baby dragon → ancient dragon, small creature → giant form)

You can also add **particle effects** (explosions, magic auras, etc.) that play when switching to an image, and configure **different token sizes** for each form.

<p align="center">
  <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExb28xMWVxZnltcjdzYTVkamQ4YWp4NTJzdTRnOWR4amR3M3dhb2drbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/or8AS0jbixf588QxwR/giphy.gif" width="800" alt="Example Demo 1 ">
</p>


<p align="center">
  <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExczYwZDNyMDI1MGh0c3V2NTN2aTk0Z3d4djVlNzZldnR1bm1kN2g1NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/89NmtXF6vtmAZOdXXD/giphy.gif" width="800" alt="Example Demo 2">
</p>


<p align="center">
  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXk4NW80MXh3YTNoYXJjbmE0anc3MGVoNnpxOGlycmpmaDBqZTlxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FXjOzKhNVAFCrzCfUq/giphy.gif" width="800" alt="Example Demo 3">
</p>

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
- **Token Size** - The grid size for this token form (Tiny to Gargantuan)

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

### Step 5b: Choose Token Size

Each image can have a different token size. Select from the dropdown:

- **Tiny (0.5×0.5)** - Half a grid square (pixies, fairies, small familiars)
- **Small (1×1)** - One grid square (halflings, gnomes, small creatures)
- **Medium (1×1)** - One grid square (humans, elves, most PCs) - **Default**
- **Large (2×2)** - Four grid squares (ogres, horses, bears)
- **Huge (3×3)** - Nine grid squares (giants, elephants, young dragons)
- **Gargantuan (4×4)** - Sixteen grid squares (ancient dragons, colossal creatures)

> **Automatic Scaling:** When you switch images, the token automatically resizes AND the particle effect scales to match!

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
5. The token automatically resizes to match the configured size

> **Note:** The button only appears if the token has multiple images configured.

---

## 💡 Tips & Examples

### Example 1: Werewolf Transformation
1. Configure your actor with:
   - Image 1: `human.png` + **Medium (1×1)** + no effect
   - Image 2: `werewolf.png` + **Large (2×2)** + effect `jb2a.explosion.01.orange` or custom `mycustomfile.explosion`
2. During combat, select the token and click 🔄
3. The token transforms with a dramatic explosion effect AND grows to 2×2 size!

### Example 2: Health States
1. Configure three images:
   - Healthy: `character-normal.png` + **Medium (1×1)**
   - Bloodied: `character-wounded.png` + **Medium (1×1)**
   - Unconscious: `character-down.png` + **Medium (1×1)**
2. Switch manually as the character takes damage

### Example 3: Growing Dragon
1. Configure a dragon that grows over time:
   - Baby: `dragon-baby.png` + **Tiny (0.5×0.5)** + `jb2a.energy_field.02.blue`
   - Young: `dragon-young.png` + **Large (2×2)** + `jb2a.explosion.blue`
   - Adult: `dragon-adult.png` + **Huge (3×3)** + `jb2a.explosion.orange`
   - Ancient: `dragon-ancient.png` + **Gargantuan (4×4)** + `jb2a.explosion.dark_red`
2. Each transformation makes the dragon bigger with appropriately scaled effects!

---

## ⚠️ Known Issues

### Effect Scaling with Different Token Sizes
When transitioning between tokens of **significantly different sizes**, particle effects may not appear perfectly centered or sized during the transformation animation.

**Workaround:** Effects are automatically scaled to match the target token size, but the transition moment may look slightly off. Choose effects that work well with size changes (explosions, auras) rather than directional effects (beams, projectiles).

### Image Resolution Differences
If you use images with **very different resolutions** for the same actor (e.g., 512x512 and 2048x2048), you may experience:
- Brief visual artifacts during the transition
- Slight misalignment of the token on the grid
- Performance issues with very large images

**Best Practice:** Use images with similar resolutions (e.g., all 1024x1024 or all 512x512) for the smoothest transitions. Foundry VTT recommends token images in the 256-1024 pixel range for optimal performance.

---

## ❓ Frequently Asked Questions

### Q: Can players configure Alter Ego?
**A:** No, only Game Masters can configure token images. This is intentional to prevent players from accidentally breaking things. The players can change images instead.

### Q: Do I need Sequencer and JB2A to use this module?
**A:** No! Sequencer and JB2A are **optional**. You can:
- Use Alter Ego without any effects
- Use your own custom video files (.webm, .mp4)
- You have to install Sequencer if you want to use any effects, JB2A if you want an entire database of effects ready on the fly.

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
**A:** Click the ✖ button at the end of the row in the configuration table. Or empty the input field!

### Q: Can I reorder images?
**A:** Not directly, but you can remove and re-add them in the desired order.

### Q: Does changing token size affect the actor's actual size in the game system?
**A:** No. This only changes the visual size of the token on the map. It does not modify the actor's size category in the game system (e.g., D&D 5e size). You'll need to update that separately if needed.

---

## 🔧 Troubleshooting

### "flatObject is not defined" error
This error comes from **other modules** that are incompatible with Foundry VTT v13. Common culprits:
- **Libwrapper** (old version)
- **Hooker** module
- Other modules using deprecated Foundry v12 APIs

**Solution:**
1. Update all your modules to their latest versions
2. Disable modules one by one to find the incompatible one
3. Check the module's GitHub for v13 compatibility updates

**Note:** This is NOT an Alter Ego bug. The module works correctly but another module is interfering.

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

### Token size doesn't change
- Make sure you've selected a size other than "Medium" in the dropdown
- Verify the token document has update permissions
- Check console (F12) for any errors during the transition
### Best pracice for image
- Use the same image of the actor as the first image in the table. 
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

All credits go to the respective teams. Alter Ego provides an interface to search and use them.

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
- **Sequencer Team:** For the excellent effects framework (MIT License)
- **JB2A Team:** For the amazing free animated assets library (CC BY-NC-SA 4.0)
- **Foundry Community:** For testing and feedback

---

**Need help?** Check the **💡 Help & Instructions** section inside the configuration dialog for quick reference!
