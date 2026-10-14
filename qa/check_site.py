"""Dependency-free source checks; these do not replace browser testing."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
ROOT=Path(__file__).resolve().parents[1]
PAGES=['index.html','skytab-onboarding.html','intelligence-inbox-premium-case-study.html','koto.html','skytab-kiosk.html','contact/contact.html']
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(); self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs): self.tags.append((tag,dict(attrs)))
errors=[]; images=0;refs=0
for name in PAGES:
 f=ROOT/name;p=Page(f.read_text());ids=[a['id'] for t,a in p.tags if 'id' in a]
 if len(ids)!=len(set(ids)): errors.append(f'{name}: duplicate IDs')
 for tag,a in p.tags:
  if tag=='img':
   images+=1
   if 'alt' not in a:errors.append(f'{name}: image missing alt')
   if not all(k in a for k in ('width','height')):errors.append(f'{name}: image missing dimensions: {a.get("src")}')
  if tag=='video' and ('autoplay' in a or 'controls' not in a or a.get('preload')!='none'): errors.append(f'{name}: video policy')
  for key in ('href','src'):
   val=a.get(key,'');u=urlsplit(val)
   if not val or u.scheme or u.netloc:continue
   refs+=1
   target=f.parent/unquote(u.path) if u.path else f
   if not target.exists():errors.append(f'{name}: missing {val}')
   if u.fragment and target.suffix=='.html' and target.exists():
    target_ids=[x.get('id') for _,x in Page(target.read_text()).tags]
    if unquote(u.fragment) not in target_ids:errors.append(f'{name}: missing anchor {val}')
print(json.dumps({'pages':len(PAGES),'images':images,'local_references':refs,'errors':errors},indent=2))
raise SystemExit(bool(errors))
