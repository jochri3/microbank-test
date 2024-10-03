## Lancer Docker
```bash
docker-compose up -d
```

# Créer la première migration
```bash
npx knex migrate:make create_bank_accounts
```

# Executer la première
```bash
npx knex migrate:latest --knexfile=./knexfile.js
```