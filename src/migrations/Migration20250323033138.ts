import { Migration } from '@mikro-orm/migrations';

export class Migration20250323033138 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "permission" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(100) not null, "description" varchar(200) null, constraint "permission_pkey" primary key ("id"));`);
    this.addSql(`alter table "permission" add constraint "permission_name_unique" unique ("name");`);

    this.addSql(`create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(20) not null, "last_name" varchar(20) not null, "username" varchar(20) not null, "email" varchar(50) not null, "password" text not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "folder" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(100) not null, "owner_id" uuid not null, "parent_folder_id" uuid null, constraint "folder_pkey" primary key ("id"));`);

    this.addSql(`create table "folder_permission" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "folder_id" uuid not null, "user_id" uuid not null, "permission_id" uuid not null, constraint "folder_permission_pkey" primary key ("id"));`);

    this.addSql(`create table "file" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(100) not null, "folder_id" uuid not null, constraint "file_pkey" primary key ("id"));`);

    this.addSql(`create table "file_permission" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "file_id" uuid not null, "user_id" uuid not null, "permission_id" uuid not null, constraint "file_permission_pkey" primary key ("id"));`);

    this.addSql(`alter table "folder" add constraint "folder_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "folder" add constraint "folder_parent_folder_id_foreign" foreign key ("parent_folder_id") references "folder" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "folder_permission" add constraint "folder_permission_folder_id_foreign" foreign key ("folder_id") references "folder" ("id") on update cascade;`);
    this.addSql(`alter table "folder_permission" add constraint "folder_permission_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "folder_permission" add constraint "folder_permission_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade;`);

    this.addSql(`alter table "file" add constraint "file_folder_id_foreign" foreign key ("folder_id") references "folder" ("id") on update cascade;`);

    this.addSql(`alter table "file_permission" add constraint "file_permission_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade;`);
    this.addSql(`alter table "file_permission" add constraint "file_permission_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "file_permission" add constraint "file_permission_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "folder_permission" drop constraint "folder_permission_permission_id_foreign";`);

    this.addSql(`alter table "file_permission" drop constraint "file_permission_permission_id_foreign";`);

    this.addSql(`alter table "folder" drop constraint "folder_owner_id_foreign";`);

    this.addSql(`alter table "folder_permission" drop constraint "folder_permission_user_id_foreign";`);

    this.addSql(`alter table "file_permission" drop constraint "file_permission_user_id_foreign";`);

    this.addSql(`alter table "folder" drop constraint "folder_parent_folder_id_foreign";`);

    this.addSql(`alter table "folder_permission" drop constraint "folder_permission_folder_id_foreign";`);

    this.addSql(`alter table "file" drop constraint "file_folder_id_foreign";`);

    this.addSql(`alter table "file_permission" drop constraint "file_permission_file_id_foreign";`);

    this.addSql(`drop table if exists "permission" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "folder" cascade;`);

    this.addSql(`drop table if exists "folder_permission" cascade;`);

    this.addSql(`drop table if exists "file" cascade;`);

    this.addSql(`drop table if exists "file_permission" cascade;`);
  }

}
