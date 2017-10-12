cd maintain_db
ssh -i "proem-key-pair.pem" ec2-user@ec2-54-191-34-79.us-west-2.compute.amazonaws.com
cd Proem/API/maintain_db
nohup application.py & 
