# 💕 FlertaAI - Assistente de Conversas Inteligente

> **Nunca mais fique sem palavras nas suas conversas de namoro**

FlertaAI é um assistente de conversas brasileiro que analisa prints ou textos de conversas e sugere respostas personalizadas que soam naturalmente como você. Feito com privacidade em primeiro lugar e total conformidade LGPD.

## ✨ Diferenciais Únicos

### 🇧🇷 **100% Brasileiro**
- Contexto cultural brasileiro integrado
- Gírias e expressões naturais 
- Timing inteligente baseado no fuso horário brasileiro
- Evita clichês óbvios ("oi sumida", etc.)

### 🔒 **Privacy-First & LGPD**
- OCR processado localmente no dispositivo
- Minimização de dados pessoais
- Botão "Excluir Tudo" transacional
- Logs auditáveis sem PII
- Conformidade total LGPD

### 🎯 **IA Personalizada**
- Sugestões que combinam com SEU jeito de falar
- Sistema de confiança para parsing incerto
- Few-shots personalizados por usuário
- Anti "sabor GPT genérico"

### 🚀 **Recursos Avançados**
- **Voice Notes**: Transcrição + TTS
- **Anti-Catfish**: Verificação de autenticidade de fotos
- **Coach Mode**: Explica o "porquê" das sugestões
- **Análise de Sucesso**: Tracking de resultados
- **Timing Rules**: Horários adequados para mensagens

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** (App Router)
- **React Native + Expo EAS** (Mobile)
- **Tailwind CSS** (Design System)
- **TypeScript** (Type Safety)
- **i18n** (pt-BR default, en-US, es-ES)

### Backend
- **Supabase** (Postgres, Auth, RLS, Storage, Edge Functions)
- **Deno/TypeScript** (Edge Functions)
- **OpenAI API** (LLM Provider)
- **Tesseract WASM** (OCR Client-side)

### Segurança & Compliance
- **Row Level Security** (RLS) em todas as tabelas
- **CORS** configurado por domínio
- **CSP** Headers rígidos
- **Secret Management** via Supabase
- **Rate Limiting** por usuário

## 🗄️ Arquitetura do Banco

### Tabelas Principais
```sql
profiles          -- Configurações de usuário e preferências de tom
uploads           -- Screenshots, áudios e bios enviados
chat_parses       -- Resultados de parsing com confidence scores
suggestions       -- Sugestões geradas pela IA
conversation_outcomes -- Análise de sucesso (match, date, ghosted)
voice_notes       -- Transcrições de áudio
image_checks      -- Verificação anti-catfish
billing_plans     -- Planos de assinatura (BRL)
subscriptions     -- Assinaturas dos usuários
privacy_logs      -- Logs de auditoria LGPD
```

### Storage Buckets
- `screens`: Screenshots originais (privado)
- `redacted`: Imagens com faces/nomes borrados (privado)  
- `audio`: Voice notes e TTS files (privado)

## 🔧 Setup & Desenvolvimento

### Pré-requisitos
- Node.js 18+ e npm
- Conta Supabase configurada
- Chaves API: OpenAI, (opcional) Hugging Face

### Instalação

```bash
# 1. Clone o repositório
git clone <your-repo-url>
cd flertaai

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# 4. Execute migrations do Supabase
# (As migrations já estão aplicadas neste projeto)

# 5. Start do desenvolvimento
npm run dev
```

### Configuração Supabase

As seguintes extensões e configurações já estão aplicadas:

```sql
-- Extensões habilitadas
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Buckets de storage criados
-- RLS habilitado em todas as tabelas
-- Policies configuradas por usuário
-- Triggers para updated_at automático
```

### Edge Functions

Funções serverless já configuradas:

1. **`ocr-parse`**: Processamento OCR e parsing de conversas
2. **`suggest-replies`**: Geração de sugestões com contexto BR
3. **`openai-chat`**: Integração OpenAI com prompts brasileiros

