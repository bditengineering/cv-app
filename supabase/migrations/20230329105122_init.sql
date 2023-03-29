--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA IF NOT EXISTS public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: cv_skill_null_id_is_default(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cv_skill_null_id_is_default() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.id = coalesce(NEW.id, uuid_generate_v4());
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.cv_skill_null_id_is_default() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: install_available_extensions_and_test(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.install_available_extensions_and_test() RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE extension_name TEXT;
allowed_extentions TEXT[] := string_to_array(current_setting('supautils.privileged_extensions'), ',');
BEGIN 
  FOREACH extension_name IN ARRAY allowed_extentions 
  LOOP
    SELECT trim(extension_name) INTO extension_name;
    /* skip below extensions check for now */
    CONTINUE WHEN extension_name = 'pgroonga' OR  extension_name = 'pgroonga_database' OR extension_name = 'pgsodium';
    CONTINUE WHEN extension_name = 'plpgsql' OR  extension_name = 'plpgsql_check' OR extension_name = 'pgtap';
    CONTINUE WHEN extension_name = 'supabase_vault' OR extension_name = 'wrappers';
    RAISE notice 'START TEST FOR: %', extension_name;
    EXECUTE format('DROP EXTENSION IF EXISTS %s CASCADE', quote_ident(extension_name));
    EXECUTE format('CREATE EXTENSION %s CASCADE', quote_ident(extension_name));
    RAISE notice 'END TEST FOR: %', extension_name;
  END LOOP;
    RAISE notice 'EXTENSION TESTS COMPLETED..';
    return true;
END;
$$;


ALTER FUNCTION public.install_available_extensions_and_test() OWNER TO postgres;

--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE plpgsql
    AS $$BEGIN
  return (
    select exists(
      select 1 from admins where user_id = auth.uid()
    )
  );
END;$$;


ALTER FUNCTION public.is_admin() OWNER TO postgres;

--
-- Name: items_null_id_is_default(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.items_null_id_is_default() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.id = coalesce(NEW.id, uuid_generate_v4());
  NEW.created_at = coalesce(NEW.created_at, now());
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.items_null_id_is_default() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid DEFAULT auth.uid() NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: certifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certifications (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    certificate_name text,
    description text NOT NULL,
    cv_id uuid
);


ALTER TABLE public.certifications OWNER TO postgres;

--
-- Name: TABLE certifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.certifications IS 'A collection of candidate certificates';


--
-- Name: cv; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cv (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid DEFAULT auth.uid() NOT NULL,
    summary text,
    english_spoken_level text,
    english_written_level text,
    first_name text NOT NULL,
    updated_by uuid DEFAULT auth.uid(),
    last_name text NOT NULL,
    personal_qualities text[],
    position_id uuid NOT NULL
);


ALTER TABLE public.cv OWNER TO postgres;

--
-- Name: TABLE cv; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.cv IS 'A collection of CVs';


--
-- Name: cv_skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cv_skill (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    cv_id uuid NOT NULL,
    skill_id uuid NOT NULL
);


ALTER TABLE public.cv_skill OWNER TO postgres;

--
-- Name: TABLE cv_skill; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.cv_skill IS 'A collection of skills that belong to certain CV';


--
-- Name: educations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.educations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    university_name text,
    degree text,
    cv_id uuid,
    start_year smallint,
    end_year smallint
);


ALTER TABLE public.educations OWNER TO postgres;

--
-- Name: TABLE educations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.educations IS 'A collection of candidate educations';


--
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    description text,
    field text,
    team_size smallint,
    "position" text,
    technologies text[],
    responsibilities text[],
    date_start timestamp with time zone,
    date_end timestamp with time zone,
    ongoing boolean DEFAULT false NOT NULL,
    cv_id uuid,
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: TABLE projects; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.projects IS 'A collection of projects';


--
-- Name: skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    skill_group_id uuid NOT NULL
);


ALTER TABLE public.skill OWNER TO postgres;

--
-- Name: TABLE skill; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.skill IS 'A collection of skills';


--
-- Name: skill_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_group (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text
);


ALTER TABLE public.skill_group OWNER TO postgres;

--
-- Name: TABLE skill_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.skill_group IS 'A group of specific skills';


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: certifications certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certificate_pkey PRIMARY KEY (id);


--
-- Name: cv cv_new_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cv
    ADD CONSTRAINT cv_new_pkey PRIMARY KEY (id);


--
-- Name: cv_skill cv_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cv_skill
    ADD CONSTRAINT cv_skill_pkey PRIMARY KEY (id);


--
-- Name: educations education_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT education_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: projects project_new_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT project_new_pkey PRIMARY KEY (id);


--
-- Name: skill_group skill_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_group
    ADD CONSTRAINT skill_group_pkey PRIMARY KEY (id);


--
-- Name: skill skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: certifications items_null_id_is_default_certifications; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER items_null_id_is_default_certifications BEFORE INSERT ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.items_null_id_is_default();


--
-- Name: cv_skill items_null_id_is_default_cv_skill; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER items_null_id_is_default_cv_skill BEFORE INSERT ON public.cv_skill FOR EACH ROW EXECUTE FUNCTION public.cv_skill_null_id_is_default();


--
-- Name: educations items_null_id_is_default_educations; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER items_null_id_is_default_educations BEFORE INSERT ON public.educations FOR EACH ROW EXECUTE FUNCTION public.items_null_id_is_default();


--
-- Name: projects items_null_id_is_default_projects; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER items_null_id_is_default_projects BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION public.items_null_id_is_default();


--
-- Name: admins admins_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: certifications certifications_cv_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_cv_id_fkey FOREIGN KEY (cv_id) REFERENCES public.cv(id);


--
-- Name: cv cv_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cv
    ADD CONSTRAINT cv_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: cv cv_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cv
    ADD CONSTRAINT cv_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id);


