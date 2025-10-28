backend
├── node_modules/
├── .env # 환경 변수 (PostgreSQL 연결 정보, AI API 키)
├── package.json
├── server.js
├── src/
│ ├── config/ # DB 연결 초기화 설정 (Sequelize 인스턴스)
│ ├── middleware/
│ ├── routes/ # Router 계층
│ ├── controllers/ # Controller 계층
│ ├── services/ # Service 계층
│ └── repositories/ # Repository 계층 (DB 로직)
└── db/ # Sequelize CLI 관련 폴더
├── migrations/ # DB 스키마 변경 이력 관리
└── models/ # DB 테이블 모델 정의
