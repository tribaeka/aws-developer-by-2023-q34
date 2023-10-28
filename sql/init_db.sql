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
create table if not exists notifications
(
    id serial not null
        constraint notifications_pkey
            primary key,
    email varchar(255) not null,
    subscriptionArn varchar(255) not null
);