## 💰 Monetização (IAP em BRL)

### Planos Disponíveis
- **Gratuito**: 5 análises/dia, recursos básicos
- **Mensal**: R$ 19,90 - Recursos completos
- **Anual**: R$ 199,00 - 2 meses grátis (17% economia)
- **Vitalício**: R$ 399,00 - Pagamento único

### Verificação de Recibos
- Server-side validation (RevenueCat recomendado)
- Sincronização com tabela `subscriptions`
- Auditoria em `privacy_logs`

## 📱 Publicação Mobile

### Play Store (Android)
```bash
# Build para produção
eas build --platform android --profile production

# Submit para a Play Store
eas submit --platform android --profile production
```

### App Store (iOS)
```bash
# Build para iOS
eas build --platform ios --profile production

# Submit para App Store
eas submit --platform ios --profile production
```

### Assets Necessários
- Ícone: 512×512px (Android), vários tamanhos (iOS)
- Screenshots: 1080×1920px mínimo
- Feature Graphic: 1024×500px (Play Store)
- Política de Privacidade + Termos de Uso

## 🔐 Segurança & LGPD

### Compliance LGPD
- ✅ Minimização de dados
- ✅ Finalidade específica
- ✅ Consentimento explícito
- ✅ Direito de exclusão (`rpc_purge_my_data()`)
- ✅ Portabilidade de dados
- ✅ Logs auditáveis
- ✅ DPO contact info

### Segurança Técnica
- ✅ RLS em todas as tabelas
- ✅ Policies por usuário
- ✅ No PII em logs
- ✅ HTTPS obrigatório
- ✅ Rate limiting
- ✅ Secret management
- ✅ CSP headers

## 🧪 Testes & QA

### Testes Automatizados
```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# RLS tests (segurança)
npm run test:rls
```

### Checklist de QA
- [ ] Screenshot → OCR → Parser → Suggestions (flow completo)
- [ ] Confidence < 0.8 → Confirmation dialog
- [ ] Voice Notes → Transcription → TTS
- [ ] Anti-Catfish → pHash → Risk score
- [ ] Privacy Center → Export/Delete → Logs
- [ ] IAP → Receipt validation → Subscription sync
- [ ] Timing Rules → BR timezone → Smart suggestions

## 🚀 Deploy & CI/CD

### Produção
```bash
# Deploy automático via GitHub Actions
git push origin main

# Ou deploy manual
npm run build
# Deploy para seu provedor preferido
```

### Environment Variables
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# APIs
OPENAI_API_KEY=your_openai_key
HUGGING_FACE_ACCESS_TOKEN=your_hf_token (opcional)

# Mobile (EAS)
EAS_PROJECT_ID=your_eas_project_id
```

## 📊 Analytics & Monitoramento

### Métricas Importantes
- Latência de sugestões
- Taxa de aceitação de sugestões
- Confidence scores médios
- Conversions por plano
- Churn rate
- NPS scores

### Logs de Debug
```bash
# Ver logs das Edge Functions
supabase functions logs ocr-parse
supabase functions logs suggest-replies
```

## 🤝 Contribuição

### Desenvolvimento
1. Fork do projeto
2. Feature branch (`git checkout -b feature/nova-feature`)
3. Commit changes (`git commit -am 'Add nova feature'`)
4. Push branch (`git push origin feature/nova-feature`)
5. Pull Request

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Tests obrigatórios

## 📄 Licença

Propriedade privada. Todos os direitos reservados.

## 📞 Suporte

- **Email**: suporte@flertaai.com
- **Discord**: [FlertaAI Community](https://discord.gg/flertaai)
- **Docs**: [docs.flertaai.com](https://docs.flertaai.com)

---

**FlertaAI** - Feito com ❤️ no Brasil 🇧🇷

*Transformando conversas, respeitando sua privacidade.*