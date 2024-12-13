mkdir datacol-ai
set -l baseUrl 'localhost:5173';
for deck in 'A1' 'A2' 'B1' 'B2' 'C1' 'C2' 'C3';
  for ai in 'cohere' 'openai' 'claude';
    set -l outfile "datacol-ai/$deck-$ai.json"
    curl -X POST $baseUrl/api/solve -H "Content-Type: application/json" -d "{\"backend\":\"$ai\",\"deckCode\":\"$deck\"}" | jq .response > $outfile
  end
end