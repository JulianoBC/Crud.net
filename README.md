# TaskManager

## Configuração Local do Projeto

Para configurar o projeto TaskManager localmente, siga os passos abaixo:

### Pré-requisitos

*   **[.NET SDK](https://dotnet.microsoft.com/download):** Certifique-se de ter o .NET SDK instalado na sua máquina. O projeto foi desenvolvido com .NET 8.0.
*   **[Node.js e npm](https://nodejs.org/):** Necessário para rodar o frontend em React.

### Passos para Configuração

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/JulianoBC/Crud.net
    cd TaskManager
    ```

2.  **Restaure as dependências do backend:**
    Navegue até a pasta `TaskManager` (backend) e execute:
    ```bash
    dotnet restore
    ```

3.  **Restaure as dependências do frontend:**
    Navegue até a pasta `task-frontend` (frontend) e execute:
    ```bash
    npm install
    npm run build
    ```

4.  **Configuração do Banco de Dados:**
    Este projeto utiliza o Entity Framework Core com um banco de dados em memória para desenvolvimento. A configuração do banco de dados pode ser encontrada no arquivo `appsettings.json` ou `appsettings.Development.json`. Para utilizar um banco de dados diferente (ex: SQL Server, PostgreSQL), você precisará:
    *   Alterar a string de conexão nos arquivos de configuração (`appsettings.json`).
    *   Instalar o provider de banco de dados adequado via NuGet (ex: `Microsoft.EntityFrameworkCore.SqlServer` para SQL Server).
    *   Executar as migrations para criar o banco de dados:
        ```bash
        dotnet ef database update --project TaskManager
        ```

    #### Configurando para SQL Server
    1.  **Instale o provider do SQL Server:**
        ```bash
        dotnet add package Microsoft.EntityFrameworkCore.SqlServer --project TaskManager
        ```
    2.  **Altere a string de conexão em `appsettings.json` ou `appsettings.Development.json`:**
        ```json
        "ConnectionStrings": {
          "DefaultConnection": "Server=.\\SQLEXPRESS;Database=TaskManagerDB;Trusted_Connection=True;MultipleActiveResultSets=true"
        }
        ```
        *Substitua `.\\SQLEXPRESS;Database=TaskManagerDB` pela sua configuração do SQL Server.*

    #### Configurando para PostgreSQL
    1.  **Instale o provider do PostgreSQL:**
        ```bash
        dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --project TaskManager
        ```

## Comandos para Rodar a Aplicação

### Backend (API)

1.  Navegue até a pasta `TaskManager`:
    ```bash
    cd TaskManager
    ```

2.  Execute a aplicação:
    ```bash
    dotnet run
    ```
    A API estará disponível em `http://localhost:[porta]`, a porta exata será exibida no console ao iniciar a aplicação.

### Frontend (React)

1.  Navegue até a pasta `task-frontend`:
    ```bash
    cd task-frontend
    ```

2.  Execute o frontend:
    ```bash
    npm start
    ```
    O frontend estará disponível em `http://localhost:3000` (por padrão).

## Endpoints da API

A API do TaskManager está disponível no endpoint base `/api/tasks`.

Os seguintes endpoints estão disponíveis:

*   `GET /api/tasks`: Retorna todas as tarefas.
*   `GET /api/tasks/{id}`: Retorna uma tarefa específica por ID.
*   `POST /api/tasks`: Cria uma nova tarefa.
*   `PUT /api/tasks/{id}`: Atualiza uma tarefa existente.
*   `DELETE /api/tasks/{id}`: Deleta uma tarefa.

## Comandos para Rodar Testes

### Backend (Testes Unitários)

1.  Navegue até a pasta `TaskManager.Tests`:
    ```bash
    cd TaskManager.Tests
    ```

2.  Execute os testes:
    ```bash
    dotnet test
    ```
    Os resultados dos testes serão exibidos no console.

## Informações sobre o Banco de Dados

*   **Tipo:** Banco de dados em memória (padrão para desenvolvimento).
*   **Provider:** Entity Framework Core In-Memory Provider.
*   **Configuração:** Arquivos `appsettings.json` e `appsettings.Development.json` na pasta `TaskManager`.

Para mais informações sobre como configurar um banco de dados diferente, consulte a documentação do Entity Framework Core.

## Troubleshooting

### Erros ao restaurar dependências (dotnet restore ou npm install)

*   Certifique-se de ter as versões corretas do .NET SDK e Node.js/npm instaladas conforme os [pré-requisitos](#pré-requisitos).

### Frontend não conecta com o Backend

*   Verifique se ambos (frontend e backend) estão rodando nas portas esperadas.
*   Se o backend estiver rodando em uma porta diferente, atualize a configuração da URL da API no frontend (`task-frontend/src/config.js` ou similar).
*   Verifique se o CORS está configurado corretamente no backend para permitir requisições do frontend (se aplicável, para desenvolvimento geralmente não é necessário configurar CORS explicitamente).

### Erros de conexão com o banco de dados
*   Verifique a string de conexão nos arquivos `appsettings.json` e se o servidor de banco de dados (SQL Server, PostgreSQL, etc.) está rodando corretamente.

## Estrutura do Projeto

O projeto TaskManager possui a seguinte estrutura de pastas:

*   **`TaskManager/`**: Pasta principal do projeto backend (API) em .NET.
    *   `Controllers/`: Contém os controllers da API (ex: `TasksController.cs`).
    *   `Application/`: Camada de aplicação, contendo a lógica de negócio e serviços (ex: `Services/TaskService.cs`, `Interfaces/ITaskService.cs`).
    *   `Domain/`: Camada de domínio, contendo as entidades de negócio (ex: `Entities/TaskItem.cs`).
    *   `Infrastructure/`: Camada de infraestrutura, contendo a implementação de acesso a dados (ex: `Data/ContextDb.cs`, `Repositories/TaskRepository.cs`, `Interfaces/ITaskRepository.cs`).
    *   `Migrations/`: Contém os arquivos de migration do Entity Framework Core.
    *   `Program.cs`: Ponto de entrada da aplicação backend.
*   **`task-frontend/`**: Pasta do projeto frontend em React.
*   **`TaskManager.Tests/`**: Pasta do projeto de testes unitários para o backend.
