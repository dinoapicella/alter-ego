/**
 * Alter Ego Module per Foundry VTT v13
 * Permette di ciclare tra diverse immagini del token configurate nell'attore
 */

class AlterEgo {
  static ID = 'alter-ego';
  static FLAGS = {
    IMAGES: 'tokenImages',
    CURRENT_INDEX: 'currentIndex'
  };

  /**
   * Inizializza il modulo
   */
  static initialize() {
    console.log(`%c[ALTER EGO] Modulo attivato`, 'color: #ff6400; font-weight: bold;');
    this.registerHooks();
    this.checkDependencies();
  }
  
  /**
   * Verifica se i moduli necessari sono installati
   */
  static checkDependencies() {
    const hasSequencer = typeof Sequencer !== 'undefined';
    
    if (!hasSequencer) {
      console.warn('[ALTER EGO] ⚠️ Sequencer non installato - effetti particellari disabilitati');
      return;
    }
    
    // Verifica se ci sono effetti caricati (controlla namespace comuni)
    const hasEffects = Sequencer.Database && Sequencer.Database.entries && 
                       (Sequencer.Database.entries.jb2a || 
                        Sequencer.Database.entries.jb2apatreon ||
                        Object.keys(Sequencer.Database.entries).length > 0);
    
    if (!hasEffects) {
      console.warn('[ALTER EGO] ⚠️ Nessuna libreria di effetti caricata (JB2A consigliato)');
    } else {
      // Conta gli effetti totali
      try {
        const jb2aEffects = Sequencer.Database.entries.jb2a ? 
          Sequencer.Database.getPathsUnder("jb2a").length : 0;
        
        if (jb2aEffects > 0) {
          console.log(`[ALTER EGO] ✅ JB2A caricato con ${jb2aEffects} effetti disponibili`);
        } else {
          console.log('[ALTER EGO] ✅ Sequencer caricato (libreria effetti personalizzata)');
        }
      } catch (e) {
        console.log('[ALTER EGO] ✅ Sequencer caricato');
      }
    }
  }

  /**
   * Registra gli hooks necessari
   */
  static registerHooks() {
    // Hook per aggiungere il pulsante al menu contestuale del token
    Hooks.on('getTokenHUDContextMenuOptions', this.addContextMenuOption.bind(this));
    
    // Hook per aggiungere bottoni nella scheda attore
    Hooks.on('renderActorSheet', this.addButtons.bind(this));
    Hooks.on('renderActorSheetV2', this.addButtons.bind(this));
    
    // Keybinding per cambiare immagine con tasti
    this.registerKeybinding();
  }
  
  /**
   * Registra la keybinding per cambiare immagine
   */
  static registerKeybinding() {
    game.keybindings.register(this.ID, 'cycle-image', {
      name: 'Cambia Immagine Token Selezionato',
      hint: 'Cicla tra le immagini alternative del token selezionato',
      editable: [
        {
          key: 'KeyE',
          modifiers: ['Shift']
        }
      ],
      onDown: () => {
        const controlled = canvas.tokens.controlled;
        if (controlled.length === 1) {
          this.cycleTokenImage(controlled[0]);
        } else if (controlled.length === 0) {
          ui.notifications.warn('⚠️ Seleziona un token prima');
        } else {
          ui.notifications.warn('⚠️ Seleziona un solo token');
        }
        return true;
      }
    });
  }