--
-- Name: cv_skill cv_skill_cv_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cv_skill
    ADD CONSTRAINT cv_skill_cv_id_fkey FOREIGN KEY (cv_id) REFERENCES public.cv(id);


--
-- Name: cv_skill cv_skill_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cv_skill
    ADD CONSTRAINT cv_skill_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skill(id);


--
-- Name: cv cv_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cv
    ADD CONSTRAINT cv_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: educations educations_cv_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_cv_id_fkey FOREIGN KEY (cv_id) REFERENCES public.cv(id);


--
-- Name: positions positions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: projects projects_cv_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_cv_id_fkey FOREIGN KEY (cv_id) REFERENCES public.cv(id);


--
-- Name: skill skill_skill_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_skill_group_id_fkey FOREIGN KEY (skill_group_id) REFERENCES public.skill_group(id);


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- Name: certifications Enable delete for users based on uuid; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for users based on uuid" ON public.certifications FOR DELETE TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = certifications.cv_id)))));


--
-- Name: educations Enable delete for users based on uuid; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for users based on uuid" ON public.educations FOR DELETE TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = educations.cv_id)))));


--
-- Name: projects Enable delete for users based on uuid; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for users based on uuid" ON public.projects FOR DELETE TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = projects.cv_id)))));


--
-- Name: certifications Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.certifications FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: cv Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.cv FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: educations Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.educations FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: projects Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: admins Enable read access for admin users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for admin users" ON public.admins FOR SELECT TO authenticated USING ((created_by = auth.uid()));


--
-- Name: cv Enable read access for user uploaded CVs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for user uploaded CVs" ON public.cv FOR SELECT TO authenticated USING ((public.is_admin() OR (created_by = auth.uid())));


--
-- Name: certifications Enable read access for user uploaded Certificates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for user uploaded Certificates" ON public.certifications FOR SELECT TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = certifications.cv_id)))));


--
-- Name: educations Enable read access for user uploaded Certificates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for user uploaded Certificates" ON public.educations FOR SELECT TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = educations.cv_id)))));


