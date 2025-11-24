# polyglotter-api


## 🔧 Working with Prisma Locally (Migrate, Generate, Seed) Using SSH Tunnel

Our dev PostgreSQL database runs on a remote server and is bound to
`127.0.0.1:5432` **inside that server**, not exposed to the internet.

To run any Prisma commands locally (`migrate`, `generate`, `db seed`, etc.),
you must establish an SSH tunnel and use a local `.env` file pointing to it.

---

## 1. Create SSH Tunnel

Run the tunnel in a dedicated terminal window:

```bash
ssh -L 5433:127.0.0.1:5432 root@[serverPort]
```

## 2. To interact with Prisma locally

Run the tunnel in a dedicated terminal window:

```bash
dotenv -e docker/.env.local -- npx prisma [command]
```
