brew install rabbitmq
sudo pip install requirements
cd proem_api
brew services stop rabbitmq
brew services start rabbitmq
celery -A update worker -B -l info
