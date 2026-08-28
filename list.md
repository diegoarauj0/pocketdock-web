Sim. Como o PocketDock já tem a parte de autenticação (`users`, `sessions`, `accounts`, `email_verifications`), eu estruturaria a implementação em **camadas**, deixando a criação/gerenciamento das instâncias para depois.

A ideia é primeiro fazer o servidor conseguir **gerenciar a própria infraestrutura Docker de forma segura e idempotente**.

## 1. Infraestrutura Docker

* [ ] Criar `DockerModule`
* [ ] Criar `DockerService` para encapsular a conexão com o Docker Engine
* [ ] Configurar conexão com Docker via socket/host
* [ ] Implementar verificação de conectividade com o Docker
* [ ] Criar `DockerImageService`
* [ ] Criar `DockerContainerService`
* [ ] Criar `DockerVolumeService`
* [ ] Criar abstrações de tipos/DTOs necessárias para os serviços
* [ ] Padronizar tratamento de erros vindos do Docker
* [ ] Garantir que os serviços não exponham diretamente o client do Dockerode para os módulos de negócio

---

## 2. Identidade das imagens do PocketDock

Definir uma convenção antes de começar a criar imagens.

* [ ] Definir namespace das imagens

  * `pocketdock/pocketbase`
* [ ] Definir estratégia de versionamento

  * `pocketdock/pocketbase:0.30.4`
* [ ] Definir labels de ownership

  * `com.pocketdock.managed=true`
  * `com.pocketdock.type=pocketbase`
  * `com.pocketdock.version=0.30.4`
* [ ] Definir constantes para nomes e labels
* [ ] Criar função para gerar o nome/tag da imagem
* [ ] Criar função para gerar as labels
* [ ] Criar mecanismo para identificar imagens pertencentes ao PocketDock
* [ ] Criar mecanismo para diferenciar imagens externas das imagens gerenciadas pelo PocketDock

---

## 3. Dockerfile do PocketBase

Organizar o artefato necessário para construir a imagem.

```text
docker/
└── pocketbase/
    └── Dockerfile
```

* [ ] Criar Dockerfile do PocketBase
* [ ] Definir versão do PocketBase utilizada
* [ ] Definir imagem base
* [ ] Configurar diretório de trabalho
* [ ] Configurar porta do PocketBase
* [ ] Configurar `CMD`/`ENTRYPOINT`
* [ ] Testar execução da imagem manualmente
* [ ] Definir uma versão inicial do runtime
* [ ] Documentar como atualizar a versão do PocketBase

---

## 4. Docker Image Service

Implementar operações de baixo nível relacionadas a imagens.

* [ ] `exists(image)`
* [ ] `inspect(image)`
* [ ] `build(...)`
* [ ] `remove(image)`
* [ ] `list(...)`
* [ ] Identificar imagens através das labels
* [ ] Capturar logs/progresso do build
* [ ] Tratar `image not found`
* [ ] Garantir que operações sejam idempotentes
* [ ] Impedir remoção de imagens que não pertencem ao PocketDock

---

## 5. Provisionamento da infraestrutura

Criar um serviço responsável por garantir que o host esteja preparado.

```text
DockerProvisioner
```

* [ ] Criar `DockerProvisionerService`
* [ ] Verificar se Docker está acessível
* [ ] Verificar se imagem do PocketBase existe
* [ ] Se não existir, fazer build automaticamente
* [ ] Se existir, não reconstruir desnecessariamente
* [ ] Validar que a imagem criada possui as labels esperadas
* [ ] Validar que a imagem pode ser inspecionada após o build
* [ ] Tornar o provisioning idempotente
* [ ] Definir comportamento quando o build falhar
* [ ] Definir comportamento quando o Docker estiver indisponível

---

## 6. Provisionamento durante o startup

Integrar o provisioner ao NestJS.

```text
NestJS
  ↓
DockerProvisioner
  ↓
Docker disponível?
  ↓
PocketBase image disponível?
  ↓
Application ready
```

* [ ] Executar provisioning durante o bootstrap
* [ ] Não iniciar o servidor HTTP antes do provisioning obrigatório terminar
* [ ] Exibir logs claros durante o provisioning
* [ ] Não reconstruir imagens existentes
* [ ] Fazer o processo retornar erro caso uma dependência obrigatória não possa ser preparada
* [ ] Testar primeiro boot em máquina sem nenhuma imagem
* [ ] Testar segundo boot com imagem já existente
* [ ] Testar boot após remoção manual da imagem

---

# 7. Docker Container Service

Depois que as imagens estiverem funcionando, implementar a abstração de containers.

