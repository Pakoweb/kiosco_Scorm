

DROP DATABASE IF EXISTS plataforma_scorm;
CREATE DATABASE plataforma_scorm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plataforma_scorm;

-- ============================================================
--   TABLA: CENTRO
-- ============================================================
CREATE TABLE CENTRO (
    id_centro      INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    direccion      VARCHAR(200),
    telefono       VARCHAR(30),
    email          VARCHAR(120)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--   TABLA: ADMIN
--   Relación 1:1 con CENTRO → ADMIN contiene FK a CENTRO
-- ============================================================
CREATE TABLE ADMIN (
    id_admin       INT AUTO_INCREMENT PRIMARY KEY,
    id_centro      INT NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(120) NOT NULL,
    telefono       VARCHAR(30),
    
    CONSTRAINT fk_admin_centro
        FOREIGN KEY (id_centro)
        REFERENCES CENTRO(id_centro)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--   TABLA: ALUMNO
--   Relación N:1 → ALUMNO pertenece a un CENTRO
-- ============================================================
CREATE TABLE ALUMNO (
    id_alumno      INT AUTO_INCREMENT PRIMARY KEY,
    id_centro      INT NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(120) NOT NULL,
    telefono       VARCHAR(30),

    CONSTRAINT fk_alumno_centro
        FOREIGN KEY (id_centro)
        REFERENCES CENTRO(id_centro)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--   TABLA: CATEGORIA
-- ============================================================
CREATE TABLE CATEGORIA (
    id_categoria   INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    descripcion    VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--   TABLA: PAQ_SCORM
--   Relación N:1 → CATEGORIA tiene muchos PAQ_SCORM
-- ============================================================
CREATE TABLE PAQ_SCORM (
    id_paq_scorm   INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria   INT NOT NULL,
    nombre         VARCHAR(150) NOT NULL,
    version        VARCHAR(50),
    descripcion    VARCHAR(255),

    CONSTRAINT fk_scorm_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES CATEGORIA(id_categoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--   TABLA: DATOS_SCORM
--   Relación 1:1 → PAQ_SCORM - DATOS_SCORM
--   DATOS_SCORM contiene la FK
-- ============================================================
CREATE TABLE DATOS_SCORM (
    id_datos_scorm   INT AUTO_INCREMENT PRIMARY KEY,
    id_paq_scorm     INT NOT NULL,
    progreso         INT,
    score            INT,
    tiempo           VARCHAR(50),

    CONSTRAINT fk_datos_paq
        FOREIGN KEY (id_paq_scorm)
        REFERENCES PAQ_SCORM(id_paq_scorm)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--   TABLA INTERMEDIA N:M → CENTRO - CATEGORIA
--   (“tiene” en el ERD)
-- ============================================================
CREATE TABLE CENTRO_CATEGORIA (
    id_centro     INT NOT NULL,
    id_categoria  INT NOT NULL,

    PRIMARY KEY (id_centro, id_categoria),

    CONSTRAINT fk_cc_centro
        FOREIGN KEY (id_centro)
        REFERENCES CENTRO(id_centro)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cc_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES CATEGORIA(id_categoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--   TABLA INTERMEDIA N:M → ALUMNO - PAQ_SCORM
--   (“tiene asignado” en el ERD)
-- ============================================================
CREATE TABLE ALUMNO_PAQ_SCORM (
    id_alumno     INT NOT NULL,
    id_paq_scorm  INT NOT NULL,

    PRIMARY KEY (id_alumno, id_paq_scorm),

    CONSTRAINT fk_ap_alumno
        FOREIGN KEY (id_alumno)
        REFERENCES ALUMNO(id_alumno)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_ap_scorm
        FOREIGN KEY (id_paq_scorm)
        REFERENCES PAQ_SCORM(id_paq_scorm)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

