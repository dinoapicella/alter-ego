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
    this.registerSettings();
    this.registerHooks();
    this.checkDependencies();
  }
  
  /**
   * Registra le impostazioni del modulo
   */
  static registerSettings() {
    // Informazioni sul modulo
    game.settings.register(this.ID, 'about', {
      name: 'About Alter Ego',
      hint: 'Alter Ego v1.0.0 by Dino Apicella | Integrates with Sequencer (MIT) and JB2A (CC BY-NC-SA 4.0) for animated effects. These modules are optional - Alter Ego works standalone. All credits for effects go to their respective teams.',
      scope: 'world',
      config: true,
      type: String,
      default: '',
      onChange: () => {}
    });
    
    // Link Ko-fi
    game.settings.register(this.ID, 'support', {
      name: '☕ Support Development',
      hint: 'Enjoying Alter Ego? Support me on Ko-fi: https://ko-fi.com/dinoapicella',
      scope: 'world',
      config: true,
      type: String,
      default: '',
      onChange: () => {}
    });
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
    console.log('[ALTER EGO] Registrazione hooks...');
    
    // Hook per aggiungere bottone nel TokenHUD (barra sopra il token)
    Hooks.on('renderTokenHUD', (hud, html, data) => {
      this.addTokenHUDButton(hud, html, data);
    });
    
    // Hook per aggiungere bottoni nella scheda attore
    Hooks.on('renderActorSheet', this.addButtons.bind(this));
    Hooks.on('renderActorSheetV2', this.addButtons.bind(this));
    
    console.log('[ALTER EGO] Hooks registrati');
  }
  
  /**
   * Aggiunge bottone nel TokenHUD (barra sopra il token)
   */
  static addTokenHUDButton(hud, html, data) {
    const token = hud.object;
    
    if (!token?.actor) return;
    
    // Controlla se ha immagini configurate
    const config = token.actor.getFlag(this.ID, this.FLAGS.IMAGES);
    if (!config || !Array.isArray(config) || config.length === 0) return;
    
    // Converti html in jQuery se necessario (v13 passa HTMLElement)
    const $html = html instanceof jQuery ? html : $(html);
    
    // Crea il bottone
    const button = $(`
      <div class="control-icon alter-ego-hud" title="${game.i18n.localize('ALTER_EGO.TokenHUD.ChangeImage')}">
        <i class="fas fa-sync-alt"></i>
      </div>
    `);
    
    // Click sul bottone
    button.on('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await this.cycleTokenImage(token);
    });
    
    // Aggiungi il bottone alla barra (dopo gli altri controlli)
    const controls = $html.find('.col.right');
    if (controls.length > 0) {
      controls.append(button);
    } else {
      // Fallback: prova a trovare altri container
      const hudControls = $html.find('.control-icon').last();
      if (hudControls.length > 0) {
        button.insertAfter(hudControls);
      }
    }
  }

  /**
   * Aggiunge bottone Alter Ego nella scheda
   */
  static addButtons(sheet, html) {
    // Solo GM può vedere/usare Alter Ego
    if (!game.user.isGM) return;
    
    const $html = html instanceof jQuery ? html : $(html);
    const actor = sheet.actor;
    
    // Verifica se il bottone esiste già
    if ($html.find('.alter-ego-config').length > 0) return;
    
    // Crea bottone stile "Configure" / "Close"
    const alterEgoButton = $(`
      <a class="alter-ego-config" title="${game.i18n.localize('ALTER_EGO.Button.Title')}">
        <i class="fas fa-user-secret"></i>
        <span>${game.i18n.localize('ALTER_EGO.Button.Label')}</span>
      </a>
    `);
    
    // Click sul bottone apre il dialog
    alterEgoButton.on('click', (e) => {
      e.preventDefault();
      this.openDialog(actor);
    });
    
    // Trova dove inserire il bottone (cerca Configure, Close, ecc.)
    // In PF2e le schede hanno una sezione con Configure e Close
    const windowControls = $html.find('.window-header .window-controls, header .window-controls');
    const closeButton = $html.find('.window-header .close, header .close');
    
    if (closeButton.length > 0) {
      // Inserisci prima del bottone Close
      alterEgoButton.insertBefore(closeButton);
    } else if (windowControls.length > 0) {
      // Oppure aggiungi ai controls
      windowControls.prepend(alterEgoButton);
    } else {
      // Fallback: aggiungi in header
      const header = $html.find('.window-header, header').first();
      if (header.length > 0) {
        header.append(alterEgoButton);
      }
    }
  }

  /**
   * Apre il dialog di configurazione
   */
  static openDialog(actor) {
    const config = actor.getFlag(this.ID, this.FLAGS.IMAGES) || [];
    
    const images = config.map(item => {
      if (typeof item === 'string') {
        return { path: item, effect: '', size: 'medium' };
      }
      return { 
        path: item.path || '', 
        effect: item.effect || '', 
        size: item.size || 'medium' 
      };
    });
    
    let rows = '';
    images.forEach((img, idx) => {
      rows += this.createImageRow(idx, img.path, img.effect, img.size);
    });
    
    const content = `
      <style>
        .ae-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0;
        }
        .ae-table th {
          padding: 10px 8px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: #ddd;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #444;
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
          padding: 10px;
          background: linear-gradient(135deg, rgba(76,175,80,0.2) 0%, rgba(76,175,80,0.3) 100%);
          border: 1px solid rgba(76,175,80,0.5);
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #2d5a2f;
          margin-top: 8px;
          transition: all 0.2s;
        }
        .ae-btn-add:hover {
          background: linear-gradient(135deg, rgba(76,175,80,0.3) 0%, rgba(76,175,80,0.4) 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(76,175,80,0.3);
        }
        .ae-help {
          margin-top: 12px;
          padding: 10px;
          background: linear-gradient(135deg, rgba(33,150,243,0.08) 0%, rgba(3,169,244,0.08) 100%);
          border: 1px solid rgba(33,150,243,0.25);
          border-left: 3px solid rgba(33,150,243,0.6);
          border-radius: 4px;
          font-size: 11px;
          color: #444;
          line-height: 1.6;
        }
        .ae-help-toggle {
          cursor: pointer;
          user-select: none;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1976D2;
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
          color: #1565C0;
          margin-bottom: 4px;
        }
        .ae-help-example {
          font-family: 'Courier New', monospace;
          background: rgba(33,150,243,0.12);
          padding: 4px 6px;
          border-radius: 2px;
          color: #1565C0;
          display: inline-block;
          margin: 2px 0;
        }
        .ae-kofi {
          margin-top: 12px;
          padding: 10px 12px;
          background: linear-gradient(135deg, rgba(255,95,95,0.12) 0%, rgba(255,165,0,0.12) 100%);
          border: 1px solid rgba(255,95,95,0.25);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .ae-kofi-text {
          color: #555;
          font-weight: 600;
          font-size: 12px;
        }
        .ae-kofi-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #FF5F5F;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 11px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .ae-kofi-link:hover {
          background: #ff7a7a;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(255,95,95,0.3);
          color: white;
        }
        .ae-kofi-icon {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }
      </style>
      
      <form>
        <table class="ae-table">
          <thead>
            <tr>
              <th style="width: 25px;">${game.i18n.localize('ALTER_EGO.Table.Number')}</th>
              <th style="width: 40%;">${game.i18n.localize('ALTER_EGO.Table.ImagePath')}</th>
              <th style="width: 40%;">${game.i18n.localize('ALTER_EGO.Table.EffectPath')}</th>
              <th style="width: 100px;">${game.i18n.localize('ALTER_EGO.Table.Size')}</th>
              <th style="width: 25px;"></th>
            </tr>
          </thead>
          <tbody id="images-table">
            ${rows || `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #777;">${game.i18n.localize('ALTER_EGO.Dialog.NoImages')}</td></tr>`}
          </tbody>
        </table>
        
        <button type="button" id="add-image-row" class="ae-btn-add">
          ${game.i18n.localize('ALTER_EGO.Dialog.AddImage')}
        </button>
        
        <div class="ae-help">
          <div class="ae-help-toggle">
            ${game.i18n.localize('ALTER_EGO.Help.Title')} <span style="float: right;">▼</span>
          </div>
          <div class="ae-help-content hidden">
            <div class="ae-help-section">
              <div class="ae-help-title">${game.i18n.localize('ALTER_EGO.Help.ImagesTitle')}</div>
              • ${game.i18n.localize('ALTER_EGO.Help.ImagesOption1')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.ImagesOption2')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.ImagesExample')} <span class="ae-help-example">worlds/my-world/tokens/goblin.png</span>
            </div>
            
            <div class="ae-help-section">
              <div class="ae-help-title">${game.i18n.localize('ALTER_EGO.Help.EffectsTitle')}</div>
              • ${game.i18n.localize('ALTER_EGO.Help.EffectsWithJB2A')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.EffectsWithoutJB2A')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.EffectsCustomFiles')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.EffectsManual')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.EffectsExampleJB2A')} <span class="ae-help-example">jb2a.explosion.blue</span><br>
              • ${game.i18n.localize('ALTER_EGO.Help.EffectsExampleCustom')} <span class="ae-help-example">worlds/my-world/effects/nova.webm</span>
            </div>
            
            <div class="ae-help-section">
              <div class="ae-help-title">${game.i18n.localize('ALTER_EGO.Help.HowItWorksTitle')}</div>
              • ${game.i18n.localize('ALTER_EGO.Help.HowItWorks1')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.HowItWorks2')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.HowItWorks3')}
            </div>
            
            <div class="ae-help-section">
              <div class="ae-help-title">${game.i18n.localize('ALTER_EGO.Help.SizeTitle')}</div>
              ${game.i18n.localize('ALTER_EGO.Help.SizeInfo')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.SizeTiny')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.SizeSmall')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.SizeMedium')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.SizeLarge')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.SizeHuge')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.SizeGargantuan')}
            </div>
            
            <div class="ae-help-section">
              <div class="ae-help-title">${game.i18n.localize('ALTER_EGO.Help.JB2ATitle')}</div>
              • ${game.i18n.localize('ALTER_EGO.Help.JB2AOptional')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.JB2AWithout')}<br>
              • ${game.i18n.localize('ALTER_EGO.Help.JB2AInstall')}
            </div>
          </div>
        </div>
        
        <div class="ae-kofi">
          <span class="ae-kofi-text">${game.i18n.localize('ALTER_EGO.Support.Enjoy')}</span>
          <a href="https://ko-fi.com/dinoapicella" target="_blank" class="ae-kofi-link">
            <svg class="ae-kofi-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
            </svg>
            ${game.i18n.localize('ALTER_EGO.Support.Support')}
          </a>
        </div>
      </form>
    `;
    
    const dialog = new Dialog({
      title: game.i18n.format('ALTER_EGO.Dialog.Title', {name: actor.name}),
      content: content,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: game.i18n.localize('ALTER_EGO.Dialog.Save'),
          callback: async (html) => {
            const images = [];
            html.find('.ae-row').each(function() {
              const path = $(this).find('.img-path').val().trim();
              const effect = $(this).find('.effect-path').val().trim();
              const size = $(this).find('.token-size').val() || 'medium';
              
              if (path) {
                images.push({ path, effect: effect || '', size });
              }
            });
            
            try {
              await actor.setFlag(AlterEgo.ID, AlterEgo.FLAGS.IMAGES, images);
              await actor.setFlag(AlterEgo.ID, AlterEgo.FLAGS.CURRENT_INDEX, 0);
              
              ui.notifications.info(game.i18n.format('ALTER_EGO.Notifications.ImagesSaved', {count: images.length}));
            } catch (error) {
              console.error('[ALTER EGO] Error saving configuration:', error);
              ui.notifications.error('Error saving configuration. Check console for details.');
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('ALTER_EGO.Dialog.Cancel')
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
  static createImageRow(index, imagePath = '', effectPath = '', size = 'medium') {
    const sizeOptions = [
      { value: 'tiny', label: 'Tiny (0.5×0.5)' },
      { value: 'small', label: 'Small (1×1)' },
      { value: 'medium', label: 'Medium (1×1)' },
      { value: 'large', label: 'Large (2×2)' },
      { value: 'huge', label: 'Huge (3×3)' },
      { value: 'gargantuan', label: 'Gargantuan (4×4)' }
    ];
    
    const sizeOptionsHTML = sizeOptions.map(opt => 
      `<option value="${opt.value}" ${opt.value === size ? 'selected' : ''}>${opt.label}</option>`
    ).join('');
    
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
            <button type="button" class="browse-img ae-btn-icon" title="${game.i18n.localize('ALTER_EGO.Table.BrowseImage')}">
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
            <button type="button" class="browse-jb2a ae-btn-icon" title="${game.i18n.localize('ALTER_EGO.Table.SearchJB2A')}">
              🔍
            </button>
            <button type="button" class="browse-effect ae-btn-icon" title="${game.i18n.localize('ALTER_EGO.Table.BrowseEffect')}">
              📁
            </button>
          </div>
        </td>
        <td>
          <select class="token-size ae-input" style="width: 100%; padding: 5px 4px;">
            ${sizeOptionsHTML}
          </select>
        </td>
        <td style="text-align: center;">
          <button type="button" class="remove-row ae-btn-icon ae-btn-remove" title="${game.i18n.localize('ALTER_EGO.Table.Remove')}">
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
          placeholder="${game.i18n.localize('ALTER_EGO.EffectBrowser.Search')}" 
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
          ${game.i18n.format('ALTER_EGO.EffectBrowser.Available', {count: effects.length})}
        </p>
      </div>
    `;
    
    const effectDialog = new Dialog({
      title: game.i18n.localize('ALTER_EGO.EffectBrowser.Title'),
      content: content,
      buttons: {
        clear: {
          label: game.i18n.localize('ALTER_EGO.EffectBrowser.Clear'),
          callback: () => {
            targetInput.val('');
          }
        },
        cancel: {
          label: game.i18n.localize('ALTER_EGO.EffectBrowser.Close')
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
        return { path: item, effect: '', size: 'medium' };
      }
      return { 
        path: item.path || '', 
        effect: item.effect || '', 
        size: item.size || 'medium' 
      };
    });

    // Ottieni l'indice corrente dal TOKEN (non dall'attore - evita conflitti)
    let currentIndex = token.document.getFlag(this.ID, this.FLAGS.CURRENT_INDEX) || 0;
    
    // Incrementa (con wrap)
    currentIndex = (currentIndex + 1) % images.length;
    
    // Nuova immagine, effetto e size
    const newImage = images[currentIndex];
    const imagePath = newImage.path;
    const effectPath = newImage.effect;
    const size = newImage.size || 'medium';
    
    try {
      // Converti size in dimensioni griglia Foundry
      const sizeMap = {
        'tiny': 0.5,
        'small': 1,
        'medium': 1,
        'large': 2,
        'huge': 3,
        'gargantuan': 4
      };
      
      const gridSize = sizeMap[size] || 1;
      
      // Riproduci l'effetto (se c'è) con la scala giusta
      if (effectPath && effectPath.trim() !== '') {
        await this.playEffect(token, effectPath, gridSize);
      }
      
      // Cambia l'immagine E la dimensione del token
      await token.document.update({ 
        'texture.src': imagePath,
        'width': gridSize,
        'height': gridSize
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
  static async playEffect(token, effectPath, scale = 1.0) {
    // Verifica Sequencer (silenzioso - nessun popup)
    if (typeof Sequencer === 'undefined') {
      return;
    }
    
    // Determina se è un file custom o un effetto del database
    const isCustomFile = effectPath.includes('/') || 
                         effectPath.endsWith('.webm') || 
                         effectPath.endsWith('.mp4') || 
                         effectPath.endsWith('.gif') ||
                         effectPath.endsWith('.apng');
    
    if (isCustomFile) {
      // File custom - usa direttamente il percorso
      try {
        await new Sequence()
          .effect()
            .file(effectPath)
            .atLocation(token)
            .scale(scale)
            .duration(2000)
            .fadeIn(200)
            .fadeOut(500)
          .play();
      } catch (error) {
        console.error('[ALTER EGO] Custom effect error:', error);
        // Nessun popup
      }
      
      return;
    }
    
    // Effetto del database (JB2A o altro)
    try {
      const exists = await Sequencer.Database.entryExists(effectPath);
      
      if (!exists) {
        console.warn(`[ALTER EGO] Effect not found: ${effectPath}`);
        return; // Nessun popup
      }
      
      await new Sequence()
        .effect()
          .file(effectPath)
          .atLocation(token)
          .scale(scale)
          .duration(2000)
          .fadeIn(200)
          .fadeOut(500)
        .play();
      
    } catch (error) {
      console.error('[ALTER EGO] Effect error:', error);
      // Nessun popup
    }
  }
}

// Inizializza il modulo
Hooks.once('ready', () => {
  AlterEgo.initialize();
});