--
-- Name: projects Enable read access for user uploaded Certificates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for user uploaded Certificates" ON public.projects FOR SELECT TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = projects.cv_id)))));


--
-- Name: certifications Enable update for users based on uuid; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on uuid" ON public.certifications FOR UPDATE TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = certifications.cv_id))))) WITH CHECK ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = certifications.cv_id)))));


--
-- Name: cv Enable update for users based on uuid; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on uuid" ON public.cv FOR UPDATE TO authenticated USING ((public.is_admin() OR (created_by = auth.uid()))) WITH CHECK ((public.is_admin() OR (created_by = auth.uid())));


--
-- Name: educations Enable update for users based on uuid; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on uuid" ON public.educations FOR UPDATE TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = educations.cv_id))))) WITH CHECK ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = educations.cv_id)))));


--
-- Name: projects Enable update for users based on uuid; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on uuid" ON public.projects FOR UPDATE TO authenticated USING ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = projects.cv_id))))) WITH CHECK ((public.is_admin() OR (auth.uid() IN ( SELECT c.created_by
   FROM public.cv c
  WHERE (c.id = projects.cv_id)))));


--
-- Name: certifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: cv; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.cv ENABLE ROW LEVEL SECURITY;

--
-- Name: educations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;

--
-- Name: projects; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION cv_skill_null_id_is_default(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cv_skill_null_id_is_default() TO anon;
GRANT ALL ON FUNCTION public.cv_skill_null_id_is_default() TO authenticated;
GRANT ALL ON FUNCTION public.cv_skill_null_id_is_default() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION install_available_extensions_and_test(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.install_available_extensions_and_test() TO anon;
GRANT ALL ON FUNCTION public.install_available_extensions_and_test() TO authenticated;
GRANT ALL ON FUNCTION public.install_available_extensions_and_test() TO service_role;


--
-- Name: FUNCTION is_admin(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_admin() TO anon;
GRANT ALL ON FUNCTION public.is_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_admin() TO service_role;


--
-- Name: FUNCTION items_null_id_is_default(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.items_null_id_is_default() TO anon;
GRANT ALL ON FUNCTION public.items_null_id_is_default() TO authenticated;
GRANT ALL ON FUNCTION public.items_null_id_is_default() TO service_role;


--
-- Name: TABLE admins; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admins TO anon;
GRANT ALL ON TABLE public.admins TO authenticated;
GRANT ALL ON TABLE public.admins TO service_role;


--
-- Name: TABLE certifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.certifications TO anon;
GRANT ALL ON TABLE public.certifications TO authenticated;
GRANT ALL ON TABLE public.certifications TO service_role;


--
-- Name: TABLE cv; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cv TO anon;
GRANT ALL ON TABLE public.cv TO authenticated;
GRANT ALL ON TABLE public.cv TO service_role;


--
-- Name: TABLE cv_skill; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cv_skill TO anon;
GRANT ALL ON TABLE public.cv_skill TO authenticated;
GRANT ALL ON TABLE public.cv_skill TO service_role;


--
-- Name: TABLE educations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.educations TO anon;
GRANT ALL ON TABLE public.educations TO authenticated;
GRANT ALL ON TABLE public.educations TO service_role;


--
-- Name: TABLE positions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.positions TO anon;
GRANT ALL ON TABLE public.positions TO authenticated;
GRANT ALL ON TABLE public.positions TO service_role;


--
-- Name: TABLE projects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.projects TO anon;
GRANT ALL ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.projects TO service_role;


--
-- Name: TABLE skill; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.skill TO anon;
GRANT ALL ON TABLE public.skill TO authenticated;
GRANT ALL ON TABLE public.skill TO service_role;


--
-- Name: TABLE skill_group; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.skill_group TO anon;
GRANT ALL ON TABLE public.skill_group TO authenticated;
GRANT ALL ON TABLE public.skill_group TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- PostgreSQL database dump complete
--

