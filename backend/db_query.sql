SELECT * FROM "Account_Local";
SELECT * FROM "Account_Social";
SELECT * FROM "Account_User";
SELECT * FROM "Account_Verification_Token";
SELECT NOW();
/*
DROP TABLE "Account_Social";
DROP TABLE "Account_Local";
DROP TABLE "Account_Verification_Token";
DROP TABLE "Account_User";

*/
/*
-- PostgreSQL DDL SCRIPT (소셜/로컬 회원 통합 모델)

-- 1. "Account_User" 테이블: 모든 사용자 유형의 공통 정보 (Soft Delete 기준)
CREATE TABLE "Account_User" (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    profile_img_url TEXT,
    role_type VARCHAR(20) NOT NULL DEFAULT 'user',
    
    -- Soft Delete 필드
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE, 
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE "Account_User" IS '모든 사용자 유형의 공통 정보 (Soft Delete 포함)';
COMMENT ON COLUMN "Account_User".user_id IS '사용자 고유 식별자';


-- 2. "Account_Local" 테이블: 자체 (로컬) 회원가입 인증 정보
CREATE TABLE "Account_Local" (
    account_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    password VARCHAR(255) NOT NULL, -- 해시된 비밀번호
    is_verified BOOLEAN NOT NULL DEFAULT FALSE, -- 이메일 인증 완료 여부
    
    -- 외래 키: Account_User.user_id 참조 (ON DELETE RESTRICT로 Soft Delete 강제)
    CONSTRAINT fk_Account_User_local
        FOREIGN KEY (user_id)
        REFERENCES "Account_User" (user_id)
        ON DELETE RESTRICT,
        
    -- User와 1:1 관계를 보장
    CONSTRAINT uq_user_id_local
        UNIQUE (user_id) 
);

COMMENT ON TABLE "Account_Local" IS '자체 (로컬) 회원가입 사용자의 인증 정보';
COMMENT ON COLUMN "Account_Local".is_verified IS '이메일 인증 완료 여부';


-- 3. "Account_Social" 테이블: 소셜 로그인 인증 정보
CREATE TABLE "Account_Social" (
    social_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    provider_type VARCHAR(20) NOT NULL, -- 카카오, 구글 등 소셜 종류
    provider_user_id VARCHAR(100) NOT NULL, -- 소셜 서비스의 고유 유저 ID

    -- 고유 제약 조건: provider_type과 provider_user_id 쌍은 유일해야 함
    CONSTRAINT uq_provider_user
        UNIQUE (provider_type, provider_user_id),

    -- 외래 키: Account_User.user_id 참조 (ON DELETE RESTRICT로 Soft Delete 강제)
    CONSTRAINT fk_Account_User_social
        FOREIGN KEY (user_id)
        REFERENCES "Account_User" (user_id)
        ON DELETE RESTRICT
);

COMMENT ON TABLE "Account_Social" IS '소셜 로그인 사용자의 인증 정보';
COMMENT ON COLUMN "Account_Social".provider_user_id IS '소셜 서비스에서 제공하는 유저의 고유 ID';


-- 4. "Account_Verification_Token" 테이블: 이메일 인증/비밀번호 재설정용 임시 토큰
CREATE TABLE "Account_Verification_Token" (
    token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_token_Account_User
        FOREIGN KEY (user_id)
        REFERENCES "Account_User" (user_id)
        ON DELETE CASCADE,

    -- ⭐️⭐️⭐️ 이 라인을 추가해야 합니다! ⭐️⭐️⭐️
    -- 특정 사용자는 특정 타입의 토큰을 하나만 가질 수 있도록 보장
    CONSTRAINT uq_user_token_type
        UNIQUE (user_id, token_type)
);

-- 1. Account_User 테이블은 이미 존재한다고 가정하고 User_Profile_Info 테이블을 생성합니다.
--    'user_id를'는 Account_User 테이블의 PK인 user_id를 참조해야 합니다.
--    **참조 컬럼을 Account_User(user_id)로 수정했습니다.**
--    UNIQUE 제약으로 Account_User 당 하나의 프로필 레코드만 가지는 1:1 관계를 보장합니다.

CREATE TABLE "User_Profile_Info" (
    -- 기본 키 (Primary Key) 설정
    user_id BIGINT PRIMARY KEY, -- 이 컬럼은 user_id와 동일한 값을 가집니다.
    
    -- 이름 및 직장 정보
    name_ko VARCHAR(50) NOT NULL,              -- 한글 이름 (필수)
    name_ch VARCHAR(50),                       -- 한자 이름 (선택적)
    
    -- 생년월일 및 출생 시간
    birth_day DATE NOT NULL,                   -- 생년월일 (날짜 타입)
    birth_time TIME WITHOUT TIME ZONE,         -- 출생 시간 (시간 타입, 표준 시간대 제외)
    
    -- 직장 정보
    working_company VARCHAR(255),              -- 현재 직장명
    working_regno VARCHAR(20) UNIQUE,          -- 사업자번호 (고유해야 함, 선택적)
    working_years SMALLINT NOT NULL DEFAULT 0, -- 근무 년차 (작은 정수, 0년차부터 시작 가능)
    
    -- 연봉 정보 (정밀한 계산을 위해 NUMERIC 사용, 단위: 만 원)
    current_salary NUMERIC(10, 2) NOT NULL DEFAULT 0.00, 
    
    -- 시간 관리
    createAt TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- 등록 시간 (표준 시간대 포함)
    -- updateAt은 이제 트리거 없이 수동으로 관리됩니다.
    updateAt TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    
    -- 1:1 관계를 보장하기 위한 UNIQUE 제약 조건
    -- user_id가 PK이므로 사실상 중복 체크는 보장되나, 명시적으로 FK 설정
    UNIQUE (user_id),
    
    -- Account_User 테이블과의 외래 키 설정 (FK)
    -- **참조 컬럼을 Account_User 테이블의 user_id로 변경합니다.**
    -- ON DELETE CASCADE: Account_User 레코드가 삭제되면 프로필 정보도 함께 삭제
    FOREIGN KEY (user_id)
        REFERENCES "Account_User" (user_id) -- Account_User의 user_id를 참조
        ON DELETE CASCADE
);

-- 주석 추가
COMMENT ON COLUMN "User_Profile_Info".user_id IS 'Account_User 테이블의 PK인 user_id를 참조하는 외래 키 (1:1 관계)';
COMMENT ON COLUMN "User_Profile_Info".current_salary IS '현재 연봉 (단위: 만 원)';
*/