# Video Creation Service — Kubernetes Deployment Guide

> **Shared service** for all CBO agents  
> Namespace: `shared-services`  
> Internal DNS: `video-service.shared-services.svc.cluster.local:3000`

---

## Stack
| Component | Purpose |
|---|---|
| Node.js 20 | Runtime |
| Remotion v4 | React-based video templating (9:16 Reels) |
| ffmpeg | MP4 encode + audio mux |
| Chromium (headless) | Required by Remotion renderer |
| Azure TTS | `en-US-AndrewMultilingualNeural` voiceover |
| Express.js | REST API |
| PVC (ReadWriteMany) | Output video storage |

---

## Step 1 — Project Files

```bash
mkdir -p /tmp/video-service/src/templates
cd /tmp/video-service
```

### `Dockerfile`

```dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y \
  ffmpeg chromium fonts-noto-color-emoji \
  fonts-liberation ca-certificates \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npx remotion bundle src/index.ts --out dist/

EXPOSE 3000
CMD ["node", "server.js"]
```

### `package.json`

```json
{
  "name": "video-service",
  "version": "1.0.0",
  "dependencies": {
    "@remotion/bundler": "^4.0.0",
    "@remotion/renderer": "^4.0.0",
    "@remotion/media-utils": "^4.0.0",
    "remotion": "^4.0.0",
    "express": "^4.18.0",
    "microsoft-cognitiveservices-speech-sdk": "^1.35.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "uuid": "^9.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "outDir": "dist",
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

### `server.js`

```javascript
const express = require('express');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const { bundle } = require('@remotion/bundler');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const OUTPUT_DIR = process.env.OUTPUT_DIR || '/output';
const AZURE_KEY = process.env.AZURE_TTS_KEY;
const AZURE_REGION = process.env.AZURE_TTS_REGION || 'eastus';
const BUNDLE_LOCATION = path.join(__dirname, 'dist');

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }));

// List templates
app.get('/templates', (req, res) => {
  res.json({ templates: ['reel-tips', 'reel-quote', 'reel-blog-summary', 'reel-promo'] });
});

// Generate TTS audio — Azure Andrew Multilingual
async function generateVoice(text, outputPath) {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION);
    speechConfig.speechSynthesisVoiceName = 'en-US-AndrewMultilingualNeural';
    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
    const synth = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    synth.speakTextAsync(text, result => {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) resolve(outputPath);
      else reject(new Error(result.errorDetails));
      synth.close();
    });
  });
}

