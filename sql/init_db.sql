create table if not exists images
(
    id serial not null
    constraint images_pkey
    primary key,
    name varchar(255) not null,
    extension varchar(255) not null,
    "filePath" varchar(255) not null,
    "contentType" varchar(255) not null,
    size int not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);
