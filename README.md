# Agente de Estudos CMC 2026 (Vercel + Neon Postgres + Gemini API)

Agente inteligente para o concurso da **Câmara Municipal de Cuiabá-MT (Edital nº 001/2026-CMC)** — **Analista Legislativo TI** (Manhã) e **Técnico Legislativo** (Tarde), prova em **20/12/2026**.

## Arquitetura Gratuita
- **Frontend & API Routes:** Next.js 15 (App Router) hospedado gratuitamente na **Vercel**.
- **Banco de Dados:** PostgreSQL gratuito no **Neon** (`@neondatabase/serverless`), com criação automática de tabelas e seed dos tópicos do edital na primeira execução.
- **Inteligência Artificial:** Gemini API no backend (`/api/chat`) com *Function Calling* que salva seu progresso, revisões espaçadas (`1→3→7→15d`), acertos e caderno de erros direto no Postgres conforme você conversa.

## Deploy na Vercel + Neon (2 minutos)
1. **Banco no Neon:** Crie um projeto gratuito em [neon.tech](https://neon.tech) e copie a **Connection String** (`postgresql://...`).
2. **Chave do Gemini:** Crie gratuitamente em [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
3. **Importar na Vercel:** Em [vercel.com/new](https://vercel.com/new), importe o repositório `aderald0/agente-estudos-cmc`.
4. **Variáveis de Ambiente na Vercel:**
   - `DATABASE_URL` = sua Connection String do Neon
   - `GEMINI_API_KEY` = sua chave do Google AI Studio
   - `GEMINI_MODEL` = `gemini-2.5-flash` *(opcional)*
   - `APP_ACCESS_PIN` = senha numérica curta *(opcional, caso queira bloquear acesso público)*
5. Clique em **Deploy**. Ao abrir a URL pela primeira vez, as tabelas e os 50+ tópicos do edital são criados automaticamente no Neon!
