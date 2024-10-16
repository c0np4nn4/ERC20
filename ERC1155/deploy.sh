# Set Environment Variables from .env file
while read line;
do
    export $line
done < .env

forge script script/Deploy.s.sol:DeployScript \
  --fork-url http://localhost:8545 \
  --private-key $PRIV_KEY \
  --broadcast
