# КыргызЖардам — Кайрымдуулук Фондунун ички CRM системасы

Фонддун кызматкерлери жана волонтерлору үчүн ички веб-система. React + TypeScript-стилиндеги JS + Tailwind CSS + Supabase менен курулган.

## Долбоордун түзүлүшү

```
src/
  components/   — кайра колдонулуучу UI бөлүктөрү (Sidebar, Header, Icon, PeopleTable, ...)
  pages/        — ар бир баракча (Dashboard, PeopleList, PersonCard, AddPerson, ...)
  data/         — Supabase менен иштешүүчү API функциялары (peopleApi, aidApi, mediaApi, ...)
  context/      — AuthContext (логин/сессия башкаруу)
  lib/          — Supabase client конфигурациясы
  utils/        — жардамчы функциялар жана туруктуулар (constants, format)
supabase/
  schema.sql    — толук база схемасы (Supabase SQL Editor'го коюу үчүн)
```

## 1. Орнотуу

```bash
npm install
```

## 2. Supabase орнотуу

### а) Долбоор түзүү
[supabase.com](https://supabase.com) сайтында жаңы долбоор түзүңүз.

### б) Схеманы иштетүү
Supabase Dashboard → **SQL Editor** → `supabase/schema.sql` файлынын мазмунун толугу менен көчүрүп иштетиңиз.

Бул төмөнкүлөрдү түзөт:
- `profiles` — колдонуучулар (admin / coordinator / volunteer ролдору менен)
- `people` — муктаж адамдар
- `person_media` — сүрөт/видео шилтемелери
- `aid` — берилген жардамдар
- `reports`, `report_media` — отчеттор
- `activity_log` — акыркы аракеттер
- Storage бакеттери: `person-photos`, `person-videos`, `report-media`
- Row Level Security саясаттары (бардык авторизацияланган колдонуучулар үчүн)

### в) Айлана-чөйрө өзгөрмөлөрү
`.env.example` файлын `.env.local` катары көчүрүп, Supabase Dashboard → **Settings → API** бөлүмүнөн алынган маалыматтарды коюңуз:

```bash
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
```

## 3. Иштетүү

```bash
npm run dev
```

Браузерде `http://localhost:5173` ачылат.

## 4. Демо режим

Эгер `.env.local` орнотулбаса, тиркеме **демо режимде** иштейт:
- Каалаган email/сырсөз менен кирүүгө болот
- Маалыматтар `src/data/demoData.js` ичинен алынат
- Жаңы кошулган маалыматтар браузердин эс тутумунда гана сакталат (баракты жаңыртканда жоголот)

Бул режим долбоорду тез көрсөтүү же UI'ды текшерүү үчүн ыңгайлуу.

## 5. Колдонуучу ролдору

| Роль | Укуктар |
|------|---------|
| **admin** | Бардык бөлүмдөрдү көрөт, каржы отчетторун көрөт, волонтерлорду башкарат |
| **coordinator** | Өз аймагындагы адамдарды башкарат, жардамдарды бекитет, волонтерлорду көрөт |
| **volunteer** | Муктаж адамдарды кошот, медиа жүктөйт, отчет жазат |

Каржы (`/finance`) бөлүмү — админ үчүн гана көрүнөт. Волонтерлор (`/volunteers`) бөлүмү — админ жана координатор үчүн.

## 6. Production build

```bash
npm run build
```

Жыйынтык `dist/` папкасында чыгат — каалаган статикалык хостингге (Vercel, Netlify, ж.б.) жайгаштырууга болот.

## 7. Netlify аркылуу жайгаштыруу (сунушталган, эң жөнөкөй)

Долбоордо `netlify.toml` бар — build командасын жана SPA redirect эрежесин орнотуп коёт, кошумча тууралоо керек эмес.

### Жол А: Git аркылуу (автоматтык deploy)

1. Долбоорду GitHub/GitLab/Bitbucket'ке жүктөңүз:
   ```bash
   git init
   git add .
   git commit -m "Алгачкы commit"
   git remote add origin https://github.com/your-username/charity-crm.git
   git push -u origin main
   ```
2. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Git провайдериңизди тандап, репозиторийди тандаңыз
4. Build параметрлери автоматтык түрдө `netlify.toml`'дон алынат:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Environment variables** бөлүмүнө Supabase ачкычтарын кошуңуз (өтө маанилүү — болбосо демо режимде иштейт):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. **Deploy site** басыңыз

Мындан кийин `git push` жасаган сайын Netlify автоматтык түрдө жаңы версияны deploy кылат.

### Жол Б: Netlify CLI аркылуу (Git'сиз, түз компьютерден)

```bash
npm install -g netlify-cli

cd charity-crm
npm install

# Биринчи жолу кирүү
netlify login

# Долбоорду Netlify'ге байлоо
netlify init
# же түз эле:
netlify deploy --prod
```

CLI сизден кайсы команда менен build кылууну жана кайсы папканы (`dist`) жарыялоону сурайт — `netlify.toml` бар болгондуктан автоматтык табылат.

Environment variables'ды CLI аркылуу да коё аласыз:
```bash
netlify env:set VITE_SUPABASE_URL "https://xxxx.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJxxxxxx..."
```

Андан кийин кайра deploy кылыңыз:
```bash
netlify deploy --prod
```

### Жол В: "Drag and drop" (эң тез, бирок Supabase ачкычтарын кол менен коюу керек)

```bash
npm run build
```

Андан кийин [app.netlify.com/drop](https://app.netlify.com/drop) барагына `dist/` папкасын сүйрөп таштаңыз. Бул ыкмада environment variables'ды Site settings → Build & deploy → Environment бөлүмүнөн кол менен кошуп, кайра build/deploy кылышыңыз керек болот.

> **Эскертүү:** Netlify'де `server.js` (Express) колдонулбайт — ал VPS/өзүнчө сервер үчүн гана. Netlify'де долбоор таза статикалык сайт катары иштейт.

## 8. Node.js серверге жайгаштыруу (VPS, альтернатива катары)

Долбоордо `server.js` деген кичинекей Express сервери бар — ал `dist/` папкасын кызмат кылат жана SPA route'торду (`/people`, `/aid`, ж.б.) баракты жаңыртканда 404 бербешин камсыз кылат.

```bash
# Серверде Node.js орнотулган болушу керек (v18+)
node -v

# Долбоорду серверге көчүрүп/clone кылыңыз
cd charity-crm
npm install
nano .env.local        # Supabase ачкычтарын коюу
npm run build           # dist/ түзүлөт
npm start                # node server.js — 3000-портто иштейт
```

### Узак мөөнөттүү иштетүү үчүн PM2 колдонуу

Терминал жабылганда сервер токтобошу үчүн **PM2** колдонуңуз:

```bash
npm install -g pm2

pm2 start server.js --name kyrgyzjardam-crm
pm2 startup    # серверди рестарт кылганда автоматтык иштеши үчүн
pm2 save
```

Пайдалуу буйруктар:
```bash
pm2 status                       # абалын көрүү
pm2 logs kyrgyzjardam-crm        # логдорду көрүү
pm2 restart kyrgyzjardam-crm     # кайра иштетүү (мис. жаңы build чыгаргандан кийин)
pm2 stop kyrgyzjardam-crm        # токтотуу
```

### Nginx менен 80/443-портко чыгаруу (сунушталат)

Node.js серверди түз интернетке ачпай, Nginx'ти reverse proxy катары колдонуу коопсузураак:

```nginx
server {
    listen 80;
    server_name your-domain.kg;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Андан кийин SSL үчүн **Certbot** колдонуңуз:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.kg
```

### Жаңыртуу агымы

Кодду өзгөрткөндө серверде:
```bash
git pull              # же жаңы файлдарды жүктөө
npm install            # эгер жаңы пакеттер кошулса
npm run build
pm2 restart kyrgyzjardam-crm
```


## Оңдолгон каталар (мурунку версиядан)

- ❌ Издөө иконкасы эки жолу чыгып жаткан → ✅ бир гана `<Icon d={Icons.search} />`
- ❌ Видео SVG path туура эмес форма берген → ✅ туура камера-видео формасы
- ❌ "Қан" деген ай аталышы (туура эмес тамга) → ✅ "Янв" (`src/utils/constants.js`)
- ❌ Таблица телефондо кысылып, окулбай калчу → ✅ `md:` чекитинен төмөн карточка көрүнүшүнө которулат (`PeopleTable.jsx`)
