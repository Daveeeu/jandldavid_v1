# Production deploy

Ez a projekt Laravel alkalmazásként fut, és a React frontend buildelt assetjeit ugyanaz a konténer szolgálja ki.

## 1. GitHub repo

```bash
git init
git checkout -b main
git remote add origin https://github.com/Daveeeu/jandldavid_v1.git
git add .
git commit -m "Initial production-ready site"
git push -u origin main
```

## 2. Szerver könyvtár

```bash
ssh -i ~/.ssh/marrygallery_actions jandl@217.144.53.91
mkdir -p /srv/apps/jandldavid
cd /srv/apps/jandldavid
git clone https://github.com/Daveeeu/jandldavid_v1.git .
cp .env.production.example .env
mkdir -p storage database
```

## 3. Production env

Az `.env` fájlban minimum ezeket töltsd ki:

- `APP_URL=https://jandldavid.hu`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- `MAIL_FROM_ADDRESS`
- `CONTACT_NOTIFICATION_EMAIL`
- `VITE_GTM_CONTAINER_ID`
- `VITE_GA4_MEASUREMENT_ID`
- `SEARCH_CONSOLE_VERIFICATION`
- `ADMIN_DASHBOARD_TOKEN`

## 4. Konténer indítás

```bash
cd /srv/apps/jandldavid
docker compose -f docker-compose.prod.yml up -d --build
```

## 5. Traefik route

Hozd létre ezt a fájlt: `/srv/apps/traefik/dynamic/jandldavid.yml`

```yaml
http:
  routers:
    jandldavid:
      rule: Host(`jandldavid.hu`) || Host(`www.jandldavid.hu`)
      entryPoints:
        - websecure
      service: jandldavid
      tls:
        certResolver: letsencrypt

  services:
    jandldavid:
      loadBalancer:
        servers:
          - url: http://host.docker.internal:8088
```

Ha a Traefik nem veszi fel automatikusan, indítsd újra a Traefik stack-et.

## 6. DNS

Cloudflare-ben:

- `A @ -> 217.144.53.91`
- `A www -> 217.144.53.91`

Ha proxizva van a rekord, az rendben van, csak az origin a fenti szerver legyen.

## 7. Ellenőrzés

```bash
curl -I https://jandldavid.hu
curl -I https://www.jandldavid.hu
curl -I https://jandldavid.hu/sitemap.xml
curl -I https://jandldavid.hu/robots.txt
```
