# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


#extracts data from our RDS database
class History(models.Model):
    date = models.TextField(blank=True, null=False, primary_key=True)
    high = models.TextField(blank=True, null=True)
    low = models.TextField(blank=True, null=True)
    mid = models.TextField(blank=True, null=True)
    last = models.TextField(blank=True, null=True)
    bid = models.TextField(blank=True, null=True)
    ask = models.TextField(blank=True, null=True)
    volume = models.TextField(blank=True, null=True)
    coin = models.TextField(blank=True, null=True)
    fiat = models.TextField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'alldata'
