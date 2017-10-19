# cd /home/ec2-user/Proem/API/data_csv
cd data_csv
./new_csv.sh
# cd /home/ec2-user/Proem/API/
cd -
python maintain_db.py
