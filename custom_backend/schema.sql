--
-- PostgreSQL database dump
--

\restrict zDz40Ah9oHTvOilnmNn86eM29pXLhHokYqIcxqjgGRb3Hn8eHQuQpcEJ1evzAgK

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.files DROP CONSTRAINT IF EXISTS fk_user_id_for_file;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_user_email_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.files DROP CONSTRAINT IF EXISTS files_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.files;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    file_id integer NOT NULL,
    user_id integer NOT NULL,
    file_name character varying(100) NOT NULL,
    mime_type character varying(100) NOT NULL,
    sizebytes integer,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    file_path text DEFAULT 'Temporary'::text NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: files_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.files ALTER COLUMN file_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.files_file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_email character varying(100) NOT NULL,
    password_hash character varying(250) NOT NULL,
    fullname character varying(50),
    displayname character varying(50),
    bio text,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(10) DEFAULT 'user'::character varying,
    failed_login_attempts integer DEFAULT 0,
    locked_until timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (file_id, user_id, file_name, mime_type, sizebytes, uploaded_at, file_path) FROM stdin;
2	1	profile_photo.jpg	image/jpeg	231044	2026-08-11 01:13:20.75813	uploads/alice/profile_photo.jpg
1	1	resume_alice.pdf	application/pdf	84213	2026-08-11 01:09:22.654631	uploads/alice/resume_alice.pdf
3	3	project_notes.txt	text/plain	5210	2026-08-11 01:14:50.266057	uploads/bob/project_notes.txt
4	3	invoice_march.pdf	application/pdf	62890	2026-08-11 01:14:50.266057	uploads/bob/invoice_march.pdf
5	4	test_plan.docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document	41200	2026-08-11 17:13:34.782174	uploads/carol/test_plan.docx
6	4	vacation.png	image/png	512300	2026-08-11 17:14:28.147345	uploads/carol/vacation.png
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, user_email, password_hash, fullname, displayname, bio, createdat, role, failed_login_attempts, locked_until) FROM stdin;
1	alice@example.com	$2b$10$QGJdHbkPEsd9Pz.oPpfJpeVi0k3twRlQrpVqdF2C.0GrdurQsUDuy	Alice Nakamura	alice	Product designer who likes clean UIs.	2026-08-11 00:48:43.253819	user	5	2026-08-12 02:41:13.250536+05:30
3	bob@example.com	$2b$10$Qi.5MXno6Su8j4Z0fPHzku0l5Lo/4Rv/6UfGV646rtWZNZjcZeUoW	Bob Alvarez	bob	Backend engineer, coffee enthusiast.	2026-08-11 01:10:24.355435	user	0	\N
4	carol@example.com	$2b$10$cr8V1s7duLueHK/1HuE21Oe2IWr0imxGbcOZF1wQVmdRwW8aA7jmy	Carol Whitfield	carol	QA lead focused on security testing.	2026-08-11 17:11:12.949641	user	0	\N
\.


--
-- Name: files_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_file_id_seq', 6, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (file_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_email_key UNIQUE (user_email);


--
-- Name: files fk_user_id_for_file; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fk_user_id_for_file FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict zDz40Ah9oHTvOilnmNn86eM29pXLhHokYqIcxqjgGRb3Hn8eHQuQpcEJ1evzAgK

