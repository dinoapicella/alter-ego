# Alter Ego - Modulo per Foundry VTT v13

## Descrizione
Alter Ego permette di cambiare rapidamente l'immagine di un token ciclando tra diverse immagini alternative configurate direttamente nella scheda dell'attore. Perfetto per personaggi con identità multiple, trasformazioni, o stati diversi.

## Caratteristiche
- ✅ Menu contestuale sul token (click destro)
- ✅ Campo personalizzato nella scheda dell'attore
- ✅ Cicla automaticamente tra le immagini
- ✅ Memoria dell'immagine corrente
- ✅ Completamente in italiano

## Installazione

1. Scarica tutti i file del modulo
2. Copia la cartella `alter-ego` in: `Data/modules/`
3. La struttura finale deve essere:
   ```
   Data/modules/alter-ego/
   ├── module.json
   ├── scripts/
   │   └── alter-ego.js
   ├── styles/
   │   └── alter-ego.css
   └── lang/
       └── it.json
   ```
4. Riavvia Foundry VTT
5. Nella schermata di setup del mondo, vai su "Gestisci Moduli"
6. Cerca "Alter Ego" e attivalo
7. Lancia il mondo

## Come Usare

### Passo 1: Configurare le Immagini Alternative
1. Apri la scheda di un attore (PG o PNG)
2. Nella tab "Prototype Token" troverai un nuovo campo chiamato "Immagini Alternative del Token"
3. Inserisci i percorsi delle immagini, uno per riga, ad esempio:
   ```
   worlds/mioMondo/tokens/clark-kent.png
   worlds/mioMondo/tokens/superman.png
   ```
4. Salva l'attore

### Passo 2: Usare il Token sulla Mappa
1. Posiziona il token dell'attore sulla mappa
2. Fai click destro sul token
3. Seleziona "Cambia Immagine Token" dal menu
4. L'immagine cambierà alla successiva nell'elenco
5. Quando arrivi all'ultima, ripartirà dalla prima

## Percorsi delle Immagini
Puoi usare diversi tipi di percorsi:

- **Percorso del mondo**: `worlds/nomeMondo/tokens/immagine.png`
- **Percorso del sistema**: `systems/dnd5e/tokens/immagine.png`
- **Percorso dei moduli**: `modules/mioModulo/tokens/immagine.png`
- **URL esterno**: `https://esempio.com/immagine.png`

## Casi d'Uso Ideali

### 🦸 Identità Segrete
- Clark Kent ↔ Superman
- Bruce Wayne ↔ Batman
- Peter Parker ↔ Spider-Man

### 🐺 Trasformazioni
- Umano ↔ Licantropo ↔ Lupo
- Druido ↔ Forma Animale
- Jekyll ↔ Hyde

### 😠 Stati Emotivi
- Calmo ↔ Arrabbiato ↔ Furioso
- Bruce Banner ↔ Hulk

### 💔 Livelli di Salute
- Sano ↔ Ferito ↔ Gravemente Ferito
- Vivo ↔ Fantasma

### 🎭 Travestimenti
- Identità Vera ↔ Travestimento 1 ↔ Travestimento 2

## Troubleshooting

**Il campo non appare nella scheda dell'attore**
- Verifica che il modulo sia attivo
- Ricarica la pagina (F5)
- Controlla la console per eventuali errori

**Il menu contestuale non mostra "Cambia Immagine Token"**
- Verifica di aver configurato almeno un'immagine alternativa
- Assicurati che il token abbia un attore collegato

**L'immagine non cambia**
- Verifica che i percorsi delle immagini siano corretti
- Controlla la console browser (F12) per errori
- Assicurati che le immagini esistano nei percorsi specificati

## Compatibilità
- Foundry VTT: v13+
- Testato con: dnd5e, pf2e (ma dovrebbe funzionare con tutti i sistemi)

## Crediti
Creato per la community italiana di Foundry VTT

## Licenza
MIT License - Libero di usare, modificare e distribuire
