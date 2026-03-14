#!/usr/bin/env python3
"""
DofusBook Retro Scraper - Version Stealth
Contournement Cloudflare avec stealth
"""

import asyncio
import json
import os
import re
import random
from urllib.parse import urljoin
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

class DofusBookScraper:
    def __init__(self):
        self.base_url = "https://retro.dofusbook.net"
        self.data_dir = "dofusbook_scraped_data"
        self.images_dir = os.path.join(self.data_dir, "images")
        self.items = []
        self.sets = []
        
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.images_dir, exist_ok=True)
        
    async def init_browser(self):
        self.playwright = await async_playwright().start()
        
        # Args pour éviter la détection
        browser_args = [
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-site-isolation-trials',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--window-size=1920,1080',
        ]
        
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=browser_args
        )
        
        # Contexte avec user agent réaliste
        self.context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080},
            locale='fr-FR',
            timezone_id='Europe/Paris',
            permissions=['geolocation'],
            color_scheme='light',
        )
        
        # Ajouter des cookies réalistes
        await self.context.add_cookies([
            {'name': 'dofusbook_consent', 'value': 'true', 'domain': '.dofusbook.net', 'path': '/'},
            {'name': 'visited', 'value': '1', 'domain': '.dofusbook.net', 'path': '/'},
        ])
        
        self.page = await self.context.new_page()
        
        # Injecter le stealth script
        await self.page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });
            Object.defineProperty(navigator, 'languages', {
                get: () => ['fr-FR', 'fr', 'en-US', 'en']
            });
            window.chrome = { runtime: {} };
        """)
        
    async def close(self):
        await self.context.close()
        await self.browser.close()
        await self.playwright.stop()
        
    async def human_delay(self, min_sec=1, max_sec=3):
        """Délai aléatoire pour simuler un humain"""
        delay = random.uniform(min_sec, max_sec)
        await asyncio.sleep(delay)
        
    async def safe_goto(self, url, retries=3):
        """Navigation avec retry"""
        for attempt in range(retries):
            try:
                print(f"  🌐 Chargement {url} (tentative {attempt + 1})...")
                
                # Utiliser domcontentloaded au lieu de networkidle
                response = await self.page.goto(url, wait_until="domcontentloaded", timeout=60000)
                
                if response and response.status < 400:
                    await self.human_delay(2, 4)
                    return True
                    
            except Exception as e:
                print(f"  ⚠️ Tentative {attempt + 1} échouée: {e}")
                await asyncio.sleep(5)
                
        return False
        
    def parse_stats(self, soup):
        """Parse les statistiques d'un item"""
        stats = {}
        
        # Mapping des icônes vers les stats
        stat_patterns = {
            'vitalite': r'(\d+)\s*à\s*(\d+)\s*Vitalité',
            'force': r'(\d+)\s*à\s*(\d+)\s*Force',
            'intelligence': r'(\d+)\s*à\s*(\d+)\s*Intelligence',
            'chance': r'(\d+)\s*à\s*(\d+)\s*Chance',
            'agilite': r'(\d+)\s*à\s*(\d+)\s*Agilité',
            'sagesse': r'(\d+)\s*à\s*(\d+)\s*Sagesse',
            'pa': r'(\d+)\s*PA',
            'pm': r'(\d+)\s*PM',
            'po': r'(\d+)\s*PO',
            'critique': r'(\d+)\s*à\s*(\d+)\s*Critique',
            'pourcentage_dmg': r'(\d+)\s*à\s*(\d+)\s*%\s*Dmg',
            'dommages': r'(\d+)\s*à\s*(\d+)\s*Dommages',
            'soin': r'(\d+)\s*à\s*(\d+)\s*Soin',
            'prospection': r'(\d+)\s*à\s*(\d+)\s*Prospection',
            'initiative': r'(\d+)\s*à\s*(\d+)\s*Initiative',
            'invocation': r'(\d+)\s*à\s*(\d+)\s*Invocation',
        }
        
        text = soup.get_text()
        
        for stat_name, pattern in stat_patterns.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                min_val, max_val = matches[0]
                stats[stat_name] = {"min": int(min_val), "max": int(max_val)}
                
        return stats
        
    async def download_image(self, img_url, item_name):
        """Télécharge une image"""
        if not img_url:
            return None
            
        try:
            safe_name = re.sub(r'[^\w\-]', '_', item_name)[:50]
            ext = ".webp"
            if ".png" in img_url:
                ext = ".png"
            elif ".jpg" in img_url or ".jpeg" in img_url:
                ext = ".jpg"
                
            filename = f"{safe_name}{ext}"
            filepath = os.path.join(self.images_dir, filename)
            
            if os.path.exists(filepath):
                return f"images/{filename}"
            
            # Télécharger via fetch
            result = await self.page.evaluate(f"""
                async () => {{
                    try {{
                        const response = await fetch('{img_url}');
                        if (!response.ok) return null;
                        const blob = await response.blob();
                        return new Promise((resolve) => {{
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        }});
                    }} catch (e) {{
                        return null;
                    }}
                }}
            """)
            
            if result and ',' in result:
                import base64
                data = result.split(',')[1]
                with open(filepath, 'wb') as f:
                    f.write(base64.b64decode(data))
                print(f"    🖼️ Image sauvegardée: {filename}")
                return f"images/{filename}"
                
        except Exception as e:
            print(f"    ⚠️ Erreur image: {e}")
            
        return None
        
    async def scrape_item_page(self, item_url):
        """Scrape une page d'item"""
        try:
            if not await self.safe_goto(item_url):
                return None
                
            html = await self.page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            # Nom
            name = "Unknown"
            for selector in ['h1', 'h2', '.item-name', '[class*="title"]']:
                elem = soup.select_one(selector)
                if elem:
                    name = elem.get_text(strip=True)
                    if name and len(name) > 2:
                        break
            
            # Type et niveau
            item_type = "Inconnu"
            level = 0
            
            type_elem = soup.find(string=re.compile(r'Chapeau|Cape|Amulette|Anneau|Ceinture|Bottes|Bâton|Épée|Dague|Hache|Marteau|Pelle|Baguette|Arc', re.I))
            if type_elem:
                item_type = type_elem.strip()
                
            level_match = re.search(r'Niveau\s+(\d+)', html, re.I)
            if level_match:
                level = int(level_match.group(1))
            
            # Image
            img_url = None
            for img in soup.find_all('img'):
                src = img.get('src', '')
                if 'items' in src or 'static' in src:
                    img_url = urljoin(self.base_url, src)
                    break
                    
            local_img = await self.download_image(img_url, name)
            
            # Stats
            stats = self.parse_stats(soup)
            
            item_data = {
                "name": name,
                "type": item_type,
                "level": level,
                "stats": stats,
                "image_url": img_url,
                "local_image": local_img,
                "dofusbook_url": item_url
            }
            
            print(f"  ✅ {name} (Niv {level}) - {len(stats)} stats")
            return item_data
            
        except Exception as e:
            print(f"  ❌ Erreur: {e}")
            return None
            
    async def scrape_items_list(self, page_num=1):
        """Scrape une page de liste"""
        url = f"{self.base_url}/fr/encyclopedie/items?page={page_num}"
        print(f"\n📄 Page {page_num}")
        
        if not await self.safe_goto(url):
            return 0
            
        html = await self.page.content()
        soup = BeautifulSoup(html, 'lxml')
        
        # Chercher les liens d'items
        item_links = set()
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/fr/encyclopedie/items/' in href and href != '/fr/encyclopedie/items':
                full_url = urljoin(self.base_url, href)
                item_links.add(full_url)
        
        item_links = list(item_links)
        print(f"  🔍 {len(item_links)} items trouvés")
        
        # Scrape chaque item (limiter pour test)
        for item_url in item_links[:20]:
            item_data = await self.scrape_item_page(item_url)
            if item_data:
                self.items.append(item_data)
            await self.human_delay(1, 2)
                
        return len(item_links)
        
    async def run(self, max_pages=2):
        """Lance le scraping"""
        print("🚀 DofusBook Retro Scraper - Stealth Mode")
        print("=" * 60)
        
        await self.init_browser()
        
        try:
            for page in range(1, max_pages + 1):
                await self.scrape_items_list(page)
                
        finally:
            await self.close()
            
        # Sauvegarde
        print("\n💾 Sauvegarde...")
        
        with open(os.path.join(self.data_dir, "items.json"), 'w', encoding='utf-8') as f:
            json.dump(self.items, f, ensure_ascii=False, indent=2)
            
        summary = {
            "total_items": len(self.items),
            "images_downloaded": len([i for i in self.items if i.get('local_image')])
        }
        with open(os.path.join(self.data_dir, "summary.json"), 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
            
        print(f"  ✅ {len(self.items)} items sauvegardés")
        print(f"  ✅ {summary['images_downloaded']} images téléchargées")
        print(f"\n📁 Données dans: {self.data_dir}/")


if __name__ == "__main__":
    scraper = DofusBookScraper()
    asyncio.run(scraper.run(max_pages=3))
