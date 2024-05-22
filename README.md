# orbit
orbit 은 space marketplace app 으로 space 에 예약메시지 기능을 추가하는 project 입니다.

## prerequisites
* node.js 18.16
* yarn

## 디렉토리 구조
* `/src/middlewares`
  * Express.js의 middleware들이 정의되어 있습니다.

* `/src/libs`
  * 외부 라이브러리 호출을 위한 모듈들이 정의되어 있습니다.
  
* `/src/models`
  * typegoose model들을 포함합니다.
  * 실제 데이터베이스에 저장되는 모델들이 정의되어 있습니다.
  
* `/src/routers`
  * Express.js의 router들이 정의되어 있습니다.

* `/src/scripts`
  * 팀 내 space application에서 코드 리뷰시에 필요한 리뷰어 자동 등록과 관련된 스크립트가 정의되어 있습니다.
  
* `/src/services`
  * 비즈니스 로직을 담당하는 서비스들이 정의되어 있습니다.

* `/src/types`
  * 타입스크립트 타입들이 정의되어 있습니다.
  
* `/src/utils`
  * 유틸리티 함수들이 정의되어 있습니다.

* `/src/messenger.ts`
  * space로 메세지를 전송하는 모듈입니다.
  
* `/src/scheduler.ts`
  * 사전에 정의된 cron expression에 따라, 서버에서 예약 메세지를 처리할 수 있도록 하는 기능이 정의된 모듈 입니다.

* `/src/api.ts`
  * Express.js의 app을 정의하고, 라우터 및 미들웨어를 등록하는 모듈입니다.
  * 서버에서 API 서버를 실행하는 역할을 합니다.

* `/src/app.ts`
  * 서버의 entry point가 되는 모듈입니다.

* `/src/metrics.ts`
  * newrelic 를 이용하여 서버의 메트릭을 수집하는 모듈입니다.


## config
실행을 위해서 .env 설정이 필요합니다.  
자세한 값들은 프로젝트 문서를 확인해주시기 바랍니다. ([문서](https://beyond-imagination.jetbrains.space/documents/R98H81SkA4o))
```shell
cp .env.template .env
```

## Getting Started

```shell
yarn install
yarn dev
```
