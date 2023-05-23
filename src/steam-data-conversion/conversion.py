import csv
import json

csvfile = open('./steam-data.csv', 'r',encoding="utf_8")
reader = csv.reader(csvfile)

local_db = []

for row in reader:
    print(row)
    res = {}
    res['temperature'] = row[0]
    res['pressure'] = row[1]
    res['density'] = row[2]
    res['Hf'] = row[3]
    res['Hfg'] = row[4]
    res['Hg'] = row[5]
    local_db.append(res)

print(local_db)
info_json=json.dumps(local_db)
#显示数据类型
f=open('steam-data.json','w')
f.write(info_json)