// Main render endpoint
// POST /render
// Body: { template, title, points[], cta, voice, duration, bgColor, accentColor }
app.post('/render', async (req, res) => {
  const {
    template   = 'reel-tips',
    title,
    points     = [],
    cta        = 'devops.gheware.com',
    voice      = true,
    duration   = 45,
    bgColor    = '#0f172a',
    accentColor = '#22C55E'
  } = req.body;

  if (!title) return res.status(400).json({ error: 'title is required' });

  const jobId  = uuid();
  const jobDir = path.join(OUTPUT_DIR, jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  try {
    // 1. Generate voiceover
    let audioPath = null;
    if (voice && AZURE_KEY) {
      const voiceText = `${title}. ${points.join('. ')}. Visit ${cta} to learn more.`;
      audioPath = path.join(jobDir, 'voice.mp3');
      await generateVoice(voiceText, audioPath);
      console.log(`Voice generated: ${audioPath}`);
    }

    // 2. Bundle & render with Remotion
    const bundled = await bundle(path.join(BUNDLE_LOCATION, 'index.js'));
    const composition = await selectComposition({
      serveUrl: bundled,
      id: template,
      inputProps: { title, points, cta, bgColor, accentColor, audioPath, duration }
    });

    const videoPath = path.join(jobDir, 'reel.mp4');
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: videoPath,
      inputProps: { title, points, cta, bgColor, accentColor, audioPath, duration },
      chromiumOptions: { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
    });

    console.log(`Rendered: ${videoPath}`);
    res.json({
      success:     true,
      jobId,
      videoPath:   `/files/${jobId}/reel.mp4`,
      downloadUrl: `http://video-service.shared-services.svc.cluster.local:3000/files/${jobId}/reel.mp4`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve rendered files
app.use('/files', express.static(OUTPUT_DIR));

app.listen(3000, () => console.log('✅ Video service running on :3000'));
```

### `src/index.ts` — Remotion root

```typescript
import { Composition, registerRoot } from 'remotion';
import { ReelTips }        from './templates/ReelTips';
import { ReelQuote }       from './templates/ReelQuote';
import { ReelBlogSummary } from './templates/ReelBlogSummary';
import { ReelPromo }       from './templates/ReelPromo';

export const RemotionRoot = () => (
  <>
    <Composition id="reel-tips" component={ReelTips}
      durationInFrames={1350} fps={30} width={1080} height={1920}
      defaultProps={{ title: '', points: [], cta: '', bgColor: '#0f172a', accentColor: '#22C55E' }} />
    <Composition id="reel-quote" component={ReelQuote}
      durationInFrames={900} fps={30} width={1080} height={1920}
      defaultProps={{ title: '', quote: '', author: '', bgColor: '#0f172a', accentColor: '#22C55E' }} />
    <Composition id="reel-blog-summary" component={ReelBlogSummary}
      durationInFrames={1350} fps={30} width={1080} height={1920}
      defaultProps={{ title: '', points: [], cta: '', blogUrl: '' }} />
    <Composition id="reel-promo" component={ReelPromo}
      durationInFrames={900} fps={30} width={1080} height={1920}
      defaultProps={{ title: '', subtitle: '', cta: '' }} />
  </>
);

registerRoot(RemotionRoot);
```

### `src/templates/ReelTips.tsx` — Animated tips template

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import React from 'react';

interface Props {
  title: string;
  points: string[];
  cta: string;
  bgColor?: string;
  accentColor?: string;
}

export const ReelTips: React.FC<Props> = ({
  title, points, cta,
  bgColor = '#0f172a',
  accentColor = '#22C55E'
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalSlides   = points.length + 2; // intro + points + outro
  const framesPerSlide = Math.floor(durationInFrames / totalSlides);
  const slide          = Math.min(Math.floor(frame / framesPerSlide), totalSlides - 1);
  const slideFrame     = frame % framesPerSlide;

  const opacity = interpolate(slideFrame, [0, 15, framesPerSlide - 15, framesPerSlide], [0, 1, 1, 0]);
  const spr     = spring({ frame: slideFrame, fps, config: { damping: 12 } });
  const translateY = interpolate(spr, [0, 1], [60, 0]);

  return (
    <AbsoluteFill style={{
      background: bgColor, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: 60, justifyContent: 'center', alignItems: 'center'
    }}>
      {/* Top brand bar */}
      <div style={{
        position: 'absolute', top: 60, left: 60, right: 60,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ color: accentColor, fontWeight: 800, fontSize: 34 }}>gheWARE</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 26 }}>@ghewaredevopsai</span>
      </div>

      {/* Slide content */}
      <div style={{ opacity, transform: `translateY(${translateY}px)`, textAlign: 'center', padding: '0 20px' }}>

        {/* Intro slide */}
        {slide === 0 && (
          <div>
            <div style={{ color: accentColor, fontSize: 30, fontWeight: 700, marginBottom: 24,
              textTransform: 'uppercase', letterSpacing: 4 }}>
              💡 {points.length} Things to Know
            </div>
            <div style={{ color: '#ffffff', fontSize: 58, fontWeight: 800, lineHeight: 1.2 }}>
              {title}
            </div>
          </div>
        )}

        {/* Point slides */}
        {slide >= 1 && slide <= points.length && (
          <div style={{ position: 'relative' }}>
            <div style={{
              color: accentColor, fontSize: 160, fontWeight: 800,
              opacity: 0.08, position: 'absolute',
              top: '50%', left: '50%', transform: 'translate(-50%, -55%)', lineHeight: 1
            }}>{slide}</div>
            <div style={{
              color: accentColor, fontSize: 22, fontWeight: 700, marginBottom: 20,
              textTransform: 'uppercase', letterSpacing: 3
            }}>#{slide} of {points.length}</div>
            <div style={{ color: '#ffffff', fontSize: 54, fontWeight: 700, lineHeight: 1.3, position: 'relative' }}>
              {points[slide - 1]}
            </div>
          </div>
        )}

        {/* Outro / CTA slide */}
        {slide > points.length && (
          <div>
            <div style={{ color: '#ffffff', fontSize: 46, fontWeight: 700, marginBottom: 36 }}>
              Ready to level up? 👇
            </div>
            <div style={{
              background: accentColor, color: '#0f172a',
              fontSize: 38, fontWeight: 800,
              padding: '22px 48px', borderRadius: 60, display: 'inline-block'
            }}>{cta}</div>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 14
      }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} style={{
            width: i === slide ? 36 : 10, height: 10, borderRadius: 5,
            background: i === slide ? accentColor : 'rgba(255,255,255,0.25)',
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

### `src/templates/ReelQuote.tsx` — Single quote template

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import React from 'react';

export const ReelQuote = ({ title, quote, author, bgColor = '#0f172a', accentColor = '#22C55E' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ frame, fps, config: { damping: 15 } });
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  const scale   = interpolate(spr, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${bgColor} 0%, #1e293b 100%)`,
      fontFamily: '-apple-system, sans-serif',
      justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'
    }}>
      <div style={{ position: 'absolute', top: 60, left: 60 }}>
        <span style={{ color: accentColor, fontWeight: 800, fontSize: 32 }}>gheWARE</span>
      </div>
      <div style={{ opacity, transform: `scale(${scale})` }}>
        <div style={{ color: accentColor, fontSize: 100, lineHeight: 0.8, marginBottom: 40 }}>"</div>
        <div style={{ color: '#ffffff', fontSize: 52, fontWeight: 700, lineHeight: 1.35 }}>{quote}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 30, marginTop: 40, fontStyle: 'italic' }}>
          — {author}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ color: accentColor, fontWeight: 700, fontSize: 28 }}>@ghewaredevopsai</span>
      </div>
    </AbsoluteFill>
  );
};
```

### `src/templates/ReelBlogSummary.tsx` — Blog-to-Reel template

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import React from 'react';

export const ReelBlogSummary = ({ title, points, cta, blogUrl, bgColor = '#1e3a5f', accentColor = '#22C55E' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const framesPerPoint = Math.floor(durationInFrames / (points.length + 2));
  const slide      = Math.min(Math.floor(frame / framesPerPoint), points.length + 1);
  const slideFrame = frame % framesPerPoint;
  const opacity    = interpolate(slideFrame, [0, 12, framesPerPoint - 12, framesPerPoint], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{
      background: bgColor, fontFamily: '-apple-system, sans-serif',
      padding: 60, justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ position: 'absolute', top: 60, left: 60, right: 60,
        display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: accentColor, fontWeight: 800, fontSize: 32 }}>gheWARE Blog</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24 }}>devops.gheware.com</span>
      </div>

      <div style={{ opacity, textAlign: 'center', padding: '0 20px' }}>
        {slide === 0 && (
          <div>
            <div style={{ color: accentColor, fontSize: 28, fontWeight: 700, marginBottom: 20,
              textTransform: 'uppercase', letterSpacing: 3 }}>📝 New Blog Post</div>
            <div style={{ color: '#ffffff', fontSize: 52, fontWeight: 800, lineHeight: 1.25 }}>{title}</div>
          </div>
        )}
        {slide >= 1 && slide <= points.length && (
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24, marginBottom: 20 }}>
              Key Insight #{slide}
            </div>
            <div style={{ color: '#ffffff', fontSize: 50, fontWeight: 700, lineHeight: 1.35 }}>
              {points[slide - 1]}
            </div>
          </div>
        )}
        {slide > points.length && (
          <div>
            <div style={{ color: '#ffffff', fontSize: 40, fontWeight: 700, marginBottom: 30 }}>
              Read the full guide 👇
            </div>
            <div style={{ background: accentColor, color: '#0f172a', fontSize: 32, fontWeight: 800,
              padding: '18px 40px', borderRadius: 50, display: 'inline-block', marginBottom: 20 }}>
              {cta}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

### `src/templates/ReelPromo.tsx` — Training promo template

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import React from 'react';

export const ReelPromo = ({ title, subtitle, cta, bgColor = '#0f172a', accentColor = '#22C55E' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ frame, fps, from: 0, to: 1, config: { damping: 14 } });
  const opacity   = interpolate(frame, [0, 20], [0, 1]);
  const titleY    = interpolate(spr, [0, 1], [80, 0]);
  const subtitleY = interpolate(spring({ frame: Math.max(0, frame - 10), fps }), [0, 1], [60, 0]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${bgColor} 0%, #0d1117 60%, #16213e 100%)`,
      fontFamily: '-apple-system, sans-serif',
      justifyContent: 'center', alignItems: 'center', padding: 70, textAlign: 'center'
    }}>
      {/* Badge */}
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{
          background: accentColor, color: '#0f172a',
          fontSize: 22, fontWeight: 800, padding: '8px 24px', borderRadius: 30
        }}>⭐ 4.91/5.0 at Oracle</span>
      </div>

      <div style={{ opacity }}>
        <div style={{ transform: `translateY(${titleY}px)`, color: '#ffffff',
          fontSize: 62, fontWeight: 800, lineHeight: 1.15, marginBottom: 30 }}>
          {title}
        </div>
        <div style={{ transform: `translateY(${subtitleY}px)`, color: 'rgba(255,255,255,0.7)',
          fontSize: 36, lineHeight: 1.4, marginBottom: 50 }}>
          {subtitle}
        </div>
        <div style={{
          background: accentColor, color: '#0f172a',
          fontSize: 38, fontWeight: 800, padding: '22px 52px', borderRadius: 60, display: 'inline-block'
        }}>{cta}</div>
      </div>

      <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 40, color: 'rgba(255,255,255,0.5)', fontSize: 24 }}>
        <span>5,000+ trained</span>
        <span>•</span>
        <span>60-70% labs</span>
        <span>•</span>
        <span>Zero-risk guarantee</span>
      </div>
    </AbsoluteFill>
  );
};
```

---

## Step 2 — Build & Push Docker Image

```bash
cd /tmp/video-service

