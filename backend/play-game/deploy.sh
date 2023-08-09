rm -rf layer

mkdir layer

URL=$(aws lambda get-layer-version --layer-name firestoredb --version-number 1 --query Content.Location --output text)

curl $URL -o layer.zip

unzip layer.zip -d ./layer

rm layer.zip

docker build -t play-game .

docker tag play-game 848102883742.dkr.ecr.us-east-1.amazonaws.com/trivia-titans-play-game-repo:latest

docker push 848102883742.dkr.ecr.us-east-1.amazonaws.com/trivia-titans-play-game-repo:latest

aws lambda update-function-code --function-name playGame --image-uri 848102883742.dkr.ecr.us-east-1.amazonaws.com/trivia-titans-play-game-repo:latest > /dev/null

docker image prune -a --force