* [ ] `create()`
* [ ] `start()`
* [ ] `stop()`
* [ ] `restart()`
* [ ] `remove()`
* [ ] `inspect()`
* [ ] `exists()`
* [ ] `logs()`
* [ ] Identificação através de labels
* [ ] Padronizar nomes dos containers
* [ ] Padronizar labels dos containers

Por exemplo:

```text
pocketdock-instance-{instanceId}
```

com:

```text
com.pocketdock.managed=true
com.pocketdock.type=pocketbase
com.pocketdock.instance-id={instanceId}
```

---

# 8. Docker Volume Service

Ainda sem criar a entidade de instância, preparar a infraestrutura.

* [ ] Criar `DockerVolumeService`
* [ ] `create()`
* [ ] `exists()`
* [ ] `inspect()`
* [ ] `remove()`
* [ ] Definir padrão de nomes
* [ ] Adicionar labels de ownership
* [ ] Impedir remoção de volumes externos
* [ ] Definir estrutura de armazenamento do PocketBase

Por exemplo:

```text
pocketdock-instance-{instanceId}
```

---

# 9. Preparar o modelo de Instance

**Só depois da infraestrutura Docker estar funcionando**, eu criaria a parte de negócio.

Uma tabela inicial poderia ter algo conceitualmente parecido com:

```text
instances
├── id
├── user_id
├── status
├── image
├── container_id
├── volume_id
├── created_at
└── updated_at
```

Tarefas:

* [ ] Criar entidade `Instance`
* [ ] Criar migration
* [ ] Criar relação `User -> Instances`
* [ ] Definir estados da instância
* [ ] Definir ownership da instância
* [ ] Criar repository
* [ ] Criar service

---

# 10. Instance Provisioning

Aqui começa a integração de tudo.

```text
User
 ↓
Instance
 ↓
Image
 ↓
Volume
 ↓
Container
```

* [ ] Criar instância no banco
* [ ] Criar volume
* [ ] Garantir imagem
* [ ] Criar container
* [ ] Configurar volume
* [ ] Configurar environment
* [ ] Configurar labels
* [ ] Iniciar container
* [ ] Verificar se container iniciou corretamente
* [ ] Atualizar status para `RUNNING`
* [ ] Tratar falhas intermediárias
* [ ] Implementar rollback/cleanup

---

# 11. Reconciliação Docker ↔ Database

Eu colocaria isso como uma tarefa importante antes de considerar o sistema pronto.

* [ ] Criar `DockerReconciliationService`
* [ ] Detectar instâncias no banco sem container
* [ ] Detectar containers PocketDock sem instância correspondente
* [ ] Detectar volumes órfãos
* [ ] Detectar imagens gerenciadas pelo PocketDock
* [ ] Nunca modificar/remover recursos sem `com.pocketdock.managed=true`
* [ ] Definir política para recursos órfãos
* [ ] Executar reconciliação no startup
* [ ] Futuramente executar reconciliação periodicamente

---

# 12. Testes

### DockerService

* [ ] Docker disponível
* [ ] Docker indisponível
* [ ] Imagem existente
* [ ] Imagem inexistente
* [ ] Container existente
* [ ] Container inexistente
* [ ] Erros da API Docker

### Provisioner

* [ ] Primeiro startup
* [ ] Startup subsequente
* [ ] Build com sucesso
* [ ] Build falhando
* [ ] Docker indisponível
* [ ] Imagem corrompida/inválida
* [ ] Imagem externa com nome parecido

### Ownership

* [ ] Não remover imagem externa
* [ ] Não remover container externo
* [ ] Não remover volume externo
* [ ] Encontrar somente recursos com label do PocketDock

---

## Ordem que eu seguiria

Para não criar complexidade desnecessária agora:

```text
1. DockerModule
       ↓
2. DockerService
       ↓
3. DockerImageService
       ↓
4. Dockerfile PocketBase
       ↓
5. DockerProvisioner
       ↓
6. Provisioning no startup
       ↓
7. DockerContainerService
       ↓
8. DockerVolumeService
       ↓
9. Instance entity
       ↓
10. Instance provisioning
       ↓
11. Traefik
       ↓
12. Reconciliation
```

E **não colocaria BullMQ nessa primeira etapa**. O provisioning da imagem é uma operação de inicialização: se o PocketDock precisa da imagem para funcionar, faz sentido garantir isso no próprio startup. O BullMQ começa a fazer mais sentido quando você passar a ter operações de usuário potencialmente demoradas, como **criar, atualizar, reiniciar, migrar ou remover instâncias**.

Também manteria `DockerModule` dentro de `infrastructure`, porque Docker é uma dependência de infraestrutura do PocketDock, enquanto `Instance` pertence ao domínio da aplicação.
