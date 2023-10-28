#!/bin/bash

psql -h yahor-hlushak-rds.cithjq6js4st.us-east-2.rds.amazonaws.com -U postgres -W -d images -c "CREATE TABLE IF NOT EXISTS images (id serial not null CONSTRAINT images_pkey PRIMARY KEY, name varchar(255) not null, extension varchar(255) not null, \"filePath\" varchar(255) not null, \"contentType\" varchar(255) not null, size int not null, \"createdAt\" timestamp with time zone not null, \"updatedAt\" timestamp with time zone not null);"
