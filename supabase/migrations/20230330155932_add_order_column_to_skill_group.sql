alter table "public"."skill_group" add column "order" smallint unique;

create unique index skill_group_order_key ON "public"."skill_group" USING btree ("order");

alter table "public"."skill_group" add constraint "skill_group_order_key" UNIQUE using index "skill_group_order_key";