  /**
   * Aggiunge bottoni nella title bar della scheda
   */
  static addButtons(sheet, html) {
    const $html = html instanceof jQuery ? html : $(html);
    const actor = sheet.actor;
    
    // Verifica se i bottoni esistono già
    if ($html.find('.alter-ego-button').length > 0) return;
    
    // Bottone 1: Configura immagini
    const configButton = $(`
      <a class="alter-ego-button" title="Alter Ego - Configura Immagini Alternative">
        <i class="fas fa-cog"></i>
      </a>
    `);
    
    // Bottone 2: Cambia immagine ora
    const cycleButton = $(`
      <a class="alter-ego-cycle-button" title="Cambia Immagine Token Ora (Shift+E)">
        <i class="fas fa-sync-alt"></i>
      </a>
    `);
    
    // Aggiungi i bottoni nella title bar
    const headerButtons = $html.find('.window-header .header-button, .window-title').last();
    if (headerButtons.length > 0) {
      cycleButton.insertAfter(headerButtons);
      configButton.insertAfter(headerButtons);
    } else {
      // Fallback
      const titleBar = $html.find('.window-header, header.sheet-header').first();
      if (titleBar.length > 0) {
        titleBar.append(configButton);
        titleBar.append(cycleButton);
      }
    }
    
    // Click sul bottone configura apre il dialog
    configButton.on('click', (e) => {
      e.preventDefault();
      this.openDialog(actor);
    });
    
    // Click sul bottone cambia immagine
    cycleButton.on('click', async (e) => {
      e.preventDefault();
      
      // Trova il token di questo attore sulla scena
      const tokens = canvas.tokens.placeables.filter(t => t.actor?.id === actor.id);
      
      if (tokens.length === 0) {
        ui.notifications.warn('⚠️ Nessun token di questo attore sulla mappa');
        return;
      }
      
      if (tokens.length === 1) {
        await this.cycleTokenImage(tokens[0]);
      } else {
        ui.notifications.info(`ℹ️ Ci sono ${tokens.length} token di ${actor.name}. Selezionane uno e premi Shift+E`);
      }
    });
  }

