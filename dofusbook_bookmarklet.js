javascript:(function(){
    // DofusBook Retro Data Extractor
    // Usage: Copy this code, create a bookmark in Chrome, paste this code as URL
    // Then visit DofusBook and click the bookmark
    
    const data = {
        items: [],
        timestamp: new Date().toISOString(),
        url: window.location.href
    };
    
    // Extract items from current page
    const itemCards = document.querySelectorAll('[class*="item"], [class*="card"], .encyclopedia-item, [data-item]');
    
    itemCards.forEach(card => {
        const item = {};
        
        // Name
        const nameEl = card.querySelector('h1, h2, h3, h4, .item-name, [class*="title"]');
        if (nameEl) item.name = nameEl.textContent.trim();
        
        // Level
        const levelMatch = card.textContent.match(/Niveau\s+(\d+)/i);
        if (levelMatch) item.level = parseInt(levelMatch[1]);
        
        // Type
        const typeMatch = card.textContent.match(/(Chapeau|Cape|Amulette|Anneau|Ceinture|Bottes|Arme|Dague|Épée|Bâton|Baguette|Marteau|Pelle|Hache|Arc)/i);
        if (typeMatch) item.type = typeMatch[1];
        
        // Stats
        item.stats = {};
        const statPatterns = {
            'vitalite': /(\d+)\s*à\s*(\d+)\s*Vitalité/,
            'force': /(\d+)\s*à\s*(\d+)\s*Force/,
            'intelligence': /(\d+)\s*à\s*(\d+)\s*Intelligence/,
            'chance': /(\d+)\s*à\s*(\d+)\s*Chance/,
            'agilite': /(\d+)\s*à\s*(\d+)\s*Agilité/,
            'sagesse': /(\d+)\s*à\s*(\d+)\s*Sagesse/,
            'pa': /(\d+)\s*PA/,
            'pm': /(\d+)\s*PM/,
            'po': /(\d+)\s*PO/,
            'critique': /(\d+)\s*à\s*(\d+)\s*Critique/,
            'dommages': /(\d+)\s*à\s*(\d+)\s*Dommages/,
            'pourcentage_dmg': /(\d+)\s*à\s*(\d+)\s*%\s*Dmg/,
            'soin': /(\d+)\s*à\s*(\d+)\s*Soin/,
            'prospection': /(\d+)\s*à\s*(\d+)\s*Prospection/,
            'initiative': /(\d+)\s*à\s*(\d+)\s*Initiative/,
        };
        
        const text = card.textContent;
        for (const [stat, pattern] of Object.entries(statPatterns)) {
            const match = text.match(pattern);
            if (match) {
                if (match[2]) {
                    item.stats[stat] = { min: parseInt(match[1]), max: parseInt(match[2]) };
                } else {
                    item.stats[stat] = parseInt(match[1]);
                }
            }
        }
        
        // Image
        const img = card.querySelector('img');
        if (img) {
            item.image_url = img.src;
        }
        
        if (item.name) {
            data.items.push(item);
        }
    });
    
    // Download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dofusbook-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ ${data.items.length} items exported!`);
})();