# Build
docker build -t video-service:v1.0 .

# Tag and push to your registry (replace with your actual registry)
docker tag video-service:v1.0 <YOUR_REGISTRY>/video-service:v1.0
docker push <YOUR_REGISTRY>/video-service:v1.0
```

---

## Step 3 — Kubernetes Manifests

Save as `/tmp/video-service/k8s/` and apply in order:

### `k8s/namespace.yaml`

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: shared-services
  labels:
    app.kubernetes.io/managed-by: gheware-dev
```

### `k8s/pvc.yaml`

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: video-output-pvc
  namespace: shared-services
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 20Gi
```

### `k8s/secret.yaml` ⚠️ Fill in real keys before applying

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: video-service-secrets
  namespace: shared-services
type: Opaque
stringData:
  AZURE_TTS_KEY: "REPLACE_WITH_AZURE_COGNITIVE_SERVICES_KEY"
  AZURE_TTS_REGION: "eastus"
```

### `k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: video-service
  namespace: shared-services
  labels:
    app: video-service
    version: v1.0
spec:
  replicas: 1
  selector:
    matchLabels:
      app: video-service
  template:
    metadata:
      labels:
        app: video-service
    spec:
      containers:
        - name: video-service
          image: <YOUR_REGISTRY>/video-service:v1.0
          imagePullPolicy: Always
          ports:
            - containerPort: 3000
          env:
            - name: OUTPUT_DIR
              value: /output
            - name: AZURE_TTS_KEY
              valueFrom:
                secretKeyRef:
                  name: video-service-secrets
                  key: AZURE_TTS_KEY
            - name: AZURE_TTS_REGION
              valueFrom:
                secretKeyRef:
                  name: video-service-secrets
                  key: AZURE_TTS_REGION
          resources:
            requests:
              memory: "2Gi"
              cpu: "1000m"
            limits:
              memory: "4Gi"
              cpu: "2000m"
          volumeMounts:
            - name: output
              mountPath: /output
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 45
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
      volumes:
        - name: output
          persistentVolumeClaim:
            claimName: video-output-pvc
