# 🚀 Quick Start - PWA Testing

## Testing Locally

### 1. Start Local Server
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open: http://localhost:8000
```

### 2. Open Browser DevTools
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (Mac)

### 3. Check Application Tab
```
DevTools → Application Tab

✅ Manifest
   - Name: "Docente++ - Gestione Didattica con IA"
   - Icons: 2 icons visible
   - Theme color: #4a90e2

✅ Service Workers
   - Status: "activated and is running"
   - Source: sw.js

✅ Cache Storage
   - docente-static-v1
   - docente-dynamic-v1
```

### 4. Run Lighthouse Audit
```
DevTools → Lighthouse Tab
- Select "Progressive Web App" only
- Click "Generate report"
- Expected Score: ≥ 90/100
```

### 5. Test Installation
```
Desktop (Chrome/Edge):
- Look for install icon (⊕) in address bar
- Or: Menu → "Install Docente++"

Android (Chrome):
- Banner appears: "Installa Docente++"
- Or: Menu (⋮) → "Installa app"

iOS (Safari):
- Share button → "Aggiungi a Home"
```

### 6. Test Offline Mode
```
1. Open the app
2. DevTools → Network tab
3. Select "Offline" from dropdown
4. Reload page
5. ✅ App should still load
6. ✅ LocalStorage data available
```

## Quick Validation Commands

```bash
# Validate manifest.json
cat manifest.json | python3 -m json.tool

# Check Service Worker
grep -E "(install|activate|fetch)" sw.js

# Verify icons exist
ls -lh icons/

# Check index.html integration
grep -E "(manifest|serviceWorker|theme-color)" index.html
```

## Common Issues

**"Service Worker registration failed"**
- Solution: Serve via HTTP/HTTPS, not file://

**"No install prompt"**
- Solution: HTTPS required in production (localhost OK for dev)

**"Icons not loading"**
- Solution: Check icons/ directory permissions

**"Offline doesn't work"**
- Solution: Wait for SW to activate, check Cache Storage

## Production Checklist

- [ ] Deploy to HTTPS server
- [ ] Test on real Android device
- [ ] Test on real iOS device (Safari)
- [ ] Run Lighthouse audit (score ≥90)
- [ ] Test offline functionality
- [ ] Verify update mechanism works

## Documentation

- **Full Guide**: [PWA_INSTALLATION.md](PWA_INSTALLATION.md)
- **Implementation**: [PWA_IMPLEMENTATION_SUMMARY.md](PWA_IMPLEMENTATION_SUMMARY.md)
- **Main Docs**: [README.md](README.md)
