alter table "public"."cv" drop constraint "cv_position_id_fkey";

alter table "public"."positions" rename to "titles";

alter table "public"."titles" rename column "title" to "name";

alter table "public"."cv" rename column "position_id" to "title_id";

alter table "public"."cv" add constraint "cv_title_id_fkey" FOREIGN KEY (title_id) REFERENCES public.titles(id) not valid;

alter table "public"."cv" validate constraint "cv_title_id_fkey";

alter table "public"."titles" rename constraint "positions_pkey" to "titles_pkey";

alter table "public"."titles" drop constraint "positions_created_by_fkey";

alter table "public"."titles" add constraint "titles_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."titles" validate constraint "titles_created_by_fkey";