```

### `k8s/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: video-service
  namespace: shared-services
  labels:
    app: video-service
spec:
  selector:
    app: video-service
  ports:
    - name: http
      port: 3000
      targetPort: 3000
      protocol: TCP
  type: ClusterIP
```

### Apply all manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/secret.yaml      # ⚠️ fill keys first
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verify
kubectl get all -n shared-services
kubectl logs -f deployment/video-service -n shared-services
```

---

## Step 4 — Test

```bash
# Test health
kubectl run curl-test --image=curlimages/curl -it --rm -n shared-services \
  -- curl http://video-service.shared-services.svc.cluster.local:3000/health

# Test render (reel-tips)
kubectl run curl-test --image=curlimages/curl -it --rm -n shared-services \
  -- curl -X POST \
     http://video-service.shared-services.svc.cluster.local:3000/render \
     -H "Content-Type: application/json" \
     -d '{
       "template": "reel-tips",
       "title": "5 Reasons Agentic AI is the Future of DevOps",
       "points": [
         "AI agents self-heal infrastructure at 3AM",
         "LangGraph orchestrates multi-step pipelines",
         "RAG gives agents your company knowledge",
         "MCP connects agents to any enterprise tool",
         "Rated 4.91/5.0 at Oracle"
       ],
       "cta": "devops.gheware.com",
       "voice": true,
       "duration": 45
     }'
```

