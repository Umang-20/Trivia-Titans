rm -rf layer

mkdir layer

URL=$(aws lambda get-layer-version --layer-name firestoredb --version-number 2 --query Content.Location --output text)

curl $URL -o layer.zip

unzip layer.zip -d ./layer

rm layer.zip

docker build -t browse-games .

docker tag browse-games 796352440231.dkr.ecr.us-east-1.amazonaws.com/trivia-titans-repo 

docker push 796352440231.dkr.ecr.us-east-1.amazonaws.com/trivia-titans-repo 

aws lambda update-function-code --function-name trivia-titans-browse-games --image-uri 796352440231.dkr.ecr.us-east-1.amazonaws.com/trivia-titans-repo:latest > /dev/null

docker image prune -a --force