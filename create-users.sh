#!/bin/bash

declare -a users=("Christian Lisangola" "John Doe Marcos")

for user in "${users[@]}"
do
  curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"'"$user"'"}'
  echo "Created user: $user"
done
