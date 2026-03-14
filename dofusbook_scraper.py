#!/usr/bin/env python3
"""
DofusBook Retro Scraper - Version complète
Récupère items, stats, recettes et images
"""

import asyncio
import json
import os
import re
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

class DofusBookScraper:
    def __init__(self):
        self.base_url = "https://retro.dofusbook.net"
        self.data_dir = "dofusbook_scraped_data"
        self.images_dir = os.path.join(self.data_dir, "images")
        self.items = []
        self.sets = []
        self.weapons = []
        
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.images_dir, exist_ok=True)
        
    async def init_browser(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        self.context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        self.page = await self.context.new_page()
        
    async def close(self):
        await self.context.close()
        await self.browser.close()
        await self.playwright.stop()
        
    async def download_image(self, img_url, item_name):
        """Télécharge une image et retourne le chemin local"""
        try:
            if not img_url or img_url.startswith("data:"):
                return None
                
            # Nettoyer le nom de fichier
            safe_name = re.sub(r'[^\w\-]', '_', item_name)
            ext = os.path.splitext(urlparse(img_url).path)[1] or ".webp"
            filename = f"{safe_name}{ext}"
            filepath = os.path.join(self.images_dir, filename)
            
            if os.path.exists(filepath):
                return f"images/{filename}"
            
            # Télécharger l'image
            response = await self.page.evaluate(f"""
                async () => {{
                    const response = await fetch('{img_url}');
                    const blob = await response.blob();
                    const reader = new FileReader();
                    return new Promise((resolve) => {{
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    }});
                }}
            """)
            
            if response and ',' in response:
                import base64
                data = response.split(',')[1]
                with open(filepath, 'wb') as f:
                    f.write(base64.b64decode(data))
                return f"images/{filename}"
                
        except Exception as e:
            print(f"  ⚠️ Erreur image {img_url}: {e}")
        return None
        
    def parse_stats(self, soup):
        """Parse les statistiques d'un item"""
        stats = {}
        stat_mapping = {
            'vi': 'vitalite',
            'fo': 'force',
            'in': 'intelligence',
            'ch': 'chance',
            'ag': 'agilite',
            'sa': 'sagesse',
            'pa': 'pa',
            'pm': 'pm',
            'po': 'po',
            'cc': 'critique',
            'pu': 'pourcentage_dmg',
            'dmg': 'dommages',
            'so': 'soin',
            'pp': 'prospection',
            'ii': 'initiative',
            'ic': 'invocation',
            'pi': 'dmg_piege',
            'pip': 'pourcentage_piege',
            'rv': 'renvoi',
            'rnp': 'res_neutre_pourcent',
            'rn': 'res_neutre',
            'rtp': 'res_terre_pourcent',
            'rt': 'res_terre',
            'rfp': 'res_feu_pourcent',
            'rf': 'res_feu',
            'rep': 'res_eau_pourcent',
            're': 'res_eau',
            'rap': 'res_air_pourcent',
            'ra': 'res_air',
        }
        
        # Chercher les lignes de stats
        stat_elements = soup.find_all('div', class_=lambda x: x and 'item-stat' in str(x))
        
        for elem in soup.find_all(['div', 'span'], class_=True):
            classes = elem.get('class', [])
            for cls in classes:
                if cls in stat_mapping:
                    stat_name = stat_mapping[cls]
                    text = elem.get_text(strip=True)
                    # Extraire les valeurs (ex: "151 à 200" ou "1 PA")
                    numbers = re.findall(r'-?\d+', text)
                    if numbers:
                        if len(numbers) >= 2:
                            stats[stat_name] = {"min": int(numbers[0]), "max": int(numbers[1])}
                        else:
                            stats[stat_name] = int(numbers[0])
                    break
                    
        return stats
        
    async def scrape_item_page(self, item_url):
        """Scrape une page d'item individuel"""
        try:
            await self.page.goto(item_url, wait_until="networkidle")
            await asyncio.sleep(1)  # Attendre le rendu
            
            html = await self.page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            # Nom de l'item
            name_elem = soup.find('h1') or soup.find('h2')
            name = name_elem.get_text(strip=True) if name_elem else "Unknown"
            
            # Image
            img_elem = soup.find('img', class_=lambda x: x and 'item' in str(x).lower())
            img_url = img_elem.get('src') if img_elem else None
            local_img = await self.download_image(img_url, name) if img_url else None
            
            # Type et niveau
            item_type = "Inconnu"
            level = 0
            
            type_match = re.search(r'(Chapeau|Cape|Amulette|Anneau|Ceinture|Bottes|Arme|Bâton|Épée|Dague|Hache|Marteau|Pelle|Baguette|Arc|Faux)', html, re.I)
            if type_match:
                item_type = type_match.group(1).capitalize()
                
            level_match = re.search(r'Niveau\s*(\d+)', html, re.I)
            if level_match:
                level = int(level_match.group(1))
            
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
            print(f"  ❌ Erreur {item_url}: {e}")
            return None
            
    async def scrape_items_list(self, page_num=1):
        """Scrape une page de la liste des items"""
        url = f"{self.base_url}/fr/encyclopedie/items?page={page_num}"
        print(f"\n📄 Scraping page {page_num}: {url}")
        
        try:
            await self.page.goto(url, wait_until="networkidle")
            await asyncio.sleep(2)
            
            html = await self.page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            # Chercher les liens d'items
            item_links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                if '/fr/encyclopedie/items/' in href and href != '/fr/encyclopedie/items':
                    full_url = urljoin(self.base_url, href)
                    item_links.append(full_url)
            
            # Supprimer les doublons
            item_links = list(set(item_links))
            print(f"  🔍 {len(item_links)} items trouvés")
            
            # Scrape chaque item
            for item_url in item_links[:10]:  # Limiter pour le test
                item_data = await self.scrape_item_page(item_url)
                if item_data:
                    self.items.append(item_data)
                    
            return len(item_links)
            
        except Exception as e:
            print(f"  ❌ Erreur page {page_num}: {e}")
            return 0
            
    async def scrape_sets(self):
        """Scrape les panoplies"""
        url = f"{self.base_url}/fr/encyclopedie/panoplies"
        print(f"\n👕 Scraping panoplies: {url}")
        
        try:
            await self.page.goto(url, wait_until="networkidle")
            await asyncio.sleep(2)
            
            html = await self.page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            # Chercher les liens de panoplies
            set_links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                if '/fr/encyclopedie/panoplies/' in href and href != '/fr/encyclopedie/panoplies':
                    full_url = urljoin(self.base_url, href)
                    set_links.append(full_url)
            
            set_links = list(set(set_links))
            print(f"  🔍 {len(set_links)} panoplies trouvées")
            
            for set_url in set_links[:5]:  # Limiter pour le test
                await self.scrape_set_page(set_url)
                
        except Exception as e:
            print(f"  ❌ Erreur panoplies: {e}")
            
    async def scrape_set_page(self, set_url):
        """Scrape une page de panoplie"""
        try:
            await self.page.goto(set_url, wait_until="networkidle")
            await asyncio.sleep(1)
            
            html = await self.page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            name_elem = soup.find('h1') or soup.find('h2')
            name = name_elem.get_text(strip=True) if name_elem else "Unknown"
            
            # Bonus de panoplie
            bonuses = {}
            # TODO: Parser les bonus progressifs
            
            set_data = {
                "name": name,
                "bonuses": bonuses,
                "dofusbook_url": set_url
            }
            
            self.sets.append(set_data)
            print(f"  ✅ Panoplie: {name}")
            
        except Exception as e:
            print(f"  ❌ Erreur panoplie {set_url}: {e}")
            
    def save_data(self):
        """Sauvegarde les données en JSON"""
        print("\n💾 Sauvegarde des données...")
        
        # Items
        with open(os.path.join(self.data_dir, "items.json"), 'w', encoding='utf-8') as f:
            json.dump(self.items, f, ensure_ascii=False, indent=2)
        print(f"  ✅ {len(self.items)} items sauvegardés")
        
        # Panoplies
        with open(os.path.join(self.data_dir, "sets.json"), 'w', encoding='utf-8') as f:
            json.dump(self.sets, f, ensure_ascii=False, indent=2)
        print(f"  ✅ {len(self.sets)} panoplies sauvegardées")
        
        # Résumé
        summary = {
            "total_items": len(self.items),
            "total_sets": len(self.sets),
            "images_downloaded": len([i for i in self.items if i.get('local_image')])
        }
        with open(os.path.join(self.data_dir, "summary.json"), 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
            
    async def run(self, max_pages=3):
        """Lance le scraping complet"""
        print("🚀 DofusBook Retro Scraper")
        print("=" * 50)
        
        await self.init_browser()
        
        try:
            # Scrape les items
            for page in range(1, max_pages + 1):
                count = await self.scrape_items_list(page)
                if count == 0:
                    break
                    
            # Scrape les panoplies
            await self.scrape_sets()
            
        finally:
            await self.close()
            
        # Sauvegarde
        self.save_data()
        
        print("\n" + "=" * 50)
        print("✨ Scraping terminé!")
        print(f"📁 Données sauvegardées dans: {self.data_dir}/")


if __name__ == "__main__":
    scraper = DofusBookScraper()
    asyncio.run(scraper.run(max_pages=5))
