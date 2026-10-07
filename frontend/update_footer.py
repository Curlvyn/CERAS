from pathlib import Path
import re

files = [
    'index.html', 'about.html', 'community-alerts.html',
    'contact.html', 'incident-reporting.html', 'login.html',
    'metrics.html', 'safety-resources.html', 'services.html', 'volunteer-network.html'
]

footer = '''  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <h3>CERAS</h3>
        <p>Community Emergency Response and Alert System</p>
      </div>
      <div>
        <h4>Explore</h4>
        <a href="services.html">Services</a>
        <a href="incident-reporting.html">Report</a>
        <a href="metrics.html">Metrics</a>
      </div>
      <div>
        <h4>Support</h4>
        <a href="about.html">About</a>
        <a href="volunteer-network.html">Volunteers</a>
        <a href="contact.html">Get Help</a>
      </div>
      <div>
        <h4>Contact</h4>
        <p>help@ceras.gov.gh</p>
        <p>030 000 0000</p>
      </div>
    </div>
    <div class="container social-row">
      <span>Follow CERAS</span>
      <div class="social-links">
        <a href="#" aria-label="Facebook">FB</a>
        <a href="#" aria-label="Twitter">TW</a>
        <a href="#" aria-label="LinkedIn">LI</a>
      </div>
    </div>
  </footer>'''

pattern = re.compile(r'<footer class="site-footer">.*?</footer>', re.S)

for name in files:
    p = Path(name)
    if not p.exists():
        print(f'SKIP {name} missing')
        continue
    text = p.read_text(encoding='utf-8')
    new_text, count = pattern.subn(footer, text, count=1)
    if count == 0:
        print(f'NO MATCH {name}')
    else:
        p.write_text(new_text, encoding='utf-8')
        print(f'UPDATED {name}')
