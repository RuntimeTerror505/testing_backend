LOAD DATA INFILE '/Users/user/Desktop/test_app/test-app/src/csv/owners.csv'
INTO TABLE owners
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE '/Users/user/Desktop/test_app/test-app/src/csv/campaigns.csv'
INTO TABLE campaigns
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;