  /**
   * Apre il dialog di configurazione
   */
  static openDialog(actor) {
    const config = actor.getFlag(this.ID, this.FLAGS.IMAGES) || [];
    
    const images = config.map(item => {
      if (typeof item === 'string') {
        return { path: item, effect: '' };
      }
      return item;
    });
    
    let rows = '';
    images.forEach((img, idx) => {
      rows += this.createImageRow(idx, img.path, img.effect);
    });
    
    const content = `
      <style>
        .ae-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0;
        }
        .ae-table th {
          background: rgba(0,0,0,0.2);
          padding: 6px 8px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          border-bottom: 1px solid #444;
          color: #333;
        }
        .ae-table td {
          padding: 4px 8px;
          border-bottom: 1px solid #333;
          vertical-align: middle;
        }
        .ae-input-wrapper {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .ae-input {
          flex: 1;
          padding: 5px 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid #555;
          border-radius: 2px;
          color: #222;
          font-size: 12px;
          font-family: 'Courier New', monospace;
        }
        .ae-input:focus {
          outline: none;
          border-color: #888;
          background: rgba(255,255,255,0.08);
        }
        .ae-btn-icon {
          width: 24px;
          height: 24px;
          padding: 0;
          background: rgba(255,255,255,0.08);
          border: 1px solid #555;
          border-radius: 2px;
          cursor: pointer;
          font-size: 11px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ae-btn-icon:hover {
          background: rgba(255,255,255,0.15);
          border-color: #777;
        }
        .ae-btn-remove {
          background: rgba(180,60,60,0.3);
          border-color: #844;
        }
        .ae-btn-remove:hover {
          background: rgba(180,60,60,0.5);
        }
        .ae-btn-add {
          width: 100%;
          padding: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid #555;
          border-radius: 2px;
          cursor: pointer;
          font-size: 12px;
          color: #333;
          margin-top: 8px;
        }
        .ae-btn-add:hover {
          background: rgba(255,255,255,0.15);
        }
        .ae-help {
          margin-top: 12px;
          padding: 10px;
          background: rgba(0,0,0,0.08);
          border-left: 2px solid #666;
          border-radius: 2px;
          font-size: 11px;
          color: #444;
          line-height: 1.6;
        }
        .ae-help-toggle {
          cursor: pointer;
          user-select: none;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .ae-help-content {
          line-height: 1.7;
        }
        .ae-help-content.hidden { display: none; }
        .ae-help-section {
          margin: 8px 0;
        }
        .ae-help-title {
          font-weight: 600;
          color: #222;
          margin-bottom: 4px;
        }
        .ae-help-example {
          font-family: 'Courier New', monospace;
          background: rgba(0,0,0,0.05);
          padding: 4px 6px;
          border-radius: 2px;
          color: #333;
          display: inline-block;
          margin: 2px 0;
        }
      </style>
      
      <form>
        <table class="ae-table">
          <thead>
            <tr>
              <th style="width: 25px;">#</th>
              <th style="width: 48%;">Token Image Path</th>
              <th style="width: 48%;">Effect Path (optional)</th>
              <th style="width: 25px;"></th>
            </tr>
          </thead>
          <tbody id="images-table">
            ${rows || '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #777;">No images configured</td></tr>'}
          </tbody>
        </table>
        
        <button type="button" id="add-image-row" class="ae-btn-add">
          + Add Image
        </button>
        
        <div class="ae-help">
          <div class="ae-help-toggle">
            💡 Help & Instructions <span style="float: right;">▼</span>
          </div>
          <div class="ae-help-content hidden">
            <div class="ae-help-section">
              <div class="ae-help-title">📁 Token Images:</div>
              • <strong>Option 1 - Browse:</strong> Click 📁 button → navigate folders → double-click image<br>
              • <strong>Option 2 - Write path:</strong> Type manually in the field<br>
              • <strong>Example:</strong> <span class="ae-help-example">worlds/my-world/tokens/goblin.png</span>
            </div>
            
            <div class="ae-help-section">
              <div class="ae-help-title">✨ Effects (optional):</div>
              • <strong>With JB2A installed:</strong> Click 🔍 → search effects → click to select<br>
              • <strong>Without JB2A:</strong> Use your own .webm/.mp4 files<br>
              • <strong>Custom files:</strong> Click 📁 → browse → double-click video file<br>
              • <strong>Manual entry:</strong> Type path or JB2A effect name<br>
              • <strong>Example JB2A:</strong> <span class="ae-help-example">jb2a.explosion.blue</span><br>
              • <strong>Example custom:</strong> <span class="ae-help-example">worlds/my-world/effects/nova.webm</span>
            </div>
            
            <div class="ae-help-section">
              <div class="ae-help-title">🎬 How it works:</div>
              • Effect plays when you <strong>change TO</strong> that image<br>
              • Leave effect field empty = no effect<br>
              • After saving, use green 🔄 button or press <strong>Shift+E</strong> to cycle images
            </div>
            
            <div class="ae-help-section">
              <div class="ae-help-title">📦 JB2A Module:</div>
              • <strong>Optional:</strong> JB2A provides 1600+ animated effects<br>
              • <strong>Without JB2A:</strong> You can still use your own effect files<br>
              • <strong>To install JB2A:</strong> Manage Modules → Install "JB2A - Free"
            </div>
          </div>
        </div>
      </form>
    `;
    
    const dialog = new Dialog({
      title: `Alter Ego - ${actor.name}`,
      content: content,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: 'Save',
          callback: async (html) => {
            const images = [];
            html.find('.ae-row').each(function() {
              const path = $(this).find('.img-path').val().trim();
              const effect = $(this).find('.effect-path').val().trim();
              
              if (path) {
                images.push({ path, effect: effect || '' });
              }
            });
            
            await actor.setFlag(AlterEgo.ID, AlterEgo.FLAGS.IMAGES, images);
            await actor.setFlag(AlterEgo.ID, AlterEgo.FLAGS.CURRENT_INDEX, 0);
            
            ui.notifications.info(`✅ ${images.length} images saved`);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        }
      },
      default: 'save',
      render: (html) => {
        this.attachDialogHandlers(html);
      }
    }, {
      width: 850,
      height: 650,
      resizable: true
    });
    
