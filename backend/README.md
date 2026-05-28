# Back-end

API REST do módulo de demandas operacionais de procuradoria digital.

## Stack

- Java 21
- Spring Boot 3.3.7
- Spring Web
- Spring Data JPA
- Bean Validation
- MariaDB
- Flyway
- Springdoc OpenAPI/Swagger
- JUnit, Mockito e MockMvc

## Executar localmente

Suba o banco pela raiz do projeto:

```bash
docker compose up -d db
```

Execute a API:

```bash
mvn spring-boot:run
```

URLs:

```text
API: http://localhost:8080/api
Swagger: http://localhost:8080/swagger-ui.html
```

## Variáveis de ambiente

Valores padrão usados em desenvolvimento:

```text
SPRING_DATASOURCE_URL=jdbc:mariadb://localhost:3307/attus_challenge
SPRING_DATASOURCE_USERNAME=attus
SPRING_DATASOURCE_PASSWORD=attus
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Banco de dados

O schema é controlado por Flyway:

```text
src/main/resources/db/migration/V*.sql
```

O JPA roda com:

```text
ddl-auto: validate
```

Assim, o Hibernate valida o schema existente em vez de criar tabelas automaticamente.

## Testes

Rodar testes com Maven local:

```bash
mvn test
```

Ou usando Docker pela raiz do projeto:

```bash
docker run --rm -v "${PWD}/backend:/app" -w /app maven:3.9.9-eclipse-temurin-21 mvn test
```

## Arquitetura

```text
src/main/java/.../challenge/
  config/       CORS, OpenAPI e filtro de X-Request-Id
  controller/   Endpoints REST
  dto/          Contratos de entrada e saída
  exception/    Tratamento padronizado de erros
  model/        Entidade e enums
  repository/   Spring Data JPA
  service/      Regras de negócio e logs
```

## Endpoints principais

Base URL:

```text
http://localhost:8080/api
```

```http
GET    /tickets
GET    /tickets/{id}
POST   /tickets
PUT    /tickets/{id}
PATCH  /tickets/{id}/status
DELETE /tickets/{id}
GET    /tickets/stats
```

O endpoint `GET /tickets` retorna todos os chamados quando não recebe parâmetros e também funciona como pesquisa/listagem quando os filtros opcionais são enviados:

```text
status=OPEN | IN_PROGRESS | RESOLVED | CANCELED
priority=LOW | MEDIUM | HIGH | CRITICAL
search=texto
```

## Logs e diagnóstico

Cada requisição recebe ou reutiliza um `X-Request-Id`. O valor é colocado no MDC e aparece no padrão de log:

```text
[%X{requestId:-no-request}]
```

Isso facilita correlacionar erros do front-end com eventos no back-end.
