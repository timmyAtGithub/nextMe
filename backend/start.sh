TOKEN=$(grep ^TOKEN .env | cut -d '=' -f2)

if [ -z "$TOKEN" ]; then
  echo "Fehler: TOKEN ist nicht in der .env-Datei definiert."
  exit 1
fi

node server.js &

ngrok http 5000 --authtoken="$TOKEN" --region=eu --url=largely-quick-dove.ngrok-free.app