---

## Step 5 — Azure TTS Setup

1. Go to: https://portal.azure.com  
2. **Create Resource** → search **"Speech"**  
3. Select **Free (F0)** tier → 500K characters/month free  
4. Region: **East US** (lowest latency)  
5. Copy the **Key 1** value → paste into `k8s/secret.yaml`

**Voice:** `en-US-AndrewMultilingualNeural`  
Tone: warm, conversational, confident — ideal for DevOps training content

---

## Step 6 — Add env var to Dev agent

Once the service is running, add this to OpenClaw environment config:

```
VIDEO_SERVICE_URL=http://video-service.shared-services.svc.cluster.local:3000
```

Dev will automatically start generating Reels via this service in social crons.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Liveness check |
| `GET` | `/templates` | List available templates |
| `POST` | `/render` | Generate a Reel MP4 |
| `GET` | `/files/:jobId/reel.mp4` | Download rendered video |

### POST `/render` payload

| Field | Type | Default | Description |
|---|---|---|---|
| `template` | string | `reel-tips` | Template ID |
| `title` | string | required | Main heading |
| `points` | string[] | `[]` | Bullet points (reel-tips, reel-blog-summary) |
| `cta` | string | `devops.gheware.com` | Call-to-action URL |
| `voice` | boolean | `true` | Generate Azure TTS voiceover |
| `duration` | number | `45` | Video duration in seconds |
| `bgColor` | string | `#0f172a` | Background colour |
| `accentColor` | string | `#22C55E` | Brand accent colour |

---

## Templates

| ID | Best for | Duration |
|---|---|---|
| `reel-tips` | "N things to know" posts | 30–60s |
| `reel-quote` | Thought leadership quotes | 15–30s |
| `reel-blog-summary` | Blog post → Reel | 30–60s |
| `reel-promo` | Training course promos | 15–30s |

---

*Generated by Dev — Chief of Staff, AI — gheWARE uniGPS Solutions LLP*  
*devops.gheware.com | training@gheware.com*