    dialog.render(true);
  }
  
  /**
   * Crea una riga della tabella
   */
  static createImageRow(index, imagePath = '', effectPath = '') {
    return `
      <tr class="ae-row">
        <td style="text-align: center; color: #666; font-weight: 600;">${index + 1}</td>
        <td>
          <div class="ae-input-wrapper">
            <input 
              type="text" 
              class="img-path ae-input" 
              value="${imagePath}"
            />
            <button type="button" class="browse-img ae-btn-icon" title="Browse images">
              📁
            </button>
          </div>
        </td>
        <td>
          <div class="ae-input-wrapper">
            <input 
              type="text" 
              class="effect-path ae-input" 
              value="${effectPath}"
            />
            <button type="button" class="browse-jb2a ae-btn-icon" title="Search JB2A effects">
              🔍
            </button>
            <button type="button" class="browse-effect ae-btn-icon" title="Browse effect files">
              📁
            </button>
          </div>
        </td>
        <td style="text-align: center;">
          <button type="button" class="remove-row ae-btn-icon ae-btn-remove" title="Remove">
            ✖
          </button>
        </td>
      </tr>
    `;
  }
  
  /**
   * Collega i gestori eventi
   */
  static attachDialogHandlers(html) {
    // Toggle help
    html.find('.ae-help-toggle').on('click', function() {
      const content = html.find('.ae-help-content');
      const arrow = $(this).find('span');
      content.toggleClass('hidden');
      arrow.text(content.hasClass('hidden') ? '▼' : '▲');
    });
    
    // Aggiungi riga
    html.find('#add-image-row').on('click', () => {
      const tbody = html.find('#images-table');
      
      if (tbody.find('td[colspan]').length > 0) {
        tbody.empty();
      }
      
      const newIndex = tbody.find('tr').length;
      const newRow = $(this.createImageRow(newIndex));
      tbody.append(newRow);
      
      this.attachRowHandlers(newRow);
    });
    
    // Handler per righe esistenti
    html.find('.ae-row').each((i, row) => {
      this.attachRowHandlers($(row));
    });
  }
  
  /**
   * Collega handler a una riga
   */
  static attachRowHandlers(row) {
    // Browse immagine
    row.find('.browse-img').on('click', function() {
      const input = row.find('.img-path');
      
      new FilePicker({
        type: "image",
        current: input.val(),
        callback: (path) => {
          input.val(path);
        }
      }).browse();
    });
    
    // Browse effetto JB2A
    row.find('.browse-jb2a').on('click', function() {
      AlterEgo.openEffectBrowser(row.find('.effect-path'));
    });
    
    // Browse effetto file
    row.find('.browse-effect').on('click', function() {
      const input = row.find('.effect-path');
      
      new FilePicker({
        type: "video",
        current: input.val(),
        callback: (path) => {
          input.val(path);
        }
      }).browse();
    });
    
    // Rimuovi
    row.find('.remove-row').on('click', function() {
      row.remove();
      
      const tbody = row.closest('tbody');
      tbody.find('tr').each((idx, r) => {
        $(r).find('td:first').text(idx + 1);
      });
      
      if (tbody.find('tr').length === 0) {
        tbody.html('<tr><td colspan="4" style="text-align: center; padding: 20px; color: #777;">No images configured</td></tr>');
      }
    });
  }
  
  /**
   * Apre il browser effetti JB2A
   */
  static openEffectBrowser(targetInput) {
    if (typeof Sequencer === 'undefined' || !Sequencer.Database) {
      ui.notifications.warn('⚠️ Sequencer not installed');
      return;
    }
    
    let effects = [];
    try {
      const jb2aEntries = Sequencer.Database.entries.jb2a;
      
      if (!jb2aEntries) {
        ui.notifications.warn('⚠️ JB2A not found');
        return;
      }
      
      const extractPaths = (obj, paths = []) => {
        for (const key in obj) {
          const entry = obj[key];
          
          if (entry && entry.dbPath) {
            paths.push(entry.dbPath);
          }
          
          if (entry && typeof entry === 'object' && !entry.dbPath) {
            extractPaths(entry, paths);
          }
        }
        return paths;
      };
      
      effects = extractPaths(jb2aEntries);
      effects = [...new Set(effects)].sort();
      
    } catch (e) {
      console.error('[ALTER EGO] Error extracting effects:', e);
      ui.notifications.warn('⚠️ Error loading JB2A effects');
      return;
    }
    
    if (effects.length === 0) {
      ui.notifications.warn('⚠️ No JB2A effects found');
      return;
    }
    
    const effectsList = effects.map(dbPath => `
      <div class="fx-item" data-dbpath="${dbPath}" style="
        padding: 5px 8px;
        margin: 1px 0;
        background: rgba(0,0,0,0.05);
        border-left: 2px solid #666;
        cursor: pointer;
        font-size: 11px;
        font-family: 'Courier New', monospace;
        color: #333;
      " onmouseover="this.style.background='rgba(0,0,0,0.15)'" 
         onmouseout="this.style.background='rgba(0,0,0,0.05)'">
        ${dbPath}
      </div>
    `).join('');
    
    const content = `
      <div style="display: flex; flex-direction: column; height: 500px;">
        <input 
          type="text" 
          id="fx-search" 
          placeholder="Search: explosion, fire, nova, magic..." 
          style="
            padding: 8px;
            margin-bottom: 8px;
            background: rgba(0,0,0,0.05);
            border: 1px solid #555;
            border-radius: 2px;
            color: #222;
            font-size: 12px;
          "
        />
        <div style="flex: 1; overflow-y: auto; border: 1px solid #555; border-radius: 2px; padding: 4px; background: rgba(0,0,0,0.02);">
          <div id="fx-list">${effectsList}</div>
        </div>
        <p style="margin-top: 8px; font-size: 11px; color: #555;">
          ${effects.length} effects available | Click to select
        </p>
      </div>
    `;
    
    const effectDialog = new Dialog({
      title: "Search JB2A Effect",
      content: content,
      buttons: {
        clear: {
          label: 'Clear',
          callback: () => {
            targetInput.val('');
          }
        },
        cancel: {
          label: 'Close'
        }
      },
      render: (html) => {
        html.find('#fx-search').on('input', function() {
          const search = $(this).val().toLowerCase();
          html.find('.fx-item').each(function() {
            const dbPath = $(this).data('dbpath').toLowerCase();
            $(this).toggle(dbPath.includes(search));
          });
        });
        
        html.find('.fx-item').on('click', function() {
          const dbPath = $(this).data('dbpath');
          targetInput.val(dbPath);
          effectDialog.close();
        });
      }
    }, {
      width: 700,
      height: 650
    });
    
    effectDialog.render(true);
  }

  /**
   * Aggiunge l'opzione al menu contestuale del token
   */
  static addContextMenuOption(html, options) {
    options.push({
      name: '🔄 Cambia Immagine Token',
      icon: '<i class="fas fa-sync-alt"></i>',
      condition: (li) => {
        const token = canvas.tokens.get(li.data('token-id'));
        if (!token?.actor) return false;
        
        const config = token.actor.getFlag(this.ID, this.FLAGS.IMAGES);
        if (!config || !Array.isArray(config) || config.length === 0) return false;
        
        return true;
      },
      callback: (li) => {
        const token = canvas.tokens.get(li.data('token-id'));
        if (token) this.cycleTokenImage(token);
      }
    });
  }

  /**
   * Cicla l'immagine del token
   */
  static async cycleTokenImage(token) {
    if (!token?.actor) {
      return;
    }

    const config = token.actor.getFlag(this.ID, this.FLAGS.IMAGES);
    
    if (!config || !Array.isArray(config) || config.length === 0) {
      return;
    }

    // Converti vecchio formato in nuovo formato se necessario
    const images = config.map(item => {
      if (typeof item === 'string') {
        return { path: item, effect: '' };
      }
      return item;
    });

    // Ottieni l'indice corrente dal TOKEN (non dall'attore - evita conflitti)
    let currentIndex = token.document.getFlag(this.ID, this.FLAGS.CURRENT_INDEX) || 0;
    
    // Incrementa (con wrap)
    currentIndex = (currentIndex + 1) % images.length;
    
    // Nuova immagine e effetto
    const newImage = images[currentIndex];
    const imagePath = newImage.path;
    const effectPath = newImage.effect;
    
    try {
      // Riproduci l'effetto (se c'è)
      if (effectPath && effectPath.trim() !== '') {
        await this.playEffect(token, effectPath);
      }
      
      // Cambia l'immagine del token
      await token.document.update({ 
        'texture.src': imagePath 
      });
      
      // Salva l'indice sul TOKEN (non sull'attore - evita conflitti)
      try {
        await token.document.setFlag(this.ID, this.FLAGS.CURRENT_INDEX, currentIndex);
      } catch (e) {
        // Ignora errori di salvataggio flag
      }
      
    } catch (error) {
      console.error('[ALTER EGO] Error:', error);
    }
  }
  
  /**
   * Riproduce un effetto sul token
   */
  static async playEffect(token, effectPath) {
    // Verifica Sequencer
    if (typeof Sequencer === 'undefined') {
      console.warn('[ALTER EGO] Sequencer non installato');
      ui.notifications.error('❌ Installa "Sequencer" dai moduli di Foundry per gli effetti');
      return;
    }
    
    console.log(`[ALTER EGO] Riproduzione effetto: ${effectPath}`);
    
    // Determina se è un file custom o un effetto del database
    const isCustomFile = effectPath.includes('/') || 
                         effectPath.endsWith('.webm') || 
                         effectPath.endsWith('.mp4') || 
                         effectPath.endsWith('.gif') ||
                         effectPath.endsWith('.apng');
    
    if (isCustomFile) {
      // File custom - usa direttamente il percorso
      console.log('[ALTER EGO] File custom rilevato');
      
      try {
        await new Sequence()
          .effect()
            .file(effectPath)
            .atLocation(token)
            .scale(1.0)
            .duration(2000)
            .fadeIn(200)
            .fadeOut(500)
          .play();
        
        console.log(`[ALTER EGO] ✅ Effetto custom riprodotto!`);
        
      } catch (error) {
        console.error('[ALTER EGO] Errore:', error);
        ui.notifications.error(`❌ File non trovato: ${effectPath}`);
        ui.notifications.info('💡 Verifica che il file esista e il percorso sia corretto');
      }
      
      return;
    }
    
    // Effetto del database (JB2A o altro)
    console.log('[ALTER EGO] Effetto database (JB2A)');
    
    try {
      // Controlla se l'effetto esiste (Sequencer gestisce il database internamente)
      const exists = await Sequencer.Database.entryExists(effectPath);
      
      if (!exists) {
        console.error(`[ALTER EGO] Effetto "${effectPath}" non trovato nel database`);
        ui.notifications.error(`❌ Effetto "${effectPath}" non trovato!`);
        
        // Prova a suggerire alternative
        const keywords = effectPath.split('.').pop(); // ultima parola (es. "blue" da "jb2a.explosion.blue")
        ui.notifications.info(`💡 Cerca effetti disponibili nella console: Sequencer.Database.getPathsUnder("jb2a").filter(e => e.includes("${keywords}"))`);
        
        return;
      }
      
      // Riproduci l'effetto
      console.log('[ALTER EGO] Riproduzione in corso...');
      
      await new Sequence()
        .effect()
          .file(effectPath)
          .atLocation(token)
          .scale(1.0)
          .duration(2000)
          .fadeIn(200)
          .fadeOut(500)
        .play();
      
      console.log(`[ALTER EGO] ✅ Effetto riprodotto con successo!`);
      
    } catch (error) {
      console.error('[ALTER EGO] Errore durante la riproduzione:', error);
      
      if (error.message && error.message.includes('Invalid Asset')) {
        ui.notifications.error(`❌ File dell'effetto non trovato: ${effectPath}`);
        ui.notifications.info('💡 L\'effetto esiste nel database ma il file è mancante. Prova a reinstallare JB2A.');
      } else {
        ui.notifications.warn(`⚠️ Errore: ${error.message}`);
      }
    }
  }
}

// Inizializza il modulo
Hooks.once('ready', () => {
  AlterEgo.initialize();
});
